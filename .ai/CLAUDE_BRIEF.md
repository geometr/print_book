---
what: Prompt/context pack for external analysis of print_book inspiration code.
update: When inspiration source or desired product scope changes.
owner: print_book
last_updated: 2026-03-17T18:32:33
---

# Claude Analysis Brief (print_book)

## Goal

Analyze the saved inspiration code and produce a development-ready task spec for building a single-page web service (SPA) based on it.

The output of your analysis will be used as the engineering task definition for implementation.

## Repository Context

Project path: `projects/print_book/`

This is a static web project with:

- `index.html`: a small placeholder page.
- `inspiration/print.html`: a saved web page containing the real calculator UI and behavior.
- `inspiration/i_files/index_v_01.css`: styles for the inspiration page.
- `inspiration/i_files/index_v_01.js` (non-ASCII filename in repo): main JavaScript logic.
- `inspiration/i_files/*`: images and other assets.

Current custom files are mostly empty:

- `css/style.css`: empty.
- `js/book.js`: empty.

## What To Build

Build a single-page web service that replicates the calculator from `inspiration/print.html`:

- input: document page count and printing options
- output: printable page order strings and user-facing print instructions
- behavior: recalc on changes; show a results section

Keep the new implementation maintainable and testable.

Open question to resolve in spec:

- UI language: the inspiration page is Russian; repository standards prefer English in files. Decide: English UI, Russian UI, or i18n.

## Key UI Elements (from inspiration HTML)

Form id/name: `BroshCalc`

Inputs (form fields used by JS):

- `PgNmbr_in`: total pages in the document
- `PgPerSheet_r`: radio group for pages-per-sheet (seen: 2, 4, 8)
- `BroshN_in`: number of booklets/signatures
- `A4perBrosh_in`: number of A4 sheets per booklet
- `FinPgAdded_ch_bx`: checkbox, indicates if a blank last page exists/allowed

Computed outputs written by JS:

- `A4sum_in`
- `FoldsSum_in`
- `FoldsPerBrosh_in`
- `PgPerBrosh_in`
- `A4perLastBrosh_in`
- `FoldsPerLastBrosh_in`
- `LastBroshPg_in`

DOM output containers:

- `InCorrVal_tab`: displays "volume correct/incorrect" message
- `Tab2` + dynamic inserted cell for results (JS inserts a row into `Tab2`)

Buttons:

- digit keypad buttons call `doc_vol_input(n)` to edit `PgNmbr_in`
- main action button calls `calc_res()`

## Key Functions (from inspiration JS)

These functions exist and represent the behavior to port:

- `calc_brosh_0()`: initial computation from `PgNmbr_in` and pages-per-sheet
- `calc_brosh_1()`: recomputation when booklet count or A4-per-booklet changes
- `PPSH_ch()`: handler when pages-per-sheet radio changes
- `FinPgAdded_ch()`: handler for blank-page checkbox
- `calc_res()`: generates the final output HTML and triggers the full compute
- `reckon()`: core algorithm that builds printing sequences (page number distribution)
- `calc_out()`: writes computed values back into form fields
- helper/UI: `doc_vol_input`, `txt2nmbr_ch`, `result_cell_delete`, `sub_help*`, `scroll_me_up`, `set_bottom`

## Algorithm Notes (what to extract)

The algorithm computes booklet printing order for:

- multiple booklets/signatures
- A4 sheets per booklet
- pages per sheet: 2/4/8
- correct total pages divisibility constraints (adds "empty page" handling)

In JS the main data structures are:

- `PrnDistrU`: 4D distribution array of page numbers
- `PagesStrComU`: per booklet and per A4 sheet print strings (front/back)
- `PagesStrCom`: per booklet aggregated print strings (front/back)

`reckon()` creates those sequences.

In 8-pages-per-sheet mode, back-side ordering differs (special even/odd handling).

## Known Issues in Source

- Encoding: the saved HTML/JS/CSS contain Cyrillic text and look mis-decoded in some places.
- File names: `index_v_01.js` (non-ASCII filename in repo) should be normalized in the new codebase.
- The inspiration HTML includes extra help sections and content that may be out of scope.

## Deliverable From Claude

Produce a spec with:

1. Product scope: what is in/out (MVP vs nice-to-have).
2. Data model: inputs, derived values, outputs; validation rules.
3. Algorithm description: step-by-step, including 2/4/8 modes and edge cases.
4. UI map: list of fields and how they update; result rendering.
5. Test plan: at least 10 concrete test cases with inputs and expected outputs/shape.
6. Acceptance criteria: clear checklist for "done".
7. Refactor plan: how to migrate from the inspiration assets into clean source layout.
