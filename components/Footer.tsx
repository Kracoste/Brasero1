'use client';

import Link from "next/link";

import { Container } from "@/components/Container";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const serviceLinks = [
  { href: "/info/service-clientele", label: "Service à la clientèle" },
  { href: "/info/commander", label: "Commander" },
  { href: "/info/paiement", label: "Paiement" },
  { href: "/info/expedition", label: "Expédition" },
  { href: "/info/retourner", label: "Retourner" },
  { href: "/info/confidentialite-politique", label: "Confidentialité & Politique" },
  { href: "/info/contact", label: "Contact" },
  { href: "/info/faq", label: "Questions fréquemment posées" },
];

const proLinks = [
  { href: "/info/commande-affaires", label: "Commande d'affaires" },
  { href: "/info/produits-sur-mesure", label: "Produits sur mesure" },
];

const aboutLinks = [
  { href: "/info/a-propos-de-nous", label: "À propos de nous" },
  { href: "/info/donnees-entreprise-contact", label: "Données sur l'entreprise et contact" },
  { href: "/info/bulletin-information", label: "Bulletin d'information" },
  { href: "/info/astuces-conseils", label: "Astuces et conseils" },
  { href: "/info/blog", label: "Blog" },
];

const categoryLinks = [
  { href: "/produits?category=brasero", label: "Braseros extérieurs" },
  { href: "/accessoires", label: "Accessoires" },
];

export const Footer = () => {
  const settings = useSiteSettings();

  return (
    <footer className="border-t border-gray-200 bg-white text-gray-800">
      <Container className="py-8 sm:py-12">
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-semibold text-lg text-gray-900">Service à la clientèle</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-lg text-gray-900">Catégories</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-lg text-gray-900">Entreprises</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {proLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-lg text-gray-900">À propos de {settings.storeName}</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {settings.storeName} — Fabriqué à {settings.atelier.city} (79)
      </div>
    </footer>
  );
};
