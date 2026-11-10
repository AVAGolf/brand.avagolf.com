---
title: Theme and Tokens
eyebrow: Product Design
subtitle: Which token to use for any surface, text, border, radius, shadow or gap, which of them a partner theme may override, and what the lint forbids.
adrs:
  - 2026-10-14-design-namespace-resets-with-compat-aliases.md
  - 2026-10-14-design-lint-bans-compat-aliases.md
  - 2026-10-14-design-nuxt-ui-primary-is-forest.md
  - 2026-10-14-design-info-uses-neutral-pair.md
  - 2026-10-14-design-ink-faint-non-text-only.md
  - 2026-10-14-design-jade-mint-only-for-coach-band-hairline.md
  - 2026-10-14-design-success-fill-jade-ink.md
  - 2026-10-14-design-warnings-are-amber.md
  - 2026-10-14-design-off-palette-reds-and-blues.md
  - 2026-10-14-design-selection-marks-forest-on-light.md
  - 2026-04-23-game-area-chart-colours-are-vivid-brand-jade-and-amber.md
  - 2026-10-14-design-inventory-ts-literals-before-migrating.md
  - 2026-10-14-design-body-16px-no-control-text-size.md
  - 2026-10-14-design-no-14px-text-token.md
  - 2026-10-14-design-minimum-text-size-11px.md
  - 2026-10-14-design-stat-sm-size-override.md
  - 2026-10-14-design-hero-xl-for-the-home-handicap.md
  - 2026-10-14-design-dm-mono-sets-stat-values.md
  - 2026-10-14-design-label-tracking-0-06em.md
  - 2026-10-14-design-drop-spacing-steps-2-5-and-3-5.md
  - 2026-10-14-design-radius-mark-4px.md
  - 2026-10-14-design-16-and-20px-radii-map-to-panel.md
  - 2026-10-14-design-pressables-full-or-inset-radius.md
  - 2026-10-14-design-two-shadows-float-and-accent-cta.md
  - 2026-10-14-design-app-shell-variant-on-data-app-shell.md
  - 2026-10-14-design-mobile-web-adopts-app-layout.md
  - 2026-10-14-design-grouped-list-variables-width-gated.md
  - 2026-10-14-design-card-surface-per-shell.md
  - 2026-05-10-domain-code-is-provider-neutral.md
  - 2026-10-27-design-system-unification-avoids-app-wide-restyles.md
---

## Where a token lives

- A token is declared in the `@theme` block of `web/assets/css/main.css` and specified in `docs/design-system/tokens.md`; a name in one file only is not a token.
- `@theme` resets the colour, text, font, weight, tracking, leading, radius and shadow namespaces, so only declared tokens compile to utilities and Tailwind’s own never do.
- The platform layer and the data-viz palette sit on `:root` with no utility; canvas and SVG code reads them through `token()` and `DATAVIZ` in `web/utils/design-tokens.ts`.

## Colour

Twenty-one semantic tokens, named for their job. The brand palette column is the swatch on the Color page; a dash means none.

| group   | token         | value     | brand palette    | use                                                               |
| ------- | ------------- | --------- | ---------------- | ----------------------------------------------------------------- |
| surface | `paper`       | `#fbfaf5` | —                | Page ground; text on dark grounds and on solid fills              |
| surface | `paper-sunk`  | `#f2f0ea` | —                | Inset ground; the phone page ground                               |
| surface | `card`        | `#ffffff` | `white`          | Card on desk, sheet, popover, field inside a dialog, Nuxt UI `bg` |
| surface | `forest`      | `#16382e` | `green-900`      | Primary action fill, brand text, focus ring, selection on light   |
| surface | `forest-deep` | `#10211c` | `dark-green-500` | Dark ground: app header, hero, tab bar, status strip              |
| ink     | `ink`         | `#0b1f18` | —                | Primary text; text on yellow and amber                            |
| ink     | `ink-muted`   | `#5a6660` | —                | Secondary text; axis and chart labels                             |
| ink     | `ink-faint`   | `#7d8780` | —                | Non-text only: control edges, icons, disabled                     |
| border  | `line`        | `#dcd9d0` | —                | Dividers, hairlines, card border. Never text                      |
| brand   | `jade`        | `#349683` | `green-500`      | Brand mark, toggles, progress, borders. Never text                |
| brand   | `jade-ink`    | `#225142` | `green-700`      | Success and positive text; solid success fill                     |
| brand   | `jade-soft`   | `#d9ece4` | —                | Success tint, SG-up chip                                          |
| brand   | `jade-mint`   | `#eef5f1` | —                | The coach band, behind its hairline; nowhere else                 |
| brand   | `jade-light`  | `#95cbc1` | `green-300`      | Positive value on dark grounds                                    |
| brand   | `yellow`      | `#ffe708` | `yellow-500`     | Accent fill with ink text; accent text and selection on dark      |
| warning | `amber`       | `#f5b719` | —                | Warning mark and fill, ink on it. Never text on light             |
| warning | `amber-soft`  | `#fbe6b2` | —                | Warning tint                                                      |
| warning | `amber-ink`   | `#5a3a1a` | —                | Warning text                                                      |
| danger  | `red`         | `#bf2c34` | `red-500`        | Error, destructive action, SG loss: text and solid fill           |
| danger  | `red-soft`    | `#f9eaeb` | `red-100`        | Error tint, SG-down chip                                          |
| danger  | `red-light`   | `#e5abae` | `red-300`        | Negative value on dark grounds                                    |

