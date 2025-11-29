import { redirect } from "next/navigation";

export default function AccessoiresPage() {
  redirect("/produits?category=accessoire");
}
