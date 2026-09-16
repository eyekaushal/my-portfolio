# Kaushal — Portfolio

A static, dependency-free portfolio site (plain HTML/CSS/JS). No build step required.

## Before you deploy — fill these in

1. **`index.html`**
   - LinkedIn URL — replace `REPLACE-WITH-YOUR-LINKEDIN`
   - LeetCode URL — replace `REPLACE-WITH-YOUR-LEETCODE`
   - Email — replace `REPLACE-WITH-YOUR-EMAIL@example.com` (in the `mailto:` link)
   - The Experience section's job title link (`<h4><a href="#" ...>`) — add the company's real URL if it has one, or leave as `#`.
2. **`assets/resume.pdf`** — this is a placeholder. Swap in your real resume, keeping the filename `resume.pdf` (or update the two `assets/resume.pdf` references in `index.html` if you rename it).
3. **`assets/projects/*.svg`** — placeholder thumbnails. Swap in real screenshots (`.png`/`.jpg`) of GitPulse and Contextlab if you have them, and update the `src` in the Projects section of `index.html` to match.

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
```

## Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm i -g vercel
cd kaushal-portfolio
vercel
```
Follow the prompts (link/create a project, accept the defaults — it's a static site, no build command needed).

**Option B — GitHub + Vercel dashboard**
1. Push this folder to a new GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework preset: "Other". No build command, no output directory override needed.
4. Deploy.

## Structure

```
index.html              Page content
css/style.css            All styling
js/script.js              Scroll-spy nav highlighting
assets/resume.pdf         Resume (placeholder — replace)
assets/projects/*.svg     Project thumbnails (placeholders — replace)
```
