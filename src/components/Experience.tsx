"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "@/data/content";

export function Experience() {
  const roadmap = useRef<HTMLDivElement>(null);
  const [road, setRoad] = useState({ d: "", w: 1, h: 1 });

  useEffect(() => {
    const el = roadmap.current;
    if (!el) return;
    let cancelled = false;
    const build = () => {
      if (cancelled) return;
      const base = el.getBoundingClientRect();
      const pts = Array.from(el.querySelectorAll(".journey-stop-marker")).map((m) => {
        const r = m.getBoundingClientRect();
        return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
      });
      if (pts.length < 2) return;
      const vertical = matchMedia("(max-width: 1000px)").matches;
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        if (vertical) {
          const my = (a.y + b.y) / 2;
          d += ` C ${a.x + 28} ${my}, ${b.x - 20} ${my}, ${b.x} ${b.y}`;
        } else {
          const mx = (a.x + b.x) / 2;
          d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
        }
      }
      setRoad({ d, w: base.width, h: base.height });
    };
    const ro = new ResizeObserver(build);
    ro.observe(el);
    el.querySelectorAll(".journey-stop").forEach((s) => ro.observe(s));
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.drawn = String(entry.isIntersecting);
    }, { threshold: 0.2 });
    io.observe(el);
    build();
    document.fonts?.ready.then(build);
    return () => {
      cancelled = true;
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <section id="experience" className="experience-section section-pad" aria-labelledby="experience-title">
      <div className="wrap">
        <div className="experience-heading" data-reveal>
          <h2 id="experience-title">Experience.</h2>
          <p>
            {experience.note[0]}
            <br /> {experience.note[1]}
          </p>
        </div>
        <div className="journey-roadmap" ref={roadmap} style={{ "--stops": experience.stops.length } as React.CSSProperties}>
          <svg className="journey-road" viewBox={`0 0 ${road.w} ${road.h}`} preserveAspectRatio="none" aria-hidden="true">
            <path className="journey-road-base" d={road.d} />
            <path key={road.d} className="journey-road-ink" d={road.d} pathLength={1} />
          </svg>
          {experience.stops.map((s, i) => (
            <article key={s.id} className={`journey-stop${i === 0 ? " journey-latest" : ""}`} aria-labelledby={`stop-${s.id}`}>
              <span className="journey-stop-marker" aria-hidden="true">
                <span />
              </span>
              <div className="journey-stop-content" data-reveal style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}>
                <p className="journey-date">
                  <span className="journey-current">{s.badge}</span>
                  <span>{s.date}</span>
                </p>
                <h3 id={`stop-${s.id}`}>{s.title}</h3>
                <p className="journey-place">
                  {s.place}
                  <span>{s.placeSub}</span>
                </p>
                {s.description ? <p className="journey-description">{s.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
