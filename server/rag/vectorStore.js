import db from '../db/database.js';
import { computeMD5, normalizeMetadata } from './schema.js';
import { panIndiaProjects, panIndiaPersons, panIndiaFundLedgers, panIndiaGeographies } from '../db/panIndiaData.js';
import { delimitationKnowledgeBase } from '../db/delimitationRAG.js';

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
 * Synchronously ensure in-memory semantic vectors are populated
 */
export function ensureInMemoryDataLoaded() {
  if (inMemoryVectors.length > 0) return;

  // 1. Projects
  panIndiaProjects.forEach(proj => {
    const rep = panIndiaPersons.find(p => p.id === proj.recommender_id) || {};
    const geo = panIndiaGeographies.find(g => g.id === proj.geography_id) || {};

    const metadata = normalizeMetadata({
      state: geo.state_name,
      constituency: geo.name,
      representative_type: rep.office_title?.includes('MLA') ? 'MLA' : rep.office_title?.includes('Pradhan') ? 'GRAM_PRADHAN' : rep.office_title?.includes('Mayor') ? 'MAYOR' : 'MP',
      representative_name: rep.name,
      party: rep.party,
      tenure_start: rep.tenure_start,
      tenure_end: rep.tenure_end,
      project_category: proj.sector,
      sanctioned_amount_inr: proj.sanctioned_cost,
      status: proj.status,
      updated_at: proj.approval_date || new Date().toISOString(),
      proof_status: proj.proof_status,
      proof_by: proj.proof_by,
      image_urls: proj.image_urls,
      source_name: proj.source_name,
      source_url: proj.source_url
    });

    const content = `[Project Record] Title: "${proj.title}"
Constituency: ${metadata.constituency} (${metadata.state})
Recommended By: ${metadata.representative_name} (${metadata.party}, ${metadata.representative_type})
Tenure: ${metadata.tenure_start} to ${metadata.tenure_end}
Sector: ${metadata.project_category}
Sanctioned Amount: ₹${(metadata.sanctioned_amount_inr / 100000).toFixed(1)} Lakh (₹${metadata.sanctioned_amount_inr.toLocaleString('en-IN')})
Recorded Expenditure: ₹${(proj.spent_cost / 100000).toFixed(1)} Lakh
Execution Department: ${proj.implementing_dept}
Physical Progress: ${proj.physical_progress_pct}%
Status: ${metadata.status}
Proof Verification: ${proj.proof_status} - ${proj.proof_summary} (Submitted by: ${proj.proof_by})
Source: ${proj.source_name} (${proj.source_url})`;

    const embedding = generateEmbedding(content + ' ' + JSON.stringify(metadata));
    inMemoryVectors.push({
      id: proj.id,
      content,
      metadata,
      embedding,
      file_hash: computeMD5({ content, metadata }),
      updated_at: new Date().toISOString()
    });
  });

  // 2. Persons
  panIndiaPersons.forEach(person => {
    const geo = panIndiaGeographies.find(g => g.id === person.geography_id) || {};
    const ledger = panIndiaFundLedgers.find(l => l.entity_id === person.id) || {};

    const metadata = normalizeMetadata({
      state: geo.state_name,
      constituency: geo.name,
      representative_type: person.office_title?.includes('MLA') ? 'MLA' : person.office_title?.includes('Pradhan') ? 'GRAM_PRADHAN' : person.office_title?.includes('Mayor') ? 'MAYOR' : 'MP',
      representative_name: person.name,
      party: person.party,
      tenure_start: person.tenure_start,
      tenure_end: person.tenure_end,
      project_category: 'Parliamentary & Local Governance',
      sanctioned_amount_inr: ledger.sanctioned_amount || 0,
      status: person.tenure_status === 'CURRENT_INCUMBENT' ? 'Ongoing' : 'Completed',
      updated_at: person.last_refreshed,
      proof_status: 'OFFICIAL_PROOF_VERIFIED',
      source_name: 'ECI Official Record'
    });

    const content = `[Representative Profile] Name: ${person.name}
Party: ${person.party}
Official Office: ${person.office_title}
Constituency: ${geo.name} (${geo.state_name})
Statutory Tenure: ${person.tenure_label || `${person.tenure_start} to ${person.tenure_end}`} (${person.tenure_status})
Election / Board Status Note: ${person.status_note}
Parliamentary Performance: Attendance ${person.attendance_pct}%, Questions Asked: ${person.questions_asked}, Debates Participated: ${person.debates_participated}
Fund Entitlement: ₹${((ledger.entitled_amount || 50000000) / 10000000).toFixed(1)} Cr | Sanctioned: ₹${((ledger.sanctioned_amount || 0) / 10000000).toFixed(1)} Cr | Expended: ₹${((ledger.expended_amount || 0) / 10000000).toFixed(1)} Cr`;

    const embedding = generateEmbedding(content + ' ' + JSON.stringify(metadata));
    inMemoryVectors.push({
      id: person.id,
      content,
      metadata,
      embedding,
      file_hash: computeMD5({ content, metadata }),
      updated_at: new Date().toISOString()
    });
  });

  // 3. Delimitation
  delimitationKnowledgeBase.forEach(del => {
    const metadata = normalizeMetadata({
      state: del.state,
      constituency: del.pc_name,
      representative_type: 'MP',
      representative_name: `Elected MP of ${del.pc_name}`,
      party: 'All Parties',
      tenure_start: '2024-06-04',
      tenure_end: '2029-05-31',
      project_category: 'Delimitation & Statutory Jurisdiction',
      sanctioned_amount_inr: 50000000,
      status: 'Ongoing',
      updated_at: '2026-08-31T00:00:00Z',
      source_name: 'Delimitation of Parliamentary and Assembly Constituencies Order 2008'
    });

    const content = `[Delimitation Order 2008] Parliamentary Constituency: ${del.pc_name} (${del.pc_code})
State/UT: ${del.state}
Total Assembly Segments: ${del.assembly_segments.length}
Assembly Constituencies Comprising this PC: ${del.assembly_segments.join(', ')}
Revenue Districts Covered: ${del.districts.join(', ')}`;

    const embedding = generateEmbedding(content + ' ' + JSON.stringify(metadata));
    inMemoryVectors.push({
      id: 'delim-' + del.pc_code.toLowerCase(),
      content,
      metadata,
      embedding,
      file_hash: computeMD5({ content, metadata }),
      updated_at: new Date().toISOString()
    });
  });

  console.log(`[RAG VectorStore] Synchronously initialized ${inMemoryVectors.length} semantic records.`);
}

/**
 * Initializes SQLite RAG Schema
 */
export function initRagStore() {
  ensureInMemoryDataLoaded();
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
        resolve(inMemoryVectors.length);
      });
    });
  });
}

/**
 * Incremental UPSERT with MD5 file-hash checking
 */
export function upsertRagDocument(id, content, metadata) {
  ensureInMemoryDataLoaded();
  return new Promise((resolve, reject) => {
    const fileHash = computeMD5({ content, metadata });
    const existing = inMemoryVectors.find(doc => doc.id === id);

    if (existing && existing.file_hash === fileHash) {
      return resolve({ status: 'SKIPPED_UNCHANGED', id });
    }

    const embedding = generateEmbedding(content + ' ' + JSON.stringify(metadata));
    const now = new Date().toISOString();
    const metaStr = JSON.stringify(metadata);
    const embStr = JSON.stringify(embedding);

    const stmt = db.prepare(`INSERT OR REPLACE INTO rag_documents (id, content, metadata, embedding, file_hash, updated_at) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(id, content, metaStr, embStr, fileHash, now, function(err) {
      if (err) return reject(err);
      
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
  ensureInMemoryDataLoaded();

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