- Text on light is `ink`, `ink-muted`, `jade-ink`, `amber-ink` or `red`; on dark `paper`, `jade-light`, `red-light` or `yellow`. `ink-faint`, `line`, `jade`, `amber` and `yellow` are never text on light.
- Every text pair clears WCAG AA at 4.5:1, every mark 3:1, under any theme.
- `info` has no hue: `paper-sunk` with `ink-muted`. Warnings are amber; red means error, destruction or strokes lost. A solid success fill is `jade-ink` with `paper` text.
- Opacity is not a token: `paper/70` for text on dark only; any alpha of `ink`, `paper`, `card`, `jade`, `amber` and `red` for grounds and scrims. `bg-login-backdrop` is the only gradient.
- Nuxt UI reads the same tokens through `--ui-*`; its alias names (`bg-primary`, `text-sm`, `rounded-lg`, `font-bold`, `shadow-lg`) are not for app code.

| Nuxt UI                                   | token        |
| ----------------------------------------- | ------------ |
| `primary`, `secondary`, `bg-inverted`     | `forest`     |
| `success`                                 | `jade-ink`   |
| `info`, `text-muted`, `text-dimmed`       | `ink-muted`  |
| `warning`                                 | `amber-ink`  |
| `error`                                   | `red`        |
| `text`, `text-highlighted`                | `ink`        |
| `text-inverted`, `bg-muted`               | `paper`      |
| `bg`                                      | `card`       |
| `bg-elevated`                             | `paper-sunk` |
| `border`, `border-muted`, `bg-accented`   | `line`       |
| `border-accented`                         | `ink-faint`  |

### Data-viz palette

On `:root`, never `text-*` or `bg-*`. The wider series are `DATAVIZ.*` in `design-tokens.ts`; of those only `red-400`, `red-700`, `dark-green-700`, `white` and `yellow-500` match a brand swatch.

| token                                                           | value                                                 | brand palette      | use                      |
| --------------------------------------------------------------- | ----------------------------------------------------- | ------------------ | ------------------------ |
| `--dataviz-ott`                                                 | `#225142`                                             | `green-700`        | Off the tee              |
| `--dataviz-approach`                                            | `#349683`                                             | `green-500`        | Approach                 |
| `--dataviz-atg`                                                 | `#f5b719`                                             | — (equals `amber`) | Around the green         |
| `--dataviz-putt`                                                | `#d4940a`                                             | —                  | Putting                  |
| `--dataviz-grid`                                                | `#e8e5dc`                                             | —                  | Chart grid               |
| `--dataviz-tendency`                                            | `#17deb7`                                             | `bright-green-500` | Tendency marks on plots  |
| `--dataviz-pose`                                                | `#38bdf8`                                             | —                  | The camera pose skeleton |
| `--dataviz-turf-light`, `-green`, `-fairway`, `-rough`, `-tree` | `#9dc48d`, `#74a557`, `#5c834b`, `#425c3b`, `#223920` | —                  | Map turf                 |

- A reading never takes a data-viz fill as text: a value is `ink`, `jade-ink` for a gain, `red` for a loss, `amber-ink` for a caution. In every chart gain is jade, loss is red. Axis and label text is `ink-muted`; a label on a fill is `ink`.

