---
what: current state of print_book project
update: after each work session
owner: print_book
---

# Status

last_updated: 2026-03-18T00:53:25

## Done

- core calc engine (calc.js), pure functions, no DOM
- i18n RU/EN, lang switcher, ?lang= URL param
- UI: pgCount, pagesPerSheet, pagesPerBooklet, padToFit
- computed results: bookletCount, a4PerBooklet, totalBlankPages
- print progress tracking per signature side
- copy buttons per side
- binding advisories (home stapler thresholds)
- field hints for all inputs
- SEO: meta, OG, JSON-LD, hreflang, robots.txt, sitemap.xml
- light/dark theme, system preference + manual toggle
- clean Apple-style UI, large targets (44px min)
- help section collapsible RU/EN
- placeholder images: favicon, OG, apple-touch-icon
- 53 tests passing

## In progress

- full help text port from inspiration (RU done, EN partial)

## Blocked

- none

## Next

- deploy to server
- replace CANONICAL_URL placeholder in sitemap.xml
- replace og:url placeholder in index.html
- real domain in og-image once known
- test on mobile

## Known issues

- see KNOWN_ISSUES.md

