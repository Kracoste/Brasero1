# 🔍 AUDIT COMPLET — atelier-lbf.fr
**Date** : 18 février 2026  
**Framework** : Next.js 16 + Supabase + Stripe + Tailwind CSS 4  
**Domaine** : https://www.atelier-lbf.fr

---

## 📊 RÉSUMÉ EXÉCUTIF

| Catégorie | Problèmes | Critiques | Importants | Mineurs |
|-----------|-----------|-----------|------------|---------|
| 🔒 Sécurité | 6 | 2 | 3 | 1 |
| 🔍 SEO | 8 | 1 | 5 | 2 |
| 🗑️ Code mort / parasites | 9 | 0 | 5 | 4 |
| 🔁 Doublons | 5 | 0 | 4 | 1 |
| 📱 Responsive | 3 | 0 | 2 | 1 |
| ⚡ Performance | 6 | 1 | 3 | 2 |
| 🏗️ Architecture | 4 | 0 | 3 | 1 |
| **TOTAL** | **41** | **4** | **25** | **12** |

---

## 🔒 SÉCURITÉ

### 🔴 CRITIQUE

#### SEC-1 : Absence de Content-Security-Policy (CSP)
**Fichier** : `middleware.ts`  
Le middleware applique `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` et `Permissions-Policy`, mais **aucune directive CSP** n'est définie. Sans CSP, le site est vulnérable aux attaques XSS via injection de scripts tiers.

**Recommandation** : Ajouter un header `Content-Security-Policy` dans le middleware :
```
default-src 'self'; script-src 'self' 'unsafe-inline' https://translate.google.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://kxztmjqxsskvbqcohtgj.supabase.co https://images.unsplash.com; connect-src 'self' https://kxztmjqxsskvbqcohtgj.supabase.co https://*.google-analytics.com;
```

#### SEC-2 : Email admin en dur dans le code
**Fichier** : `lib/auth.ts` (ligne 10)  
L'email admin `allouhugo@gmail.com` est codé en dur comme fallback. Si la variable d'env `ADMIN_EMAILS` n'est pas définie, n'importe qui connaissant cet email pourrait comprendre la logique d'accès admin.

**Recommandation** : Supprimer le fallback en dur et rendre `ADMIN_EMAILS` obligatoire via une vérification au démarrage.

---

### 🟡 IMPORTANT

#### SEC-3 : `dangerouslySetInnerHTML` avec scripts externes non vérifiés
**Fichier** : `app/layout.tsx` (lignes 98-119)  
Google Translate et GTM sont injectés via `dangerouslySetInnerHTML`. C'est un usage courant, mais sans CSP (SEC-1), ces scripts pourraient être remplacés par du code malveillant en cas de compromission de ces CDN.

#### SEC-4 : Assertions `!` sur les variables d'environnement
**Fichiers** : `lib/supabase/server.ts`, `lib/supabase/middleware.ts`, `lib/supabase/client.ts`  
Les variables `NEXT_PUBLIC_SUPABASE_URL!` et `NEXT_PUBLIC_SUPABASE_ANON_KEY!` utilisent l'opérateur `!` de TypeScript (non-null assertion) sans vérification préalable. Si ces variables sont manquantes, le site crashera sans message d'erreur clair.

**Recommandation** : Ajouter une vérification au démarrage (ex: dans un fichier `lib/env.ts`).

#### SEC-5 : Rate limiter en mémoire — non persisté
**Fichier** : `lib/rate-limit.ts`  
Le rate limiter utilise une `Map` en mémoire. En serverless (Vercel), chaque instance a sa propre map → le rate limiting est inefficace. Un attaquant peut contourner la limite en générant des requêtes qui tombent sur des instances différentes.

**Recommandation** : Utiliser Vercel KV (Redis) ou Upstash pour le rate limiting distribué.

---

### 🟢 MINEUR

#### SEC-6 : `suppressHydrationWarning` sur `<html>` et `<body>`
**Fichier** : `app/layout.tsx` (lignes 99, 121)  
`suppressHydrationWarning` masque les différences entre SSR et client. C'est acceptable pour Google Translate qui modifie le DOM, mais surveiller que cela ne masque pas de vrais problèmes d'hydration.

---

## 🔍 SEO

### 🔴 CRITIQUE

