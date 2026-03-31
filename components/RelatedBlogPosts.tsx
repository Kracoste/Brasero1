import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/data/blog";

type RelatedBlogPostsProps = {
  posts: BlogPost[];
};

export function RelatedBlogPosts({ posts }: RelatedBlogPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-[#f6f1e9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-6">
          Guides et conseils pour votre brasero
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white border border-slate-200 hover:shadow-md transition-shadow group"
            >
              {post.featured_image ? (
                <div className="relative h-40">
                  <Image
                    src={post.featured_image.src}
                    alt={post.featured_image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-[#8B4513]/10 to-[#CD853F]/10 flex items-center justify-center">
                  <span className="text-4xl text-[#8B4513]/20">📖</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-sm text-slate-900 mb-2 group-hover:text-[#8B4513] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{post.read_time} min</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[#8B4513] text-xs font-medium">
                    Lire l&apos;article
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
