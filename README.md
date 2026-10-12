# Design reviews

Live screens for team review: **https://masum-p.github.io/design-reviews/**

| Design | Live link |
| --- | --- |
| Paymie · Analytics | [/paymie/](https://masum-p.github.io/design-reviews/paymie/) |
| BRICK · Projects, Gantt view | [/brick/?view=projects-gantt-ux](https://masum-p.github.io/design-reviews/brick/?view=projects-gantt-ux) |
| BRICK · Projects, Timeline view | [/brick/?view=projects](https://masum-p.github.io/design-reviews/brick/?view=projects) |

All screens are static, desktop-only (1440px) and use mock data.

## Repo layout

- `docs/`: the built site served by GitHub Pages.
- `projects/paymie-analytics/`, `projects/brick-estimates/`: source (React + Vite + Tailwind).

## Running locally

The projects use Hugeicons Pro, which needs a private license token in an `.npmrc` file (not committed). With the token in place:

```sh
cd projects/brick-estimates   # or projects/paymie-analytics
npm install
npm run dev
```
