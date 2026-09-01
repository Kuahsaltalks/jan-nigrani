import db from '../db/database.js';
import crypto from 'crypto';

let sseClients = [];
let autoSyncInterval = null;

export function addSseClient(res) {
  sseClients.push(res);
  console.log(`[SSE Live Sync] Client connected. Total active clients: ${sseClients.length}`);
}

export function removeSseClient(res) {
  sseClients = sseClients.filter(c => c !== res);
  console.log(`[SSE Live Sync] Client disconnected. Total active clients: ${sseClients.length}`);
}

export function broadcastEvent(eventType, payload) {
  const dataString = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(dataString);
    } catch (err) {
      console.error("[SSE Live Sync] Broadcast error:", err);
    }
  });
}

/**
 * Triggers a real-time live delta down to ₹1 precision and broadcasts it to all live clients.
 */
export function triggerLiveDelta({ entityId = 'rep-1', amountDelta = 1, eventType = 'SPEND_VOUCHER', customDescription = null }) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    
    // First fetch entity details and current ledger
    db.get(`SELECT p.name as person_name, g.name as geo_name 
            FROM persons p 
            LEFT JOIN geographies g ON p.geography_id = g.id 
            WHERE p.id = ?`, [entityId], (err, entity) => {
      
      const entityName = entity ? entity.person_name : 'Varanasi Constituency';
      
      // Update the ledger with exact amount delta
      db.get(`SELECT * FROM fund_ledgers WHERE entity_id = ? LIMIT 1`, [entityId], (err, ledger) => {
        if (!ledger) {
          // Fallback to first ledger
          entityId = 'rep-1';
        }
        
        let newExpended = (ledger ? ledger.expended_amount : 18420150) + amountDelta;
        let newUnspent = (ledger ? ledger.unspent_balance : 6579850) - amountDelta;
        
        db.run(`UPDATE fund_ledgers 
                SET expended_amount = ?, unspent_balance = ?, last_updated = ? 
                WHERE entity_id = ?`, 
                [newExpended, newUnspent, now, entityId], function(err) {
          
          if (err) return reject(err);

          const provHash = crypto.createHash('sha256').update(`${now}-${entityId}-${amountDelta}-${newExpended}`).digest('hex');
          const logId = 'log-' + Date.now();
          const description = customDescription || `Live spend transaction recorded: Exact delta +₹${amountDelta.toLocaleString('en-IN')}. Expended total updated to ₹${newExpended.toLocaleString('en-IN')}.`;
          
          db.run(`INSERT INTO live_activity_logs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [logId, now, entityId, entityName, eventType, amountDelta, newExpended, description, 'Government Live Sync Gateway', provHash],
            function(err) {
              if (err) return reject(err);

              const eventPayload = {
                id: logId,
                timestamp: now,
                entity_id: entityId,
                entity_name: entityName,
                event_type: eventType,
                amount_delta: amountDelta,
                new_total_amount: newExpended,
                description,
                source_name: 'Government Live Sync Gateway',
                provenance_hash: provHash
              };

              console.log(`[LIVE DELTA TRIGGERED] ${entityName} -> Delta: ₹${amountDelta} | New Total: ₹${newExpended}`);

              // Broadcast via SSE to all open UI clients instantly!
              broadcastEvent('live-delta', eventPayload);

              resolve(eventPayload);
            }
          );
        });
      });
    });
  });
}

// Start auto simulated periodic micro updates (every 25 seconds) to demonstrate live 1-rupee level background updates
export function startAutoSync() {
  if (autoSyncInterval) return;
  autoSyncInterval = setInterval(() => {
    // Pick random 1-5 rupees delta
    const deltas = [1, 2, 5, 10, 1500];
    const randDelta = deltas[Math.floor(Math.random() * deltas.length)];
    const entities = ['rep-1', 'rep-2', 'geo-4'];
    const randEntity = entities[Math.floor(Math.random() * entities.length)];
    
    triggerLiveDelta({
      entityId: randEntity,
      amountDelta: randDelta,
      eventType: 'SPEND_VOUCHER',
      customDescription: `Automatic source polling refreshed: Detected micro transaction delta of +₹${randDelta.toLocaleString('en-IN')} from government gateway.`
    }).catch(err => console.error("Auto sync error:", err));
  }, 25000);
}

export function stopAutoSync() {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval);
    autoSyncInterval = null;
  }
}
