"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Instagram, Mail, Wrench, ShieldCheck, Truck, Award } from "lucide-react";

type RelatedPost = {
  slug: string;
  title: string;
  category: string;
  read_time?: number;
};

type RecommendedProduct = {
  slug: string;
  name: string;
  price: number;
  image?: { src: string; alt?: string } | null;
};

type Props = {
  relatedPosts: RelatedPost[];
  recommendedProduct?: RecommendedProduct | null;
  ctaText?: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  cuisson: "Cuisson",
  guide: "Guide",
  entretien: "Entretien",
  inspiration: "Inspiration",
  reglementation: "Réglementation",
  comparatif: "Comparatif",
  achat: "Achat",
  gastronomie: "Gastronomie",
};

/**
 * Construit le sommaire dynamiquement à partir des H2 trouvés dans la page article.
 */
function useTableOfContents() {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headings = Array.from(article.querySelectorAll("h2"));
    const toc = headings.map((h, idx) => {
      let id = h.id;
      if (!id) {
        id = `h2-${idx}-${(h.textContent || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 50)}`;
        h.id = id;
      }
      return { id, text: h.textContent || "" };
    });
    setItems(toc);

    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, []);

  return { items, activeId };
}

/**
 * Hook qui synchronise le contenu interne de la sidebar avec le scroll de l'article.
 *
 * Le progrès est calculé sur la **zone de l'article uniquement** (le <article> dans la page),
 * pas sur toute la page. Ainsi :
 * - Tant que l'utilisateur n'a pas atteint l'article : translateY(0) → on voit le haut de la sidebar
 * - Quand l'utilisateur arrive à la fin de l'article : translateY(-overflow) → on voit le bas de la sidebar
 * - Le scroll de la sidebar est piloté par la progression dans l'article
 */
function useSyncedScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const article = document.querySelector("article");
    if (!article) return;

    const handleScroll = () => {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner) return;

      const containerHeight = container.clientHeight;
      const innerHeight = inner.scrollHeight;
      const overflow = Math.max(0, innerHeight - containerHeight);

      if (overflow === 0) {
        setTranslateY(0);
        return;
      }

      // Calcul du progrès basé sur la position de l'article dans le viewport
      const articleRect = article.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const articleBottom = articleTop + articleHeight;

      // La sidebar reste FIGÉE pendant les 80 % premiers de l'article.
      // Elle ne commence à défiler que dans les 20 % finaux (quand l'utilisateur
      // approche de la fin de l'article).
      const FREEZE_RATIO = 0.8;
      const scrollStart = articleTop + (articleBottom - articleTop) * FREEZE_RATIO - window.innerHeight;
      const scrollEnd = articleBottom - window.innerHeight;

      const range = Math.max(1, scrollEnd - scrollStart);
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - scrollStart) / range)
      );

      setTranslateY(-progress * overflow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // Init
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return { containerRef, innerRef, translateY };
}

