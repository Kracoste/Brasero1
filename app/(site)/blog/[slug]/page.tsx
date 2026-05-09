import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { getBlogPost, getRelatedBlogPosts } from "@/lib/data/blog";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";
import { renderMarkdownContent } from "@/components/MarkdownRenderer";
import { BlogNewsletterInline } from "@/components/BlogNewsletterInline";
import { BlogSidebar } from "@/components/BlogSidebar";
import { pickProductSlugForArticle } from "@/lib/blog/product-matcher";
import { mapSupabaseProduct } from "@/lib/utils";

export const revalidate = 60;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const title = post.meta_title || post.title;
  const description =
    post.meta_description || post.excerpt || post.title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      url: `https://www.atelier-lbf.fr/blog/${slug}`,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: [post.author],
      ...(post.featured_image
        ? {
            images: [
              {
                url: post.featured_image.src,
                width: 1200,
                height: 630,
                alt: post.featured_image.alt,
              },
            ],
          }
        : {}),
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  cuisson: "Cuisson",
  guide: "Guide",
  entretien: "Entretien",
  inspiration: "Inspiration",
};


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(slug, post.category, 3);

  const supabase = await createClient();
  const { count: promoCount } = await supabase
    .from("products")
    .select("slug", { count: "exact", head: true })
    .gt("discount_percent", 0);

  let hasActiveCoupon = false;
  const adminClient = getSupabaseAdminClient();
  if (adminClient && (promoCount ?? 0) === 0) {
    const now = new Date().toISOString();
    const { count: couponCount } = await adminClient
      .from("coupons")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .in("discount_type", ["percentage", "fixed"])
      .or(`expires_at.is.null,expires_at.gt.${now}`);
    hasActiveCoupon = (couponCount ?? 0) > 0;
  }
  const hasPromotions = (promoCount ?? 0) > 0 || hasActiveCoupon;

  // Split le contenu au milieu (sur une frontière H2) pour insérer un bloc newsletter.
  // On exclut les H2 trop proches du début/de la fin et ceux qui sont à l'intérieur
  // d'un bloc spécial ([compare], [atelier]) — ce qui en pratique n'arrive pas car
  // les blocs spéciaux n'ont pas de H2 dedans, mais on est prudent.
  const lines = post.content.split("\n");
  const specialOpen = /^\[(compare|atelier)\]$/;
  const specialClose = /^\[\/(compare|atelier)\]$/;
  let insideSpecial = false;
  const h2Indexes: number[] = [];
  lines.forEach((l, i) => {
    const t = l.trim();
    if (specialOpen.test(t)) insideSpecial = true;
    else if (specialClose.test(t)) insideSpecial = false;
    else if (!insideSpecial && l.startsWith("## ") && i > 0) h2Indexes.push(i);
  });
  let splitIndex = -1;
  if (h2Indexes.length >= 2) {
    const middleLine = lines.length / 2;
    splitIndex = h2Indexes.reduce((best, i) =>
      Math.abs(i - middleLine) < Math.abs(best - middleLine) ? i : best,
    h2Indexes[0]);
  }
  const firstHalf = splitIndex > 0 ? lines.slice(0, splitIndex).join("\n") : post.content;
  const secondHalf = splitIndex > 0 ? lines.slice(splitIndex).join("\n") : "";

  const recommendedProductSlug =
    post.cta_product_slug ||
    (await pickProductSlugForArticle({
      slug: post.slug,
      title: post.title,
      content: post.content,
      category: post.category,
    }));

  // Récupération du produit pour la sidebar
  let sidebarProduct: {
    slug: string;
    name: string;
    price: number;
    image?: { src: string; alt?: string } | null;
  } | null = null;
  if (recommendedProductSlug) {
    const { data: rawProduct } = await supabase
      .from("products")
      .select("*")
      .eq("slug", recommendedProductSlug)
      .single();
    const product = mapSupabaseProduct(rawProduct);
    if (product) {
      sidebarProduct = {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || null,
      };
    }
  }

  const articleSchema = generateArticleSchema(post);
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <div className="bg-white">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumb} />

      {/* HERO PLEINE LARGEUR */}
      <header className="bg-[#faf8f5] pt-6 sm:pt-8 pb-10 sm:pb-14 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb nav */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/blog" className="hover:text-[#0f172a] transition-colors flex items-center gap-1">
              <ArrowLeft size={14} />
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#0f172a]">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
          </nav>

          <span className="inline-block bg-white text-[#8b2d2d] text-[0.7rem] font-semibold uppercase tracking-[0.2em] px-3 py-1.5 mb-5 border border-slate-200">
            {CATEGORY_LABELS[post.category] || post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-semibold text-slate-900 leading-[1.1] tracking-tight mb-6 max-w-4xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 max-w-3xl">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            {post.published_at && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.read_time} min de lecture</span>
            </div>
          </div>
        </div>

        {/* Image hero pleine largeur sous le titre */}
        {post.featured_image && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
            <div className="relative w-full aspect-[21/9] overflow-hidden">
              <Image
                src={post.featured_image.src}
                alt={post.featured_image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          </div>
        )}
      </header>

      {/* CONTENU ARTICLE — grille 2 colonnes, sidebar sticky à droite */}
      <Section className="pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-12 lg:gap-20 xl:gap-24">
            {/* COLONNE PRINCIPALE — article */}
            <div className="min-w-0">
              <article className="prose-slate max-w-none">
                {renderMarkdownContent(firstHalf, { withLettrine: true })}
                {secondHalf && <BlogNewsletterInline />}
                {secondHalf && renderMarkdownContent(secondHalf, { withLettrine: false })}
              </article>

              {/* Boutons de partage */}
              <div className="mt-10 pt-6 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-3">Partager cet article</p>
                <ShareButtons slug={slug} title={post.title} />
              </div>
            </div>

            {/* SIDEBAR — desktop uniquement, sticky avec scroll synchronisé */}
            <BlogSidebar
              relatedPosts={relatedPosts.map((rp) => ({
                slug: rp.slug,
                title: rp.title,
                category: rp.category,
                read_time: rp.read_time,
              }))}
              recommendedProduct={sidebarProduct}
              ctaText={post.cta_text}
            />
          </div>
        </div>
      </Section>

      {/* SECTIONS PLEINE LARGEUR EN PIED D'ARTICLE */}
      <div className="bg-[#faf8f5] py-16 sm:py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          {/* CTA Promotions — visible uniquement si au moins un produit est en promo */}
          {hasPromotions && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 text-center p-8 sm:p-12 rounded-lg">
              <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Offres en cours
              </span>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                Profitez de nos promotions
              </p>
              <p className="text-sm text-slate-600 mb-5">
                Braseros et accessoires en réduction — quantités limitées.
              </p>
              <Link
                href="/promotions"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide uppercase px-6 py-3 rounded-md transition-all"
              >
                Voir nos promotions
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* CTA : toujours vers la catégorie braséro */}
          <div className="bg-white border border-slate-200 text-center p-10 sm:p-14">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-3">
              La gamme Atelier LBF
            </p>
            <p className="text-2xl sm:text-3xl font-display font-semibold text-slate-900 mb-3">
              Nos braseros artisanaux manufacturés en France
            </p>
            <p className="text-base text-slate-600 mb-6 max-w-xl mx-auto">
              Le Fermier, Le Morris, L&apos;Obélix, Le Coffy — quatre modèles, une même exigence de qualité, des centaines de braseros livrés partout en France.
            </p>
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center gap-2 bg-[#0f172a] text-white hover:bg-[#1e293b] font-medium tracking-[0.18em] uppercase px-8 py-4 text-[0.75rem] transition-colors"
            >
              Découvrir nos braseros
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-slate-900 mb-8 text-center tracking-tight">
                Articles similaires
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="block p-6 bg-white border border-slate-200 hover:border-[#8b2d2d] hover:shadow-md transition-all group"
                  >
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] text-[#8b2d2d] font-semibold">
                      {CATEGORY_LABELS[rp.category] || rp.category}
                    </span>
                    <h3 className="font-display font-semibold text-slate-900 mt-2 group-hover:text-[#8b2d2d] transition-colors text-lg leading-snug line-clamp-3">
                      {rp.title}
                    </h3>
                    <span className="text-xs text-slate-500 mt-3 block">
                      {rp.read_time} min de lecture
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="text-center pt-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#8b2d2d] hover:text-[#6e2323] font-medium"
            >
              <ArrowLeft size={16} />
              Retour à tous les articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
