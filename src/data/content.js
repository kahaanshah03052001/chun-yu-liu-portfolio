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
  summary: 'International outreach, research, campaign concepts and recommendations for a global payroll and hiring platform.',
  team: 'Six-person Thunderbird Global Challenge Lab team',
  stats: [
    { value: 680, label: 'International workers reached' },
    { value: 12, label: 'Interviews conducted' },
    { value: 13, label: 'Questionnaires completed' },
    { value: 6, label: 'Person team coordinated' }
  ],
  scope: ['Targeted outreach', 'Content database', 'Proof of concept', 'Campaign consultation']
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
  { key: 'reach', figure: '680', small: 'Reached', title: 'Targeted outreach', body: 'International workers at U.S. and Utah based companies, found through LinkedIn Sales Navigator.' },
  { key: 'listen', figure: '25', small: 'Responses', title: 'Listen', body: '12 recorded interviews and 13 completed questionnaires.' },
  { key: 'synthesize', figure: '2', small: 'Friction types', title: 'Synthesize', body: 'Every pain point sorted into operational friction or cultural friction.' },
  { key: 'present', figure: 'CEO', small: 'Recommendations', title: 'Present', body: 'Branding, design, campaign and outreach recommendations for Kiin’s leadership.' }
];

export const friction = {
  operational: [
    { label: 'Time zones', detail: 'The most common pain point. Meetings land at difficult hours.' },
    { label: 'Onboarding complexity' },
    { label: 'Unclear employment status' },
    { label: 'Compliance confusion' },
    { label: 'Payment delays' }
  ],
  cultural: [
    { label: 'Direct vs indirect', detail: 'The biggest cultural gap. In Mexico and parts of Asia, people avoid saying “no”.' },
    { label: 'Hierarchy', detail: 'Decision-making expectations often contrast across teams.' },
    { label: 'After-hours messages', detail: 'Work-life boundaries vary most around after-hours communication.' },
    { label: 'Relationship-building', detail: 'Often downplayed in global teams.' }
  ]
};

export const findings = [
  { figure: '53.8%', label: 'of respondents are mid to senior level' },
  { figure: 'Moderate to high', label: 'impact on productivity' },
  { figure: 'Time zones', label: 'accepted by most, still the top stressor' }
];

export const database = [
  { key: 'assets', title: 'Asset library', items: ['Billboard mockups', 'Kiin creative brief', 'Kiin animation graphics'] },
  { key: 'videos', title: 'Interview videos', items: ['Full interview footage', 'Highlight clips', 'Sorted by country'] },
  { key: 'decks', title: 'Presentation decks', items: ['Every deck shared with Kiin', 'Across the project timeline'] },
  { key: 'surveys', title: 'Survey results', items: ['Global Worker Insights survey', 'Kiin Brand Drive survey'] }
];

export const gallery = [
  { img: 'payrollPerson', title: 'Behind every payroll is a person.', type: 'Billboard' },
  { img: 'movePeople', title: 'We move people, not just payroll.', type: 'Billboard' },
  { img: 'beGlobal', title: 'Be Kiin, be Global.', type: 'Billboard' },
  { img: 'stayKiin', title: '#StayKiin', type: 'Billboard' },
  { img: 'globalManager', title: 'Dear Global Manager', type: 'Website campaign' },
  { img: 'featureCandidate', title: 'Feature Candidate Program', type: 'Website campaign' },
  { img: 'moodboard', title: 'Brand moodboard', type: 'Moodboard' }
];

export const consulting = [
  { title: 'Landor Brand Driver', body: 'A brand audit framework adapted for Kiin to align the team on values, tone and identity.' },
  { title: 'Graphic design', body: 'Designer candidate reviews and style direction from competitor analysis.' },
  { title: 'Campaign guide deck', body: 'Objective, differentiators, channel snapshot, pillar framework and strategy by region.' }
];

export const recommendations = [
  { key: 'branding', title: 'Branding', points: ['Align verbal and visual brand drivers across the team.', 'Focus on brand awareness at this early stage.'] },
  { key: 'design', title: 'Design', points: ['Decide on a design style early, especially UI.', 'Use more human photos and illustration.', 'Give designers a one to two page creative brief.'] },
  { key: 'campaign', title: 'Campaign', points: ['Low effort, high impact: “Who we are”, memes, taglines.', 'Quantity and consistency first.', 'Restart LinkedIn and Instagram, explore WhatsApp.'] },
  {
    key: 'outreach',
    title: 'Outreach',
    variants: {
      General: ['Start with a warm, curated group.', 'Build a Sales Navigator workflow.', 'Propose times in the lead’s time zone.'],
      LATAM: ['Build rapport before business.', 'Ask clarifying questions; “no” is not always direct.', 'Use bilingual messaging.'],
      Asia: ['Respect hierarchy in communication.', 'Use preferred regional channels, not only LinkedIn.', 'Invite input openly.']
    }
  }
];

export const rhythm = [
  { key: 'track', title: 'Track', tool: 'Excel · Google Sheets', body: 'Milestones, deliverables and action items in one place.' },
  { key: 'follow', title: 'Follow up', tool: 'Six-person team', body: 'Pending items, requests and deadlines chased down.' },
  { key: 'report', title: 'Report', tool: 'Weekly status reports', body: 'Progress and timelines, written up every week.' },
  { key: 'present', title: 'Present', tool: 'PowerPoint', body: 'Updates turned into clear slides.' }
];

export const trackerRows = [
  { item: 'Targeted outreach', detail: '680 reached' },
  { item: 'Interviews', detail: '12 completed' },
  { item: 'Questionnaires', detail: '13 completed' },
  { item: 'Content database', detail: '4 libraries' },
  { item: 'Proof of concept', detail: 'Billboards · web · reel' },
  { item: 'Recommendations', detail: 'Presented to CEO' }
];

export const execution = [
  { title: 'Coordinate people.', evidence: 'Six teammates, 680 people reached, three regions.' },
  { title: 'Organize information.', evidence: 'A four-part content database built for Kiin.' },
  { title: 'Manage deadlines.', evidence: 'Weekly follow-ups and status reports.' },
  { title: 'Structure recommendations.', evidence: '25 responses into a CEO presentation.' }
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
