import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.VERCEL ? '/tmp/jannigrani.sqlite' : path.resolve(__dirname, 'jannigrani.sqlite');
const db = new sqlite3.Database(dbPath);

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Geographies (LGD Spine)
      db.run(`CREATE TABLE IF NOT EXISTS geographies (
        id TEXT PRIMARY KEY,
        lgd_code TEXT UNIQUE,
        name TEXT,
        type TEXT, -- STATE, DISTRICT, ULB, BLOCK, GRAM_PANCHAYAT, WARD, PARLIAMENTARY_CONSTITUENCY, ASSEMBLY_CONSTITUENCY
        parent_id TEXT,
        state_name TEXT,
        lat REAL,
        lon REAL
      )`);

      // 2. Persons (Representatives)
      db.run(`CREATE TABLE IF NOT EXISTS persons (
        id TEXT PRIMARY KEY,
        name TEXT,
        party TEXT,
        office_title TEXT,
        photo_url TEXT,
        tenure_start TEXT,
        tenure_end TEXT,
        geography_id TEXT,
        attendance_pct REAL,
        questions_asked INTEGER,
        debates_participated INTEGER,
        data_coverage_pct REAL,
        last_refreshed TEXT
      )`);

      // 3. Roles & Attribution Taxonomy
      db.run(`CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        person_id TEXT,
        institution_name TEXT,
        role_type TEXT, -- DIRECT_RECOMMENDATION, DIRECT_SANCTION, IMPLEMENTING_AUTHORITY, PORTFOLIO_RESPONSIBILITY, JURISDICTION_EXPOSURE
        description TEXT
      )`);

      // 4. Fund Sources & 5-Account Ledger (tracked down to ₹1 precision)
      db.run(`CREATE TABLE IF NOT EXISTS fund_ledgers (
        id TEXT PRIMARY KEY,
        entity_id TEXT, -- person_id or geography_id
        entity_type TEXT,
        scheme_name TEXT, -- MPLADS, MLALAD, eGramSwaraj FC Grant, City Finance ULB Revenue
        fiscal_year TEXT,
        entitled_amount INTEGER, -- ₹
        allocated_amount INTEGER, -- ₹
        released_amount INTEGER, -- ₹
        sanctioned_amount INTEGER, -- ₹
        expended_amount INTEGER, -- ₹
        unspent_balance INTEGER, -- ₹
        last_updated TEXT,
        source_name TEXT,
        source_url TEXT
      )`);

      // 5. Projects / Works Ledger
      db.run(`CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        source_work_id TEXT,
        title TEXT,
        sector TEXT,
        geography_id TEXT,
        recommender_id TEXT, -- Person ID (e.g. MP/MLA)
        implementing_dept TEXT,
        sanctioned_cost INTEGER, -- ₹
        spent_cost INTEGER, -- ₹
        status TEXT, -- PROPOSED, SANCTIONED, TENDERED, UNDERWAY, COMPLETED, STALLED, CANCELLED
        physical_progress_pct INTEGER,
        lat REAL,
        lon REAL,
        approval_date TEXT,
        completion_date TEXT,
        source_name TEXT,
        source_url TEXT
      )`);

      // 6. Contracts & Procurement (CPPP)
      db.run(`CREATE TABLE IF NOT EXISTS contracts (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        tender_id TEXT,
        vendor_name TEXT,
        tender_value INTEGER,
        award_value INTEGER,
        awarded_date TEXT,
        status TEXT,
        cppp_url TEXT
      )`);

      // 7. Audit Findings (CAG / AuditOnline)
      db.run(`CREATE TABLE IF NOT EXISTS audit_findings (
        id TEXT PRIMARY KEY,
        entity_id TEXT,
        report_title TEXT,
        audit_year TEXT,
        finding_severity TEXT, -- HIGH, MEDIUM, LOW
        finding_text TEXT,
        amount_involved INTEGER,
        status TEXT, -- UNRESOLVED, IN_REVIEW, RESOLVED
        source_url TEXT
      )`);

      // 8. Citizen Evidence & Verification Reports
      db.run(`CREATE TABLE IF NOT EXISTS citizen_evidence (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        user_name TEXT,
        issue_type TEXT, -- INCOMPLETE_WORK, POOR_QUALITY, NOT_FOUND, WRONG_LOCATION, COMPLETED_VERIFIED
        description TEXT,
        image_url TEXT,
        lat REAL,
        lon REAL,
        timestamp TEXT,
        moderation_status TEXT -- PENDING, APPROVED, REJECTED
      )`);

      // 9. Live Activity Log (1-rupee level precision transaction feed)
      db.run(`CREATE TABLE IF NOT EXISTS live_activity_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        entity_id TEXT,
        entity_name TEXT,
        event_type TEXT, -- FUND_RELEASE, SANCTION_ORDER, SPEND_VOUCHER, STATUS_CHANGE, CITIZEN_VERIFICATION
        amount_delta INTEGER, -- exact rupee delta e.g. +1, +50000
        new_total_amount INTEGER,
        description TEXT,
        source_name TEXT,
        provenance_hash TEXT
      )`);

      // 10. State Scheme Registry (PRD Section 11.2)
      db.run(`CREATE TABLE IF NOT EXISTS state_schemes (
        id TEXT PRIMARY KEY,
        state_name TEXT,
        scheme_name TEXT,
        annual_entitlement INTEGER,
        eligible_works TEXT,
        approval_chain TEXT,
        implementing_authority TEXT,
        portal_url TEXT,
        audit_mechanism TEXT
      )`);

      // 11. "Who is Responsible?" Resolver Templates (PRD Section 34)
      db.run(`CREATE TABLE IF NOT EXISTS responsibility_resolvers (
        id TEXT PRIMARY KEY,
        issue_sector TEXT,
        problem_title TEXT,
        recommender_role TEXT,
        sanctioning_body TEXT,
        executing_dept TEXT,
        oversight_institution TEXT,
        cpgrams_category TEXT,
        guidance_notes TEXT
      )`);

      // Ensure state_schemes and responsibility_resolvers are seeded if empty
      db.get(`SELECT COUNT(*) as cnt FROM state_schemes`, [], (err, row) => {
        if (!err && row && row.cnt === 0) {
          seedStateSchemesAndResolvers(db);
        }
      });

      // Seed mock dataset if database is empty
      db.get(`SELECT COUNT(*) as cnt FROM geographies`, [], (err, row) => {
        if (err) return reject(err);
        if (row.cnt === 0) {
          seedDatabase(db, resolve, reject);
        } else {
          resolve(db);
        }
      });
    });
  });
}

