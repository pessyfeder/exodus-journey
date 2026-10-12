// Generates one image per plague with the OpenAI Images API and saves it to src/assets/plagues/<slug>.jpg.
//
//   $env:OPENAI_API_KEY = "sk-..."          (PowerShell; keep the key out of files and chat)
//   node scripts/generate-plague-images.mjs --dry-run      list what would be generated, no cost
//   node scripts/generate-plague-images.mjs frogs          generate one plague (test first)
//   node scripts/generate-plague-images.mjs                generate every plague that has no file yet
//   node scripts/generate-plague-images.mjs frogs --force  regenerate even if the file exists
//
// Each image is billed by OpenAI. Optional env vars: OPENAI_IMAGE_MODEL (default gpt-image-1),
// OPENAI_IMAGE_QUALITY (low | medium | high | auto, default medium).
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { covers, plagues, style } from './plague-prompts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'plagues');
const items = [...plagues, ...covers].map(item => ({ ...item, path: item.file ? join(root, item.file) : join(outDir, `${item.slug}.jpg`) }));
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const slugs = args.filter(arg => !arg.startsWith('--'));

const unknown = slugs.filter(slug => !items.some(item => item.slug === slug));
if (unknown.length) {
  console.error(`Unknown plague: ${unknown.join(', ')}\nValid: ${items.map(item => item.slug).join(', ')}`);
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey && !dryRun) {
  console.error('Set OPENAI_API_KEY first, for example in PowerShell:  $env:OPENAI_API_KEY = "sk-..."');
  process.exit(1);
}

const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const quality = process.env.OPENAI_IMAGE_QUALITY || 'medium';
mkdirSync(outDir, { recursive: true });

const todo = items.filter(plague => (slugs.length === 0 ? !plague.file : slugs.includes(plague.slug)) && (force || !existsSync(plague.path)));
console.log(`${todo.length} image(s) to generate with ${model} (${quality} quality): ${todo.map(plague => plague.slug).join(', ') || 'none'}`);
if (dryRun || todo.length === 0) { process.exitCode = 0; } else {

let failed = 0;
for (const plague of todo) {
  process.stdout.write(`${plague.slug} ... `);
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, prompt: `${plague.style ?? style} ${plague.prompt}`, size: '1536x1024', quality, n: 1, output_format: 'jpeg' }),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error?.message ?? `HTTP ${response.status}`);
    const data = body.data?.[0]?.b64_json;
    if (!data) throw new Error('response had no image data');
    writeFileSync(plague.path, Buffer.from(data, 'base64'));
    console.log('saved');
  } catch (error) {
    failed++;
    console.log(`FAILED: ${error.message}`);
  }
}
console.log(failed ? `Done with ${failed} failure(s); rerun to retry only the missing ones.` : 'Done. Review each image on its /plagues/<slug> page before committing.');
process.exitCode = failed ? 1 : 0;
}
