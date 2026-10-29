// Saves the latest weekly npm downloads for docs/npm-stats so the page opens
// with recent numbers even when npm is slow to answer the browser.
// Uses the package list from docs/npm-stats/app.js and the same weekly method.
import { readFileSync, writeFileSync } from "node:fs";

const DIR = "docs/npm-stats";
const src = readFileSync(`${DIR}/app.js`, "utf8");
const PACKAGES = JSON.parse(src.match(/const PACKAGES = (\[[\s\S]*?\]);/)[1]);
const API = "https://api.npmjs.org/downloads/range/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return iso(d); };

async function getJson(url) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    if (r.status !== 429 && r.status < 500) throw new Error(`${r.status} for ${url}`);
    await sleep(3000 * (attempt + 1));
  }
  throw new Error(`npm kept refusing ${url}`);
}

const end = addDays(iso(new Date()), -1);
const start = addDays(end, -83);
const names = PACKAGES.map((p) => p[1]);
const unscoped = names.filter((p) => !p.startsWith("@"));
const scoped = names.filter((p) => p.startsWith("@"));
const raw = {};
const bulk = await getJson(`${API}${start}:${end}/${unscoped.join(",")}`);
for (const p of unscoped) raw[p] = bulk[p] ? bulk[p].downloads : [];
for (const p of scoped) { await sleep(700); raw[p] = (await getJson(`${API}${start}:${end}/${p}`)).downloads || []; }

const daily = {};
for (const p in raw) { daily[p] = {}; for (const x of raw[p]) daily[p][x.day] = x.downloads; }
const days = [];
for (let s = start; s <= end; s = addDays(s, 1)) days.push(s);
const ref = daily["lucide-react"] || {};
const latestDay = days.filter((d) => ref[d]).pop() || end;
const packages = PACKAGES.map(([library, pkg, primary]) => {
  const m = daily[pkg] || {};
  const weekly = [];
  for (let w = 0; w < 12; w++) { let sum = 0; for (let k = 0; k < 7; k++) sum += m[days[w * 7 + k]] || 0; weekly.push(sum); }
  return { library, package: pkg, primary: !!primary, lastWeek: weekly[11], weekly, lastDay: m[latestDay] || 0 };
}).sort((a, b) => b.lastWeek - a.lastWeek);

const data = { fetchedAt: new Date().toISOString(), period: { start: days[77], end }, weeksStart: start, latestDay, gapDays: days.filter((d) => !ref[d]), packages };
writeFileSync(`${DIR}/data.json`, JSON.stringify(data) + "\n");
console.log(`Saved week ${data.period.start}..${end}; Hugeicons ${packages.find((p) => p.package === "@hugeicons/react").lastWeek}`);
