import Link from "next/link";

import { Container } from "@/components/Container";
import { navLinks } from "@/components/navigation";
import { siteConfig } from "@/lib/site";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
];

export const Footer = () => (
  <footer className="border-t border-white/10 bg-[#050505] text-white">
    <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="font-display text-xl font-semibold text-white">Brasero Atelier</p>
        <p className="mt-3 max-w-sm text-sm text-white/60">{siteConfig.description}</p>
        <div className="mt-4 text-sm text-white/60">
          {siteConfig.address}
          <br />
          {siteConfig.email}
          <br />
          {siteConfig.phone}
        </div>
      </div>

      <div className="flex flex-1 justify-between gap-8 text-sm text-white/60 md:justify-end">
        <div>
          <p className="font-semibold text-white">Navigation</p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Légal</p>
          <ul className="mt-3 space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
    <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
      © {new Date().getFullYear()} Brasero Atelier — Fabriqué à Moncoutant (79)
    </div>
  </footer>
);
