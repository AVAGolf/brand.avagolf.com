---
title: Page Templates
eyebrow: Product Design
subtitle: The five page templates, each defined for web, iPad and iPhone, and the components each is built from today.
adrs:
  - 2026-10-14-design-mobile-web-adopts-app-layout.md
  - 2026-10-14-design-grouped-list-variables-width-gated.md
  - 2026-10-14-design-card-surface-per-shell.md
  - 2026-10-14-design-hero-xl-for-the-home-handicap.md
  - 2026-10-28-2629-coach-roster-filters-live-in-a-filter-sheet.md
  - 2026-10-28-2630-coach-roster-row-is-compact-on-the-phone-and-a-table-on-desktop.md
  - 2026-10-28-2631-coaches-add-students-from-one-import-sheet.md
  - 2026-11-02-2928-filter-sheets-apply-live-with-no-result-count-button.md
  - 2026-11-02-2930-swing-upload-opens-as-a-bottom-sheet-on-the-phone.md
  - 2026-11-02-2931-swing-library-groups-swings-in-month-bands-of-day-sheets.md
  - 2026-11-02-2935-library-selection-starts-from-a-select-button.md
  - 2026-11-02-2937-phone-adds-swings-from-a-floating-button-and-coaches-are-not-offered-adding.md
  - 2026-11-04-3056-phone-library-select-and-filter-sit-on-the-coach-reviews-band.md
  - 2026-11-05-3104-round-route-map-tab-takes-the-tab-bars-place.md
---

## The five templates

Every signed-in page is one of five templates. A template is defined once per platform, and the platform is a width: web 1440 and iPad 1032 are above `lg` (64 rem) and share one composition; iPhone 440 and the phone browser share the other. Only OS values (safe area, tab bar, sticky offset) follow the shell.

| Template | Reference pages | Built from today |
| --- | --- | --- |
| Hub | `/` (`web/pages/index.vue`, `web/components/dashboard/**`) | `AppHeaderShell`, `HeroPanel` (`DashboardHero`), the `HOME_GRID` class strings, `BaseCard`, `PageContainer` for the empty, syncing and error branches, `AppLaunchSkeleton screen="home"` |
| List | `/activity/rounds`, `/activity/sessions`, `/improve/videos`, `/coach/players` | `AppMasthead` + `CategorySwiper` in `CategoryPages`, `PageContainer`, `ActivityList`, `SettingsBand sunk`, `BaseFilterButton`, `ActivityFilterSheet`, `ActivityLink` rows, `StatBlock`, `BaseEmpty`, `AppLaunchSkeleton screen="activity"` |
| Detail | `/activity/rounds/[roundId]` (`RoundDetailScreen`), `/activity/sessions/[sessionId]` (`SessionDetailScreen`) | `AppPageHeader`, `StatBlock`, `RoundHero` / `ActivityHero`, `ActivityDetailLayout` (session only), `BaseCard`, `HoleMap`, `HoleMapSheet`, `RoundActions`, `RoundEditSheet`, `SessionShotStatsSheet`, `SessionFilterSheet` |
| Flow | `/onboarding/**` (`web/components/onboarding/**`), capture (`web/components/swing-capture/**`) | `AppHeader disable-nav`, `OnboardingStepNav`, `OnboardingStepLayout`, `OnboardingFooter`, `BaseCard`; `HandsFreeCaptureShell`, `CaptureChrome`, `CaptureControl`, `CaptureJoinPrompt` |
| Settings | `/settings/**` | `settings.vue`, `MasterDetail`, `SettingsProfileHeader`, `SettingsHubList`, `SettingsBand`, `SettingsList`, `SettingsRow`, `SettingsChoiceGroup`, `BaseChoiceOverlay`, `SettingsSheetContent`, `SettingsSheetHeader` |

## Shared values

The platform layer (`docs/design-system/tokens.md` §5, `web/assets/css/main.css`) sets these once; a template never redefines them.

| Value | Web 1440 | iPad 1032 | iPhone 440 |
| --- | --- | --- | --- |
| Page ground `--app-page-ground` | paper | paper | paper-sunk |
| Card surface `--app-card-surface` | card (white) | card | paper |
| Card radius and border `--app-card-radius` | 12 px, 1 px `line` | 12 px, 1 px `line` | 0, none |
| Page gutter | `.container`: 1280 px measure, 40 px | same | `--app-bleed-gutter` 0; sections run edge to edge |
| Content gutter | 24 px inside a card (`p-6`), 24 px list rows (`lg:px-6`) | same | 20 px (`px-5`) |
| Section gap `--app-section-gap` | 16 px | 16 px | 8 px, drawn as the sunk ground between flat sections |
| Row gap and divider | 12 px, none | same | 0, 1 px `line` |
| List row minimum `--app-list-row-min-h` | 44 px | 44 px | 52 px |
| Bottom reserve `--app-chrome-bottom` | 68 px for the chat launcher | same | tab bar 53 px + 68 px + safe area |

