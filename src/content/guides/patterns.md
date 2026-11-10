---
title: Interaction Patterns
eyebrow: Product Design
subtitle: The state a screen can be in, what the golfer sees there, and the one component that draws it.
adrs:
  - 2026-10-14-design-warnings-are-amber.md
  - 2026-10-14-design-info-uses-neutral-pair.md
  - 2026-10-14-design-success-fill-jade-ink.md
  - 2026-10-14-design-app-shell-variant-on-data-app-shell.md
  - 2026-10-21-2405-card-title-visual-notes-hierarchy.md
  - 2026-10-28-2629-coach-roster-filters-live-in-a-filter-sheet.md
  - 2026-10-28-2631-coaches-add-students-from-one-import-sheet.md
  - 2026-10-30-2655-dense-note-targets-get-no-halo.md
  - 2026-11-01-2813-phone-clip-actions-are-the-more-menu-as-a-sheet.md
  - 2026-11-02-2928-filter-sheets-apply-live-with-no-result-count-button.md
  - 2026-11-02-2930-swing-upload-opens-as-a-bottom-sheet-on-the-phone.md
  - 2026-11-02-2936-a-long-press-peeks-a-swing-and-tiles-page-through-angles.md
  - 2026-11-02-2937-phone-adds-swings-from-a-floating-button-and-coaches-are-not-offered-adding.md
  - 2026-11-02-2994-library-tiles-get-a-star-and-delete-menu.md
  - 2026-11-03-swing-capture-records-only-in-the-native-app.md
  - 2026-11-04-3007-phone-notes-open-as-one-drawer-over-the-player.md
  - 2026-11-04-3078-profile-sheet-unread-uses-the-avatar-badge.md
  - 2026-11-05-3104-round-route-map-tab-takes-the-tab-bars-place.md
---

## How to use this page

Each pattern is a rule and the component that implements it; a state with no row is an open question, not a reason to hand-roll one. State colours: red for errors and destructive actions, amber for warnings, `jade-ink` for success, the neutral pair for info.

## Loading

A loading state holds the place of what is coming, in its own outline, so nothing jumps when data lands, and announces "Loading …" to a screen reader. A skeleton’s radius follows what it stands in for: `rounded-mark` for text, `rounded-inset` for a control or row, `rounded-full` for an avatar, the card’s own radius for a whole card.

| state | what the user sees | component | where it is decided |
| --- | --- | --- | --- |
| First load of a main screen (Home, Activity, Improve, Performance, Settings, Library) | The screen’s outline under its own header, until the page’s data has settled | `AppLaunchSkeleton` with `screen`; bodies under `web/components/app/launch/`; each page gates it (`pages/index.vue` until hydrated and the handicap settled, `pages/settings.vue` on `loading`) | PR 2514 "launch and card skeletons on phone and desktop" |
| A card whose fetch is running | The card’s own outline in place: `stats`, `chart`, `map`, `list` or `block` shape, the card’s gutters (24 px web, 20 px phone) | `CardLoadGate` (`loading`, `label`, `shape`, `count`, `height`; `bare` for a card already on screen) | PR 2514; inventory note on `CardLoadGate` (draws no surface of its own) |
| One placeholder bar | A pulsing `paper-sunk` block (`paper/10` on forest) | `BaseSkeleton` (`onForest`); `shape` prop to come | inventory row `skeletons-to-baseskeleton` |
| A button’s own action in flight | The leading icon becomes a spinner and the button is inert | `BaseButton` `loading` | `BaseButton.vue` |
| A sync or profile build running | A centred card: spinning loader in a jade disc, title, description, progress bar and detail; elsewhere a strip in the forest chrome with the same progress | `BaseSyncState` (via `DashboardSyncing`); `AppNotice` `sync`, hidden where a screen shows the sync in full (`useHideSyncNotice`) | `app.vue`, `AppNotices.vue` |

## Empty

An empty state is a dashed panel on `paper-sunk` with an icon, an uppercase title, one sentence and the action that fills it; a chart with too little data keeps its height and says so in one muted sentence.

| state | what the user sees | component | where it is decided |
| --- | --- | --- | --- |
| A list or section with nothing in it | Dashed `rounded-panel`, `i-lucide-inbox` or a named icon, title, description, `#actions` | `BaseEmpty` (28 sites); `error` and `warning` variants deprecated, one site each | inventory row `empties-to-baseempty`; tokens.md §7 |
| A chart with too little data | The plot’s own height, one `type-body-sm` muted sentence | `PlotEmptyState` (`message`, `height`; 7 sites); tokens.md §7 folds it into `BaseEmpty` `layout="plot"` | inventory row `empties-to-baseempty` |
| An empty swing library | The empty card carries Record and Upload; Filters and Select are hidden; an empty filter result shows a filter icon and "No swings match" with no button | `SwingPlayerLibrary` | ADR 2937 |
| An empty coach roster | "No students yet" opens the Import students sheet | `CoachStudentList` | ADR 2631 |

