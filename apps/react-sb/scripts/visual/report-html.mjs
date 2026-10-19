// HTML of visual/report.html: before / after / diff of every changed story,
// with checkboxes that build the `test:visual:accept` command.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { visualDir } from "./paths.mjs";

const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const stamp = Date.now(); // the browser would cache the previous images

const figure = (caption, src, style = "") =>
  `<figure><figcaption>${caption}</figcaption><a href="${src}" target="_blank"><img src="${src}?t=${stamp}" style="${style}" alt="${caption}" loading="lazy"></a></figure>`;

/** Width and height of a PNG, read from its IHDR chunk. */
function pngSize(path) {
  try {
    const header = readFileSync(path).subarray(16, 24);
    return { width: header.readUInt32BE(0), height: header.readUInt32BE(4) };
  } catch {
    return undefined;
  }
}

/**
 * `object-view-box` cropping an image to the story's area (the screenshots
 * are the whole body, mostly empty). Browsers without it show it whole.
 */
function cropStyle(box, path) {
  const size = pngSize(path);
  if (!box || !size) return "";
  const x = Math.min(box.x, size.width - 1);
  const y = Math.min(box.y, size.height - 1);
  const right = Math.max(0, size.width - x - box.width);
  const bottom = Math.max(0, size.height - y - box.height);
  return `object-view-box: inset(${y}px ${right}px ${bottom}px ${x}px)`;
}

/** One image, cropped, switched between before / after / diff. */
function viewer(v, box) {
  const views = [
    ["Avant", `baseline/${v.file}.png`],
    ["Après", `diff/${v.file}-actual.png`],
    ...(v.hasDiff ? [["Différence", `diff/${v.file}-diff.png`]] : []),
  ].map(([label, src]) => ({
    label,
    src: `${src}?t=${stamp}`,
    style: cropStyle(box, join(visualDir, src)),
  }));
  const shown = views.at(-1);
  return `<div class="viewer">
<div class="tabs"><span>${v.label}</span>${views
    .map(
      (view) =>
        `<button type="button" data-src="${view.src}" data-style="${view.style}"${view === shown ? ' aria-pressed="true"' : ""}>${view.label}</button>`,
    )
    .join(
      "",
    )}<a class="full" href="${shown.src}" target="_blank">Image entière</a>${v.hasDiff ? "" : '<span class="hint">taille différente : pas d\'image de différence</span>'}</div>
<img src="${shown.src}" style="${shown.style}" alt="${shown.label}">
</div>`;
}

function changedCard({ storyId, name, file, box, changedVariants }) {
  const variants = changedVariants.map((v) => viewer(v, box)).join("\n");
  return `<article>
<label class="head"><input type="checkbox" value="${escape(storyId)}"> <strong>${escape(name)}</strong></label>
<p class="meta"><code>${escape(storyId)}</code> · ${escape(file)}</p>
${variants}
</article>`;
}

function createdCard({ storyId, name, file, box, variants }) {
  const src = (v) => `baseline/${v.file}.png`;
  return `<article>
<p class="head"><strong>${escape(name)}</strong></p>
<p class="meta"><code>${escape(storyId)}</code> · ${escape(file)}</p>
<div class="row">${variants.map((v) => figure(v.label, src(v), cropStyle(box, join(visualDir, src(v))))).join("")}</div>
</article>`;
}

function messageCard({ storyId, name, file, message }) {
  return `<article>
<p class="head"><strong>${escape(name)}</strong></p>
<p class="meta"><code>${escape(storyId ?? "")}</code> · ${escape(file)}</p>
<pre>${escape(message)}</pre>
</article>`;
}

function section(title, hint, list, card) {
  if (!list.length) return "";
  return `<section><h2>${title} (${list.length})</h2><p class="hint">${hint}</p>${list.map(card).join("\n")}</section>`;
}