A card carries no shadow. On a phone a `BaseCard` is a section, not a container: `fullBleed` drops its radius and border and the sunk band between sections separates it from the next. The masthead is forest at every width; its measure from `lg` is the same 1280 px box as `.container`, so a title and the first card share an edge.

## Hub

| | Web 1440 | iPad 1032 | iPhone 440 |
| --- | --- | --- | --- |
| Header | No masthead; the `h1` is `sr-only` and the hero sits on a full-width forest band (row 1 of `HOME_GRID`) | Same | `AppHeaderShell` top row with the AVA lockup and the avatar (`data-app-only`), then the hero as a full-bleed forest band |
| Ground and card | paper; white 12 px cards | Same | paper-sunk; flat paper sections |
| Gutter | `HOME_GRID`: 12 columns of 78 px with 24 px gaps between flexible outer columns, a 1200 px measure | Same | 0; 20 px inside each section |
| Section rhythm | Two columns 8 + 4 (`HOME_MAIN`, `HOME_ASIDE`), `lg:gap-6`, full rows `HOME_FULL`, `lg:pb-12` | Same | One stack ordered by `max-lg:order-*` (chart, found issues, recent activity, what’s working, practice goal, focus lesson), 8 px bands |
| Primary action | The hero’s lever, the top issue, into Improve; none in a header | Same | Same |
| Secondary actions | `BaseCard footer` link rows | Same | Same |
| Empty state | `DashboardEmptyCta` in a `BaseCard` inside `PageContainer`; a practice-only golfer gets `DashboardPracticeHeadline`, `DashboardPracticeCards` and `DashboardRoundsPrompt` | Same | Same, full-bleed |
| Loading state | `AppLaunchSkeleton screen="home"` until the handicap request settles; `DashboardSyncing` during a first sync; `BaseAlert` on failure | Same | Same |
| Opens in a sheet | A chart point is a hover card (`BaseDetailHoverCard`) | Hover card | `BaseDetailSheet`, and its round pushes a `BaseScreenSheet` |

## List

| | Web 1440 | iPad 1032 | iPhone 440 |
| --- | --- | --- | --- |
| Header | `AppMasthead`: the eyebrow is the count (“12 rounds logged”), the title the destination, `CategorySwiper` below, Import as `AppMastheadAction`; the roster uses `logo` and the title Students | Same | Same masthead, pinned, without Import; the first `SettingsBand` carries Filter |
| Ground and card | paper; one `BaseCard flush` holds the whole list; the roster adds a sunk column-header row and aligned columns | Same | paper-sunk; the card is a flat paper section; month bands are `SettingsBand sunk` (eyebrow xs, 20 px) |
| Gutter | `.container` 40 px; rows `lg:px-6`; `PageContainer lg:py-8` | Same | 0; rows `px-5` |
| Section rhythm | Toolbar `mb-3` above the card; groups as month bands inside it | Same | 8 px band under the masthead; bands between months |
| Primary action | Import in the masthead; the roster’s Import students lives in Settings | Same | Import on the Settings profile header; the library’s floating + (Record, Upload, Live lesson); the empty state’s button |
| Secondary actions | `BaseFilterButton` with its count at the right of the `ActivityList` toolbar; a `BaseEyebrow` list title at the left | Same | `BaseFilterButton` in the first band’s `#action`; Select on the newest month band |
| Empty state | `BaseEmpty`: dashed 12 px box on paper-sunk, icon, title, description, `#actions` (Sync now, Import session, Add student); a filtered-out list shows `SettingsBand "No matches"` over `BaseEmpty "No matching rounds"` | Same | Same; the band keeps the Filter pill |
| Loading state | `AppLaunchSkeleton screen="activity"` or `"library"`; the roster `CardLoadGate shape="list"`; videos six `BaseSkeleton aspect-video` | Same | Same |
| Opens in a sheet | `ActivityFilterSheet` is a centred dialog (`sheet` is below `sm`); a row navigates to the route | Centred dialog; a row navigates | `ActivityFilterSheet` as a bottom sheet that applies live; a row opens `BaseScreenSheet` over the list; `AddIntegrationModal app-sheet`; the swing upload sheet |

