import { createClient } from "@/lib/supabase/server";

export type ReviewStats = { average: number; count: number };

export async function getReviewStatsBatch(slugs: string[]): Promise<Record<string, ReviewStats>> {
  if (slugs.length === 0) return {};
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("product_slug, rating")
      .in("product_slug", slugs)
      .eq("is_approved", true);

    if (!data) return {};

    const acc: Record<string, { sum: number; count: number }> = {};
    for (const r of data) {
      const key = r.product_slug as string;
      if (!acc[key]) acc[key] = { sum: 0, count: 0 };
      acc[key].sum += r.rating as number;
      acc[key].count += 1;
    }

    const out: Record<string, ReviewStats> = {};
    for (const [slug, { sum, count }] of Object.entries(acc)) {
      out[slug] = { average: Math.round((sum / count) * 10) / 10, count };
    }
    return out;
  } catch {
    return {};
  }
}
