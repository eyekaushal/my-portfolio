import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { bio, site, skills } from "@/data/content";

/** Renders **bold** markers from content strings. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

export function Biography() {
  return (
    <div id="biography" className="biography wrap">
      <div className="bio-introduction" data-reveal>
        <h2>
          Hi, I’m
          <br /> {site.firstName}.
        </h2>
        <p className="bio-role">
          {site.roleLines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </p>
        <div className="bio-current">
          <span>{bio.status.label}</span>
          <p>
            <strong>{bio.status.lines[0]}</strong>
            <span>{bio.status.lines[1]}</span>
          </p>
        </div>
      </div>
      <figure className="bio-portrait" data-portrait="bio">
        <Image src="/images/kaushal.jpg" alt={`Portrait of ${site.name}`} width={1200} height={1311} sizes="(max-width: 700px) 100vw, 400px" />
      </figure>
      <div className="bio-description" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
        <p className="bio-lead">
          <Rich text={bio.lead} />
        </p>
        <div className="bio-actions">
          <a href="#projects" className="bio-projects">
            Explore projects <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function TechStack() {
  return (
    <section id="skills" className="skills-section" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="skills-heading" data-reveal>
          <h2 id="skills-title">Tech Stack</h2>
          <p>
            {skills.note[0]}
            <br /> {skills.note[1]}
          </p>
        </div>
        <div className="skills-specimens">
          {skills.groups.map((g, i) => (
            <article key={g.title} className="skills-specimen" data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
              <h3>{g.title}</h3>
              <p className="skills-specimen-note">{g.note}</p>
              <ul className="skills-type-mosaic">
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
