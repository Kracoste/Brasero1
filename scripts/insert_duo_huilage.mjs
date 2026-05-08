/**
 * Insertion du bloc duo huilage plancha sur l'article hivernage.
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

const { data, error: err1 } = await supabase
  .from('blog_posts').select('content').eq('slug', 'preparer-brasero-hiver-hivernage').single();
if (err1) throw err1;
let content = data.content;

const oldHuile = `### Plancha en acier carbone

L'acier carbone **rouille** s'il reste exposé à l'humidité sans protection. C'est inévitable, ça fait partie du matériau. Le geste à faire :`;

const newHuile = `[duo image="/blog/preparer-brasero-hiver-hivernage_prompt_2.webp" pos="right" alt="Mains qui appliquent une couche d'huile végétale sur une plancha de brasero en acier carbone tiède avant l'hivernage"]
**Le geste qui sauve une saison**

Cinq minutes d'huilage de la plancha en acier carbone avant l'hiver, c'est ce qui distingue une plancha impeccable au printemps d'une plancha à reculotter complètement. C'est aussi le geste le plus rentable à acquérir pour tout propriétaire de brasero.
[/duo]

### Plancha en acier carbone

L'acier carbone **rouille** s'il reste exposé à l'humidité sans protection. C'est inévitable, ça fait partie du matériau. Le geste à faire :`;

const idx = content.indexOf(oldHuile);
if (idx === -1) {
  console.error('Marqueur introuvable');
  process.exit(1);
}
content = content.slice(0, idx) + newHuile + content.slice(idx + oldHuile.length);

const { error: err2 } = await supabase
  .from('blog_posts')
  .update({ content, updated_at: new Date().toISOString() })
  .eq('slug', 'preparer-brasero-hiver-hivernage');
if (err2) throw err2;

console.log('✓ preparer-brasero-hiver-hivernage : bloc [duo] huilage inséré');
