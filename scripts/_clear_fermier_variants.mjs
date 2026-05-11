import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of env.split('\n')) { const m = line.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].replace(/^["']|["']$/g, ''); }
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const SLUG = 'le-fermier';

const { data: before, error: e1 } = await sb.from('products').select('slug,variants,configurations').eq('slug', SLUG).single();
if (e1) { console.error(e1); process.exit(1); }

const backupPath = resolve(process.cwd(), `scripts/_backup_${SLUG}_variants.json`);
writeFileSync(backupPath, JSON.stringify({ slug: SLUG, variants: before.variants, configurations: before.configurations, savedAt: new Date().toISOString() }, null, 2));
console.log(`Backup saved → ${backupPath}`);

const { error: e2 } = await sb.from('products').update({ variants: [] }).eq('slug', SLUG);
if (e2) { console.error(e2); process.exit(1); }

const { data: after } = await sb.from('products').select('slug,name,material,diameter,specs,variants').eq('slug', SLUG).single();
console.log('After update:');
console.log('  material:', after.material);
console.log('  diameter:', after.diameter);
console.log('  plancha :', after.specs?.planchaMaterial);
console.log('  variants:', after.variants?.length ?? 0);