#### SEO-1 : Faute d'orthographe dans le dossier public — "acceuil" au lieu de "accueil"
**Dossier** : `public/acceuil/`  
**Fichiers référençant** : `app/(site)/page.tsx` (lignes 167, 175), `content/products.ts`, `app/(site)/info/commander/page.tsx`  
Le dossier contient une **faute d'orthographe** ("acceuil" → "accueil"). Si Google indexe ces URL d'images, cela donne une impression de négligence.

**Recommandation** : Renommer le dossier `public/acceuil/` → `public/accueil/` et mettre à jour toutes les références.

---

### 🟡 IMPORTANT

#### SEO-2 : Commentaire contradictoire sur revalidate
**Fichier** : `app/(site)/page.tsx` (lignes 10-13)  
```tsx
// Cache ISR de 60 secondes pour équilibrer performance et fraîcheur des données
// Pas de cache - les données sont toujours fraîches
export const revalidate = 0;
export const dynamic = 'force-dynamic';
```
Le commentaire mentionne ISR 60s mais la valeur est `0` (pas de cache). Cette configuration force **toutes les requêtes** à passer par le serveur → mauvais pour les Core Web Vitals (TTFB élevé).

**Recommandation** : Utiliser `revalidate = 60` pour un bon compromis performance/fraîcheur et supprimer le commentaire contradictoire.

#### SEO-3 : Pages `/livraison` et `/livraison-france` — contenu potentiellement similaire
Deux pages traitent du même sujet (livraison), ce qui peut créer du **contenu dupliqué** pour Google.

**Recommandation** : Fusionner les deux pages ou ajouter `canonical` de l'une vers l'autre.

#### SEO-4 : Double page `/info/[slug]` (route dynamique) + pages statiques dédiées
Le dossier `app/(site)/info/` contient :
- Une route dynamique `[slug]/page.tsx` qui génère des pages à partir d'un objet JS
- **ET** des dossiers dédiés pour chaque slug (`a-propos-de-nous/page.tsx`, `faq/page.tsx`, etc.)

Les pages statiques sont servies en priorité par Next.js (les routes statiques priment sur les dynamiques), mais le catch-all `[slug]/page.tsx` contient une copie du contenu pour les mêmes slugs → code mort et maintenance doublée.

**Recommandation** : Supprimer le contenu dupliqué dans `[slug]/page.tsx` pour les pages qui ont déjà un dossier dédié.

#### SEO-5 : Images `<img>` non optimisées (sans `next/image`)
**Fichier** : `app/(site)/page.tsx` (lignes 328, 346) — composants `CategoryTile` et `PromoTile`  
Ces composants utilisent `<img>` natif au lieu de `<Image>` de Next.js → pas de lazy loading automatique, pas de formats modernes (WebP/AVIF), pas de responsive `srcset`.

**Recommandation** : Remplacer `<img>` par `<Image>` de `next/image`.

#### SEO-6 : OpenGraph utilise une image Unsplash générique
**Fichier** : `app/layout.tsx` (ligne 59)  
L'image OG est une photo Unsplash de nature (`photo-1469474968028-56623f02e42e`) qui n'a aucun rapport avec les braseros.

**Recommandation** : Utiliser une vraie photo de vos produits pour l'image OG.

#### SEO-7 : `<a>` natif au lieu de `<Link>` dans CategoryTile
**Fichier** : `app/(site)/page.tsx` (ligne 321)  
`CategoryTile` utilise `<a href={href}>` au lieu de `<Link href={href}>`, ce qui désactive la navigation côté client (SPA) de Next.js et provoque un rechargement complet de la page.

---

### 🟢 MINEUR

#### SEO-8 : Nom du produit incohérent
**Fichier** : `content/products.ts` (ligne 82)  
Le produit avec le slug `brasero-signature-80` a pour nom `"Fendeur à bûches Atelier LBF"` au lieu d'un nom de brasero. Incohérence nom/catégorie.

#### SEO-9 : Sitemap inclut la page `/contact`
La page `/contact` redirige vers `/info/contact` (redirect 301), mais le sitemap ne devrait lister que les URL finales.

---

## 🗑️ CODE MORT / PARASITES

### 🟡 IMPORTANT

#### DEAD-1 : `content/products.ts` — fichier legacy de 2025 lignes
Ce fichier de 2025 lignes contient des produits codés en dur (braseros fictifs, promo products générés programmatiquement). Il n'est plus utilisé par le site (tout vient de Supabase), sauf par :
- `app/admin/produits/migration/page.tsx`
- `app/api/admin/sync-products/route.ts`
- `app/admin/produits/local/[slug]/page.tsx`

