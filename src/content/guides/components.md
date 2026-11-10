---
title: Components
eyebrow: Product Design
subtitle: Every pattern has one base component; feature code composes bases and never hand-rolls a copy.
adrs:
  - 2026-04-16-ui-goes-through-base-components-over-nuxt-ui.md
  - 2026-10-14-design-pressables-full-or-inset-radius.md
  - 2026-10-14-design-card-surface-per-shell.md
  - 2026-10-14-design-two-shadows-float-and-accent-cta.md
  - 2026-10-14-design-app-shell-variant-on-data-app-shell.md
  - 2026-10-27-design-system-unification-avoids-app-wide-restyles.md
  - 2026-06-02-inline-links-use-the-basebutton-inline-variant.md
  - 2026-11-04-3078-profile-sheet-unread-uses-the-avatar-badge.md
---

## One base per pattern

- Every UI pattern has one base component in `web/components/ui/`, and feature code composes bases. A copy of a base’s markup in feature code is a defect, not a variant (`docs/design-system/tokens.md` §7, `web/components/CLAUDE.md`).
- Bases wrap Nuxt UI; a `U*` component is used only inside a base. `BasePopover` and `ChartInfoTooltip` are internal to `components/ui` as well: outside it, anything opened from a trigger is `BaseOverlay`, `BaseChoiceOverlay` or `BaseInfoOverlay`, a sheet in the app and a popover or tooltip in a browser (`web/components/ui/README.md`, ESLint).
- A missing variant is added to the base, never worked around at the call site. The gaps the pending folds wait on are the planned column below (`docs/design-audit/FINDINGS.md`).
- Variants are capped at what the app uses. The 28 bases absorb 853 of 875 hand-rolled instances; the other 22 are the exemption below (tokens.md §7).
- A fold keeps the UI as it is. A small local delta from merging two drawings is accepted; a change to a type role, weight or surface across the app, or to a look a closed ticket chose, is a designer ticket.
- A loading state draws the shape of what is coming (`CardLoadGate`, `BaseSkeleton`), never “Loading…” text (README).

## The bases

