/**
 * Repositionnement anti-cannibalisme des 2 articles "hiver".
 * - preparer-brasero-hiver-hivernage : recentrage hivernage passif (ranger/protéger)
 * - brasero-hiver-cuisiner-chauffer-dehors : recentrage usage actif (utiliser)
 * Ajoute aussi le maillage croisé de désambiguïsation.
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

// ─── Article #21 : hivernage passif ────────────────────────────────
const hivernageDisambig = `> **Vous cherchez plutôt à *utiliser* votre brasero en hiver, pas à le ranger ?** → [Lire : Utiliser son brasero en hiver — cuisiner et chauffer la terrasse](/blog/brasero-hiver-cuisiner-chauffer-dehors)\n\n`;

const { data: hiv, error: e1 } = await supabase
  .from('blog_posts')
  .select('content')
  .eq('slug', 'preparer-brasero-hiver-hivernage')
  .single();
if (e1) { console.error(e1); process.exit(1); }

let hivContent = hiv.content;
if (!hivContent.includes('brasero-hiver-cuisiner-chauffer-dehors')) {
  // Insère le bloc de désambiguïsation juste après le premier H2
  const firstH2Match = hivContent.match(/^## .+$/m);
  if (firstH2Match) {
    const idx = hivContent.indexOf(firstH2Match[0]);
    hivContent = hivContent.slice(0, idx) + hivernageDisambig + hivContent.slice(idx);
  }
}

const { error: u1 } = await supabase
  .from('blog_posts')
  .update({
    title: "Hivernage du brasero : comment le ranger et le protéger pendant l'hiver",
    meta_title: "Hivernage brasero : ranger et protéger (guide complet)",
    meta_description: "Comment hiverner votre brasero : nettoyage de fin de saison, protection de la plancha, housse, remise en route au printemps. Le protocole complet pour le ranger sereinement.",
    excerpt: "Votre brasero peut rester dehors tout l'hiver, à condition de le préparer. Nettoyage, protection de la plancha, housse, socle corten ou peint : le protocole d'hivernage complet et les gestes à connaître.",
    content: hivContent,
    related_articles: ['brasero-hiver-cuisiner-chauffer-dehors', 'meilleur-bois-brasero-comparatif', 'comment-culotter-plancha-acier-carbone'],
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'preparer-brasero-hiver-hivernage');
if (u1) { console.error('Update #21 failed:', u1); process.exit(1); }
console.log('✓ #21 preparer-brasero-hiver-hivernage repositionné');

// ─── Article #22 : usage actif hivernal ────────────────────────────
const usageDisambig = `\n\n> **Vous voulez plutôt *ranger* votre brasero pour la saison froide ?** → [Lire : Hivernage du brasero — comment le ranger et le protéger](/blog/preparer-brasero-hiver-hivernage)\n`;

const { data: usg, error: e2 } = await supabase
  .from('blog_posts')
  .select('content')
  .eq('slug', 'brasero-hiver-cuisiner-chauffer-dehors')
  .single();
if (e2) { console.error(e2); process.exit(1); }

let usgContent = usg.content;
if (!usgContent.includes('preparer-brasero-hiver-hivernage')) {
  // Insère après le premier paragraphe d'intro (avant le premier H2)
  const firstH2Idx = usgContent.search(/^## /m);
  if (firstH2Idx > 0) {
    usgContent = usgContent.slice(0, firstH2Idx) + usageDisambig + '\n' + usgContent.slice(firstH2Idx);
  }
}

const { error: u2 } = await supabase
  .from('blog_posts')
  .update({
    title: "Utiliser son brasero en hiver : cuisiner et chauffer la terrasse au cœur du froid",
    meta_title: "Utiliser son brasero en hiver : cuissons & chauffage extérieur",
    meta_description: "Pourquoi ne pas ranger son brasero en octobre : guide complet pour s'en servir activement l'hiver — allumage par grand froid, cuissons hivernales, confort des invités, chaleur rayonnante. 365 jours d'usage.",
    excerpt: "L'erreur de 90 % des propriétaires de brasero : le ranger dès octobre. La vraie magie d'un brasero, beaucoup la ratent : sa puissance en hiver. Guide complet pour 365 jours d'usage.",
    content: usgContent,
    related_articles: ['preparer-brasero-hiver-hivernage', 'meilleur-bois-brasero-comparatif', 'distance-securite-brasero-reglementation'],
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'brasero-hiver-cuisiner-chauffer-dehors');
if (u2) { console.error('Update #22 failed:', u2); process.exit(1); }
console.log('✓ #22 brasero-hiver-cuisiner-chauffer-dehors repositionné');

console.log('\n✅ Repositionnement anti-cannibalisme terminé.');
