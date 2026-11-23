// Prepares every image the site ships, from the source files in references/.
// Run with: npm run assets   (re-run whenever a source image changes)
//
// - hero photo     -> public/images/kaushal.jpg
// - character.png  -> public/footer/character.webp (trimmed to the figure)
// - crowd.png      -> public/footer/crowd-atlas.webp + src/data/crowd-atlas.json
//   The sheet is a 5x3 grid, but some figures' arms and bags cross into the
//   neighbouring cell, so cells are not cut blindly: every opaque blob is
//   labelled, assigned to the cell its centre sits in, and each sprite keeps
//   only its own blobs. Each sprite is then trimmed and packed into an atlas.
// - project shots  -> public/projects/*.webp (from PROJECT_SRC_DIR when given)

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const ref = (f) => path.join(root, "references", f);
const out = (f) => path.join(root, f);

async function ensureDir(p) {
  await fs.mkdir(path.dirname(p), { recursive: true });
}

async function hero() {
  const dest = out("public/images/kaushal.jpg");
  await ensureDir(dest);
  await sharp(ref("hero_photo.jpg"))
    .resize({ width: 1200, withoutEnlargement: true })
    .grayscale()
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
  console.log("hero ->", path.relative(root, dest));
}

async function character() {
  const dest = out("public/footer/character.webp");
  await ensureDir(dest);
  const img = sharp(ref("character.png")).ensureAlpha();
  const { data, info } = await img.clone().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 16) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  const pad = 6;
  const left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad);
  const width = Math.min(W, x1 + pad + 1) - left, height = Math.min(H, y1 + pad + 1) - top;
  await img
    .extract({ left, top, width, height })
    .resize({ height: 900, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log("character ->", path.relative(root, dest), `${meta.width}x${meta.height}`);
  return { width: meta.width, height: meta.height };
}

async function crowd() {
  const COLS = 5, ROWS = 3, ALPHA = 40, MIN_BLOB = 24;
  const { data, info } = await sharp(ref("crowd.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const cellW = W / COLS, cellH = H / ROWS;

  // 1. label opaque blobs (4-connected)
  const label = new Int32Array(W * H).fill(-1);
  const blobs = [];
  const stack = new Int32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    if (label[i] !== -1 || data[i * 4 + 3] <= ALPHA) continue;
    const id = blobs.length;
    let sp = 0, n = 0, sx = 0, sy = 0, x0 = W, y0 = H, x1 = 0, y1 = 0;
    stack[sp++] = i;
    label[i] = id;
    while (sp) {
      const p = stack[--sp];
      const x = p % W, y = (p - x) / W;
      n++; sx += x; sy += y;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      const nb = [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1];
      for (const q of nb) {
        if (q >= 0 && label[q] === -1 && data[q * 4 + 3] > ALPHA) {
          label[q] = id;
          stack[sp++] = q;
        }
      }
    }
    blobs.push({ n, cx: sx / n, cy: sy / n, x0, y0, x1, y1 });
  }

  // 2. assign blobs to cells; a blob spanning two cells (figures touching) is split at the boundary
  const cellOf = (x, y) => Math.min(ROWS - 1, Math.floor(y / cellH)) * COLS + Math.min(COLS - 1, Math.floor(x / cellW));
  const owner = blobs.map((b) => (b.n < MIN_BLOB ? -2 : cellOf(b.cx, b.cy)));
  const spans = blobs.map((b) => b.x1 - b.x0 > cellW * 1.15 || b.y1 - b.y0 > cellH * 1.1);

  // 3. cut each sprite, trim it, collect
  const sprites = [];
  for (let c = 0; c < COLS * ROWS; c++) {
    const col = c % COLS, row = Math.floor(c / COLS);
    const ex = Math.round(cellW * 0.25);
    const rx0 = Math.max(0, Math.floor(col * cellW) - ex), rx1 = Math.min(W, Math.ceil((col + 1) * cellW) + ex);
    const ry0 = Math.floor(row * cellH), ry1 = Math.min(H, Math.ceil((row + 1) * cellH));
    const rw = rx1 - rx0, rh = ry1 - ry0;
    const buf = Buffer.alloc(rw * rh * 4);
    let tx0 = rw, ty0 = rh, tx1 = -1, ty1 = -1;
    for (let y = ry0; y < ry1; y++) {
      for (let x = rx0; x < rx1; x++) {
        const p = y * W + x;
        const a = data[p * 4 + 3];
        if (a === 0) continue;
        const l = label[p];
        let keep;
        if (l === -1) {
          // faint anti-aliased edge pixel: keep it if it sits inside this cell
          keep = cellOf(x, y) === c;
        } else if (owner[l] === -2) {
          keep = false;
        } else if (spans[l]) {
          keep = cellOf(x, y) === c;
        } else {
          keep = owner[l] === c;
        }
        if (!keep) continue;
        const o = ((y - ry0) * rw + (x - rx0)) * 4;
        data.copy(buf, o, p * 4, p * 4 + 4);
        const lx = x - rx0, ly = y - ry0;
        if (a > ALPHA) {
          if (lx < tx0) tx0 = lx; if (lx > tx1) tx1 = lx; if (ly < ty0) ty0 = ly; if (ly > ty1) ty1 = ly;
        }
      }
    }
    if (tx1 < 0) throw new Error(`crowd.png: cell ${c} (row ${row + 1}, col ${col + 1}) is empty`);
    const pad = 2;
    const left = Math.max(0, tx0 - pad), top = Math.max(0, ty0 - pad);
    const width = Math.min(rw, tx1 + pad + 1) - left, height = Math.min(rh, ty1 + pad + 1) - top;
    const png = await sharp(buf, { raw: { width: rw, height: rh, channels: 4 } })
      .extract({ left, top, width, height })
      .png()
      .toBuffer();
    sprites.push({ png, width, height });
  }

  // sanity: every figure should be clearly taller than wide-ish and of similar scale
  const hs = sprites.map((s) => s.height);
  const minH = Math.min(...hs), maxH = Math.max(...hs);
  if (minH < maxH * 0.55) throw new Error(`crowd.png: sprite heights vary too much (${minH}..${maxH}); check the grid`);

  // 4. pack: 5 columns x 3 rows, each slot sized to the largest sprite, 4px gutters
  const slotW = Math.max(...sprites.map((s) => s.width)) + 4;
  const slotH = Math.max(...sprites.map((s) => s.height)) + 4;
  const atlasW = slotW * COLS, atlasH = slotH * ROWS;
  const rects = [];
  const composites = sprites.map((s, i) => {
    const x = (i % COLS) * slotW + 2, y = Math.floor(i / COLS) * slotH + 2;
    rects.push({ x, y, w: s.width, h: s.height });
    return { input: s.png, left: x, top: y };
  });
  const dest = out("public/footer/crowd-atlas.webp");
  await ensureDir(dest);
  await sharp({ create: { width: atlasW, height: atlasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites)
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(dest);
  const json = out("src/data/crowd-atlas.json");
  await ensureDir(json);
  await fs.writeFile(json, JSON.stringify({ src: "/footer/crowd-atlas.webp", width: atlasW, height: atlasH, sprites: rects }, null, 2));
  console.log(`crowd -> ${sprites.length} sprites, heights ${minH}..${maxH}px, atlas ${atlasW}x${atlasH}`);
}

async function projects() {
  const dir = process.env.PROJECT_SRC_DIR;
  if (!dir) {
    console.log("projects: PROJECT_SRC_DIR not set, skipping");
    return;
  }
  const files = (await fs.readdir(dir)).filter((f) => /\.(png|jpe?g)$/i.test(f));
  for (const f of files) {
    const dest = out(`public/projects/${f.replace(/\.(png|jpe?g)$/i, ".webp")}`);
    await ensureDir(dest);
    await sharp(path.join(dir, f)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(dest);
    console.log("project ->", path.relative(root, dest));
  }
}

async function documents() {
  const dest = out("public/Kaushal-Shahare-Resume.pdf");
  await fs.copyFile(ref("Kaushal-resume.pdf"), dest);
  console.log("resume ->", path.relative(root, dest));
}

async function grain() {
  // 256x256 monochrome noise tile for the film-grain overlay
  const size = 192;
  const buf = Buffer.alloc(size * size * 4);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < size * size; i++) {
    const v = Math.round(rand() * 255);
    buf[i * 4] = buf[i * 4 + 1] = buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = Math.round(18 + rand() * 30);
  }
  const dest = out("public/grain.webp");
  await sharp(buf, { raw: { width: size, height: size, channels: 4 } }).webp({ quality: 55, alphaQuality: 60, effort: 6 }).toFile(dest);
  console.log("grain ->", path.relative(root, dest));
}

await grain();
await hero();
await character();
await crowd();
await projects();
await documents();
