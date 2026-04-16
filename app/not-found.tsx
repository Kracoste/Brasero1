import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable | Atelier LBF",
  description: "La page que vous cherchez n'existe pas ou a été déplacée. Découvrez nos braseros artisanaux manufacturés en France.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-lg text-center">
        <p className="text-6xl font-display font-bold text-[#CD853F] mb-4">404</p>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-slate-600 mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          Retrouvez nos braseros artisanaux ci-dessous.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-6 py-3 transition-all"
          >
            Voir nos braseros
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
          <Link href="/blog" className="hover:text-[#8B4513] transition-colors">Blog</Link>
          <span>·</span>
          <Link href="/info/contact" className="hover:text-[#8B4513] transition-colors">Contact</Link>
          <span>·</span>
          <Link href="/info/faq" className="hover:text-[#8B4513] transition-colors">FAQ</Link>
        </div>
      </div>
    </main>
  );
}
