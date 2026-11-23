"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import atlas from "@/data/crowd-atlas.json";
import { footerLinks, site } from "@/data/content";

/** Deterministic pseudo-random in [0, 1). */
const T = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Walker = {
  sprite: number;
  layer: 0 | 1; // 0 = behind the character, 1 = in front
  h: number;
  top: number;
  speed: number;
  phase: number;
  dir: 1 | -1;
  bob: number;
  bobPhase: number;
};

const NAME = `${site.firstName.toUpperCase()}.`;
const CROSSING_SECONDS = 11.5;

export function CrowdFooter() {
  const scene = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const portrait = useRef<HTMLImageElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(false);
  const sync = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    sync.current();
  }, [paused]);

  useEffect(() => {
    const sceneEl = scene.current;
    const backEl = back.current;
    const frontEl = front.current;
    const portraitEl = portrait.current;
    const nameEl = nameRef.current;
    if (!sceneEl || !backEl || !frontEl || !portraitEl || !nameEl) return;
    const ctxBack = backEl.getContext("2d");
    const ctxFront = frontEl.getContext("2d");
    if (!ctxBack || !ctxFront) return;

    const reduceMq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(reduceMq.matches);
    const sheet = new Image();
    sheet.decoding = "async";
    sheet.src = atlas.src;

    let disposed = false;
    let ready = false;
    let visible = false;
    let raf = 0;
    let last = 0;
    let elapsed = 0; // seconds of animation actually played (pauses keep position)
    let W = 0, H = 0, dpr = 1;
    let walkers: Walker[] = [];
    let span = 1;
    let maxW = 0;

    const measurer = document.createElement("canvas").getContext("2d");
    const fitName = () => {
      if (!measurer || !W) return;
      // width of the name at 100px, including the -0.04em tracking
      measurer.font = `800 100px ${getComputedStyle(nameEl).fontFamily}`;
      const at100 = measurer.measureText(NAME).width - 4 * NAME.length;
      const cap = W >= 600 ? Math.min(W * 0.227, 370) : W * 0.3;
      const size = Math.min(cap, (100 * W * 0.96) / Math.max(1, at100));
      nameEl.style.setProperty("--crowd-name-size", `${size.toFixed(1)}px`);
    };

    const layout = () => {
      const w = sceneEl.clientWidth, h = sceneEl.clientHeight;
      if (!w || !h) return;
      W = w;
      H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [backEl, frontEl]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      fitName();
      const ph = portraitEl.getBoundingClientRect().height || Math.min(365, H - 24);
      const s = Math.min(1, ph / 310);
      const o = W / (1440 * s);
      const counts = W >= 600 ? [25, 16] : [Math.max(7, Math.round(25 * o)), Math.max(3, Math.round(16 * o))];
      const total = counts[0] + counts[1];
      walkers = Array.from({ length: total }, (_, t): Walker => {
        const row = t < counts[0] ? 0 : 1;
        const i = row === 0 ? t : t - counts[0];
        const n = counts[row];
        const height = (row === 1 ? 250 + 30 * T(t + 8) : 170 + 35 * T(t + 8)) * s;
        const top = row === 0 ? H - ph - 12 + 24 * T(t + 4) : H - height + 30 * s + 15 * T(t + 4);
        return {
          sprite: (t * 7 + row * 4) % atlas.sprites.length,
          layer: row === 1 || i % 3 === 0 ? 1 : 0,
          h: height,
          top,
          speed: [0.7, 1.05][row] * (0.88 + 0.24 * T(t + 97)),
          phase: (i + 0.85 * T(t + 41)) / n,
          dir: row === 1 ? -1 : 1,
          bob: (5 + 5 * T(t + 13)) * s,
          bobPhase: T(t + 29) * Math.PI,
        };
      }).sort((a, b) => a.top - b.top);
      maxW = Math.max(...walkers.map((wk) => (wk.h * atlas.sprites[wk.sprite].w) / atlas.sprites[wk.sprite].h));
      span = W + 2 * maxW;
      draw();
    };

    const draw = () => {
      if (!ready || !W) return;
      for (const c of [ctxBack, ctxFront]) {
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        c.imageSmoothingQuality = "high";
      }
      const pxPerSec = span / CROSSING_SECONDS;
      for (const wk of walkers) {
        const r = atlas.sprites[wk.sprite];
        const dw = (wk.h * r.w) / r.h;
        let u = (wk.phase * span + elapsed * pxPerSec * wk.speed) % span;
        if (wk.dir === -1) u = span - u;
        const x = u - maxW;
        const y = wk.top - Math.abs(Math.sin(elapsed * Math.PI * 2 + wk.bobPhase)) * wk.bob;
        (wk.layer ? ctxFront : ctxBack).drawImage(sheet, r.x, r.y, r.w, r.h, Math.round(x), y, dw, wk.h);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed) return;
      if (last) elapsed += Math.min(0.1, (now - last) / 1000);
      last = now;
      draw();
      if (shouldRun()) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const shouldRun = () => ready && visible && !pausedRef.current && !document.hidden && !reduceMq.matches;
    const update = () => {
      if (shouldRun()) {
        if (!raf) raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
        draw();
      }
    };
    sync.current = update;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { rootMargin: "80px" });
    io.observe(sceneEl);
    const ro = new ResizeObserver(layout);
    ro.observe(sceneEl);
    const onMotion = () => {
      setReduced(reduceMq.matches);
      update();
    };
    reduceMq.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", update);

    sheet
      .decode()
      .then(() => {
        if (disposed) return;
        ready = true;
        sceneEl.dataset.ready = "true";
        layout();
        update();
      })
      .catch(() => {
        sceneEl.dataset.ready = "false"; // links and the character still render
      });
    document.fonts?.ready.then(() => !disposed && fitName());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      reduceMq.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", update);
      sync.current = () => {};
    };
  }, []);

  function backToTop(e: React.MouseEvent) {
    e.preventDefault();
    const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: instant ? "instant" : "smooth" });
    history.replaceState(null, "", location.pathname);
  }

  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-identity">
          <h2>{site.firstName}.</h2>
          <p>
            AI Engineer &amp;
            <br /> Full-Stack Developer.
          </p>
        </div>
        <nav aria-label="Footer">
          <p>Explore</p>
          <div>
            {footerLinks.map((l) => (
              <a key={l.label} href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {l.label}
              </a>
            ))}
          </div>
        </nav>
        <div className="footer-contact">
          <p>Get in touch</p>
          <a href={`mailto:${site.email}`}>
            {site.email} <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <span>
            © {site.year} {site.name}
          </span>
        </div>
      </div>

      <div className="footer-finale">
        <div className="footer-finale-heading wrap">
          <p>See you around.</p>
          <a href="#about" onClick={backToTop}>
            Back to top <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
        <p id="crowd-description" className="sr-only">
          An illustrated crowd of pedestrians walks past in two rows. {site.firstName} stands still among them in a black t-shirt and loose black
          trousers, hands in pockets, with yellow glasses and yellow sneakers.
        </p>
        <button
          ref={scene}
          type="button"
          className="footer-crowd-scene"
          disabled={reduced}
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? `${NAME} Resume crowd animation` : `${NAME} Pause crowd animation`}
          aria-describedby="crowd-description"
          aria-pressed={paused || reduced}
        >
          <span ref={nameRef} className="footer-crowd-name" aria-hidden="true">
            {NAME}
          </span>
          <canvas ref={back} className="footer-crowd-layer footer-crowd-back" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={portrait} className="footer-crowd-portrait" src="/footer/character.webp" alt="" width={303} height={900} decoding="async" />
          <canvas ref={front} className="footer-crowd-layer footer-crowd-front" aria-hidden="true" />
        </button>
        <div className="footer-scene-bottom wrap">
          <small>Finally, some traffic on my website.</small>
        </div>
      </div>
    </footer>
  );
}
