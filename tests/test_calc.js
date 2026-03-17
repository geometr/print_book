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

function tokens(str) {
  return String(str)
    .split(",")
    .filter((x) => x.length > 0)
    .map(Number);
}

function reverseCsv(str) {
  return String(str)
    .split(",")
    .filter((x) => x.length > 0)
    .reverse()
    .join(",");
}

function allPagesFromBooklet(b) {
  return tokens(b.front + "," + b.back);
}

function allPagesFromResult(r) {
  return r.booklets.flatMap((b) => allPagesFromBooklet(b));
}

test("1. pgCount=8 pps=2 -> a4Total=4 foldsTotal=4", () => {
  const r = calc.calcBooklet0({ pgCount: 8, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 4);
  assertEq(r.derived.foldsTotal, 4);
  assertEq(r.volume.bookletCount, 1);
});

test("2. pgCount=16 pps=4 -> a4Total=4 foldsTotal=4", () => {
  const r = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, pagesPerBooklet: 16, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 4);
  assertEq(r.derived.foldsTotal, 4);
  assertEq(r.volume.bookletCount, 1);
});

test("3. pgCount=32 pps=8 -> a4Total=4 foldsTotal=4", () => {
  const r = calc.calcBooklet0({ pgCount: 32, pagesPerSheet: 8, pagesPerBooklet: 32, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 4);
  assertEq(r.derived.foldsTotal, 4);
  assertEq(r.volume.bookletCount, 1);
});

test("4. padToFit=true pgCount=9 pps=2 ppb=8 -> padded=16, booklets=2, blanks=7", () => {
  const r = calc.calcBooklet0({ pgCount: 9, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: true });
  assert(r.valid, "expected valid");
  assertEq(r.volume.bookletCount, 2);
  assertEq(r.volume.paddedPgCount, 16);
  assertEq(r.volume.totalBlankPages, 7);
});

test("5. padToFit=false pgCount=9 pps=2 ppb=8 -> invalid", () => {
  const r = calc.calcBooklet0({ pgCount: 9, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(!r.valid, "expected invalid");
});

test("6. padToFit=false pgCount=16 pps=4 ppb=8 -> booklets=2", () => {
  const r = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.volume.bookletCount, 2);
  assertEq(r.volume.totalBlankPages, 0);
});

test("7. reckon: pgCount=8 pps=2 ppb=8 -> strings non-empty", () => {
  const r = calc.reckon({ pgCount: 8, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 1);
  assertEq(r.booklets.length, 1);
  assert(r.booklets[0].front.length > 0, "front empty");
  assert(r.booklets[0].back.length > 0, "back empty");
});

test("8. reckon: pgCount=16 pps=4 ppb=16 -> strings non-empty", () => {
  const r = calc.reckon({ pgCount: 16, pagesPerSheet: 4, pagesPerBooklet: 16, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 1);
  assertEq(r.booklets.length, 1);
  assert(r.booklets[0].front.length > 0, "front empty");
  assert(r.booklets[0].back.length > 0, "back empty");
});

test("9. reckon: pps=8 back-side order differs from pps=4", () => {
  const a = calc.reckon({ pgCount: 32, pagesPerSheet: 8, pagesPerBooklet: 32, padToFit: false });
  const b = calc.reckon({ pgCount: 32, pagesPerSheet: 4, pagesPerBooklet: 32, padToFit: false });
  assert(a.valid && b.valid, "expected both valid");
  assert(a.booklets[0].back !== b.booklets[0].back, "back strings should differ");
});

test("10. pgCount=0 -> validation error", () => {
  const r = calc.calcBooklet0({ pgCount: 0, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(!r.valid, "expected invalid");
});

test("11. pgCount=1 -> validation error", () => {
  const r = calc.calcBooklet0({ pgCount: 1, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(!r.valid, "expected invalid");
});

test("12. pps=8, pgCount not divisible by ppb, padToFit=false -> invalid", () => {
  const r = calc.calcBooklet0({ pgCount: 10, pagesPerSheet: 8, pagesPerBooklet: 16, padToFit: false });
  assert(!r.valid, "expected invalid");
});

test("13. reverseOutput: back strings are reversed vs standard", () => {
  const rr = calc.reckon({ pgCount: 8, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, rr.bookletCount);
  assert(out.valid, "expected valid reverse output");
  assertEq(out.booklets[0].back, reverseCsv(rr.booklets[0].back));
});

test("14. reverseOutput: front strings unchanged", () => {
  const rr = calc.reckon({ pgCount: 16, pagesPerSheet: 4, pagesPerBooklet: 16, padToFit: false });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, rr.bookletCount);
  assert(out.valid, "expected valid reverse output");
  assertEq(out.booklets[0].front, rr.booklets[0].front);
});

test("15. reverseOutput + pps=8: back ordering preserved then reversed", () => {
  const rr = calc.reckon({ pgCount: 32, pagesPerSheet: 8, pagesPerBooklet: 32, padToFit: false });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, rr.bookletCount);
  assert(out.valid, "expected valid reverse output");
  assert(rr.booklets[0].back !== out.booklets[0].back, "expected back to change in reverse mode");
  assertEq(out.booklets[0].back, reverseCsv(rr.booklets[0].back));
});

test("16. pagesPerBooklet must be divisible by pagesPerSheet*2", () => {
  const r = calc.calcBooklet0({ pgCount: 8, pagesPerSheet: 4, pagesPerBooklet: 12, padToFit: false });
  assert(!r.valid, "expected invalid");
});

test("17. reverseOutput: bookletCount mismatch -> invalid", () => {
  const rr = calc.reckon({ pgCount: 8, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, rr.bookletCount + 1);
  assert(!out.valid, "expected invalid");
});

test("18. pgCount=4 pps=2 ppb=4 -> valid, a4Total=2", () => {
  const r = calc.calcBooklet0({ pgCount: 4, pagesPerSheet: 2, pagesPerBooklet: 4, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 2);
});

test("19. pgCount=8 pps=4 ppb=8 -> valid, a4Total=2", () => {
  const r = calc.calcBooklet0({ pgCount: 8, pagesPerSheet: 4, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 2);
});

test("20. pgCount=16 pps=8 ppb=16 -> valid, a4Total=2", () => {
  const r = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 8, pagesPerBooklet: 16, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.a4Total, 2);
});

test("21. reckon pps=2 pgCount=8: front/back contain boundary pages", () => {
  const r = calc.reckon({ pgCount: 8, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  assert(r.booklets[0].front.includes("8"), "front must contain page 8");
  assert(r.booklets[0].front.includes("1"), "front must contain page 1");
  assert(r.booklets[0].back.includes("2"), "back must contain page 2");
  assert(r.booklets[0].back.includes("7"), "back must contain page 7");
});

test("22. reckon pps=2 pgCount=8: all pages 1-8 present exactly once", () => {
  const r = calc.reckon({ pgCount: 8, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  const all = allPagesFromResult(r).filter((n) => n > 0).sort((a, b) => a - b);
  for (let i = 1; i <= 8; i++) assert(all.includes(i), "missing page " + i);
  assertEq(all.length, 8, "duplicate pages found");
});

test("23. reckon pps=4 pgCount=16: all pages 1-16 present exactly once", () => {
  const r = calc.reckon({ pgCount: 16, pagesPerSheet: 4, pagesPerBooklet: 16, padToFit: false });
  assert(r.valid, "expected valid");
  const all = allPagesFromResult(r).filter((n) => n > 0).sort((a, b) => a - b);
  for (let i = 1; i <= 16; i++) assert(all.includes(i), "missing page " + i);
  assertEq(all.length, 16);
});

test("24. reckon pps=8 pgCount=32: all pages 1-32 present exactly once", () => {
  const r = calc.reckon({ pgCount: 32, pagesPerSheet: 8, pagesPerBooklet: 32, padToFit: false });
  assert(r.valid, "expected valid");
  const all = allPagesFromResult(r).filter((n) => n > 0).sort((a, b) => a - b);
  for (let i = 1; i <= 32; i++) assert(all.includes(i), "missing page " + i);
  assertEq(all.length, 32);
});

test("25. reckon computed booklets=2 pgCount=16 pps=2 ppb=8: each booklet non-empty", () => {
  const r = calc.reckon({ pgCount: 16, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 2);
  assertEq(r.booklets.length, 2);
  assert(r.booklets[0].front.length > 0, "booklet 1 front empty");
  assert(r.booklets[1].front.length > 0, "booklet 2 front empty");
});

test("26. reckon computed booklets=2: no overlap between booklets", () => {
  const r = calc.reckon({ pgCount: 16, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  const pages0 = allPagesFromBooklet(r.booklets[0]).filter((n) => n > 0);
  const pages1 = allPagesFromBooklet(r.booklets[1]).filter((n) => n > 0);
  const overlap = pages0.filter((p) => pages1.includes(p));
  assertEq(overlap.length, 0, "booklets share pages: " + overlap);
});

test("27. reckon computed booklets=2: all pages covered", () => {
  const r = calc.reckon({ pgCount: 16, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(r.valid, "expected valid");
  const all = allPagesFromResult(r).filter((n) => n > 0).sort((a, b) => a - b);
  for (let i = 1; i <= 16; i++) assert(all.includes(i), "missing page " + i);
});

test("28. padToFit=true: padding uses N+1.. and totalBlankPages computed", () => {
  const r = calc.reckon({ pgCount: 20, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: true });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 3);
  assertEq(r.totalBlankPages, 4);
  const all = allPagesFromResult(r);
  assert(!all.includes(0), "did not expect 0 padding pages");
  const nums = all.filter((n) => n > 0).sort((a, b) => a - b);
  for (let i = 1; i <= 24; i++) assert(nums.includes(i), "missing page " + i);
  assertEq(nums.length, 24, "expected each page number exactly once");
});

test("29. reverseOutput computed booklets=2: both backs reversed", () => {
  const rr = calc.reckon({ pgCount: 16, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(rr.valid, "expected valid");
  assertEq(rr.bookletCount, 2);
  const out = calc.reverseOutput(rr, rr.bookletCount);
  assert(out.valid, "expected valid");
  [0, 1].forEach((i) => {
    const expected = reverseCsv(rr.booklets[i].back);
    assertEq(out.booklets[i].back, expected, "booklet " + i + " back mismatch");
    assertEq(out.booklets[i].front, rr.booklets[i].front, "booklet " + i + " front changed");
  });
});

test("30. suggestBookletCount: 0 pages -> 0", () => {
  assertEq(calc.suggestBookletCount(0, 8), 0);
});

test("31. suggestBookletCount: 1..8 pages -> 1", () => {
  assertEq(calc.suggestBookletCount(1, 8), 1);
  assertEq(calc.suggestBookletCount(8, 8), 1);
});

test("32. suggestBookletCount: 9 pages with ppb=8 -> 2", () => {
  assertEq(calc.suggestBookletCount(9, 8), 2);
});

test("33. foldsTotal equals a4Total for pps=4", () => {
  const r = calc.calcBooklet0({ pgCount: 16, pagesPerSheet: 4, pagesPerBooklet: 16, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.derived.foldsTotal, r.derived.a4Total);
});

test("34. foldsTotal is positive", () => {
  const r = calc.calcBooklet0({ pgCount: 32, pagesPerSheet: 8, pagesPerBooklet: 32, padToFit: false });
  assert(r.valid, "expected valid");
  assert(r.derived.foldsTotal > 0);
});

test("35. pagesPerBookletToA4(8, 2) -> 4", () => {
  assertEq(calc.pagesPerBookletToA4(8, 2), 4);
});

test("36. pagesPerBookletToA4(8, 4) -> 2", () => {
  assertEq(calc.pagesPerBookletToA4(8, 4), 2);
});

test("37. pagesPerBookletToA4(8, 8) -> 1", () => {
  assertEq(calc.pagesPerBookletToA4(8, 8), 1);
});

test("38. pagesPerBookletToA4(7, 2) -> null", () => {
  assertEq(calc.pagesPerBookletToA4(7, 2), null);
});

test("39. pagesPerBookletToA4(0, 2) -> null", () => {
  assertEq(calc.pagesPerBookletToA4(0, 2), null);
});

test("40. a4ToPages(4, 2) -> 8", () => {
  assertEq(calc.a4ToPages(4, 2), 8);
});

test("41. a4ToPages(2, 4) -> 8", () => {
  assertEq(calc.a4ToPages(2, 4), 8);
});

test("42. a4ToPages(0, 2) -> null", () => {
  assertEq(calc.a4ToPages(0, 2), null);
});

test("43. round-trip: a4ToPages(pagesPerBookletToA4(8, 2), 2) == 8", () => {
  const a4 = calc.pagesPerBookletToA4(8, 2);
  assertEq(calc.a4ToPages(a4, 2), 8);
});

test("44. padToFit=true pgCount=300 pps=4 ppb=32 -> booklets=10 blanks > 0", () => {
  const r = calc.reckon({ pgCount: 300, pagesPerSheet: 4, pagesPerBooklet: 32, padToFit: true });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 10);
  assert(r.totalBlankPages > 0, "expected blank pages added");
});

test("45. padToFit=true: each booklet has exactly pagesPerBooklet tokens (including blanks)", () => {
  const r = calc.reckon({ pgCount: 20, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: true });
  assert(r.valid, "expected valid");
  for (const b of r.booklets) {
    const tks = allPagesFromBooklet(b);
    assertEq(tks.length, 8);
  }
});

test("46. padToFit=false pgCount=320 pps=4 ppb=32 -> valid, booklets=10 blanks=0", () => {
  const r = calc.reckon({ pgCount: 320, pagesPerSheet: 4, pagesPerBooklet: 32, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 10);
  assertEq(r.totalBlankPages, 0);
});

test("47. padToFit=false pgCount=300 pps=4 ppb=32 -> invalid", () => {
  const r = calc.reckon({ pgCount: 300, pagesPerSheet: 4, pagesPerBooklet: 32, padToFit: false });
  assert(!r.valid, "expected invalid");
});

test("48. suggestBookletCount(300, 32) -> 10", () => {
  assertEq(calc.suggestBookletCount(300, 32), 10);
});

test("49. reckon bookletCount=10 for pgCount=300 pps=4 ppb=32", () => {
  const r = calc.reckon({ pgCount: 300, pagesPerSheet: 4, pagesPerBooklet: 32, padToFit: true });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 10);
});

test("50. reckon pgCount=301 pps=4 ppb=32 padToFit=true -> bookletCount=10, blanks>0", () => {
  const r = calc.reckon({ pgCount: 301, pagesPerSheet: 4, pagesPerBooklet: 32, padToFit: true });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 10);
  assert(r.totalBlankPages > 0, "expected blanks");
});

test("51. reckon pgCount=32 pps=4 ppb=32 -> bookletCount=1", () => {
  const r = calc.reckon({ pgCount: 32, pagesPerSheet: 4, pagesPerBooklet: 32, padToFit: false });
  assert(r.valid, "expected valid");
  assertEq(r.bookletCount, 1);
});

test("52. reverseOutput does not change bookletCount", () => {
  const rr = calc.reckon({ pgCount: 16, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(rr.valid, "expected valid");
  const out = calc.reverseOutput(rr, rr.bookletCount);
  assert(out.valid, "expected valid");
  assertEq(rr.booklets.length, out.booklets.length);
});

test("53. padToFit=false: bookletCount computed but invalid when not divisible", () => {
  const r = calc.calcBooklet0({ pgCount: 17, pagesPerSheet: 2, pagesPerBooklet: 8, padToFit: false });
  assert(!r.valid, "expected invalid");
});
