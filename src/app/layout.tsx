import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site, socials } from "@/data/content";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  keywords: ["Kaushal Shahare", "AI Engineer", "Full-Stack Developer", "LLM", "RAG", "React", "Node.js", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: { title, description: site.description, type: "profile", url: "/", siteName: site.name, locale: "en_IN" },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}/images/kaushal.jpg`,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "G. H. Raisoni College of Engineering, Nagpur" },
  sameAs: socials.map((s) => s.href),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#171716" },
    { media: "(prefers-color-scheme: light)", color: "#f7f4f0" },
  ],
};

// Runs before paint: applies the saved theme (dark by default) and flags JS for reveal styles.
const boot = `(function(){try{var t=localStorage.getItem("portfolio-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark";}catch(e){document.documentElement.dataset.theme="dark";}document.documentElement.classList.add("js");})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={spaceGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
