/**
 * Query Router: Parses natural language queries into hard metadata filters
 * to eliminate cross-constituency hallucinations.
 */

const KNOWN_REPRESENTATIVES = [
  { name: 'Narendra Modi', aliases: ['modi', 'pm modi', 'narendra modi'], constituency: 'Varanasi', type: 'MP', state: 'Uttar Pradesh' },
  { name: 'Rahul Gandhi', aliases: ['rahul', 'rahul gandhi', 'rg'], constituency: 'Rae Bareli', type: 'MP', state: 'Uttar Pradesh' },
  { name: 'Sonia Gandhi', aliases: ['sonia', 'sonia gandhi'], constituency: 'Rae Bareli', type: 'MP', state: 'Uttar Pradesh' },
  { name: 'Amit Shah', aliases: ['amit shah', 'home minister shah'], constituency: 'Gandhinagar', type: 'MP', state: 'Gujarat' },
  { name: 'Rajnath Singh', aliases: ['rajnath', 'rajnath singh'], constituency: 'Lucknow', type: 'MP', state: 'Uttar Pradesh' },
  { name: 'Nitin Gadkari', aliases: ['gadkari', 'nitin gadkari'], constituency: 'Nagpur', type: 'MP', state: 'Maharashtra' },
  { name: 'Priyanka Gandhi Vadra', aliases: ['priyanka', 'priyanka gandhi', 'priyanka vadra'], constituency: 'Wayanad', type: 'MP', state: 'Kerala' },
  { name: 'Dr. Shashi Tharoor', aliases: ['tharoor', 'shashi tharoor'], constituency: 'Thiruvananthapuram', type: 'MP', state: 'Kerala' },
  { name: 'Mallikarjun Kharge', aliases: ['kharge', 'mallikarjun kharge'], constituency: 'Gulbarga', type: 'MP', state: 'Karnataka' },
  { name: 'Tejasvi Surya', aliases: ['tejasvi', 'tejasvi surya'], constituency: 'Bangalore South', type: 'MP', state: 'Karnataka' },
  { name: 'Akhilesh Yadav', aliases: ['akhilesh', 'akhilesh yadav'], constituency: 'Kannauj', type: 'MP', state: 'Uttar Pradesh' },
  { name: 'Dimple Yadav', aliases: ['dimple', 'dimple yadav'], constituency: 'Mainpuri', type: 'MP', state: 'Uttar Pradesh' },
  { name: 'Supriya Sule', aliases: ['supriya', 'supriya sule'], constituency: 'Baramati', type: 'MP', state: 'Maharashtra' },
  { name: 'Mahua Moitra', aliases: ['mahua', 'mahua moitra'], constituency: 'Krishnanagar', type: 'MP', state: 'West Bengal' },
  { name: 'Kanimozhi Karunanidhi', aliases: ['kanimozhi', 'kanimozhi karunanidhi'], constituency: 'Thoothukkudi', type: 'MP', state: 'Tamil Nadu' },
  { name: 'Asaduddin Owaisi', aliases: ['owaisi', 'asaduddin owaisi'], constituency: 'Hyderabad', type: 'MP', state: 'Telangana' },
  { name: 'Ajay Bhatt', aliases: ['ajay bhatt', 'bhatt'], constituency: 'Nainital-Udhamsingh Nagar', type: 'MP', state: 'Uttarakhand' },
  { name: 'Sumit Hridayesh', aliases: ['sumit', 'sumit hridayesh'], constituency: 'Haldwani', type: 'MLA', state: 'Uttarakhand' },
  { name: 'Smt. Geeta Rawat', aliases: ['geeta rawat', 'pradhan geeta', 'gram pradhan'], constituency: 'Kadkariya - Chhoti Ramdi', type: 'GRAM_PRADHAN', state: 'Uttarakhand' },
  { name: 'Dr. Jogendra Pal Singh Rautela', aliases: ['jogendra rautela', 'rautela', 'mayor rautela'], constituency: 'Haldwani-Kathgodam', type: 'MAYOR', state: 'Uttarakhand' }
];

const KNOWN_CONSTITUENCIES = [
  'Varanasi', 'Rae Bareli', 'Gandhinagar', 'Lucknow', 'Nagpur', 'Wayanad', 
  'Thiruvananthapuram', 'Gulbarga', 'Bangalore South', 'Kannauj', 'Mainpuri', 
  'Baramati', 'Krishnanagar', 'Thoothukkudi', 'Hyderabad', 'Haldwani', 
  'Kadkariya', 'Chhoti Ramdi', 'Choti Ramdi', 'Nainital', 'Amritsar', 
  'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Shimla', 'Hamirpur', 
  'Bhubaneswar', 'Puri', 'Cuttack', 'Guwahati', 'Jorhat', 'Shillong', 
  'Agartala', 'Sikkim', 'Arunachal West', 'New Delhi', 'Chandni Chowk'
];

export function parseQueryRouting(query) {
  const q = query.toLowerCase();
  const filters = {};

  // 1. Identify Representative Name
  for (const rep of KNOWN_REPRESENTATIVES) {
    for (const alias of rep.aliases) {
      if (q.includes(alias)) {
        filters.representative_name = rep.name;
        if (!filters.constituency) filters.constituency = rep.constituency;
        if (!filters.representative_type) filters.representative_type = rep.type;
        if (!filters.state) filters.state = rep.state;
        break;
      }
    }
  }

  // 2. Identify Constituency
  for (const c of KNOWN_CONSTITUENCIES) {
    if (q.includes(c.toLowerCase())) {
      filters.constituency = c;
      break;
    }
  }

  // 3. Identify Representative Type (MP vs MLA)
  if (q.includes('mla') || q.includes('assembly') || q.includes('mlalad')) {
    filters.representative_type = 'MLA';
  } else if (q.includes('mp') || q.includes('parliament') || q.includes('lok sabha') || q.includes('mplads') || q.includes('minister') || q.includes('pm')) {
    filters.representative_type = 'MP';
  } else if (q.includes('pradhan') || q.includes('gram sabha') || q.includes('panchayat')) {
    filters.representative_type = 'GRAM_PRADHAN';
  } else if (q.includes('mayor') || q.includes('nagar nigam') || q.includes('corporation')) {
    filters.representative_type = 'MAYOR';
  }

  // 4. Identify Status Filter
  if (q.includes('completed') || q.includes('finished') || q.includes('done')) {
    filters.status = 'Completed';
  } else if (q.includes('ongoing') || q.includes('underway') || q.includes('in progress')) {
    filters.status = 'Ongoing';
  } else if (q.includes('stalled') || q.includes('delayed') || q.includes('unverified')) {
    filters.status = 'Stalled';
  }

  // 5. Identify Party Filter
  if (q.includes('bjp')) {
    filters.party = 'BJP';
  } else if (q.includes('congress') || q.includes('inc')) {
    filters.party = 'INC';
  }

  return filters;
}