Ces 3 fichiers sont des outils de migration one-shot. **Le fichier entier est du code mort.**

**Recommandation** : Supprimer `content/products.ts` et les 3 fichiers de migration associés.

#### DEAD-2 : `lib/site.ts` — configuration dupliquée jamais utilisée
Le fichier `lib/site.ts` exporte `siteConfig` avec des données identiques à `lib/site-settings-defaults.ts` (storeName, email, phone, address, etc.). **Aucun fichier ne l'importe.**

**Recommandation** : Supprimer `lib/site.ts`.

#### DEAD-3 : `components/FadeIn.tsx` — composant jamais utilisé
Le composant `FadeIn` qui utilise `framer-motion` n'est importé nulle part dans le projet.

**Recommandation** : Supprimer le fichier ou l'utiliser.

#### DEAD-4 : `components/AuthRedirect.tsx` — composant jamais importé
Le composant `AuthRedirect` n'est importé par aucun fichier du projet. La redirection auth est gérée dans le middleware et dans `auth-context.tsx`.

**Recommandation** : Supprimer le fichier.

#### DEAD-5 : Police `Geist_Mono` chargée mais jamais utilisée
**Fichier** : `app/layout.tsx` (lignes 15-18)  
La police `Geist_Mono` est importée et sa variable CSS `--font-geist-mono` est définie, mais **aucun élément du site ne l'utilise**. Cela ajoute ~50-100KB de téléchargement inutile pour l'utilisateur.

**Recommandation** : Supprimer l'import et la variable de `Geist_Mono`.

---

### 🟢 MINEUR

#### DEAD-6 : Commentaire contradictoire dans `page.tsx`
**Fichier** : `app/(site)/page.tsx` (ligne 10)  
Commentaire "Cache ISR de 60 secondes" suivi de "Pas de cache" → commentaire parasite.

#### DEAD-7 : Export `braseros`, `accessoires`, `featuredProduct` dans `content/products.ts`
Ces exports en fin de fichier ne sont utilisés nulle part.

#### DEAD-8 : Variables CSS `--brand-accent`, `--brand-secondary` non utilisées
**Fichier** : `styles/globals.css` (lignes 5-6)  
Les couleurs `#6fbf73` et `#0f6a36` sont définies mais jamais référencées dans le code Tailwind ni dans les styles.

#### DEAD-9 : `data/` dossier — vérifier les fichiers de settings
Le dossier `data/` contient les paramètres du site en JSON. Vérifier qu'il n'y a pas de fichiers temporaires ou de debug.

---

## 🔁 DOUBLONS DANS LE CODE

### 🟡 IMPORTANT

#### DUP-1 : `normalizeSpecs()` dupliquée 4 fois
La même fonction `normalizeSpecs` est définie dans :
1. `lib/utils.ts` (ligne 75) — version typée `Record<string, unknown>`
2. `app/(site)/produits/page.tsx` (ligne 9) — type `any`
3. `app/(site)/produits/[slug]/page.tsx` (ligne 20) — type `any`
4. `app/(site)/favoris/page.tsx` (ligne 43) — type `any`

**Recommandation** : Exporter `normalizeSpecs` depuis `lib/utils.ts` et l'importer partout.

#### DUP-2 : Mapping Supabase → Product dupliqué 3 fois
Le mapping des produits Supabase (snake_case → camelCase) est dupliqué dans :
1. `app/(site)/page.tsx` (lignes 72-99)
2. `app/(site)/produits/page.tsx` (lignes 51-93)
3. `app/(site)/produits/[slug]/page.tsx` (`mapDbProductToProduct`, lignes 32-85)

**Recommandation** : Créer une fonction `mapSupabaseProduct()` dans `lib/utils.ts`.

#### DUP-3 : CSS `.filter-button::after` dupliqué
**Fichier** : `styles/globals.css` (lignes 56-67 et 132-143)  
Le même pseudo-élément `.filter-button::after` est défini **deux fois** avec des styles légèrement différents. La seconde définition écrase la première.

**Recommandation** : Supprimer la première définition (lignes 56-67).

#### DUP-4 : `revalidate = 0` + `dynamic = 'force-dynamic'` redondant
**Fichiers** : `page.tsx`, `produits/page.tsx`, `produits/[slug]/page.tsx`  
`dynamic = 'force-dynamic'` implique déjà pas de cache. `revalidate = 0` est redondant.

