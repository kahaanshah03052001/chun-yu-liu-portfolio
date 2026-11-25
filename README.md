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

- **Intro** (React Three Fiber, about 2.5 s): a 3D dot globe of the world map turns from Lehi toward the interview countries while red arcs draw out, then glides into the portrait's position and becomes its black circle. Falls back to loading the page directly when WebGL or reduced motion rules it out; never holds the page longer than 5 s.

- **Hero**: headline, portrait, introduction, location, languages, live Phoenix time, availability.
- **Kiin Global case study**: A. Sourcing & scheduling (zoomable map with interview counts by country), B. From 680 to the CEO, C. Project coordination, D. Business execution.
- **Site-wide**: custom cursor on desktop, magnetic call-to-action, 3D tilt on the portrait, outline effect on the headline words.
- **Projects**: accessible accordion for the KFC survey, customer experience modeling and camp counselor role.
- **Skills**: keyboard-navigable skill groups with linked evidence.
- **Education**, **Contact** (mailto, copy-to-clipboard, LinkedIn) and footer.

## Notes

- Motion respects the visitor's "reduce motion" setting.
- No business results, interview findings or recommendations are invented; the tracker and slide visuals are labelled as illustrative structures.
- The phone number from the resume is intentionally not used.