| pattern | base | variants and sizes | deprecated | planned |
| --- | --- | --- | --- | --- |
| Button | `BaseButton` | `variant` solid, outline, ghost, accent, inline; `color` primary, neutral, success, error; `size` xs–lg; `onForest`; `icon`, `leadingIcon`, `trailingIcon`; `to`, `href`, `loading` | `forest`, `pill`, `rounded-full!` overrides; `BasePillButton` | `shape` pill; `block`, the phone action tile (full width, 16px vertical, line hairline on paper) |
| Card | `BaseCard` | one surface, one padding; `title` + `#aside`, `flush`, `fullBleed`, `footer` + `footerTo`, `#footer` | variants `hero`, `potential`, `sunk`; props `padding`, `rounded`, `headerDivider`, `contentClass`, `divided` | `to` or a press event; the selectable option card (forest border when selected) |
| Stat card | `BaseStatCard` | one; `label`, `value`, `meta`, `trend` up, down, flat; slots `#label`, default, `#meta` | — | value in the stat family (`type-stat-sm`); `body` and `chips` slots so `TrendStatCard` renders through it |
| Hero | `HeroPanel` | one per screen; `padding` md, lg; `eyebrow`, `title`, `body`, `glow`, `titleTag`, `eyebrowTone`; slots eyebrow, title, body, default, actions | `PotentialPanel` | `band`: the full-bleed page-header placement (square, 40px gutters, 8px above and 32px below on desktop); a pressable form |
| Badge | `BaseBadge` | `variant` subtle, solid; `color` primary, neutral, success, warning, error, info; `dot`; `onForest` | `BaseChip`, `BasePill` | `overlay` variant; `shape` pill or tag (4px mark radius); sizes xs, sm |
| Eyebrow | `BaseEyebrow` | `size` sm = `type-eyebrow`, md = `type-label`; `tone` muted, danger, inherit; `as` | — | — |
| Readout | `StatBlock` / `BaseStatTile` | StatBlock `size` sm, md, lg; `trend`, `onForest`, `showTrendIcon`, `trendOnMeta`. StatTile `label`, `value`, `unit`, `note`, `selected`, `hero`, `interactive`, `loading` | StatTile `surface`, `valueClass`, `noteClass` | StatTile `tone` good, bad, neutral, owning the selected forest-deep surface; `cell` layout; `lines`, `rule`, `info` and a small size from `PlotStatTile` |
| Alert | `BaseAlert` | `variant` subtle × `color` success, warning, error, info (info is the neutral pair); `title`, `description`, `closable`, `icon` | `solid` | absorbs `ChartNotes` |
| View switch, choice row | `BaseSegmentedControl` / `BaseChipRow` | Segmented `options`, `size` sm, md (44px on a phone). ChipRow single or multi `v-model`, `tone` neutral, brand; `gutter` sheet, screen, none; `wrap` | `ModeTabs` | Segmented `underline` and on-forest variants; ChipRow on-forest colours |
| Empty | `BaseEmpty` | `variant` default; `title`, `description`, `icon`, `#actions` | `error`, `warning` | `info`; `layout` block or plot, absorbing `PlotEmptyState` |
| Page header | `AppMasthead` / `AppPageHeader` | one form at every width and in every shell; Masthead `eyebrow`, `title`, `logo` | `BasePageHeader` | a public mode without avatar and profile hub, for share pages |
| Placeholder, divider | `BaseSkeleton` / `BaseDivider` | Skeleton `onForest`, radius from classes. Divider horizontal, vertical, labelled; `color` neutral, onForest; `size` sm, md, lg | `rounded-full!` on a skeleton | Skeleton `shape` mark, inset, full, card; `BaseSpinner` |
| Form controls | `BaseInput`, `BaseSelect`, `BaseCheckbox`, `BaseToggle`, `BaseFormField` | Input `size` xs–xl, `variant` default, filled, forest, `leadingIcon`, `error`. Select `size`, `error`. Checkbox `size` sm, md, `description`. Toggle `loading`. FormField `label`, `hint`, `error`, `required` | — | Input `multiline`; Input and Select `inline` for in-row fields; Toggle on-forest |
| Modal, sheet | `BaseModal`, `BaseConfirmModal`, `BaseDetailSheet` | Modal `size` sm, md, lg; `title`, `sheet`, `appSheet`, `tabletSheet`, `fullHeight`, `elevated`, `layer`, `preventClose`. Confirm `title`, `message`, `confirmLabel`, `confirmColor`. DetailSheet a `StatTooltipCard` with `roundId`, `sessionId`, `to`, `params`, `destination` | Modal `full`; `BaseScreenSheet` as a public API | Modal `presentation` dialog, sheet, auto, and an eyebrow prop; Confirm `cancelLabel` |
| List row | `BaseListRow` | one, 56px; `to` + chevron, `link`, `hairlineInset` 0, 12, 20; `label`, `as`; `#detail` | — | a button form; a `selected` state (paper-sunk ground, forest edge); a trailing-control slot |
| Grouped list, popover, action bar | `BaseListSection`, `BasePopover`, `BaseActionBar` | row default, selected | — | `BaseListSection` and `BaseActionBar` do not exist yet |
| Overlays | `BaseOverlay`, `BaseChoiceOverlay`, `BaseChoiceSheet`, `BaseInfoOverlay`, `BaseContextMenu` | a sheet in the app; a popover, menu or tooltip in a browser. ChoiceSheet `eyebrow`, `title`, `options`, `note` | — | ChoiceSheet default slot |
| Avatar, disclosure, filter trigger | `BaseAvatar`, `BaseDisclosure`, `BaseFilterButton` | Avatar `size` xs–xl, `rounded`, `variant` default, onForest. Disclosure `title`, `subtitle`, `defaultOpen`. FilterButton `label`, `active`, `count` | Avatar `ring` | FilterButton drawn as `BaseButton` `shape` pill |

## The exemption

A control stays raw, outside every base, only when it is one of the rows below (`editor-chrome-exempt`, tokens.md §7). The exemption covers the control’s own chrome; what sits next to it takes its base.

