---
title: Codebase Conventions
eyebrow: Product Design
subtitle: How a screen gets its data, declares its access, shows a failure, sends an event and records a decision — one rule per line, with the file that embodies it.
adrs:
  - 2026-04-16-component-logic-lives-in-composables.md
  - 2026-04-16-components-use-script-setup-composition-api.md
  - 2026-04-16-component-templates-are-html-not-pug.md
  - 2026-04-16-components-are-styled-with-tailwind.md
  - 2026-04-16-ui-goes-through-base-components-over-nuxt-ui.md
  - 2026-04-16-third-party-instances-held-in-shallowref.md
  - 2026-05-10-domain-code-is-provider-neutral.md
  - 2026-05-15-ga4-events-carry-only-user-id.md
  - 2026-06-17-admin-identity-comes-from-the-database.md
  - 2026-08-24-coach-access-has-no-feature-flag.md
  - 2026-10-09-usga-integration-behind-a-per-user-flag-in-prod.md
  - 2026-11-04-swing-compare-behind-a-flag.md
  - 2026-10-30-2735-server-render-holds-the-signed-in-user.md
  - 2026-11-04-3072-client-fetch-guards-stack-on-every-fetch.md
  - 2026-11-04-3096-the-ios-app-loads-no-cookie-banner-and-gates-analytics-by-country.md
  - 2026-10-30-2024-api-routes-move-into-domain-folders-only-when-the-url-stays.md
  - 2026-04-16-http-integration-tests-on-a-standalone-h3-app.md
  - 2026-07-04-four-test-tiers-by-what-the-code-touches.md
  - 2026-10-24-2575-scheduled-workers-only-for-periodic-work.md
  - 2026-10-29-2680-decisions-live-as-adrs-in-docs-decisions.md
  - 2026-10-29-2683-every-pr-declares-its-decision.md
  - 2026-10-05-board-column-is-a-tickets-state.md
  - 2026-10-21-ports-refactors-and-fixes-keep-the-ui-unchanged.md
  - 2026-04-16-prettier-formats-all-code.md
  - 2026-06-05-comments-state-only-a-current-non-obvious-constraint.md
---

## What this page is

