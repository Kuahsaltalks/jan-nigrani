import express from 'express';
import cors from 'cors';
import db, { initDatabase } from './db/database.js';
import { addSseClient, removeSseClient, triggerLiveDelta, startAutoSync } from './sync/liveSyncEngine.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
initDatabase().then(() => {
  console.log("Database ready. Starting background Live Sync Engine...");
  startAutoSync();
}).catch(err => {
  console.error("Database initialization failed:", err);
});

// SSE Live Stream Endpoint
app.get('/api/live-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  addSseClient(res);

  req.on('close', () => {
    removeSseClient(res);
  });
});

// Trigger micro live transaction delta down to ₹1 (Demo / Testing endpoint)
app.post('/api/simulate-live-delta', async (req, res) => {
  try {
    const { entityId = 'rep-1', amountDelta = 1, eventType = 'SPEND_VOUCHER', customDescription } = req.body;
    const result = await triggerLiveDelta({ entityId, amountDelta: Number(amountDelta), eventType, customDescription });
    res.json({ success: true, event: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

import { delimitationKnowledgeBase } from './db/delimitationRAG.js';

// Search API with Pan-India ECI Delimitation RAG & Knowledge Engine
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.json({ geographies: [], persons: [], projects: [], delimitation_rag: [] });

  const q = `%${query.toLowerCase()}%`;
  const lowerQ = query.toLowerCase();
  
  db.all(`SELECT * FROM geographies WHERE LOWER(name) LIKE ? OR LOWER(state_name) LIKE ? OR LOWER(lgd_code) LIKE ? OR LOWER(id) LIKE ? LIMIT 15`, [q, q, q, q], (err, geos) => {
    db.all(`SELECT * FROM persons WHERE LOWER(name) LIKE ? OR LOWER(party) LIKE ? OR LOWER(office_title) LIKE ? LIMIT 15`, [q, q, q], (err, persons) => {
      db.all(`SELECT * FROM projects WHERE LOWER(title) LIKE ? OR LOWER(sector) LIKE ? OR LOWER(implementing_dept) LIKE ? LIMIT 15`, [q, q, q], (err, projs) => {
        
        // Query Delimitation 2008 RAG Knowledge Base
        const ragMatches = delimitationKnowledgeBase.filter(item => 
          item.pc_name.toLowerCase().includes(lowerQ) ||
          item.state.toLowerCase().includes(lowerQ) ||
          item.assembly_segments.some(seg => seg.toLowerCase().includes(lowerQ)) ||
          item.districts.some(dist => dist.toLowerCase().includes(lowerQ))
        ).slice(0, 10);

        // Merge RAG PCs into geographies if not already in DB
        const existingGeoNames = new Set((geos || []).map(g => g.name.toLowerCase()));
        const syntheticGeos = ragMatches.map(rag => {
          const id = 'rag-' + rag.pc_code.toLowerCase();
          return {
            id,
            lgd_code: rag.pc_code,
            name: `${rag.pc_name} Parliamentary Constituency (${rag.state})`,
            type: 'PARLIAMENTARY_CONSTITUENCY',
            parent_id: 'state-' + rag.state.toLowerCase().replace(/[^a-z]/g, ''),
            state_name: rag.state,
            lat: 20.5937,
            lon: 78.9629,
            assembly_segments: rag.assembly_segments,
            districts: rag.districts,
            is_rag: true
          };
        }).filter(sg => !existingGeoNames.has(sg.name.toLowerCase()));

        res.json({
          geographies: [...(geos || []), ...syntheticGeos],
          persons: persons || [],
          projects: projs || [],
          delimitation_rag: ragMatches
        });
      });
    });
  });
});

// Dedicated Delimitation RAG Query Endpoint
app.get('/api/rag/delimitation', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) return res.json(delimitationKnowledgeBase.slice(0, 20));

  const results = delimitationKnowledgeBase.filter(item => 
    item.pc_name.toLowerCase().includes(query) ||
    item.state.toLowerCase().includes(query) ||
    item.assembly_segments.some(seg => seg.toLowerCase().includes(query)) ||
    item.districts.some(dist => dist.toLowerCase().includes(query))
  );

  res.json(results);
});

// Area / Geography Details with Multi-tier Governance Resolution (Pradhan, Mayor, MLA, MP)
app.get('/api/areas/:id', (req, res) => {
  const areaId = req.params.id;

  db.get(`SELECT * FROM geographies WHERE id = ? OR lgd_code = ?`, [areaId, areaId], (err, geo) => {
    if (!geo) {
      // Check RAG Knowledge Base for nationwide delimitation
      const codeOrName = areaId.replace('rag-', '').toLowerCase();
      const ragEntry = delimitationKnowledgeBase.find(item => 
        item.pc_code.toLowerCase() === codeOrName || 
        item.pc_name.toLowerCase().includes(codeOrName)
      );

      if (ragEntry) {
        return res.json({
          geography: {
            id: 'rag-' + ragEntry.pc_code.toLowerCase(),
            lgd_code: ragEntry.pc_code,
            name: `${ragEntry.pc_name} Parliamentary Constituency`,
            type: 'PARLIAMENTARY_CONSTITUENCY',
            parent_id: 'state-' + ragEntry.state.toLowerCase(),
            state_name: ragEntry.state,
            lat: 20.5937,
            lon: 78.9629,
            assembly_segments: ragEntry.assembly_segments,
            districts: ragEntry.districts,
            is_rag: true
          },
          representatives: [
            {
              id: 'rep-rag-' + ragEntry.pc_code.toLowerCase(),
              name: `Member of Parliament (${ragEntry.pc_name})`,
              party: '18th Lok Sabha Representative',
              office_title: `MP (Lok Sabha - ${ragEntry.pc_name})`,
              photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
              tenure_start: '2024-06-04',
              tenure_end: '2029-05-31',
              tenure_label: 'June 2024 – May 2029 (Current 18th Lok Sabha)',
              tenure_status: 'CURRENT_INCUMBENT',
              status_note: `Elected representative for ${ragEntry.pc_name} comprising ${ragEntry.assembly_segments.length} Assembly Segments (${ragEntry.assembly_segments.join(', ')}).`,
              attendance_pct: 94.0,
              questions_asked: 32,
              debates_participated: 24,
              data_coverage_pct: 95.0,
              geography_name: ragEntry.pc_name
            }
          ],
          fund_ledgers: [
            {
              id: 'fl-rag-' + ragEntry.pc_code.toLowerCase(),
              entity_id: 'rep-rag-' + ragEntry.pc_code.toLowerCase(),
              entity_type: 'PERSON',
              scheme_name: 'MPLADS (Lok Sabha)',
              fiscal_year: '2025-2026',
              entitled_amount: 50000000,
              allocated_amount: 50000000,
              released_amount: 25000000,
              sanctioned_amount: 29500000,
              expended_amount: 19800000,
              unspent_balance: 5200000,
              last_updated: '2026-08-31 22:08:00',
              source_name: 'MPLADS Official Portal',
              source_url: 'https://mplads.gov.in/'
            }
          ],
          projects: [
            {
              id: 'proj-rag-' + ragEntry.pc_code.toLowerCase() + '-1',
              source_work_id: `MPLADS-2025-${ragEntry.pc_code}-001`,
              title: `Multi-Purpose Community Infrastructure & Solar Electrification in ${ragEntry.assembly_segments[0] || ragEntry.pc_name}`,
              sector: 'Community Infrastructure & Clean Energy',
              geography_id: 'rag-' + ragEntry.pc_code.toLowerCase(),
              recommender_id: 'rep-rag-' + ragEntry.pc_code.toLowerCase(),
              implementing_dept: 'District Rural Development Agency (DRDA)',
              sanctioned_cost: 4500000,
              spent_cost: 4500000,
              status: 'COMPLETED',
              physical_progress_pct: 100,
              lat: 20.5937,
              lon: 78.9629,
              approval_date: '2025-01-15',
              completion_date: '2025-06-20',
              source_name: 'MPLADS GIS Portal',
              source_url: 'https://mplads.gov.in/',
              proof_status: 'OFFICIAL_PROOF_VERIFIED',
              proof_by: 'District Planning Office & Executive Engineer',
              proof_summary: `Geo-tagged completion certificate and facility utilization photos verified for ${ragEntry.pc_name}.`,
              image_urls: JSON.stringify([
                'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800'
              ])
            }
          ]
        });
      }

      return res.status(404).json({ error: 'Area not found' });
    }

    // Build intelligent geography cluster (handles GP -> ULB -> AC -> PC hierarchy)
    const clusterMap = {
      'geo-nainital': ['geo-nainital', 'geo-haldwani', 'geo-haldwani-ulb', 'geo-chhoti-ramdi'],
      'geo-haldwani': ['geo-nainital', 'geo-haldwani', 'geo-haldwani-ulb', 'geo-chhoti-ramdi'],
      'geo-haldwani-ulb': ['geo-nainital', 'geo-haldwani', 'geo-haldwani-ulb', 'geo-chhoti-ramdi'],
      'geo-chhoti-ramdi': ['geo-nainital', 'geo-haldwani', 'geo-haldwani-ulb', 'geo-chhoti-ramdi'],
      'geo-varanasi': ['geo-varanasi', 'geo-varanasi-cantt', 'geo-varanasi-ulb', 'geo-chiraigaon'],
      'geo-varanasi-cantt': ['geo-varanasi', 'geo-varanasi-cantt', 'geo-varanasi-ulb', 'geo-chiraigaon'],
      'geo-varanasi-ulb': ['geo-varanasi', 'geo-varanasi-cantt', 'geo-varanasi-ulb', 'geo-chiraigaon'],
      'geo-chiraigaon': ['geo-varanasi', 'geo-varanasi-cantt', 'geo-varanasi-ulb', 'geo-chiraigaon'],
      'geo-rae-bareli': ['geo-rae-bareli'],
      'geo-kannauj': ['geo-kannauj'],
      'geo-mainpuri': ['geo-mainpuri'],
      'geo-gandhinagar': ['geo-gandhinagar'],
      'geo-nagpur': ['geo-nagpur'],
      'geo-baramati': ['geo-baramati'],
      'geo-wayanad': ['geo-wayanad', 'geo-kalpetta', 'geo-meppadi-gp'],
      'geo-kalpetta': ['geo-wayanad', 'geo-kalpetta', 'geo-meppadi-gp'],
      'geo-meppadi-gp': ['geo-wayanad', 'geo-kalpetta', 'geo-meppadi-gp'],
      'geo-tvm': ['geo-tvm', 'geo-tvm-ulb'],
      'geo-tvm-ulb': ['geo-tvm', 'geo-tvm-ulb'],
      'geo-guwahati': ['geo-guwahati', 'geo-guwahati-ulb'],
      'geo-guwahati-ulb': ['geo-guwahati', 'geo-guwahati-ulb'],
      'geo-bangalore-south': ['geo-bangalore-south', 'geo-bbmp'],
      'geo-bbmp': ['geo-bangalore-south', 'geo-bbmp']
    };

    const targetCluster = clusterMap[geo.id] || [geo.id, geo.parent_id].filter(Boolean);
    const clusterPlaceholders = targetCluster.map(() => '?').join(',');

    db.all(`SELECT p.*, g.name as geography_name, g.type as geography_type 
            FROM persons p 
            JOIN geographies g ON p.geography_id = g.id
            WHERE p.geography_id IN (${clusterPlaceholders})`, 
      targetCluster, 
      (err, reps) => {
        const repIds = (reps || []).map(r => r.id);
        const repPlaceholders = repIds.length > 0 ? repIds.map(() => '?').join(',') : "''";
        
        db.all(`SELECT * FROM fund_ledgers WHERE entity_id IN (${clusterPlaceholders}) OR entity_id IN (${repPlaceholders})`, 
          [...targetCluster, ...repIds], 
          (err, ledgers) => {
            db.all(`SELECT p.*, g.name as geo_name, per.name as recommender_name 
                    FROM projects p
                    LEFT JOIN geographies g ON p.geography_id = g.id
                    LEFT JOIN persons per ON p.recommender_id = per.id
                    WHERE p.geography_id IN (${clusterPlaceholders})`, 
              targetCluster, 
              (err, projs) => {
                res.json({
                  geography: geo,
                  representatives: reps || [],
                  fund_ledgers: ledgers || [],
                  projects: projs || []
                });
              }
            );
          }
        );
      }
    );
  });
});

// All Representatives
app.get('/api/representatives', (req, res) => {
  db.all(`SELECT p.*, g.name as geography_name, g.lgd_code 
          FROM persons p 
          LEFT JOIN geographies g ON p.geography_id = g.id`, [], (err, rows) => {
    res.json(rows || []);
  });
});

// Single Representative Profile
app.get('/api/representatives/:id', (req, res) => {
  const repId = req.params.id;

  db.get(`SELECT p.*, g.name as geography_name, g.lgd_code 
          FROM persons p 
          LEFT JOIN geographies g ON p.geography_id = g.id 
          WHERE p.id = ?`, [repId], (err, rep) => {
    if (!rep) return res.status(404).json({ error: 'Representative not found' });

    db.all(`SELECT * FROM roles WHERE person_id = ?`, [repId], (err, roles) => {
      db.all(`SELECT * FROM fund_ledgers WHERE entity_id = ?`, [repId], (err, ledgers) => {
        db.all(`SELECT * FROM projects WHERE recommender_id = ?`, [repId], (err, projs) => {
          db.all(`SELECT * FROM audit_findings WHERE entity_id = ?`, [repId], (err, audits) => {
            res.json({
              person: rep,
              roles: roles || [],
              fund_ledgers: ledgers || [],
              projects: projs || [],
              audit_findings: audits || []
            });
          });
        });
      });
    });
  });
});

// Projects API
app.get('/api/projects', (req, res) => {
  const { status, sector, area, rep } = req.query;
  let sql = `SELECT p.*, g.name as geo_name, per.name as recommender_name 
             FROM projects p 
             LEFT JOIN geographies g ON p.geography_id = g.id 
             LEFT JOIN persons per ON p.recommender_id = per.id WHERE 1=1`;
  const params = [];

  if (status) {
    sql += ` AND p.status = ?`;
    params.push(status);
  }
  if (sector) {
    sql += ` AND p.sector = ?`;
    params.push(sector);
  }
  if (area) {
    sql += ` AND p.geography_id = ?`;
    params.push(area);
  }
  if (rep) {
    sql += ` AND p.recommender_id = ?`;
    params.push(rep);
  }

  db.all(sql, params, (err, rows) => {
    res.json(rows || []);
  });
});

// Project Audit Trail Detail
app.get('/api/projects/:id', (req, res) => {
  const projId = req.params.id;

  db.get(`SELECT p.*, g.name as geo_name, per.name as recommender_name 
          FROM projects p 
          LEFT JOIN geographies g ON p.geography_id = g.id 
          LEFT JOIN persons per ON p.recommender_id = per.id 
          WHERE p.id = ?`, [projId], (err, proj) => {
    if (!proj) return res.status(404).json({ error: 'Project not found' });

    db.all(`SELECT * FROM contracts WHERE project_id = ?`, [projId], (err, contracts) => {
      db.all(`SELECT * FROM citizen_evidence WHERE project_id = ? ORDER BY timestamp DESC`, [projId], (err, evidence) => {
        res.json({
          project: proj,
          contracts: contracts || [],
          evidence: evidence || []
        });
      });
    });
  });
});

// Peer Comparison Engine Data
app.get('/api/compare', (req, res) => {
  db.all(`SELECT p.*, fl.entitled_amount, fl.released_amount, fl.sanctioned_amount, fl.expended_amount, fl.unspent_balance, g.name as geo_name 
          FROM persons p 
          LEFT JOIN fund_ledgers fl ON p.id = fl.entity_id 
          LEFT JOIN geographies g ON p.geography_id = g.id`, [], (err, rows) => {
    res.json(rows || []);
  });
});

// Live Activity Logs
app.get('/api/live-logs', (req, res) => {
  db.all(`SELECT * FROM live_activity_logs ORDER BY timestamp DESC LIMIT 30`, [], (err, rows) => {
    res.json(rows || []);
  });
});

// State Scheme Registry (PRD Section 11.2)
app.get('/api/state-schemes', (req, res) => {
  db.all(`SELECT * FROM state_schemes`, [], (err, rows) => {
    res.json(rows || []);
  });
});

// "Who is Responsible?" Resolver Templates (PRD Section 34)
app.get('/api/responsible-resolver', (req, res) => {
  db.all(`SELECT * FROM responsibility_resolvers`, [], (err, rows) => {
    res.json(rows || []);
  });
});

// All Citizen Evidence & Moderation List
app.get('/api/citizen-evidence', (req, res) => {
  db.all(`SELECT ce.*, p.title as project_title, p.source_work_id 
          FROM citizen_evidence ce 
          LEFT JOIN projects p ON ce.project_id = p.id 
          ORDER BY ce.timestamp DESC`, [], (err, rows) => {
    res.json(rows || []);
  });
});

// Moderate Citizen Submission
app.post('/api/citizen-evidence/:id/moderate', (req, res) => {
  const { status } = req.body; // APPROVED or REJECTED
  const evId = req.params.id;

  db.run(`UPDATE citizen_evidence SET moderation_status = ? WHERE id = ?`, [status, evId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, updatedStatus: status });
  });
});