| stays raw | what it is | the base beside it |
| --- | --- | --- |
| Transport chrome | play and pause discs, scrubbers and their frame markers, loop, sync and speed chips, frame steps, thumbnail strips, the one-bar position label (`SwingAnalyzerTimeline`, `SwingPlayerOneBar`, `VoiceMessagePlayer`, `CoachNoteAudio`, `LessonNotePlayer`) | the notes rail and library rows around a player |
| Editor tool rails | tool picks, telestrator swatches, stroke and fill sliders, undo, clear, pin, mirror and zoom controls, the inspector’s layer rows and sliders (`SwingAnalyzerToolRail`, `SwingAnalyzerInspector`) | the inspector’s P-position grid is `BaseChipRow`, its note `BaseInput` multiline |
| Canvas hit targets and markers | invisible hit areas, annotation pips, the text-label field on the telestrator canvas, the half-screen prev/next targets of a vertical player (`AnnotationLayer`, `AnnotationPip`, `SwingPlayerDrawing`) | the composer’s buttons are `BaseButton` |
| Controls over a media frame | on-video chrome in paper on ink, hover arrows that page a tile, corner star and delete targets, the metrics readout, a thumbnail that plays on tap (`SwingPlayer*`, the `IssueCoachingRail` tile) | position chips are `BaseChipRow` on forest |
| Map glass controls | `HoleMapGlassButton`, the one button style over map imagery: a 48px disc, forest-deep at 78% with blur and a paper inset ring, yellow when on; the hole stepper is the same glass as a pill (`HoleMapTopBar`). A pressed-state glass control is a `*Button`, not a toggle | the map’s menu is `BasePopover`, its select `BaseSelect` |
| Controls over the live camera feed | `CaptureControl`: a 44px dark tile (`bg-ink/85`, `jade-ink` when active) with an icon, a label or both. `BaseButton onForest` is not used for these | a prompt over the feed uses `BaseButton` solid or ghost `onForest`, `shape` pill |
| Full-screen takeovers | the hands-free capture shell, the recorded-review preview | their text buttons are `BaseButton onForest` |
| Hidden native inputs | a visually hidden radio behind an option card, a hidden file input, a honeypot | the option card is `BaseCard` |
| Sheet chrome | a sheet’s drag handle and its collapsed caption | the sheet is `BaseModal` |

## Naming

A suffix names a role, not a surface (`naming-rules-keep`). `Base` prefixes everything in `components/ui`, auto-imported as `<Base*>` together with `StatBlock`, `HeroPanel`, `SgValue`, `ShotCategoryChip` and `CardLoadGate`. A base never imports feature code; `BaseChoiceSheet` importing `SettingsChoicePreview` is the one breach, and the preview registry moves beside the base.

| suffix | means | so |
| --- | --- | --- |
| `*Chart` | a plot inside `ChartCard` or `DispersionPlotCard` | never a card of its own |
| `*Card` | composes `BaseCard` or `ChartCard` | a box inside a card is `rounded-inset` |
| `*Sheet` | wraps `BaseModal` | a sheet’s header is the modal’s title row |
| `*Panel` on forest | `HeroPanel` | eyebrow, title, body, actions |
| `*Badge` | a tone-coloured label, `BaseBadge` | an icon marker on a thumbnail is not one |
| `*Tile` | a reading, `BaseStatTile`; or a media or logo frame | |
| `*Overlay` | floats over a page or map | `BaseOverlay`, `BaseInfoOverlay`, the hole map’s panels |
| `*Skeleton` | a loading placeholder | the pose figure `SwingPlayerSkeleton` is renamed `SwingPlayerPose` |
| `*Toggle` | a switch, `BaseToggle` | `MapLayerToggle` is a glass button and is named `*Button` |
| `*Table` | a shot table | |
| plot rail row | `PlotLeaderboardRow`, a chart control (22px fine pointer, 44px coarse) | not a list row; `BaseListRow` stays 56px and takes no dense variant |
| month grid | content per day is the journal grid; a date pick is `UCalendar` | |

## Overrides

- A call site never overrides a base’s spacing, radius or surface. The gap between form rows comes from the form’s stack, not padding on a control; a sheet separates sections with `BaseDivider` or the section gap, never a border on a chip row; `SettingsBand` keeps one spacing (`pt-5 pb-2`) and loses `spacing` (`call-site-overrides-dropped`).
- Variants are props, never classes: `rounded-full!` is `shape` pill, a surface string is `tone`, a skeleton radius is `shape`. Layout classes (`flex flex-col gap-*`) go on a child of `BaseCard`; a heading inside a card is its `title`; a footer link is `footer` + `footerTo`. ESLint rejects each of these.
- One shell variant: `app-shell:`, keyed to `html[data-app-shell]`, for OS values (safe area, tab bar, header colours), written only in `app.vue`, `components/App*.vue` and `components/app/`. A layout difference below `lg` is `max-lg:`; `mobile-app:` is retired. Outside the shell paths, `data-app-only` and `data-web-only` hide an element per shell (tokens.md §5).
- Surface and lift come from tokens: a card is `--app-card-surface` (`card` on web, `paper` in the app) with no shadow; a modal or sheet over a backdrop has no shadow; `shadow-float` is for the tab pill, action bar, popovers, menus and the add-swing FAB; `shadow-accent-cta` once per screen. Pills and circles are `rounded-full`, rectangular buttons and inputs `rounded-inset`, cards, dialogs and sheets `rounded-panel`.
- Type comes from roles: raw `text-[Npx]` and `font-family-*` fail outside `components/ui`; a type role never changes at a breakpoint; a value sits in the stat family and is never coloured with a data-viz fill (`type-role-fixed-across-breakpoints`, `values-never-dataviz-colour`).
- The count dot is one pattern: a 16px pill at the top-right corner, `type-eyebrow`, the parent’s tones swapped (`bg-red rounded-full h-4 min-w-4 type-eyebrow text-paper` on the avatar, rail, tab bar and profile sheet). It is drawn from one place, not by hand (`unread-count-dot-shared`).

