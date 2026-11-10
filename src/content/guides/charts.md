---
title: Charts
eyebrow: Product Design
subtitle: What a chart is made of, how it is coloured and read, and the spec every new chart is written in before it is built.
adrs:
  - 2026-08-13-trends-charts-are-built-from-shared-shells.md
  - 2026-04-23-game-area-chart-colours-are-vivid-brand-jade-and-amber.md
  - 2026-08-13-every-chart-writes-its-own-note.md
  - 2026-08-13-plot-stat-tiles-are-two-lines.md
  - 2026-08-13-filter-rails-print-the-rate-on-every-row.md
  - 2026-08-13-every-trend-stat-card-has-a-body.md
  - 2026-10-21-2405-card-title-visual-notes-hierarchy.md
  - 2026-10-14-trend-points-carry-their-round-or-session.md
  - 2026-10-14-design-selection-marks-forest-on-light.md
  - 2026-04-16-third-party-instances-held-in-shallowref.md
---

## Anatomy

Every chart renders inside `ChartCard` or `DispersionPlotCard` and declares no card, heading, empty state or notes markup of its own; it supplies its plot, its filters and its verdict. A card reads title, visual, AVA Golf Notes, with nothing between the title and the plot. The parts, top to bottom:

| part | component | rule |
| --- | --- | --- |
| Shell | `ChartCard` for any chart; `DispersionPlotCard`, which wraps it, for a spatial plot with equal-unit axes and a rail | Renders `BaseCard` with `title`; `surface` names the card in tracking, `data-annotate-key` names it for notes. `SessionMetricTrendChart` still heads a `BaseCard` itself and moves onto `ChartCard` |
| Title | `title` → `BaseCard` `title`, `type-title`, sentence case | No headline, unit or qualifier line between it and the plot |
| Eyebrow | none above the title | The eyebrow role appears only as the plot caption, the rail-group heading and the notes label |
| Description | `description` | What the chart shows and what to look for, the same sentence for every golfer. Falls into the notes when there is no verdict |
| Controls | `#controls` | A switch that changes what the whole card shows, centred on the heading line; below `sm` it stacks at 44px. A view switch is `BaseSegmentedControl` |
| Readings | `#actions` with `PlotStatTile`, or `tiles` + `strip` → `PlotStatStrip` | Two lines, label and value, never three; a multi-part reading passes `lines`, a caveat or count goes in `info`. The strip is one ruled row, full-bleed below `lg`. Both become `BaseStatTile` |
| Legend | `legend` → `ChartLegendSwatch` | One entry per mark shape drawn: dot, line, cross, ring, diamond; `dashed` follows the stroke. Over the plot’s top-left from `lg`; on the phone only in the expanded view |
| Gate | `PlotInteractionGate` | On a touch screen the plot takes no pointer events until “Tap to explore”; off when the plot expands instead |
| Plot | `PlotCanvas`; its `el` is what `useEChart` mounts into | ECharts on the canvas renderer, the instance in a `shallowRef`. 500px (`h-125`), `fill` beside a tall rail, or `aspect-square` when expandable. A time-series chart draws its own `ref="chartRef"` div at `h-60` to `h-75` |
| Caption | `PlotCanvas` `#caption` | `type-eyebrow text-ink-muted`, centred: the shot count, the gesture hint. An expanded lateral plot prints Left and Right either side |
| Filter rail | `#rail` → `PlotRailGroup` → `PlotFilterBars` → `PlotLeaderboardRow` | One bar per option ranked by rate, an All row, tap to filter, tap All to come back. Every row prints its rate; below the sample threshold the label greys, the bar is dropped and the count goes to the row title. Beside the plot from `lg`, folded to its header on a coarse pointer, in the expanded view on the phone. Rows are 44px on touch, 22px on a fine pointer |
| Empty | `empty`, `emptyMessage`, `emptyHeight` → `PlotEmptyState`; `#empty` for a prompt | Keeps the plot’s own height so the card does not jump. Default copy “Not enough data yet.”; a prompt (connect a launch monitor, play a round) goes in the slot. Becomes `BaseEmpty` `layout` plot |
| Loading | `CardLoadGate` `shape="chart"` | Draws the shape of the plot, never “Loading…” |
| Notes | `verdict` → `ChartNotes`, rendered by `ChartCard` only, always last | `{ tone, text }`, tone fault, watch, good or neutral, computed by the chart as `ownVerdict`; `verdict` and `description` are props defaulting to it. `null` falls through to the registry rationale by `explanationKey`; `closingNote` ends it. Becomes `BaseAlert` subtle titled “AVA Golf Notes”: fault error, watch warning, good success, neutral info |
| Point detail | `statTooltip(builder)` on the tooltip option → `BaseDetailHoverCard` on desktop, `BaseDetailSheet` in the app | One `StatTooltipCard`, drawn by `BaseDetailSheetCard` in both (PRs #2427, #2437). Hole and shot cards come from `buildHoleShotCard`, `holeSgStatCard` and `holeCardTooltip` |
| Explainer | `BaseInfoOverlay` | A tooltip in a browser, the detail sheet in the app; `ChartInfoTooltip` is internal to `components/ui` |

## Colour

- A chart reads its colours from `CHART_COLORS` (`web/composables/useEChart.ts`) and `DATAVIZ.*` (`web/utils/design-tokens.ts`) and types none of them. They live on `:root` and in `.ts`, outside `@theme`, so they never become `text-*` or `bg-*` utilities (tokens.md §3.2).
- Game areas, longest to shortest shot: off the tee `DATAVIZ.chart.ott`, approach `.approach`, around the green `.atg`, putting `.putt`; the brand jade and amber at full saturation.
- Gain is jade, loss is red, flat is `ink-faint`: `signalUp`, `signalDown`, `signalFlat`, and `BAR_TONE.good`, `.bad`, `.neutral` for bars. Scores run `DATAVIZ.scores` from eagle to triplePlus, terrain is `DATAVIZ.terrain`, a miss mark `DATAVIZ.plot.miss`, the tendency `--dataviz-tendency`.
- Grid lines are `--dataviz-grid`, mark lines `line`, the peer benchmark a dashed `bracket` line via `bracketMarkLine`. No axis line and no ticks (`CHART_AXIS_STYLE`); axis labels at `--text-micro`.
- Chart text: axis and label text is `ink-muted`; a label on a data-viz fill is `ink`.
- A reading never takes a data-viz fill as its text colour. Values are `ink`, `jade-ink` for a gain, `red` for a loss, `amber-ink` for a warning; a series colour marks, it never writes (`values-never-dataviz-colour`).
- The area under a line is `areaGradient(seriesColour, 0.15, 0.02)`, built from the line’s own colour.
- Selection is forest on light grounds: a selected rail row is `jade-soft`, a flush selected row carries a `border-l-forest` rule.
- Note tones: fault `red`, watch `amber-ink`, good `jade-ink`, neutral `ink-muted`, on their soft tints.

## Interaction

- Desktop, fine pointer: hovering a mark opens the hover card (`BaseDetailHoverCard`: 320px, `rounded-panel`, `border-line`, `bg-card`, `shadow-float`, mounted by `plugins/chart-hover-card.client.ts`). Where a chart wires `useChartHoldToOpen`, a click opens the round or session outright.
- Phone and app: a tap opens the point sheet. `useEChart` judges the tap itself (12px slop, 600ms, a mark within 30px) and answers with the nearest mark; the ECharts tooltip is hidden. The sheet stays until dismissed; its action (“Tap to view round”, session, shot) pushes `BaseScreenSheet` in from the right. A two-second hold opens outright. One sheet serves every chart, mounted once in `app.vue` and opened through `useChartPointSheet` (`openPoint`, `openDetail`, `openShot`, `openActivity`).
- A point carries its identity, `_raw.roundId`, `sessionId`, `shotId`, so the sheet knows where to go.
- Touch: a plot is inert until “Tap to explore”, so the page scrolls past it. In the app a dispersion plot is a square picture; “Tap to expand chart” opens it full screen (`expandable`) with the legend, the Left and Right caption, zoom buttons for a cursor only (a pinch does the same) and the rails under a 40vh scroller. Escape or the close button returns. It sits at z-990, under the app’s sheets.
- Filters: the rail filters the plot in place; a view switch on the heading line is `BaseSegmentedControl`; a filter sheet’s choices are `BaseChipRow` rows and apply live; timeframe tabs are `BaseSegmentedControl` underline.
- Labels adapt by width, not pointer: `useNarrowPlot` (below 640px) picks the short form; `usePlotAppFrame` gives the app 4, 4, 8, 8 insets and no axis names; `labelGutter` and `namedGutterGrid` keep a symmetric scale centred.
- The plot resizes with its box. A chart whose hit target is wider than its marks passes `tapHit`; a chart whose mark opens something of its own passes `onPoint`.

## Spec format

A new chart is specified in these fields before it is built, in the ticket that asks for it. They are what the existing charts share: props in, a shell, a verdict, a point card. Copy the template and fill every line; a line that does not apply says so.

```
Chart: <Name>Chart — shell: ChartCard | DispersionPlotCard — lives in: <route or card>
Question: <title, sentence case> — description: <one sentence, the same for every golfer>
Data grain: one point = <round | session | shot | hole | club>; props: <rounds | shots | points | clubs>, nothing fetched; identity per point: <roundId | sessionId | shotId>
Sample: minimum <n rounds | shots>; below it: <empty message | prompt>; empty height: <h-…>
Encoding: mark <line | bar | scatter | boxplot | radar | custom>; x: <…>; y: <…>; series and colour: <CHART_COLORS.… | DATAVIZ.…>; legend: <label, shape>; reference lines: <peer avg | target | none>; axis formatters; narrow-plot label form
Readings: <label: value> × n, two lines each; info: <caveat | count>
Filters: rail <title; rows value, label, percent, shotCount, eligible; All row; views>; controls: <segmented options | none>
States: loading | empty | thin sample | selected | expanded | no identity
Point payload (StatTooltipCard): title, badge, meta, shotLine, scales, rows | columns | items, hero, stats, note, footer; action opens: <round | session | shot> with params <…>
Verdict (ownVerdict): tone <fault | watch | good | neutral> by <threshold>; sentence anchored to <count | share>; null below <n>; explanationKey fallback; closingNote
Platform: desktop <rail beside, legend over plot, hover card>; tablet <readings on their own row, rail folded>; phone web <…>; app <square plot and expand, point sheet, caption Left/Right>
Public surface: <none | share page: props only, no session, default unit>
```

## Open questions

- Game-area values: the ADR names `#186B54` and `#3BA184`; tokens.md §3.2 and `DATAVIZ.scores` use `--dataviz-ott #225142` and `--dataviz-approach #349683`, and `DATAVIZ.chart.ott` resolves to `--color-jade-ink` with `#186B54` only as a fallback. Which four values are canonical?
- Axis labels: tokens.md makes chart text `ink-muted`, but `CHART_AXIS_STYLE` draws axis labels in `ink-faint`, which §3.1 reserves for non-text. Is an axis label text, and does it move to `ink-muted`?
- Plot heights: `PlotCanvas` is 500px, `DispersionPlotCard` floors at 600px, and the time-series charts pick `h-60`, `h-64 sm:h-70` or `h-75` each. Is there a height set, and does `PlotCanvas` cover the time-series charts?
- Desktop click: `useEChart` binds a click only in the app, so a desktop click on a time-series point does nothing beyond the hover card, while `useChartHoldToOpen` opens the round on click. Which is the rule for a chart that has both?
- The scoring-trend date-range tabs: `docs/plans/design-unification.md` §4 leaves the hand-built underline tabs alone; the fold row makes them `BaseSegmentedControl` underline. Which holds?
- Shell overrides: `emptyHeight`, `railWidth`, `minPlotHeight`, `display` and the `#empty` slot exist for single charts and widen the shell’s API. Which stay props and which become fixed values?
- Share surfaces: the folds mount the app charts on public pages, with `ClubGappingChart` gaining a `clubs` prop and the strike chart’s per-club delta becoming “either the chart’s one-club view or a baseline the chart gains”. Who decides each per-chart choice?
- Where does a filled-in chart spec live once the chart ships: the ticket only, or a file under `docs/plans/`?
