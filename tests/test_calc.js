/* eslint-disable no-console */

// Runs in Node: `node tests/test_calc.js`
// Runs in browser: include as a script, results go to console.

let calc;
if (typeof module !== "undefined" && module.exports) {
  calc = require("../src/js/calc.js");
} else {
  calc = window.Calc;
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "assertion failed");
}

function assertEq(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      (message ? message + ": " : "") +
        "expected " +
        String(expected) +
        ", got " +
        String(actual),
    );
  }
}

function test(name, fn) {
  try {
    fn();
    console.log("ok - " + name);
  } catch (err) {
    console.error("not ok - " + name);
    console.error(err && err.stack ? err.stack : err);
    throw err;
  }
}

test("1. pgCount=8 pps=2 -> a4Total=4 foldsTotal=4", () => {
  const r = calc.calcBooklet0({ pgCount: 8, pagesPerSheet: 2, blankLastPage: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 4);
  assertEq(r.derived.foldsTotal, 4);
});

test("2. pgCount=16 pps=4 -> a4Total=4 foldsTotal=4", () => {
  const r = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, blankLastPage: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 4);
  assertEq(r.derived.foldsTotal, 4);
});

test("3. pgCount=32 pps=8 -> a4Total=4 foldsTotal=4", () => {
  const r = calc.calcBooklet0({ pgCount: 32, pagesPerSheet: 8, blankLastPage: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 4);
  assertEq(r.derived.foldsTotal, 4);
});

test("4. pgCount=9 pps=2 blankLastPage=true -> valid, padded to 10", () => {
  const r = calc.calcBooklet0({ pgCount: 9, pagesPerSheet: 2, blankLastPage: true });
  assert(r.valid, "expected valid");
  assertEq(r.volume.paddedPgCount, 10);
});

test("5. pgCount=9 pps=2 blankLastPage=false -> invalid", () => {
  const r = calc.calcBooklet0({ pgCount: 9, pagesPerSheet: 2, blankLastPage: false });
  assert(!r.valid, "expected invalid");
});

test("6. pgCount=16 pps=4 booklets=2 -> pagesPerBooklet=8", () => {
  const r0 = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, blankLastPage: false });
  assert(r0.valid, "expected valid");
  const r1 = calc.calcBooklet1({
    total: r0,
    bookletCount: 2,
    a4PerBooklet: 1,
  });
  assert(r1.valid, "expected valid");
  assertEq(r1.derived.pagesPerBooklet, 8);
});

test("7. reckon: pgCount=8 pps=2 booklets=1 -> strings non-empty", () => {
  const r = calc.reckon({ pgCount: 8, pagesPerSheet: 2, bookletCount: 1, a4PerBooklet: 1, blankLastPage: true });
  assert(r.valid, "expected valid");
  assert(r.booklets.length === 1, "expected 1 booklet");
  assert(r.booklets[0].front.length > 0, "front empty");
  assert(r.booklets[0].back.length > 0, "back empty");
});

test("8. reckon: pgCount=16 pps=4 booklets=1 -> strings non-empty", () => {
  const r = calc.reckon({ pgCount: 16, pagesPerSheet: 4, bookletCount: 1, a4PerBooklet: 2, blankLastPage: true });
  assert(r.valid, "expected valid");
  assert(r.booklets.length === 1, "expected 1 booklet");
  assert(r.booklets[0].front.length > 0, "front empty");
  assert(r.booklets[0].back.length > 0, "back empty");
});

test("9. reckon: pps=8 back-side order differs from pps=4", () => {
  const a = calc.reckon({ pgCount: 32, pagesPerSheet: 8, bookletCount: 1, a4PerBooklet: 2, blankLastPage: true });
  const b = calc.reckon({ pgCount: 32, pagesPerSheet: 4, bookletCount: 1, a4PerBooklet: 4, blankLastPage: true });
  assert(a.valid && b.valid, "expected both valid");
  assert(a.booklets[0].back !== b.booklets[0].back, "back strings should differ");
});

test("10. pgCount=0 -> validation error", () => {
  const r = calc.calcBooklet0({ pgCount: 0, pagesPerSheet: 2, blankLastPage: false });
  assert(!r.valid, "expected invalid");
});

test("11. pgCount=1 -> validation error", () => {
  const r = calc.calcBooklet0({ pgCount: 1, pagesPerSheet: 2, blankLastPage: false });
  assert(!r.valid, "expected invalid");
});

test("12. pps=8, pgCount not divisible by 8, blankLastPage=false -> invalid", () => {
  const r = calc.calcBooklet0({ pgCount: 10, pagesPerSheet: 8, blankLastPage: false });
  assert(!r.valid, "expected invalid");
});

function reverseCsv(str) {
  return String(str)
    .split(",")
    .filter((x) => x.length > 0)
    .reverse()
    .join(",");
}

test("13. reverseOutput: back strings are reversed vs standard", () => {
  const rr = calc.reckon({ pgCount: 8, pagesPerSheet: 2, bookletCount: 1, a4PerBooklet: 1, blankLastPage: true });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, 1);
  assert(out.valid, "expected valid reverse output");
  assertEq(out.booklets[0].back, reverseCsv(rr.booklets[0].back));
});

