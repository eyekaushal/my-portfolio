// Every piece of text on the site lives here. Edit this file to change content.

export const site = {
  name: "Kaushal Shahare",
  firstName: "Kaushal",
  role: "AI Engineer & Full-Stack Developer",
  roleLines: ["AI Engineer", "& Full-Stack Developer."],
  email: "kaushalss234@gmail.com",
  resume: "/Kaushal-Shahare-Resume.pdf",
  url: "https://my-portfolio-nine-delta-11.vercel.app",
  description:
    "Kaushal Shahare is an AI engineer and full-stack developer who builds reliable products on top of AI, focused on cost, safety and trust.",
  year: 2026,
};

export type SocialPlatform = "LinkedIn" | "GitHub" | "LeetCode";
export const socials: { platform: SocialPlatform; href: string }[] = [
  { platform: "LinkedIn", href: "https://www.linkedin.com/in/kaushalshahare/" },
  { platform: "GitHub", href: "https://github.com/eyekaushal" },
  { platform: "LeetCode", href: "https://leetcode.com/u/8L81IjErQm/" },
];

export const hero = {
  titleLines: ["SOFTWARE", "ENGINEER"],
  focus: "/AI & FULL-STACK DEVELOPMENT",
};

export const bio = {
  status: {
    label: "Open to roles",
    lines: ["Internships & Full-Time", "Bangalore, India"],
  },
  // **double asterisks** mark the bold phrases
  lead: "I build **reliable products on top of AI**, and obsess over the parts that usually break: **cost, safety and trust.**",
};

export const skills = {
  note: ["The tools behind", "my work."],
  groups: [
    {
      title: "AI & LLM Engineering",
      note: "LLM APIs, RAG pipelines, multi-agent systems, prompt-injection defense",
      items: [
        "LLM APIs",
        "Claude API",
        "RAG Pipelines",
        "Multi-Agent Systems",
        "LangGraph",
        "Hybrid Search",
        "Prompt Engineering",
        "Prompt Injection Defense",
        "Microsoft Foundry",
      ],
    },
    {
      title: "Languages & Frameworks",
      note: "APIs, full-stack apps, CLIs and local tools",
      items: ["JavaScript", "Python", "React", "Node.js", "Express", "FastAPI", "Next.js", "Hono", "REST APIs", "HTML & CSS"],
    },
    {
      title: "Tools, Databases & Cloud",
      note: "Storage, testing, delivery",
      items: [
        "PostgreSQL",
        "SQLite",
        "ChromaDB",
        "Sequelize",
        "Zod",
        "Vitest",
        "pytest",
        "GitHub Actions",
        "Git & GitHub",
        "Vercel",
        "Azure",
        "npm",
      ],
    },
  ],
};

// ---------- Projects ----------

export type DiagramNode = { id: string; title: string; sub?: string; icon?: DiagramIcon };
export type DiagramIcon = "input" | "agent" | "shield" | "db" | "code" | "chart" | "user" | "doc" | "bolt" | "split" | "check" | "x";
export type DiagramMode = { id: string; label: string; icon: DiagramIcon; path: string[]; explanation: string };
export type Diagram = { title: string; rows: DiagramNode[][]; modes: DiagramMode[] };

export type ProjectLink = { label: string; href: string };
export type PaperPreview =
  | { kind: "image"; src: string; alt: string }
  | { kind: "card"; eyebrow: string; title: string };

export type Project = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  badge?: string;
  summary: string;
  description: string;
  stack: string[];
  links: ProjectLink[];
  primary: ProjectLink; // the "View project" link under the folder
  primaryLabel: string;
  image: { src: string; alt: string; tint: string; tintLight: string; fit?: "contain" | "cover" };
  preview: PaperPreview;
  outcome?: string;
  diagram: Diagram;
};

const gh = (repo: string) => `https://github.com/eyekaushal/${repo}`;

