import db from '../db/database.js';
import { computeMD5 } from './schema.js';

// In-memory cache for fast vector similarity computations
let inMemoryVectors = [];

/**
 * Creates high-dimensional semantic vector embedding using subword and character n-gram hashing
 */
export function generateEmbedding(text) {
  const DIM = 128;
  const vector = new Array(DIM).fill(0);
  if (!text) return vector;

  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(Boolean);

  // Unigrams and Bigrams
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let hash1 = 0;
    for (let j = 0; j < token.length; j++) {
      hash1 = (hash1 * 31 + token.charCodeAt(j)) % DIM;
    }
    vector[hash1] += 1.0;

    if (i < tokens.length - 1) {
      const bigram = token + '_' + tokens[i + 1];
      let hash2 = 0;
      for (let j = 0; j < bigram.length; j++) {
        hash2 = (hash2 * 37 + bigram.charCodeAt(j)) % DIM;
      }
      vector[hash2] += 1.5;
    }
  }

  // L2 normalization
  let norm = 0;
  for (let i = 0; i < DIM; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < DIM; i++) vector[i] /= norm;
  }

  return vector;
}

/**
 * Cosine similarity between two vectors
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}

/**
 * Initializes SQLite RAG Schema
 */
export function initRagStore() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS rag_documents (
        id TEXT PRIMARY KEY,
        content TEXT,
        metadata TEXT,
        embedding TEXT,
        file_hash TEXT,
        updated_at TEXT
      )`, (err) => {
        if (err) return reject(err);
        loadVectorsIntoMemory().then(resolve).catch(reject);
      });
    });
  });
}

/**
 * Load vectors from SQLite into memory for fast similarity search
 */
export function loadVectorsIntoMemory() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, content, metadata, embedding, file_hash, updated_at FROM rag_documents`, [], (err, rows) => {
      if (err) return reject(err);
      inMemoryVectors = (rows || []).map(r => ({
        id: r.id,
        content: r.content,
        metadata: JSON.parse(r.metadata || '{}'),
        embedding: JSON.parse(r.embedding || '[]'),
        file_hash: r.file_hash,
        updated_at: r.updated_at
      }));
      console.log(`[RAG VectorStore] Loaded ${inMemoryVectors.length} semantic chunks into memory.`);
      resolve(inMemoryVectors.length);
    });
  });
}

/**
 * Incremental UPSERT with MD5 file-hash checking
 * Replaces older status when updated without duplicating
 */
export function upsertRagDocument(id, content, metadata) {
  return new Promise((resolve, reject) => {
    const fileHash = computeMD5({ content, metadata });
    const existing = inMemoryVectors.find(doc => doc.id === id);

    if (existing && existing.file_hash === fileHash) {
      // Content has not changed, skip re-embedding
      return resolve({ status: 'SKIPPED_UNCHANGED', id });
    }

    const embedding = generateEmbedding(content + ' ' + JSON.stringify(metadata));
    const now = new Date().toISOString();
    const metaStr = JSON.stringify(metadata);
    const embStr = JSON.stringify(embedding);

    const stmt = db.prepare(`INSERT OR REPLACE INTO rag_documents (id, content, metadata, embedding, file_hash, updated_at) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(id, content, metaStr, embStr, fileHash, now, function(err) {
      if (err) return reject(err);
      
      // Update memory store
      const item = { id, content, metadata, embedding, file_hash: fileHash, updated_at: now };
      const idx = inMemoryVectors.findIndex(doc => doc.id === id);
      if (idx >= 0) inMemoryVectors[idx] = item;
      else inMemoryVectors.push(item);

      resolve({ status: 'UPSERTED', id });
    });
    stmt.finalize();
  });
}

/**
 * Hybrid Vector Search + Hard Metadata Filtering
 */
export function searchHybrid(query, filters = {}, topK = 6) {
  const queryVec = generateEmbedding(query);
  const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  // Step 1: Apply Hard Pre-Filters
  const candidates = inMemoryVectors.filter(doc => {
    const meta = doc.metadata;

    if (filters.constituency && !meta.constituency.toLowerCase().includes(filters.constituency.toLowerCase())) {
      return false;
    }
    if (filters.representative_name && !meta.representative_name.toLowerCase().includes(filters.representative_name.toLowerCase())) {
      return false;
    }
    if (filters.representative_type && meta.representative_type !== filters.representative_type) {
      return false;
    }
    if (filters.state && !meta.state.toLowerCase().includes(filters.state.toLowerCase())) {
      return false;
    }
    if (filters.status && meta.status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }
    if (filters.party && !meta.party.toLowerCase().includes(filters.party.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Step 2: Score Candidates with Hybrid Metric (Cosine + BM25 Term Matching)
  const scored = candidates.map(doc => {
    const cosScore = cosineSimilarity(queryVec, doc.embedding);
    
    // Lexical match bonus
    let lexicalScore = 0;
    const lowerContent = doc.content.toLowerCase();
    for (const term of queryTerms) {
      if (lowerContent.includes(term)) lexicalScore += 0.2;
    }

    const hybridScore = cosScore * 0.7 + lexicalScore * 0.3;
    return {
      ...doc,
      score: hybridScore
    };
  });

  // Step 3: Sort and Return Top K
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
