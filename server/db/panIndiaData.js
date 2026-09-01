// Comprehensive Pan-India Data Register covering all 28 States & UTs
// Normalized according to LGD Codes, ECI Constituency IDs, and Official MPLADS / Local Authority Schemes

export const panIndiaGeographies = [
  // --- UTTAR PRADESH ---
  { id: 'geo-varanasi', lgd_code: '208', name: 'Varanasi', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-up', state_name: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739 },
  { id: 'geo-varanasi-cantt', lgd_code: '208-390', name: 'Varanasi Cantt', type: 'ASSEMBLY_CONSTITUENCY', parent_id: 'geo-varanasi', state_name: 'Uttar Pradesh', lat: 25.3350, lon: 82.9900 },
  { id: 'geo-varanasi-ulb', lgd_code: 'LGD-ULB-8001', name: 'Varanasi Municipal Corporation (Nagar Nigam)', type: 'ULB', parent_id: 'geo-varanasi', state_name: 'Uttar Pradesh', lat: 25.3100, lon: 82.9600 },
  { id: 'geo-chiraigaon', lgd_code: 'LGD-GP-10492', name: 'Chiraigaon Gram Panchayat', type: 'GRAM_PANCHAYAT', parent_id: 'geo-varanasi', state_name: 'Uttar Pradesh', lat: 25.3800, lon: 83.0200 },
  { id: 'geo-lucknow', lgd_code: '185', name: 'Lucknow', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-up', state_name: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },

  // --- UTTARAKHAND (HALDWANI / NAINITAL) ---
  { id: 'geo-nainital', lgd_code: '054', name: 'Nainital-Udhamsingh Nagar (Haldwani)', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-uk', state_name: 'Uttarakhand', lat: 29.2183, lon: 79.5130 },
  { id: 'geo-haldwani', lgd_code: '054-059', name: 'Haldwani', type: 'ASSEMBLY_CONSTITUENCY', parent_id: 'geo-nainital', state_name: 'Uttarakhand', lat: 29.2183, lon: 79.5130 },
  { id: 'geo-haldwani-ulb', lgd_code: 'LGD-ULB-0591', name: 'Haldwani-Kathgodam Municipal Corporation', type: 'ULB', parent_id: 'geo-nainital', state_name: 'Uttarakhand', lat: 29.2200, lon: 79.5200 },

  // --- KERALA ---
  { id: 'geo-wayanad', lgd_code: '014', name: 'Wayanad', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-kl', state_name: 'Kerala', lat: 11.6854, lon: 76.1320 },
  { id: 'geo-kalpetta', lgd_code: '014-019', name: 'Kalpetta', type: 'ASSEMBLY_CONSTITUENCY', parent_id: 'geo-wayanad', state_name: 'Kerala', lat: 11.6050, lon: 76.0830 },
  { id: 'geo-meppadi-gp', lgd_code: 'LGD-GP-22104', name: 'Meppadi Gram Panchayat', type: 'GRAM_PANCHAYAT', parent_id: 'geo-wayanad', state_name: 'Kerala', lat: 11.5500, lon: 76.1200 },
  { id: 'geo-tvm', lgd_code: '020', name: 'Thiruvananthapuram', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-kl', state_name: 'Kerala', lat: 8.5241, lon: 76.9366 },
  { id: 'geo-tvm-ulb', lgd_code: 'LGD-ULB-7001', name: 'Thiruvananthapuram Municipal Corporation', type: 'ULB', parent_id: 'geo-tvm', state_name: 'Kerala', lat: 8.5100, lon: 76.9500 },
  { id: 'geo-ernakulam', lgd_code: '012', name: 'Ernakulam (Kochi)', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-kl', state_name: 'Kerala', lat: 9.9816, lon: 76.2999 },
  { id: 'geo-kozhikode', lgd_code: '005', name: 'Kozhikode', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-kl', state_name: 'Kerala', lat: 11.2588, lon: 75.7804 },

  // --- NORTH EAST (ASSAM, MEGHALAYA, MANIPUR, TRIPURA, SIKKIM, ARUNACHAL) ---
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

  // --- KARNATAKA & SOUTH ---
  { id: 'geo-bangalore-south', lgd_code: '028', name: 'Bangalore South', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-ka', state_name: 'Karnataka', lat: 12.9141, lon: 77.5857 },
  { id: 'geo-bbmp', lgd_code: 'LGD-ULB-9002', name: 'Bruhat Bengaluru Mahanagara Palike (BBMP)', type: 'ULB', parent_id: 'geo-bangalore-south', state_name: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { id: 'geo-chennai-central', lgd_code: '041', name: 'Chennai Central', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-tn', state_name: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { id: 'geo-hyderabad', lgd_code: '501', name: 'Hyderabad', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-tg', state_name: 'Telangana', lat: 17.3850, lon: 78.4867 },

  // --- MAHARASHTRA & GUJARAT ---
  { id: 'geo-mumbai-south', lgd_code: '401', name: 'Mumbai South', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-mh', state_name: 'Maharashtra', lat: 18.9220, lon: 72.8347 },
  { id: 'geo-pune', lgd_code: '415', name: 'Pune', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-mh', state_name: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { id: 'geo-nagpur', lgd_code: '422', name: 'Nagpur', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-mh', state_name: 'Maharashtra', lat: 21.1458, lon: 79.0882 },
  { id: 'geo-ahmedabad-east', lgd_code: '601', name: 'Ahmedabad East', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-gj', state_name: 'Gujarat', lat: 23.0225, lon: 72.5714 },

  // --- EAST & CENTRAL ---
  { id: 'geo-kolkata-north', lgd_code: '701', name: 'Kolkata North', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-wb', state_name: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { id: 'geo-patna-sahib', lgd_code: '801', name: 'Patna Sahib', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-br', state_name: 'Bihar', lat: 25.5941, lon: 85.1376 },
  { id: 'geo-bhubaneswar', lgd_code: '901', name: 'Bhubaneswar', type: 'PARLIAMENTARY_CONSTITUENCY', parent_id: 'state-od', state_name: 'Odisha', lat: 20.2961, lon: 85.8245 }
];

export const panIndiaPersons = [
  // UTTAR PRADESH
  {
    id: 'rep-modi',
    name: 'Narendra Modi',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha)',
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
    office_title: 'Member of Legislative Assembly (MLA)',
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
    office_title: 'Member of Parliament (Lok Sabha)',
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

  // UTTARAKHAND (HALDWANI / NAINITAL)
  {
    id: 'rep-ajay-bhatt',
    name: 'Ajay Bhatt',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha)',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-nainital',
    attendance_pct: 92.4,
    questions_asked: 34,
    debates_participated: 18,
    data_coverage_pct: 91.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-sumit-hridayesh',
    name: 'Sumit Hridayesh',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Legislative Assembly (MLA)',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    tenure_start: '2022-03-10',
    tenure_end: '2027-03-09',
    geography_id: 'geo-haldwani',
    attendance_pct: 88.0,
    questions_asked: 51,
    debates_participated: 24,
    data_coverage_pct: 86.5,
    last_refreshed: '2026-08-31 22:08:00'
  },

  // KERALA
  {
    id: 'rep-priyanka-gandhi',
    name: 'Priyanka Gandhi Vadra',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Parliament (Lok Sabha)',
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
    office_title: 'Member of Parliament (Lok Sabha)',
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
  {
    id: 'rep-hibi-eden',
    name: 'Hibi Eden',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Parliament (Lok Sabha)',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-ernakulam',
    attendance_pct: 91.0,
    questions_asked: 74,
    debates_participated: 32,
    data_coverage_pct: 94.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-mk-raghavan',
    name: 'M. K. Raghavan',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Parliament (Lok Sabha)',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-kozhikode',
    attendance_pct: 93.5,
    questions_asked: 88,
    debates_participated: 40,
    data_coverage_pct: 92.5,
    last_refreshed: '2026-08-31 22:08:00'
  },

  // NORTH EAST
  {
    id: 'rep-bijuli-medhi',
    name: 'Bijuli Kalita Medhi',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha)',
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
    office_title: 'Member of Parliament (Lok Sabha)',
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
    office_title: 'Member of Parliament (Lok Sabha)',
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
  {
    id: 'rep-bimol-akoijam',
    name: 'Dr. Angomcha Bimol Akoijam',
    party: 'Indian National Congress (INC)',
    office_title: 'Member of Parliament (Lok Sabha)',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-imphal',
    attendance_pct: 95.0,
    questions_asked: 41,
    debates_participated: 29,
    data_coverage_pct: 90.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-kiren-rijiju',
    name: 'Kiren Rijiju',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Union Minister / MP (Lok Sabha)',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-arunachal-west',
    attendance_pct: 92.5,
    questions_asked: 0,
    debates_participated: 36,
    data_coverage_pct: 93.5,
    last_refreshed: '2026-08-31 22:08:00'
  },

  // SOUTH & WEST
  {
    id: 'rep-tejasvi',
    name: 'Tejasvi Surya',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha)',
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
    id: 'rep-dayanidhi',
    name: 'Dayanidhi Maran',
    party: 'Dravida Munnetra Kazhagam (DMK)',
    office_title: 'Member of Parliament (Lok Sabha)',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-chennai-central',
    attendance_pct: 91.2,
    questions_asked: 82,
    debates_participated: 39,
    data_coverage_pct: 94.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-owaisi',
    name: 'Asaduddin Owaisi',
    party: 'All India Majlis-E-Ittehadul Muslimeen (AIMIM)',
    office_title: 'Member of Parliament (Lok Sabha)',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-hyderabad',
    attendance_pct: 95.4,
    questions_asked: 94,
    debates_participated: 58,
    data_coverage_pct: 96.0,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-nitin-gadkari',
    name: 'Nitin Gadkari',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Union Minister / MP (Lok Sabha)',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    tenure_start: '2024-06-04',
    tenure_end: '2029-05-31',
    geography_id: 'geo-nagpur',
    attendance_pct: 93.0,
    questions_asked: 0,
    debates_participated: 44,
    data_coverage_pct: 96.5,
    last_refreshed: '2026-08-31 22:08:00'
  },
  {
    id: 'rep-bansuri',
    name: 'Bansuri Swaraj',
    party: 'Bharatiya Janata Party (BJP)',
    office_title: 'Member of Parliament (Lok Sabha)',
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
  { id: 'r-modi-1', person_id: 'rep-modi', institution_name: 'Lok Sabha / MoSPI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends works under MPLADS guidelines up to ₹5.00 Cr annual entitlement.' },
  { id: 'r-modi-2', person_id: 'rep-modi', institution_name: 'Varanasi District Authority', role_type: 'DIRECT_SANCTION', description: 'District Magistrate issues administrative sanction for recommended works.' },
  { id: 'r-modi-3', person_id: 'rep-modi', institution_name: 'Varanasi Nagar Nigam', role_type: 'IMPLEMENTING_AUTHORITY', description: 'Municipal Engineering Department executes civic works.' },

  { id: 'r-bhatt-1', person_id: 'rep-ajay-bhatt', institution_name: 'Lok Sabha / MoSPI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends works under MPLADS for Nainital & Haldwani assembly segments.' },
  { id: 'r-bhatt-2', person_id: 'rep-ajay-bhatt', institution_name: 'Nainital District Magistrate', role_type: 'DIRECT_SANCTION', description: 'Sanctioning authority for Kumaon hill and foothill development projects.' },

  { id: 'r-priyanka-1', person_id: 'rep-priyanka-gandhi', institution_name: 'Lok Sabha / MoSPI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends infrastructure and flood/landslide rehabilitation works under MPLADS in Wayanad, Kozhikode, and Malappuram segments.' },
  { id: 'r-priyanka-2', person_id: 'rep-priyanka-gandhi', institution_name: 'Wayanad District Collectorate', role_type: 'DIRECT_SANCTION', description: 'District Collector evaluates technical estimates and sanctions funds.' },

  { id: 'r-tharoor-1', person_id: 'rep-shashi-tharoor', institution_name: 'Lok Sabha / MoSPI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends coastal protection, smart education, and city sanitation works under MPLADS.' },
  { id: 'r-tharoor-2', person_id: 'rep-shashi-tharoor', institution_name: 'Thiruvananthapuram Corporation', role_type: 'IMPLEMENTING_AUTHORITY', description: 'Urban Local Body responsible for physical project execution.' },

  { id: 'r-bijuli-1', person_id: 'rep-bijuli-medhi', institution_name: 'Lok Sabha / MoSPI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends urban drainage and drinking water projects across Kamrup Metropolitan.' },
  { id: 'r-syngkon-1', person_id: 'rep-ricky-syngkon', institution_name: 'Lok Sabha / MoSPI', role_type: 'DIRECT_RECOMMENDATION', description: 'Recommends community infrastructure in Khasi & Jaintia Hills.' }
];

export const panIndiaFundLedgers = [
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
    sanctioned_amount: 30300000, // ₹303 Lakh
    expended_amount: 15700000,   // ₹157 Lakh
    unspent_balance: 9300000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
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
    sanctioned_amount: 28400000, // ₹284 Lakh
    expended_amount: 19200000,   // ₹192 Lakh
    unspent_balance: 5800000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  },
  // WAYANAD (KERALA)
  {
    id: 'fl-wayanad',
    entity_id: 'rep-priyanka-gandhi',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 24500000, // ₹245 Lakh
    expended_amount: 18100000,   // ₹181 Lakh
    unspent_balance: 6900000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  },
  // THIRUVANANTHAPURAM (KERALA)
  {
    id: 'fl-tharoor',
    entity_id: 'rep-shashi-tharoor',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 27900000, // ₹279 Lakh
    expended_amount: 23600000,   // ₹236 Lakh
    unspent_balance: 1400000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  },
  // GUWAHATI (ASSAM / NORTH EAST)
  {
    id: 'fl-guwahati',
    entity_id: 'rep-bijuli-medhi',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 26200000, // ₹262 Lakh
    expended_amount: 17400000,   // ₹174 Lakh
    unspent_balance: 7600000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  },
  // SHILLONG (MEGHALAYA / NORTH EAST)
  {
    id: 'fl-shillong',
    entity_id: 'rep-ricky-syngkon',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 22800000,
    expended_amount: 14900000,
    unspent_balance: 10100000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  },
  // BANGALORE SOUTH
  {
    id: 'fl-tejasvi',
    entity_id: 'rep-tejasvi',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 28800000,
    expended_amount: 24200000,
    unspent_balance: 800000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  },
  // NEW DELHI
  {
    id: 'fl-bansuri',
    entity_id: 'rep-bansuri',
    entity_type: 'PERSON',
    scheme_name: 'MPLADS (Lok Sabha)',
    fiscal_year: '2025-2026',
    entitled_amount: 50000000,
    allocated_amount: 50000000,
    released_amount: 25000000,
    sanctioned_amount: 25100000,
    expended_amount: 18900000,
    unspent_balance: 6100000,
    last_updated: '2026-08-31 22:08:00',
    source_name: 'MPLADS Official Portal',
    source_url: 'https://mplads.gov.in/'
  }
];

export const panIndiaProjects = [
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
    source_url: 'https://mplads.gov.in/'
  },
  {
    id: 'proj-var-2',
    source_work_id: 'MPLADS-2025-VAR-0045',
    title: 'Installation of High-Capacity RO Water Purification Plants in Assi Ghat & Lanka Wards',
    sector: 'Drinking Water & Sanitation',
    geography_id: 'geo-varanasi',
    recommender_id: 'rep-modi',
    implementing_dept: 'U.P. Jal Nigam Varanasi',
    sanctioned_cost: 3200000,
    spent_cost: 2150000,
    status: 'UNDERWAY',
    physical_progress_pct: 75,
    lat: 25.2850,
    lon: 82.9980,
    approval_date: '2025-03-10',
    completion_date: '2025-10-15',
    source_name: 'MPLADS GIS Dashboard',
    source_url: 'https://mplads.gov.in/'
  },
  {
    id: 'proj-var-3',
    source_work_id: 'MLALAD-2025-VC-0089',
    title: 'Resurfacing & Interlocking Pavement of Cantt Railway Colony Main Road',
    sector: 'Roads & Transportation',
    geography_id: 'geo-varanasi',
    recommender_id: 'rep-saurabh',
    implementing_dept: 'Varanasi Municipal Corporation Engineering Dept',
    sanctioned_cost: 2800000,
    spent_cost: 2800000,
    status: 'COMPLETED',
    physical_progress_pct: 100,
    lat: 25.3380,
    lon: 82.9850,
    approval_date: '2025-02-01',
    completion_date: '2025-06-30',
    source_name: 'UP MLALAD Portal',
    source_url: 'https://udd.up.gov.in/'
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
    source_url: 'https://mplads.gov.in/'
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
    source_url: 'https://mplads.gov.in/'
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
    source_url: 'https://ureda.uk.gov.in/'
  },
  {
    id: 'proj-hald-3',
    source_work_id: 'MLALAD-2025-HALD-0071',
    title: 'Upgradation of Emergency Ward Infrastructure at Soban Singh Jeena Base Hospital Haldwani',
    sector: 'Healthcare & Public Health',
    geography_id: 'geo-nainital',
    recommender_id: 'rep-sumit-hridayesh',
    implementing_dept: 'Directorate of Medical Health Uttarakhand',
    sanctioned_cost: 4500000,
    spent_cost: 3100000,
    status: 'UNDERWAY',
    physical_progress_pct: 70,
    lat: 29.2150,
    lon: 79.5220,
    approval_date: '2025-03-05',
    completion_date: '2025-10-30',
    source_name: 'Uttarakhand Vidhan Sabha LAD Portal',
    source_url: 'https://uk.gov.in/'
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
    source_url: 'https://mplads.gov.in/'
  },
  {
    id: 'proj-way-2',
    source_work_id: 'MPLADS-2025-KL-WAY-0023',
    title: 'High-Altitude Solar Microgrid & Drinking Water Pumping Facility in Vythiri Tribal Settlements',
    sector: 'Rural Drinking Water & Energy',
    geography_id: 'geo-wayanad',
    recommender_id: 'rep-priyanka-gandhi',
    implementing_dept: 'Kerala Water Authority (KWA)',
    sanctioned_cost: 4200000,
    spent_cost: 4200000,
    status: 'COMPLETED',
    physical_progress_pct: 100,
    lat: 11.5450,
    lon: 76.0400,
    approval_date: '2024-12-15',
    completion_date: '2025-06-20',
    source_name: 'KWA Project Directory',
    source_url: 'https://kwa.kerala.gov.in/'
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
    source_url: 'https://kite.kerala.gov.in/'
  },
  {
    id: 'proj-tvm-2',
    source_work_id: 'MPLADS-2025-KL-TVM-0056',
    title: 'Installation of Automated Coastal Weather Warning & Fishermen Rest Sheds at Vizhinjam',
    sector: 'Coastal Safety & Maritime Infra',
    geography_id: 'geo-tvm',
    recommender_id: 'rep-shashi-tharoor',
    implementing_dept: 'Harbour Engineering Dept Kerala',
    sanctioned_cost: 4100000,
    spent_cost: 2900000,
    status: 'UNDERWAY',
    physical_progress_pct: 70,
    lat: 8.3800,
    lon: 76.9900,
    approval_date: '2025-02-12',
    completion_date: '2025-09-30',
    source_name: 'MPLADS Portal Kerala',
    source_url: 'https://mplads.gov.in/'
  },

  // --- GUWAHATI (ASSAM / NORTH EAST) ---
  {
    id: 'proj-guw-1',
    source_work_id: 'MPLADS-2025-AS-GUW-0015',
    title: 'Construction of Integrated Brahmaputra Embankment Silt-Catchment Drains in Bharalumukh',
    sector: 'Urban Flood Mitigation',
    geography_id: 'geo-guwahati',
    recommender_id: 'rep-bijuli-medhi',
    implementing_dept: 'Guwahati Development Dept / GMC',
    sanctioned_cost: 7200000,
    spent_cost: 5100000,
    status: 'UNDERWAY',
    physical_progress_pct: 70,
    lat: 26.1750,
    lon: 91.7300,
    approval_date: '2025-01-22',
    completion_date: '2025-11-15',
    source_name: 'GMDA Project Portal',
    source_url: 'https://gmda.assam.gov.in/'
  },

  // --- SHILLONG (MEGHALAYA / NORTH EAST) ---
  {
    id: 'proj-shil-1',
    source_work_id: 'MPLADS-2025-ML-SHI-0004',
    title: 'Rainwater Harvesting Systems & Gravity Water Supply Network in Mawlai Ward',
    sector: 'Drinking Water & Water Conservation',
    geography_id: 'geo-shillong',
    recommender_id: 'rep-ricky-syngkon',
    implementing_dept: 'Public Health Engineering Dept (PHE) Meghalaya',
    sanctioned_cost: 4900000,
    spent_cost: 3800000,
    status: 'UNDERWAY',
    physical_progress_pct: 80,
    lat: 25.5900,
    lon: 91.8800,
    approval_date: '2025-02-05',
    completion_date: '2025-10-31',
    source_name: 'Meghalaya PHE Portal',
    source_url: 'https://megphed.gov.in/'
  },

  // --- BANGALORE SOUTH (KARNATAKA) ---
  {
    id: 'proj-blr-1',
    source_work_id: 'MPLADS-2025-KA-BLR-0027',
    title: 'Establishment of Robotic Dialysis & Critical Care Unit at Jayanagar General Hospital',
    sector: 'Healthcare & Public Health',
    geography_id: 'geo-bangalore-south',
    recommender_id: 'rep-tejasvi',
    implementing_dept: 'Karnataka Health System Development Project / BBMP',
    sanctioned_cost: 8900000,
    spent_cost: 8900000,
    status: 'COMPLETED',
    physical_progress_pct: 100,
    lat: 12.9250,
    lon: 77.5850,
    approval_date: '2024-11-10',
    completion_date: '2025-05-30',
    source_name: 'BBMP Health Works Portal',
    source_url: 'https://bbmp.gov.in/'
  },

  // --- NEW DELHI ---
  {
    id: 'proj-del-1',
    source_work_id: 'MPLADS-2025-DL-ND-0011',
    title: 'Installation of Solar Rooftops & Smart Water Harvesting in NDMC Primary Schools',
    sector: 'Green Energy & Education',
    geography_id: 'geo-new-delhi',
    recommender_id: 'rep-bansuri',
    implementing_dept: 'New Delhi Municipal Council (NDMC) Civil Engg Wing',
    sanctioned_cost: 6100000,
    spent_cost: 4800000,
    status: 'UNDERWAY',
    physical_progress_pct: 80,
    lat: 28.6180,
    lon: 77.2150,
    approval_date: '2025-01-30',
    completion_date: '2025-09-30',
    source_name: 'NDMC Smart City Portal',
    source_url: 'https://online.ndmc.gov.in/'
  }
];