## Deprecated

| deprecated | replacement |
| --- | --- |
| `BaseButton` `variant="forest"` | `variant="solid"` |
| `BaseButton` `variant="pill"` and `rounded-full!` | `shape="pill"` |
| `BaseButton` `link`, `warning` | `inline`; there is no warning button |
| `BasePillButton` | `BaseButton` solid or outline, `shape` pill, sm |
| `BaseFilterButton` as its own drawing | `BaseButton` `shape` pill with `label`, `active`, `count` |
| `BaseCard` `variant="hero"` | `HeroPanel` |
| `BaseCard` `potential`, `sunk`, `padding`, `rounded`, `headerDivider`, `contentClass`, `divided` | `title`, `flush`, `footer` + `footerTo` only |
| `BaseChip`, `BasePill` | `BaseBadge` `shape` tag |
| `BaseAlert` `variant="solid"` | `subtle` |
| `BaseEmpty` `error`, `warning` | `default` or `info` |
| `BaseModal` `size="full"` | sm, md, lg |
| `BaseStatTile` `surface`, `valueClass`, `noteClass` | `tone` |
| `BaseAvatar` `ring` | the hairline is always on |
| `SettingsBand` `spacing` | one spacing |
| `PotentialPanel`, `BasePageHeader`, `ModeTabs` | `HeroPanel`, `AppMasthead`, `BaseSegmentedControl` |
| `BaseScreenSheet` as a public API | `BaseDetailSheet` through `useChartPointSheet` |
| `ChartNotes`, `PlotStatTile`, `PlotStatStrip`, `PlotEmptyState` | `BaseAlert` subtle, `BaseStatTile`, `BaseEmpty` `layout` plot |
| `mobile-app:` | `max-lg:` for layout, the base value for drift, `app-shell:` for OS values |
| Nuxt UI compatibility names (`bg-primary`, `rounded-md`, `text-sm`, `font-bold`, `shadow-lg`) | the tokens; ESLint rejects them in app code |

## Open questions

- `BaseButton`, `BaseInput` and `HeroPanel` ship an `xl` size, and `BaseModal` an `xl` beside the deprecated `full`, none of which tokens.md §7 lists; the ClubGappingSheet fold asks for `BaseButton` xl. Does xl stay in the cap?
- `BaseFilterButton`: tokens.md folds it into `BaseButton`, while the fold rows fold sheet triggers into `BaseFilterButton`. Does it stay as a named trigger drawn with `BaseButton` `shape` pill?
- tokens.md §7 adds `BaseSpinner` for 17 sites while the README rules spinners out of loading states and the unification plan keeps button `loading`, upload and sync progress and media buffering out of the skeleton pass. Which sites is `BaseSpinner` for?
- `BaseStatCard` sets its value in sans (tokens.md §7) and the stat-family rule (§2.2, FINDINGS) wants `type-stat-sm`; the fix restyles every trends stat card. Is that a local delta or a designer ticket?
- `BaseEyebrow` ships an `xs` size (11px, no tracking) beside the two sizes tokens.md names. Keep or drop?
- Which base owns the count dot: `BaseBadge`, `BaseAvatar`, or a new one?
- `BaseCard` `sunk` is removed with no replacement named. What draws a sunk box inside content, and is it a base?
- `BasePopover` is listed as new in tokens.md §7 but exists and is ESLint-banned outside `components/ui`. Is it an internal layer under `BaseOverlay` or a public base?
