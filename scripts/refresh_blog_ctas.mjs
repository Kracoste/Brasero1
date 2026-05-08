/**
 * Refonte SEO de tous les CTA du blog :
 * - cta_text raccourcis (3-5 mots, anchor text naturel)
 * - cta_product_slug renseigné partout (sinon la carte ne s'affiche pas)
 * - Cohérence texte/slug (fix discordance Fermier/Obélix sur l'article corten)
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].replace(/^["']|["']$/g, '');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Format : { slug: [cta_product_slug, cta_text] }
// Règles : cta_text ≤ 35 caractères, anchor text naturel, pas de keyword stuffing.
const updates = {
  'amenager-coin-brasero-jardin':                       ['brasero-acier-100-l-obelix',  'Voir nos braseros'],
  'brasero-corten-avantages-inconvenients':             ['le-fermier',                  'Découvrir Le Fermier'],
  'brasero-corten-bord-mer-air-salin':                  ['le-fermier',                  'Découvrir Le Fermier'],
  'brasero-corten-taches-terrasse-solutions':           ['brasero-acier-100-l-obelix',  'Découvrir L\'Obélix'],
  'brasero-evenement-mariage-reception':                ['brasero-morris-100',          'Découvrir Le Morris'],
  'brasero-hiver-cuisiner-chauffer-dehors':             ['brasero-en-acier-80-lemorris','Découvrir Le Morris'],
  'brasero-plancha-vs-barbecue':                        ['brasero-acier-100-l-obelix',  'Voir nos braseros plancha'],
  'brasero-terrasse-bois-securite':                     ['brasero-acier-100-l-obelix',  'Découvrir L\'Obélix'],
  'brasero-vs-plancha-electrique':                      ['brasero-coffy-80',            'Découvrir Le Coffy'],
  'choisir-brasero-restaurateur-professionnel':         ['brasero-en-acier-80-lemorris','Découvrir Le Morris'],
  'comment-culotter-plancha-acier-carbone':             ['brasero-acier-100-l-obelix',  'Découvrir L\'Obélix'],
  'cuisson-feu-bois-gout-fume-plancha':                 ['brasero-en-acier-80-lemorris','Découvrir Le Morris'],
  'distance-securite-brasero-reglementation':           ['brasero-acier-100-l-obelix',  'Voir nos braseros'],
  'entretien-plancha-inox-brasero':                     ['brasero-coffy-80',            'Découvrir Le Coffy'],
  'guide-ultime-brasero-plancha':                       ['brasero-obelix-50',           'Voir nos braseros'],
  'legumes-poissons-brasero-plancha-cuissons-delicates':['brasero-en-acier-80-lemorris','Découvrir Le Morris'],
  'meilleur-bois-brasero-comparatif':                   ['fendeur-a-buches',            'Voir le fendeur à bûches'],
  'plancha-inox-ou-acier-carbone':                      ['brasero-acier-100-l-obelix',  'Découvrir L\'Obélix'],
  'pourquoi-brasero-artisanal-francais':                ['le-fermier',                  'Découvrir Le Fermier'],
  'premier-brasero-guide-debutant':                     ['brasero-coffy-50',            'Découvrir Le Coffy'],
  'premier-feu-rodage-brasero':                         ['brasero-coffy-80',            'Découvrir Le Coffy'],
  'preparer-brasero-hiver-hivernage':                   ['brasero-acier-100-l-obelix',  'Voir nos braseros'],
  'prix-brasero-artisanal-decryptage':                  ['brasero-coffy-80',            'Découvrir Le Coffy'],
  'quel-brasero-choisir-nombre-convives':               ['brasero-acier-100-l-obelix',  'Découvrir L\'Obélix'],
  'recettes-viandes-rouges-brasero-plancha':            ['le-fermier',                  'Découvrir Le Fermier'],
  'temperature-cuisson-brasero-plancha':                ['brasero-acier-100-l-obelix',  'Voir nos braseros plancha'],
};

let ok = 0;
let fail = 0;
for (const [slug, [productSlug, text]] of Object.entries(updates)) {
  const { error } = await supabase
    .from('blog_posts')
    .update({
      cta_product_slug: productSlug,
      cta_text: text,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug);
  if (error) {
    console.error(`✗ ${slug} : ${error.message}`);
    fail++;
  } else {
    console.log(`✓ ${slug.padEnd(55)} → ${productSlug.padEnd(30)} | "${text}"`);
    ok++;
  }
}

console.log(`\n${ok} OK, ${fail} échecs sur ${ok + fail} articles.`);
