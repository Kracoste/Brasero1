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

const slugs = [
  'le-fermier',
  'brasero-acier-100-l-obelix',
  'brasero-en-acier-80-lemorris',
  'brasero-coffy-80',
  'brasero-coffy-50',
  'brasero-morris-100',
  'brasero-obelix-50',
  'fendeur-a-buches',
];

for (const slug of slugs) {
  const { data, error } = await supabase
    .from('products')
    .select('slug, name')
    .eq('slug', slug)
    .maybeSingle();
  if (error) console.log(`✗ ${slug}: ${error.message}`);
  else if (!data) console.log(`✗ ${slug}: NOT FOUND`);
  else console.log(`✓ ${slug.padEnd(35)} → "${data.name}"`);
}