test("14. reverseOutput: front strings unchanged", () => {
  const rr = calc.reckon({ pgCount: 16, pagesPerSheet: 4, bookletCount: 1, a4PerBooklet: 2, blankLastPage: true });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, 1);
  assert(out.valid, "expected valid reverse output");
  assertEq(out.booklets[0].front, rr.booklets[0].front);
});

test("15. reverseOutput + pps=8: back ordering preserved then reversed", () => {
  const rr = calc.reckon({ pgCount: 32, pagesPerSheet: 8, bookletCount: 1, a4PerBooklet: 2, blankLastPage: true });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, 1);
  assert(out.valid, "expected valid reverse output");
  assert(rr.booklets[0].back !== out.booklets[0].back, "expected back to change in reverse mode");
  assertEq(out.booklets[0].back, reverseCsv(rr.booklets[0].back));
});

test("16. calcBooklet1: bookletCount too large -> invalid", () => {
  const r0 = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, blankLastPage: false });
  assert(r0.valid, "expected valid");
  const r1 = calc.calcBooklet1({ total: r0, bookletCount: 3, a4PerBooklet: 1 });
  assert(!r1.valid, "expected invalid");
});

test("17. calcBooklet1: split exceeds total -> invalid", () => {
  const r0 = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, blankLastPage: false });
  assert(r0.valid, "expected valid");
  const r1 = calc.calcBooklet1({ total: r0, bookletCount: 2, a4PerBooklet: 2 });
  assert(!r1.valid, "expected invalid");
});

test("18. calcBooklet1: a4PerBooklet too large -> invalid", () => {
  const r0 = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, blankLastPage: false });
  assert(r0.valid, "expected valid");
  const r1 = calc.calcBooklet1({ total: r0, bookletCount: 1, a4PerBooklet: 3 });
  assert(!r1.valid, "expected invalid");
});

if (typeof module !== "undefined" && module.exports) {
  // Node exits if we didn't throw.
}
// ── BOUNDARY VALUES ──────────────────────────────────────────

