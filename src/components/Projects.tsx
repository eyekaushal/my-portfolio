"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, FileText, X } from "lucide-react";
import { projects, projectsIntro, type Project } from "@/data/content";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

function ExternalLink({ href, children, className = "text-link" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}

function Folder({ project, open, onOpen }: { project: Project; open: boolean; onOpen: () => void }) {
  return (
    <button type="button" className="project-folder" aria-expanded={open} aria-controls="project-details" onClick={onOpen}>
      <span className="sr-only">
        {project.name}: {project.tagline}. Open project details
      </span>
      <span className="folder-scene" aria-hidden="true">
        <span className="folder-back" />
        <span className="folder-paper folder-paper-back">
          <FileText size={18} />
          <span>{project.badge === "Publication" ? "Paper" : "Project"}</span>
        </span>
        <span className="folder-paper folder-paper-preview">
          {project.preview.kind === "image" ? (
            <Image src={project.preview.src} alt="" width={320} height={200} sizes="240px" />
          ) : (
            <span className="folder-case-preview">
              <span>$ {project.preview.eyebrow}</span>
              <strong>{project.preview.title}</strong>
            </span>
          )}
        </span>
        <span className="folder-paper folder-paper-front">
          <FileText size={18} />
          <span>Details &amp; source</span>
          <span className="folder-paper-lines" />
        </span>
        <span className="folder-front">
          {project.badge ? <span className="folder-badge">{project.badge}</span> : null}
          <span className="folder-front-title">{project.name}</span>
          <span className="folder-open-icon">
            <ArrowUpRight size={18} />
          </span>
        </span>
      </span>
    </button>
  );
}

function TerminalCard() {
  return (
    <div className="terminal-card" aria-hidden="true">
      <div>
        <span className="dim">$</span> promptgauge ablate --config promptgauge.yaml
      </div>
      <div className="dim">→ estimating cost before the first call</div>
      <div className="dim">→ deleting one segment at a time</div>
      <div className="dim">→ re-scoring on your test cases</div>
      <div className="dim">→ confirmation run vs original</div>
      <div className="ok">✓ shorter prompt, same score</div>
    </div>
  );
}

function Study({ project }: { project: Project }) {
  const style = { "--study-tint": project.image.tint, "--study-tint-light": project.image.tintLight } as React.CSSProperties;
  return (
    <article className="project-study" aria-labelledby={`study-${project.id}`}>
      <a className="project-image-link" href={project.primary.href} target="_blank" rel="noreferrer" aria-label={`${project.primaryLabel}: ${project.name}`}>
        <figure className="project-image" style={style}>
          {project.image.src ? (
            <Image src={project.image.src} alt={project.image.alt} width={1600} height={1000} sizes="(max-width: 700px) 100vw, 560px" />
          ) : (
            <TerminalCard />
          )}
          <span className="image-action" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </figure>
      </a>
      <div className="study-content">
        <h3 id={`study-${project.id}`}>{project.name}</h3>
        <p className="project-category">{project.category}</p>
        <p className="study-summary">{project.summary}</p>
        <details className="project-details" open>
          <summary>
            Inside {project.name}
            <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <div className="detail-body">
            <p className="study-description">{project.description}</p>
            {project.outcome ? <p className="study-outcome">{project.outcome}</p> : null}
            <div className="stack-list" aria-label="Stack">
              {project.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <div className="project-links">
              {project.links.map((l) => (
                <ExternalLink key={l.href} href={l.href}>
                  {l.label}
                </ExternalLink>
              ))}
            </div>
          </div>
        </details>
        <details className="project-details" open>
          <summary>
            Architecture walkthrough
            <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <div className="detail-body">
            <ArchitectureDiagram diagram={project.diagram} label={project.name} />
          </div>
        </details>
      </div>
    </article>
  );
}

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const shouldScroll = useRef(false);
  const open = projects.find((p) => p.id === openId) ?? null;

  useEffect(() => {
    if (!open || !shouldScroll.current) return;
    shouldScroll.current = false;
    const instant = matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.current?.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
    panel.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <section id="projects" className="projects-section section-pad" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div>
            <h2 id="projects-title">
              Featured
              <br /> Projects
            </h2>
            <p className="projects-intro">{projectsIntro}</p>
          </div>
          <ExternalLink href="https://github.com/eyekaushal">GitHub</ExternalLink>
        </div>

        <ul className="project-folder-grid" role="list" style={{ listStyle: "none", margin: 0, paddingLeft: 0 }}>
          {projects.map((p, i) => (
            <li key={p.id} className="project-folder-item" data-reveal style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}>
              <Folder
                project={p}
                open={openId === p.id}
                onOpen={() => {
                  shouldScroll.current = true;
                  setOpenId(p.id);
                }}
              />
              <div className="folder-caption">
                <span>{p.tagline}</span>
                <a className="folder-caption-action" href={p.primary.href} target="_blank" rel="noreferrer">
                  {p.primaryLabel} <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div id="project-details" ref={panel} className="project-details-panel" tabIndex={-1} hidden={!open} aria-label="Project details">
          {open ? (
            <>
              <div className="project-panel-toolbar">
                <span>{open.badge === "Publication" ? "Publication details" : "Project details"}</span>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Close project details"
                  onClick={() => {
                    const id = open.id;
                    setOpenId(null);
                    document.querySelector<HTMLButtonElement>(`[aria-controls="project-details"][aria-expanded="true"]`)?.blur();
                    const folder = Array.from(document.querySelectorAll<HTMLElement>(".project-folder"))[projects.findIndex((p) => p.id === id)];
                    folder?.focus({ preventScroll: false });
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              <Study key={open.id} project={open} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
