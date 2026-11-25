// Portrait sources (served from /public). Kept in one module so builds can swap them.
export const portrait = {
  webp: '/chunyu-liu-640.webp 640w, /chunyu-liu-1200.webp 1200w',
  jpg: '/chunyu-liu-1200.jpg',
  jpgSet: '/chunyu-liu-640.jpg 640w, /chunyu-liu-1200.jpg 1200w'
};

// Kiin proof-of-concept visuals, cropped from the final deliverable.
const k = (name) => `/kiin/${name}.webp`;
export const kiinImages = {
  beGlobal: k('billboard-be-global'),
  payrollPerson: k('billboard-payroll-person'),
  stayKiin: k('billboard-stay-kiin'),
  movePeople: k('billboard-move-people'),
  globalManager: k('web-dear-global-manager'),
  featureCandidate: k('web-feature-candidate'),
  moodboard: k('moodboard')
};
