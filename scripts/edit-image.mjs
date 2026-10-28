// Edits an existing image with the OpenAI Images edit API: keeps the picture, changes what you describe.
//
//   $env:OPENAI_API_KEY = "sk-..."
//   node scripts/edit-image.mjs src/assets/bondage-cover.jpg "the whip lashes down across the back of the nearest labourer"
//   add --mask scripts/masks/bondage-whip.png to change only the transparent area of the mask (PNG, same size as the image)
//
// The original is copied to your temp folder first (path is printed) so you can restore it. Each edit is billed by OpenAI.
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const argv = process.argv.slice(2);
const maskIndex = argv.indexOf('--mask');
const maskFile = maskIndex >= 0 ? argv.splice(maskIndex, 2)[1] : undefined;
const [file, ...rest] = argv;
const instruction = rest.join(' ').trim();
const apiKey = process.env.OPENAI_API_KEY;
if (!file || !instruction) { console.error('Usage: node scripts/edit-image.mjs <image> "<what to change>"'); process.exit(1); }
if (!apiKey) { console.error('Set OPENAI_API_KEY first, for example in PowerShell:  $env:OPENAI_API_KEY = "sk-..."'); process.exit(1); }

const path = resolve(file);
const backup = join(tmpdir(), `before-${Date.now()}-${basename(path)}`);
copyFileSync(path, backup);
console.log(`Original saved to ${backup}`);

const form = new FormData();
form.append('model', process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1');
form.append('image', new Blob([readFileSync(path)], { type: 'image/jpeg' }), basename(path));
if (maskFile) form.append('mask', new Blob([readFileSync(resolve(maskFile))], { type: 'image/png' }), 'mask.png');
form.append('prompt', `Keep this image exactly as it is: same composition, people, clothing, faces, pyramids, lighting and colours. Change only this: ${instruction}`);
form.append('size', '1536x1024');
form.append('quality', process.env.OPENAI_IMAGE_QUALITY || 'medium');
form.append('output_format', 'jpeg');

process.stdout.write('Editing ... ');
const response = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form });
const body = await response.json();
if (!response.ok) { console.log(`FAILED: ${body.error?.message ?? `HTTP ${response.status}`}`); process.exitCode = 1; }
else if (!body.data?.[0]?.b64_json) { console.log('FAILED: response had no image data'); process.exitCode = 1; }
else { writeFileSync(path, Buffer.from(body.data[0].b64_json, 'base64')); console.log(`saved to ${file}`); }
