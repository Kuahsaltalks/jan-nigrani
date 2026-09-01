import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  panIndiaGeographies,
  panIndiaPersons,
  panIndiaRoles,
  panIndiaFundLedgers,
  panIndiaProjects
} from './panIndiaData.js';

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
        type TEXT,
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
        last_refreshed TEXT,
        tenure_label TEXT,
        tenure_status TEXT,
        status_note TEXT
      )`);

      // 3. Roles & Attribution Taxonomy
      db.run(`CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        person_id TEXT,
        institution_name TEXT,
        role_type TEXT,
        description TEXT
      )`);

      // 4. Fund Sources & 5-Account Ledger (tracked down to ₹1 precision)
      db.run(`CREATE TABLE IF NOT EXISTS fund_ledgers (
        id TEXT PRIMARY KEY,
        entity_id TEXT,
        entity_type TEXT,
        scheme_name TEXT,
        fiscal_year TEXT,
        entitled_amount INTEGER,
        allocated_amount INTEGER,
        released_amount INTEGER,
        sanctioned_amount INTEGER,
        expended_amount INTEGER,
        unspent_balance INTEGER,
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
        recommender_id TEXT,
        implementing_dept TEXT,
        sanctioned_cost INTEGER,
        spent_cost INTEGER,
        status TEXT,
        physical_progress_pct INTEGER,
        lat REAL,
        lon REAL,
        approval_date TEXT,
        completion_date TEXT,
        source_name TEXT,
        source_url TEXT,
        proof_status TEXT,
        proof_by TEXT,
        proof_summary TEXT,
        image_urls TEXT
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
        finding_severity TEXT,
        finding_text TEXT,
        amount_involved INTEGER,
        status TEXT,
        source_url TEXT
      )`);

      // 8. Citizen Evidence & Verification Reports
      db.run(`CREATE TABLE IF NOT EXISTS citizen_evidence (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        user_name TEXT,
        issue_type TEXT,
        description TEXT,
        image_url TEXT,
        lat REAL,
        lon REAL,
        timestamp TEXT,
        moderation_status TEXT
      )`);

      // 9. Live Activity Log (1-rupee level precision transaction feed)
      db.run(`CREATE TABLE IF NOT EXISTS live_activity_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        entity_id TEXT,
        entity_name TEXT,
        event_type TEXT,
        amount_delta INTEGER,
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

      // Seed / update full Pan-India dataset on startup
      seedPanIndiaDatabase(db, resolve, reject);
    });
  });
}