## Error

An error names what failed and what to do next, in red, never as a browser dialog. A screen that fails to load shows a `BaseAlert` with a title; a field shows its line under the field; a request that fails after a tap reports in a toast.

| state | what the user sees | component | where it is decided |
| --- | --- | --- | --- |
| The route itself fails (404, 500) | A page with its own chrome outside `app.vue`: the code, a course scene, a headline and a way home | `web/error.vue`; its button sits outside every token and folds into `HeroPanel` | inventory row `heroes-to-heropanel` |
| A screen’s data fails to load | `BaseAlert` `error`, icon, a title such as "Couldn’t load your dashboard" | `BaseAlert` (`color="error"`, `subtle`; 34 sites) | ADR warnings-are-amber; inventory row `alerts-to-basealert` |
| A field fails validation | A `text-small text-red` line under the field, replacing the hint | `BaseFormField` `error` | `BaseFormField.vue` |
| A request fails after a tap | A toast, `color: 'error'`, titled with the message | `useToast` (17 error toasts) | `app.vue` toaster |
| A chart’s caveat or fault | A note under the visual: fault `error`, watch `warning`, good `success`, neutral `info`; tints `red-soft`, `amber-soft`, `jade-soft`, `paper-sunk` | `ChartNotes` in `ChartCard` today, folding into `BaseAlert` subtle | ADR 2405; inventory note `D1-ChartNotes` |
| An account condition (demo, past due, paused, coach request, update available, held share import) | One strip in the forest chrome above the screen’s header: jade icon for info, amber for warning, a yellow eyebrow, actions, an optional progress bar | `AppNotice` via `AppNotices`, one at a time by priority | PR 2340 "render top notices inside the forest chrome" |

## Confirm

A destructive or irreversible action asks once, in the app’s own small dialog, never through `window.confirm()`, which cannot be styled, cannot be tested and blocks the thread. A choice that saves on pick does not ask.

| state | what the user sees | component | where it is decided |
| --- | --- | --- | --- |
| Delete, revoke, disconnect, leave with unsaved changes | A `size="sm"` dialog: title, one sentence, an optional error line, Cancel (ghost) and a solid confirm, red by default, `primary` or `neutral` when not destructive, with `loading` | `BaseConfirmModal` (24 sites); `cancelLabel` to come | inventory row `modals-and-sheets-to-basemodal` |
| Leaving the hole map with a staged move | The same dialog on `layer="top"`, so it clears the full-screen map | `RoundDetailScreen` discard prompt from `useHoleMapEditing` | `useHoleMapEditing.ts` |
| A pick in a settings sheet | The radio lands, the sheet closes after 180 ms, the note under the options says it is saved | `BaseChoiceSheet` | `BaseChoiceSheet.vue` |
| A write in demo mode | A warning toast "Demo mode is read-only" with a Create account action | `plugins/demo-readonly.client.ts` | the plugin |

## Feedback

Feedback for a finished action is a toast: at the top on a phone, where the thumb, the chat launcher and the home indicator own the bottom, at the bottom right on the desk. A count is a 16 px pill at the top-right corner, `type-eyebrow`, the parent’s tones swapped, red on the avatar.

| state | what the user sees | component | where it is decided |
| --- | --- | --- | --- |
| An action succeeded or failed | A toast: `success` (10 sites), `error` (17), `warning` (1) or untinted (11); `top-center` below 640 px, `bottom-right` above | `useToast` → `UApp :toaster` in `app.vue` | `app.vue` |
| A reversible change | A line saying what happened with Undo, gone after 6 s, refused while another change is in flight | `useUndoNotice` (round detail only) | `useUndoNotice.ts` |
| A state worth keeping on screen | `BaseAlert` `success` (14 sites) in `jade-soft`; a solid success fill is `jade-ink` with paper text | `BaseAlert` | ADR success-fill-jade-ink |
| Unread messages | The red count bubble on the avatar, the rail, the tab bar and the profile sheet | hand-drawn in `AppProfileAvatar`, `AppProfileHub`, `AppRail`, `AppTabBar`, `CoachMessageButton`; one component to come | ADR 3078; inventory row `unread-count-dot-shared` |

## Drill-down

Reading comes before opening. On a fine pointer, hover reads a chart mark and a click opens it; on touch, a tap shows the mark’s tooltip and stays put, a two-second hold opens it, and a long press peeks a tile. What opens is a sheet on the phone and a hover card, popover or dialog on the desk; the sheet’s action pushes the round or session on as a screen.

