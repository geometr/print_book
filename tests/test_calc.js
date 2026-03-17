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

if (typeof module !== "undefined" && module.exports) {
  // Node exits if we didn't throw.
}

