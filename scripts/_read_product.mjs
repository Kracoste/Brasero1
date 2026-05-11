import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of env.split('\n')) { const m = line.match(/^([^#=]+)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].replace(/^["']|["']$/g, ''); }
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data, error } = await sb.from('products').select('slug,name,material,diameter,variants,configurations,specs').eq('slug', process.argv[2]).single();
if (error) { console.error(error); process.exit(1); }
console.log('slug:', data.slug);
console.log('name:', data.name);
console.log('material:', data.material);
console.log('diameter:', data.diameter);
console.log('specs.planchaMaterial:', data.specs?.planchaMaterial);
console.log('variants:', JSON.stringify(data.variants, null, 2));
console.log('configurations keys:', data.configurations ? Object.keys(data.configurations) : null);
console.log('configurations:', JSON.stringify(data.configurations, null, 2));
