# Reference site spec (aswinpanengal.me, inspected 2026-11-23)

Measured from the live site's CSS/JS and in-browser checks. Values to reproduce, not code to copy.

## Stack observed
- Next.js (Turbopack build), React, **GSAP** (hero intro, nav menu), custom vanilla rAF scroll runtime ("scrollcraft") for scroll-mapped effects, raw **WebGL** for the code background, canvas 2D for the crowd footer.
- **Native scroll, no Lenis / smooth-scroll library.** No Framer Motion.
- Font: **Space Grotesk** (variable 300–700) via next/font, with metric-matched Arial fallback. Used for everything, including the "mono" role.

## Tokens
| token | dark (default in reel) | light |
|---|---|---|
| canvas | #171716 | #f7f4f0 |
| surface | #232321 | #eeede9 |
| surface-strong | #30302c | #e3e2dd |
| ink | #f5f4f0 | #141414 |
| ink-soft | #bdbcb6 | #5b5a57 |
| line | #3b3b36 | #deddd8 |
| accent-wash | #35352f | #e4e3de |
- ease: cubic-bezier(.22,1,.36,1). Drawer ease cubic-bezier(.32,.72,0,1).
- gutter: clamp(24px, 9vw, 130px) (60px ≤1100, 24px ≤700, 20px ≤380). Wrap: min(100% − 2·gutter, 1180px).
- section-space: clamp(80px, 8vw, 120px).
- body: 16px / 1.6, letter-spacing −0.015em. h1–h3 weight 600, −0.02em. h2: clamp(44px, 5.3vw, 76px) / 1.
- Grain overlay: fixed full-screen noise PNG 256px tile, opacity .35 (light) / inverted .18 (dark), z 150.
- Theme toggle persists to localStorage; html[data-theme=dark|light].

