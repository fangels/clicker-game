#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const appsDir = join(repoRoot, 'apps');
const siteDir = join(repoRoot, '_site');

const repoName = process.env.REPO_NAME || 'clicker-game';
const exclude = new Set((process.env.EXCLUDE_APPS || '').split(',').map((s) => s.trim()).filter(Boolean));

const apps = readdirSync(appsDir)
  .filter((name) => !exclude.has(name))
  .filter((name) => statSync(join(appsDir, name)).isDirectory());

if (apps.length === 0) {
  console.error('No apps to build. EXCLUDE_APPS=%o', [...exclude]);
  process.exit(1);
}

rmSync(siteDir, { recursive: true, force: true });
mkdirSync(siteDir, { recursive: true });

const games = [];

for (const app of apps) {
  const base = `/${repoName}/${app}/`;
  console.log(`\n=== Building ${app} with base ${base} ===`);
  execSync(`pnpm --filter ${app} build`, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, BASE_PATH: base },
  });

  const dist = join(appsDir, app, 'dist');
  const target = join(siteDir, app);
  cpSync(dist, target, { recursive: true });
  games.push({ id: app, base });
}

const cards = games
  .map(
    ({ id, base }) => `      <li>
        <a href=".${base}">
          <h2>${escapeHtml(id)}</h2>
          <p>Lancer le jeu</p>
        </a>
      </li>`,
  )
  .join('\n');

const indexHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Clicker Game — Catalogue</title>
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        background: radial-gradient(circle at top, #1d1730, #0a0814);
        color: #f5f1ff;
        min-height: 100vh;
      }
      main { max-width: 760px; margin: 0 auto; padding: 4rem 1.5rem; }
      h1 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 0.5rem; }
      p.lead { color: #b9aedb; margin-top: 0; }
      ul { list-style: none; padding: 0; display: grid; gap: 1rem; margin-top: 2.5rem; }
      a {
        display: block;
        padding: 1.5rem 1.75rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(212, 175, 55, 0.25);
        border-radius: 14px;
        color: inherit;
        text-decoration: none;
        transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
      }
      a:hover {
        transform: translateY(-2px);
        border-color: rgba(212, 175, 55, 0.7);
        background: rgba(212, 175, 55, 0.08);
      }
      a h2 { margin: 0 0 0.25rem; font-size: 1.25rem; color: #d4af37; }
      a p { margin: 0; color: #b9aedb; font-size: 0.95rem; }
      footer { margin-top: 3rem; color: #6e6390; font-size: 0.85rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>Clicker Game</h1>
      <p class="lead">Catalogue des jeux cliqueurs narratifs disponibles.</p>
      <ul>
${cards}
      </ul>
      <footer>Hébergé sur GitHub Pages.</footer>
    </main>
  </body>
</html>
`;

writeFileSync(join(siteDir, 'index.html'), indexHtml, 'utf8');
writeFileSync(join(siteDir, '.nojekyll'), '', 'utf8');

console.log(`\nAssembled ${games.length} game(s) into ${siteDir}`);
for (const { id, base } of games) console.log(`  - ${id} -> ${base}`);

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