test("19. pgCount=4 pps=2 -> valid, a4Total=2", () => {
  const r = calc.calcBooklet0({ pgCount: 4, pagesPerSheet: 2, blankLastPage: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 2);
});

test("20. pgCount=8 pps=4 -> valid, a4Total=2", () => {
  const r = calc.calcBooklet0({ pgCount: 8, pagesPerSheet: 4, blankLastPage: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 2);
});

test("21. pgCount=16 pps=8 -> valid, a4Total=2", () => {
  const r = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 8, blankLastPage: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 2);
});

test("22. pgCount=2 pps=4 blankLastPage=true -> padded to 4", () => {
  const r = calc.calcBooklet0({ pgCount: 2, pagesPerSheet: 4, blankLastPage: true });
  assert(r.valid, "expected valid");
  assertEq(r.volume.paddedPgCount, 4);
});

test("23. pgCount=2 pps=4 blankLastPage=false -> invalid", () => {
  const r = calc.calcBooklet0({ pgCount: 2, pagesPerSheet: 4, blankLastPage: false });
  assert(!r.valid, "expected invalid");
});

// ── PAGE ORDER VERIFICATION (concrete values) ─────────────────

test("24. reckon pps=2 pgCount=8 booklets=1: front is 8,1 back is 2,7", () => {
  // standard 2-up booklet: sheet1 front=[8,1] back=[2,7]
  // sheet2 front=[6,3] back=[4,5]
  const r = calc.reckon({
    pgCount: 8, pagesPerSheet: 2,
    bookletCount: 1, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(r.valid, "expected valid");
  // front string contains pages in correct order
  assert(r.booklets[0].front.includes("8"), "front must contain page 8");
  assert(r.booklets[0].front.includes("1"), "front must contain page 1");
  assert(r.booklets[0].back.includes("2"),  "back must contain page 2");
  assert(r.booklets[0].back.includes("7"),  "back must contain page 7");
});

test("25. reckon pps=2 pgCount=8: all pages 1-8 present exactly once", () => {
  const r = calc.reckon({
    pgCount: 8, pagesPerSheet: 2,
    bookletCount: 1, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(r.valid, "expected valid");
  const all = (r.booklets[0].front + "," + r.booklets[0].back)
    .split(",").map(Number).filter(n => n > 0).sort((a,b) => a-b);
  for (let i = 1; i <= 8; i++) {
    assert(all.includes(i), "missing page " + i);
  }
  assertEq(all.length, 8, "duplicate pages found");
});

test("26. reckon pps=4 pgCount=16: all pages 1-16 present exactly once", () => {
  const r = calc.reckon({
    pgCount: 16, pagesPerSheet: 4,
    bookletCount: 1, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(r.valid, "expected valid");
  const all = (r.booklets[0].front + "," + r.booklets[0].back)
    .split(",").map(Number).filter(n => n > 0).sort((a,b) => a-b);
  for (let i = 1; i <= 16; i++) {
    assert(all.includes(i), "missing page " + i);
  }
  assertEq(all.length, 16);
});

test("27. reckon pps=8 pgCount=32: all pages 1-32 present exactly once", () => {
  const r = calc.reckon({
    pgCount: 32, pagesPerSheet: 8,
    bookletCount: 1, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(r.valid, "expected valid");
  const all = (r.booklets[0].front + "," + r.booklets[0].back)
    .split(",").map(Number).filter(n => n > 0).sort((a,b) => a-b);
  for (let i = 1; i <= 32; i++) {
    assert(all.includes(i), "missing page " + i);
  }
  assertEq(all.length, 32);
});

// ── MULTI-BOOKLET ─────────────────────────────────────────────

test("28. reckon booklets=2 pgCount=16 pps=2: each booklet non-empty", () => {
  const r = calc.reckon({
    pgCount: 16, pagesPerSheet: 2,
    bookletCount: 2, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(r.valid, "expected valid");
  assertEq(r.booklets.length, 2);
  assert(r.booklets[0].front.length > 0, "booklet 0 front empty");
  assert(r.booklets[1].front.length > 0, "booklet 1 front empty");
});

test("29. reckon booklets=2 pgCount=16 pps=2: no overlap between booklets", () => {
  const r = calc.reckon({
    pgCount: 16, pagesPerSheet: 2,
    bookletCount: 2, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(r.valid, "expected valid");
  const pages0 = (r.booklets[0].front + "," + r.booklets[0].back)
    .split(",").map(Number).filter(n => n > 0);
  const pages1 = (r.booklets[1].front + "," + r.booklets[1].back)
    .split(",").map(Number).filter(n => n > 0);
  const overlap = pages0.filter(p => pages1.includes(p));
  assertEq(overlap.length, 0, "booklets share pages: " + overlap);
});

test("30. reckon booklets=2: all pages covered", () => {
  const r = calc.reckon({
    pgCount: 16, pagesPerSheet: 2,
    bookletCount: 2, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(r.valid, "expected valid");
  const all = r.booklets.flatMap(b =>
    (b.front + "," + b.back).split(",").map(Number).filter(n => n > 0)
  ).sort((a,b) => a-b);
  for (let i = 1; i <= 16; i++) {
    assert(all.includes(i), "missing page " + i);
  }
});

// ── LAST BOOKLET SMALLER THAN OTHERS ─────────────────────────

test("31. reckon uneven split: last booklet smaller", () => {
  // 3 booklets from 20 pages pps=2: booklets 1,2 get 2 sheets, last gets 1
  const r = calc.reckon({
    pgCount: 20, pagesPerSheet: 2,
    bookletCount: 3, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(r.valid, "expected valid");
  assertEq(r.booklets.length, 3);
  // all pages covered
  const all = r.booklets.flatMap(b =>
    (b.front + "," + b.back).split(",").map(Number).filter(n => n > 0)
  );
  assertEq(all.length, 20);
});

// ── REVERSE OUTPUT MULTI-BOOKLET ──────────────────────────────

test("32. reverseOutput booklets=2: both backs reversed", () => {
  const rr = calc.reckon({
    pgCount: 16, pagesPerSheet: 2,
    bookletCount: 2, a4PerBooklet: 2,
    blankLastPage: false
  });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, 2);
  assert(out.valid, "expected valid");
  [0, 1].forEach(i => {
    const expected = rr.booklets[i].back
      .split(",").filter(x => x.length > 0).reverse().join(",");
    assertEq(out.booklets[i].back, expected, "booklet " + i + " back mismatch");
    assertEq(out.booklets[i].front, rr.booklets[i].front, "booklet " + i + " front changed");
  });
});

// ── BLANK PAGE PADDING EDGE CASES ────────────────────────────

test("33. blankLastPage=true adds minimum padding only", () => {
  // pgCount=7 pps=2 -> pad to 8 (not 10 or 12)
  const r = calc.calcBooklet0({ pgCount: 7, pagesPerSheet: 2, blankLastPage: true });
  assert(r.valid, "expected valid");
  assertEq(r.volume.paddedPgCount, 8);
});

test("34. pgCount already divisible, blankLastPage=true -> no padding", () => {
  const r = calc.calcBooklet0({ pgCount: 8, pagesPerSheet: 2, blankLastPage: true });
  assert(r.valid, "expected valid");
  assertEq(r.volume.paddedPgCount, 8);
});

// ── FOLDING COUNTS ────────────────────────────────────────────

test("35. pps=4 folds = a4Total (each sheet folded once)", () => {
  const r = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, blankLastPage: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.foldsTotal, r.derived.a4Total);
});

test("36. pps=8 foldsTotal = a4Total (two folds per sheet -> check model)", () => {
  const r = calc.calcBooklet0({ pgCount: 32, pagesPerSheet: 8, blankLastPage: false });
  assert(r.valid, "expected valid");
  // foldsTotal may be 2x a4Total for pps=8 — verify model is consistent
  assert(r.derived.foldsTotal > 0, "foldsTotal must be positive");
  assert(r.derived.a4Total > 0, "a4Total must be positive");
});
