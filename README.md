# AVA Golf Brand Guidelines

The official brand guidelines for [AVA Golf](https://avagolf.com), the first golf
intelligence system, built with [Astro](https://astro.build) and live at
[brand.avagolf.com](https://brand.avagolf.com). The nav, footer, palette and
fonts are avagolf.com's, taken from its `main` on every build, so all the AVA
sites share one set of chrome. The guideline pages, the sidebar and the brand
pack download are this repo's.

The guidelines cover logo marks, colors, typography, brand elements (textures,
product screenshots, the explainer video) and communication (overview, values,
pillars, voice, audience). The tagline is **Get Better. Faster.**; Data with
Direction, Personalized Progression and Mastery without Guesswork are the
brand pillars. For a plain-text summary, read
[brand.avagolf.com/llms.txt](https://brand.avagolf.com/llms.txt).

## Tech stack

- **Astro 7**: static output, one `.astro` file per route
- **Tailwind CSS 4** for page layout, on avagolf.com's palette
- **TypeScript** (strict), **Vitest**, **ESLint**
- Deployed as a static build to **AWS S3**, fronted by **Fastly** (see `.github/workflows/`)

## Prerequisites

- Node.js 24.16+
- npm (this repo commits `package-lock.json`; don't use yarn/pnpm)
- Read access to [AVAGolf/avagolf.com](https://github.com/AVAGolf/avagolf.com):
  the build takes `shared-components/` from it (your own git credentials locally)

## Getting started

```bash
git clone <repository-url>
cd brand.avagolf.com
npm install
npm run dev
```

`npm run dev` takes `shared-components/` from avagolf.com the first time and
serves the site at `localhost:3000`. No `.env` or API token is needed.

## Available scripts

- `npm run dev`: start the dev server
- `npm run build`: build for production (outputs to `dist/`), taking
  `shared-components/` fresh first
- `npm run preview`: preview the production build locally
- `npm run check`: type-check with `astro check`
- `npm test`: unit tests, plus a check that every workflow file parses
- `npm run lint`: lint with ESLint (TypeScript + Astro rules)
- `npm run take`: refresh `shared-components/` and `scripts/ci/` from avagolf.com
- `npm run lighthouse -- --profile code`: Lighthouse on `dist/`, the way PageSpeed runs it

## Shared with avagolf.com

avagolf.com is the source of the chrome every AVA site renders.
`scripts/take-shared-components.sh` copies two of its folders into this repo
before every build. Both are gitignored:

| Folder | What it is |
|---|---|
| `shared-components/` | `Nav`, `MobileMenuFooter`, `Footer`, the palette (`styles/tokens.css`), the brand fonts (`styles/fonts.css`), and the link data (`data/nav.ts`, `data/footer.ts`, `data/socials.ts`). Imported through the `@shared/*` alias. |
| `scripts/ci/` | The Lighthouse runner, the build diff and the PR comment tools the workflows call. |

To change a nav or footer link, change it in avagolf.com. This site picks it up
on its next build: the weekly deploy, or run **Deploy** by hand.
`https://brand.avagolf.com/build.json` shows which avagolf.com commit the live
site was built from.

The palette is defined once, in `shared-components/styles/tokens.css`.
`src/styles/global.css` only tells Tailwind the colour names exist
(`@theme inline reference`), so `bg-green-500` and the rest read the shared
values. The typography utilities (`text-h1`, `text-body`, ...), the gradients
and the shadows are brand's own.

What the shared chrome leaves to the site that renders it lives here, copied
from news.avagolf.com (each file says so at the top):

- `src/components/site/CookieConsent.astro`: Consent Mode v2 defaults and the
  banner, with one consent cookie across news, brand and docs
- `src/components/site/MenuInert.astro`: keeps the hidden mobile menu out of
  focus order
- `src/components/site/Head.astro`, `src/lib/schema.ts`: meta tags and JSON-LD
- `src/lib/appLinks.ts`: carries the visit's campaign and click IDs onto
  app.avagolf.com links
- `src/lib/pageParams.ts`: brand's page vocabulary (`site`, `page_group`,
  `content_slug`), in the shape news uses
- `src/lib/robots.ts`: the crawler rules every AVA site shares

## Navigation

The guideline pages are listed once, in `src/lib/sections.ts`, in sidebar
order and grouped. From 901px up (where the shared bar shows its desktop
links) they are a fixed sidebar under the shared bar, `BrandSidebar`. Below
that, the shared bar's MENU button is the only menu on the page, and the same
list is inside it (`BrandMenu`, passed through `<Nav>`'s slot). The
pagination at the foot of each page and `/llms.txt` read the same list.

There is no client-side router: every page is a full load, and hover prefetch
makes the next one quick. (The shared Nav binds its menu once per load.)

## Analytics

brand keeps its own GA4 tag, `G-X34R7TJNMF`, as Google's gtag.js snippet in
`src/layouts/Layout.astro`. Fastly also injects avagolf.com's GTM container
(`GTM-54XS4HQ8`) into every page, first-party from `/cv9l/`; nothing in this
repo configures it. `CookieConsent` sets the Consent Mode defaults first in
`<head>`, before either: denied in the EEA, the UK and Switzerland until the
visitor accepts, granted elsewhere unless the browser sends Global Privacy
Control.

## The brand pack

The download on the homepage is `/files/AVA_Golf_Brand_Pack.zip`, which
[AVAGolf/AVA-Golf-Brand-Assets](https://github.com/AVAGolf/AVA-Golf-Brand-Assets)
builds and uploads straight to the bucket. It is not in this repo, and the
deploy's S3 sync leaves `files/*` alone.

That workflow also publishes `/files/brand-pack.json` with each new version:

```json
{ "version": "1.0.3", "tag": "brand-pack-v1.0.3", "published": "2026-09-27T14:03:11Z",
  "bytes": 376970681, "sha256": "…", "commit": "…",
  "url": "https://brand.avagolf.com/files/AVA_Golf_Brand_Pack.zip",
  "filename": "AVA_Golf_Brand_Pack_v1.0.3.zip" }
```

`src/lib/brandPack.ts` reads it once per build. The homepage shows
"V1.0.3 · Updated 27 Sep 2026 · 377 MB" under the button and saves the file as
`filename`; the JSON-LD and `/llms.txt` carry the same version. After
publishing, the Brand-Assets workflow runs this repo's `deploy.yml`, so the new
number is live within minutes.

- Until that workflow has published a manifest, the URL returns 404. The build
  then shows 1.0.0 and prints a warning.
- A manifest that exists but is malformed fails the build.

## Project structure

```
src/
  components/  BrandSidebar, BrandMenu, BrandHeader, BrandPagination,
               Asset, Screenshot, AnimatedScreenshot, ColorSwatch,
               CopyCodeBlock, LogoMarkSet, LogoBackgroundBox
    site/      Head, CookieConsent, MenuInert (copied from news)
  layouts/
    Layout.astro      the document: head, consent, GA4, the shared Nav
    BrandLayout.astro sidebar + header + pagination + the shared Footer
  lib/         sections, brandPack, schema, pageParams, appLinks,
               consentRegion, robots, heroImage, imageSize, colors
  content/     assets.md, screenshots.md (the Assets and Application pages)
  assets/      hero-noise-green.jpg (resized to WebP at build)
  pages/       routes, see "Routes" below
  styles/      global.css (Tailwind theme, typography utilities),
               cookieconsent.css
public/        logo marks, brand assets, screenshots, favicons, og-image.jpg
scripts/       take-shared-components.sh
infrastructure/terraform/   IaC for the S3 + Fastly service
lighthouse.config.json      pages and gates for scripts/ci/lighthouse.mjs
```

**Conventions:**
- Every guideline page composes `BrandLayout`; page content goes in the
  default slot.
- Repeated content (swatches, logo variants, screenshots) is a data array or a
  content file rendered with `.map()`, not hand-copied markup.
- Colour values shown on the Colors and Tokens pages come from
  `src/lib/colors.ts`.
- Every `<img>` carries its width and height (`src/lib/imageSize.ts` reads
  them from the file at build time).

## Routes

| Route | Page |
|---|---|
| `/` | introduction and the brand pack download |
| `/logo-marks/`, `/colors/`, `/typography/` | core identity |
| `/assets/`, `/application/`, `/video/` | brand elements |
| `/overview/`, `/values/`, `/pillars/`, `/voice/`, `/audience/` | communication |
| `/tokens/` | every colour, gradient and type style on one page (not in the sidebar) |
| `/llms.txt`, `/robots.txt`, `/sitemap-index.xml` | LLM summary, crawler rules, sitemap |
| `/build.json` | the commit and the avagolf.com commit this deploy was built from |
| `/files/AVA_Golf_Brand_Pack.zip`, `/files/brand-pack.json` | the brand pack and its manifest (uploaded by Brand-Assets) |

## Checks and deployment

- **Every pull request** (`.github/workflows/ci.yml`) runs:
  - types, unit tests, lint and a build;
  - a comparison of the build against the base branch, posted as a comment;
  - Lighthouse on four templates as the median of five mobile runs. With third
    parties blocked it must score at least 93 (`code`). With the edge's GTM
    loader added, every beacon blocked, it only reports (`served`).
- **Deploy** (`.github/workflows/deploy.yml`) runs on every push to `main`,
  every Monday at 09:17 UTC, when the brand-pack workflow starts it, and by
  hand:
  1. Builds the site.
  2. Syncs `dist/` to the `brand.avagolf.com` S3 bucket, except `files/`.
  3. Purges Fastly.

© AVA Golf, Inc. All rights reserved. A [ParOne, Inc.](https://parone.com) company.
