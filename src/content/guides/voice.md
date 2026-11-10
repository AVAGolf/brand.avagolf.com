---
title: Voice
eyebrow: Communication
subtitle: How AVA Golf speaks in the app, in email, in push and on a share page, and the words it never uses.
adrs:
  - 2026-04-16-the-name-is-written-ava-golf.md
  - 2026-04-16-handicap-copy-follows-usga-trademark-rules.md
  - 2026-11-02-2902-calculated-handicaps-are-labelled-round-average.md
  - 2026-04-07-unified-insight-model-is-named-issue.md
  - 2026-08-13-every-chart-writes-its-own-note.md
  - 2026-08-13-every-trend-stat-card-has-a-body.md
  - 2026-05-10-domain-code-is-provider-neutral.md
  - 2026-06-18-coach-access-starts-only-when-the-player-accepts.md
  - 2026-09-05-onboarding-three-step-funnel.md
  - 2026-09-01-1380-signup-starts-a-14-day-card-required-trial.md
  - 2026-10-30-2679-cancelled-trials-get-the-free-access-ending-email.md
  - 2026-10-30-2665-coach-mode-hides-golfer-only-notification-switches.md
  - 2026-10-30-2668-the-profile-sheet-holds-the-mode-switch.md
  - 2026-10-31-2756-one-record-screen-joins-the-accounts-capture-session.md
  - 2026-10-29-brand-guide-retired-until-reworked.md
---

## Three traits

Every sentence a golfer reads passes all three. The examples are shipped copy.

| Trait | Means | Do | Don’t |
| --- | --- | --- | --- |
| Plain | One idea per sentence, in the words a golfer uses on the course. No engineering or marketing vocabulary. | “Your round at Pebble Beach is in: 78. See what cost you.” (`packages/push/pushes.ts`) | “Your performance data has been ingested and processed.” |
| Grounded | A claim says what it rests on, and thin data says so before the number. Nothing is promised; what happened is reported. | “Putting is measured on part of your rounds.” (`web/components/trends/CapabilityGapCard.vue`) | “Official Handicap Index®” (ADR 2026-04-16, handicap copy) |
| Pointed at the next step | A reading ends in what to do about it, for this golfer. | “3 holes on your round have putts with no position. Place them to unlock putting stats.” (`pushes.ts`) | “Your putts have no positions.” and nothing after it |

## Data and improvement

- A number is anchored to the count or share the plot draws, and an average is quoted only when it is large enough to read as a distance (ADR 2026-08-13, every chart writes its own note). Every stat card carries a `body` saying what the value means (ADR 2026-08-13, trend stat card).
- Anything specific to this golfer goes in the chart’s verdict, never in its `description`, which reads the same for everyone (`web/components/CLAUDE.md`).
- A number names itself for what it is. A handicap AVA Golf calculates is “Round Average” (“Round Avg.” compact); the peer benchmark is “Peer Avg”; `Handicap Index®`, `H.I.™` and `Low H.I.™` (with its date) only on values the USGA issued, one decimal, through `displayHandicapIndex()` and `formatHandicapIndex()` in `web/utils/usga.ts` (ADRs 2026-04-16 and 2026-11-02-2902).
- A pattern in the data is an issue, never a diagnosis (ADR 2026-04-07). An issue states the cost, the pattern, then the evidence: “You are losing strokes off the tee due to a frequent right miss (slice).” (`packages/golf-engine/rules/rules.ts`).
- A recommendation names the part of the game, the strokes at stake and one thing to work on. Videos are “matched to your issues”, never recommended by a system: “Not general tips. Each video targets what your data shows about your game right now.” (`packages/email/templates/playlistReady.html`).
- Who speaks: “AVA Golf” when the product read, found or flagged something (“AVA Golf reads every round, range session and simulator swing you already record”, `OnboardingStepStart.vue`); “we” when the team did something (“We received your support request”, `templates.ts`). Never “the system”, “the algorithm” or “AI”.
- The golfer owns the data. Coach copy says so in those words: “They keep their own data, you get read access plus notes.” (`CoachStudentList.vue`); access starts when the golfer accepts (ADR 2026-06-18). To the golfer the coach is “your coach”; on coach surfaces the golfer is a “student”.
- A partner is named only on the surface that connects or manages it (`Settings → Connections`, its connect modal, its connected and failed emails). Everywhere else write “your device”, “a tracker”, “your launch monitor or app”, “a source of rounds” (ADR 2026-05-10; `CapabilityGapCard.vue`, `weeklyProgressSummary.html`, `ActivitySessions.vue`).

