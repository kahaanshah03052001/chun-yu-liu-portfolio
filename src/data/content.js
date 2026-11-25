// Single source of truth for all copy. Every fact here comes from Chun-Yu Liu's resume.
// Nothing about Kiin's business results, interview findings or recommendations is invented.

export const person = {
  name: 'Chun-Yu Liu',
  roleLine: 'Operations, coordination and analytical problem-solving.',
  intro:
    'Bilingual operations professional. I track the details, keep teams on schedule and turn information into clear reports.',
  location: 'Phoenix, Arizona',
  timeZone: 'America/Phoenix',
  languages: 'Mandarin / English',
  availability: 'Open to operations roles',
  email: 'chunyul2@asu.edu',
  linkedin: 'https://www.linkedin.com/in/chun-yu-liu-/',
  linkedinLabel: 'linkedin.com/in/chun-yu-liu-'
};

export const nav = [
  { id: 'kiin', label: 'Case study' },
  { id: 'work', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' }
];

export const kiin = {
  org: 'Kiin Global',
  role: 'Graduate Student Consultant',
  program: 'Thunderbird Global Challenge Lab',
  location: 'Lehi, Utah',
  duration: 'Oct to Nov 2025',
  summary: 'Sourcing, outreach and interview scheduling across three continents, from the first LinkedIn message to the CEO presentation.',
  team: 'Six-person Thunderbird Global Challenge Lab team',
  stats: [
    { value: 680, label: 'International workers reached' },
    { value: 12, label: 'Interviews scheduled' },
    { value: 6, label: 'Countries across time zones' },
    { value: 6, label: 'Person team coordinated' }
  ],
};

// Interview and questionnaire data from the final deliverable.
export const regions = [
  {
    id: 'latam',
    name: 'Latin America',
    anchor: [-72, -8],
    survey: 38.5,
    countries: [
      { name: 'Costa Rica', coord: [-84, 10], count: 1, offset: -6 },
      { name: 'Mexico', coord: [-102, 23], count: 2, offset: -6 },
      { name: 'Argentina', coord: [-64, -34], count: 2, offset: -3 }
    ],
    heard: 'Feedback is softer and more polite. A “no” is not always said out loud.'
  },
  {
    id: 'africa',
    name: 'Africa',
    anchor: [22, 2],
    survey: 30.8,
    countries: [{ name: 'Questionnaire respondents', coord: [22, 2], count: 0, offset: 2 }],
    heard: 'Teams show strong commitment when their dedication is recognized.'
  },
  {
    id: 'asia',
    name: 'Asia',
    anchor: [96, 26],
    survey: 30.8,
    countries: [
      { name: 'UAE', coord: [54, 24], count: 4, offset: 4 },
      { name: 'Singapore', coord: [104, 1.3], count: 2, offset: 8 },
      { name: 'China', coord: [112, 33], count: 1, offset: 8 }
    ],
    heard: 'Workplaces tend to be more hierarchical. Hierarchy shapes how decisions are made.'
  }
];

export const origin = { name: 'Lehi, Utah', coord: [-111.85, 40.39], offset: -7, offsetLabel: 'UTC−7' };

export const pipeline = [
  { key: 'reach', figure: '680', small: 'Reached', title: 'Source', body: 'International workers found and contacted through LinkedIn Sales Navigator.' },
  { key: 'listen', figure: '12', small: 'Scheduled', title: 'Schedule', body: '12 interviews booked across time zones, plus 13 questionnaires.' },
  { key: 'synthesize', figure: '2', small: 'Themes', title: 'Synthesize', body: 'Findings sorted into operational and cultural friction.' },
  { key: 'present', figure: 'CEO', small: 'Presented', title: 'Present', body: 'Recommendations delivered to Kiin’s CEO.' }
];

export const rhythm = [
  { key: 'track', title: 'Track', tool: 'Excel · Google Sheets', body: 'Milestones, deliverables and action items in one place.' },
  { key: 'follow', title: 'Follow up', tool: 'Six-person team', body: 'Pending items, requests and deadlines chased down.' },
  { key: 'report', title: 'Report', tool: 'Weekly status reports', body: 'Progress and timelines, written up every week.' },
  { key: 'present', title: 'Present', tool: 'PowerPoint', body: 'Updates turned into clear slides.' }
];

export const trackerRows = [
  { item: 'Outreach', detail: '680 contacted' },
  { item: 'Interview scheduling', detail: '12 booked, 6 countries' },
  { item: 'Questionnaires', detail: '13 completed' },
  { item: 'Weekly status report', detail: 'Progress and timelines' },
  { item: 'CEO presentation', detail: 'Recommendations' }
];

export const execution = [
  { title: 'Coordinate people.', evidence: '12 interviews booked across 6 countries and a six-person team.' },
  { title: 'Organize information.', evidence: 'Milestones and action items tracked in Excel and Sheets.' },
  { title: 'Manage deadlines.', evidence: 'Weekly follow-ups and status reports.' },
  { title: 'Deliver results.', evidence: 'Research carried from first contact to the CEO.' }
];

export const projects = [
  {
    id: 'kfc',
    title: 'KFC Employee Satisfaction Survey',
    context: 'Organizational Behavior Project · Yuan Ze University',
    figure: '≈50',
    figureLabel: 'employees surveyed',
    tags: ['Survey design', 'Google Forms', 'Analysis'],
    points: [
      'Surveyed about 50 employees with Google Forms.',
      'Report and presentation with recommendations.'
    ],
    highlightLabel: 'Key drivers identified',
    highlights: ['Supervisor management style', 'Autonomy']
  },
  {
    id: 'cem',
    title: 'Customer Experience Management Modeling',
    context: 'Strategic Services Marketing · Group project',
    figure: '6',
    figureLabel: 'member team coordinated',
    tags: ['Coordination', 'IBM SPSS', 'Survey data'],
    points: [
      'Ran meetings, milestones and follow-ups as coordinator.',
      'Analyzed survey data in IBM SPSS.'
    ],
    highlightLabel: 'Evaluated',
    highlights: ['Customer satisfaction', 'Service performance']
  },
  {
    id: 'camp',
    title: 'Camp Counselor',
    context: 'Freshman Orientation Camp · Yuan Ze University, Taiwan',
    figure: '2019',
    figureLabel: 'leadership role',
    tags: ['Scheduling', 'Team guidance', 'Program delivery'],
    points: [
      'Guided a team of incoming freshmen.',
      'Ran schedules and timing with other staff.'
    ],
    highlightLabel: 'Responsible for',
    highlights: ['Schedules and timing', 'Freshman guidance']
  }
];

export const skills = [
  {
    id: 'operations',
    name: 'Operations',
    items: ['Data tracking', 'Reporting', 'Scheduling', 'Coordination', 'Records management', 'Follow-ups'],
    usedIn: [
      { label: 'Kiin case study', href: '#kiin' },
      { label: 'Customer experience project', href: '#work' }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    items: ['Microsoft Excel', 'Pivot tables', 'Formulas', 'PowerPoint', 'Word', 'Outlook', 'Teams', 'Google Workspace', 'IBM SPSS'],
    usedIn: [
      { label: 'Kiin tracker and reports', href: '#kiin' },
      { label: 'SPSS survey analysis', href: '#work' }
    ]
  },
  {
    id: 'research',
    name: 'Research',
    items: ['LinkedIn Sales Navigator', 'Survey analysis', 'Information synthesis'],
    usedIn: [
      { label: 'International interviews', href: '#kiin' },
      { label: 'KFC employee survey', href: '#work' }
    ]
  },
  {
    id: 'languages',
    name: 'Languages',
    items: ['Mandarin · Native', 'English · Fluent'],
    usedIn: []
  }
];

export const education = [
  {
    year: '2026',
    school: 'Thunderbird School of Global Management',
    parent: 'Arizona State University',
    degree: 'Master of Global Management',
    date: 'May 2026',
    place: 'Phoenix, AZ'
  },
  {
    year: '2022',
    school: 'Yuan Ze University',
    parent: null,
    degree: 'Bachelor of Business Administration',
    date: 'June 2022',
    place: 'Taoyuan City, Taiwan'
  }
];