**Recommandation** : Garder uniquement `dynamic = 'force-dynamic'`.

---

### 🟢 MINEUR

#### DUP-5 : Informations du magasin dupliquées
Les informations du magasin (nom, email, adresse, téléphone) sont définies dans :
1. `lib/site-settings-defaults.ts`
2. `lib/site.ts` (code mort, voir DEAD-2)
3. `lib/email.ts` (ADMIN_EMAIL)

---

## 📱 RESPONSIVE

### 🟡 IMPORTANT

#### RESP-1 : Textes trop petits sur mobile dans le Header
**Fichier** : `components/Header.tsx`  
Les liens de navigation utilisent `text-[0.65rem]` (10.4px) ce qui est **en dessous du minimum recommandé de 12px** sur mobile. Google peut pénaliser les textes trop petits.

#### RESP-2 : Grille de produits — 2 colonnes sur petit écran peut comprimer les cartes
**Fichier** : `components/CatalogueView.tsx` (ligne 82)  
La grille utilise `grid-cols-2` dès le breakpoint mobile, ce qui peut rendre les cartes produits très étroites sur les écrans < 375px (iPhone SE).

**Recommandation** : Passer à `grid-cols-1 sm:grid-cols-2` pour les très petits écrans.

---

### 🟢 MINEUR

#### RESP-3 : Bouton panier flottant peut masquer du contenu
**Fichier** : `components/FloatingCart.tsx`  
Le bouton flottant en `fixed bottom-6 right-6` peut masquer des boutons d'action sur mobile, surtout sur les pages produit.

---

## ⚡ PERFORMANCE

### 🔴 CRITIQUE

#### PERF-1 : Toutes les pages dynamiques sont `force-dynamic` (revalidate = 0)
Les 3 pages les plus visitées (accueil, catalogue, fiche produit) sont configurées en `force-dynamic`. Chaque visite déclenche une requête Supabase côté serveur → TTFB élevé, mauvais Core Web Vitals.

**Recommandation** : Passer à `revalidate = 60` (ISR 60s) pour un bon compromis.

---

### 🟡 IMPORTANT

#### PERF-2 : Google Translate chargé sur TOUTES les pages
**Fichier** : `app/layout.tsx` (ligne 97)  
Le script Google Translate est chargé dans le `<head>` du layout racine → il est téléchargé sur chaque page, même si peu d'utilisateurs l'utilisent. Ce script est relativement lourd et bloque le rendu.

**Recommandation** : Charger Google Translate à la demande (click sur le sélecteur de langue).

#### PERF-3 : Police `Geist_Mono` chargée inutilement
Voir DEAD-5. Ajoute un poids réseau inutile.

#### PERF-4 : `product-card.css` — 633 lignes de CSS custom
**Fichier** : `styles/product-card.css`  
Ce fichier volumineux utilise du CSS custom alors que le reste du site utilise Tailwind. Il pourrait être migré vers Tailwind pour réduire la taille du bundle CSS et améliorer la cohérence.

---

### 🟢 MINEUR

#### PERF-5 : `framer-motion` importé mais composant `FadeIn` non utilisé
La librairie `framer-motion` (~30KB gzippé) est dans les dépendances et importée dans `FadeIn.tsx`, mais ce composant n'est jamais utilisé. Vérifier si `framer-motion` est utilisé ailleurs.

#### PERF-6 : `content/products.ts` — 2025 lignes de données mortes
Ce fichier est inclus dans le bundle si les 3 fichiers de migration l'importent. Données mortes qui alourdissent potentiellement le build.

---

## 🏗️ ARCHITECTURE

### 🟡 IMPORTANT

