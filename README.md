# Jan Nigrani (जन निगरानी)
### India Public Accountability & Development Graph Platform

> **Live Public Accountability Graph**: Following the money, the work, the evidence, and the responsibility trail for elected representatives (MPs, MLAs, Mayors, Pradhans) and local governments across India.

Built according to the official **Jan Nigrani Product Requirements Document (PRD v0.1)**.

---

## 🌟 Key Features

1. **Continuous Real-Time Live Sync (down to ₹1 precision)**
   - Continuous background sync engine connecting to government sources (MPLADS, eGramSwaraj, City Finance, ECI, CPPP).
   - Instant real-time transaction alerts and 1-rupee precision delta broadcasting via Server-Sent Events (SSE) with automatic polling fallback.
   - Cryptographic SHA-256 provenance hash generated for every single transaction.

2. **5-Account Financial Ledger (PRD Section 6)**
   - Segregates every public fund into:
     - **Entitled Ceiling**: Total statutory eligibility under guidelines
     - **Allocated Budget**: Assigned scheme grant
     - **Released Tranches**: Funds physically transferred
     - **Sanctioned Commitments**: Approved work orders
     - **Expended (Spent)**: Audited financial progress down to ₹1
     - **Unspent Balance**: Remaining unutilized funds

3. **PRD Signature Money Trail View (Section 6.3)**
   - Click from Central/State Grant Releases &rarr; Sanction Orders &rarr; Individual Projects &rarr; CPPP e-Procurement Contracts &rarr; Geo-tagged Assets &rarr; CAG Audit Findings.

4. **"Who is Responsible?" Civic Resolver (PRD Section 34)**
   - Eliminates confusion over governance authority by mapping civic problems (e.g. Roads, Water, Drainage, Schools) to the exact statutory chain:
     - **Recommending Official** (Councillor / MLA / MP / Pradhan)
     - **Sanctioning Authority** (District Magistrate / Municipal Commissioner / BSA)
     - **Executing Department** (PWD / Jal Nigam / Nagar Nigam Engineering)
     - **Oversight Body & CPGRAMS Redressal**

5. **State Scheme Registry for MLAs (PRD Section 11.2)**
   - Configurable registry modeling state-specific MLALAD framework variations:
     - **Uttar Pradesh**: Vidhan Sabha Vikas Nidhi (₹5.00 Cr)
     - **Delhi (NCT)**: Delhi MLALAD Fund Scheme (₹10.00 Cr)
     - **Assam**: MLA Local Area Development Scheme (₹1.00 Cr)
     - **Maharashtra**: MLA/MLC Local Development Programme (₹5.00 Cr)

6. **Role Attribution Taxonomy (PRD Section 5.1)**
   - Prevents false political attribution by explicitly differentiating:
     - *Direct Recommendation*
     - *Direct Sanction*
     - *Implementing Authority*
     - *Portfolio Responsibility*
     - *Jurisdiction Exposure*

7. **Normalized Peer Comparison Engine (PRD Section 10)**
   - Like-for-like comparison between elected representatives of identical roles (MP vs MP, MLA vs MLA) with tenure normalization and data-completeness adjustments.

8. **GIS Spatial Project Map (PRD Section 7)**
   - Leaflet-powered GIS map visualizing infrastructure works across Parliamentary and Assembly constituencies.

9. **Citizen Ground Evidence & Community Moderation Desk (PRD Section 16 & 32)**
   - Interface for uploading geotagged verification photos and reporting halted/incomplete works without modifying official government records.
   - Built-in moderation queue for verifying submissions.

10. **Open Data Citation Pack Exporter (PRD Section 21 Journey B & 34)**
    - 1-click JSON citation pack download for journalists and civic watchdogs.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Leaflet, React-Leaflet
- **Backend & Ingestion**: Express.js, Server-Sent Events (SSE), SQLite, Cryptographic Hash Generator
- **Deployment**: Vercel Serverless Functions (`api/index.js`) + Single Page Application routing (`vercel.json`)

---

## 🚀 Getting Started

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Backend Server**:
   ```bash
   npm run server
   ```

3. **Start Frontend Client**:
   ```bash
   npm run dev
   ```

4. **Or run concurrently**:
   ```bash
   npm start
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 PRD Source Alignment

Developed in compliance with the Jan Nigrani Product Requirements Document (PRD v0.1) based on official government sources including:
- **MPLADS**: Ministry of Statistics and Programme Implementation
- **eGramSwaraj & LGD**: Ministry of Panchayati Raj
- **City Finance**: Ministry of Housing and Urban Affairs
- **ECI**: Election Commission of India (Candidate Affidavits & Results)
- **CPPP**: Central Public Procurement Portal
- **CAG**: Comptroller and Auditor General of India
- **CPGRAMS**: Centralized Public Grievance Redress and Monitoring System

---

## 📄 License
Licensed under the Government Open Data License - India (GODL-India) / Open Civic Tech.
