# Firecrawl style audit → Sellfyi Selling Options

Visual observations taken from the supplied Firecrawl dashboard screenshot only. No layout geometry was changed: sidebar widths, header height, content measure, paddings, row heights, control sizes, font sizes and line heights are all untouched. Every change below is colour, seam, shadow, font-family or a non-participating pseudo-element.

---

## 1. Surface palette: warm, not neutral

**Observed.** Nothing in the reference is a cool grey. The page sits on a warm off-white (~`#FAFAF9`), the sidebar is the *same* off-white rather than a contrasting panel, and cards are plain white. The separation between sidebar, canvas and card is carried almost entirely by a 1px warm seam (~`#E7E5E4`), not by fill contrast. Text is a warm near-black (~`#1C1917`) over warm grey secondaries (~`#78716C`).

**Applied.** Whole palette re-tuned from cool grey to the stone family. `--page` `#f6f6f7` → `#fbfaf9`; `--sub` and the sidebar both → `#fafaf9`; `--line` `#ebebeb` → `#e7e5e4`; `--line-soft` → `#f0eeec`; `--text` `#1d1d1f` → `#1c1917`; `--text-soft` → `#78716c`; `--text-quiet` → `#a8a29e`. The dark sidebar becomes the same warm off-white as the settings column, separated from the shell by an inset 1px seam instead of by a tonal jump (inset shadow, so the 240px box is byte-identical).

## 2. Thin seams doing the work of panels

**Observed.** The endpoint row (Scrape / Search / Crawl / Extract) has no card borders at all: four cells divided by single hairlines, with the horizontal rules bleeding the full width of the content column. The content column itself is bounded left and right by faint vertical rails that run past the sections. Cards read as cells of a grid, not as floating objects.

**Applied.** Two 1px rails (`#f1efed`) now run the full height of the settings scroll area at exactly the left and right edges of the 744px content column, drawn as pseudo-elements on `.main-scroll` so they occupy no space. Card borders and row dividers were re-weighted to warm hairlines.

## 3. Corner crosses at the grid intersections

**Observed.** The signature edge detail: small faint `+` marks centred on the corners of each bordered region, straddling the boundary so half the cross falls outside the cell. They appear where rails meet section seams, at roughly 7px across, in a pale warm grey.

**Applied.** Each of the three group cards carries four 7px crosses centred on its corners, via a single `::after` overlay (`inset:-3px`, `pointer-events:none`, SVG data-URI, 4 background positions). Because the cards span the full content measure, the crosses land precisely on the vertical rails from §2 and reproduce the reference's rail/seam intersection. Card radius eased 10px → 8px so the cross sits on a tighter corner; radius is not geometry and nothing reflows.

## 4. Restrained orange

