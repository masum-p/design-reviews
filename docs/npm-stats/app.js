(function () {
  const HIGHLIGHT = "Hugeicons";
  const REF_PKG = "lucide-react";
  const API = "https://api.npmjs.org/downloads/range/";
  const PACKAGES = [
    ["Lucide","lucide-react",1],["React Icons","react-icons",1],["Material Icons (MUI)","@mui/icons-material",1],
    ["Radix Icons","@radix-ui/react-icons",1],["Phosphor","@phosphor-icons/react",1],["Ant Design Icons","@ant-design/icons",1],
    ["Heroicons","@heroicons/react",1],["Tabler Icons","@tabler/icons-react",1],["Font Awesome","@fortawesome/free-solid-svg-icons",0],
    ["Font Awesome","@fortawesome/react-fontawesome",1],["Hugeicons","@hugeicons/react",1],["Hugeicons","@hugeicons/core-free-icons",0],
    ["Iconify","@iconify/react",1],["Remix Icon","@remixicon/react",1],["Fluent UI","@fluentui/react-icons",1],
    ["Untitled UI","@untitledui/icons",1],["Feather","react-feather",1],["Carbon","@carbon/icons-react",1],
    ["Central Icons","@central-icons-react/round-outlined-radius-2-stroke-1.5",1],["Material Design Icons","@mdi/react",1],
    ["React Icons","@react-icons/all-files",0],["Iconoir","iconoir-react",1],["Octicons","@primer/octicons-react",1],
    ["Phosphor","phosphor-react",0],["Bootstrap Icons","react-bootstrap-icons",1],["Myna UI","@mynaui/icons-react",1],
    ["Hugeicons","hugeicons-react",0],["Solar","@solar-icons/react",1],["Unicons","@iconscout/react-unicons",1],
    ["IconPark","@icon-park/react",1],["Geist","@geist-ui/icons",1],["Boxicons","@boxicons/react",1],
    ["Akar Icons","akar-icons",1],["Ionicons","react-ionicons",1],["Lineicons","@lineiconshq/react-lineicons",1],
    ["Lineicons","lineicons-react",0],["Eva Icons","react-eva-icons",1]
  ];
  const CACHE_KEY = "npmIconStats.v1";
  const state = { sort: "lastWeek", data: null };
  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.NumberFormat("en-US");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const iso = (d) => d.toISOString().slice(0, 10);
  const addDays = (s, n) => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
  const fdate = (s) => new Date(s + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function change(p) {
    const prev = p.weekly[p.weekly.length - 2];
    return prev ? (p.lastWeek - prev) / prev : null;
  }

  function spark(values) {
    const w = 96, h = 26, pad = 3;
    const max = Math.max(...values, 1), min = Math.min(...values);
    const span = max - min || 1;
    const pts = values.map((v, i) => [
      pad + (i * (w - 2 * pad)) / (values.length - 1),
      h - pad - ((v - min) / span) * (h - 2 * pad),
    ]);
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join("");
    const area = line + `L${pts[pts.length - 1][0].toFixed(1)} ${h}L${pts[0][0].toFixed(1)} ${h}Z`;
    const last = pts[pts.length - 1];
    return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path class="area" d="${area}"/><path class="line" d="${line}"/><circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.2"/></svg>`;
  }

  const compact = (n) => n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n);

  // Top stats strip: Hugeicons across all its npm packages, plus where it ranks.
  function renderKpis(d) {
    const mine = d.packages.filter((p) => p.library === HIGHLIGHT).sort((a, b) => b.lastWeek - a.lastWeek);
    const n = mine.length ? mine[0].weekly.length : 0;
    const total = mine.reduce((s, p) => s + p.lastWeek, 0);
    const prev = mine.reduce((s, p) => s + (p.weekly[n - 2] || 0), 0);
    $("k-total").textContent = fmt.format(total);
    $("k-split").textContent = mine.map((p) => `${p.package} ${compact(p.lastWeek)}`).join(" · ");
    const kc = $("k-change");
    if (prev) {
      const c = (total - prev) / prev;
      kc.textContent = (c >= 0 ? "+" : "") + (c * 100).toFixed(1) + "%";
      kc.className = "kpi-value " + (c >= 0 ? "up" : "down");
      $("k-prev").textContent = `${c >= 0 ? "+" : "−"}${fmt.format(Math.abs(total - prev))} from ${fmt.format(prev)}`;
    } else { kc.textContent = "–"; kc.className = "kpi-value"; $("k-prev").textContent = " "; }
    const primaries = d.packages.filter((p) => p.primary).sort((a, b) => b.lastWeek - a.lastWeek);
    const idx = primaries.findIndex((p) => p.library === HIGHLIGHT);
    const all = primaries.reduce((s, p) => s + p.lastWeek, 0) || 1;
    if (idx >= 0) {
      const me = primaries[idx];
      $("k-rank").textContent = `#${idx + 1}`;
      $("k-rank-sub").textContent = idx > 0
        ? `of ${primaries.length} · ${compact(primaries[idx - 1].lastWeek - me.lastWeek)} behind ${primaries[idx - 1].library}`
        : `of ${primaries.length} libraries`;
      $("k-share").textContent = ((me.lastWeek / all) * 100).toFixed(1) + "%";
      $("k-share-sub").textContent = `${me.package} of ${compact(all)} total`;
    }
  }

  function render() {
    const d = state.data;
    if (!d) return;
    renderKpis(d);
    let list = d.packages.filter((p) => p.primary);
    list = list.slice().sort((a, b) => state.sort === "change"
      ? (change(b) ?? -Infinity) - (change(a) ?? -Infinity)
      : b.lastWeek - a.lastWeek);
    const total = list.reduce((s, p) => s + p.lastWeek, 0) || 1;
    const max = Math.max(...list.map((p) => p.lastWeek), 1);
    $("rows").innerHTML = list.map((p, i) => {
      const c = change(p);
      const cls = c == null ? "" : c >= 0 ? "up" : "down";
      const ctext = c == null ? "–" : (c >= 0 ? "+" : "") + (c * 100).toFixed(1) + "%";
      return `<tr class="${p.library === HIGHLIGHT ? "hl" : ""}">
        <td class="rank">${i + 1}</td>
        <td class="libcell"><span class="lib">${esc(p.library)}</span>
          <a class="pkg" href="https://www.npmjs.com/package/${esc(p.package)}" target="_blank" rel="noopener" title="${esc(p.package)}">${esc(p.package)}</a></td>
        <td class="barcell"><div class="track"><div class="bar" style="width:${((p.lastWeek / max) * 100).toFixed(2)}%"></div></div></td>
        <td class="num dl">${fmt.format(p.lastWeek)}</td>
        <td class="num chg ${cls}">${ctext}</td>
        <td class="num share">${((p.lastWeek / total) * 100).toFixed(1)}%</td>
        <td>${spark(p.weekly)}</td>
      </tr>`;
    }).join("");
    document.querySelectorAll("th button[data-sort]").forEach((b) => {
      if (b.dataset.sort === state.sort) b.setAttribute("aria-sort", "descending"); else b.removeAttribute("aria-sort");
    });
  }

  document.querySelectorAll("th button[data-sort]").forEach((b) =>
    b.addEventListener("click", () => { state.sort = b.dataset.sort; render(); }));

  function load(d) {
    state.data = d;
    const at = new Date(d.fetchedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    $("meta").textContent = `Last updated ${at}`;
    render();
  }

  // Plain 7-day sums ending yesterday (UTC): the same window and method npmjs.com uses.
  function build(daily, start, end) {
    const days = [];
    for (let s = start; s <= end; s = addDays(s, 1)) days.push(s);
    const ref = daily[REF_PKG] || {};
    const gapDays = days.filter((d) => !ref[d]);
    const packages = PACKAGES.map(([library, pkg, primary]) => {
      const m = daily[pkg] || {};
      const weekly = [];
      for (let w = 0; w < 12; w++) {
        let sum = 0;
        for (let k = 0; k < 7; k++) sum += m[days[w * 7 + k]] || 0;
        weekly.push(sum);
      }
      return { library, package: pkg, primary: !!primary, lastWeek: weekly[11], weekly };
    }).sort((a, b) => b.lastWeek - a.lastWeek);
    return { fetchedAt: new Date().toISOString(), period: { start: days[77], end }, weeksStart: start, gapDays, packages };
  }

  // npm's rate-limit reply has no CORS header, so the browser reports it as a
  // network error rather than a 429. Treat both as "wait and try again".
  async function getJson(url) {
    for (let attempt = 0; attempt < 6; attempt++) {
      let r = null;
      try { r = await fetch(url); } catch (e) { r = null; }
      if (r && r.ok) return r.json();
      if (r && r.status !== 429 && r.status < 500) throw new Error(`npm answered ${r.status}`);
      await sleep(2500 * (attempt + 1));
    }
    throw new Error("npm is busy");
  }

  function setStatus(msg, err) { const s = $("status"); s.textContent = msg; s.classList.toggle("err", !!err); }

  let busy = false, liveLoaded = false;
  async function refresh() {
    if (busy) return;
    busy = true;
    const btn = $("refresh");
    btn.disabled = true;
    try {
      const end = addDays(iso(new Date()), -1), start = addDays(end, -83);
      const names = PACKAGES.map((p) => p[1]);
      const unscoped = names.filter((p) => !p.startsWith("@"));
      const scoped = names.filter((p) => p.startsWith("@"));
      const raw = {};
      setStatus("Loading from npm…");
      const bulk = await getJson(`${API}${start}:${end}/${unscoped.join(",")}`);
      for (const p of unscoped) raw[p] = bulk[p] ? bulk[p].downloads : [];
      for (let i = 0; i < scoped.length; i++) {
        await sleep(700);
        raw[scoped[i]] = (await getJson(`${API}${start}:${end}/${scoped[i]}`)).downloads || [];
        setStatus(`Loading from npm… ${i + 1} of ${scoped.length}`);
      }
      const daily = {};
      for (const p in raw) { daily[p] = {}; for (const x of raw[p]) daily[p][x.day] = x.downloads; }
      const data = build(daily, start, end);
      liveLoaded = true;
      load(data);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
      setStatus("Up to date with npm.");
    } catch (e) {
      setStatus(state.data
        ? `npm is busy right now, so these are the last saved numbers. Try Reload in a minute.`
        : `npm is busy right now. Try Reload in a minute.`, true);
    } finally {
      busy = false;
      btn.disabled = false;
    }
  }

  $("refresh").addEventListener("click", refresh);

  // Show the newest saved numbers right away (this browser's last load, or the
  // copy the daily GitHub job saves), then fetch live ones from npm.
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) {}
  if (cached && cached.packages) load(cached);
  fetch("data.json", { cache: "no-cache" }).then((r) => r.ok ? r.json() : null).then((d) => {
    if (d && d.packages && !liveLoaded && (!state.data || d.fetchedAt > state.data.fetchedAt)) load(d);
  }).catch(() => {});
  refresh();
})();