#### ARCH-1 : Mélange `<a>` et `<Link>` pour la navigation interne
Le composant `CategoryTile` (page d'accueil) utilise `<a href>` au lieu de `<Link>` pour la navigation interne. Cela provoque un rechargement complet de la page au lieu d'une transition SPA fluide.

**Fichier** : `app/(site)/page.tsx` (ligne 321)

#### ARCH-2 : Typage `any` fréquent pour les données Supabase
Plusieurs fichiers utilisent `(p: any)` pour les produits Supabase au lieu de créer un type dédié `SupabaseProduct`. Cela réduit la sécurité du typage TypeScript.

**Recommandation** : Créer un type `SupabaseProduct` dans `lib/schema.ts` et l'utiliser partout.

#### ARCH-3 : `Price` component — `tone` prop inutile
**Fichier** : `components/Price.tsx`  
Les deux variantes `light` et `dark` ont exactement les mêmes styles (`text-[#2d2d2d]` et `text-slate-600`). Le prop `tone` est inutile.

---

### 🟢 MINEUR

#### ARCH-4 : 4 fichiers de documentation d'audit dans `docs/`
Les fichiers `AUDIT_COMPLETE_2025-01-03.md`, `AUDIT_SECURITY_2026-01-03.md`, `_v2.md`, `_v3.md` sont des audits précédents qui s'accumulent. Considérer un archivage.

---

## ✅ POINTS POSITIFS

Ce qui est **bien fait** dans le projet :

1. ✅ **Middleware de sécurité** bien structuré avec headers HTTP, redirection non-www → www, protection admin
2. ✅ **HSTS** activé en production avec `includeSubDomains` et `preload`
3. ✅ **Protection admin** côté serveur via middleware (pas seulement côté client)
4. ✅ **Rate limiting** implémenté sur les endpoints sensibles (contact, checkout)
5. ✅ **Sanitization XSS** dans le formulaire de contact (`escapeHtml`)
6. ✅ **Validation des entrées** robuste (`lib/validation.ts`) avec regex pour UUID, email, slug
7. ✅ **CORS** correctement configuré dans `lib/validation.ts`
8. ✅ **Robots.txt** bien configuré — bloque admin, API, panier, et les bots IA (GPTBot, ChatGPT, etc.)
9. ✅ **Sitemap dynamique** générée depuis Supabase
10. ✅ **Schema.org** (Organization + Store) correctement implémenté
11. ✅ **Singleton Supabase client** côté client (évite les fuites mémoire)
12. ✅ **Cart et Favorites** avec fallback localStorage pour les utilisateurs non connectés
13. ✅ **Responsive** globalement bien géré avec des breakpoints Tailwind cohérents
14. ✅ **Limites de sécurité** sur le panier (MAX_CART_ITEMS = 50, MAX_QUANTITY = 99)
15. ✅ **Redirection `/contact` → `/info/contact`** pour éviter le contenu dupliqué
16. ✅ **Supabase admin client** avec `persistSession: false` (sécurité)
17. ✅ **Analytics** avec détection des bots et exclusion des admins

---

## 🎯 PLAN D'ACTION PRIORITAIRE

### Phase 1 — Corrections immédiates (1-2h)
- [ ] Supprimer `content/products.ts` et les 3 fichiers de migration (DEAD-1)
- [ ] Supprimer `lib/site.ts` (DEAD-2)
- [ ] Supprimer `components/FadeIn.tsx` (DEAD-3)
- [ ] Supprimer `components/AuthRedirect.tsx` (DEAD-4)
- [ ] Supprimer l'import `Geist_Mono` (DEAD-5)
- [ ] Supprimer le CSS `.filter-button::after` dupliqué (DUP-3)
- [ ] Corriger le commentaire contradictoire ISR (DEAD-6/SEO-2)
- [ ] Remplacer `<a>` par `<Link>` dans `CategoryTile` (ARCH-1)

### Phase 2 — Sécurité (2-3h)
- [ ] Ajouter CSP dans le middleware (SEC-1)
- [ ] Supprimer le fallback email admin en dur (SEC-2)
- [ ] Ajouter vérification des variables d'env au démarrage (SEC-4)

### Phase 3 — Refactoring (2-3h)
- [ ] Extraire `normalizeSpecs()` et `mapSupabaseProduct()` (DUP-1, DUP-2)
- [ ] Renommer `public/acceuil/` → `public/accueil/` (SEO-1)
- [ ] Remplacer `<img>` par `<Image>` dans la page d'accueil (SEO-5)

### Phase 4 — Performance (1-2h)
- [ ] Passer les pages clés en `revalidate = 60` (PERF-1)
- [ ] Charger Google Translate à la demande (PERF-2)
- [ ] Évaluer la suppression de `framer-motion` si non utilisé (PERF-5)

### Phase 5 — SEO (1h)
- [ ] Fusionner ou canonicaliser `/livraison` et `/livraison-france` (SEO-3)
- [ ] Remplacer l'image OG Unsplash par une vraie photo produit (SEO-6)
- [ ] Corriger le nom du produit `brasero-signature-80` (SEO-8)