export function BlogSidebar({ relatedPosts, recommendedProduct, ctaText }: Props) {
  const { items, activeId } = useTableOfContents();
  const { containerRef, innerRef, translateY } = useSyncedScroll();

  return (
    <aside className="hidden lg:block self-start sticky top-24">
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{ height: "calc(100vh - 7rem)" }}
      >
        <div
          ref={innerRef}
          className="space-y-10 will-change-transform py-2"
          style={{ transform: `translateY(${translateY}px)` }}
        >
        {/* 1. Sommaire */}
        {items.length > 1 && (
          <nav className="border-l border-slate-200 pl-5">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
              Dans cet article
            </p>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-[0.85rem] leading-snug transition-colors ${
                      activeId === item.id
                        ? "text-[#8b2d2d] font-medium"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* 2. Mini-fiche produit recommandé */}
        {recommendedProduct && (
          <div className="bg-[#f4f1ec] p-4">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
              Produit recommandé
            </p>
            {recommendedProduct.image?.src && (
              <div className="relative w-full aspect-[4/3] mb-4 bg-[#ebe6df]">
                <Image
                  src={recommendedProduct.image.src}
                  alt={recommendedProduct.image.alt || recommendedProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 280px"
                />
              </div>
            )}
            <h3 className="font-display text-base font-semibold text-slate-900 mb-2 leading-tight">
              {recommendedProduct.name}
            </h3>
            {recommendedProduct.price && (
              <p className="text-sm text-slate-600 mb-4">
                à partir de{" "}
                <span className="text-slate-900 font-semibold">
                  {recommendedProduct.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €
                </span>
              </p>
            )}
            <Link
              href={`/produits/${recommendedProduct.slug}`}
              className="inline-flex items-center gap-2 bg-[#0f172a] text-white hover:bg-[#1e293b] font-medium tracking-[0.12em] uppercase px-4 py-3 text-[0.7rem] transition-colors w-full justify-center whitespace-nowrap overflow-hidden"
            >
              <span className="truncate">{ctaText || "Découvrir"}</span>
              <ArrowRight size={12} className="flex-shrink-0" />
            </Link>
          </div>
        )}

        {/* 3. Articles liés */}
        {relatedPosts.length > 0 && (
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
              À lire aussi
            </p>
            <ul className="space-y-4">
              {relatedPosts.map((rp) => (
                <li key={rp.slug}>
                  <Link href={`/blog/${rp.slug}`} className="block group">
                    <p className="text-[0.7rem] uppercase tracking-wider text-slate-500 mb-1">
                      {CATEGORY_LABELS[rp.category] || rp.category}
                    </p>
                    <h4 className="text-[0.95rem] font-display font-medium text-slate-900 leading-snug group-hover:text-[#8b2d2d] transition-colors">
                      {rp.title}
                    </h4>
                    {rp.read_time && (
                      <p className="text-xs text-slate-400 mt-1.5">{rp.read_time} min</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. Pourquoi nous choisir */}
        <div className="bg-[#faf8f5] p-5">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Pourquoi Atelier LBF
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <Wrench size={16} className="text-[#8b2d2d] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">Fabrication artisanale</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">Soudures à la main dans les Deux-Sèvres</p>
              </div>
            </li>
            <li className="flex gap-3">
              <ShieldCheck size={16} className="text-[#8b2d2d] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">Garantie 2 ans</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">Pièces détachées disponibles à vie</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Truck size={16} className="text-[#8b2d2d] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">Livraison France</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">Emballage soigné, suivi dédié</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Award size={16} className="text-[#8b2d2d] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">Acier 3 mm minimum</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">Conçu pour durer 20 ans et plus</p>
              </div>
            </li>
          </ul>
        </div>

        {/* 6. Le guide ultime (pillar) */}
        <div className="bg-slate-50 p-4 border-l-2 border-[#8b2d2d]">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Guide complet
          </p>
          <h4 className="text-base font-display font-semibold text-slate-900 leading-snug mb-2">
            Le guide ultime du brasero plancha 2026
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Choisir, utiliser, entretenir : tout ce qu&apos;il faut savoir, par un artisan français.
          </p>
          <Link
            href="/blog/guide-ultime-brasero-plancha"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8b2d2d] hover:text-[#6e2323]"
          >
            Lire le guide
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* 6ter. Question fréquente */}
        <div className="border-l-2 border-slate-200 pl-5">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Question fréquente
          </p>
          <h4 className="text-base font-display font-semibold text-slate-900 leading-snug mb-2">
            Combien de temps dure un brasero artisanal ?
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            20 à 30 ans en usage domestique normal. Aucun composant fragile, réparable indéfiniment grâce à nos pièces détachées disponibles à vie.
          </p>
          <Link
            href="/blog/guide-ultime-brasero-plancha"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8b2d2d] hover:text-[#6e2323]"
          >
            Voir toutes les FAQ
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* 7. Catégories du blog */}
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Explorer par thème
          </p>
          <ul className="space-y-1">
            {[
              { label: "Guides d'achat", href: "/blog?category=guide" },
              { label: "Cuisson au feu de bois", href: "/blog?category=cuisson" },
              { label: "Entretien & durabilité", href: "/blog?category=entretien" },
              { label: "Inspiration extérieure", href: "/blog?category=inspiration" },
              { label: "Réglementation", href: "/blog?category=reglementation" },
              { label: "Comparatifs", href: "/blog?category=comparatif" },
            ].map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  className="block text-sm text-slate-600 hover:text-[#8b2d2d] transition-colors py-1 border-b border-slate-100 last:border-0"
                >
                  {cat.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 8. Newsletter */}
        <div className="border border-slate-200 p-4">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Newsletter
          </p>
          <h4 className="text-base font-display font-semibold text-slate-900 leading-snug mb-2">
            Guides & recettes par email
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Recevez nos conseils d&apos;artisan une fois par mois. Sans spam.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center justify-center w-full gap-1.5 text-xs uppercase tracking-[0.15em] font-semibold text-slate-900 border border-slate-900 hover:bg-slate-900 hover:text-white px-4 py-3 transition-colors"
          >
            S&apos;inscrire
          </Link>
        </div>

        {/* 9. L'atelier */}
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Notre atelier
          </p>
          <h4 className="text-base font-display font-semibold text-slate-900 leading-snug mb-2">
            Fabriqué à la main dans les Deux-Sèvres
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Découvrez notre processus de fabrication artisanale, étape par étape, dans notre atelier de Moncoutant.
          </p>
          <Link
            href="/fabrication"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8b2d2d] hover:text-[#6e2323]"
          >
            Visiter l&apos;atelier
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* 10. Suivez-nous */}
        <div className="border border-slate-200 p-4">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Suivez-nous
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Photos d&apos;atelier, livraisons clients, recettes au feu de bois.
          </p>
          <div className="flex gap-3">
            <Link
              href="https://www.instagram.com/atelier.lbf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 border border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-10 h-10 border border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
              aria-label="Contact"
            >
              <Mail size={16} />
            </Link>
          </div>
        </div>

        {/* 11. Une question ? */}
        <div className="bg-[#f4f1ec] p-5 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Besoin d&apos;un conseil ?
          </p>
          <h4 className="text-base font-display font-semibold text-slate-900 leading-snug mb-3">
            Nous sommes joignables
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Avant ou après votre achat, on aime échanger sur votre projet brasero.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#0f172a] text-white hover:bg-[#1e293b] font-medium tracking-[0.12em] uppercase px-5 py-3 text-[0.7rem] transition-colors w-full"
          >
            Nous contacter
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* 11bis. Livraison France */}
        <div className="border-y border-slate-200 py-6">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Livraison France
          </p>
          <h4 className="text-base font-display font-semibold text-slate-900 leading-snug mb-2">
            Expédition soignée partout en France
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Transporteur spécialisé, palette renforcée, suivi dédié de la commande à la livraison. Délai 2 à 6 semaines selon la saison de fabrication.
          </p>
        </div>

        {/* 11quater. Recommandation finale */}
        <div className="bg-slate-50 p-5">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
            Notre conseil
          </p>
          <h4 className="text-base font-display font-semibold text-slate-900 leading-snug mb-3">
            Hésitez ? Appelez-nous.
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Aucun chatbot, aucun service client externalisé. Vous tombez directement sur l&apos;atelier — la personne qui décroche est celle qui fabriquera votre brasero.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8b2d2d] hover:text-[#6e2323]"
          >
            Voir nos coordonnées
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* 12. Retour au blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors pt-4 border-t border-slate-200"
        >
          ← Retour à tous les articles
        </Link>
        </div>
      </div>
    </aside>
  );
}
