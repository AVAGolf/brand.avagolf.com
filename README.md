# AVA Golf Brand Guidelines

The official brand guidelines for [AVA Golf](https://avagolf.com) — the first golf intelligence system.

**Live site:** [brand.avagolf.com](https://brand.avagolf.com)

---

## About AVA Golf

AVA Golf is the first golf intelligence system — a grand unifier of player data that aggregates and analyzes performance data from every platform a golfer uses, applies machine learning to identify exactly what to work on, and delivers a personalized video playlist from Top 100 teaching professionals to accelerate improvement.

Golfers today generate more data than ever — from launch monitors, simulators, shot trackers, and wearables — but have no single system that connects it all and tells them what it means. AVA Golf solves that.

**Pricing:** $100/month  
**Homepage:** [avagolf.com](https://avagolf.com)  
**Press:** [news.avagolf.com](https://news.avagolf.com)

---

## What's in These Guidelines

The brand guide covers everything needed to implement AVA Golf's visual and communication identity correctly:

- **Logo Marks** — primary, secondary, and tertiary logo variants; usage rules
- **Colors** — full primary and secondary palette with hex values
- **Typography** — typefaces, weights, and usage hierarchy
- **Assets** — downloadable brand pack (logos, icons, color swatches)
- **Application** — real-world usage examples across digital and print
- **Brand Voice** — tone, language principles, and communication guidelines
- **Values & Pillars** — the brand's foundational positioning
- **Audience** — who AVA Golf is built for

---

## Core Brand Values

- **Intelligent** — clarity and expertise, accessible but performance-focused
- **Confident** — assured, never exaggerated, grounded in real outcomes
- **Grounded** — no hype, no gimmicks, precision and trust above all

Tagline: **Get Better. Faster.**

Brand pillars: **Data with Direction**, **Personalized Progression**, and **Mastery Without Guesswork**

---

## Color Palette

### Primary
| Token | Hex |
|---|---|
| green-500 | `#349683` |
| green-900 | `#16382E` |
| yellow-500 | `#FFE708` |
| yellow-300 | `#FFFF4A` |
| white | `#FFFFFF` |

### Secondary
| Token | Hex |
|---|---|
| bright-green-500 | `#17DEB7` |
| dark-green-900 | `#070E0C` |

---

## Typography

| Role | Typeface |
|---|---|
| Display / Headings | Google Sans Flex Bold + Extra Bold (uppercase) |
| Body / Titles | Google Sans Flex (full weight range) |
| Stats / Secondary Display | Construct Mono |
| Technical Text | DM Mono |

---

## Download Brand Pack

All logo files (SVG, PNG), color swatches, and font references are available via the brand guide:  
[Download Brand Pack](https://brand.avagolf.com/files/AVA_Golf_Brand_Pack.zip)

---

## Tech Stack

Built with [Astro](https://astro.build) (static output) + Tailwind CSS v4, deployed via GitHub Actions to S3, served through Fastly and Cloudflare.

```
pnpm install     # Install dependencies
pnpm dev         # Local dev at localhost:3000
pnpm build       # Build to ./dist/
pnpm preview     # Preview build locally
```

All dependencies live in `devDependencies` — this is a static site with no server runtime, so nothing here needs to ship to production; `astro build` just emits plain HTML/CSS/JS to `dist/`.

---

## Project Structure

```
src/
├── components/    # Reusable UI: BrandFooter, BrandHeader, BrandSidebar,
│                  # BrandPagination, ColorSwatch, CopyCodeBlock,
│                  # LogoMarkSet, LogoBackgroundBox
├── layouts/       # Layout.astro (HTML shell, SEO/OG/JSON-LD) and
│                  # BrandLayout.astro (sidebar + header + pagination + footer)
├── lib/           # sections.ts (nav/pagination ordering), colors.ts (color tokens)
├── styles/        # global.css — Tailwind v4 theme + typography utilities
└── pages/         # One .astro file per route, each wrapped in BrandLayout
```

**Conventions:**
- Every page composes `BrandLayout`; page-specific content goes in the default slot.
- Repeated content (color swatches, nav links, logo variants, etc.) is defined as a
  data array in the page/component frontmatter and rendered with `.map()` — avoid
  hand-writing near-identical markup blocks more than once.
- Color hex values are defined once in `src/lib/colors.ts` and imported wherever
  needed (`colors.astro`, `tokens.astro`) rather than re-typed.
- Nav/pagination ordering is defined once in `src/lib/sections.ts`.

---

## Social

- Instagram: [@avagolfofficial](https://www.instagram.com/avagolfofficial/)
- LinkedIn: [AVA Golf](https://www.linkedin.com/company/avagolf/)
- YouTube: [@avagolfofficial](https://www.youtube.com/@avagolfofficial)
- TikTok: [@ava.golf](https://www.tiktok.com/@ava.golf)
- Facebook: [avagolf](https://facebook.com/avagolf)

---

© 2026 AVA Golf, Inc. All rights reserved.  
A [ParOne, Inc.](https://parone.com) company.