export function renderReport({ changed, created, unstable, errors }) {
  const empty =
    !changed.length && !created.length && !unstable.length && !errors.length;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rendu visuel</title>
<style>
:root { --bg: #fafafa; --fg: #18181b; --muted: #71717a; --card: #fff; --line: #e4e4e7; --accent: #2563eb; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --bg: #09090b; --fg: #fafafa; --muted: #a1a1aa; --card: #18181b; --line: #27272a; --accent: #60a5fa; color-scheme: dark; } }
body { margin: 0; padding: 24px 16px 120px; background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, sans-serif; }
main { max-width: 1400px; margin: 0 auto; }
h1 { margin: 0 0 4px; } h2 { margin: 32px 0 4px; } h3 { margin: 12px 0 6px; font-size: 14px; color: var(--muted); }
.hint, .meta { color: var(--muted); margin: 0 0 12px; } .meta { font-size: 13px; }
article { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 16px; margin: 12px 0; }
.head { display: flex; gap: 8px; align-items: center; margin: 0; cursor: pointer; }
.row { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
figure { margin: 0; } figcaption { font-size: 13px; color: var(--muted); margin-bottom: 4px; }
img { display: block; max-width: 100%; height: auto; border: 1px solid var(--line); background: repeating-conic-gradient(#8882 0 25%, transparent 0 50%) 0 0 / 16px 16px; }
.viewer { margin-top: 12px; }
.tabs { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-bottom: 6px; }
.tabs > span:first-child { font-size: 14px; color: var(--muted); margin-right: 6px; }
.tabs button { padding: 4px 10px; font-size: 13px; }
.tabs button[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); }
.tabs .full { font-size: 13px; color: var(--accent); margin-left: 6px; }
pre { white-space: pre-wrap; font-size: 12px; overflow-x: auto; }
.bar { position: fixed; inset: auto 0 0 0; background: var(--card); border-top: 1px solid var(--line); padding: 12px 16px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.bar code { flex: 1 1 300px; overflow-x: auto; white-space: nowrap; padding: 8px; border: 1px solid var(--line); border-radius: 6px; }
button { font: inherit; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--line); background: var(--bg); color: var(--fg); cursor: pointer; }
</style>
</head>
<body>
<main>
<h1>Rendu visuel</h1>
<p class="hint">Généré le ${new Date().toLocaleString("fr-FR")} par <code>pnpm --filter react-sb test:visual</code>.</p>
${empty ? "<p>Aucun changement de rendu.</p>" : ""}
${section("Rendu modifié", "Compare Avant / Après (la différence est en rouge), coche les changements acceptables, puis lance la commande en bas de page : ces captures deviennent les nouvelles références. Les autres restent en échec jusqu'à correction.", changed, changedCard)}
${section("Nouvelles références", "Stories sans référence : leur capture vient d'être enregistrée. Vérifie-la, elle servira de base aux prochaines comparaisons.", created, createdCard)}
${section("Capture instable", "Le rendu ne s'est pas stabilisé (animation JS, contenu aléatoire…). Corriger la story, ou l'exclure avec <code>parameters: { visual: { disable: true } }</code>.", unstable, messageCard)}
${section("Autres erreurs", "La story a échoué avant ou pendant la capture.", errors, messageCard)}
</main>
${
  changed.length
    ? `<div class="bar">
<button type="button" id="all">Tout cocher</button>
<code id="cmd"></code>
<button type="button" id="copy">Copier</button>
</div>
<script>
const boxes = [...document.querySelectorAll("input[type=checkbox]")];
const cmd = document.getElementById("cmd");
const update = () => {
  const ids = boxes.filter((b) => b.checked).map((b) => b.value);
  cmd.textContent = ids.length ? "pnpm --filter react-sb test:visual:accept " + ids.join(" ") : "Coche les changements à accepter";
};
boxes.forEach((b) => b.addEventListener("change", update));
document.getElementById("all").addEventListener("click", () => { const on = boxes.some((b) => !b.checked); boxes.forEach((b) => (b.checked = on)); update(); });
document.getElementById("copy").addEventListener("click", () => navigator.clipboard.writeText(cmd.textContent));
document.querySelectorAll(".viewer").forEach((viewer) => {
  const img = viewer.querySelector("img");
  const full = viewer.querySelector(".full");
  const tabs = viewer.querySelectorAll("button");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    img.src = tab.dataset.src;
    img.style.cssText = tab.dataset.style;
    img.alt = tab.textContent;
    full.href = tab.dataset.src;
    tabs.forEach((t) => t.setAttribute("aria-pressed", String(t === tab)));
  }));
});
update();
</script>`
    : ""
}
</body>
</html>
`;
}
