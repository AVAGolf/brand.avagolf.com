---
title: Navigation
eyebrow: Product Design
subtitle: The destinations, the chrome each platform draws, how a screen opens and what a URL may carry.
adrs:
  - 2026-10-14-design-mobile-web-adopts-app-layout.md
  - 2026-10-14-design-app-shell-variant-on-data-app-shell.md
  - 2026-10-14-design-grouped-list-variables-width-gated.md
  - 2026-10-28-2629-coach-roster-filters-live-in-a-filter-sheet.md
  - 2026-10-28-2631-coaches-add-students-from-one-import-sheet.md
  - 2026-10-30-2668-the-profile-sheet-holds-the-mode-switch.md
  - 2026-10-30-2744-swing-library-filters-live-in-one-filter-sheet.md
  - 2026-10-31-2756-one-record-screen-joins-the-accounts-capture-session.md
  - 2026-11-01-2803-phones-open-the-full-swing-analyzer.md
  - 2026-11-01-2813-phone-clip-actions-are-the-more-menu-as-a-sheet.md
  - 2026-11-01-2814-phone-live-lesson-is-the-live-camera-over-a-swing-rail.md
  - 2026-11-01-2866-a-landed-swing-opens-in-the-swing-player.md
  - 2026-11-02-2803-phones-open-a-clip-on-the-video-alone.md
  - 2026-11-02-2803-phones-open-a-clip-with-notes-closed.md
  - 2026-11-02-2928-filter-sheets-apply-live-with-no-result-count-button.md
  - 2026-11-02-2930-swing-upload-opens-as-a-bottom-sheet-on-the-phone.md
  - 2026-11-02-2935-library-selection-starts-from-a-select-button.md
  - 2026-11-02-2937-phone-adds-swings-from-a-floating-button-and-coaches-are-not-offered-adding.md
  - 2026-11-03-hands-free-is-the-only-single-phone-capture.md
  - 2026-11-03-swing-capture-records-only-in-the-native-app.md
  - 2026-11-04-2908-sign-out-sits-on-the-desktop-rail-only.md
  - 2026-11-04-3007-phone-notes-open-as-one-drawer-over-the-player.md
  - 2026-11-04-3056-phone-library-select-and-filter-sit-on-the-coach-reviews-band.md
  - 2026-11-04-3078-profile-sheet-unread-uses-the-avatar-badge.md
  - 2026-11-05-3104-round-route-map-tab-takes-the-tab-bars-place.md
---

## Destinations

The destinations are one list, `buildNavItems` in `web/composables/useAppNav.ts`, shared by the rail, the tab bar and the drawer. Four are `primary` and get a tab; the bar throws on a fifth, so a new destination goes into the profile hub.

| Destination | Route | Bar and rail label | What lives under it |
| --- | --- | --- | --- |
| Home | `/` | Home (the drawer says Dashboard) | Handicap hero, scoring trend, recent activity, found issues, what’s working, practice goal, focus lesson (`web/pages/index.vue`, `web/components/dashboard/**`) |
| Activity | `/activity` → `/activity/rounds`, or `/activity/sessions` for a practice-only golfer | Activity | Category tabs Rounds, Sessions, Journal, Data Explorer; a round at `/activity/rounds/[roundId]`, a session at `/activity/sessions/[sessionId]`; `/shot-import` counts as Activity (`also`) |
| Performance | `/performance` → `/performance/trends` | Trends | Category tabs Overview, Driving, Approach, Short Game, Putting (`PERFORMANCE_CATEGORIES`) |
| Improve | `/improve` → `/improve/issues` | Improve | Category tabs Issues, Videos, Swing Analyzer (flag-gated); the analyzer’s library, a clip, compare, edit, live and capture |
| Messages | `/messages`; a coach inside a student reads `/coach/messages` | No tab: the profile hub below `lg`, the rail’s foot from `lg` | The inbox; a lesson at `/lessons/[id]` backs to Messages |
| Settings | `/settings`; from `lg` the index opens its first section (`/settings/my-bag` for a player) | The avatar, then the hub’s Settings row; the rail’s avatar from `lg` | Groups Your game, Coaching, App, Account (`useSettingsSections`); Swing capture is `appOnly`; Sign out closes the Account group |
| Students (coach) | `/coach/players`, the coach’s home | Students | Roster and invites; Import students is a sheet opened from Settings or the empty roster |
| Calendar (coach) | `/coach/calendar` | Calendar, only with a connected scheduler | Lessons and bookings |
| Messages (coach) | `/coach/messages` | Messages, a tab in coach mode | Conversations beside a thread |

