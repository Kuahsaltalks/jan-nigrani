import crypto from 'crypto';

/**
 * Computes MD5 hash for a given object or content payload
 */
export function computeMD5(content) {
  const str = typeof content === 'string' ? content : JSON.stringify(content);
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Validates and normalizes structured metadata according to specification
 */
export function normalizeMetadata(data) {
  return {
    state: data.state || data.state_name || 'India',
    constituency: data.constituency || data.geography_name || 'National',
    representative_type: data.representative_type || (data.office_title?.includes('MLA') ? 'MLA' : data.office_title?.includes('Pradhan') ? 'GRAM_PRADHAN' : data.office_title?.includes('Mayor') ? 'MAYOR' : 'MP'),
    representative_name: data.representative_name || data.name || 'Official Authority',
    party: data.party || 'Independent',
    tenure_start: data.tenure_start || '2024-06-04',
    tenure_end: data.tenure_end || '2029-05-31',
    project_category: data.project_category || data.sector || 'General Infrastructure',
    sanctioned_amount_inr: Number(data.sanctioned_amount_inr || data.sanctioned_cost || 0),
    status: data.status === 'COMPLETED' ? 'Completed' : (data.status === 'UNDERWAY' ? 'Ongoing' : (data.status === 'STALLED' ? 'Stalled' : 'Sanctioned')),
    updated_at: data.updated_at || new Date().toISOString(),
    proof_status: data.proof_status || 'UNVERIFIED_NO_PROOF',
    proof_by: data.proof_by || 'None',
    image_urls: typeof data.image_urls === 'string' ? JSON.parse(data.image_urls || '[]') : (data.image_urls || []),
    source_name: data.source_name || 'Official Government Register',
    source_url: data.source_url || 'https://mplads.gov.in/'
  };
}
