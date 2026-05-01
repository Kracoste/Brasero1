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
import { BlogProductRecommendation } from "@/components/BlogProductRecommendation";
import { BlogNewsletterInline } from "@/components/BlogNewsletterInline";
import { pickProductSlugForArticle } from "@/lib/blog/product-matcher";

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

  // Split le contenu au milieu (sur une frontière H2) pour insérer un bloc newsletter
  const lines = post.content.split("\n");
  const h2Indexes = lines
    .map((l, i) => (l.startsWith("## ") ? i : -1))
    .filter((i) => i > 0);
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

      <Section className="pt-6 sm:pt-10 pb-16 sm:pb-24">
        <Container className="max-w-3xl px-4 sm:px-6">
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

          {/* Header */}
          <header className="mb-10">
            <span className="inline-block bg-[#f1f5f9] text-[#0f172a] text-xs font-medium px-3 py-1 mb-4">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}
            {post.featured_image && (
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6">
                <Image
                  src={post.featured_image.src}
                  alt={post.featured_image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 720px"
                  priority
                />
              </div>
            )}
            <div className="flex items-center gap-6 text-sm text-slate-500 border-b border-slate-200 pb-6">
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
          </header>

          {/* Content */}
          <article className="prose-slate max-w-none">
            {renderMarkdownContent(firstHalf)}
            {secondHalf && <BlogNewsletterInline />}
            {secondHalf && renderMarkdownContent(secondHalf)}
          </article>

          {/* Produit recommandé contextuel : slug manuel si défini, sinon matching auto */}
          {recommendedProductSlug && (
            <BlogProductRecommendation
              productSlug={recommendedProductSlug}
              ctaText={post.cta_text}
            />
          )}

          {/* Boutons de partage */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-3">Partager cet article</p>
            <ShareButtons slug={slug} title={post.title} />
          </div>

          {/* CTA Promotions — visible uniquement si au moins un produit est en promo */}
          {hasPromotions && (
            <div className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 text-center rounded-lg">
              <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Offres en cours
              </span>
              <p className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                Profitez de nos promotions
              </p>
              <p className="text-sm text-slate-600 mb-4">
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

          {/* CTA : toujours vers la catégorie braséro pour laisser le client choisir */}
          <div className="mt-12 p-6 sm:p-8 bg-[#f1f5f9] border border-slate-200 text-center">
            <p className="text-lg font-semibold text-slate-900 mb-2">
              Nos braseros artisanaux manufacturés en France
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Le Fermier, Le Morris, L&apos;Obélix, Le Coffy — découvrez la gamme complète.
            </p>
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#0f172a] to-[#475569] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
            >
              Découvrir nos braseros
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-200">
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
                Articles similaires
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="block p-4 border border-slate-200 hover:shadow-md transition-shadow group"
                  >
                    <span className="text-xs text-[#0f172a] font-medium">
                      {CATEGORY_LABELS[rp.category] || rp.category}
                    </span>
                    <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-[#0f172a] transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    <span className="text-xs text-slate-500 mt-2 block">
                      {rp.read_time} min
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#0f172a] hover:underline font-medium"
            >
              <ArrowLeft size={16} />
              Retour au blog
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