## Detail

| | Web 1440 | iPad 1032 | iPhone 440 |
| --- | --- | --- | --- |
| Header | `AppPageHeader` with back (Rounds, Sessions); title `type-display`, the meta line, Edit (ghost) and Share, three `StatBlock` stats on forest, then the tabs Hole map / Overview | Same | `AppPageHeader` back row and title only; stats and meta `max-lg:hidden`; tabs full width; `RoundHero` on paper below the header; in the app a round opens on the Hole map tab |
| Ground and card | paper; a `lg:grid-cols-12 lg:gap-6` of white cards; the desktop hole panel takes the phone sheet’s paper ground | Same | paper-sunk; flat sections, `space-y-5` |
| Gutter | The screen spans the column (`PageContainer lg:max-w-none lg:px-0`) and keeps its own `lg:max-w-7xl lg:px-10` | Same | 0; a loose control takes `max-lg:px-5` from its placer (`RoundActions`, `ShareLinkButton`) |
| Section rhythm | 24 px grid gaps, `lg:pt-6`, `pb-10` | Same | 20 px between sections, `pb-10` |
| Primary action | None; Edit and Share are ghost buttons in the header | Same | `RoundActions` at the foot and the options sheet; the session’s share button stretches full width below `sm` |
| Secondary actions | Tabs; hover cards on the map and charts | Same | Tabs; the options sheet |
| Empty state | `BaseEmpty "Round not found"` with a button back to the list | Same | Same |
| Loading state | Round: `AppPageHeader` over a `h-75 animate-pulse bg-forest-deep` block; session: `SessionDetailSkeleton` and `SessionChartSkeleton` | Same | Same |
| Opens in a sheet | The full-screen hole in one `HoleMapSheet`, a hole preview inline; `RoundEditSheet`; shot edit modals; `SessionShotStatsSheet`; `SessionFilterSheet` | Same | The same as bottom sheets; the screen is itself a `BaseScreenSheet` when opened from a list; the Hole Map tab takes the tab bar |

## Flow

| | Web 1440 | iPad 1032 | iPhone 440 |
| --- | --- | --- | --- |
| Header | Onboarding: `AppHeader disable-nav` (wordmark, sign-in link, no drawer) over `OnboardingStepNav`, a step strip with hairlines; capture: `CaptureChrome` top bar over the camera | Same, safe-area top on capture | Onboarding: the same wordmark header, then the step’s label beside “02 / 07” instead of dots; capture: the top bar at `max(0.75rem, safe-area-top)` |
| Ground and card | Onboarding `bg-paper`, the form in a `BaseCard`; capture `bg-ink text-paper` | Same | Same; neither carries app chrome |
| Gutter | `main px-6 py-6 sm:py-10 lg:px-12`; content `max-w-6xl` in two columns (`md:grid-cols-2`, gaps 40, 48, 64 px) | Two columns from `md` | One column, 24 px; capture corners `px-3` |
| Section rhythm | Editorial left, panel right (`OnboardingStepLayout`); `gap-6` inside a column | Same | Stacked, `gap-10` |
| Primary action | Next in the sticky `OnboardingFooter`, primary colour, label from `nextLabel`; capture: the record control at the bottom centre | Same | Next fills the row (`max-sm:flex-1`, 48 px); Back is icon-only, 48 px |
| Secondary actions | Back as an outline button; the step count “02 of 07 // Connect” centred | Same | The count moves to the header |
| Empty state | None; a terminal path (`/onboarding/waitlist-thanks`) drops the nav and footer | Same | Same |
| Loading state | `OnboardingMembershipProcessing` while a payment settles; capture: the `ClientOnly` fallback “Loading the analyzer…” | Same | Same |
| Opens in a sheet | `OnboardingGolfPadModal`; capture: `CaptureJoinPrompt` (Add this angle / Not now) over the camera; the swing upload is a dialog | Same | The swing upload as a bottom sheet |

## Settings

