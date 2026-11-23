import { NavPill } from "@/components/NavPill";
import { Hero } from "@/components/Hero";
import { PortraitJourney } from "@/components/PortraitJourney";
import { Biography, TechStack } from "@/components/sections";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { CrowdFooter } from "@/components/CrowdFooter";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NavPill />
      <main id="main">
        <section id="about" className="about-section" aria-label="About">
          <PortraitJourney src="/images/kaushal.jpg" />
          <Hero />
          <Biography />
        </section>
        <TechStack />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <CrowdFooter />
      <ScrollReveal />
    </>
  );
}