**Observed.** One accent, used sparingly and in two registers: **solid** (the Upgrade button, the chart line, the small endpoint glyphs) and **pale** (active nav item, the What's New card, the API-key field, the `TypeScript` / `Python` chips, the `NEW` badge). Pale surfaces are a very light tint with orange ink on top, never an orange border alone. Sampled at roughly `#EF5C12` solid, `#FFF1E9` pale, `#C2410C` ink.

**Applied.**
- `Save changes` is the screen's single primary action, so it takes the solid orange treatment the Upgrade button has, with a tinted micro-shadow.
- The brand mark loses its white container and becomes the bare orange glyph, matching the Firecrawl logo lockup (box still 26px; only the inner svg is scaled by CSS).
- Switch-on moves from green to accent orange. The reference contains no green at all, and toggle-on is the only "active" signal on this screen, so it belongs to the accent. On/off behaviour and every shipped value are unchanged.
- Focus rings and the saved-state tick follow the accent.

## 5. Pale active states

**Observed.** The active nav item "Overview" is a full-width rounded rect filled with pale orange, with orange icon and orange label. No left bar, no border, no shadow. The "What's New" card uses the same pale fill with a slightly deeper pale border.

**Applied.** Both active items take that exact treatment: `Settings` in the product sidebar and `Selling Options` in the settings column. Previously the settings item was a white chip with a shadow and a ring; that is replaced by the pale orange fill, which also renders the active path (Settings → Selling Options) as one continuous accent. Hover on inactive items is a warm `#f5f3f1` wash.

## 6. Pale-tinted value field

**Observed.** The API key sits in a pale orange field with a barely-there tinted border and orange monospace text: the reference's way of marking the one value on the panel that matters.

**Applied.** Mapped to the Admin commission rate field, the only editable number on the screen. Pale orange fill, tinted border, orange monospace numerals and affix. Same 180x34 box, same behaviour.

## 7. Typography treatment

**Observed.** Two families. A grotesque for headings and prose, with headings at normal-to-medium weight, tight tracking, warm near-black. A monospace for anything machine-ish: code, the API key, the chart's date axis, the badge chips, the `[ LIVE ]` label.

**Applied.** Inter is kept throughout for labels, helpers and headings, now in warm ink. Monospace (system UI mono) is applied to exactly the four micro-label / data slots that mirror the reference's use: the sidebar group labels, the three settings group labels, the commission rate field, and the action-bar status line. Font sizes and line heights are byte-identical, so nothing reflows; only the family changes.

## 8. Near-zero shadows

**Observed.** Almost everything is flat. Cards have a border and no visible elevation. The white pill buttons (Help, Docs, Personal Team) have a 1px border plus a shadow so slight it reads as a single darker pixel row. Only the orange Upgrade button carries a tinted shadow.

**Applied.** Card shadow reduced to `0 1px 1px rgba(28,25,23,.02)`. The settings-column active item lost its two-layer shadow entirely (pale fill instead). Header buttons and the shop chip take the reference's white-pill formula: white fill, warm 1px border, `0 1px 1px rgba(28,25,23,.04)`. The header search moves from a grey fill to the same white-and-border pill. The bell button gains that border too, matching the reference's bordered icon button, at its existing 34x34.

---

## Preserved exactly

240px product sidebar, 64px header, 256px settings column, 744px content measure, 40px gutters, 60px row min-height, 34px control height, 180px control column, 22px switch, all paddings and gaps, all font sizes and line heights, all copy, all eight settings and their values, all local state and behaviour, Hugeicons Free throughout. No new elements, panels, text or screens; the only additions are two non-participating pseudo-elements (rails, corner crosses).

---

# Follow-up: heading and rail alignment

Re-reading the reference for two things the first pass got wrong.

## 9. The heading block sits inside the grid, not against it

**Observed.** "Explore our endpoints" starts at x≈360 while the left rail is at x≈330: the heading is inset from the rail by roughly the same amount as a cell's own internal padding, so the type never touches the line. Our version had the title, the description and the three group labels starting at the rail, with the label's 2px nudge making the collision read as an error rather than a choice.

**Applied.** `.page-head` gains `padding-left:var(--text-inset)` and `.group > h2` moves from `padding-left:2px` to the same token. `--text-inset` is `17px`, stated as what it is: the card's 1px border plus its 16px row padding. Title, description and group labels now share an exact left edge with every row label beneath them. Card widths, card positions and the control column are untouched; only these three text blocks shift right inside the existing 744px measure, and neither the title nor the description is near wrapping.

## 10. Rails bound the cells, not the heading

**Observed.** The reference's rails and seams delimit the card grid. The section heading above the endpoint row sits clear of them.

**Applied.** The rails now start at the top edge of the first card instead of at the top of the scroll area, and still run to the foot of the page. The first card's top corner crosses land exactly on the rails' start, so each rail now begins at a cross.

## Robustness rather than magic coordinates

The rails were previously pinned with two literals, `left:40px` and `left:784px`, which silently encoded the gutter and the measure. Those are now tokens used by the rules that define them, so the rails cannot drift:

- `--gutter:40px` drives `.main-scroll` padding and `.main-scroll::before{left}`.
- `--measure:744px` drives `.content{width}` and `.main-scroll::after{left:calc(var(--gutter) + var(--measure))}`.
- `--rail-top` is `calc(var(--pad-top) + 52px + 24px + 23px)`, each term named in a comment against the rule it comes from: the scroll padding-top, the page-head block, the group margin-top, and the group label's line-height plus margin.

No DOM, JSX, copy, state or behaviour changed; no restructure. Accents, pale active states, corner crosses and seam weights are as in sections 1 to 8.
