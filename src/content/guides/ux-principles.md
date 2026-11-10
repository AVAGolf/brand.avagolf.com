---
title: UX Principles
eyebrow: Product Design
subtitle: Eight rules that settle the disputes a screen, a sheet or a cleanup PR raises.
adrs:
  - 2026-10-14-design-mobile-web-adopts-app-layout.md
  - 2026-10-14-design-grouped-list-variables-width-gated.md
  - 2026-10-14-design-app-shell-variant-on-data-app-shell.md
  - 2026-10-14-design-hero-xl-for-the-home-handicap.md
  - 2026-10-21-2405-card-title-visual-notes-hierarchy.md
  - 2026-10-21-ports-refactors-and-fixes-keep-the-ui-unchanged.md
  - 2026-10-27-design-system-unification-avoids-app-wide-restyles.md
  - 2026-10-28-2629-coach-roster-filters-live-in-a-filter-sheet.md
  - 2026-10-30-2655-one-note-key-per-round-hole-club-and-phase.md
  - 2026-10-30-2668-the-profile-sheet-holds-the-mode-switch.md
  - 2026-10-30-2744-swing-library-filters-live-in-one-filter-sheet.md
  - 2026-11-01-2807-phone-overlays-sheet-disables-what-the-angle-cannot-draw.md
  - 2026-11-01-2813-phone-clip-actions-are-the-more-menu-as-a-sheet.md
  - 2026-11-01-2866-a-landed-swing-opens-in-the-swing-player.md
  - 2026-11-02-2803-phones-open-a-clip-on-the-video-alone.md
  - 2026-11-02-2803-phones-open-a-clip-with-notes-closed.md
  - 2026-11-02-2928-filter-sheets-apply-live-with-no-result-count-button.md
  - 2026-11-02-2930-swing-upload-opens-as-a-bottom-sheet-on-the-phone.md
  - 2026-11-02-2933-swings-are-found-by-date-and-every-chosen-angle-not-search.md
  - 2026-11-02-2937-phone-adds-swings-from-a-floating-button-and-coaches-are-not-offered-adding.md
  - 2026-11-03-2935-coaches-get-no-library-selection.md
  - 2026-11-03-hands-free-is-the-only-single-phone-capture.md
  - 2026-11-04-3007-phone-notes-open-as-one-drawer-over-the-player.md
  - 2026-11-07-2998-a-swings-angles-play-in-the-one-player.md
---

## 1. One composition at every width

A screen has one information architecture; below `lg` (1024 px) only its form changes — a sheet for a dialog, a chip row for a select, stacked panes for side by side — never which content shows or in what order.

Settles: whether phone browser and installed app may lay out one width differently (no), and whether a difference is keyed to width or shell (`max-lg:`; only what the OS imposes is keyed to `html[data-app-shell]`).

From: PR 2307 "one composition at every width — desktop adopts the app shell"; the three 2026-10-14 ADRs on the platform layer; inventory rows `responsive-variants-by-width`, `platform-layer-per-shell`.

## 2. Handicap first

Home opens on the golfer’s handicap, its target and the one lever that moves it; the handicap is set in `type-hero-xl` (64 px), a size no other screen may use.

Settles: what the first screen is for, and whether the signature figure may shrink to fit the type scale (no).

From: PR 2320 "handicap-first Home hero with target and top lever"; the `hero-xl` ADR.

## 3. Lead with what the golfer has

A screen opens on a summary of the golfer’s own data and keeps depth one tap away: Home without a focus leads with what the golfer has, a round lands on its summary, a shot sheet leads on carry and edits only what was measured, a phone opens a clip on the video alone, and a card reads title, visual, AVA Golf Notes with nothing between.

Settles: placeholders on a first view (none), a headline stat above a chart (none), and whether a phone opens the 3D figure, the notes panel or the full-screen map unasked (no).

From: PRs 2322, 1761, 1762, 1723; ADRs 2405, 2803 (both) and 3007.

## 4. One surface per thing

One component draws a thing wherever it appears: one swing player for a landed, a library and a multi-angle swing; one chart-point card for the phone sheet and the desktop hover card; one ••• menu for phone and desk; one profile sheet in both modes; one note key per round, hole, club and phase; one capture screen.

Settles: whether a platform, a mode or a feature may keep its own copy (no), and what a consolidation PR targets (the copy, never a second base).

From: ADRs 2866, 2998, 2813, 2668, 2655 and hands-free capture; PRs 2427, 2437, 2733; inventory row `duplicate-feature-components`.

## 5. A sheet in the app, a popover on the desk

Anything small the golfer opens — a menu, a picker, a chart point, a stat explanation, an upload, a filter — rises as a bottom sheet on the phone and sits as a popover, hover card or centred dialog on the desk, with the same content in both.

Settles: whether a phone gets a popover (no), and whether a phone sheet may be hand-rolled (no — Interaction Patterns names the component per case).

From: PR 2421 "adaptive overlay primitives (sheet in app, popover on desktop)", PR 2427; ADRs 2930, 2813; inventory row `modals-and-sheets-to-basemodal`.

## 6. Offer only what the viewer can do

An action the server would refuse is not drawn — a coach viewing a student sees no Record, Upload or Select — while a control the current clip cannot serve stays in place, greyed, with one line saying why.

Settles: hide against disable, and whether a control may come and go per item (no — a fixed list teaches which angle each overlay needs).

From: ADRs 2937, 2935, 2807.

## 7. The list is the result

Filters live behind one Filter pill in a sheet, apply on every tap, and carry no apply button and no result count; the list behind the sheet shows the result, and a swing is found by date and angle, not by search.

Settles: filter footers and "Show N" buttons (none), and search fields on lists that have a date (none).

From: ADRs 2629, 2744, 2928, 2933.

## 8. Fixes change nothing visible

A port, refactor or fix keeps the UI exactly; a consolidation accepts a small local delta from merging two components but never an app-wide change of a type role, weight or surface, and never a reversal of a closed ticket’s choice; a design change ships as its own ticket with phone and desktop screenshots.

Settles: whether a cleanup may improve the look (no), and what to do when a fix seems to need a layout change (stop and ask).

From: the ADRs on ports, refactors and fixes (2026-10-21) and design-system unification (2026-10-27).

## Open questions

- Principle 6: ADR 2937 also hides Filters and Select on an empty library, a data case hidden rather than disabled — does the role/data split hold, or is the rule "hide when nothing could result"?
- `PlotLeaderboardRow` keeps a 22 px fine-pointer rail row in one verdict and folds into `BaseListRow` in another — under principle 1, which gives?
- Touch is decided per feature (`useChartHoldToOpen`, ADRs 2936, 2994) — is "a tap reads, a hold opens" a principle for every chart, including the hole grid and miss strip?
- Copy has no principle (one ADR, 2630; the July voice rules are retired) — does a copy rule belong here or on a voice page?
- Sign-out on the desktop rail only (2908) assumes phone sign-outs are rare, with no usage data — confirm before publishing it as a rule.