function seedPanIndiaDatabase(db, resolve, reject) {
  console.log("Seeding Pan-India Public Accountability Graph...");

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const insertGeo = db.prepare(`INSERT OR REPLACE INTO geographies VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    panIndiaGeographies.forEach(g => insertGeo.run(g.id, g.lgd_code, g.name, g.type, g.parent_id, g.state_name, g.lat, g.lon));
    insertGeo.finalize();

    const insertPerson = db.prepare(`INSERT OR REPLACE INTO persons VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    panIndiaPersons.forEach(p => insertPerson.run(
      p.id, p.name, p.party, p.office_title, p.photo_url, p.tenure_start, p.tenure_end, p.geography_id,
      p.attendance_pct, p.questions_asked, p.debates_participated, p.data_coverage_pct, p.last_refreshed,
      p.tenure_label || `${p.tenure_start} – ${p.tenure_end}`,
      p.tenure_status || 'CURRENT_INCUMBENT',
      p.status_note || 'Active tenure in official record.'
    ));
    insertPerson.finalize();

    const insertRole = db.prepare(`INSERT OR REPLACE INTO roles VALUES (?, ?, ?, ?, ?)`);
    panIndiaRoles.forEach(r => insertRole.run(r.id, r.person_id, r.institution_name, r.role_type, r.description));
    insertRole.finalize();

    const insertLedger = db.prepare(`INSERT OR REPLACE INTO fund_ledgers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    panIndiaFundLedgers.forEach(fl => insertLedger.run(fl.id, fl.entity_id, fl.entity_type, fl.scheme_name, fl.fiscal_year, fl.entitled_amount, fl.allocated_amount, fl.released_amount, fl.sanctioned_amount, fl.expended_amount, fl.unspent_balance, fl.last_updated, fl.source_name, fl.source_url));
    insertLedger.finalize();

    const insertProj = db.prepare(`INSERT OR REPLACE INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    panIndiaProjects.forEach(pj => insertProj.run(
      pj.id, pj.source_work_id, pj.title, pj.sector, pj.geography_id, pj.recommender_id, pj.implementing_dept,
      pj.sanctioned_cost, pj.spent_cost, pj.status, pj.physical_progress_pct, pj.lat, pj.lon,
      pj.approval_date, pj.completion_date, pj.source_name, pj.source_url,
      pj.proof_status || 'UNVERIFIED_NO_PROOF',
      pj.proof_by || 'None - No proof submitted',
      pj.proof_summary || 'No proof submitted',
      pj.image_urls || '[]'
    ));
    insertProj.finalize();

  // State Schemes
  const schemes = [
    {
      id: 'sch-up',
      state_name: 'Uttar Pradesh',
      scheme_name: 'Vidhan Sabha Vikas Nidhi (UP MLALAD)',
      annual_entitlement: 50000000,
      eligible_works: 'Roads, street lights, community halls, drinking water handpumps, school boundary walls',
      approval_chain: 'MLA Recommendation -> CDO / DM -> Technical Sanction -> Tender',
      implementing_authority: 'Rural Engineering Dept (RED) / Nagar Nigam / PWD',
      portal_url: 'https://udd.up.gov.in/',
      audit_mechanism: 'CAG State Accounts + Local Fund Audit Dept'
    },
    {
      id: 'sch-uk',
      state_name: 'Uttarakhand',
      scheme_name: 'Uttarakhand Vidhan Sabha LAD Fund',
      annual_entitlement: 50000000,
      eligible_works: 'Hill slope retaining walls, drinking water springs, road repair, solar street lights',
      approval_chain: 'MLA Proposal -> District Planning Office -> District Magistrate -> Executive Agency',
      implementing_authority: 'Uttarakhand PWD / UREDA / Jal Sansthan',
      portal_url: 'https://uk.gov.in/',
      audit_mechanism: 'CAG Uttarakhand State Audit'
    },
    {
      id: 'sch-kl',
      state_name: 'Kerala',
      scheme_name: 'Special Development Fund for MLAs (Kerala SDF)',
      annual_entitlement: 50000000,
      eligible_works: 'School modernization, coastal protection, primary health sub-centres, village roads',
      approval_chain: 'MLA Proposal -> District Collector -> Administrative Sanction -> AS/TS',
      implementing_authority: 'Kerala PWD / KWA / Local Self Government Dept (LSGD)',
      portal_url: 'https://lsgkerala.gov.in/',
      audit_mechanism: 'Kerala State Local Fund Audit + CAG'
    },
    {
      id: 'sch-as',
      state_name: 'Assam',
      scheme_name: 'Assam MLA Local Area Development (MLALAD) Scheme',
      annual_entitlement: 10000000,
      eligible_works: 'Flood shelter, village connectivity, drinking water supply, health sub-centre renovation',
      approval_chain: 'MLA Recommendation -> Deputy Commissioner -> Approval -> Executive Agency',
      implementing_authority: 'Panchayat & Rural Development / PWD Assam',
      portal_url: 'https://dimahasao.assam.gov.in/index.php/scheme-page/mla-lad',
      audit_mechanism: 'CAG Assam Local Bodies Audit'
    },
    {
      id: 'sch-delhi',
      state_name: 'Delhi (NCT)',
      scheme_name: 'Delhi MLALAD Fund Scheme',
      annual_entitlement: 100000000,
      eligible_works: 'Streets, drainage, LED lighting, parks, local infrastructure, school facilities',
      approval_chain: 'MLA Proposal -> Urban Development Dept -> DUDA -> Work Order',
      implementing_authority: 'Delhi Urban Development Agency (DUDA) / MCD / DSIIDC',
      portal_url: 'https://udd.delhi.gov.in/ud/mlalad-fund-guideline',
      audit_mechanism: 'Directorate of Audit, Delhi Govt + CAG'
    },
    {
      id: 'sch-mh',
      state_name: 'Maharashtra',
      scheme_name: 'MLA/MLC Local Development Programme',
      annual_entitlement: 50000000,
      eligible_works: 'Drinking water, public sanitation, roads, education infrastructure, electrification',
      approval_chain: 'MLA Proposal -> District Planning Committee (DPC) -> District Collector -> Sanction',
      implementing_authority: 'Zilla Parishad Engineering / PWD Maharashtra',
      portal_url: 'https://divcomnashik.maharashtra.gov.in/en/planning-branch/',
      audit_mechanism: 'CAG Civil & Commercial Audit, Maharashtra'
    }
  ];

  const stmtScheme = db.prepare(`INSERT OR REPLACE INTO state_schemes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  schemes.forEach(s => stmtScheme.run(s.id, s.state_name, s.scheme_name, s.annual_entitlement, s.eligible_works, s.approval_chain, s.implementing_authority, s.portal_url, s.audit_mechanism));
  stmtScheme.finalize();

  // Responsibility Resolvers
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
      sanctioning_body: 'Jal Nigam / Public Health Engineering Dept (PHED) / KWA',
      executing_dept: 'Jal Sansthan / Jal Nigam Maintenance Division / KWA',
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

  const stmtRes = db.prepare(`INSERT OR REPLACE INTO responsibility_resolvers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  resolvers.forEach(r => stmtRes.run(r.id, r.issue_sector, r.problem_title, r.recommender_role, r.sanctioning_body, r.executing_dept, r.oversight_institution, r.cpgrams_category, r.guidance_notes));
  stmtRes.finalize();

    db.run("COMMIT", (err) => {
      if (err) return reject(err);
      console.log("Pan-India Database seeded and committed successfully!");
      resolve(db);
    });
  });
}

export default db;
