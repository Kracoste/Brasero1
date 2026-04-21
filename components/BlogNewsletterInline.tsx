import Link from "next/link";
import { Mail } from "lucide-react";

export function BlogNewsletterInline() {
  return (
    <aside className="my-10 p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg not-prose">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#8B4513] text-white flex items-center justify-center">
          <Mail size={18} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Guides & recettes brasero par email
          </h3>
          <p className="text-sm text-slate-600 mb-3">
            Recevez nos conseils d&apos;artisan et nos meilleures recettes, une fois par mois, sans spam.
          </p>
          <Link
            href="/info/bulletin-information"
            className="inline-flex items-center text-sm font-medium text-[#8B4513] hover:underline"
          >
            S&apos;inscrire gratuitement →
          </Link>
        </div>
      </div>
    </aside>
  );
}
