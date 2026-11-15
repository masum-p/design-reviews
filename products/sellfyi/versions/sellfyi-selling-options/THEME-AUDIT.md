# Theme audit

Theme only. Every dimension, spacing value, font size, family, radius, rail and corner-cross position is unchanged throughout. Previous looks are kept verbatim: `theme-firecrawl.backup.css` (warm orange) and `theme-cool-gray.backup.css` (cool charcoal).

## Current: flat near-white, from the settings/billing reference

**Two values and a seam.** The reference carries everything around the content on one very light neutral near-white, and the content itself on pure white. The navigation column has no fill of its own; it is the same ground as the canvas. Separation is done by 1px borders, never by tone.

**Nothing is elevated.** No card shadow, no button shadow, no elevated pills. Borders do all the work.

**Selected navigation is a flat soft-gray fill.** The Billing row is a plain gray rectangle with dark text: no border, no shadow, no lift, no colour. This replaces the previous white-lift selection.

**Inset surfaces are barely gray.** The subscription box and the select field sit a single step off white.

**Blue is rationed.** It appears on the progress bar and a status badge only. Navigation stays neutral.

### Palette

| Role | Token | Value |
|---|---|---|
| Outside the artboard | `body` | `#e8e8ea` |
| Navigation ground, canvas, header | `--nav` / `--sub` / `--page` | `#f4f4f5` |
| Content surfaces | `--surface` | `#ffffff` |
| Card and column seams | `--line` | `#e8e8ea` |
| Row dividers | `--line-soft` | `#f0f0f1` |
| Content rails | `--rail` | `#eaeaec` |
| Corner crosses | in `--cross` | `#d9d9de` |
| Hover on white | `--wash` | `#f0f0f1` |
| Hover on navigation | `--nav-hover` | `#ececee` |
| Selected navigation | `--sel` | `#e6e6e9` |
| Inset surface | `--field` | `#fafafa` |
| Ink | `--text` | `#18181b` |
| Secondary text | `--text-soft` | `#71717a` |
| Quiet text and icons | `--text-quiet` | `#a1a1aa` |
| Accent | `--blue` / `--blue-strong` | `#3250e0` / `#2742c4` |

### Where blue is used, and where it is not

Used: switch on, `Save changes`, and every focus treatment (global `:focus-visible`, both search fields, the select, the rate field, the borderless global search row). Not used: either navigation column, at rest or selected, which stay neutral gray.

### Shadows

Reduced to the reference's flat: cards, buttons, the header pills, the shop chip, the select and both selected nav states are now `box-shadow:none`. The only remaining shadows are the switch knob at `0 1px 2px rgba(24,24,27,.14)`, the focus rings, and the sidebar's inset 1px seam, which is a border drawn as a shadow so the 240px box keeps its width.

### Preserved

Rails and corner crosses keep their exact positions and sizes; only their grays changed. The header still blends with the canvas. No JSX, copy, state or behaviour was touched; both searches, their filters and Hugeicons Free are as they were. A diff of every non-color property against the backups returns a byte-identical list.
