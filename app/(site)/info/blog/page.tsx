import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  BookOpen, 
  ArrowRight,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Flame,
  Wrench,
  TreePine,
  Sparkles,
  Home,
  ChefHat
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Blog brasero | Actualités et inspirations | ${settings.storeName}`,
    description: `Découvrez notre blog dédié aux braseros : actualités de l'atelier, inspirations déco, recettes au feu de bois, conseils d'aménagement extérieur.`,
    keywords: [
      "blog brasero",
      "actualités brasero",
      "inspiration brasero",
      "aménagement jardin brasero",
      "recettes brasero",
      "décoration extérieur brasero",
      "tendances brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Blog | ${settings.storeName}`,
      description: `Actualités, inspirations et conseils autour du brasero artisanal.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/info/blog",
    },
  };
}

export default async function BlogPage() {
  const settings = await getSiteSettings();

  const categories = [
    { name: "Tous", slug: "tous", count: 12 },
    { name: "Inspirations", slug: "inspirations", count: 4 },
    { name: "Conseils", slug: "conseils", count: 3 },
    { name: "Recettes", slug: "recettes", count: 3 },
    { name: "Atelier", slug: "atelier", count: 2 }
  ];

  const featuredArticle = {
    title: "Comment aménager un espace convivial autour de son brasero",
    excerpt: "Découvrez nos conseils pour créer un coin chaleureux dans votre jardin ou sur votre terrasse. Mobilier, éclairage, végétation : tous les secrets d'un aménagement réussi.",
    category: "Inspirations",
    date: "15 décembre 2025",
    readTime: "8 min",
    author: "L'équipe LBF",
    icon: Home
  };

  const articles = [
    {
      title: "5 recettes à cuisiner sur votre brasero",
      excerpt: "De la plancha aux brochettes en passant par la paella, découvrez des recettes gourmandes à réaliser au feu de bois.",
      category: "Recettes",
      date: "8 décembre 2025",
      readTime: "6 min",
      icon: ChefHat
    },
    {
      title: "Acier corten vs acier classique : lequel choisir ?",
      excerpt: "Comparatif complet des deux types d'acier pour vous aider à faire le bon choix selon votre usage et votre environnement.",
      category: "Conseils",
      date: "1 décembre 2025",
      readTime: "5 min",
      icon: Wrench
    },
    {
      title: "Les coulisses de la fabrication d'un brasero",
      excerpt: "Plongez dans notre atelier et découvrez les étapes de création d'un brasero artisanal, du dessin à la finition.",
      category: "Atelier",
      date: "22 novembre 2025",
      readTime: "7 min",
      icon: Flame
    },
    {
      title: "Quel bois pour un feu parfait ?",
      excerpt: "Guide complet des essences de bois : pouvoir calorifique, durée de combustion, fumée... Tout savoir pour choisir le bon bois.",
      category: "Conseils",
      date: "15 novembre 2025",
      readTime: "4 min",
      icon: TreePine
    },
    {
      title: "10 idées pour décorer votre terrasse avec un brasero",
      excerpt: "Inspiration et tendances pour intégrer harmonieusement votre brasero dans votre espace extérieur.",
      category: "Inspirations",
      date: "8 novembre 2025",
      readTime: "5 min",
      icon: Sparkles
    },
    {
      title: "Préparer son brasero pour l'hiver",
      excerpt: "Conseils d'entretien et de protection pour que votre brasero traverse l'hiver en parfait état.",
      category: "Conseils",
      date: "1 novembre 2025",
      readTime: "4 min",
      icon: Wrench
    }
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#8B4513]" />
              </div>
              <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                Blog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
              Actualités et <span className="text-slate-900">inspirations</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Découvrez nos articles sur l'univers du brasero : conseils d'utilisation, 
              inspirations déco, recettes au feu de bois et coulisses de notre atelier artisanal.
            </p>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 py-4">
            {categories.map((category, index) => (
              <button
                key={category.slug}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  index === 0 
                    ? 'bg-[#8B4513] text-white' 
                    : 'bg-[#f6f1e9] text-slate-700 hover:bg-[#8B4513] hover:text-white'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article à la une */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-[#8B4513]" />
            <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
              À la une
            </span>
          </div>
          
          <div className="bg-white border border-slate-200 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-[#8B4513] to-[#CD853F] p-8 sm:p-12 flex items-center justify-center">
                <featuredArticle.icon className="w-32 h-32 text-white/30" />
              </div>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#f6f1e9] text-[#8B4513] text-xs font-medium px-3 py-1">
                    {featuredArticle.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredArticle.date}</span>
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4">
                  {featuredArticle.title}
                </h2>
                
                <p className="text-slate-600 leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#CD853F] font-medium transition-colors">
                    Lire l'article
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des articles */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8">
            Derniers articles
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <article 
                key={index}
                className="bg-white border border-slate-200 hover:shadow-md transition-shadow group"
              >
                <div className="bg-[#f6f1e9] p-8 flex items-center justify-center">
                  <article.icon className="w-16 h-16 text-[#8B4513]/30" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#f6f1e9] text-[#8B4513] text-xs font-medium px-2 py-1">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-500">{article.date}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-[#8B4513] transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                    
                    <button className="inline-flex items-center gap-1 text-[#8B4513] hover:text-[#CD853F] text-sm font-medium transition-colors">
                      Lire
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-8 py-4 transition-all">
              Voir tous les articles
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 border border-slate-200 text-center">
            <Mail className="w-12 h-12 text-[#8B4513] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
              Ne manquez aucun article
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Inscrivez-vous à notre newsletter pour recevoir nos derniers articles, 
              conseils et actualités directement dans votre boîte mail.
            </p>
            
            <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 border border-slate-300 focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513] outline-none transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
              >
                S'abonner
              </button>
            </form>
            
            <p className="mt-4 text-xs text-slate-500">
              En vous inscrivant, vous acceptez notre{" "}
              <Link href="/info/confidentialite-politique" className="text-[#8B4513] hover:underline">
                politique de confidentialité
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-24 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
            Envie de découvrir nos braseros ?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Parcourez notre collection de braseros artisanaux fabriqués en France.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
            >
              Voir nos braseros
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
            >
              Nous contacter
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
