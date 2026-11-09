// Build this capture candidate only; never writes homepage, Share or magazine bundles.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const esbuild = require('esbuild');
const source = readFileSync(new URL('../../sports-live/src/capture.js', import.meta.url), 'utf8');
const output = esbuild.transformSync(source, { minify: true, target: 'es2017', charset: 'utf8', legalComments: 'none' }).code;
writeFileSync(new URL('./capture-candidate.js', import.meta.url), output);
// Preview-only CSS: current Gazette/Broadcast skin plus independently observed
// mobile-header rules. This file is never loaded by the production bootstrap.
const baseline = JSON.parse(readFileSync(new URL('./header-baseline.fixture.json', import.meta.url), 'utf8'));
const base = JSON.parse(readFileSync(new URL('../homepage-story-rhythm-20261021/fixtures/base-styles.json', import.meta.url), 'utf8')).embedData.html.match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
const skin = readFileSync(new URL('../../sports-live/broadcast-home-color.js', import.meta.url), 'utf8');
const context = {};
vm.runInNewContext(skin.slice(skin.indexOf('var R='), skin.indexOf('function css()')), context);
const skinCss = context.C.replace(/@ /g, context.R + ' ').replace(/@\{/g, context.R + '{').replace(/@\)/g, context.R + ')');
writeFileSync(new URL('./current-header-preview.css', import.meta.url), base + '\n' + skinCss + '\n' + baseline.stylesInObservedDomOrder.map(style => style.relevantCSS).join('\n'));
console.log(JSON.stringify({ bytes: Buffer.byteLength(output), sha256: createHash('sha256').update(output).digest('hex') }));
