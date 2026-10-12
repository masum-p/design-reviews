# Design reviews

Live screens for team review: **https://masum-p.github.io/design-reviews/**

## Latest

| Design | Live link |
| --- | --- |
| Paymie · Analytics | [paymie/](https://masum-p.github.io/design-reviews/paymie/) |
| BRICK Construction · Projects, Gantt view | [brick/?view=projects-gantt-ux](https://masum-p.github.io/design-reviews/brick/?view=projects-gantt-ux) |
| BRICK Construction · Projects, Timeline view | [brick/?view=projects](https://masum-p.github.io/design-reviews/brick/?view=projects) |

## Paymie · Analytics explorations

| Design | Live link |
| --- | --- |
| Original build | [paymie-analytics/](https://masum-p.github.io/design-reviews/paymie-analytics/) |
| Claude version | [paymie-claude/](https://masum-p.github.io/design-reviews/paymie-claude/) |
| Codex version | [paymie-codex/](https://masum-p.github.io/design-reviews/paymie-codex/) |
| Header study · Claude | [paymie-header-claude/](https://masum-p.github.io/design-reviews/paymie-header-claude/) |
| Header study · Codex | [paymie-header-codex/](https://masum-p.github.io/design-reviews/paymie-header-codex/) |
| Light version | [paymie-white/](https://masum-p.github.io/design-reviews/paymie-white/) |

## MonRize · Merchants

| Design | Live link |
| --- | --- |
| Claude version | [merchants-claude/](https://masum-p.github.io/design-reviews/merchants-claude/) |
| Codex version | [merchants-codex/](https://masum-p.github.io/design-reviews/merchants-codex/) |
| Context study | [merchants-context-study/](https://masum-p.github.io/design-reviews/merchants-context-study/) |
| Header study · Claude | [merchants-header-claude/](https://masum-p.github.io/design-reviews/merchants-header-claude/) |
| Header study · Codex | [merchants-header-codex/](https://masum-p.github.io/design-reviews/merchants-header-codex/) |
| Visual study · Claude | [merchants-visual-claude/](https://masum-p.github.io/design-reviews/merchants-visual-claude/) |
| Visual study · Codex | [merchants-visual-codex/](https://masum-p.github.io/design-reviews/merchants-visual-codex/) |

## Nexus · Organization settings

| Design | Live link |
| --- | --- |
| Cards · Claude | [organization-settings-cards-claude/](https://masum-p.github.io/design-reviews/organization-settings-cards-claude/) |
| Cards · Codex | [organization-settings-cards-codex/](https://masum-p.github.io/design-reviews/organization-settings-cards-codex/) |
| Cards · Light | [organization-settings-cards-white/](https://masum-p.github.io/design-reviews/organization-settings-cards-white/) |
| Creative · Claude | [organization-settings-claude-creative/](https://masum-p.github.io/design-reviews/organization-settings-claude-creative/) |
| Creative · Codex | [organization-settings-codex-creative/](https://masum-p.github.io/design-reviews/organization-settings-codex-creative/) |
| Dark | [organization-settings-dark/](https://masum-p.github.io/design-reviews/organization-settings-dark/) |

## Other screens

| Design | Live link |
| --- | --- |
| Halal Lab · Products mega menu | [halal-lab-mega-menu/](https://masum-p.github.io/design-reviews/halal-lab-mega-menu/) |
| Objectives · Dark | [objectives-dark/](https://masum-p.github.io/design-reviews/objectives-dark/) |
| Sellfyi · Selling options | [sellfyi-selling-options/](https://masum-p.github.io/design-reviews/sellfyi-selling-options/) |

All screens are static, desktop-only (1440px) and use mock data.

## Repo layout

- `docs/`: the built site served by GitHub Pages.
- `projects/<name>/`: source for each design (React + Vite).

## Running locally

```sh
cd projects/<name>
npm install
npm run dev
```

`brick-estimates` and `paymie-analytics-linear` use Hugeicons Pro, which needs a private license token in an `.npmrc` file (not committed).
