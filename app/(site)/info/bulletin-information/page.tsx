import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Mail, 
  ArrowRight,
  CheckCircle2,
  Gift,
  Percent,
  Flame,
  Bell,
  Sparkles,
  Clock,
  Phone,
  MapPin,
  Shield,
  Users,
  Star,
  Zap
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Newsletter brasero | Offres et nouveautés | ${settings.storeName}`,
    description: `Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives, nouveautés brasero et conseils d'utilisation. Promotions réservées aux abonnés.`,
    keywords: [
      "newsletter brasero",
      "offres brasero",
      "promotions brasero",
      "nouveautés brasero",
      "réductions brasero",
      "actualités brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Newsletter | ${settings.storeName}`,
      description: `Recevez nos offres exclusives et conseils brasero directement dans votre boîte mail.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Produits/og-brasero.webp" }],
    },
    alternates: {
      canonical: "/info/bulletin-information",
    },
  };
}

export default async function NewsletterPage() {
  const settings = await getSiteSettings();

  const benefits = [
    {
      icon: Percent,
      title: "Offres exclusives",
      description: "Profitez de réductions réservées uniquement à nos abonnés newsletter."
    },
    {
      icon: Bell,
      title: "Nouveautés en avant-première",
      description: "Soyez les premiers informés de nos nouvelles créations et collections."
    },
    {
      icon: Sparkles,
      title: "Conseils d'experts",
      description: "Recevez nos astuces pour l'entretien et l'utilisation de votre brasero."
    },
    {
      icon: Gift,
      title: "Surprises & cadeaux",
      description: "Des offres spéciales pour votre anniversaire et les fêtes."
    }
  ];

  const contentTypes = [
    {
      icon: Flame,
      title: "Inspiration",
      description: "Idées d'aménagement, ambiances et photos de braseros chez nos clients."
    },
    {
      icon: Zap,
      title: "Actualités",
      description: "Les coulisses de l'atelier, nos événements et participations aux salons."
    },
    {
      icon: Star,
      title: "Sélections",
      description: "Nos coups de cœur, les modèles les plus populaires et les meilleures ventes."
    },
    {
      icon: Users,
      title: "Témoignages",
      description: "Découvrez les retours de nos clients et leurs installations."
    }
  ];

  const guarantees = [
    "1 à 2 emails par mois maximum",
    "Désabonnement en 1 clic",
    "Aucune revente de vos données",
    "Contenu de qualité garanti"
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#8B4513]" />
              </div>
              <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                Newsletter
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
              Restez informé de nos <span className="text-slate-900">nouveautés</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Inscrivez-vous à notre bulletin d'information pour recevoir nos offres exclusives, 
              les dernières nouveautés brasero et nos conseils d'experts directement dans votre 
              boîte mail.
            </p>
          </div>
        </div>
      </section>

      {/* Formulaire d'inscription */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Inscrivez-vous gratuitement
              </h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Rejoignez notre communauté de passionnés et bénéficiez d'avantages 
                exclusifs réservés à nos abonnés.
              </p>
              
              <ul className="mt-6 space-y-3">
                {guarantees.map((guarantee) => (
                  <li key={guarantee} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513] flex-shrink-0" />
                    <span>{guarantee}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div id="formulaire-newsletter" className="bg-white p-8 sm:p-10 border border-slate-200 scroll-mt-24">
              <div className="text-center mb-8">
                <Bell className="w-16 h-16 text-[#8B4513] mx-auto" />
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  Rejoignez la newsletter
                </h3>
                <p className="mt-2 text-slate-600">
                  Recevez 10% de réduction sur votre première commande
                </p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="votre@email.com"
                    required
                    className="w-full px-4 py-3 border border-slate-300 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-slate-700 mb-1">
                    Prénom (optionnel)
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    placeholder="Votre prénom"
                    className="w-full px-4 py-3 border border-slate-300 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-colors"
                  />
                </div>
                
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    className="mt-1 w-4 h-4 text-[#8B4513] border-slate-300 focus:ring-[#8B4513]"
                  />
                  <label htmlFor="consent" className="text-sm text-slate-600">
                    J'accepte de recevoir la newsletter et j'ai lu la{" "}
                    <Link href="/info/confidentialite-politique" className="text-[#8B4513] hover:underline">
                      politique de confidentialité
                    </Link>.
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-4 transition-all"
                >
                  <Mail size={18} />
                  S'inscrire à la newsletter
                </button>
              </form>
              
              <p className="mt-4 text-xs text-slate-500 text-center">
                Vous pouvez vous désabonner à tout moment en cliquant sur le lien 
                dans nos emails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Les avantages abonnés
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Pourquoi s'inscrire à notre newsletter ?
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div 
                key={benefit.title}
                className="bg-[#f6f1e9] p-6 border border-slate-200 text-center"
              >
                <benefit.icon className="w-10 h-10 text-[#8B4513] mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-slate-900">{benefit.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu de la newsletter */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Que contient notre newsletter ?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Du contenu de qualité pour les passionnés de braseros
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentTypes.map((content) => (
              <div 
                key={content.title}
                className="bg-white p-6 border border-slate-200"
              >
                <content.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-slate-900">{content.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {content.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement confidentialité */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f6f1e9] p-8 sm:p-12 border border-slate-200">
            <div className="flex items-start gap-4">
              <Shield className="w-12 h-12 text-[#8B4513] flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
                  Notre engagement confidentialité
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Votre adresse email est précieuse et nous la traitons avec le plus grand soin. 
                  Nous ne revendons jamais vos données personnelles à des tiers et nous limitons 
                  strictement nos envois pour ne pas encombrer votre boîte mail.
                </p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Conformément au RGPD, vous pouvez à tout moment accéder à vos données, les 
                  modifier ou demander leur suppression.
                </p>
                <Link
                  href="/info/confidentialite-politique"
                  className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#CD853F] font-medium transition-colors"
                >
                  Lire notre politique de confidentialité
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-24 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
            Prêt à rejoindre notre communauté ?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Inscrivez-vous maintenant et recevez 10% de réduction sur votre première commande.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="#formulaire-newsletter"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all scroll-smooth"
            >
              <Mail size={18} />
              S'inscrire maintenant
            </Link>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
            >
              Découvrir nos braseros
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact rapide */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <a 
              href={`mailto:${settings.storeEmail}`}
              className="flex items-center gap-2 hover:text-[#8B4513] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#8B4513]" />
              <span>{settings.storeEmail}</span>
            </a>
            <a 
              href={`tel:${settings.storePhone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 hover:text-[#8B4513] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#8B4513]" />
              <span>{settings.storePhone}</span>
            </a>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8B4513]" />
              <span>Lun-Ven : 9h-18h</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8B4513]" />
              <span>{settings.atelier.city}, {settings.atelier.department}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
