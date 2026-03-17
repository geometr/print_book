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

function unitPages(pagesPerSheet) {
  // Pages per physical A4 sheet (both sides).
  return pagesPerSheet * 2;
}

/**
 * suggestBookletCount(pgCount, pagesPerBooklet)
 * Returns the minimum signature count to fit pgCount pages when each signature has pagesPerBooklet pages.
 */
function suggestBookletCount(pgCount, pagesPerBooklet) {
  if (!isInt(pgCount) || pgCount < 0) return null;
  if (!isInt(pagesPerBooklet) || pagesPerBooklet <= 0) return null;
  return ceilDiv(pgCount, pagesPerBooklet);
}

/**
 * calcBooklet0({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit })
 * Validates inputs and returns volume + derived totals.
 *
 * bookletCount is computed as:
 * - bookletCount = ceil(pgCount / pagesPerBooklet)
 *
 * padToFit=false:
 * - exact fit required: pgCount must be divisible by pagesPerBooklet
 *
 * padToFit=true:
 * - pads with blank pages to: bookletCount * pagesPerBooklet
 * - output pages beyond pgCount are treated as blank pages (0)
 */
function calcBooklet0({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit }) {
  const errors = [];

  if (!isInt(pgCount)) errors.push("pgCount must be an integer");
  if (!validatePagesPerSheet(pagesPerSheet)) errors.push("pagesPerSheet must be 2, 4, or 8");
  if (!isInt(pagesPerBooklet) || pagesPerBooklet < 1) errors.push("pagesPerBooklet must be >= 1");
  if (typeof padToFit !== "boolean") errors.push("padToFit must be boolean");

  if (errors.length) return { valid: false, errors };

  if (pgCount < 2) return { valid: false, errors: ["pgCount must be >= 2"] };

  const unit = unitPages(pagesPerSheet);
  if (pagesPerBooklet % unit !== 0) {
    return { valid: false, errors: ["pagesPerBooklet must be divisible by pagesPerSheet*2"] };
  }

  const bookletCount = ceilDiv(pgCount, pagesPerBooklet);
  const capacityPages = bookletCount * pagesPerBooklet;

  if (!padToFit && capacityPages !== pgCount) {
    return {
      valid: false,
      errors: ["pgCount must be divisible by pagesPerBooklet when padToFit=false"],
      volume: { pgCount, pagesPerSheet, pagesPerBooklet, bookletCount, capacityPages, unit, padToFit },
    };
  }

  const paddedPgCount = padToFit ? capacityPages : pgCount;
  const totalBlankPages = padToFit ? paddedPgCount - pgCount : 0;

  const a4Sheets = paddedPgCount / unit; // physical sheets
  const a4Total = a4Sheets * 2; // A4 sides (duplex pages)
  const foldsTotal = a4Sheets * 2;

  return {
    valid: true,
    errors: [],
    volume: {
      pgCount,
      paddedPgCount,
      pagesPerSheet,
      pagesPerBooklet,
      bookletCount,
      unit,
      capacityPages,
      totalBlankPages,
      padToFit,
    },
    derived: {
      a4Total,
      foldsTotal,
    },
  };
}

/**
 * reckon({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit })
 * Page distribution.
 *
 * Output structure:
 * - bookletCount: computed signature count
 * - booklets: [{ index, front, back }]
 * - totalBlankPages: how many blank pages were added (0 when padToFit=false)
 */