A coach sees the roster chrome; viewing a student or in player mode, the student’s (`showsStudentChrome`). Outside the chrome: `/share/*` is public and shell-free, the credential routes (`isCredentialRoute`) draw none, `/onboarding/*` has its own frame, `/capture/join` sets `layout: false`.

## Shells and widths

- The installed app sets `html[data-app-shell]`; the only shell variant is `app-shell:`; `?shell=app|web|auto` forces it for testing.
- Layout switches on width, not shell (`docs/design-system/tokens.md` §5): layout values sit under `@media (width < 64rem)`, so mobile web shares the phone composition; only OS values follow the shell.
- The reference platforms are desktop 1440 (web), iPhone 440 and iPad 1032 (app) (`docs/design-audit/README.md` §6.2); the iPad is above `lg` and takes the desktop composition with the app’s OS values.
- `data-app-only` marks chrome only the installed app draws; `data-web-only` the browser’s copy of it below `lg`.

## Chrome per platform

| Chrome | Web 1440 | iPad 1032 (app) | iPhone 440 (app) | Phone browser |
| --- | --- | --- | --- | --- |
| Rail `AppRail` | 96 px forest-deep column: logo, four tabs, then Messages, mode pill, avatar, sign out | Same | None | None |
| Tab bar `AppTabBar` | None | None | Floating pill, four tabs, 60 px, leaves on a downward scroll | None (`isAppShell` only) |
| Browser header `AppHeader` | None from `lg` | None | None (`app-shell:max-lg:hidden`) | Wordmark and a drawer: the destinations, mode switch, Settings, Support, Logout |
| Masthead `AppMasthead` on `AppHeaderShell` | Contents in the 1280 px measure, `lg:pt-8`, no avatar | Same, plus safe-area top | Pinned, `px-5`, avatar on the right of the top row | Sticky with the chrome, avatar on the right |
| Back row `AppBackRow` | In `AppPageHeader` | Same | Same, plus BACK in a masthead pushed across tabs; swipe-back | Same |
| Profile hub `AppProfileHub` | None (`lg:hidden`) | None | Avatar opens a sheet: name, mode switch, Messages with the red count, Settings; no sign out | Avatar opens a 288 px popover with the same rows |
| Notices `AppNotices` | Inside `[data-app-chrome]`, one at a time (demo, past due, paused, sync, share import, coach request, update) | Same | Same | Same |
| Coach band `CoachStudentHeader` | Sticky 60 px band over the rail | Same | Inside the chrome | Same |

## The masthead

The forest masthead is the page header at every width and in every shell; `AppHeaderShell` draws its top row at `min-h-11` on every screen, so the avatar never moves. The top row holds the yellow eyebrow (`type-eyebrow text-yellow`), the BACK row, or the AVA lockup on a tab’s home (`logo`, app only). Under it the title is an `h1.type-display`, with `#title-end` for a window control or an `AppMastheadAction` (yellow fill for the screen’s action, paper outline for a second). The slot carries the screen’s own: `CategorySwiper`, a progress bar, stats, tabs. In the installed app below `lg` it is pinned and leaves with the tab bar on `html.chrome-hidden`.

## How a screen opens

