# Objectives detail (dark)

A single Objectives detail screen, converted from a light reference to a dark UI.
Vite + React + Tailwind, no router, no backend, all state is local to `App.jsx`.

## Run

```bash
npm install
npm run dev
```

Node is installed at `~/.local/node` and symlinked into `~/.local/bin`, which is
already on `PATH` via `~/.zshrc`.

## Structure

- `src/App.jsx` — the screen: header, metadata row, status, title, progress, chart, two panels
- `src/data.js` — mock content and the progress maths
- `src/components/ProgressChart.jsx` — hand built SVG line chart with an HTML overlay
- `src/components/dialogs.jsx` — Edit, New Progress, Key Result, Add Initiative
- `src/components/` — Avatar, Button, Dialog, Field, PanelCard, RingAvatar, rows

Icons come from the free Hugeicons set (`@hugeicons/core-free-icons`).
