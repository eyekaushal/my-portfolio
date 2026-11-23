"use client";

import { useEffect, useRef } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * The hero photo flies down into the biography slot as you scroll, growing and
 * doing one full turn around its vertical axis. Position comes straight from the
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
    const render = () => {
      raf = 0;
      if (reduce.matches) return setActive(false);
      const p = Math.min(1, Math.max(0, scrollY / end));
      if (p <= 0 || p >= 1) return setActive(false);
      const e = ease(p);
      const scale = lerp(from.w / to.w, 1, e);
      const cx = lerp(from.x, to.x, e);
      const cy = lerp(from.y, to.y, e) - scrollY;
      cardEl.style.transform = `translate3d(${cx - to.w / 2}px, ${cy - to.h / 2}px, 0) scale(${scale}) rotateY(${360 * e}deg)`;
      cardEl.style.borderRadius = `${lerp(9, 16, e) / scale}px`;
      setActive(true);
    };
    const queue = () => {
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
