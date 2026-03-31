import Link from "next/link";
import Image from "next/image";
import { Shield, Truck, RotateCcw, Lock } from "lucide-react";

import { Container } from "@/components/Container";
import NewsletterSignup from "@/components/NewsletterSignup";

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
  { href: "/made-in-france", label: "Notre atelier Made in France" },
  { href: "/info/donnees-entreprise-contact", label: "Données sur l'entreprise et contact" },
  { href: "/info/bulletin-information", label: "Bulletin d'information" },
  { href: "/info/astuces-conseils", label: "Astuces et conseils" },
  { href: "/blog", label: "Blog" },
];

const categoryLinks = [
  { href: "/produits?category=brasero", label: "Braseros extérieurs" },
  { href: "/produits?category=fendeur", label: "Fendeurs à bûches" },
  { href: "/accessoires", label: "Accessoires" },
  { href: "/produits?category=promotions", label: "Promotions" },
];

type FooterProps = {
  storeName: string;
  atelierCity: string;
};

export const Footer = ({ storeName, atelierCity }: FooterProps) => {

  return (
    <footer className="border-t border-gray-200 bg-[#f6f1e9] text-gray-800">
      <Container className="py-6 sm:py-8 lg:py-12">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900">Service à la clientèle</p>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gray-900 inline-block py-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900">Catégories</p>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gray-900 inline-block py-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900">Entreprises</p>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
              {proLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gray-900 inline-block py-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900">À propos de {storeName}</p>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gray-900 inline-block py-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Newsletter + Réseaux sociaux */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <NewsletterSignup />
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/33685643340?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20braseros."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nous contacter sur WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1EB954]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/atelier.lbf/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-nous sur Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#dc2743] text-white transition hover:opacity-80"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61577439212328"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-nous sur Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:bg-[#166FE5]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
      {/* Trust badges */}
      <div className="border-t border-gray-200">
        <Container className="py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <Lock className="w-6 h-6 text-[#8B4513]" />
              <div>
                <p className="text-xs font-semibold text-gray-900">Paiement sécurisé</p>
                <p className="text-xs text-gray-600">SSL 256 bits</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-6 h-6 text-[#8B4513]" />
              <div>
                <p className="text-xs font-semibold text-gray-900">Livraison incluse</p>
                <p className="text-xs text-gray-600">France métropolitaine</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Shield className="w-6 h-6 text-[#8B4513]" />
              <div>
                <p className="text-xs font-semibold text-gray-900">Garantie 2 ans</p>
                <p className="text-xs text-gray-600">SAV réactif sous 48h</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="w-6 h-6 text-[#8B4513]" />
              <div>
                <p className="text-xs font-semibold text-gray-900">Retour 14 jours</p>
                <p className="text-xs text-gray-600">Satisfait ou remboursé</p>
              </div>
            </div>
          </div>
          {/* Moyens de paiement */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-600 uppercase tracking-wide mr-2">Moyens de paiement</span>
            <Image src="/logos/klarna.svg" alt="Klarna" width={48} height={18} className="h-4 w-auto opacity-60" />
            <svg viewBox="0 0 38 24" className="h-5 w-auto opacity-60" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="37" height="23" rx="3" fill="white" stroke="#D9D9D9"/><path d="M15.764 16.23H13.61L14.94 7.77H17.094L15.764 16.23Z" fill="#00579F"/><path d="M24.054 7.95C23.614 7.77 22.924 7.57 22.074 7.57C19.954 7.57 18.454 8.68 18.444 10.27C18.424 11.44 19.504 12.09 20.324 12.47C21.164 12.86 21.444 13.11 21.444 13.45C21.434 13.97 20.804 14.21 20.214 14.21C19.394 14.21 18.954 14.09 18.274 13.8L17.994 13.67L17.694 15.56C18.194 15.78 19.094 15.97 20.024 15.98C22.284 15.98 23.754 14.89 23.774 13.19C23.784 12.26 23.194 11.55 21.954 10.97C21.194 10.6 20.734 10.35 20.734 9.99C20.744 9.66 21.104 9.33 21.904 9.33C22.564 9.31 23.054 9.48 23.424 9.65L23.614 9.74L23.914 7.92L24.054 7.95Z" fill="#00579F"/><path d="M27.014 7.77H25.394C24.894 7.77 24.514 7.92 24.294 8.43L21.124 16.23H23.384L23.834 14.96H26.584L26.844 16.23H28.844L27.014 7.77ZM24.444 13.3C24.624 12.82 25.334 10.94 25.334 10.94L25.284 11.07L25.514 10.42L25.654 11.01C25.654 11.01 26.074 12.87 26.164 13.3H24.444Z" fill="#00579F"/><path d="M12.554 7.77L10.454 13.35L10.234 12.3C9.834 10.98 8.594 9.54 7.214 8.82L9.124 16.22H11.404L14.834 7.77H12.554Z" fill="#00579F"/><path d="M8.774 7.77H5.324L5.294 7.93C8.044 8.61 9.854 10.28 10.234 12.3L9.834 8.44C9.764 7.93 9.394 7.79 8.924 7.77H8.774Z" fill="#FAA61A"/></svg>
            <svg viewBox="0 0 38 24" className="h-5 w-auto opacity-60" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="37" height="23" rx="3" fill="white" stroke="#D9D9D9"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path d="M19 7.5C20.497 8.612 21.5 10.197 21.5 12C21.5 13.803 20.497 15.388 19 16.5C17.503 15.388 16.5 13.803 16.5 12C16.5 10.197 17.503 8.612 19 7.5Z" fill="#FF5F00"/></svg>
            <svg viewBox="0 0 38 24" className="h-5 w-auto opacity-60" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="37" height="23" rx="3" fill="white" stroke="#D9D9D9"/><path d="M6 12.07C6 9.24 8.24 7 11.07 7H14V17H11.07C8.24 17 6 14.9 6 12.07Z" fill="#1A1F71"/><path d="M24 7H26.93C29.76 7 32 9.24 32 12.07C32 14.9 29.76 17 26.93 17H24V7Z" fill="#1A1F71"/><path d="M14 7H24V17H14V7Z" fill="#1A1F71"/><text x="19" y="14" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">CB</text></svg>
          </div>
        </Container>
      </div>
      <div className="border-t border-gray-200 py-3 sm:py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} {storeName} — Fabriqué à {atelierCity} (79)
      </div>
    </footer>
  );
};
