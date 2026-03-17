/**
 * Pure calculation functions for booklet printing.
 * No DOM access.
 */

function isInt(n) {
  return Number.isInteger(n);
}

function ceilDiv(a, b) {
  return Math.floor((a + b - 1) / b);
}

function validatePagesPerSheet(pagesPerSheet) {
  return pagesPerSheet === 2 || pagesPerSheet === 4 || pagesPerSheet === 8;
}

/**
 * calcBooklet0(pgCount, pagesPerSheet)
 * Initial volume validation and derived values.
 */
function calcBooklet0({ pgCount, pagesPerSheet, blankLastPage }) {
  const errors = [];
  if (!isInt(pgCount)) errors.push("pgCount must be an integer");
  if (!validatePagesPerSheet(pagesPerSheet)) errors.push("pagesPerSheet must be 2, 4, or 8");
  if (typeof blankLastPage !== "boolean") errors.push("blankLastPage must be boolean");

  if (errors.length) {
    return { valid: false, errors };
  }

  if (pgCount < 2) {
    return { valid: false, errors: ["pgCount must be >= 2"] };
  }

  // Display padding (matches the provided test plan).
  const displayDivisibleBy = pagesPerSheet;
  const paddedPgCount = blankLastPage ? ceilDiv(pgCount, displayDivisibleBy) * displayDivisibleBy : pgCount;

  // Compute padding (closer to inspiration constraints).
  const computeDivisibleBy = pagesPerSheet * 2;
  const computePgCount = blankLastPage ? ceilDiv(pgCount, computeDivisibleBy) * computeDivisibleBy : pgCount;

  const computeValid = pgCount % computeDivisibleBy === 0 || blankLastPage;
  if (!computeValid) {
    return {
      valid: false,
      errors: ["volume is not divisible by required unit"],
      volume: { pgCount, paddedPgCount, computePgCount, displayDivisibleBy, computeDivisibleBy },
    };
  }

  const a4Sheets = computePgCount / computeDivisibleBy;
  const a4Total = a4Sheets * 2;
  const foldsTotal = a4Sheets * 2;

  return {
    valid: true,
    errors: [],
    volume: { pgCount, paddedPgCount, computePgCount, displayDivisibleBy, computeDivisibleBy },
    derived: {
      a4Total,
      foldsTotal,
    },
  };
}

/**
 * calcBooklet1(bookletCount, a4PerBooklet, pagesPerSheet)
 * Recompute values for booklet split.
 */
function calcBooklet1({ total, bookletCount, a4PerBooklet }) {
  const errors = [];
  if (!total || total.valid !== true) errors.push("total must be a valid calcBooklet0 result");
  if (!isInt(bookletCount) || bookletCount < 1) errors.push("bookletCount must be >= 1");
  if (!isInt(a4PerBooklet) || a4PerBooklet < 1) errors.push("a4PerBooklet must be >= 1");
  if (errors.length) return { valid: false, errors };

  const pagesPerSheet = total.volume.displayDivisibleBy;
  const foldsPerA4 = pagesPerSheet / 2;

  const computeA4Sheets = total.volume.computePgCount / (pagesPerSheet * 2);

  if (bookletCount > computeA4Sheets) {
    return { valid: false, errors: ["bookletCount exceeds total A4 sheets"] };
  }

  if (a4PerBooklet > computeA4Sheets) {
    return { valid: false, errors: ["a4PerBooklet exceeds total A4 sheets"] };
  }

  if (bookletCount > 1 && a4PerBooklet * (bookletCount - 1) >= computeA4Sheets) {
    return { valid: false, errors: ["split exceeds total A4 sheets"] };
  }

  // In this project, bookletCount is the total count including the last (possibly smaller) booklet.
  // The first (bookletCount - 1) booklets use a4PerBooklet, the last uses the remainder.
  const firstBooklets = Math.max(0, bookletCount - 1);
  const lastBookletSheets = computeA4Sheets - a4PerBooklet * firstBooklets;
  if (lastBookletSheets < 1) {
    return { valid: false, errors: ["bookletCount/a4PerBooklet exceed total volume"] };
  }

  const foldsPerBooklet = a4PerBooklet * foldsPerA4;
  const pagesPerBooklet = a4PerBooklet * pagesPerSheet * 2;

  const foldsPerLastBooklet = lastBookletSheets * foldsPerA4;
  const lastBookletPages = lastBookletSheets * pagesPerSheet * 2;

  return {
    valid: true,
    errors: [],
    meta: {
      computeA4Sheets,
    },
    derived: {
      foldsPerBooklet,
      pagesPerBooklet,
      a4PerLastBooklet: lastBookletSheets,
      foldsPerLastBooklet,
      lastBookletPages,
    },
  };
}

/**
 * reckon(bookletCount, a4PerBooklet, pagesPerSheet, blankLastPage)
 * Ported page distribution logic (based on inspiration JS).
 */
