# Chun-Yu Liu · Portfolio

A typography-led personal portfolio built with React 19, Vite and Framer Motion. Ready to deploy on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects Vite automatically (build command `npm run build`, output `dist`). Click **Deploy**.

Or from the command line: `npx vercel` inside this folder.

## Where things live

| What | File |
| --- | --- |
| All copy (resume facts, case study text, skills, education) | `src/data/content.js` |
| Portrait image paths | `src/data/assets.js` (images in `public/`) |
| Dot-matrix world map outlines | `src/data/geo.js` |
| Global styles, colours and type | `src/styles.css` (tokens at the top in `:root`) |
| Sections | `src/components/` |

To change wording, edit `content.js` only; every component reads from it.

## Sections

- **Intro**: a canvas particle animation. Particles spiral in, form the name, hold (the cursor pushes them around), collapse into a ring and open onto the page. Click or press any key to skip ahead. Visitors with reduce motion on skip it entirely.

- **Hero**: headline, portrait, introduction, location, languages, live Phoenix time, availability.
- **Kiin Global case study** (the centrepiece, based on the Thunderbird Global Challenge Lab final deliverable):
  - A. Targeted outreach: zoomable dot map with interview counts by country (Costa Rica, Mexico, Argentina, UAE, Singapore, China) and a time-zone slider.
  - B. From 680 to the CEO: 680 dots narrow to 12 interviews and 13 questionnaires, two friction types, then the CEO recommendations.
  - C. What the research found: operational vs cultural friction explorer and a questionnaire region donut.
  - D. What was built: proof-of-concept gallery with lightbox, content database explorer, campaign consultation.
  - E. Recommendations: branding, design, campaign and outreach (general, LATAM, Asia).
  - F. Project coordination and G. Business execution.
- **Site-wide**: custom cursor on desktop, magnetic call-to-action, 3D tilt on the portrait, outline effect on the headline words.
- **Projects**: accessible accordion for the KFC survey, customer experience modeling and camp counselor role.
- **Skills**: keyboard-navigable skill groups with linked evidence.
- **Education**, **Contact** (mailto, copy-to-clipboard, LinkedIn) and footer.

## Notes

- Motion respects the visitor's "reduce motion" setting.
- No business results, interview findings or recommendations are invented; the tracker and slide visuals are labelled as illustrative structures.
- The phone number from the resume is intentionally not used.