| state | what the user sees | component | where it is decided |
| --- | --- | --- | --- |
| A chart point, fine pointer | A `w-80` card on `rounded-panel` with `shadow-float` at the pointer | `BaseDetailHoverCard` → `BaseDetailSheetCard`, mounted by `plugins/chart-hover-card.client.ts` | PR 2427 "one Vue card for the chart sheet and the desktop hover card" |
| A chart point, touch | Tap: tooltip; two-second hold: the same card as a bottom sheet, mounted once in `app.vue`; its action pushes the round or session | `useChartHoldToOpen`, `useChartPointSheet`, `BaseDetailSheet`, `BaseScreenSheet` | PR 1710 "redesigned chart-point sheet"; ADR 2655; inventory note `bases-await-adoption` |
| A round from the list in the app | A full-screen sheet pushed from the right over the tab bar; a deep link renders the route and suppresses the bar on its Hole Map tab | `BaseScreenSheet`; `useSuppressChrome` | PR 1691; ADR 3104 |
| A menu or a single choice | A popover on the desk; a sheet in the installed app below `lg`, with the same rows | `BaseOverlay`, `BaseChoiceOverlay`; `BasePopover` and `BaseModal app-sheet` beneath | PR 2421; ADR 2813 |
| A stat explanation | A hover tooltip on the desk; a 44 px tap target opening the chart-point sheet in the app | `BaseInfoOverlay` → `ChartInfoTooltip` or `useChartPointSheet` | inventory row `responsive-variants-by-width` |
| Acting on one tile | Right-click menu for a mouse or trackpad; on the phone a long press peeks the swing with its actions under the preview | `BaseContextMenu`; the library peek | ADRs 2994, 2936 |
| Notes over the phone player | One drawer over the video, folded to a caption, every note a drag away | `SwingPlayerNotesDrawer` | ADR 3007 |
| Filtering a list | A Filter pill opens a sheet that applies live, with a reset icon and no footer | `BaseFilterButton`, `ActivityFilterSheet` | ADRs 2629, 2928 |

## Overlay rules

- Every sheet is a `BaseModal` presentation; a sheet’s header is the modal’s title row and the modal draws the close. Hand-rolled copies fold into `BaseModal`, `BaseConfirmModal`, `BaseDetailSheet` and `BaseChoiceOverlay` (inventory row `modals-and-sheets-to-basemodal`).
- Today `BaseModal` takes `sheet` (a bottom sheet below `sm`, 640 px, in every shell; a centred dialog above), `app-sheet` (a real sheet with drag, focus trap and keyboard inset, in the installed app below `lg` only) and `tablet-sheet` (a coarse pointer from 640 px). tokens.md §7 names the target `presentation` dialog, sheet or auto and retires `full`.
- Sheet geometry and the 20 px content gutter are the same in both shells; touch targets are 44 px via `tap-44` on `pointer: coarse` (tokens.md §5).
- A modal stacks only through `elevated` (a partner’s manage modal over the import panel, z 1010) or `layer="top"` (over the full-screen hole map, z 3010).

## Chrome

- The installed app draws what a browser tab must not with `data-app-only`; the browser’s copy of app chrome carries `data-web-only` and hides in the app below `lg` (tokens.md §5). Swing capture records only in the native app, so its settings sit in a `data-app-only` section.
- The tab bar leaves the screen only through `useSuppressChrome` (`html.chrome-hidden`), in the installed app below `lg`, as on the round route’s Hole Map tab; the library’s floating add button hides and returns with it (ADRs 3104, 2937).
- Editor chrome is exempt from the bases: transport controls, tool rails, scrubbers, canvas hit targets, on-video and map-glass controls and hidden native inputs stay raw; `HoleMapGlassButton` is the one button over map imagery, `CaptureControl` the one over the camera feed (inventory row `editor-chrome-exempt`).

## Open questions

- Which breakpoint is `presentation="auto"`: the `sheet` prop’s 640 px in every shell (ADRs 2930, 2813) or `app-sheet`’s installed app below 1024 px (`BaseOverlay`, `BaseInfoOverlay`)?
- Nothing on record says overlays never stack; `elevated` is used in 7 files and `layer="top"` in 2 — rule or exception?
- 50 of 82 error branches are a bare `<p>`, 16 a `BaseAlert` — is a field error always `BaseFormField` and every other error a `BaseAlert`, and when does a failed request get a toast?
- 39 toasts in 29 files, 11 without a colour, and no ADR says which outcomes get a toast, an inline alert or a notice strip — is an untinted toast allowed?
- Undo exists once (round detail, 6 s) — the pattern for every reversible change, or a toast with an action?
- `BaseEmpty` has neither the `info` variant nor the `layout` prop tokens.md §7 lists, and one site renders an error through it — does `BaseEmpty` ever carry an error?
- One `window.confirm()` remains, in `SwingAnalyzerClipBrowser.vue` (behind the `swing-compare` flag) — fold into `BaseConfirmModal` or delete with the studio?
- The notes drawer’s drag code is its own, apart from the app’s sheet (ADR 3007) — a second drawer mechanism, or a fold into `useCapSheet`?
- `BaseSpinner` does not exist (tokens.md §7 lists it); the spinner is hand-drawn in `BaseSyncState`, `AppNotice` and `BaseButton` — one component, which sizes?
- The unread count dot is hand-drawn in five files — a `BaseBadge` variant or its own component?