function reckon({ pgCount, pagesPerSheet, bookletCount, a4PerBooklet, blankLastPage }) {
  const total = calcBooklet0({ pgCount, pagesPerSheet, blankLastPage });
  if (!total.valid) return { valid: false, errors: total.errors || ["invalid volume"] };

  const split = calcBooklet1({ total, bookletCount, a4PerBooklet });
  if (!split.valid) return { valid: false, errors: split.errors || ["invalid split"] };

  const computeDivisibleBy = pagesPerSheet * 2;
  const computePgCount = total.volume.computePgCount;
  const a4SheetsTotal = computePgCount / computeDivisibleBy;
  const foldsPerA4 = pagesPerSheet / 2;
  const pagesPerBooklet = split.derived.pagesPerBooklet;
  const lastBookletSheets = split.derived.a4PerLastBooklet;
  const lastBookletPages = split.derived.lastBookletPages;
  const bookletMax = bookletCount;

  // 1-based arrays to mirror the original.
  const prnDistrU = [];
  const pagesStrComU = [];
  const pagesStrCom = [];

  for (let i1 = 1; i1 <= bookletMax; i1++) {
    const offset = (i1 - 1) * pagesPerBooklet;
    prnDistrU[i1] = [];

    const sheetsInThisBooklet = i1 === bookletMax ? lastBookletSheets : a4PerBooklet;
    const pagesInThisBooklet = i1 === bookletMax ? lastBookletPages : pagesPerBooklet;

    for (let j1 = 1; j1 <= sheetsInThisBooklet; j1++) {
      prnDistrU[i1][j1] = [];
      for (let j2 = 1; j2 <= foldsPerA4; j2++) {
        prnDistrU[i1][j1][j2] = [];

        const j = j2 + (j1 - 1) * foldsPerA4;
        const a = pagesInThisBooklet - (j - 1) * 2 + offset;
        const b = 1 + (j - 1) * 2 + offset;
        const c = 2 + (j - 1) * 2 + offset;
        const d = pagesInThisBooklet - 1 - (j - 1) * 2 + offset;

        const row = [null, a, b, c, d];
        // Clamp pages beyond original page count to the last page (blank page behavior).
        for (let k = 1; k <= 4; k++) {
          if (row[k] > pgCount) row[k] = pgCount;
        }

        prnDistrU[i1][j1][j2] = row;
      }
    }
  }

  for (let i1 = 1; i1 <= bookletMax; i1++) {
    pagesStrComU[i1] = [];
    pagesStrCom[i1] = [];
    pagesStrCom[i1][1] = "";
    pagesStrCom[i1][2] = "";
    pagesStrCom[i1][3] = "";

    const sheetsInThisBooklet = i1 === bookletMax ? lastBookletSheets : a4PerBooklet;

    for (let j1 = 1; j1 <= sheetsInThisBooklet; j1++) {
      pagesStrComU[i1][j1] = [];
      pagesStrComU[i1][j1][1] = "";
      pagesStrComU[i1][j1][2] = "";

      for (let j2 = 1; j2 <= foldsPerA4; j2++) {
        const row = prnDistrU[i1][j1][j2];
        pagesStrComU[i1][j1][1] += row[1] + "," + row[2];

        if (pagesPerSheet === 8) {
          // Preserve inspiration back-side ordering logic.
          if (j2 % 2 === 0) {
            const prev = prnDistrU[i1][j1][j2 - 1];
            pagesStrComU[i1][j1][2] += prev[3] + "," + prev[4];
          } else {
            const next = prnDistrU[i1][j1][j2 + 1];
            pagesStrComU[i1][j1][2] += next[3] + "," + next[4];
          }
        } else {
          pagesStrComU[i1][j1][2] += row[3] + "," + row[4];
        }

        if (j2 < foldsPerA4) {
          pagesStrComU[i1][j1][1] += ",";
          pagesStrComU[i1][j1][2] += ",";
        }
      }

      pagesStrCom[i1][1] += pagesStrComU[i1][j1][1];
      pagesStrCom[i1][2] += pagesStrComU[i1][j1][2];
      if (j1 < sheetsInThisBooklet) {
        pagesStrCom[i1][1] += ",";
        pagesStrCom[i1][2] += ",";
      }
    }

    // Reverse sheet order for back side (matches original PagesStrCom[i1][3]).
    for (let j1 = sheetsInThisBooklet; j1 >= 1; j1--) {
      pagesStrCom[i1][3] += pagesStrComU[i1][j1][2];
      if (j1 > 1) pagesStrCom[i1][3] += ",";
    }
  }

  const booklets = [];
  for (let i1 = 1; i1 <= bookletMax; i1++) {
    booklets.push({ index: i1, front: pagesStrCom[i1][1], back: pagesStrCom[i1][3] });
  }

  return {
    valid: true,
    errors: [],
    prnDistrU,
    booklets,
    meta: {
      a4SheetsTotal,
      foldsPerA4,
    },
  };
}

/**
 * reverseOutput(pagesStrCom, bookletCount)
 * Returns a new reckon()-like output where back-side strings are reversed per booklet.
 * Front-side strings are unchanged.
 */
function reverseOutput(pagesStrCom, bookletCount) {
  if (!pagesStrCom || pagesStrCom.valid !== true || !Array.isArray(pagesStrCom.booklets)) {
    return { valid: false, errors: ["invalid reckon output"] };
  }

  if (!Number.isInteger(bookletCount) || bookletCount < 1) {
    return { valid: false, errors: ["invalid bookletCount"] };
  }

  if (pagesStrCom.booklets.length !== bookletCount) {
    return { valid: false, errors: ["bookletCount does not match output"] };
  }

  const booklets = pagesStrCom.booklets.map((b) => {
    const tokens = String(b.back).split(",").filter((x) => x.length > 0);
    tokens.reverse();
    return { index: b.index, front: b.front, back: tokens.join(",") };
  });

  return {
    ...pagesStrCom,
    booklets,
  };
}

const api = { calcBooklet0, calcBooklet1, reckon, reverseOutput };

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
} else {
  window.Calc = api;
}