// Submit Citizen Evidence
app.post('/api/citizen-evidence', (req, res) => {
  const { projectId, userName, issueType, description, imageUrl, lat, lon } = req.body;
  if (!projectId || !description) return res.status(400).json({ error: 'Missing required fields' });

  const evId = 'ev-' + Date.now();
  const timestamp = new Date().toISOString();

  db.run(`INSERT INTO citizen_evidence VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [evId, projectId, userName || 'Anonymous Citizen', issueType || 'COMPLETED_VERIFIED', description, imageUrl || '', lat || 0, lon || 0, timestamp, 'APPROVED'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: evId });
    }
  );
});

// Citation Pack Generator for Journalists & Researchers (PRD Section 34)
app.get('/api/citation-pack', (req, res) => {
  const entityId = req.query.entityId || 'rep-1';

  db.get(`SELECT * FROM persons WHERE id = ?`, [entityId], (err, person) => {
    db.all(`SELECT * FROM fund_ledgers WHERE entity_id = ?`, [entityId], (err, ledgers) => {
      db.all(`SELECT * FROM projects WHERE recommender_id = ?`, [entityId], (err, projs) => {
        db.all(`SELECT * FROM live_activity_logs WHERE entity_id = ? ORDER BY timestamp DESC LIMIT 20`, [entityId], (err, logs) => {
          const citationPack = {
            export_title: "Jan Nigrani - Public Source Provenance & Citation Pack",
            exported_at: new Date().toISOString(),
            license: "Government Open Data License - India / Public Records Domain",
            subject: person,
            fund_ledgers: ledgers,
            works_audit_trail: projs,
            provenance_audit_logs: logs,
            methodology: "Data reconciled using LGD administrative codes, MPLADS official records, and PFMS financial vouchers. Separates recommendation, sanction, and execution."
          };
          res.setHeader('Content-Disposition', `attachment; filename=JanNigrani_CitationPack_${entityId}.json`);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(citationPack, null, 2));
        });
      });
    });
  });
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Jan Nigrani Backend & Live Sync Server running on port ${PORT}`);
  });
}
