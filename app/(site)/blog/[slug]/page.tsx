import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { getBlogPost, getRelatedBlogPosts } from "@/lib/data/blog";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schemas";

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

function renderMarkdown(content: string) {
  // Simple markdown renderer for blog content
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-12 mb-4"
        >
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          className="text-xl sm:text-2xl font-display font-semibold text-slate-900 mt-8 mb-3"
        >
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 space-y-2 my-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-slate-700 leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-slate-700 leading-relaxed my-4">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

function renderInline(text: string): React.ReactNode {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Internal links [text](/url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const linkParts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        linkParts.push(part.slice(lastIndex, match.index));
      }
      linkParts.push(
        <Link
          key={`link-${idx}-${match.index}`}
          href={match[2]}
          className="text-[#8B4513] hover:underline font-medium"
        >
          {match[1]}
        </Link>
      );
      lastIndex = match.index + match[0].length;
    }
    if (linkParts.length > 0) {
      if (lastIndex < part.length) {
        linkParts.push(part.slice(lastIndex));
      }
      return <span key={idx}>{linkParts}</span>;
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(slug, post.category, 3);

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
            <Link href="/blog" className="hover:text-[#8B4513] transition-colors flex items-center gap-1">
              <ArrowLeft size={14} />
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#8B4513]">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <span className="inline-block bg-[#f6f1e9] text-[#8B4513] text-xs font-medium px-3 py-1 mb-4">
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
            {renderMarkdown(post.content)}
          </article>

          {/* Boutons de partage */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-3">Partager cet article</p>
            <ShareButtons slug={slug} title={post.title} />
          </div>

          {/* CTA Product */}
          {post.cta_product_slug && (
            <div className="mt-12 p-6 sm:p-8 bg-[#f6f1e9] border border-slate-200">
              <p className="text-lg font-semibold text-slate-900 mb-3">
                {post.cta_text || "Découvrir le produit"}
              </p>
              <Link
                href={`/produits/${post.cta_product_slug}`}
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
              >
                Voir le produit
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-12 p-6 sm:p-8 bg-[#f6f1e9] border border-slate-200 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Recevez nos conseils brasero & plancha
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Guides, recettes et offres exclusives directement dans votre boîte mail.
            </p>
            <Link
              href="/info/bulletin-information"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-medium tracking-wide uppercase px-6 py-3 transition-all text-sm"
            >
              S&apos;inscrire à la newsletter
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
                    <span className="text-xs text-[#8B4513] font-medium">
                      {CATEGORY_LABELS[rp.category] || rp.category}
                    </span>
                    <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-[#8B4513] transition-colors line-clamp-2">
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
              className="inline-flex items-center gap-2 text-[#8B4513] hover:underline font-medium"
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
