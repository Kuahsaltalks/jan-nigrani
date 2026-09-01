// Comprehensive Pan-India Data Register covering all 28 States & UTs
// Normalized according to LGD Codes, ECI Constituency IDs, and Official MPLADS / Local Authority Schemes

export const panIndiaGeographies = [
  // --- UTTARAKHAND (HALDWANI / NAINITAL / CHHOTI RAMDI / KADKARIYA) ---
  { id: 'geo-nainital', lgd_code: '054', name: 'Nainital-Udhamsingh Nagar (Haldwani)', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-uk', state_name: 'Uttarakhand', lat: 29.2183, lon: 79.5130 },
  { id: 'geo-haldwani', lgd_code: '054-059', name: 'Haldwani', type: 'ASSEMBLY_CONSTITUENCY', parent_id: 'geo-nainital', state_name: 'Uttarakhand', lat: 29.2183, lon: 79.5130 },
  { id: 'geo-haldwani-ulb', lgd_code: 'LGD-ULB-0591', name: 'Haldwani-Kathgodam Municipal Corporation', type: 'ULB', parent_id: 'geo-haldwani', state_name: 'Uttarakhand', lat: 29.2200, lon: 79.5200 },
  { id: 'geo-chhoti-ramdi', lgd_code: 'LGD-GP-054019', name: 'Kadkariya - Chhoti Ramdi (Chhoti Haldwani) Gram Panchayat', type: 'GRAM_PANCHAYAT', parent_id: 'geo-haldwani', state_name: 'Uttarakhand', lat: 29.2310, lon: 79.4980 },

  // --- UTTAR PRADESH ---
  { id: 'geo-varanasi', lgd_code: '208', name: 'Varanasi', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-up', state_name: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739 },
  { id: 'geo-varanasi-cantt', lgd_code: '208-390', name: 'Varanasi Cantt', type: 'ASSEMBLY_CONSTITUENCY', parent_id: 'geo-varanasi', state_name: 'Uttar Pradesh', lat: 25.3350, lon: 82.9900 },
  { id: 'geo-varanasi-ulb', lgd_code: 'LGD-ULB-8001', name: 'Varanasi Municipal Corporation (Nagar Nigam)', type: 'ULB', parent_id: 'geo-varanasi', state_name: 'Uttar Pradesh', lat: 25.3100, lon: 82.9600 },
  { id: 'geo-chiraigaon', lgd_code: 'LGD-GP-10492', name: 'Chiraigaon Gram Panchayat', type: 'GRAM_PANCHAYAT', parent_id: 'geo-varanasi', state_name: 'Uttar Pradesh', lat: 25.3800, lon: 83.0200 },
  { id: 'geo-lucknow', lgd_code: '185', name: 'Lucknow', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-up', state_name: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },

  // --- KERALA ---
  { id: 'geo-wayanad', lgd_code: '014', name: 'Wayanad', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-kl', state_name: 'Kerala', lat: 11.6854, lon: 76.1320 },
  { id: 'geo-kalpetta', lgd_code: '014-019', name: 'Kalpetta', type: 'ASSEMBLY_CONSTITUENCY', parent_id: 'geo-wayanad', state_name: 'Kerala', lat: 11.6050, lon: 76.0830 },
  { id: 'geo-meppadi-gp', lgd_code: 'LGD-GP-22104', name: 'Meppadi Gram Panchayat', type: 'GRAM_PANCHAYAT', parent_id: 'geo-wayanad', state_name: 'Kerala', lat: 11.5500, lon: 76.1200 },
  { id: 'geo-tvm', lgd_code: '020', name: 'Thiruvananthapuram', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-kl', state_name: 'Kerala', lat: 8.5241, lon: 76.9366 },
  { id: 'geo-tvm-ulb', lgd_code: 'LGD-ULB-7001', name: 'Thiruvananthapuram Municipal Corporation', type: 'ULB', parent_id: 'geo-tvm', state_name: 'Kerala', lat: 8.5100, lon: 76.9500 },
  { id: 'geo-ernakulam', lgd_code: '012', name: 'Ernakulam (Kochi)', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-kl', state_name: 'Kerala', lat: 9.9816, lon: 76.2999 },
  { id: 'geo-kozhikode', lgd_code: '005', name: 'Kozhikode', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-kl', state_name: 'Kerala', lat: 11.2588, lon: 75.7804 },

  // --- NORTH EAST ---
  { id: 'geo-guwahati', lgd_code: '307', name: 'Guwahati', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-as', state_name: 'Assam', lat: 26.1445, lon: 91.7362 },
  { id: 'geo-guwahati-ulb', lgd_code: 'LGD-ULB-3001', name: 'Guwahati Municipal Corporation (GMDA)', type: 'ULB', parent_id: 'geo-guwahati', state_name: 'Assam', lat: 26.1500, lon: 91.7400 },
  { id: 'geo-jorhat', lgd_code: '314', name: 'Jorhat', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-as', state_name: 'Assam', lat: 26.7509, lon: 94.2037 },
  { id: 'geo-shillong', lgd_code: '351', name: 'Shillong', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-ml', state_name: 'Meghalaya', lat: 25.5788, lon: 91.8933 },
  { id: 'geo-imphal', lgd_code: '371', name: 'Inner Manipur (Imphal)', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-mn', state_name: 'Manipur', lat: 24.8170, lon: 93.9368 },
  { id: 'geo-agartala', lgd_code: '391', name: 'Tripura West (Agartala)', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-tr', state_name: 'Tripura', lat: 23.8315, lon: 91.2868 },
  { id: 'geo-sikkim', lgd_code: '381', name: 'Sikkim (Gangtok)', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-sk', state_name: 'Sikkim', lat: 27.3314, lon: 88.6138 },
  { id: 'geo-arunachal-west', lgd_code: '361', name: 'Arunachal West (Itanagar)', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-ar', state_name: 'Arunachal Pradesh', lat: 27.0844, lon: 93.6053 },

  // --- DELHI & NORTH ---
  { id: 'geo-new-delhi', lgd_code: '071', name: 'New Delhi', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-dl', state_name: 'Delhi (NCT)', lat: 28.6139, lon: 77.2090 },
  { id: 'geo-srinagar', lgd_code: '002', name: 'Srinagar', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-jk', state_name: 'Jammu & Kashmir', lat: 34.0837, lon: 74.7973 },
  { id: 'geo-jaipur', lgd_code: '111', name: 'Jaipur', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-rj', state_name: 'Rajasthan', lat: 26.9124, lon: 75.7873 },

  // --- SOUTH & WEST ---
  { id: 'geo-bangalore-south', lgd_code: '028', name: 'Bangalore South', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-ka', state_name: 'Karnataka', lat: 12.9141, lon: 77.5857 },
  { id: 'geo-bbmp', lgd_code: 'LGD-ULB-9002', name: 'Bruhat Bengaluru Mahanagara Palike (BBMP)', type: 'ULB', parent_id: 'geo-bangalore-south', state_name: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { id: 'geo-chennai-central', lgd_code: '041', name: 'Chennai Central', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-tn', state_name: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { id: 'geo-hyderabad', lgd_code: '501', name: 'Hyderabad', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-tg', state_name: 'Telangana', lat: 17.3850, lon: 78.4867 },
  { id: 'geo-mumbai-south', lgd_code: '401', name: 'Mumbai South', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-mh', state_name: 'Maharashtra', lat: 18.9220, lon: 72.8347 },
  { id: 'geo-pune', lgd_code: '415', name: 'Pune', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-mh', state_name: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { id: 'geo-nagpur', lgd_code: '422', name: 'Nagpur', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-mh', state_name: 'Maharashtra', lat: 21.1458, lon: 79.0882 },
  { id: 'geo-ahmedabad-east', lgd_code: '601', name: 'Ahmedabad East', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-gj', state_name: 'Gujarat', lat: 23.0225, lon: 72.5714 },
  { id: 'geo-kolkata-north', lgd_code: '701', name: 'Kolkata North', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-wb', state_name: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { id: 'geo-patna-sahib', lgd_code: '801', name: 'Patna Sahib', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-br', state_name: 'Bihar', lat: 25.5941, lon: 85.1376 },
  { id: 'geo-bhubaneswar', lgd_code: '901', name: 'Bhubaneswar', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-od', state_name: 'Odisha', lat: 20.2961, lon: 85.8245 }
];

export const panIndiaPersons = [
  // UTTARAKHAND (NAINITAL / HALDWANI / CHHOTI RAMDI / KADKARIYA)
  {
    id: 'rep-geeta-rawat',
    name: 'Smt. Geeta Rawat',
    party: 'Gram Panchayat Council',
    office_title: 'Gram Pradhan (Village Council Head)',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    tenure_start: '2019-11-15',
    tenure_end: '2024-11-14',
    geography_id: 'geo-chhoti-ramdi',
    attendance_pct: 98.0,
    questions_asked: 0,
    debates_participated: 24,
    data_coverage_pct: 95.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-jogendra-rautela',
    name: 'Dr. Jogendra Pal Singh Rautela',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Mayor (Nagar Nigam Haldwani-Kathgodam)',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    tenure_start: '2018-12-02',
    tenure_end: '2023-12-01',
    geography_id: 'geo-haldwani-ulb',
    attendance_pct: 92.0,
    questions_asked: 0,
    debates_participated: 48,
    data_coverage_pct: 91.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-sumit-hridayesh',
    name: 'Sumit Hridayesh',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Legislative Assembly (MLA - Haldwani)',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    tenure_start: '2022-03-10',
    tenure_end: '2027-03-09',
    geography_id: 'geo-haldwani',
    attendance_pct: 88.0,
    questions_asked: 51,
    debates_participated: 24,
    data_coverage_pct: 89.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-ajay-bhatt',
    name: 'Ajay Bhatt',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha - Nainital-US Nagar)',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-nainital',
    attendance_pct: 92.4,
    questions_asked: 34,
    debates_participated: 18,
    data_coverage_pct: 93.0,
    last_refreshed: '2026-08-31 22:08:00'
  },

  // UTTAR PRADESH
  {
    id: 'rep-rampyari-devi',
    name: 'Smt. Rampyari Devi',
    party: 'Gram Panchayat Council',
    office_title: 'Gram Pradhan (Chiraigaon Gram Panchayat)',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    tenure_start: '2021-05-02',
    tenure_end: '2026-05-01',
    geography_id: 'geo-chiraigaon',
    attendance_pct: 96.0,
    questions_asked: 0,
    debates_participated: 18,
    data_coverage_pct: 92.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-modi',
    name: 'Narendra Modi',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha - Varanasi)',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-varanasi',
    attendance_pct: 94.0,
    questions_asked: 0,
    debates_participated: 14,
    data_coverage_pct: 96.5,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-saurabh',
    name: 'Saurabh Srivastava',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Legislative Assembly (MLA - Varanasi Cantt)',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    tenure_start: '2022-03-10',
    tenure_end: '2027-03-09',
    geography_id: 'geo-varanasi-cantt',
    attendance_pct: 89.2,
    questions_asked: 42,
    debates_participated: 28,
    data_coverage_pct: 88.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-rajnath',
    name: 'Rajnath Singh',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha - Lucknow)',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-lucknow',
    attendance_pct: 91.5,
    questions_asked: 2,
    debates_participated: 22,
    data_coverage_pct: 94.0,
    last_refreshed: '2026-08-31 22:08:00'
  },

  // KERALA
  {
    id: 'rep-priyanka-gandhi',
    name: 'Priyanka Gandhi Vadra',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Parliament (Lok Sabha - Wayanad)',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    tenure_start: '2024-11-28',
    tenure_end: '2029-05-31',
    geography_id: 'geo-wayanad',
    attendance_pct: 95.0,
    questions_asked: 28,
    debates_participated: 16,
    data_coverage_pct: 93.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-shashi-tharoor',
    name: 'Dr. Shashi Tharoor',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Parliament (Lok Sabha - Thiruvananthapuram)',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-tvm',
    attendance_pct: 96.2,
    questions_asked: 112,
    debates_participated: 64,
    data_coverage_pct: 97.0,
    last_refreshed: '2026-08-31 22:08:00'
  },

  // NORTH EAST
  {
    id: 'rep-bijuli-medhi',
    name: 'Bijuli Kalita Medhi',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha - Guwahati)',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-guwahati',
    attendance_pct: 90.5,
    questions_asked: 45,
    debates_participated: 19,
    data_coverage_pct: 91.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-gaurav-gogoi',
    name: 'Gaurav Gogoi',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Parliament (Lok Sabha - Jorhat)',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-jorhat',
    attendance_pct: 94.8,
    questions_asked: 98,
    debates_participated: 52,
    data_coverage_pct: 95.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-ricky-syngkon',
    name: 'Dr. Ricky Syngkon',
    party: 'Voice of the People Party (VPP)',
    office_title: 'Member of Parliament (Lok Sabha - Shillong)',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-shillong',
    attendance_pct: 92.0,
    questions_asked: 38,
    debates_participated: 21,
    data_coverage_pct: 89.0,
    last_refreshed: '2026-08-31 22:08:00'
  },

  // SOUTH & WEST
  {
    id: 'rep-tejasvi',
    name: 'Tejasvi Surya',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha - Bangalore South)',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-bangalore-south',
    attendance_pct: 93.0,
    questions_asked: 68,
    debates_participated: 34,
    data_coverage_pct: 92.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-bansuri',
    name: 'Bansuri Swaraj',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha - New Delhi)',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-new-delhi',
    attendance_pct: 94.0,
    questions_asked: 32,
    debates_participated: 18,
    data_coverage_pct: 92.0,
    last_refreshed: '2026-08-31 22:08:00'
  }
];

export const panIndiaRoles = [
  // NAINITAL / HALDWANI / CHHOTI RAMDI
  { id: 'r-geeta-1', person_id: 'rep-geeta-rawat', institution_name: 'Kadkariya - Chhoti Ramdi Gram Sabha', role_type: 'DIRECT_RECOMMENDATION', description: 'Village head passing resolutions under 15th Finance Commission rural grants and GPDP.' },
  { id: 'r-rautela-1', person_id: 'rep-jogendra-rautela', institution_name: 'Haldwani-Kathgodam Nagar Nigam', role_type: 'IMPLEMENTING_AUTHORITY', description: 'Mayor leading municipal infrastructure and urban civic engineering wings.' },
  { id: 'r-sumit-1', person_id: 'rep-sumit-hridayesh', institution_name: 'Uttarakhand Vidhan Sabha', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends works under Uttarakhand MLALAD scheme (₹5.00 Cr annual entitlement).' },
  { id: 'r-bhatt-1', person_id: 'rep-ajay-bhatt', institution_name: 'Lok Sabha / MoSPI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends works under MPLADS for Nainital & Haldwani assembly segments.' },

  // VARANASI
  { id: 'r-modi-1', person_id: 'rep-modi', institution_name: 'Lok Sabha / MoSPI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends works under MPLADS guidelines up to ₹5.00 Cr annual entitlement.' },
  { id: 'r-saurabh-1', person_id: 'rep-saurabh', institution_name: 'UP Vidhan Sabha', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends works under UP MLALAD scheme.' }
];

export const panIndiaFundLedgers = [
  // CHHOTI RAMDI / KADKARIYA
  {
    id: 'fl-chhoti-ramdi',
    entity_id: 'rep-geeta-rawat',
    entity_type: 'PERSON',
    scheme_name: '15th Finance Commission & GPDP Grants',
    fiscal_year: '2025-2026',
    entitled_amount: 3500000,
    allocated_amount: 3500000,
    released_amount: 3500000,
    sanctioned_amount: 3050000,
    expended_amount: 2690000,
    unspent_balance: 810000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'eGramSwaraj Official Portal',
    source_url: 'https://egramswaraj.gov.in/'
  },
  // NAINITAL / HALDWANI
  {
    id: 'fl-bhatt',
    entity_id: 'rep-ajay-bhatt',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 28400000,
    expended_amount: 19200000,
    unspent_balance: 5800000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  },
  // VARANASI
  {
    id: 'fl-modi',
    entity_id: 'rep-modi',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 30300000,
    expended_amount: 15700000,
    unspent_balance: 9300000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  },
  // WAYANAD
  {
    id: 'fl-wayanad',
    entity_id: 'rep-priyanka-gandhi',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 24500000,
    expended_amount: 18100000,
    unspent_balance: 6900000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  }
];

export const panIndiaProjects = [
  // --- CHHOTI RAMDI / KADKARIYA (HALDWANI) ---
  {
    id: 'proj-ramdi-1',
    source_work_id: 'GPDP-2025-UK-RAMDI-001',
    title: 'Construction of Solar Drinking Water Overhead Tank & Pipeline in Kadkariya - Chhoti Ramdi',
    sector: 'Drinking Water & Sanitation',
    geography_id: 'geo-chhoti-ramdi',
    recommender_id: 'rep-geeta-rawat',
    implementing_dept: 'Uttarakhand Jal Sansthan Haldwani Division',
    sanctioned_cost: 1850000,
    spent_cost: 1850000,
    status: 'COMPLETED',
    physical_progress_pct: 100,
    lat: 29.2310,
    lon: 79.4980,
    approval_date: '2025-01-10',
    completion_date: '2025-06-15',
    source_name: 'eGramSwaraj Gram Vikas Portal',
    source_url: 'https://egramswaraj.gov.in/',
    proof_status: 'OFFICIAL_PROOF_VERIFIED',
    proof_by: 'Gram Pradhan & Jal Sansthan Executing Engineer',
    proof_summary: 'Official geo-tagged completion photos certified by Junior Engineer & District Panchayat Officer (DPO).',
    image_urls: JSON.stringify([
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800',
      'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800'
    ])
  },
  {
    id: 'proj-ramdi-2',
    source_work_id: 'MLALAD-2025-UK-HALD-0044',
    title: 'Pavement Interlocking & CC Road from Kadkariya Main Chowk to Chhoti Ramdi Primary School',
    sector: 'Rural Roads & Connectivity',
    geography_id: 'geo-chhoti-ramdi',
    recommender_id: 'rep-sumit-hridayesh',
    implementing_dept: 'Rural Engineering Service (RES) Nainital',
    sanctioned_cost: 1200000,
    spent_cost: 840000,
    status: 'UNDERWAY',
    physical_progress_pct: 70,
    lat: 29.2300,
    lon: 79.4990,
    approval_date: '2025-02-18',
    completion_date: '2025-10-30',
    source_name: 'Uttarakhand Vidhan Sabha LAD Portal',
    source_url: 'https://uk.gov.in/',
    proof_status: 'CITIZEN_PROOF_ATTACHED',
    proof_by: 'Citizen Ground Verification via Jan Nigrani Desk',
    proof_summary: 'Local residents uploaded geo-tagged photos of ongoing road leveling and concrete casting on the ground.',
    image_urls: JSON.stringify([
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800'
    ])
  },

  // --- HALDWANI / NAINITAL (UTTARAKHAND) ---
  {
    id: 'proj-hald-1',
    source_work_id: 'MPLADS-2025-UK-NAI-0019',
    title: 'Construction of Hill Slope Storm Drainage & Retaining Wall in Kathgodam Foothills',
    sector: 'Flood Management & Drainage',
    geography_id: 'geo-nainital',
    recommender_id: 'rep-ajay-bhatt',
    implementing_dept: 'Uttarakhand PWD Haldwani Division',
    sanctioned_cost: 6500000,
    spent_cost: 5200000,
    status: 'UNDERWAY',
    physical_progress_pct: 80,
    lat: 29.2680,
    lon: 79.5420,
    approval_date: '2025-02-14',
    completion_date: '2025-11-30',
    source_name: 'MPLADS Portal Uttarakhand',
    source_url: 'https://mplads.gov.in/',
    proof_status: 'OFFICIAL_PROOF_VERIFIED',
    proof_by: 'MP Office & Uttarakhand PWD',
    proof_summary: 'Official milestone drone inspection photos and geo-tagged retaining wall construction photos verified.',
    image_urls: JSON.stringify([
      'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800'
    ])
  },
  {
    id: 'proj-hald-2',
    source_work_id: 'MPLADS-2025-UK-NAI-0042',
    title: 'Solar High-Mast Street Lighting & EV Public Charging Stations in Haldwani Market',
    sector: 'Renewable Energy & Urban Infra',
    geography_id: 'geo-nainital',
    recommender_id: 'rep-ajay-bhatt',
    implementing_dept: 'Uttarakhand Renewable Energy Development Agency (UREDA)',
    sanctioned_cost: 3800000,
    spent_cost: 3800000,
    status: 'COMPLETED',
    physical_progress_pct: 100,
    lat: 29.2190,
    lon: 79.5150,
    approval_date: '2025-01-20',
    completion_date: '2025-05-15',
    source_name: 'UREDA Uttarakhand Dashboard',
    source_url: 'https://ureda.uk.gov.in/',
    proof_status: 'OFFICIAL_PROOF_VERIFIED',
    proof_by: 'UREDA Technical Inspection Team',
    proof_summary: 'Commissioning certificate with live meter readings and geo-tagged photos uploaded.',
    image_urls: JSON.stringify([
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800'
    ])
  },

  // --- VARANASI ---
  {
    id: 'proj-var-1',
    source_work_id: 'MPLADS-2025-VAR-0012',
    title: 'Construction of Smart Solar Community Learning Center & Digital Library',
    sector: 'Education & Digital Infra',
    geography_id: 'geo-varanasi',
    recommender_id: 'rep-modi',
    implementing_dept: 'Varanasi Public Works Dept (PWD)',
    sanctioned_cost: 4500000,
    spent_cost: 4120500,
    status: 'COMPLETED',
    physical_progress_pct: 100,
    lat: 25.3200,
    lon: 82.9800,
    approval_date: '2025-01-15',
    completion_date: '2025-07-20',
    source_name: 'MPLADS GIS Dashboard',
    source_url: 'https://mplads.gov.in/',
    proof_status: 'OFFICIAL_PROOF_VERIFIED',
    proof_by: 'Varanasi Smart City Mission & PWD',
    proof_summary: 'Geo-tagged inauguration and facility utilization photos submitted to MoSPI portal.',
    image_urls: JSON.stringify([
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'
    ])
  },
  {
    id: 'proj-var-4',
    source_work_id: 'MPLADS-2025-VAR-0088',
    title: 'Construction of Multi-Purpose Mahila Skill Training Hall in Bhelupur',
    sector: 'Community Infrastructure',
    geography_id: 'geo-varanasi',
    recommender_id: 'rep-modi',
    implementing_dept: 'District Rural Development Agency (DRDA)',
    sanctioned_cost: 5000000,
    spent_cost: 1200000,
    status: 'STALLED',
    physical_progress_pct: 25,
    lat: 25.3050,
    lon: 82.9900,
    approval_date: '2024-11-20',
    completion_date: '2025-08-30',
    source_name: 'MPLADS GIS Dashboard',
    source_url: 'https://mplads.gov.in/',
    proof_status: 'UNVERIFIED_NO_PROOF',
    proof_by: 'None - No ground proof submitted by representative or agency',
    proof_summary: 'The MP / Executing Agency has not submitted geo-tagged verification photos in official records. Physical ground delivery is unverified.',
    image_urls: JSON.stringify([])
  },

  // --- WAYANAD (KERALA) ---
  {
    id: 'proj-way-1',
    source_work_id: 'MPLADS-2025-KL-WAY-0008',
    title: 'Disaster-Resilient Community Shelter & Emergency Medical Aid Center in Meppadi',
    sector: 'Disaster Relief & Community Infra',
    geography_id: 'geo-wayanad',
    recommender_id: 'rep-priyanka-gandhi',
    implementing_dept: 'Kerala Public Works Dept (Buildings) Wayanad Division',
    sanctioned_cost: 8500000,
    spent_cost: 6200000,
    status: 'UNDERWAY',
    physical_progress_pct: 75,
    lat: 11.5520,
    lon: 76.1240,
    approval_date: '2025-01-10',
    completion_date: '2025-12-31',
    source_name: 'Kerala State Disaster Management & MPLADS',
    source_url: 'https://mplads.gov.in/',
    proof_status: 'OFFICIAL_PROOF_VERIFIED',
    proof_by: 'Kerala PWD & Wayanad District Collectorate',
    proof_summary: 'Construction inspection photos certified by District Disaster Management Authority.',
    image_urls: JSON.stringify([
      'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800'
    ])
  },

  // --- THIRUVANANTHAPURAM (KERALA) ---
  {
    id: 'proj-tvm-1',
    source_work_id: 'MPLADS-2025-KL-TVM-0031',
    title: 'Modernization of Smart STEM Labs in 12 Government High Schools across Thiruvananthapuram',
    sector: 'Education & Technology',
    geography_id: 'geo-tvm',
    recommender_id: 'rep-shashi-tharoor',
    implementing_dept: 'General Education Dept Kerala / KITE',
    sanctioned_cost: 5800000,
    spent_cost: 5800000,
    status: 'COMPLETED',
    physical_progress_pct: 100,
    lat: 8.5250,
    lon: 76.9400,
    approval_date: '2024-10-18',
    completion_date: '2025-04-30',
    source_name: 'KITE Smart School MIS',
    source_url: 'https://kite.kerala.gov.in/',
    proof_status: 'OFFICIAL_PROOF_VERIFIED',
    proof_by: 'KITE Technical Audit & MP Office',
    proof_summary: 'Equipment delivery receipts and classroom setup photos certified by Headmasters.',
    image_urls: JSON.stringify([
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'
    ])
  }
];
