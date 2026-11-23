# Portfolio v2 — Build Tracker

References:
- `references/ScreenRecording_11-23-2026 02-27-21_1.mov`: the reel
- `references/reference-site-spec.md`: exact values measured from the live site
- `references/recreate-the-crowd-footer.pdf`: footer spec

Excluded on purpose: the "Ask AI" chatbot.

Tick the boxes as we go. Each block = one progress bar.

## Block 0 — Inputs from Kaushal  🟩 7/8
- [x] Hero photo (`references/hero_photo.jpg`, 1200×1311, already B&W)
- [x] `character.png` (1024×1536, clean transparency, verified on white)
- [x] `crowd.png` (1448×1086, 15 people, 5×3, transparent; sprites detected by alpha components, not strict cells)
- [x] Project list: contextlab, mailmoat, FanCut, promptgauge
- [x] Experience: 9TeenInitiative intern + B.Tech CSE (Cyber Security), G. H. Raisoni College of Engineering, Nagpur, CGPA 7.4
- [ ] Optional: 1–2 extra crowd sheets for variety (older people, kids)
- [x] Pitch line (A) + tech-stack chips (TypeScript removed)
- [x] Remaining open questions answered

## Block 1 — Project setup  🟨 5/6
- [x] Next.js (App Router) + TypeScript + Tailwind CSS v4
- [x] Space Grotesk via `next/font` (variable 300–700, metric-matched fallback)
- [x] Design tokens for dark + light themes (from spec), grain overlay
- [x] GSAP; rAF-driven scroll effects (native scroll, no Lenis)
- [x] Old static site moved to `legacy/` (kept for reference, not deployed)
- [ ] Vercel project linked, preview deploy works

## Block 2 — Nav pill + menu  🟩 6/6
- [x] Fixed pill (320px, #141414, radius 20px): wordmark, theme toggle, menu button
- [x] Wordmark spin: auto every 3s, fast spin on hover, coast to rest on leave
- [x] Theme toggle with full light mode, saved in localStorage, no flash on load
- [x] Menu dialog: big links with letter-roll hover, secondary links, email, round social buttons
- [x] Close animation: letters fall like debris, panel shrinks back into the button
- [x] Focus trap, Esc to close, click outside to close, scroll lock

## Block 3 — Hero intro  🟩 5/5
- [x] Code background (Kaushal's profile as code) with cursor spotlight (GPU CSS mask instead of WebGL)
- [x] `< SOFTWARE ENGINEER />` per-letter 3D flip-in (GSAP), replays on re-entry
- [x] Bracket SVGs with depth offset, rotate-in
- [x] Portrait card, ©2026, typewriter `{{ /AI & FULL-STACK DEVELOPMENT }}` with blinking caret
- [x] Responsive sizes (min(13vw, 24svh, 184px) etc.), short-screen and mobile rules

## Block 4 — Portrait journey + bio  🟩 4/4
- [x] Sticky 3D card (front/back faces) mapped to scroll: travel + scale + rotateY 360°
- [x] Bio grid: "Hi, I'm Kaushal.", role, status block, portrait, lead line, "Explore projects"
- [x] Scroll fade-in of bio text
- [x] Reduced-motion fallback (static images)

## Block 5 — Tech Stack  🟩 3/3
- [x] Heading + note, 3 staggered columns (0/64/128px) with 2px top rules
- [x] Chips: every 4n+1 inverted, hover invert + lift 3px
- [x] Mobile single column

## Block 6 — Projects  🟩 5/5
- [x] 4 folders: back, tab, 3 papers (one grayscale screenshot), frosted front flap
- [x] Hover/focus fan-out + front flap tilt (rotateX −25°)
- [x] Captions: tagline + "View project ↗"
- [x] Click → inline details panel: sticky screenshot, collapsible "Inside X", stack, links
- [x] Interactive "Architecture walkthrough" diagram per project

## Block 7 — Experience timeline  🟩 3/3
- [x] Roadmap with alternating heights, ring markers, current pin
- [x] Dotted base path + ink path that draws in 1.8s on view, pin pop
- [x] Vertical layout ≤1000px

## Block 8 — Let's talk  🟩 3/3
- [x] Heading, line, email + copy button with "Copied" status, social links
- [x] Underline form → "Create email draft ↗" → draft-ready row with mailto link
- [x] Focus styles, mobile layout

## Block 9 — Crowd footer  🟩 6/6
- [x] Black top: name/role, Explore links, Get in touch, ©, "See you around.", "Back to top ↑"
- [x] White scene with giant pale `KAUSHAL.` behind the crowd
- [x] Sprite loader: find people by alpha components, trim, cache
- [x] Two canvas rows (rear → right, front ← left, cropped), bob, wrap, every third rear walker on the front layer
- [x] Pause/resume (click/keyboard), offscreen/tab-hidden pause, reduced motion
- [x] Black strip with "Finally, some traffic on my website."

## Block 10 — Polish, QA, deploy  🟨 3/6
- [x] Mobile (390px) layouts checked, no horizontal overflow
- [x] prefers-reduced-motion everywhere
- [x] 60fps check: portrait flight, scrolling and crowd all 60fps, 0 frames >20ms
- [ ] SEO/OG image, favicon, resume link, sitemap
- [ ] Side-by-side check against the reel and the live reference
- [ ] Production deploy on Vercel

## Dropped by decision
- /freelance page, /world 3D journey, Ask AI chatbot, cookie banner (Vercel Analytics is cookieless)