export const projects: Project[] = [
  {
    id: "contextlab",
    name: "contextlab",
    tagline: "Coding-agent cost profiler",
    category: "Open-source CLI + dashboard · npm",
    summary: "See where the tokens go when you use an AI coding agent, and what to change so you spend less.",
    description:
      "A local proxy for Claude Code, Codex, Gemini CLI and Aider. It parses every API call, traces the context window back to the files, tool calls and MCP servers that filled it, prices each turn, and ranks the waste with the exact config change that fixes it. The rule engine shows its own arithmetic and needs no LLM at runtime.",
    stack: ["Node.js", "React 19", "Hono", "SQLite FTS5", "Tailwind", "Vitest"],
    outcome: "Six-package pnpm monorepo, 610 tests, 99% core coverage.",
    links: [
      { label: "Source", href: gh("contextlab") },
      { label: "npm package", href: "https://www.npmjs.com/package/contextlab" },
    ],
    primary: { label: "View project", href: gh("contextlab") },
    primaryLabel: "View project",
    image: { src: "/projects/contextlab-banner.webp", alt: "contextlab banner: see where the tokens go", tint: "#2a2a27", tintLight: "#d1d2cf", fit: "contain" },
    preview: { kind: "image", src: "/projects/contextlab-banner.webp", alt: "" },
    diagram: {
      title: "How a session is traced",
      rows: [
        [{ id: "agent", title: "Coding agent", sub: "Claude Code · Codex · Gemini CLI", icon: "code" }],
        [{ id: "proxy", title: "contextlab proxy", sub: "Local, zero-dependency", icon: "split" }],
        [{ id: "parse", title: "API parsers", sub: "Anthropic · OpenAI · Gemini", icon: "doc" }],
        [{ id: "attr", title: "Token attribution", sub: "Files · tools · MCP servers", icon: "chart" }],
        [
          { id: "live", title: "Live dashboard", sub: "React 19 over SSE", icon: "chart" },
          { id: "rules", title: "Rule engine", sub: "10 rules, no LLM", icon: "check" },
        ],
      ],
      modes: [
        {
          id: "watch",
          label: "Live session",
          icon: "chart",
          path: ["agent", "proxy", "parse", "attr", "live"],
          explanation: "Every request passes through the proxy untouched. Parsed turns stream to the dashboard as they happen.",
        },
        {
          id: "optimize",
          label: "contextlab optimize",
          icon: "check",
          path: ["agent", "proxy", "parse", "attr", "rules"],
          explanation: "After the session, the rule engine ranks the waste and prints the exact fix next to each item, with its arithmetic.",
        },
      ],
    },
  },
  {
    id: "mailmoat",
    name: "mailmoat",
    tagline: "Hijack-proof Gmail assistant",
    category: "Open-source · runs on your own machine",
    summary: "An AI assistant for Gmail that a bad email cannot talk into anything.",
    description:
      "It labels mail, drafts replies, schedules meetings and answers questions about your inbox. A Reader LLM with no tools turns untrusted email into schema-validated fields, a Planner LLM never sees raw email text, and a policy engine allows, asks or denies every action by tracking where each value came from.",
    stack: ["Node.js", "Express 5", "React 19", "SQLite", "Zod", "Claude API", "Gmail API"],
    outcome: "124-email attack lab replayed in CI: 0 unapproved actions, 100% detection, 0% false positives.",
    links: [{ label: "Source", href: gh("mailmoat") }],
    primary: { label: "View project", href: gh("mailmoat") },
    primaryLabel: "View project",
    image: { src: "/projects/mailmoat-inbox.webp", alt: "The mailmoat inbox with one label per conversation", tint: "#26272a", tintLight: "#d0d3da" },
    preview: { kind: "image", src: "/projects/mailmoat-inbox.webp", alt: "" },
    diagram: {
      title: "What happens to an email",
      rows: [
        [{ id: "email", title: "Incoming email", sub: "Untrusted text", icon: "input" }],
        [{ id: "reader", title: "Reader LLM", sub: "No tools, schema output", icon: "agent" }],
        [
          { id: "planner", title: "Planner LLM", sub: "Never sees raw text", icon: "agent" },
          { id: "risk", title: "Risk engine", sub: "22 phishing & BEC signals", icon: "shield" },
        ],
        [{ id: "policy", title: "Policy engine", sub: "Tracks where each value came from", icon: "shield" }],
        [
          { id: "ask", title: "You approve", sub: "Nothing leaves without a click", icon: "user" },
          { id: "deny", title: "Blocked + explained", sub: "Plain-words reason", icon: "x" },
        ],
      ],
      modes: [
        {
          id: "normal",
          label: "Normal email",
          icon: "input",
          path: ["email", "reader", "planner", "policy", "ask"],
          explanation: "The Planner only works with validated fields. Any action it proposes waits for your approval.",
        },
        {
          id: "attack",
          label: "Injection attempt",
          icon: "shield",
          path: ["email", "reader", "risk", "policy", "deny"],
          explanation: "Instructions hidden in an email are just data. The policy engine sees their origin and denies the action.",
        },
      ],
    },
  },
  {
    id: "fancut",
    name: "FanCut",
    tagline: "AI-directed matchday channel",
    category: "Microsoft x Premier League hackathon",
    summary: "Watches ten matches at once, cuts to the one that matters to you, and tells you why.",
    description:
      "Built for the “Inside the Game” hackathon. A deterministic director scores every live match for drama and for what each fan cares about, then Microsoft Foundry agents write the commentary in English, Hindi or Hinglish and a fact checker rejects any line the data does not support. All data is synthetic.",
    stack: ["Python", "FastAPI", "Microsoft Foundry", "Agent Framework", "Next.js", "Azure"],
    outcome: "588-line red team: every bad line caught, 0 false rejects. 214 tests.",
    links: [
      { label: "Source", href: gh("FanCut") },
      { label: "Demo video", href: "https://youtu.be/QhVRt6taUzo" },
    ],
    primary: { label: "View project", href: gh("FanCut") },
    primaryLabel: "View project",
    image: { src: "/projects/fancut-channel.webp", alt: "A personalised FanCut channel replaying a goal with the reason and live table", tint: "#232624", tintLight: "#c7cdc7" },
    preview: { kind: "image", src: "/projects/fancut-studio.webp", alt: "" },
    diagram: {
      title: "From ten matches to one channel",
      rows: [
        [{ id: "streams", title: "10 match streams", sub: "Seeded matchday events", icon: "input" }],
        [{ id: "drama", title: "Drama engine", sub: "Suspense · excitement · table", icon: "chart" }],
        [{ id: "director", title: "Director", sub: "Deterministic, per fan profile", icon: "split" }],
        [
          { id: "narrator", title: "Narrator agent", sub: "EN · हिंदी · Hinglish", icon: "agent" },
          { id: "checker", title: "Fact checker", sub: "Rejects unsupported lines", icon: "shield" },
        ],
        [{ id: "overlay", title: "Your channel", sub: "overlay.v1 over SSE", icon: "bolt" }],
      ],
      modes: [
        {
          id: "cut",
          label: "Choose the match",
          icon: "split",
          path: ["streams", "drama", "director", "overlay"],
          explanation: "No model decides the cut. The director ranks matches by drama and relevance to you, with the evidence attached.",
        },
        {
          id: "say",
          label: "Write the line",
          icon: "agent",
          path: ["director", "narrator", "checker", "overlay"],
          explanation: "A reference line is written in code, the narrator makes it vivid, and the fact checker blocks anything the facts do not back.",
        },
      ],
    },
  },
  {
    id: "promptgauge",
    name: "promptgauge",
    tagline: "System-prompt ablation testing",
    category: "Open-source local tool",
    badge: "In progress",
    summary: "Find out which lines of your system prompt actually do anything, with measured proof.",
    description:
      "It deletes the prompt one segment at a time, re-scores every variant on your own test cases, and returns a shorter prompt that scores the same. It only deletes, never rewrites, and confirms the cut prompt against the original before reporting it. A budget planner estimates cost before the first API call and stops the run at your limit.",
    stack: ["Python", "FastAPI", "Pydantic", "SQLite", "Claude API", "pytest"],
    outcome: "465 tests that never touch the network. Based on the ProCut paper (EMNLP 2025).",
    links: [{ label: "Source", href: gh("promptgauge") }],
    primary: { label: "View project", href: gh("promptgauge") },
    primaryLabel: "View project",
    image: { src: "", alt: "", tint: "#262624", tintLight: "#d6d5cf" },
    preview: { kind: "card", eyebrow: "promptgauge ablate", title: "Which lines actually matter?" },
    diagram: {
      title: "How a prompt gets measured",
      rows: [
        [{ id: "prompt", title: "System prompt", sub: "+ your test cases", icon: "doc" }],
        [{ id: "budget", title: "Budget planner", sub: "Estimates cost, enforces limit", icon: "shield" }],
        [{ id: "ablate", title: "Ablation", sub: "Delete one segment at a time", icon: "split" }],
        [
          { id: "keep", title: "Score drops", sub: "The line matters: keep", icon: "check" },
          { id: "cut", title: "No measurable effect", sub: "Candidate to cut", icon: "x" },
        ],
        [{ id: "confirm", title: "Confirmation run", sub: "Cut prompt vs original", icon: "chart" }],
      ],
      modes: [
        {
          id: "keep",
          label: "Line that matters",
          icon: "check",
          path: ["prompt", "budget", "ablate", "keep"],
          explanation: "Removing it changes the scores on your cases, so it stays in the prompt.",
        },
        {
          id: "cut",
          label: "Line that does nothing",
          icon: "x",
          path: ["prompt", "budget", "ablate", "cut", "confirm"],
          explanation: "Labelled “no measurable effect at this sample size”, then cut only if the shorter prompt still scores the same.",
        },
      ],
    },
  },
  {
    id: "gitpulse",
    name: "GitPulse",
    tagline: "GitHub analytics dashboard",
    category: "Full-stack web app",
    summary: "Visualise any developer's GitHub activity and compare two profiles side by side.",
    description:
      "A React dashboard over an Express API that aggregates GitHub data into activity stats and insights, caches profiles in PostgreSQL, compares two developers side by side, and creates JWT-signed links to share a comparison.",
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Sequelize", "JWT"],
    links: [
      { label: "Live app", href: "https://git-pulse-rosy.vercel.app" },
      { label: "Source", href: gh("GitPulse") },
    ],
    primary: { label: "View project", href: "https://git-pulse-rosy.vercel.app" },
    primaryLabel: "View project",
    image: { src: "/projects/gitpulse-home.webp", alt: "GitPulse home screen", tint: "#24262a", tintLight: "#d2d3d8" },
    preview: { kind: "image", src: "/projects/gitpulse-home.webp", alt: "" },
    diagram: {
      title: "How a profile is built",
      rows: [
        [{ id: "client", title: "React client", sub: "Dashboard · Compare", icon: "user" }],
        [{ id: "api", title: "Express API", sub: "Rate-limited, Helmet", icon: "code" }],
        [
          { id: "cache", title: "PostgreSQL cache", sub: "Sequelize models", icon: "db" },
          { id: "github", title: "GitHub API", sub: "Profiles · repos · events", icon: "input" },
        ],
        [{ id: "insights", title: "Aggregator + insights", sub: "Activity stats", icon: "chart" }],
        [
          { id: "dash", title: "Dashboard", sub: "Charts and stats", icon: "chart" },
          { id: "share", title: "Share link", sub: "JWT-signed URL", icon: "shield" },
        ],
      ],
      modes: [
        {
          id: "profile",
          label: "Analyze a profile",
          icon: "user",
          path: ["client", "api", "github", "cache", "insights", "dash"],
          explanation: "Fresh data comes from the GitHub API and is cached, so repeat lookups are fast and stay under rate limits.",
        },
        {
          id: "compare",
          label: "Compare & share",
          icon: "split",
          path: ["client", "api", "cache", "insights", "share"],
          explanation: "Two cached profiles are compared side by side, and the result gets a signed link anyone can open.",
        },
      ],
    },
  },
  {
    id: "ecoguard",
    name: "Eco-Guard AI",
    tagline: "Peer-reviewed publication",
    category: "IJARSCT · Vol. 6, Issue 13 · May 2026",
    badge: "Publication",
    summary: "An intelligent multi-agent framework for campus sustainability management.",
    description:
      "Co-authored paper on a multi-agent system that answers natural-language questions about campus energy, water and waste. An orchestrator coordinates parameter-extraction, clarification, RAG and analysis agents to produce evidence-based recommendations. I led the RAG agent, which grounds answers in sustainability policies and institutional knowledge.",
    stack: ["Python", "LangChain", "OpenAI API", "Chroma / FAISS", "Pandas", "Streamlit / FastAPI"],
    outcome: "DOI 10.48175/IJARSCT-36047",
    links: [
      { label: "Read paper", href: "https://doi.org/10.48175/IJARSCT-36047" },
      { label: "PDF", href: "https://drive.google.com/file/d/15ljk1U_bEL8gP2B-2OVkc07yNXirlpQn/view?usp=drive_link" },
    ],
    primary: { label: "Read paper", href: "https://doi.org/10.48175/IJARSCT-36047" },
    primaryLabel: "Read paper",
    image: { src: "/projects/ecoguard-paper.webp", alt: "First page of the Eco-Guard AI paper", tint: "#2b2b28", tintLight: "#d6d5cf", fit: "contain" },
    preview: { kind: "image", src: "/projects/ecoguard-paper.webp", alt: "" },
    diagram: {
      title: "How a question is answered",
      rows: [
        [{ id: "query", title: "Natural-language query", sub: "“How much water did Block B use?”", icon: "input" }],
        [{ id: "orch", title: "Orchestrator agent", sub: "Routes to the right agents", icon: "split" }],
        [{ id: "params", title: "Parameter extraction", sub: "Building · period · resource", icon: "doc" }],
        [
          { id: "clarify", title: "Clarification agent", sub: "Asks for what is missing", icon: "user" },
          { id: "rag", title: "RAG agent", sub: "Policies in a vector DB", icon: "db" },
        ],
        [{ id: "analysis", title: "Analysis agent", sub: "Consumption patterns", icon: "chart" }],
        [{ id: "rec", title: "Recommendation", sub: "Evidence-based actions", icon: "check" }],
      ],
      modes: [
        {
          id: "complete",
          label: "Complete question",
          icon: "check",
          path: ["query", "orch", "params", "rag", "analysis", "rec"],
          explanation: "All parameters are present, so the RAG agent retrieves the relevant policies and the analysis agent builds the answer.",
        },
        {
          id: "missing",
          label: "Missing details",
          icon: "user",
          path: ["query", "orch", "params", "clarify", "rag", "analysis", "rec"],
          explanation: "When a building or time period is missing, the clarification agent asks for it before anything is retrieved.",
        },
      ],
    },
  },
];

