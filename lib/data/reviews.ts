import { createClient } from "@/lib/supabase/server";

export async function getReviewStats(productSlug: string) {
  try {
    const supabase = await createClient();
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_slug", productSlug)
      .eq("is_approved", true);

    if (!reviews || reviews.length === 0) return null;

    const count = reviews.length;
    const average =
      Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10
      ) / 10;

    return { average, count };
  } catch {
    return null;
  }
}
