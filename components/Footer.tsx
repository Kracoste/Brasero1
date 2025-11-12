import Link from "next/link";

import { Container } from "@/components/Container";
import { navLinks } from "@/components/navigation";
import { siteConfig } from "@/lib/site";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
];

export const Footer = () => (
  <footer className="border-t border-slate-100 bg-white">
    <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="font-display text-xl font-semibold text-clay-900">Brasero Atelier</p>
        <p className="mt-3 max-w-sm text-sm text-slate-500">{siteConfig.description}</p>
        <div className="mt-4 text-sm text-slate-500">
          {siteConfig.address}
          <br />
          {siteConfig.email}
          <br />
          {siteConfig.phone}
        </div>
      </div>

      <div className="flex flex-1 justify-between gap-8 text-sm text-slate-500 md:justify-end">
        <div>
          <p className="font-semibold text-slate-900">Navigation</p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-clay-800">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Légal</p>
          <ul className="mt-3 space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-clay-800">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
    <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} Brasero Atelier — Fabriqué à Moncoutant (79)
    </div>
  </footer>
);
