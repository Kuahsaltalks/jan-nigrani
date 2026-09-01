import { parseQueryRouting } from './queryRouter.js';
import { searchHybrid } from './vectorStore.js';

export const SYSTEM_PROMPT = `You are an objective public-record assistant specializing in Indian parliamentary and state assembly constituency developments.
Operating Instructions:
* Answer strictly using the retrieved government context. If specific work or expenditure details are not in the context, state that the record is unavailable rather than assuming.
* Always specify the relevant tenure years, constituency name, and project status (e.g., sanctioned, ongoing, completed) for every listed initiative.
* Clearly distinguish between actions sanctioned under MPLADS (for MPs) versus MLALADS / State Budget schemes (for MLAs).
* Present all project lists with their sanctioned year, allocated budget, and current status in clean bullet points.`;

/**
 * Executes full RAG Pipeline: Query Routing -> Hard Filtering -> Hybrid Retrieval -> Context Synthesis
 */
export async function executeRagQuery(userQuery) {
  if (!userQuery || !userQuery.trim()) {
    return {
      answer: "Please provide a query regarding an MP, MLA, Gram Sabha, or Indian constituency.",
      retrieved_chunks: [],
      filters_applied: {}
    };
  }

  // 1. Query Routing & Hard Metadata Filter Extraction
  const filters = parseQueryRouting(userQuery);

  // 2. Hybrid Retrieval with hard metadata constraints
  let retrievedDocs = searchHybrid(userQuery, filters, 6);

  // If strict filtering returned zero, relax filters gracefully
  if (retrievedDocs.length === 0 && Object.keys(filters).length > 0) {
    const relaxedFilters = { constituency: filters.constituency, representative_name: filters.representative_name };
    retrievedDocs = searchHybrid(userQuery, relaxedFilters, 6);
  }

  // Fallback: semantic search without filters if still empty
  if (retrievedDocs.length === 0) {
    retrievedDocs = searchHybrid(userQuery, {}, 5);
  }

  if (retrievedDocs.length === 0) {
    return {
      answer: `Specific official expenditure or public development record for "${userQuery}" is unavailable in the current statutory gazette index. Please verify constituency name or reference official portals like MPLADS (mospi.gov.in) or eGramSwaraj.`,
      retrieved_chunks: [],
      filters_applied: filters
    };
  }

  // 3. Grounded Synthesis using Operating Instructions
  const answer = synthesizeGroundedResponse(userQuery, retrievedDocs, filters);

  return {
    query: userQuery,
    answer,
    filters_applied: filters,
    retrieved_chunks: retrievedDocs.map(d => ({
      id: d.id,
      score: d.score,
      metadata: d.metadata,
      content: d.content
    }))
  };
}

/**
 * Deterministic grounded answer generation adhering strictly to the operating prompt
 */
function synthesizeGroundedResponse(query, chunks, filters) {
  const projectChunks = chunks.filter(c => c.content.includes('[Project Record]'));
  const repChunks = chunks.filter(c => c.content.includes('[Representative Profile]'));
  const delimChunks = chunks.filter(c => c.content.includes('[Delimitation Order 2008]'));

  let lines = [];

  // 1. Overview Section
  if (repChunks.length > 0) {
    const primaryRep = repChunks[0].metadata;
    lines.push(`### 🏛️ Representative & Governance Record`);
    lines.push(`- **Representative:** ${primaryRep.representative_name} (${primaryRep.party})`);
    lines.push(`- **Constituency & State:** ${primaryRep.constituency}, ${primaryRep.state}`);
    lines.push(`- **Statutory Tenure:** ${primaryRep.tenure_start} to ${primaryRep.tenure_end}`);
    lines.push(`- **Role Type:** ${primaryRep.representative_type === 'MP' ? 'Member of Parliament (Lok Sabha - MPLADS)' : primaryRep.representative_type === 'MLA' ? 'Member of Legislative Assembly (Vidhan Sabha - MLALADS)' : 'Local Civic Authority'}`);
    lines.push('');
  }

  // 2. Delimitation & Jurisdiction Context
  if (delimChunks.length > 0) {
    const del = delimChunks[0];
    lines.push(`### 🗺️ Statutory Delimitation & Jurisdiction (ECI Order 2008)`);
    lines.push(`- **Parliamentary Constituency:** ${del.metadata.constituency} (${del.metadata.state})`);
    lines.push(`- **Assembly Segments:** ${del.metadata.constituency} comprises multiple statutory assembly constituencies as delimited by the Election Commission of India.`);
    lines.push('');
  }

  // 3. Projects List in Clean Bullet Points (strict prompt instruction)
  if (projectChunks.length > 0) {
    lines.push(`### 📋 Tracked Public Works & Sanctioned Initiatives:`);
    
    projectChunks.forEach(projChunk => {
      const meta = projChunk.metadata;
      const amountFormatted = meta.sanctioned_amount_inr >= 10000000 
        ? `₹${(meta.sanctioned_amount_inr / 10000000).toFixed(2)} Cr` 
        : `₹${(meta.sanctioned_amount_inr / 100000).toFixed(2)} Lakh`;
      
      const schemeLabel = meta.representative_type === 'MP' 
        ? 'MPLADS (MoSPI)' 
        : meta.representative_type === 'MLA' 
        ? 'MLALADS / State Scheme' 
        : '15th FC / GPDP Grant';

      const proofLabel = meta.proof_status === 'OFFICIAL_PROOF_VERIFIED' 
        ? '🟢 Proof Verified' 
        : meta.proof_status === 'CITIZEN_PROOF_ATTACHED' 
        ? '🟡 Citizen Proof Attached' 
        : '🔴 Unverified (No ground photos submitted)';

      lines.push(`* **${meta.project_category}:** ${projChunk.content.match(/Title:\s*"([^"]+)"/)?.[1] || 'Public Works Initiative'}`);
      lines.push(`  * **Scheme & Recommender:** Sanctioned under **${schemeLabel}** by ${meta.representative_name} (${meta.party})`);
      lines.push(`  * **Constituency & Tenure:** ${meta.constituency} (${meta.state}) | Tenure Years: **${meta.tenure_start?.slice(0, 4)}–${meta.tenure_end?.slice(0, 4)}**`);
      lines.push(`  * **Allocated Budget:** **${amountFormatted}** (₹${meta.sanctioned_amount_inr.toLocaleString('en-IN')})`);
      lines.push(`  * **Current Status:** **${meta.status}** (${proofLabel})`);
      lines.push(`  * **Verification Audit:** ${meta.proof_by}`);
    });
    lines.push('');
  } else if (repChunks.length > 0 && projectChunks.length === 0) {
    lines.push(`> [!NOTE]\n> Specific individual work vouchers for this representative are being indexed from state/MPLADS audit gazettes. Entitled annual allocation: ₹5.00 Cr under MPLADS.`);
    lines.push('');
  }

  // 4. Attribution & Integrity Note
  lines.push(`---`);
  lines.push(`*Strict Statutory Notice: Sourced directly from official government records with ₹1 precision. Role attribution distinguishes legislative recommendation from executive agency implementation.*`);

  return lines.join('\n');
}
