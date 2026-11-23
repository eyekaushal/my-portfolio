"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { hero, heroCode, site } from "@/data/content";
import { CodeMark } from "./icons";

/**
 * Draws the code text into a canvas (in columns, like the reference). Canvas
 * keeps this decorative layer out of the page's Largest Contentful Paint.
 */
function useCodeCanvas(wrap: React.RefObject<HTMLDivElement | null>, dim: React.RefObject<HTMLCanvasElement | null>, lit: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const el = wrap.current, a = dim.current, b = lit.current;
    if (!el || !a || !b) return;
    let raf = 0;
    const lines = `${heroCode}\n\n${heroCode}\n\n${heroCode}`.split("\n");
    const paint = () => {
      raf = 0;
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cs = getComputedStyle(el);
      for (const c of [a, b]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const ctx = a.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `400 12px ${cs.fontFamily}`;
      ctx.fillStyle = cs.color;
      ctx.textBaseline = "top";
      const padX = 20, padY = 12, lh = 20.4, gap = 40;
      const cols = Math.max(1, Math.min(3, Math.floor((w - 2 * padX + gap) / (520 + gap))));
      const colW = (w - 2 * padX - gap * (cols - 1)) / cols;
      const perCol = Math.ceil((h - padY) / lh);
      for (let c = 0, i = 0; c < cols; c++) {
        for (let r = 0; r < perCol; r++, i++) {
          ctx.fillText(lines[i % lines.length], padX + c * (colW + gap), padY + r * lh, colW);
        }
      }
      const ctxB = b.getContext("2d");
      ctxB?.drawImage(a, 0, 0);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const ro = new ResizeObserver(queue);
    ro.observe(el);
    const mo = new MutationObserver(queue);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.fonts?.ready.then(queue);
    queue();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [wrap, dim, lit]);
}

/**
 * Faint code behind the headline. A second, brighter copy is masked by a radial
 * gradient that follows the pointer, so the code lights up around the cursor.
 * Pure CSS masking: the GPU composites it, no per-frame text rendering.
 */
function GlyphBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLCanvasElement>(null);
  const litRef = useRef<HTMLCanvasElement>(null);
  useCodeCanvas(ref, dimRef, litRef);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let raf = 0;
    let tx = -999, ty = -999, x = -999, y = -999;
    let rect = el.getBoundingClientRect();

    const apply = () => {
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    };
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      apply();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (!visible || !fine.matches) return;
      rect = el.getBoundingClientRect();
      const nx = e.clientX - rect.left, ny = e.clientY - rect.top;
      if (x < -900 || reduce.matches) {
        x = nx;
        y = ny;
      }
      tx = nx;
      ty = ny;
      el.dataset.active = "true";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      el.dataset.active = "false";
    };
    const scroll = () => {
      // keep the spotlight under a stationary cursor while the page scrolls
      if (!fine.matches || tx < -900) return;
      const r = el.getBoundingClientRect();
      const dy = r.top - rect.top;
      rect = r;
      ty -= dy;
      y -= dy;
      apply();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) leave();
    });
    io.observe(el);
    el.dataset.active = "false";
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return (
    <div ref={ref} className="glyph-background hero-code-background" aria-hidden="true">
      <canvas ref={dimRef} className="glyph-layer glyph-dim" />
      <canvas ref={litRef} className="glyph-layer glyph-lit" />
    </div>
  );
}