- A destination with its own URL pushes. In the installed app, at any width, a link that is not a tab press plays `page-push` and back plays `page-pop`; a tab press cuts, because tabs are siblings; a browser tab gets no motion. A page pushed from another tab keeps that tab lit and shows BACK (`useNavOrigin`).
- A round or session opened inside a tab in the installed app below `lg` stays over its tab: `BaseScreenSheet` slides in from the right, full width, and the URL records it as `?round=<id>` or `?practice=<id>` so back and reload restore it; everywhere else the row navigates to the route.
- A choice, filter, menu or short form that returns to its screen is a sheet on a phone and a dialog or popover above: `BaseModal sheet` is a bottom sheet below 640 px (88 dvh, grab handle) and a centred dialog from `sm`; `app-sheet` is a sheet only in the installed app below `lg`; `tabletSheet` is a sheet on a coarse pointer from `sm`; `BaseOverlay` is a popover on a fine pointer. A filter applies as it is tapped and has no apply button.
- A studio that needs the whole viewport takes over with `Teleport to="body"` and `fixed inset-0`, with its own back: the swing clip, compare, editor, live lesson, capture and the full-screen hole map. A surface that needs the bottom edge holds `useSuppressChrome`, which takes the tab bar (the round route’s Hole Map tab, an open thread, the annotation layer); a selection bar stands in its place (`useSelectionChrome`).
- A phone clip opens on the video alone, 3D on request, notes folded to a caption in one drawer; a landed live-lesson swing opens the same player; single-device capture records only in the native app.

## Secondary actions per platform

| Action | Web 1440 and iPad 1032 | iPhone 440 |
| --- | --- | --- |
| The screen’s own action | `AppMastheadAction` in `#title-end` (Activity’s Import is `max-lg:hidden`) | The Settings profile header (Import, Import students), the library’s floating + (Record, Upload, Live lesson), the empty state’s button |
| Filter | `BaseFilterButton` in the `ActivityList` toolbar above the card | On the first band’s `#action` (the Coach reviews band when it shows) |
| More | Ghost buttons and `BasePopover` | The same menu as a `BaseModal sheet`; a round’s options sheet |
| Select | Select / Done in the toolbar | On the newest month band |
| Mode switch | The rail’s `AppModePill` | The profile hub |
| Sign out | The rail’s foot | Settings → Account; never in the hub |

## URL rules

- A section root redirects to its first page with `replace`: `/activity`, `/performance`, `/improve`, `/onboarding`, and `/settings` from `lg`. The bare analyzer goes to `/improve/swing-analyzer/library`.
- A segment that names no view is a dead URL, not a silent fallback: `pages/improve/swing-analyzer/[[view]].vue` validates `capture` only and 404s the rest.
- A path that was ever mailed redirects at the edge (`web/config/route-rules.ts`): `/performance/journal`, `/improve/messages`, `/settings/messages`, the retired onboarding steps.
- Screen state rides in the query, never the hash: `?round`, `?practice`, `?roundView`, `?roundHole` for the open screen; `?view`, `?hole` on the round route; `?issue` (the old `#issue-` hash is rewritten); `?v` for a video; `?c` for a conversation; `filter`, `club`, `view`, `shot`, `starred` for the library; `?mode=rig` for capture. A legacy `?tab` on `/settings` redirects to its section.
- A capture join token rides in the fragment, never the query, so no log carries it.

## Open questions

- Trailing slashes: no decision; `parseActivityHref` tolerates one, Nuxt’s default applies. Redirect, 404 or ignore?
- The phone browser’s drawer (mode switch, Settings, Support, Logout) and the app’s hub (mode switch, Messages, Settings) differ at one width, against one layout per width. Which is the rule?
- In coach mode Messages shows twice on the phone, as a tab and in the hub (a recorded consequence). Accepted, or a ticket?
- An iPad in portrait (810 px on a 10.2" model) falls below `lg` and gets the phone composition; no decision covers it.
- A deep-linked round renders the route under the tab bar while a list row opens a screen sheet; #3104 suppressed the bar rather than redirect to `?round=`. Does every round link use the sheet URL in the end (#2476)?
- `/community` and `/shop` carry a masthead but belong to no destination. Where do they live, or do they go?