### Retired names still declared

Use the token; a retired name goes with its last use.

| declared in `main.css`                                                                                       | use instead                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-forest-deeper`                                                                                      | `forest-deep`; it survives inside `bg-login-backdrop` only                                                                                   |
| `--color-line-dark`, `--color-bright-green`, `--color-amber-warm-to`, `--color-red-500`, `--color-chart-axis` | `line`, `jade-light`, `amber-ink`, `red`, `ink-faint`                                                                                        |
| `--font-family-display`, `--font-family-data`, `--font-family-prose`                                         | `--font-sans`, `--font-mono`, `--font-sans`. `--font-family-display` renders Google Sans Flex, not the display face                         |
| `--spacing-chrome-tab-bar`, `--spacing-chrome-bottom`, `--tab-bar-clearance`                                 | `--app-tab-bar-height`, `--app-chrome-bottom`, `--app-tab-bar-clearance`                                                                     |
| `--color-white`                                                                                              | `card`. `--field-surface` names it inside dialogs and sheets; the reset removed it, so those fields render transparent until it reads `card` |

## Type

Set type with a `type-*` role only; raw sizes, families, tracking and leading live in `components/ui/`. `--font-display` is Construct Mono (500 only), `--font-sans` Google Sans Flex, `--font-mono` DM Mono (400 and 500). Weights are 400, 500 and 600; 500 is the emphasis weight, on mono roles only.

| role            | face    | size | weight | leading | tracking | case  | use                                   |
| --------------- | ------- | ---- | ------ | ------- | -------- | ----- | ------------------------------------- |
| `type-hero-xl`  | display | 64   | 500    | 1.0     | 0        | —     | The home handicap, nowhere else       |
| `type-hero`     | display | 48   | 500    | 1.0     | 0        | —     | Masthead stat                         |
| `type-display`  | display | 26   | 500    | 1.0     | 0.02em   | upper | Masthead title, empty-home headline   |
| `type-headline` | sans    | 30   | 600    | 1.2     | 0        | —     | Screen headline                       |
| `type-title`    | sans    | 17   | 600    | 1.2     | 0        | —     | Card title, chart title, dialog title |
| `type-stat`     | mono    | 26   | 400    | 1.0     | 0        | —     | A value at 25–28px                    |
| `type-stat-sm`  | mono    | 22   | 400    | 1.0     | 0        | —     | A value in a tile or row              |
| `type-body`     | sans    | 16   | 400    | 1.5     | 0        | —     | Body copy, row title, inputs          |
| `type-body-sm`  | sans    | 13   | 400    | 1.4     | 0        | —     | Row detail                            |
| `type-data`     | mono    | 12   | 400    | 1.4     | 0        | —     | Meta, table cells                     |
| `type-label`    | mono    | 12   | 400    | 1.2     | 0.06em   | upper | Label; `BaseEyebrow` md               |
| `type-eyebrow`  | mono    | 11   | 400    | 1.2     | 0.06em   | upper | Eyebrow, tab bar; `BaseEyebrow` sm    |

- A value takes the stat family with tabular figures: `type-stat-sm` at 22–24px, `type-stat` at 25–28px, `type-hero` above; never `type-body`.
- A type role never changes at a breakpoint.
- 11px is the floor, eyebrow only. There is no 14px: sans goes to `type-body`, mono to `type-data`. Body is 16px in every shell, which also keeps iOS from zooming an input.

## Spacing, radius, shadow

- Spacing steps: 0, px, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12 and 16 on `--spacing: 0.25rem`; step 5 is the 20px phone gutter. Layout above 64px, widths, heights, grids, z-index, transforms and timing stay free.
- Radius follows what a thing is; `rounded-none` is the absence of a token. Pills and circles take `full`, rectangular buttons and inputs `inset`.

| token            | px   | use                                                 |
| ---------------- | ---- | --------------------------------------------------- |
| `--radius-mark`  | 4    | Swatches, bar segments, tag badges, skeleton bars   |
| `--radius-inset` | 8    | Boxes nested in a card, inputs, rectangular buttons |
| `--radius-panel` | 12   | Cards on desk, hero panels, dialogs, sheets         |
| `--radius-full`  | 9999 | Pills, circles, the tab pill, avatars               |

| token                 | value                              | use                                                                                       |
| --------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `--shadow-float`      | `0 8px 24px rgba(11, 31, 24, 0.3)` | The one layer floating over content with no backdrop: tab pill, action bar, popover, menu |
| `--shadow-accent-cta` | `0 0 48px rgba(255, 231, 8, 0.15)` | One yellow glow per screen, on a hero CTA                                                 |

- No shadow on a card or on a modal over a backdrop; a ring is `ring-*`; no text shadow.

## Platform layer

The only values that differ by shell or width. OS values follow `html[data-app-shell]` (a PWA install, the Capacitor wrapper, `?shell=app`); layout values follow `@media (width < 64rem)`, Tailwind’s `lg`, so mobile web and the app share one phone layout and a tablet shell at 1032px takes the desk values.

| variable                              | desk (from `lg`)                         | phone (below `lg`) | app shell                                 |
| ------------------------------------- | ---------------------------------------- | ------------------ | ----------------------------------------- |
| `--app-safe-top`                      | 0                                        | 0                  | `env(safe-area-inset-top)` at any width   |
| `--app-sticky-top`                    | `--app-safe-top`                         | 57px               | `--app-safe-top`                          |
| `--app-tab-bar-height`                | 0                                        | 0                  | 53px below `lg`                           |
| `--app-tab-bar-inset`                 | 0                                        | 0                  | `max(12px, safe bottom − 5px)` below `lg` |
| `--app-tab-bar-clearance`             | 0                                        | 0                  | inset + 60px below `lg`                   |
| `--app-page-ground`                   | `paper`                                  | `paper-sunk`       | same as the width                         |
| `--app-card-surface`                  | `card`                                   | `paper`            | same as the width                         |
| `--app-card-radius` / `-border-width` | `panel` / 1px                            | 0 / 0              | same as the width                         |
| `--app-bleed-gutter`                  | 20px                                     | 0                  | same as the width                         |
| `--app-section-gap`                   | 16px                                     | 8px                | same as the width                         |
| `--app-row-gap`                       | 12px                                     | 0                  | same as the width                         |
| `--app-row-divider`                   | none                                     | 1px solid `line`   | same as the width                         |
| `--app-list-row-min-h`                | 44px                                     | 52px               | same as the width                         |
| `--app-chrome-bottom`                 | tab bar + 68px + safe bottom             | same               | same                                      |
| `--settings-row-text-inset`           | 89px                                     | same               | same                                      |
| `--field-surface`                     | `paper`; `card` inside a dialog or sheet | same               | same                                      |

- `app-shell:` is the one shell variant, allowed in `app.vue`, `components/App*.vue` and `components/app/` only; a layout difference is `max-lg:`; `mobile-app:` is retired. Elsewhere `data-app-only` marks app chrome and `data-web-only` the browser’s copy of it.
- Both shells share the 44px touch target (`tap-44`), sheet geometry, the 20px gutter and every token above.

## The split: brand layer and structural layer

A theme is a set of token values: it redeclares variables `main.css` already defines and adds no utility, component, selector or code branch. `if (brand === 'x')` never appears in feature code, the rule that keeps domain code provider-neutral. The developer dark mode, `web/assets/css/theme-dark.css`, is the shape: one block of values under one class.

| layer                                     | holds                                                                                                                                                                                                                                            | set by                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Brand layer, a partner theme may override | The values of the 21 colour tokens; the logo assets (11 SVGs at 13 call sites); the brand name, legal and support links and email sender, passed as a `brand` parameter                                                                          | The partner’s theme, as configuration |
| Structural layer, nobody overrides        | Token names; the type roles with their faces, sizes, weights, leading and tracking; the spacing steps; the four radii; the two shadows; the platform variables and breakpoints; the contrast floors; the Nuxt UI mapping; the component catalogue | The design system, by ADR             |

- A theme keeps every contrast floor and adds no name; it sets the values the names have.
- What blocks a theme is every colour outside the token layer: 245 hex literals in `.vue` and `.ts` files, the static logo paths, the brand strings. They move into tokens before a second brand, chart and map literals inventoried first.

## Lint

Every rule is a `pnpm lint` error with no suppressions file, so a new violation fails the PR. Enforced is a check in `web/eslint.config.mjs` today; planned has none yet.

| rule                                                                                                                                                                  | scope                                   | status                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| No hex or `rgb()` literal in a template attribute, expression or template string                                                                                      | every `.vue`                            | enforced; `ui/GoogleSignInButton.vue` carries the one file-level disable, for a third-party mark                  |
| No hex literal in `<script>` or a `.ts` file                                                                                                                          | `web/**`                                | planned; `utils/design-tokens.ts`, `rounds/HoleMap.vue` and `annotation/AnnotationComposer.vue` hold most of them |
| No arbitrary value in a colour, type, spacing, radius, shadow or opacity utility, nor `[property:value]` on those properties                                          | every `.vue`                            | enforced; `var(--…)`, `env(…)`, a bare `%`, `url(…)` and border or ring widths are exempt                         |
| No Tailwind palette colour (`bg-red-500`, `text-white`, `bg-black`)                                                                                                   | every `.vue`                            | enforced                                                                                                          |
| No compatibility alias (`bg-primary` to `-error`, `rounded-xs` to `-3xl`, `text-xs` to `-5xl`, `font-bold`, `shadow-sm`, `shadow-lg`)                                 | every `.vue`, `components/ui/` included | enforced                                                                                                          |
| No spacing step off the scale                                                                                                                                         | every `.vue`                            | enforced                                                                                                          |
| No raw type: `text-[Npx]`, a size name such as `text-caption`, `font-family-*`, `tracking-*`, `leading-*`, in a class attribute or a class string built in `<script>` | outside `components/ui/`                | enforced; `RAW_TYPE_ALLOWLIST` exempts one file                                                                   |
| No weight outside 400, 500 and 600                                                                                                                                    | every `.vue`                            | enforced                                                                                                          |
| No `mobile-app:`; no `app-shell:` or `pb-safe` outside the shell paths and `ui/`                                                                                      | every `.vue`                            | enforced                                                                                                          |
| No static inline `style`                                                                                                                                              | every `.vue`                            | enforced                                                                                                          |
| No `type-body` or `type-body-sm` on a value (`tabular-nums`, a `StatBlock` `value-class`)                                                                             | outside `components/ui/`                | enforced                                                                                                          |
| No type role behind a breakpoint variant (`sm:type-headline`)                                                                                                         | every `.vue`                            | planned                                                                                                           |
| No `--dataviz-*` or `DATAVIZ` colour as a text colour                                                                                                                 | `web/**`                                | planned                                                                                                           |
| No `var(--…)` reference to a name `main.css` does not declare                                                                                                         | `web/assets/css`                        | planned                                                                                                           |
| No token count above its ceiling: 21 colours, 10 sizes, 10 roles plus two size overrides, 4 radii, 2 shadows                                                          | the `@theme` block                      | planned                                                                                                           |
| A partner theme sets only names in the brand layer                                                                                                                    | theme files                             | planned                                                                                                           |

- The allowlist shrinks and never grows: today `RAW_TYPE_ALLOWLIST` (`components/trends/DrivingDispersionChart.vue`), the disable on `ui/GoogleSignInButton.vue` and the `bg-forest-deep` hero placeholders the skeleton check skips. A file leaves when its strings move to roles; none joins.

## Open questions

- Owner: may a partner theme replace the faces (`--font-display` is the proprietary Construct Mono), or are faces structural?
- Owner: is the data-viz palette brand layer (a partner recolours charts) or structural (gain is jade, loss is red everywhere)?
- Owner: the game-area ADR sets off the tee and approach at `#186B54` and `#3BA184`, `--dataviz-ott` and `--dataviz-approach` at `#225142` and `#349683`; `DATAVIZ.chart` uses the first pair, `DATAVIZ.scores` the second. Which is canonical?
- Owner: do the 245 literals become `--dataviz-*` variables or `DATAVIZ` entries, and is the `.ts` inventory complete?
- Owner: the Color page’s `dark-green-fade` runs `green-900` to `dark-green-900`; `bg-login-backdrop` runs `dark-green-500` to `dark-green-700`. Which is the gradient?
- Owner: the Typography page sets display in Google Sans Flex Black (1000) uppercase; the app sets it in Construct Mono 500. Which is the product’s rule?
- Owner: `--cap-sheet-radius` is 20px while the radius ADR maps 20px to `panel`. New decision for sheets, or 12px?
- Owner: is a partner theme a `html[data-brand]` block like `.dark`, or a stylesheet per brand?