function reckon({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit }) {
  const total = calcBooklet0({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit });
  if (!total.valid) return { valid: false, errors: total.errors || ["invalid volume"] };

  const unit = unitPages(pagesPerSheet);
  const paddedPgCount = total.volume.paddedPgCount;
  const bookletCount = total.volume.bookletCount;

  const a4SheetsTotal = paddedPgCount / unit;
  const foldsPerA4 = pagesPerSheet / 2;
  const sheetsPerBooklet = pagesPerBooklet / unit;

  // 1-based arrays to match inspiration indexing.
  const prnDistrU = [];
  const pagesStrComU = [];
  const pagesStrCom = [];

  for (let i1 = 1; i1 <= bookletCount; i1++) {
    const offset = (i1 - 1) * pagesPerBooklet;
    prnDistrU[i1] = [];

    for (let j1 = 1; j1 <= sheetsPerBooklet; j1++) {
      prnDistrU[i1][j1] = [];
      for (let j2 = 1; j2 <= foldsPerA4; j2++) {
        prnDistrU[i1][j1][j2] = [];

        const j = j2 + (j1 - 1) * foldsPerA4;
        const a = pagesPerBooklet - (j - 1) * 2 + offset;
        const b = 1 + (j - 1) * 2 + offset;
        const c = 2 + (j - 1) * 2 + offset;
        const d = pagesPerBooklet - 1 - (j - 1) * 2 + offset;

        const row = [null, a, b, c, d];
        for (let k = 1; k <= 4; k++) {
          // If we padded volume, pages beyond pgCount are numbered N+1..paddedPgCount.
          // Any pages beyond paddedPgCount are treated as impossible/blank.
          if (row[k] > paddedPgCount) row[k] = 0;
        }

        prnDistrU[i1][j1][j2] = row;
      }
    }
  }

  for (let i1 = 1; i1 <= bookletCount; i1++) {
    pagesStrComU[i1] = [];
    pagesStrCom[i1] = [];
    pagesStrCom[i1][1] = "";
    pagesStrCom[i1][2] = "";
    pagesStrCom[i1][3] = "";

    for (let j1 = 1; j1 <= sheetsPerBooklet; j1++) {
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
      if (j1 < sheetsPerBooklet) {
        pagesStrCom[i1][1] += ",";
        pagesStrCom[i1][2] += ",";
      }
    }

    // Reverse sheet order for back side (matches original PagesStrCom[i1][3]).
    for (let j1 = sheetsPerBooklet; j1 >= 1; j1--) {
      pagesStrCom[i1][3] += pagesStrComU[i1][j1][2];
      if (j1 > 1) pagesStrCom[i1][3] += ",";
    }
  }

  const booklets = [];
  for (let i1 = 1; i1 <= bookletCount; i1++) {
    booklets.push({ index: i1, front: pagesStrCom[i1][1], back: pagesStrCom[i1][3] });
  }

  return {
    valid: true,
    errors: [],
    bookletCount,
    prnDistrU,
    booklets,
    totalBlankPages: total.volume.totalBlankPages,
    meta: {
      a4SheetsTotal,
      foldsPerA4,
    },
  };
}

/**
 * pagesPerBookletToA4(pagesPerBooklet, pagesPerSheet)
 * Convert pages-per-booklet to A4-sides-per-booklet.
 * Returns null if pagesPerBooklet is not divisible by pagesPerSheet or <= 0.
 */
function pagesPerBookletToA4(pagesPerBooklet, pagesPerSheet) {
  if (!isInt(pagesPerBooklet) || pagesPerBooklet <= 0) return null;
  if (!validatePagesPerSheet(pagesPerSheet)) return null;
  if (pagesPerBooklet % pagesPerSheet !== 0) return null;
  return pagesPerBooklet / pagesPerSheet;
}

/**
 * a4ToPages(a4PerBooklet, pagesPerSheet)
 * Convert A4-sides-per-booklet to pages-per-booklet.
 * Returns null if a4PerBooklet <= 0.
 */
function a4ToPages(a4PerBooklet, pagesPerSheet) {
  if (!isInt(a4PerBooklet) || a4PerBooklet <= 0) return null;
  if (!validatePagesPerSheet(pagesPerSheet)) return null;
  return a4PerBooklet * pagesPerSheet;
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

const api = {
  calcBooklet0,
  reckon,
  pagesPerBookletToA4,
  a4ToPages,
  suggestBookletCount,
  reverseOutput,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
} else {
  window.Calc = api;
}