export const projectsIntro = "Open-source tools, full-stack apps and published research. Open a folder to explore a project.";

// ---------- Experience ----------

export const experience = {
  note: ["Recent work.", "Back to the foundations."],
  stops: [
    {
      id: "internship",
      badge: "Completed",
      date: "June 2025 – December 2025",
      title: "Frontend Developer Intern",
      place: "9TeenInitiative",
      placeSub: "Remote",
      description:
        "Built responsive, production-facing pages in React, turning design requirements into reusable UI components, and shipped features through code reviews.",
    },
    {
      id: "btech",
      badge: "Graduated",
      date: "2022 – 2026",
      title: "B.Tech in Computer Science (Cyber Security)",
      place: "G. H. Raisoni College of Engineering",
      placeSub: "Nagpur · CGPA 7.44",
      description: "",
    },
  ],
};

// ---------- Contact ----------

export const contact = {
  line: "Whether it’s an internship or a full-time role, my inbox is open.",
};

export const navPrimary = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
export const navSecondary = [
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Resume", href: site.resume, external: true },
];
export const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
  { label: "Resume", href: site.resume, external: true },
];

// The faint code behind the hero headline.
export const heroCode = `const kaushal = {
  name: "Kaushal Shahare",
  role: "AI Engineer & Full-Stack Developer",
  focus: ["cost", "safety", "trust"],
  status: { open: ["Internships", "Full-Time"], city: "Bangalore" },
  experience: [
    { role: "Frontend Developer Intern",
      company: "9TeenInitiative", from: "June 2025", to: "December 2025" }
  ],
  education: [
    { degree: "B.Tech, Computer Science (Cyber Security)",
      college: "G. H. Raisoni College of Engineering", city: "Nagpur",
      years: "2022–2026", cgpa: 7.44 }
  ],
  projects: {
    contextlab: "Coding-agent cost profiler, npm",
    mailmoat: "Gmail assistant a bad email cannot hijack",
    FanCut: "AI-directed matchday channel",
    promptgauge: "Which prompt lines actually matter",
    GitPulse: "GitHub analytics dashboard",
  },
  publications: ["Eco-Guard AI, IJARSCT 2026"],
  skills: {
    ai: ["LLM APIs", "RAG", "LangGraph", "Multi-Agent Systems"],
    web: ["React", "Node.js", "Express", "FastAPI", "Next.js"],
    data: ["PostgreSQL", "SQLite", "ChromaDB"],
  },
  email: "kaushalss234@gmail.com",
};

export default function Portfolio() {
  return <main>
    <header><h1>{kaushal.name}</h1><p>{kaushal.role}</p></header>
    <section><h2>Projects</h2>
      {Object.entries(kaushal.projects).map(([name, detail]) =>
        <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}
    </section>
    <section><h2>Experience</h2>
      {kaushal.experience.map(job => <article key={job.role}>
        <h3>{job.role}</h3><p>{job.company}</p>
        <small>{job.from} – {job.to}</small>
      </article>)}
    </section>
    <section><h2>Tech Stack</h2>
      {Object.entries(kaushal.skills).map(([group, tools]) =>
        <div key={group}><h3>{group}</h3><p>{tools.join(", ")}</p></div>)}
    </section>
    <footer><a href={"mailto:" + kaushal.email}>Let's talk.</a></footer>
  </main>;
}`;
