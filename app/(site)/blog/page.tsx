import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { getAllBlogPosts } from "@/lib/data/blog";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";

export const revalidate = 600;

const CATEGORY_LABELS: Record<string, string> = {
  tous: "Tous",
  cuisson: "Cuisson",
  guide: "Guide",
  entretien: "Entretien",
  inspiration: "Inspiration",
};

export const metadata: Metadata = {
  title: "Blog brasero plancha | Guides, conseils et astuces | Atelier LBF",
  description:
    "Guides d'achat, conseils d'entretien, techniques de cuisson et comparatifs pour choisir et utiliser votre brasero plancha. Manufacture française.",
  keywords: [
    "blog brasero",
    "guide brasero plancha",
    "conseil entretien brasero",
    "cuisson brasero plancha",
    "comparatif brasero",
    "brasero corten",
    "plancha acier carbone",
  ],
  openGraph: {
    title: "Blog | Atelier LBF — Braseros artisanaux",
    description:
      "Guides, conseils et astuces pour votre brasero plancha artisanal.",
    type: "website",
    locale: "fr_FR",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  const categories = ["tous", "cuisson", "guide", "entretien", "inspiration"];

  // Compute category counts
  const categoryCounts: Record<string, number> = { tous: posts.length };
  for (const post of posts) {
    categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
  }

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-white">
      <JsonLd data={breadcrumb} />

      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#8B4513]" />
              </div>
              <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                Blog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
              Guides et conseils brasero plancha
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Comparatifs, techniques de cuisson, entretien et inspiration pour
              tirer le meilleur de votre brasero artisanal.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 py-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === "tous" ? "/blog" : `/blog?cat=${cat}`}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  cat === "tous"
                    ? "bg-[#8B4513] text-white"
                    : "bg-[#f6f1e9] text-slate-700 hover:bg-[#8B4513] hover:text-white"
                }`}
              >
                {CATEGORY_LABELS[cat] || cat} ({categoryCounts[cat] || 0})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured article */}
      {featured && (
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/blog/${featured.slug}`}
              className="block bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="grid lg:grid-cols-2">
                {featured.featured_image ? (
                  <div className="relative min-h-[250px]">
                    <Image
                      src={featured.featured_image.src}
                      alt={featured.featured_image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#8B4513] to-[#CD853F] p-8 sm:p-12 flex items-center justify-center min-h-[250px]">
                    <BookOpen className="w-32 h-32 text-white/30" />
                  </div>
                )}
                <div className="p-8 sm:p-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-[#f6f1e9] text-[#8B4513] text-xs font-medium px-3 py-1">
                      {CATEGORY_LABELS[featured.category] || featured.category}
                    </span>
                    <span className="text-sm text-slate-500">
                      {featured.published_at
                        ? new Date(featured.published_at).toLocaleDateString(
                            "fr-FR",
                            { day: "numeric", month: "long", year: "numeric" }
                          )
                        : ""}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{featured.read_time} min de lecture</span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[#8B4513] font-medium">
                      Lire l&apos;article
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles list */}
      {rest.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8">
              Tous les articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-white border border-slate-200 hover:shadow-md transition-shadow group"
                >
                  {post.featured_image ? (
                    <div className="relative h-48">
                      <Image
                        src={post.featured_image.src}
                        alt={post.featured_image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    </div>
                  ) : (
                    <div className="bg-[#f6f1e9] p-8 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-[#8B4513]/30" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-[#f6f1e9] text-[#8B4513] text-xs font-medium px-2 py-1">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-[#8B4513] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.read_time} min</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[#8B4513] text-sm font-medium">
                        Lire
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
              Les articles arrivent bientôt
            </h2>
            <p className="text-slate-600 mb-8">
              Nous préparons des guides et conseils pour vous aider à profiter
              pleinement de votre brasero.
            </p>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
            >
              Découvrir nos braseros
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Envie de passer à l&apos;action ?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez nos braseros plancha artisanaux, manufacturés en France dans
            les Deux-Sèvres.
          </p>
          <div className="mt-8">
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
            >
              Voir nos braseros
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