## Naming

| Thing | Write | Never |
| --- | --- | --- |
| The product | `AVA Golf`, both words, on every surface including push and email (ADR 2026-04-16) | Ava Golf, AVA, ava |
| The installed app | “the app” (“A new message, when you are away from the app.”, `web/utils/push-categories.ts`) | the mobile app, the iOS app |
| Coach side | “coach mode” and “player mode”, lowercase; “Switch to coach mode” (`web/composables/useModeSwitch.ts`, ADR 2026-10-30-2668) | Coach App, Coach Mode |
| Capture | “Record screen” (ADR 2026-10-31-2756), “hands-free capture”, “Place your putts” for the putting capture (`pushes.ts`) | Ghost Mode (not in shipped copy; see open questions) |
| Swing work | “Swing Analyzer” as the product area; “swing player”, “swing report”, “live lesson” lowercase (`ShareSwingReport.vue`, `docs/directors-notes/`) | Swing Player, Live Lesson |
| App areas | Capitalised when they name the tab: Home, Activity, Improve, Performance, Journal, Trends, Connections, `Settings → Coach` (`coachWelcome.html`) | the activity page |
| Practice | “practice session” or “range session” (“Your practice session is in”, `pushes.ts`; “My range session on AVA Golf”, `web/utils/share-sheet.ts`) | workout, drill session |
| USGA | “USGA account”, “Handicap ID”, “Ratings” as a heading; `Course Rating™`, `Slope Rating®` (ADR 2026-04-16) | GHIN account, GHIN number, Course and Slope Rating |
| A reader without a first name | Drop the name: “What AVA Golf found in your game” (ADR 2026-10-30-2679) | “Hi golfer,” |

## Banned phrases

| Never | Write instead | Why |
| --- | --- | --- |
| AI-powered, powered by AI, machine learning, our algorithm | “AVA Golf reads your rounds”, “from the patterns in your own data” | No shipped golfer-facing string credits the reading to a technology; `playlistReady.html` says “Picked from the patterns in your own data.” |
| revolutionary, game-changing, unlock your potential, cutting-edge, seamless | The thing that changed, in numbers: “2.1 strokes per round better than before” (`freeAccessEnding.html`) | None of these appears in shipped copy |
| guaranteed, will lower your handicap | What the data showed so far | Copy reports, it does not promise (`freeAccessEnding.html`, `weeklyProgressSummary.html`) |
| Official, verified, certified before a USGA mark | The mark alone | ADR 2026-04-16, handicap copy |
| Estimated Handicap, Skill Level, Handicap Avg | Round Average, Round Avg., Peer Avg | ADR 2026-11-02-2902 |
| Diagnosis, diagnose | issue, “what’s going wrong” (`IssuePriorityCard.vue`) | ADR 2026-04-07 |
| ingest, pipeline, process (as a verb to the golfer) | read, import, pull in | Every other surface says “reads” or “imports” (`accountCreated.html`, `ActivitySessions.vue`) |
| Personalized Progression, Data with Direction, Mastery without Guesswork in new copy | What the feature does | The pillars are retired; shipped uses stay until reworked (ADR 2026-10-29) |
| Exclamation marks, emoji | A full stop | None in shipped copy |

## Surfaces