The rules live in [`AGENTS.md`](https://github.com/AVAGolf/app.avagolf.com/blob/stage/AGENTS.md) and the ADRs; this page names each convention once with the file that embodies it. *Practised, not decided* marks what the code does consistently with no ADR. Design rules for loading, empty and error states: [Interaction Patterns](/patterns/).

## Where logic lives

- Golf logic, derivation and ingestion live in `packages/` (`golf-engine`, `pipeline`, `integrations`, `database`); `web/server/` imports them, a component never re-derives them. *Practised, not decided.*
- Provider-specific code lives only in `packages/integrations/mappers/<provider>.ts` and the ingestion adapters; endpoints, derivation and docs stay provider-neutral.
- A component renders; logic sits in `web/composables/`, pure helpers in `web/utils/`, and a page extracts both (`web/pages/CLAUDE.md`).
- Components use `<script setup>`, HTML templates, Tailwind utilities and the Base components in `web/components/ui/` ([`components/CLAUDE.md`](https://github.com/AVAGolf/app.avagolf.com/blob/stage/web/components/CLAUDE.md), [`ui/README.md`](https://github.com/AVAGolf/app.avagolf.com/blob/stage/web/components/ui/README.md)); a third-party instance sits in `shallowRef`.
- `web/eslint.config.mjs` rejects a raw colour, type size, spacing step or retired component; pre-push runs `pnpm lint`, `pnpm typecheck` and `pnpm test`.

## Data fetching

All *practised, not decided*.

| Read | Options | Loading is | Why | File |
| --- | --- | --- | --- | --- |
| Server-rendered (self or coach mirror) | default `server: true`; key suffixed with `useCoachTarget().keySuffix`; `getCachedData: swrCachedData` | `isAwaitingData(data, status)` | a revisited screen shows its last answer and revalidates in the background; a coach’s mirror never collides with the viewer’s own cache | `web/composables/useIssues.ts`, `web/utils/swr-cached-data.ts` |
| Client-only (messaging, coaching sessions, anything under `<ClientOnly>`) | `server: false`, `lazy: true` | `status` is `idle` or `pending` | without `server: false` the request never fires; counting `idle` keeps the server render and the hydrating client on the same branch | `web/composables/useConversations.ts`, `useCoachingSessions.ts`, `useOpenSlots.ts` |
| Shared by several components | `useState` holds the answer; `useAsyncData` only fetches | `pending` | Nuxt drops an asyncData entry once its last holder unmounts | `web/composables/useFeatureFlags.ts` |

- A screen’s data comes from a composable that wraps one keyed `useFetch` against a typed route (`import type { … } from '~/server/api/…'`) and returns `data`, `status` and `refresh`.
- A write is a `$fetch` inside a composable action, then `refresh()` of every key it changed (`useCoachingSessions.ts`).
- The signed-in user lives in `useUserStore()` (`web/stores/UserStore.ts`): the auth guard sets it on the server, `ensureUser()` on the client.
- A client plugin adds request hooks through `addGlobalFetchHooks` (`web/utils/global-fetch-hooks.ts`), never by replacing `$fetch`; a 402 sends a lapsed golfer to `/subscribe` (`web/plugins/subscription-gate.client.ts`).

## Loading, empty and error states

| State | Wire it with | Source |
| --- | --- | --- |
| A card is loading | `<CardLoadGate :loading label shape>` around the card’s content; `AppLaunchSkeleton screen="…"` for a main screen’s first load; `BaseSkeleton` for one bar | `web/components/ui/README.md` |
| Nothing to show, after an answer | `BaseEmpty`; `PlotEmptyState` inside a plot | `docs/design-system/tokens.md`; finding `empties-to-baseempty` |
| A first load failed | `BaseAlert color="error"` with a `BaseButton` “Try again” that calls `refresh()` | `web/pages/index.vue` |
| An action failed or succeeded | `useToast().add({ title, color: 'error' })` or `color: 'success'`, from the composable that made the call; the title is the API’s `statusMessage` | `web/composables/useCoachingSessions.ts`; toaster in `web/app.vue` |

- Loading draws the shape of what is coming; never “Loading…” text or a spinner.
- Empty is decided only after an answer: `useFetchOutcome(status, refresh)` exposes `settled` and `failed` and retries the first failure once; a failed request is not an empty state.

## Access

- Every route is private unless `isPublicPath` in `web/utils/auth-guard-routing.ts` lists it; `web/middleware/auth-guard.global.ts` runs on every navigation and acts on `resolveGuardDecision`, a pure function that sends a visitor to login, onboarding, `/subscribe` or the coach side.
- A page declares `definePageMeta({ middleware: 'coach' })`, `['admin']` or `'swing-analyzer'` (`web/middleware/`). *Practised, not decided.*
- An API route is `defineApiRoute({ name, auth, body?, query? }, handler)` (`web/server/utils/api-route.ts`); `auth` is the whole access declaration, and a Zod schema answers 400 by itself.

| `auth` | Who passes | Guard and refusal |
| --- | --- | --- |
| `none` | anyone; `userId` may be null | — |
| `user` | a session | `requireAuthUserId`, 401 |
| `subscriber` | an active membership; demo, staff and god mode pass | `requireActiveSubscription`, 402 with `data.reason` |
| `read` | self, or a coach reading a student through `?playerId` and an active `CoachLink` | `resolveReadUserId`, 403 |
| `coach` | `isCoach` on the profile | `requireCoach`, 403 |
| `admin` | `isAdmin` on the user row | `requireAdmin`, 404 |

- `web/server/middleware/auth.ts` fills `event.context` once per request; a guard costs no query.
- Admin is a database column, never an email list; coach access is role plus link, never a flag.

## Errors

- A handler throws `createError({ statusCode, statusMessage })`; `withApiErrorHandler` (`web/server/utils/api-handler.ts`, run by `defineApiRoute`) logs it with partner credentials redacted and turns anything without a `statusCode` into a 500. *Practised, not decided.*

| Code | Means | Source |
| --- | --- | --- |
| 400 | the body or query failed its schema | `api-route.ts` |
| 401 | no session; `data.code: 'NO_SESSION'` | `web/server/utils/auth-errors.ts` |
| 402 | no membership; `data.reason` names why | `web/server/utils/auth-guards.ts` |
| 403 | wrong role, or no coach link | `auth-guards.ts`, `coach-access.ts` |
| 404 | should look absent: an admin surface, a flagged feature, a record the caller may not know | `admin-guard.ts`, `feature-flags.ts` |
| 409 | a conflict with the current state | route handlers |

- A client reads `error.data.statusMessage ?? error.data.message` and shows it as a toast title.
- A thrown page error renders `web/error.vue`, left through `clearError({ redirect: '/' })`.
- A refused demo or view-as write throws `ReadOnlyRefusal` on the client and never reaches the server or Sentry.

## Events

- `useAnalytics().track('event_name', { … })` (`web/composables/useAnalytics.ts`) sends every product event to GA4 through `gtag` and, batched, to `POST /api/events`, which validates it, derives `user_id` from the session, overrides the client’s context and enqueues it to the warehouse (`web/server/api/events.post.ts`).
- `user_id` is the only identifier of a person on an event; a call site passes properties, nothing about who.
- A server-side event (billing, grants) goes through `sendGa4Event` (`web/server/utils/ga4.ts`).
- Analytics runs only with consent where required; the iOS shell loads no banner and gates by country.

| Naming | Rule | Example |
| --- | --- | --- |
| event name | `snake_case`, in the tense of the moment it fires | `video_play_started`, `settings_view` |
| property key | `snake_case` | `step_name` |
| an id | ends in `_id`; a list of ids in `_ids` | `round_id`, `video_ids` |
| a duration | integer milliseconds, ends in `_ms` | `watch_time_ms` |

The catalogue of events and payloads is the header comment of `useAnalytics.ts`. *Practised, not decided.*

## Feature flags

- A flag key is a constant in `web/shared/feature-flags.ts`, and joins `CLIENT_FEATURE_FLAG_KEYS` only when a component branches on it.
- The client asks `useFeatureFlags().isEnabled(KEY)`, which fails closed while loading; the server asks `isFeatureFlagEnabled(key, userId)` (`web/server/utils/feature-flags.ts`), cached 30 s, with a per-user audience that passes while the switch is off.
- A flagged route answers 404 in route middleware (`web/middleware/swing-analyzer.ts`) and at the API boundary (`web/server/middleware/swing-analyzer-flag.ts`): absent, not switched off.
- A flag is seeded off by a migration and switched at `/dev/feature-flags`; it hides a feature, never a role.

## Decisions and process

- A decision is an ADR in `docs/decisions/`, declared on its PR in a `Decision:` line that CI checks; a ticket’s state is its board column; a port, refactor or fix keeps the UI as it is. The rest is in `AGENTS.md`.
- A test lands in the tier its code touches: pure code in Vitest, a database or queue in `tests/integration/`, the browser in `web/e2e/`, a partner API in a boundary test beside its client.

## Open questions

- 29 components and pages call `useFetch` directly; 38 composables do. Does the composable rule cover fetching? — Aron
- 219 routes use `defineApiRoute`, 94 a bare `defineEventHandler`. Is `defineApiRoute` the rule? — Aron
- `createError` carries `statusMessage` in 298 places, `message` in 88; four composables each define an `errorMessage()` to read both. Which field, and one shared helper? — Aron
- `web/pages/error.vue` renders a raw `UError` beside the branded `web/error.vue`. Dead? — Aron
- A non-coach on a coach page is redirected to `/`; a non-admin or a flagged-off feature gets a 404. One answer? — Aron
- `useFetchOutcome` and the retry alert are wired on the home page only. The rule for every first load? — JR
- The fetching and event-naming conventions have no ADR. Record them? — Aron
- 131 files outside `web/components/ui/` use a `<U…>` component (119 on 2026-10-29). Who owns the migration? — Aron
- `tokens.md` lists `BaseSpinner` as new; the loading rule forbids a spinner. Which stands? — JR
