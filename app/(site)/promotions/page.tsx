import { redirect } from "next/navigation";

export const metadata = {
  title: "Promotions braseros : jusqu'à -40% | Atelier LBF",
  description: "Promotions exceptionnelles sur nos braseros artisanaux et accessoires Made in France. Offres limitées.",
  alternates: {
    canonical: "/promotions",
  },
};

export default function PromotionsPage() {
  redirect("/produits?category=promotions");
}