| Surface | Component | Rule |
| --- | --- | --- |
| Empty state | `BaseEmpty` | `title` two to five words, sentence case (the component uppercases it): “No rounds yet”. `description` says what is missing and the one action that fills it: “Connect a data source or upload a round, and this page fills in with whatever your rounds carry.” A filtered list reads “No matching rounds” + “Adjust your search or filters to see more results.” Unshipped features: “Not open yet”. Plots use `PlotEmptyState`. |
| Error | `BaseEmpty` (`variant="error"`), `BaseAlert` (`color="error"`), toast | What did not happen, in the golfer’s words, then the one action: “Couldn’t load your rounds”; “Sync didn’t finish. Open Connections to try again.” (`pushes.ts`). No codes, no ids. |
| Notice | `BaseAlert`, `AppNotice` | `title` is an eyebrow of two to four words (“Draft restored”, “Syncing your data”, `web/utils/sync-progress-copy.ts`); the body is one sentence that says what is true now and what stays safe: “Your imported rounds are safe.” (`GolfPadManageModal.vue`). |
| Confirm | `BaseConfirmModal` | `title` is the question with its object: “Delete this swing?”, “End this lesson?”, “Stop coaching Sam?”. `message` is one sentence on what is lost or kept. `confirmLabel` repeats the verb (“Delete”, “End lesson”), never “OK” or “Yes”; the cancel button is always “Cancel”. |
| Push | `packages/push/pushes.ts` | `title` two to four words, sentence case, no product name (the icon carries it): “Your round is in”, “Lesson booked”, “Reconnect {integrationName}”. `body` one or two sentences with the count, course or score, ending in the action the tap fulfils: “See what cost you.” A message push uses the sender’s name as the title. Non-urgent pushes wait out 21:00–08:00. |
| Email | `packages/email/templates.ts`, `templates/*.html` | The subject states the event with the name, date or source interpolated: “Your session with Sam is booked”; “Action required:” only when syncing is blocked. Hero headline repeats the subject; one preheader line; “Hi {firstName},” only when a name exists; one CTA “Verb your thing →”; sign-off “Thanks, The AVA Golf Team”. |
| Share page | `web/server/utils/share-og-summary.ts`, `web/composables/useShareSeo.ts` | Headline `<Owner>’s round at <Course>: <score> (<to par>)`, under about 60 characters and without a site suffix (`og:site_name` carries it); the OG card truncates the course name with “…” when it does not fit. Description “18 Holes · SG Total +1.2 · <footer> on AVA Golf.” Share-sheet title “My round on AVA Golf”. The gated swing report says who may open it: “Only the golfer and their coach can open it.” |
| Onboarding | `web/components/onboarding/**` | Three steps: start, trial, connect (ADR 2026-09-05). Headline two or three words with a line break (“Every round, decoded.”); lead paragraph at most 44 characters wide; the trial length, price and first-charge date in the lead or footnote (ADR 2026-09-01-1380): “Nothing is charged today.” |

## Open questions

- Pillars, values and audience: do `/pillars/`, `/values/` and `/audience/` stay as pages once the brand guide ADR is superseded, or does the voice page absorb what survives (the audience paragraph, “no hype”)?
- Short form “AVA”: the ADR allows only “AVA Golf”, the retired overview page allowed “AVA” once context exists, and `freeAccessEnding.html`, `accountCreated.html`, `incompleteCheckout.html` and `weeklyProgressSummary.html` use “AVA” throughout. Which one wins, and does the ADR get superseded or the emails corrected?
- Email subject case: subjects from 2026-04 are Title Case (“Your AVA Golf Account Is Ready”), subjects from 2026-09 on are sentence case (“Your session with Sam is booked”). Recase the old ones?
- Lesson or session: push copy, the coach calendar and the email category say “lesson”; the booking modal, `SessionCard.vue` and the session emails say “session”, which also means a practice session. One word for a coach booking?
- Feature-term case: “Strokes Gained” and “the Issues” are capitalised in onboarding and membership copy, lowercase everywhere else. Proper nouns or not?
- Student or player: coach surfaces say “student”, the coach onboarding story says “player”. One word?
- Error form: “Try again.” (push, swing player) against “Please try again.” (24 older strings), and “Couldn’t …” against “Failed to …”. Which form?
- Claims carried over from the retired guide: “Top 100 teaching professionals” (`MembershipPerks.vue`, `onboarding-steps.ts`, `incompleteCheckout.html`) and the tagline “Get Better. Faster.” (`ShareCta.vue`). Keep, and on what basis?
- Ghost Mode: the term is not in shipped copy. If it ships, is it a proper noun like Swing Analyzer or lowercase like hands-free capture?