## Nav pill (fixed, top 30px, centered, 320px wide; 350px on mobile)
- Inner: #141414, radius 20px, height 60px, padding 10px 16px.
- Wordmark: 22px / 650 / −0.04em. **2D rotate spin**: auto every 3s; on hover spins at 1.05°/ms then coasts to a full turn on leave; disabled for reduced motion and when the tab is hidden.
- Theme button 32×40 (transparent, hover #30302d). Menu button 44×36, #f8f7f4 bg, radius 8px.
- Menu = native `<dialog>` 680px wide, top-right inset 24px, #fafafa, radius 24px, backdrop blur(5px) #0009.
  - Primary links: clamp(60px, 9svh, 88px) / 500 / −0.04em; hover color #555 plus a "wave" letter roll (each glyph translateY(−100%) revealing a copy, .3s).
  - Secondary links 17px, underline on hover. Footer: email + round 48px black social buttons (lift 3px on hover).
  - Close button: 56px black circle, rotates 90° on hover.
  - **Close animation (GSAP):** letters fall (y to below the panel, x jitter, rotation −48..48°, .7s power2.in, random stagger .18s), fade, then the panel scales and translates back into the menu button (.46s power3.inOut).

## Hero / intro (height 100svh)
- Code background: WebGL glyph canvas with a profile-as-code text block (fallback `<pre>` 12px/1.7, opacity .035). **Cursor spotlight**: glyphs brighten around the pointer. Pauses when offscreen or the tab is hidden; re-renders on theme change.
- Title "SOFTWARE / ENGINEER": min(13vw, 24svh, 184px), weight 900 (+ text-stroke .008em), −0.035em, line-height .9, centered.
  - Each letter in an overflow-clipped window with perspective 600px.
  - **Intro (GSAP):** line 1 letters from yPercent 105, rotationX −80, scaleY .65, opacity 0 (origin bottom); line 2 mirrored (origin top, from the end). .82s power3.out, stagger .035s; line 2 starts +.1s.
  - Brackets: SVG `<` and `/>` with a 16% opacity offset copy (translate 5,6) for depth; rotate from ∓45°, scale .96, .95s, stagger .08.
  - Replays every time the hero re-enters view at ≥40% visible.
- Portrait card: width clamp(150px, 34svh, 320px), aspect 20/23, radius 9px, bottom 24px, overlapping the title by 28px. Grayscale.
- Footer row (bottom 28px): "©2026" clamp(40px, 6.8svh, 68px)/600; right tag "{{ /AI & FULL-STACK DEVELOPMENT }}" clamp(18px, 1.55vw, 24px)/500 with a typewriter effect and a 1px caret blinking at 1.06s.

## Portrait journey (scroll-mapped)
- A sticky 100vh stage holds a 3D card with front and back faces (both the photo, backface hidden).
- Progress = (scrollY − start) / distance. The card travels from the hero slot to the bio slot, scales to the bio portrait size and does a **full rotateY 360°**; border radius interpolates 9 → 16px.
- The static images are hidden while the flying card is active. Disabled for reduced motion.

## Biography (grid 1fr 1.1fr 1.1fr, padding-top 520px for the card flight)
- "Hi, I'm Aswin.": clamp(64px, 6.6vw, 96px)/700/−0.04em/.98.
- Role: clamp(24px, 2.2vw, 32px)/700/1.15.
- "Currently at" block: top border, label 14px ink-soft, lines 18px/500.
- Portrait: aspect 20/23, radius 16px.
- Lead: clamp(24px, 2.1vw, 30px)/500/1.3, key phrases `<strong>`.
- Button: 52px tall, ink bg, radius 6px, 16px/600, arrow icon.
- Text fades in on scroll.

## Tech Stack
- Heading row: h2 left, note right 18px ink-soft ("The tools behind / my work.").
- 3 columns, gap 40px, staggered margin-top 0 / 64 / 128px, 2px ink top rule, padding-top 28px.
- Column title clamp(28px, 2.7vw, 38px)/600/−0.035em, max 14ch. Note 14px ink-soft max 34ch.
- Chips: 48px tall, 12px 14px padding, 18px/500, radius 3px, surface bg, line border. **Every 4n+1 chip inverted.** Hover: invert + translateY(−3px).

## Projects
- Intro 17px ink-soft max 480px; "GitHub ↗" text link on the right (arrow box nudges 2,−2 on hover).
- Grid 4 columns at ≥1280px (gap 24px), 2 columns at 701–1279px, 1 column on mobile (max 380px).
- Folder scene (perspective 900px, height 260px):
  - Back: surface-strong, radius 14px, with a tab.
  - 3 papers (166px tall): back rotated −9°, preview with grayscale screenshot rotated 6°, front rotated −2°.
  - Front flap: frosted (surface 62% + blur 12px), radius 14px, title 25px/700, 36px ink "open" icon.
- **Hover/focus/open:** papers fan out (back → (−22,−34) −14°, preview → (20,−44) 10°, front → y −10 −3°) and the front flap tilts back rotateX(−25°). .45s ease.
- Caption under each: tagline 13px ink-soft + "View project ↗" / "Read case study ↗".
- **Click → inline "Project details" panel** below the grid (top border, toolbar with close ×, scrolls into view):
  - Left (sticky): screenshot on a tinted 410px panel, scales to 1.035 on hover, open-link icon fades in.
  - Right: title 32px/500, category 13px, collapsible `<details>` "Inside X" (description, slash-separated stack, Live app / Source links), collapsible "Architecture walkthrough" with an **interactive diagram** (toggle switches which route lights up).
  - Case-study variant: summary, facts table (Role / Ownership / Stack / Hosting), numbered approach steps, before→after impact numbers.

## Experience
- Heading + right note "Current work. / Back to the foundations."
- 5-column roadmap, alternating top padding (0 / 100 / 20 / 100 / 20px).
- 38px ring markers, the current one inverted. SVG cubic path through the marker centers: dotted base (2px, dash 3 7, line color) plus an ink path (1.5px) that **draws over 1.8s** when 20% visible; the current pin pops (scale .85 → 1.12 → 1).
- Badge ("Current role" / "Ongoing") 11px inverted, date 13px, title clamp(22px, 1.9vw, 28px)/600, place 18px/500, description 15px.
- Vertical layout ≤1000px.

## Contact
- 2 columns. "Let's talk.": clamp(64px, 6.8vw, 96px)/700. Line 18px ink-soft.
- Email clamp(16px, 1.5vw, 21px)/600 with a copy button (44px) and "Copied" status.
- Socials 14px/500 with logos.
- Form: underline inputs (17px, 52px tall), textarea 148px; button "Create email draft ↗" (56px, ink) → shows a "draft ready" row with a mailto link. No backend.

## Footer
Matches the crowd PDF, plus:
- 105 sprites, sorted by baseline.
- Rows: 25 rear / 16 front (scaled down below 600px wide).
- Rear height 170–205px, front 250–280px. Speed ×0.7 rear / ×1.05 front.
- Each third rear walker is drawn on the front layer.
- Privacy link in the copyright line.

## Extra pages
- **/freelance**: SEO landing ("Freelance web developer in Kochi"): selected client work, services, demo collection, FAQ.
- **/world**: full 3D tiny-planet motorbike ride through life chapters (drive with WASD or autopilot, speedometer, typed narration cards, quality toggle, "Read story" text version).

## Skipped by request
- "Ask AI" chat assistant.
