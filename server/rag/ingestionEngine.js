import { panIndiaProjects, panIndiaPersons, panIndiaFundLedgers, panIndiaGeographies } from '../db/panIndiaData.js';
import { delimitationKnowledgeBase } from '../db/delimitationRAG.js';
import { normalizeMetadata, computeMD5 } from './schema.js';
import { upsertRagDocument, initRagStore } from './vectorStore.js';

/**
 * Runs incremental ingestion with MD5 deduplication and UPSERT logic
 */
export async function runIncrementalIngestion() {
  console.log('[RAG Ingestion] Initializing semantic vector store...');
  await initRagStore();

  let upsertedCount = 0;
  let skippedCount = 0;

  // 1. Ingest Public Projects / Works
  for (const proj of panIndiaProjects) {
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

    const res = await upsertRagDocument(proj.id, content, metadata);
    if (res.status === 'UPSERTED') upsertedCount++;
    else skippedCount++;
  }

  // 2. Ingest Representatives & Ministers Profiles
  for (const person of panIndiaPersons) {
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

    const res = await upsertRagDocument(person.id, content, metadata);
    if (res.status === 'UPSERTED') upsertedCount++;
    else skippedCount++;
  }

  // 3. Ingest ECI Delimitation Knowledge Chunks
  for (const del of delimitationKnowledgeBase) {
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

    const res = await upsertRagDocument('delim-' + del.pc_code.toLowerCase(), content, metadata);
    if (res.status === 'UPSERTED') upsertedCount++;
    else skippedCount++;
  }

  console.log(`[RAG Ingestion Complete] Upserted: ${upsertedCount}, Unchanged/Skipped: ${skippedCount}`);
  return { upsertedCount, skippedCount };
}