function seedDatabase(db, resolve, reject) {
  console.log("Seeding Jan Nigrani database with initial government accountability graph...");

  const now = new Date().toISOString();

  // Geographies
  const geographies = [
    { id: 'geo-1', lgd_code: '208', name: 'Varanasi', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-up', state_name: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739 },
    { id: 'geo-2', lgd_code: '208-390', name: 'Varanasi Cantt', type: 'ASSEMBLY_CONSTITUENCY', parent_id: 'geo-1', state_name: 'Uttar Pradesh', lat: 25.3350, lon: 82.9900 },
    { id: 'geo-3', lgd_code: 'LGD-ULB-8001', name: 'Varanasi Municipal Corporation (Nagar Nigam)', type: 'ULB', parent_id: 'geo-1', state_name: 'Uttar Pradesh', lat: 25.3100, lon: 82.9600 },
    { id: 'geo-4', lgd_code: 'LGD-GP-10492', name: 'Chiraigaon Gram Panchayat', type: 'GRAM_PANCHAYAT', parent_id: 'geo-1', state_name: 'Uttar Pradesh', lat: 25.3800, lon: 83.0200 },
    
    { id: 'geo-5', lgd_code: '185', name: 'Lucknow', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-up', state_name: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
    { id: 'geo-6', lgd_code: '185-171', name: 'Lucknow West', type: 'ASSEMBLY_CONSTITUENCY', parent_id: 'geo-5', state_name: 'Uttar Pradesh', lat: 26.8600, lon: 80.9200 },
    
    { id: 'geo-7', lgd_code: '028', name: 'Bangalore South', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-ka', state_name: 'Karnataka', lat: 12.9141, lon: 77.5857 },
    { id: 'geo-8', lgd_code: 'LGD-ULB-9002', name: 'Bruhat Bengaluru Mahanagara Palike (BBMP)', type: 'ULB', parent_id: 'geo-7', state_name: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  ];

  // Persons (Representatives)
  const persons = [
    {
      id: 'rep-1',
      name: 'Narendra Modi',
      party: 'Bharatiya Janata Party (BJP)',
      office_title: 'Member of Parliament (Lok Sabha)',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
      tenure_start: '2024-06-04',
      tenure_end: '2029-05-31',
      geography_id: 'geo-1',
      attendance_pct: 94.0,
      questions_asked: 0, // PM status
      debates_participated: 14,
      data_coverage_pct: 96.5,
      last_refreshed: now
    },
    {
      id: 'rep-2',
      name: 'Saurabh Srivastava',
      party: 'Bharatiya Janata Party (BJP)',
      office_title: 'Member of Legislative Assembly (MLA)',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      tenure_start: '2022-03-10',
      tenure_end: '2027-03-09',
      geography_id: 'geo-2',
      attendance_pct: 89.2,
      questions_asked: 42,
      debates_participated: 28,
      data_coverage_pct: 88.0,
      last_refreshed: now
    },
    {
      id: 'rep-3',
      name: 'Rajnath Singh',
      party: 'Bharatiya Janata Party (BJP)',
      office_title: 'Member of Parliament (Lok Sabha)',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      tenure_start: '2024-06-04',
      tenure_end: '2029-05-31',
      geography_id: 'geo-5',
      attendance_pct: 91.5,
      questions_asked: 2,
      debates_participated: 22,
      data_coverage_pct: 94.0,
      last_refreshed: now
    },
    {
      id: 'rep-4',
      name: 'Tejasvi Surya',
      party: 'Bharatiya Janata Party (BJP)',
      office_title: 'Member of Parliament (Lok Sabha)',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      tenure_start: '2024-06-04',
      tenure_end: '2029-05-31',
      geography_id: 'geo-7',
      attendance_pct: 93.0,
      questions_asked: 68,
      debates_participated: 34,
      data_coverage_pct: 92.0,
      last_refreshed: now
    },
    {
      id: 'rep-5',
      name: 'Smt. Rampyari Devi',
      party: 'Independent',
      office_title: 'Gram Pradhan',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      tenure_start: '2021-05-02',
      tenure_end: '2026-05-01',
      geography_id: 'geo-4',
      attendance_pct: 98.0,
      questions_asked: 0,
      debates_participated: 12,
      data_coverage_pct: 95.0,
      last_refreshed: now
    }
  ];

  // Roles & Attributions
  const roles = [
    { id: 'r-1', person_id: 'rep-1', institution_name: 'Lok Sabha / Ministry of Statistics & PI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends works under MPLADS guidelines up to annual entitlement.' },
    { id: 'r-2', person_id: 'rep-1', institution_name: 'Varanasi District Authority', role_type: 'DIRECT_SANCTION', description: 'Sanctions MPLADS works recommended by MP.' },
    { id: 'r-3', person_id: 'rep-2', institution_name: 'UP Urban Development Dept', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends assembly constituency works under Vidhan Sabha LAD fund.' },
    { id: 'r-4', person_id: 'rep-5', institution_name: 'Chiraigaon Gram Panchayat', role_type: 'IMPLEMENTING_AUTHORITY', description: 'Executes 15th Finance Commission & GPDP rural development schemes.' },
  ];

  // Fund Ledgers (5-Account View tracked down to exact Rupees)
  const fundLedgers = [
    {
      id: 'fl-1',
      entity_id: 'rep-1',
      entity_type: 'PERSON',
      scheme_name: 'MPLADS (Lok Sabha)',
      fiscal_year: '2025-2026',
      entitled_amount: 50000000, // ₹5.00 Cr
      allocated_amount: 50000000, // ₹5.00 Cr
      released_amount: 25000000,  // ₹2.50 Cr
      sanctioned_amount: 21850420, // ₹2,18,50,420 (down to exact rupee)
      expended_amount: 18420150,   // ₹1,84,20,150
      unspent_balance: 6579850,    // ₹65,79,850
      last_updated: now,
      source_name: 'MPLADS Official Portal',
      source_url: 'https://mplads.gov.in/MPLADS/Dashboard/DashBoard.aspx'
    },
    {
      id: 'fl-2',
      entity_id: 'rep-2',
      entity_type: 'PERSON',
      scheme_name: 'UP MLALAD Scheme',
      fiscal_year: '2025-2026',
      entitled_amount: 50000000, // ₹5.00 Cr
      allocated_amount: 50000000,
      released_amount: 30000000,
      sanctioned_amount: 27500000,
      expended_amount: 22100800,
      unspent_balance: 7899200,
      last_updated: now,
      source_name: 'UP Planning Dept Portal',
      source_url: 'https://udd.up.gov.in/'
    },
    {
      id: 'fl-3',
      entity_id: 'geo-3',
      entity_type: 'GEOGRAPHY',
      scheme_name: 'City Finance Municipal Revenue & 15th FC Urban Grant',
      fiscal_year: '2025-2026',
      entitled_amount: 1200000000, // ₹120.00 Cr
      allocated_amount: 1200000000,
      released_amount: 850000000,
      sanctioned_amount: 790000000,
      expended_amount: 645025000,
      unspent_balance: 204975000,
      last_updated: now,
      source_name: 'City Finance National Portal',
      source_url: 'https://www.cityfinance.in/'
    },
    {
      id: 'fl-4',
      entity_id: 'geo-4',
      entity_type: 'GEOGRAPHY',
      scheme_name: 'eGramSwaraj Gram Panchayat Development Plan (GPDP)',
      fiscal_year: '2025-2026',
      entitled_amount: 4500000, // ₹45.00 Lakh
      allocated_amount: 4500000,
      released_amount: 3800000,
      sanctioned_amount: 3650000,
      expended_amount: 3120400,
      unspent_balance: 679600,
      last_updated: now,
      source_name: 'eGramSwaraj NIC Portal',
      source_url: 'https://egramswaraj.gov.in/'
    },
    {
      id: 'fl-5',
      entity_id: 'rep-3',
      entity_type: 'PERSON',
      scheme_name: 'MPLADS (Lok Sabha)',
      fiscal_year: '2025-2026',
      entitled_amount: 50000000,
      allocated_amount: 50000000,
      released_amount: 25000000,
      sanctioned_amount: 23100000,
      expended_amount: 19800000,
      unspent_balance: 5200000,
      last_updated: now,
      source_name: 'MPLADS Official Portal',
      source_url: 'https://mplads.gov.in/'
    },
    {
      id: 'fl-6',
      entity_id: 'rep-4',
      entity_type: 'PERSON',
      scheme_name: 'MPLADS (Lok Sabha)',
      fiscal_year: '2025-2026',
      entitled_amount: 50000000,
      allocated_amount: 50000000,
      released_amount: 25000000,
      sanctioned_amount: 24200000,
      expended_amount: 21500000,
      unspent_balance: 3500000,
      last_updated: now,
      source_name: 'MPLADS Official Portal',
      source_url: 'https://mplads.gov.in/'
    }
  ];

  // Projects
  const projects = [
    {
      id: 'proj-1',
      source_work_id: 'MPLADS-2025-VAR-0012',
      title: 'Construction of Smart Solar Community Learning Center & Digital Library',
      sector: 'Education & Digital Infra',
      geography_id: 'geo-1',
      recommender_id: 'rep-1',
      implementing_dept: 'Varanasi Public Works Dept (PWD)',
      sanctioned_cost: 4500000, // ₹45.00 Lakh
      spent_cost: 4120500, // ₹41,20,500
      status: 'COMPLETED',
      physical_progress_pct: 100,
      lat: 25.3200,
      lon: 82.9800,
      approval_date: '2025-01-15',
      completion_date: '2025-07-20',
      source_name: 'MPLADS GIS Dashboard',
      source_url: 'https://mplads.gov.in/MPLADS/Dashboard/WorkDetail.aspx?id=0012'
    },
    {
      id: 'proj-2',
      source_work_id: 'MPLADS-2025-VAR-0045',
      title: 'Installation of High-Capacity RO Water Purification Plants in Assi Ghat & Lanka Wards',
      sector: 'Drinking Water & Sanitation',
      geography_id: 'geo-1',
      recommender_id: 'rep-1',
      implementing_dept: 'U.P. Jal Nigam Varanasi',
      sanctioned_cost: 3200000, // ₹32.00 Lakh
      spent_cost: 2150000, // ₹21,50,000
      status: 'UNDERWAY',
      physical_progress_pct: 75,
      lat: 25.2850,
      lon: 82.9980,
      approval_date: '2025-03-10',
      completion_date: '2025-10-15',
      source_name: 'MPLADS GIS Dashboard',
      source_url: 'https://mplads.gov.in/MPLADS/Dashboard/WorkDetail.aspx?id=0045'
    },
    {
      id: 'proj-3',
      source_work_id: 'MLALAD-2025-VC-0089',
      title: 'Resurfacing & Interlocking Pavement of Cantt Railway Colony Main Road',
      sector: 'Roads & Transportation',
      geography_id: 'geo-2',
      recommender_id: 'rep-2',
      implementing_dept: 'Varanasi Municipal Corporation Engineering Dept',
      sanctioned_cost: 2800000, // ₹28.00 Lakh
      spent_cost: 2800000,
      status: 'COMPLETED',
      physical_progress_pct: 100,
      lat: 25.3380,
      lon: 82.9850,
      approval_date: '2025-02-01',
      completion_date: '2025-06-30',
      source_name: 'UP MLALAD Portal',
      source_url: 'https://udd.up.gov.in/works/0089'
    },
    {
      id: 'proj-4',
      source_work_id: 'EGRAM-2025-CHIR-004',
      title: 'Solar Powered Submersible Water Well & Pipeline Extension for Chiraigaon Village',
      sector: 'Rural Drinking Water',
      geography_id: 'geo-4',
      recommender_id: 'rep-5',
      implementing_dept: 'Chiraigaon Gram Panchayat Works Committee',
      sanctioned_cost: 1250000, // ₹12.50 Lakh
      spent_cost: 850000,
      status: 'UNDERWAY',
      physical_progress_pct: 65,
      lat: 25.3820,
      lon: 83.0240,
      approval_date: '2025-04-12',
      completion_date: '2025-11-30',
      source_name: 'eGramSwaraj Asset Directory',
      source_url: 'https://egramswaraj.gov.in/asset/004'
    },
    {
      id: 'proj-5',
      source_work_id: 'MPLADS-2025-VAR-0088',
      title: 'Construction of Multi-Purpose Mahila Skill Training Hall',
      sector: 'Community Infrastructure',
      geography_id: 'geo-1',
      recommender_id: 'rep-1',
      implementing_dept: 'District Rural Development Agency (DRDA)',
      sanctioned_cost: 5000000, // ₹50.00 Lakh
      spent_cost: 1200000,
      status: 'STALLED',
      physical_progress_pct: 25,
      lat: 25.3500,
      lon: 82.9500,
      approval_date: '2024-11-20',
      completion_date: '2025-08-30',
      source_name: 'MPLADS GIS Dashboard',
      source_url: 'https://mplads.gov.in/MPLADS/Dashboard/WorkDetail.aspx?id=0088'
    }
  ];

  // Contracts
  const contracts = [
    {
      id: 'cnt-1',
      project_id: 'proj-1',
      tender_id: 'CPPP-2025-PWD-VAR-8841',
      vendor_name: 'Purvanchal Infra & Solar Solutions Pvt Ltd',
      tender_value: 4600000,
      award_value: 4450000,
      awarded_date: '2025-01-28',
      status: 'AWARDED',
      cppp_url: 'https://eprocure.gov.in/epublish/app?page=FrontEndTenderDetails&service=page&tn=8841'
    },
    {
      id: 'cnt-2',
      project_id: 'proj-2',
      tender_id: 'CPPP-2025-JAL-VAR-9012',
      vendor_name: 'Ganga Pure Tech Systems Ltd',
      tender_value: 3300000,
      award_value: 3180000,
      awarded_date: '2025-03-20',
      status: 'AWARDED',
      cppp_url: 'https://eprocure.gov.in/epublish/app?page=FrontEndTenderDetails&service=page&tn=9012'
    }
  ];

  // Audit Findings
  const auditFindings = [
    {
      id: 'aud-1',
      entity_id: 'rep-1',
      report_title: 'CAG Local Bodies Audit Report 2025 - MPLADS Sanction & Financial Progress',
      audit_year: '2024-25',
      finding_severity: 'MEDIUM',
      finding_text: 'Delay of 90 days in physical execution of Mahila Skill Training Hall (proj-5) despite release of 1st tranche of funds.',
      amount_involved: 1200000,
      status: 'IN_REVIEW',
      source_url: 'https://cag.gov.in/en/audit-report/details/125177'
    },
    {
      id: 'aud-2',
      entity_id: 'geo-3',
      report_title: 'CAG Urban Local Bodies Audit 2025 - Varanasi Municipal Revenue Reconciliation',
      audit_year: '2024-25',
      finding_severity: 'LOW',
      finding_text: 'Minor variation of 0.4% between published service-level benchmarks and actual PFMS ledger entries for drainage maintenance.',
      amount_involved: 450000,
      status: 'RESOLVED',
      source_url: 'https://cag.gov.in/en/audit-report/details/125188'
    }
  ];

  // Citizen Evidence
  const citizenEvidence = [
    {
      id: 'ev-1',
      project_id: 'proj-1',
      user_name: 'Anand Kumar (Varanasi Citizen)',
      issue_type: 'COMPLETED_VERIFIED',
      description: 'Inspected the Smart Solar Community Center today. Solar panels installed and fully functional with 20 computers inside.',
      image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
      lat: 25.3201,
      lon: 82.9802,
      timestamp: '2025-08-15 14:30:00',
      moderation_status: 'APPROVED'
    },
    {
      id: 'ev-2',
      project_id: 'proj-5',
      user_name: 'Priya Sharma (Local Journalist)',
      issue_type: 'INCOMPLETE_WORK',
      description: 'Site visit shows only foundation pillars constructed. Work halted since June 2025 despite official 25% expenditure record.',
      image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600',
      lat: 25.3502,
      lon: 82.9501,
      timestamp: '2025-08-20 11:15:00',
      moderation_status: 'APPROVED'
    }
  ];

  // Live Activity Logs (initial seed events)
  const initialLogs = [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      entity_id: 'rep-1',
      entity_name: 'Narendra Modi (MP Varanasi)',
      event_type: 'SPEND_VOUCHER',
      amount_delta: 2500, // ₹2,500 spend voucher recorded
      new_total_amount: 18420150,
      description: 'Spend voucher #V-9942 recorded for Solar Center maintenance (exact delta: +₹2,500).',
      source_name: 'MPLADS Official API',
      provenance_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      entity_id: 'geo-4',
      entity_name: 'Chiraigaon Gram Panchayat',
      event_type: 'FUND_RELEASE',
      amount_delta: 1, // ₹1 precision test event!
      new_total_amount: 3800001,
      description: 'PFMS 15th FC tranche bank interest adjustment received (exact delta: +₹1).',
      source_name: 'eGramSwaraj PFMS Gateway',
      provenance_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    }
  ];

  // Insert all
  const insertGeo = db.prepare(`INSERT INTO geographies VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  geographies.forEach(g => insertGeo.run(g.id, g.lgd_code, g.name, g.type, g.parent_id, g.state_name, g.lat, g.lon));
  insertGeo.finalize();

  const insertPerson = db.prepare(`INSERT INTO persons VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  persons.forEach(p => insertPerson.run(p.id, p.name, p.party, p.office_title, p.photo_url, p.tenure_start, p.tenure_end, p.geography_id, p.attendance_pct, p.questions_asked, p.debates_participated, p.data_coverage_pct, p.last_refreshed));
  insertPerson.finalize();

  const insertRole = db.prepare(`INSERT INTO roles VALUES (?, ?, ?, ?, ?)`);
  roles.forEach(r => insertRole.run(r.id, r.person_id, r.institution_name, r.role_type, r.description));
  insertRole.finalize();

  const insertLedger = db.prepare(`INSERT INTO fund_ledgers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  fundLedgers.forEach(fl => insertLedger.run(fl.id, fl.entity_id, fl.entity_type, fl.scheme_name, fl.fiscal_year, fl.entitled_amount, fl.allocated_amount, fl.released_amount, fl.sanctioned_amount, fl.expended_amount, fl.unspent_balance, fl.last_updated, fl.source_name, fl.source_url));
  insertLedger.finalize();

  const insertProj = db.prepare(`INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  projects.forEach(pj => insertProj.run(pj.id, pj.source_work_id, pj.title, pj.sector, pj.geography_id, pj.recommender_id, pj.implementing_dept, pj.sanctioned_cost, pj.spent_cost, pj.status, pj.physical_progress_pct, pj.lat, pj.lon, pj.approval_date, pj.completion_date, pj.source_name, pj.source_url));
  insertProj.finalize();

  const insertCnt = db.prepare(`INSERT INTO contracts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  contracts.forEach(c => insertCnt.run(c.id, c.project_id, c.tender_id, c.vendor_name, c.tender_value, c.award_value, c.awarded_date, c.status, c.cppp_url));
  insertCnt.finalize();

  const insertAud = db.prepare(`INSERT INTO audit_findings VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  auditFindings.forEach(a => insertAud.run(a.id, a.entity_id, a.report_title, a.audit_year, a.finding_severity, a.finding_text, a.amount_involved, a.status, a.source_url));
  insertAud.finalize();

  const insertEv = db.prepare(`INSERT INTO citizen_evidence VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  citizenEvidence.forEach(e => insertEv.run(e.id, e.project_id, e.user_name, e.issue_type, e.description, e.image_url, e.lat, e.lon, e.timestamp, e.moderation_status));
  insertEv.finalize();

  const insertLog = db.prepare(`INSERT INTO live_activity_logs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  initialLogs.forEach(l => insertLog.run(l.id, l.timestamp, l.entity_id, l.entity_name, l.event_type, l.amount_delta, l.new_total_amount, l.description, l.source_name, l.provenance_hash));
  insertLog.finalize();

  console.log("Database seeded successfully!");
  seedStateSchemesAndResolvers(db);
  resolve(db);
}

function seedStateSchemesAndResolvers(db) {
  console.log("Seeding State Scheme Registry and Responsibility Resolvers...");
  
  const schemes = [
    {
      id: 'sch-up',
      state_name: 'Uttar Pradesh',
      scheme_name: 'Vidhan Sabha Vikas Nidhi (UP MLALAD)',
      annual_entitlement: 50000000, // ₹5.00 Cr
      eligible_works: 'Roads, street lights, community halls, drinking water handpumps, school boundary walls',
      approval_chain: 'MLA Recommendation -> Chief Development Officer (CDO) / District Magistrate -> Technical Sanction -> Tender',
      implementing_authority: 'Rural Engineering Dept (RED) / Nagar Nigam / PWD',
      portal_url: 'https://udd.up.gov.in/',
      audit_mechanism: 'CAG State Accounts + Local Fund Audit Dept'
    },
    {
      id: 'sch-delhi',
      state_name: 'Delhi (NCT)',
      scheme_name: 'Delhi MLALAD Fund Scheme',
      annual_entitlement: 100000000, // ₹10.00 Cr
      eligible_works: 'Streets, drainage, LED lighting, parks, local infrastructure, school facilities',
      approval_chain: 'MLA Proposal -> Urban Development Dept -> DUDA -> Work Order',
      implementing_authority: 'Delhi Urban Development Agency (DUDA) / MCD / DSIIDC',
      portal_url: 'https://udd.delhi.gov.in/ud/mlalad-fund-guideline',
      audit_mechanism: 'Directorate of Audit, Delhi Govt + CAG'
    },
    {
      id: 'sch-assam',
      state_name: 'Assam',
      scheme_name: 'MLA Local Area Development (MLALAD) Scheme',
      annual_entitlement: 10000000, // ₹1.00 Cr
      eligible_works: 'Community welfare, rural roads, water supply, health sub-centre renovation',
      approval_chain: 'MLA Recommendation -> Deputy Commissioner -> Approval -> Executive Agency',
      implementing_authority: 'Panchayat & Rural Development / PWD Assam',
      portal_url: 'https://dimahasao.assam.gov.in/index.php/scheme-page/mla-lad',
      audit_mechanism: 'CAG Assam Local Bodies Audit'
    },
    {
      id: 'sch-mh',
      state_name: 'Maharashtra',
      scheme_name: 'MLA/MLC Local Development Programme',
      annual_entitlement: 50000000, // ₹5.00 Cr
      eligible_works: 'Drinking water, public sanitation, roads, education infrastructure, electrification',
      approval_chain: 'MLA Proposal -> District Planning Committee (DPC) -> District Collector -> Sanction',
      implementing_authority: 'Zilla Parishad Engineering / PWD Maharashtra',
      portal_url: 'https://divcomnashik.maharashtra.gov.in/en/planning-branch/',
      audit_mechanism: 'CAG Civil & Commercial Audit, Maharashtra'
    }
  ];

  const resolvers = [
    {
      id: 'res-1',
      issue_sector: 'Roads & Potholes',
      problem_title: 'Damaged Internal Colony or Ward Road',
      recommender_role: 'Municipal Ward Councillor / MLA',
      sanctioning_body: 'Municipal Commissioner / Executive Engineer',
      executing_dept: 'Municipal Corporation (Nagar Nigam) Engineering Wing',
      oversight_institution: 'Ward Committee / Standing Committee (Works)',
      cpgrams_category: 'Ministry of Housing and Urban Affairs / State Urban Dept',
      guidance_notes: 'Internal roads within municipal limits are under Urban Local Body (ULB) jurisdiction. Major highways are under State PWD or NHAI.'
    },
    {
      id: 'res-2',
      issue_sector: 'Drinking Water Supply',
      problem_title: 'Contaminated Tap Water or Pipeline Leakage',
      recommender_role: 'Elected Councillor / Gram Pradhan',
      sanctioning_body: 'Jal Nigam / Public Health Engineering Dept (PHED)',
      executing_dept: 'Jal Sansthan / Jal Nigam Maintenance Division',
      oversight_institution: 'District Water & Sanitation Mission (DWSM)',
      cpgrams_category: 'Department of Drinking Water and Sanitation (Jal Jeevan Mission)',
      guidance_notes: 'Rural tap water falls under Jal Jeevan Mission & Gram Panchayat VWSC. Urban water falls under Municipal Jal Sansthan.'
    },
    {
      id: 'res-3',
      issue_sector: 'Sewage & Drainage',
      problem_title: 'Clogged Open Drain or Overflowing Sewer',
      recommender_role: 'Ward Member / Pradhan',
      sanctioning_body: 'Health Officer / Drainage Executive Engineer',
      executing_dept: 'Municipal Sanitation & Drainage Maintenance Dept',
      oversight_institution: 'Mayor-in-Council / District Magistrate',
      cpgrams_category: 'Swachh Bharat Mission Urban / Rural',
      guidance_notes: 'Routine cleaning is the responsibility of municipal safai staff. Construction of major nullahs requires District or AMRUT sanction.'
    },
    {
      id: 'res-4',
      issue_sector: 'Rural School Infrastructure',
      problem_title: 'Dilapidated Primary School Building / Missing Toilets',
      recommender_role: 'Gram Pradhan / MLA / MP',
      sanctioning_body: 'Basic Shiksha Adhikari (BSA) / District Magistrate',
      executing_dept: 'Rural Engineering Service (RES) / Samagra Shiksha Abhiyan',
      oversight_institution: 'School Management Committee (SMC) & Gram Panchayat',
      cpgrams_category: 'Department of School Education and Literacy',
      guidance_notes: 'Gram Panchayats have statutory role under 11th Schedule (Article 243G) for primary education maintenance using Composite School Grants.'
    }
  ];

  const stmtScheme = db.prepare(`INSERT OR IGNORE INTO state_schemes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  schemes.forEach(s => stmtScheme.run(s.id, s.state_name, s.scheme_name, s.annual_entitlement, s.eligible_works, s.approval_chain, s.implementing_authority, s.portal_url, s.audit_mechanism));
  stmtScheme.finalize();

  const stmtRes = db.prepare(`INSERT OR IGNORE INTO responsibility_resolvers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  resolvers.forEach(r => stmtRes.run(r.id, r.issue_sector, r.problem_title, r.recommender_role, r.sanctioning_body, r.executing_dept, r.oversight_institution, r.cpgrams_category, r.guidance_notes));
  stmtRes.finalize();

  console.log("State Schemes and Responsibility Resolvers seeded successfully!");
}

export default db;
