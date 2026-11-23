"use client";

import { useEffect, useRef } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The hero photo flies down into the biography slot as you scroll, growing and
 * flipping once around its vertical axis. Position comes straight from the
 * two real images, so it lands exactly on the bio portrait at any viewport size.
 */
export function PortraitJourney({ src }: { src: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stageEl = stage.current;
    const cardEl = card.current;
    const section = stageEl?.closest<HTMLElement>(".about-section");
    const heroImg = section?.querySelector<HTMLElement>('[data-portrait="hero"]');
    const bioImg = section?.querySelector<HTMLElement>('[data-portrait="bio"]');
    if (!stageEl || !cardEl || !section || !heroImg || !bioImg) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");

    let from = { x: 0, y: 0, w: 1, h: 1 };
    let to = { x: 0, y: 0, w: 1, h: 1 };
    let end = 1;
    let raf = 0;
    let active = false;

    const docRect = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + scrollY + r.height / 2, w: r.width, h: r.height };
    };
    const setActive = (on: boolean) => {
      if (on === active) return;
      active = on;
      stageEl.dataset.active = String(on);
      section.classList.toggle("portrait-flying", on);
    };
    // Progress trails the scroll with exponential damping (as in the reference),
    // so the flight stays smooth even with a jumpy wheel or trackpad.
    const coarse = matchMedia("(max-width: 700px) and (pointer: coarse)");
    let h = 0; // displayed progress
    let lastT = 0;
    const target = () => Math.min(1, Math.max(0, scrollY / end));
    const draw = () => {
      const u = target();
      if ((h <= 0 && u <= 0) || (h >= 1 && u >= 1)) return setActive(false);
      const turn = h * h * (3 - 2 * h); // smoothstep, one half-turn
      const scale = lerp(from.w / to.w, 1, h);
      const cx = lerp(from.x, to.x, h);
      const cy = lerp(from.y, to.y, h) - scrollY;
      cardEl.style.transform = `translate3d(${cx - to.w / 2}px, ${cy - to.h / 2}px, 0) scale(${scale}) rotateY(${180 * turn}deg)`;
      cardEl.style.borderRadius = `${lerp(9, 16, h) / scale}px`;
      setActive(true);
    };
    const render = (now: number) => {
      raf = 0;
      if (reduce.matches) {
        h = 0;
        return setActive(false);
      }
      const dt = lastT ? Math.min(now - lastT, 64) : 16.67;
      lastT = now;
      const u = target();
      h += (u - h) * (1 - Math.exp(-dt / (coarse.matches ? 100 : 65)));
      const settled = Math.abs(u - h) < 1e-4;
      if (settled) h = u;
      draw();
      if (settled) lastT = 0;
      else raf = requestAnimationFrame(render);
    };
    const queue = () => {
      draw(); // keep the card glued to the page on this exact scroll frame
      if (!raf) raf = requestAnimationFrame(render);
    };
    const measure = () => {
      from = docRect(heroImg);
      to = docRect(bioImg);
      end = Math.max(1, to.y - innerHeight / 2);
      cardEl.style.width = `${to.w}px`;
      cardEl.style.height = `${to.h}px`;
      queue();
    };

    const ro = new ResizeObserver(measure);
    ro.observe(heroImg);
    ro.observe(bioImg);
    ro.observe(document.body);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("pageshow", measure);
    reduce.addEventListener("change", measure);
    document.fonts?.ready.then(measure);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("pageshow", measure);
      reduce.removeEventListener("change", measure);
      section.classList.remove("portrait-flying");
    };
  }, []);

  return (
    <div ref={stage} className="portrait-journey" aria-hidden="true" data-active="false">
      <div ref={card} className="portrait-card">
        <div className="portrait-face portrait-face-front">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" decoding="async" />
        </div>
        <div className="portrait-face portrait-face-back">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" decoding="async" />
        </div>
      </div>
    </div>
  );
}
