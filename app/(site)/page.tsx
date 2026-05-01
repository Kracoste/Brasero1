import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { generateStoreSchema } from "@/lib/seo/schemas";
import { LazyVideo } from "@/components/LazyVideo";
import { HeroVideo } from "@/components/HeroVideo";
import { HomepageNewsletter } from "@/components/HomepageNewsletter";

// ISR : revalidation toutes les 2 min (produits vedettes changent rarement)
export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Brasero artisanal | Espace barbecue & Ameublement jardin | ${settings.storeName}`,
    description: `4 modèles de braseros plancha (L'Obélix, Le Coffy, Le Morris, Le Fermier) en 50, 80 et 100 cm. Acier corten ou peint, plancha 8 à 10 mm, livré monté. Garantie 2 ans.`,
    keywords: [
      "boutique brasero",
      "acheter brasero",
      "vente brasero artisanal",
      "ameublement extérieur",
      "brasero jardin",
      "magasin brasero en ligne",
      "brasero made in France",
      "brasero acier corten",
      settings.storeName,
    ],
    openGraph: {
      title: `${settings.storeName} | Espace barbecue & Jardin`,
      description: `Braseros plancha L'Obélix, Le Coffy, Le Morris et Le Fermier. Fabrication artisanale à Moncoutant (79), livraison France incluse.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function HomePage() {
  const supabase = await createClient();

  // SEO-23 : Récupération dynamique des derniers articles de blog
  const { data: latestBlogPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, featured_image')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  const settings = await getSiteSettings();

  return (
    <>
      {/* Schema.org Store enrichi pour la page d'accueil */}
      <JsonLd data={generateStoreSchema(settings)} />

      {/* VideoObject pour la vidéo hero : améliore le référencement dans l'onglet Vidéos Google */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Braseros artisanaux Atelier LBF — fabrication française",
        "description": "Découvrez les braseros-planchas Atelier LBF : fabrication artisanale en France, acier corten et acier peint, cuisson au feu de bois. Modèles L'Obélix, Le Coffy, Le Morris, Le Fermier.",
        "contentUrl": "https://www.atelier-lbf.fr/acceuil/video_brasero_accueil_compresse.mp4",
        "thumbnailUrl": "https://www.atelier-lbf.fr/acceuil/video_brasero_poster.webp",
        "uploadDate": "2025-06-01",
        "duration": "PT0M20S",
      }} />

      <h1 className="sr-only">Votre espace barbecue artisanal — Atelier LBF</h1>

      <section className="overflow-hidden">
        <Link
          href="/produits?category=brasero"
          className="relative block overflow-hidden w-full h-[320px] sm:h-[480px] lg:h-[640px] xl:h-[720px] group"
        >
            <Image
              src="/acceuil/video_brasero_poster.webp"
              alt="Braseros artisanaux en acier corten et acier peint — collection Atelier LBF"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <HeroVideo />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 lg:pb-20 text-white text-center px-4">
              <span className="inline-block bg-white px-8 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-900 transition group-hover:bg-slate-900 group-hover:text-white">
                Découvrir la collection Atelier-LBF
              </span>
            </div>
        </Link>
      </section>

      <section className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
            Qui sommes-nous
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 leading-[1.15] tracking-tight">
            L&apos;histoire d&apos;<span className="italic font-normal">Atelier-LBF</span>, brasero artisanal français
          </h2>

          <div className="mt-12 space-y-6 text-left sm:text-center">
            <p className="text-base sm:text-lg text-slate-600 leading-loose">
              Tout commence en <strong className="text-slate-900 font-medium">janvier 2023</strong>, à{" "}
              <strong className="text-slate-900 font-medium">Moncoutant-sur-Sèvre</strong>, au cœur des{" "}
              <strong className="text-slate-900 font-medium">Deux-Sèvres</strong>.{" "}
              <strong className="text-slate-900 font-medium">Hugo Allou</strong> y allume la première forge
              d&apos;Atelier-LBF avec une conviction&nbsp;: redonner au feu sa place autour de la table, et à
              l&apos;acier toute sa noblesse.
            </p>

            <p className="text-base sm:text-lg text-slate-600 leading-loose">
              Chaque <strong className="text-slate-900 font-medium">brasero</strong> qui sort de notre atelier est
              façonné à la main, dans des aciers choisis pour leur caractère.{" "}
              <strong className="text-slate-900 font-medium">L&apos;acier corten</strong> et sa patine vivante qui
              se teinte d&apos;ocre au fil des saisons.{" "}
              <strong className="text-slate-900 font-medium">L&apos;acier noir brut</strong> à la matière franche
              et minérale. <strong className="text-slate-900 font-medium">L&apos;inox</strong> pour sa résistance
              dans le temps. Des matières nobles, pensées pour durer des décennies.
            </p>

            <p className="text-base sm:text-lg text-slate-600 leading-loose">
              Si la fabrication s&apos;étend sur{" "}
              <strong className="text-slate-900 font-medium">2 à 4 semaines</strong>, c&apos;est parce que chaque
              pièce est découpée, soudée et finie à la main par nos artisans. L&apos;acier corten demande son
              temps de patine, les peintures haute température leur cuisson&nbsp;: nous préférons prendre le
              temps plutôt que bâcler. Avant chaque expédition, un{" "}
              <strong className="text-slate-900 font-medium">contrôle qualité</strong> rigoureux est mené sur
              chaque brasero, et nos produits sont couverts par une{" "}
              <strong className="text-slate-900 font-medium">garantie de 2 ans</strong>. C&apos;est ce qui
              distingue un brasero{" "}
              <strong className="text-slate-900 font-medium">made in France</strong> d&apos;un produit industriel.
            </p>

            <p className="text-base sm:text-lg text-slate-600 leading-loose">
              Choisir Atelier-LBF, c&apos;est choisir un brasero{" "}
              <strong className="text-slate-900 font-medium">fabriqué en France</strong>, dans un terroir où le
              travail du métal se transmet depuis des générations. Nos modèles{" "}
              <Link href="/produits?category=brasero" className="text-slate-900 font-medium underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition">L&apos;Obélix</Link>,{" "}
              <Link href="/produits?category=brasero" className="text-slate-900 font-medium underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition">Le Coffy</Link>,{" "}
              <Link href="/produits?category=brasero" className="text-slate-900 font-medium underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition">Le Morris</Link>{" "}et{" "}
              <Link href="/produits?category=brasero" className="text-slate-900 font-medium underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition">Le Fermier</Link>{" "}
              incarnent cet engagement.
            </p>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <Link
              href="/made-in-france"
              className="inline-flex items-center justify-center bg-slate-900 px-8 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-white transition hover:bg-slate-700"
            >
              Découvrir notre atelier
            </Link>
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center justify-center border border-slate-900 px-8 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Voir nos braseros
            </Link>
          </div>
        </div>
      </section>

      {/* Section Découpe Laser Personnalisée */}
      {/* SEO-18 : Mettre à jour VIDEO_UPLOAD_DATE si la vidéo de découpe laser change */}
      {(() => {
        const VIDEO_UPLOAD_DATE = "2025-03-01"; // À mettre à jour si la vidéo change
        return (
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Découpe laser sur brasero — Atelier LBF",
            "description": "Démonstration de la découpe laser pour personnalisation de brasero artisanal. Motifs découpés dans l'acier avec précision millimétrique.",
            "contentUrl": "https://www.atelier-lbf.fr/acceuil/VideoDecoupeLaser.mp4",
            "thumbnailUrl": "https://www.atelier-lbf.fr/Produits/og-brasero.webp",
            "uploadDate": VIDEO_UPLOAD_DATE,
            "duration": "PT0M30S",
          }} />
        );
      })()}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Vidéo */}
            <div className="relative overflow-hidden aspect-video">
              <LazyVideo
                src="/acceuil/VideoDecoupeLaser.mp4"
                className="absolute inset-0 w-full h-full"
                aria-label="Démonstration de découpe laser sur brasero artisanal"
              />
            </div>

            {/* Contenu */}
            <div className="space-y-8">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
                Personnalisation sur mesure
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 leading-[1.15] tracking-tight">
                Découpe laser&nbsp;: <span className="italic font-normal">votre brasero, votre signature</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-loose">
                Logo, prénom, dessin, blason. Chaque motif est taillé dans l&apos;acier avec une
                précision millimétrique, directement dans la structure du socle, pour un rendu
                saisissant de jour comme de nuit lorsque les flammes illuminent votre création.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Link
                  href="/info/produits-sur-mesure"
                  className="inline-flex items-center justify-center bg-slate-900 px-8 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-white transition hover:bg-slate-700"
                >
                  Demander un devis
                </Link>
                <span className="text-sm text-slate-500">
                  À partir de 300&nbsp;€ HT
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Blog — maillage interne SEO */}
      <section className="py-20 sm:py-28 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
            Journal
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight">
            Guides et conseils <span className="italic font-normal">brasero</span>
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-px bg-slate-100 max-w-5xl mx-auto">
            {(latestBlogPosts || []).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-8 bg-[#faf8f5] hover:bg-white transition-colors text-left group">
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">Guide</span>
                <h3 className="font-display text-lg font-light text-slate-900 mt-3 group-hover:text-slate-700 transition-colors leading-snug">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/blog"
              className="text-xs font-medium uppercase tracking-[0.25em] text-slate-900 underline decoration-slate-300 underline-offset-8 hover:decoration-slate-900 transition"
            >
              Lire tous nos guides
            </Link>
          </div>
        </div>
      </section>


      {/* Section Newsletter — premium, sans réduction */}
      <section className="py-20 sm:py-28 border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
            Newsletter
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight">
            Rejoignez-nous dans <span className="italic font-normal">l&apos;aventure Atelier-LBF</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-slate-600 leading-loose">
            Découvrez en avant-première nos nouvelles créations, l&apos;agenda de l&apos;atelier
            et nos guides d&apos;entretien&nbsp;: l&apos;envers du décor d&apos;un atelier français.
          </p>
          <HomepageNewsletter />
          <p className="mt-4 text-xs text-slate-400 tracking-wide">
            Désabonnement en un clic.
          </p>
        </div>
      </section>

      {/* Section SEO condensée — texte de bas de page */}
      <section className="py-16 sm:py-20 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 leading-loose">
            <strong className="text-slate-700 font-medium">{settings.storeName}</strong> conçoit et
            fabrique en France des braseros artisanaux et accessoires d&apos;ameublement
            d&apos;extérieur pour le jardin et la terrasse. Acier corten, acier noir brut et inox&nbsp;:
            des matières nobles, sélectionnées pour traverser les saisons. Chaque brasero
            multifonction, design ou traditionnel est façonné à la main dans notre atelier
            de {settings.atelier.city}, livré soigneusement partout en France.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/produits"
              className="inline-flex items-center justify-center bg-slate-900 px-8 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-white transition hover:bg-slate-700"
            >
              Découvrir la collection
            </Link>
            <Link
              href="/made-in-france"
              className="inline-flex items-center justify-center border border-slate-900 px-8 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-medium uppercase tracking-wider text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Notre atelier
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

