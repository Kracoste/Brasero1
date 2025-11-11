# Brasero Atelier

Site e-commerce Next.js (App Router + TypeScript) pour présenter quatre modèles de braséros fabriqués à Moncoutant ainsi qu’un fendeur à bûches premium.

## Stack & scripts

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS v4 (design tokens via `styles/globals.css`)
- Framer Motion, lucide-react, Radix UI (FAQ), Leaflet + React-Leaflet
- Linting : `pnpm lint`

```bash
pnpm install       # installe les dépendances
pnpm dev           # lance le serveur http://localhost:3000
pnpm build && pnpm start  # build + prévisualisation production
```

## Structure principale

```
app/
  (site)/layout.tsx        # Header collant + footer + fond
  (site)/page.tsx          # Accueil
  (site)/produits          # Catalogue + fiche produit dynamique
  (site)/atelier           # Atelier & savoir-faire
  (site)/contact           # Formulaire + coord.
  (site)/mentions-legales
  (site)/cgv
components/                # UI réutilisables (cards, galerie, FAQ, LeafletMap…)
content/
  products.ts              # Données produits (mock)
  reviews.ts               # Témoignages mock
lib/
  schema.ts                # Zod Product schema
  site.ts                  # Métadonnées + engagements
  utils.ts                 # Helpers + filtres catalogue
styles/globals.css         # Design tokens & animations
```

## Données & personnalisation

- **Produits** : modifiez `content/products.ts` (5 entrées). Chaque produit respecte `productSchema` (zod) : mise à jour automatique côté pages & filtres. Ajoutez vos URLs d’images (pensez à compléter `blurDataURL`).
- **Avis** : `content/reviews.ts`.
- **Identité / coordonnées** : `lib/site.ts`.
- **Feuille de styles/Tokens** : `styles/globals.css`. Couleurs `clay-*`, polices (`--font-display-variable`, `--font-geist-sans`).
- **Carte Leaflet** : réutilisable via `<LeafletMap lat lng zoom markerLabel />`. Base OpenStreetMap (aucune clé API).

## Fonctionnalités livrées

- Hero premium, CTA “Voir les braséros”, bandeau “Fabriqué en France”.
- Cartes produits (badge Made in France, price component), mini-map Atelier, engagements, avis.
- Catalogue `/produits` avec filtres (diamètre, matière, prix) + tri (prix/popularité).
- Fiche produit `/produits/[slug]` : galerie accessible, specs, points forts, livraison, bouton “Ajouter au panier” (placeholder), FAQ, mini-map Moncoutant.
- Pages Atelier, Contact (formulaire mock + coords + horaires), Mentions légales & CGV (placeholders).
- SEO : metadata complètes, OpenGraph/Twitter, schema.org `Organization`.

## Aller plus loin

- Brancher un CMS : mapper `content/products.ts` vers Sanity/Contentlayer en réutilisant `productSchema`.
- Panier/checkout : remplacer le CTA par des mutations (Stripe Checkout) lorsque l’API sera prête.
- Images propriétaires : ajouter vos visuels HD dans `public/` ou configurer d’autres domaines dans `next.config.ts`.

Bonnes flammes 🔥
# Brasero1