function HeroTitle({ onIntro }: { onIntro: () => void }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const title = ref.current;
    const heroEl = title?.closest<HTMLElement>(".hero");
    if (!title || !heroEl) return;
    const mm = gsap.matchMedia();
    mm.add({ animate: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      if (ctx.conditions?.reduce) {
        heroEl.dataset.heroIntro = "done";
        onIntro();
        return;
      }
      const marks = title.querySelectorAll(".hero-code-mark svg");
      const letters = title.querySelectorAll(".hero-letter");
      const all = [...letters, ...marks];
      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          heroEl.dataset.heroIntro = "pending";
          gsap.set(all, { willChange: "transform,opacity" });
        },
        onComplete: () => {
          heroEl.dataset.heroIntro = "done";
          gsap.set(all, { clearProps: "transform,opacity,willChange" });
        },
      });
      tl.addLabel("headline", 0).addLabel("tags", 0.06);
      tl.fromTo(
        marks,
        { rotation: (i: number) => (i === 0 ? -45 : 45), scale: 0.96, opacity: 0, transformOrigin: "50% 50%" },
        { rotation: 0, scale: 1, opacity: 1, duration: 0.95, stagger: 0.08, ease: "power3.out" },
        "tags",
      );
      title.querySelectorAll(".hero-word").forEach((word, w) => {
        const dir = w === 0 ? 1 : -1;
        tl.fromTo(
          word.querySelectorAll(".hero-letter"),
          { yPercent: 105 * dir, rotationX: -80 * dir, scaleY: 0.65, opacity: 0, transformOrigin: w === 0 ? "50% 100%" : "50% 0%" },
          { yPercent: 0, rotationX: 0, scaleY: 1, opacity: 1, duration: 0.82, stagger: { each: 0.035, from: w === 0 ? "start" : "end" }, ease: "power3.out" },
          `headline+=${0.1 * w}`,
        );
      });
      tl.call(onIntro, [], 0.55);

      const mostlyVisible = () => {
        const r = title.getBoundingClientRect();
        return Math.min(r.bottom, innerHeight) - Math.max(r.top, 0) >= 0.4 * r.height;
      };
      const reset = () => {
        tl.pause(0);
        heroEl.dataset.heroIntro = "pending";
        gsap.set(all, { opacity: 0, clearProps: "willChange" });
      };
      const play = () => {
        reset();
        tl.restart();
      };
      let shown = mostlyVisible();
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (entry.intersectionRatio >= 0.4 && !shown) {
              shown = true;
              play();
            }
          } else {
            reset();
            shown = false;
          }
        },
        { threshold: [0, 0.4] },
      );
      io.observe(title);
      if (shown) play();
      else reset();
      return () => {
        io.disconnect();
        tl.kill();
        gsap.set(all, { clearProps: "transform,opacity,willChange" });
        heroEl.dataset.heroIntro = "done";
      };
    });
    return () => mm.revert();
  }, [onIntro]);

  return (
    <h1 ref={ref} className="hero-title" aria-label={hero.titleLines.join(" ")}>
      {hero.titleLines.map((line, l) => (
        <span key={line} className="title-line" aria-hidden="true">
          <span className="hero-word">
            <CodeMark side={l === 0 ? "open" : "close"} />
            {Array.from(line).map((ch, i) => (
              <span key={`${ch}-${i}`} className="hero-letter-window">
                <span className="hero-letter">{ch}</span>
              </span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}

/** "{{ /AI & FULL-STACK DEVELOPMENT }}" typed out once the headline lands. */
function Typewriter({ text, start }: { text: string; start: number }) {
  const [shown, setShown] = useState(text.length);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!start) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text.length);
      return;
    }
    let i = 0;
    setShown(0);
    setRunning(true);
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= text.length) window.clearInterval(id);
    }, 34);
    return () => window.clearInterval(id);
  }, [start, text]);
  return (
    <span className="terminal-text" data-running={running}>
      <span aria-hidden="true">{"{{"}&nbsp;</span>
      <span>{text.slice(0, shown)}</span>
      <span className="terminal-caret" aria-hidden="true" />
      <span aria-hidden="true">&nbsp;{"}}"}</span>
    </span>
  );
}

export function Hero() {
  const [introCount, setIntroCount] = useState(0);
  const onIntro = useRef(() => setIntroCount((n) => n + 1)).current;
  return (
    <div className="hero wrap" data-hero-intro="pending">
      <GlyphBackground />
      <a href="#biography" className="hero-portrait-link" aria-label={`About ${site.name}`} data-portrait="hero">
        <Image src="/images/kaushal.jpg" alt={`${site.name} in black and white`} width={1200} height={1311} priority sizes="(max-width: 700px) 220px, 320px" />
      </a>
      <div className="hero-heading-composition">
        <HeroTitle onIntro={onIntro} />
      </div>
      <div className="hero-footer">
        <span className="hero-year">©{site.year}</span>
        <p className="hero-focus">
          <Typewriter text={hero.focus} start={introCount} />
        </p>
      </div>
    </div>
  );
}
