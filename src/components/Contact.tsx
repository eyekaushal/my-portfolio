"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { contact, site, socials } from "@/data/content";
import { PlatformLogo } from "./icons";

export function Contact() {
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied(""), 2200);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!message) {
      setError("Add a short message first.");
      return;
    }
    setError("");
    const subject = name ? `Hello from ${name}` : "Hello from your portfolio";
    const body = [message, "", name || from ? `— ${[name, from].filter(Boolean).join(", ")}` : ""].join("\n").trim();
    const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    window.location.href = href;
  }

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="wrap contact-layout">
        <div className="contact-opening" data-reveal>
          <h2 id="contact-title">Let’s talk.</h2>
          <p>{contact.line}</p>
          <div className="contact-details">
            <div className="email-block">
              <a className="email-link" href={`mailto:${site.email}`}>
                {site.email}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <button type="button" className="icon-button copy-email" onClick={copyEmail} aria-label="Copy email address">
                {copied === "ok" ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <span className="copy-status" role="status">
              {copied === "ok" ? "Email copied." : copied === "fail" ? "Couldn’t copy. Select the address instead." : ""}
            </span>
          </div>
          <div className="social-links">
            {socials.map((s) => (
              <a key={s.platform} href={s.href} target="_blank" rel="noreferrer">
                <PlatformLogo platform={s.platform} />
                {s.platform}
              </a>
            ))}
            <a href={site.resume} target="_blank" rel="noreferrer">
              Resume <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <form className="contact-form" onSubmit={onSubmit} data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          <div className="contact-field">
            <label htmlFor="contact-name">Your name</label>
            <input id="contact-name" name="name" autoComplete="name" placeholder="What should I call you?" />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-email">Email address</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" />
          </div>
          <div className="contact-field contact-message">
            <label htmlFor="contact-message">What do you have in mind?</label>
            <textarea id="contact-message" name="message" placeholder="A little about your opportunity or project…" />
          </div>
          <div className="contact-submit">
            <button type="submit" className="button draft-button">
              Create email draft
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
            {error ? (
              <p className="contact-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          {draft ? (
            <div className="draft-ready" role="status">
              <p>Your draft is ready in your email app.</p>
              <a className="draft-link" href={draft}>
                Didn’t open? Open it again <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
