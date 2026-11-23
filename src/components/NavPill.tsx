"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { Ellipsis, Moon, Sun, X } from "lucide-react";
import { navPrimary, navSecondary, site, socials } from "@/data/content";
import { PlatformLogo } from "./icons";
import { WaveText } from "./WaveText";

const THEME_EVENT = "portfolio-theme";

function subscribeTheme(cb: () => void) {
  window.addEventListener(THEME_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(THEME_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Letters wrapped one by one so the close animation can drop them. */
function MenuText({ children }: { children: string }) {
  return (
    <span className="nav-menu-text">
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {Array.from(children).map((ch, i) => (
          <span key={i} className="nav-menu-piece">
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}

type Spin = { from: number; target: number; started: number; speed: number; fastFor: number; coastFor: number };

/** Wordmark spin: spins on its own every 3s, and on hover; coasts to rest on a full turn. */
function useWordmarkSpin(ref: React.RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const el = ref.current;
    const link = el?.closest("a");
    if (!el || !link) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let spin: Spin | null = null;
    let raf = 0;
    let timer = 0;
    let hovering = false;

    const state = (now: number) => {
      if (!spin) return { angle: 0, speed: 0, finished: true };
      const t = Math.max(0, now - spin.started);
      if (t < spin.fastFor) return { angle: spin.from + spin.speed * t, speed: spin.speed, finished: false };
      const r = Math.min(1, (t - spin.fastFor) / spin.coastFor);
      const coast = (spin.speed * spin.coastFor) / 2;
      return { angle: spin.from + spin.speed * spin.fastFor + coast * (2 * r - r * r), speed: spin.speed * (1 - r), finished: r === 1 };
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      spin = null;
      el.style.removeProperty("transform");
      el.style.removeProperty("will-change");
    };
    const frame = (now: number) => {
      const s = state(now);
      if (s.finished) return stop();
      el.style.transform = `rotate(${s.angle}deg)`;
      raf = requestAnimationFrame(frame);
    };
    const run = (next: Spin) => {
      cancelAnimationFrame(raf);
      spin = next;
      el.style.willChange = "transform";
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (reduce.matches) return;
      const now = performance.now();
      const { angle } = state(now);
      let remaining = 360 - (((angle % 360) + 360) % 360);
      if (remaining < 180) remaining += 360;
      run({ from: angle, target: angle + remaining, started: now, speed: 1.05, fastFor: 120, coastFor: (2 * (remaining - 126)) / 1.05 });
    };
    const settle = () => {
      if (!spin) return;
      const now = performance.now();
      const s = state(now);
      if (s.finished || s.speed <= 0) return stop();
      run({ from: s.angle, target: spin.target, started: now, speed: s.speed, fastFor: 0, coastFor: (2 * (spin.target - s.angle)) / s.speed });
    };
    const schedule = () => {
      clearInterval(timer);
      if (reduce.matches || document.hidden) {
        hovering = false;
        stop();
        return;
      }
      if (!hovering && document.activeElement !== link) {
        timer = window.setInterval(() => {
          if (!spin && !hovering) start();
        }, 3000);
      }
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "touch" || hovering) return;
      hovering = true;
      clearInterval(timer);
      start();
    };
    const leave = () => {
      hovering = false;
      settle();
      schedule();
    };
    const focus = () => {
      clearInterval(timer);
      if (!hovering && link.matches(":focus-visible")) start();
    };
    const blur = () => {
      if (!hovering) settle();
      schedule();
    };
    link.addEventListener("pointerenter", enter);
    link.addEventListener("pointerleave", leave);
    link.addEventListener("focus", focus);
    link.addEventListener("blur", blur);
    reduce.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      clearInterval(timer);
      stop();
      link.removeEventListener("pointerenter", enter);
      link.removeEventListener("pointerleave", leave);
      link.removeEventListener("focus", focus);
      link.removeEventListener("blur", blur);
      reduce.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [ref]);
}

export function NavPill() {
  const dark = useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.dataset.theme !== "light",
    () => true,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const motion = useRef<"closed" | "open" | "closing">("closed");
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  useWordmarkSpin(wordRef);

  useEffect(() => () => void tl.current?.kill(), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function toggleTheme() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || motion.current !== "closed") return;
    tl.current?.kill();
    const pieces = dialog.querySelectorAll(".nav-menu-piece, .wave-glyph");
    gsap.set([dialog, ...pieces], { clearProps: "transform,opacity,visibility,willChange" });
    gsap.set(dialog, { "--nav-backdrop-opacity": 1 });
    motion.current = "open";
    delete dialog.dataset.motion;
    dialog.showModal();
    setOpen(true);
    dialog.querySelector(".nav-panel")?.scrollTo(0, 0);
  }

  function closeMenu(after?: () => void) {
    const dialog = dialogRef.current;
    if (!dialog?.open || motion.current === "closing") return;
    tl.current?.kill();
    motion.current = "closing";
    dialog.dataset.motion = "closing";
    const finish = () => {
      dialog.close();
      after?.();
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();

    const pieces = Array.from(dialog.querySelectorAll<HTMLElement>(".nav-menu-piece, .wave-glyph"));
    const box = dialog.getBoundingClientRect();
    const drop = pieces.map((p) => box.bottom - p.getBoundingClientRect().top + 80);
    const btn = triggerRef.current?.getBoundingClientRect();
    tl.current = gsap
      .timeline({ onComplete: finish })
      .set(pieces, { willChange: "transform,opacity" }, 0.22)
      .to(
        pieces,
        {
          y: (i: number) => `+=${drop[i]}`,
          x: (i: number) => `+=${((29 * i) % 83) - 41}`,
          rotation: (i: number) => ((37 * i) % 97) - 48,
          duration: 0.7,
          stagger: { amount: 0.18, from: "random" },
          ease: "power2.in",
        },
        0.22,
      )
      .to(pieces, { autoAlpha: 0, duration: 0.16, stagger: { amount: 0.18 }, ease: "power1.in" }, 0.76)
      .to(
        dialog,
        {
          scaleX: btn ? btn.width / box.width : 0.06,
          scaleY: btn ? btn.height / box.height : 0.04,
          x: btn ? btn.right - box.right : 0,
          y: btn ? btn.top - box.top : -16,
          transformOrigin: "top right",
          autoAlpha: 0,
          "--nav-backdrop-opacity": 0,
          duration: 0.46,
          ease: "power3.inOut",
        },
        "+=.12",
      );
  }

  function onDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    const dialog = e.currentTarget;
    const r = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) {
      closeMenu();
      return;
    }
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") ?? "";
    if (href.startsWith("#")) {
      e.preventDefault();
      closeMenu(() => {
        const target = document.querySelector(href);
        const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;
        target?.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
        history.replaceState(null, "", href);
      });
    } else {
      closeMenu();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Tab") return;
    const items = e.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#about" aria-label={`${site.name}, back to top`}>
            <span className="wordmark-text" ref={wordRef}>
              {site.firstName}
            </span>
          </a>
          <div className="header-actions">
            <button type="button" className="icon-button theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode" aria-pressed={dark} suppressHydrationWarning>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              ref={triggerRef}
              type="button"
              className="icon-button nav-menu-trigger"
              aria-label="Navigation menu"
              aria-expanded={open}
              aria-controls="navigation-panel"
              aria-haspopup="dialog"
              onClick={openMenu}
            >
              <Ellipsis size={24} />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id="navigation-panel"
        className="nav-dialog"
        aria-label="Navigation menu"
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          tl.current?.kill();
          motion.current = "closed";
          setOpen(false);
          triggerRef.current?.focus({ preventScroll: true });
        }}
        onClick={onDialogClick}
        onKeyDown={onKeyDown}
      >
        <div className="nav-panel">
          <div className="nav-panel-top">
            <button type="button" className="nav-panel-close" onClick={() => closeMenu()} aria-label="Close navigation menu">
              <MenuText>close</MenuText>
              <span className="nav-close-circle" aria-hidden="true">
                <X size={24} />
              </span>
            </button>
          </div>
          <nav className="nav-panel-links" aria-label="Site">
            <div className="nav-menu-primary">
              {navPrimary.map((l) => (
                <a key={l.href} href={l.href} className="wave-target">
                  <WaveText>{l.label}</WaveText>
                </a>
              ))}
            </div>
            <div className="nav-menu-secondary">
              {navSecondary.map((l) => (
                <a key={l.href} href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                  <MenuText>{l.label}</MenuText>
                </a>
              ))}
            </div>
          </nav>
          <div className="nav-panel-footer">
            <a className="nav-panel-email" href={`mailto:${site.email}`}>
              <MenuText>{site.email}</MenuText>
            </a>
            <div className="nav-panel-socials">
              {socials.map((s) => (
                <a key={s.platform} href={s.href} target="_blank" rel="noreferrer" aria-label={s.platform}>
                  <PlatformLogo platform={s.platform} size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
