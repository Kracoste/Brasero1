import { redirect } from "next/navigation";

/**
 * Redirection /contact → /info/contact pour éviter le contenu dupliqué
 * La page complète se trouve dans /info/contact
 */
export default function ContactPage() {
  redirect("/info/contact");
}
