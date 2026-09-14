import { readFileSync } from 'node:fs';
const config = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));
const database = config.d1_databases?.find((item) => item.binding === 'DB');
const problems = [];
if (!database?.database_id || database.database_id === '00000000-0000-4000-8000-000000000000') problems.push('Gerçek D1 database_id henüz girilmedi.');
if (!config.r2_buckets?.find((item) => item.binding === 'BUCKET')?.bucket_name) problems.push('R2 bucket adı eksik.');
if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(config.vars?.ACCESS_TEAM_DOMAIN ?? '')) problems.push('Cloudflare Access takım alan adı eksik.');
if (!config.vars?.ACCESS_AUD) problems.push('Cloudflare Access uygulama AUD değeri eksik.');
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('Cloudflare yayın ayarları tamam.');
