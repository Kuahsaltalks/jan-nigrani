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

// Search API
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.json({ geographies: [], persons: [], projects: [] });

  const q = `%${query.toLowerCase()}%`;
  
  db.all(`SELECT * FROM geographies WHERE LOWER(name) LIKE ? OR LOWER(state_name) LIKE ? OR LOWER(lgd_code) LIKE ? OR LOWER(id) LIKE ? LIMIT 10`, [q, q, q, q], (err, geos) => {
    db.all(`SELECT * FROM persons WHERE LOWER(name) LIKE ? OR LOWER(party) LIKE ? OR LOWER(office_title) LIKE ? LIMIT 10`, [q, q, q], (err, persons) => {
      db.all(`SELECT * FROM projects WHERE LOWER(title) LIKE ? OR LOWER(sector) LIKE ? OR LOWER(implementing_dept) LIKE ? LIMIT 10`, [q, q, q], (err, projs) => {
        res.json({
          geographies: geos || [],
          persons: persons || [],
          projects: projs || []
        });
      });
    });
  });
});

// Area / Geography Details with Multi-tier Governance Resolution (Pradhan, Mayor, MLA, MP)
app.get('/api/areas/:id', (req, res) => {
  const areaId = req.params.id;

  db.get(`SELECT * FROM geographies WHERE id = ? OR lgd_code = ?`, [areaId, areaId], (err, geo) => {
    if (!geo) return res.status(404).json({ error: 'Area not found' });

    // Fetch related representatives across the full 4-tier statutory chain:
    // 1. Direct rep (e.g. Gram Pradhan)
    // 2. Child reps (if querying PC/AC)
    // 3. Parent reps (MLA, MP)
    // 4. Sibling reps (Mayor of parent ULB)
    const relatedGeoIds = [
      geo.id,
      geo.parent_id,
      'geo-nainital', 'geo-haldwani', 'geo-haldwani-ulb', 'geo-chhoti-ramdi',
      'geo-varanasi', 'geo-varanasi-cantt', 'geo-varanasi-ulb', 'geo-chiraigaon',
      'geo-wayanad', 'geo-kalpetta', 'geo-meppadi-gp', 'geo-tvm', 'geo-tvm-ulb',
      'geo-guwahati', 'geo-guwahati-ulb', 'geo-shillong', 'geo-bangalore-south', 'geo-bbmp'
    ];

    db.all(`SELECT p.*, g.name as geography_name, g.type as geography_type 
            FROM persons p 
            JOIN geographies g ON p.geography_id = g.id
            WHERE p.geography_id = ? 
               OR p.geography_id = ? 
               OR p.geography_id IN (SELECT id FROM geographies WHERE parent_id = ? OR parent_id = ? OR id = ?)
               OR g.parent_id = ?`, 
      [geo.id, geo.parent_id, geo.id, geo.parent_id, geo.parent_id, geo.id], 
      (err, reps) => {
        // Fetch 5-account ledgers
        const repIds = (reps || []).map(r => r.id);
        const placeholders = repIds.length > 0 ? repIds.map(() => '?').join(',') : "''";
        
        db.all(`SELECT * FROM fund_ledgers WHERE entity_id = ? OR entity_id IN (${placeholders})`, [geo.id, ...repIds], (err, ledgers) => {
          // Fetch projects for this geography or immediate family
          db.all(`SELECT p.*, g.name as geo_name, per.name as recommender_name 
                  FROM projects p
                  LEFT JOIN geographies g ON p.geography_id = g.id
                  LEFT JOIN persons per ON p.recommender_id = per.id
                  WHERE p.geography_id = ? OR p.geography_id = ? OR p.geography_id IN (SELECT id FROM geographies WHERE parent_id = ?)`, 
            [geo.id, geo.parent_id, geo.id], 
            (err, projs) => {
              res.json({
                geography: geo,
                representatives: reps || [],
                fund_ledgers: ledgers || [],
                projects: projs || []
              });
            }
          );
        });
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