| | Web 1440 | iPad 1032 | iPhone 440 |
| --- | --- | --- | --- |
| Header | `AppMasthead title="Settings"` (`pt-8 pb-8`); the open section’s `type-headline` and note head the detail column | Same | Index: `SettingsProfileHeader` (back row, name, email, since-joining figure in yellow `type-hero`, Import button); section: `AppPageHeader to="/settings"` with `h1 type-display` and the note |
| Ground and card | `bg-paper-sunk` at every width; lists are `SettingsList` panels (white, 12 px) with hairlines at the row text inset | Same | Sunk; flat paper lists, hairlines inset 20, 53, 70, 72, 77 or 89 px |
| Gutter | `lg:max-w-7xl lg:px-10`; rows `px-5`; `--settings-row-text-inset` 89 px | Same | 0; rows `px-5` |
| Section rhythm | Groups under `SettingsBand` (`default` `pt-5 pb-2`, `section` `pt-6 pb-2`, `lead` `pt-8 pb-5`); the index 4 columns beside the section 8 (`MasterDetail`) | Same | One column: the index, then the section pushed; `pb-chrome-bottom` so the sunk ground runs under the tab bar |
| Primary action | Import students as an outline button above the index (coach); each section saves itself | Same | Import or Import students full width on the profile header |
| Secondary actions | Row chevrons; Sign out as a red row closing Account | Same | Same; never in the profile hub |
| Empty state | A row’s value says so (“No clubs yet”, “Nothing connected”) | Same | Same |
| Loading state | `AppLaunchSkeleton screen="settings"` in the index column | Same | Same; skeleton stat on the profile header |
| Opens in a sheet | Display choices in a `BaseChoiceOverlay` popover; club, connection, profile and delete-account as `BaseModal` dialogs | Dialogs and popovers (`app-sheet` is below `lg`) | `BaseChoiceSheet` with previews, the club sheet, connections manage and field notes, import, delete account, Import students, each a `SettingsSheetContent` with `SettingsSheetHeader` (eyebrow, title, close) |

## Where no layout component exists

- `PageContainer` is used by 16 pages and `ImproveSection`, 17 files of about 100 pages, and it only centres and paints the sunk ground and gaps below `lg`.
- Hub: `HOME_GRID` is five class strings in `web/utils/home-grid.ts`, not a component.
- List: `ActivityList` holds the toolbar and the card; the month band with the Filter pill is repeated by hand in `ActivityRounds`, `ActivitySessions`, `CoachStudentList` and `SwingPlayerLibrary`; rows are hand-rolled grids (`rows-to-baselistrow`).
- Detail: `ActivityDetailLayout` holds slots only, the session uses it and the round inlines its own; `inline-wrappers-removed` removes it. The round’s tab row is hand-rolled (`tabs-to-basesegmentedcontrol`).
- Flow: `OnboardingStepLayout` is the two-column grid only, and the start step redraws it with a row span. Capture has no layout beyond `CaptureChrome`.
- Settings: `settings.vue` is the layout; `MasterDetail` is also used by Issues and coach Messages with other `narrow` and `panel` settings.
- Share pages draw their own masthead and charts (`share-surface-own-styling`) and fold into `AppMasthead` and `ChartCard`.

## Open questions

- `--app-section-gap` is 16 px from `lg` in tokens.md, but Home, Trends, the round detail and the roster use 24 px (`lg:gap-6`); which is the rule?
- `PageContainer padded` gives 16 px below `sm` (`max-lg:px-4!`) where tokens.md names one 20 px content gutter.
- Settings paints `bg-paper-sunk` at every width while `--app-page-ground` is paper from `lg`; is Settings an exception or a drift?
- Home measures 1200 px on its own grid while every other template uses the 1280 px `.container`; one measure or two?
- Filter sheets are `sheet` (below `sm`) so an iPad gets a centred dialog, the import modal is `app-sheet` (below `lg`); does a tablet filter as a sheet (`tabletSheet`) or a dialog?
- A chart point opens a sheet only in the installed app below `lg` (`isMobileApp`) and a hover card on an iPad, which has no hover; is the iPad a touch platform for charts?
- Loading differs per detail screen (a forest block for a round, dedicated skeletons for a session) while hub and list share `AppLaunchSkeleton`; one loading pattern per template?
- No decision names where a phone screen’s primary action goes: the profile header, a floating +, a foot row and an empty-state button all occur.
- `AppLaunchSkeleton` centres every screen but Home and the library at `max-w-xl` below `lg` while the screens themselves are full-bleed.
- Nothing on the iPad is iPad-specific beyond the safe area and the coarse pointer (16 px inputs, `tabletSheet`, `bleedTablet` on the analyzer); is the 1032 px column the intended reading width, or does the iPad get its own measure?
