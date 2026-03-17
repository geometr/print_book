---
what: current state of this project
update: after each work session
owner: print_book
---
# Status
last_updated: 2026-03-18T00:29:11
done:
  - src/index.html (single page UI)
  - src/css/style.css (styles)
  - src/js/calc.js (pure calc)
  - src/js/i18n.js (RU/EN strings + help)
  - src/js/book.js (DOM glue)
  - tests/test_calc.js (53 tests, Node)
  - reverse-feed printer output mode
  - result labels update on language switch
  - help: rewritten (RU/EN, no internal links, printer photo placeholders)
  - validation errors + fix recommendations in UI
  - SEO: meta/OG/JSON-LD, semantic HTML, robots.txt, sitemap.xml, i18n URLs
  - a4PerBooklet removed from form (computed output only)
  - binding advisory with home-use thresholds
  - pad-to-fit all signatures (blank pages per signature)
  - 300-page defaults on load (pgCount=300, pps=4, booklets=10, pagesPerBooklet=32, padToFit=true)
  - pgCount change updates bookletCount only (pagesPerBooklet stable)
  - bookletCount moved to computed results (input removed)
  - simplified inputs: pgCount, pagesPerSheet, pagesPerBooklet, padToFit
  - pad pages numbered as N+1.. (no zero placeholders)
  - padToFit toggle aligned to signature row
  - padToFit field label spacer (blank label for grid alignment)
  - padToFit grid item aligned to top
  - clean system UI (no gradients/shadows)
  - light/dark theme toggle (localStorage + prefers-color-scheme)
  - large tap targets (44px) and high contrast layout
in_progress:
  - none
blocked:
  - none
next:
  - verify UI in browser
  - compare outputs vs inspiration for same inputs
