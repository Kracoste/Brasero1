import Link from 'next/link';
import { Hammer, Truck, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

const processCards = [
  {
    href: '/fabrication',
    icon: Hammer,
    number: 1,
    title: 'Fabrication artisanale',
    shortDesc: 'Chaque brasero est fabriqué à la main dans notre atelier à Moncoutant, Deux-Sèvres.',
  },
  {
    href: '/qualite',
    icon: Shield,
    number: 2,
    title: 'Contrôle qualité',
    shortDesc: 'Inspection minutieuse de chaque pièce avant expédition pour garantir la perfection.',
  },
  {
    href: '/livraison',
    icon: Truck,
    number: 3,
    title: 'Livraison soignée',
    shortDesc: 'Fabrication artisanale et livraison partout en France sous 2 à 4 semaines.',
  },
];

const stats = [
  { value: '100%', label: 'Manufacture française' },
  { value: '2 ans', label: 'Garantie minimum' },
  { value: '5-10j', label: 'Délai de livraison' },
  { value: '98%', label: 'Clients satisfaits' },
];

export const HeroMenu = () => {
  return (
    <div className="relative w-full overflow-hidden bg-white border-t border-slate-100">


      {/* Contenu */}
      <div className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Titre principal */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5A2B]">
                Atelier LBF
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 leading-[1.1] tracking-tight">
              De la fabrication<br />
              <span className="italic font-normal">à votre jardin</span>
            </h2>
            <p className="mt-5 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Nous concevons, fabriquons et livrons nos braseros artisanaux directement depuis notre atelier français.
            </p>
          </div>

          {/* Cartes cliquables vers les pages */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {processCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative text-left p-6 sm:p-8 transition-colors bg-white border border-slate-100 hover:border-slate-900"
              >
                {/* Numéro */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center text-white font-medium text-sm bg-slate-900">
                  {card.number}
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <card.icon className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-medium mb-2 text-slate-900">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-4">
                    {card.shortDesc}
                  </p>

                  {/* Bouton En savoir plus */}
                  <span className="inline-flex items-center gap-2 text-slate-900 font-medium text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                    En savoir plus
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 sm:p-6"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm sm:text-base text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-medium uppercase tracking-wider px-8 py-3.5 text-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Découvrir nos produits
              </Link>
              <Link
                href="/info/a-propos-de-nous"
                className="inline-flex items-center gap-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-medium uppercase tracking-wider px-8 py-3.5 text-xs transition-colors"
              >
                Visiter notre atelier
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" strokeWidth={1.5} />
              Paiement sécurisé • Livraison assurée • Satisfait ou remboursé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
