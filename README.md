# Kaushal Shahare — Portfolio

Next.js 16 · React 19 · GSAP · plain CSS. Deployed on Vercel with Vercel Web Analytics.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
```

## Edit content

Everything you read on the site lives in **`src/data/content.ts`**: hero lines, bio, tech-stack chips, projects (with their architecture diagrams), experience, contact text and links.

## Images

Source images live in `references/` and are processed by:

```bash
npm run assets
```

It writes the hero photo, the trimmed footer character, the crowd sprite atlas (`public/footer/crowd-atlas.webp` + `src/data/crowd-atlas.json`), the grain texture and the resume.

- **More crowd variety:** generate another 5×3 sheet with the prompt in the crowd-footer guide, then extend `crowd()` in `scripts/prepare-assets.mjs` to append it to the atlas.
- **Project screenshots:** put PNG/JPGs in a folder and run `PROJECT_SRC_DIR=/path/to/folder npm run assets`; they land in `public/projects/` as WebP. Point the project's `image`/`preview` in `content.ts` at them.

## Structure

```
src/app/            layout (fonts, theme boot, analytics), page, globals.css (all styling)
src/components/     NavPill, Hero, PortraitJourney, sections (bio, tech stack),
                    Projects + ArchitectureDiagram, Experience, Contact, CrowdFooter
src/data/           content.ts, crowd-atlas.json (generated)
scripts/            prepare-assets.mjs
references/         source photos/artwork, measured reference spec
legacy/             previous static site (not deployed)
```
