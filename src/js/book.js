// DOM glue for the calculator.
// Pure math lives in calc.js.

(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function toInt(value) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : NaN;
  }

  function setText(el, text) {
    el.textContent = String(text);
  }

  function validatePagesPerSheet(pagesPerSheet) {
    return pagesPerSheet === 2 || pagesPerSheet === 4 || pagesPerSheet === 8;
  }

  function ceilDiv(a, b) {
    return Math.floor((a + b - 1) / b);
  }

  const state = {
    lang: "ru",
    helpOpen: false,
  };

  function t(key) {
    return window.I18N[state.lang][key];
  }

  function fmt(key, vars) {
    let s = String(t(key));
    if (!vars) return s;
    for (const k of Object.keys(vars)) {
      s = s.split("{" + k + "}").join(String(vars[k]));
    }
    return s;
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    const nodes = document.querySelectorAll("[data-i18n]");
    for (const node of nodes) {
      const key = node.getAttribute("data-i18n");
      node.textContent = t(key);
    }
    const helpToggle = byId("help-toggle");
    helpToggle.textContent = state.helpOpen ? t("helpToggleOpen") : t("helpToggleClosed");
    byId("help-content").innerHTML = window.I18N[state.lang].helpHtml;
  }

  function setValidationDetails({ errors, recs }) {
    const el = byId("validationDetails");
    el.innerHTML = "";

    if ((!errors || errors.length === 0) && (!recs || recs.length === 0)) {
      el.hidden = true;
      return;
    }

    el.hidden = false;

    if (errors && errors.length) {
      const title = document.createElement("b");
      title.textContent = t("validationErrorsTitle");
      el.appendChild(title);

      const ul = document.createElement("ul");
      for (const msg of errors) {
        const li = document.createElement("li");
        li.textContent = msg;
        ul.appendChild(li);
      }
      el.appendChild(ul);
    }

    if (recs && recs.length) {
      const title = document.createElement("b");
      title.textContent = t("validationFixTitle");
      if (el.childNodes.length) el.appendChild(document.createElement("br"));
      el.appendChild(title);

      const ul = document.createElement("ul");
      for (const msg of recs) {
        const li = document.createElement("li");
        li.textContent = msg;
        ul.appendChild(li);
      }
      el.appendChild(ul);
    }
  }

  function validateInputs({ pgCount, pagesPerSheet, bookletCount, a4PerBooklet, blankLastPage }) {
    const errors = [];
    const recs = [];

    if (!Number.isInteger(pgCount)) {
      errors.push(t("errPgCountInt"));
      return { ok: false, errors, recs };
    }

    if (pgCount < 2) {
      errors.push(fmt("errPgCountMin", { min: 2 }));
      return { ok: false, errors, recs };
    }

    if (!Number.isInteger(pagesPerSheet) || !validatePagesPerSheet(pagesPerSheet)) {
      errors.push(t("errPps"));
      return { ok: false, errors, recs };
    }

    const unit = pagesPerSheet * 2;
    if (!blankLastPage && pgCount % unit !== 0) {
      errors.push(fmt("errVolumeDivisible", { unit, pps: pagesPerSheet }));
      recs.push(t("recEnableBlankLastPage"));

      const down = Math.floor(pgCount / unit) * unit;
      const up = ceilDiv(pgCount, unit) * unit;
      if (down >= 2 && down !== up) {
        recs.push(fmt("recNearestVolume", { down, up }));
      } else {
        recs.push(fmt("recNearestVolume", { down: up, up }));
      }

      return { ok: false, errors, recs };
    }

    const computePgCount = blankLastPage ? ceilDiv(pgCount, unit) * unit : pgCount;
    const computeA4Sheets = computePgCount / unit;

    if (!Number.isInteger(bookletCount)) {
      errors.push(t("errBookletCountInt"));
      return { ok: false, errors, recs };
    }

    if (bookletCount < 1) {
      errors.push(fmt("errBookletMin", { min: 1 }));
      return { ok: false, errors, recs };
    }

    if (bookletCount > computeA4Sheets) {
      errors.push(t("errBookletTooMany"));
      recs.push(fmt("recMaxBooklets", { max: computeA4Sheets }));
      return { ok: false, errors, recs };
    }

    if (!Number.isInteger(a4PerBooklet)) {
      errors.push(t("errA4PerBookletInt"));
      return { ok: false, errors, recs };
    }

    if (a4PerBooklet < 1) {
      errors.push(fmt("errA4PerBookletMin", { min: 1 }));
      return { ok: false, errors, recs };
    }

    const maxA4 = bookletCount === 1 ? computeA4Sheets : Math.floor((computeA4Sheets - 1) / (bookletCount - 1));
    if (a4PerBooklet > maxA4) {
      errors.push(t("errA4PerBookletTooLarge"));
      recs.push(fmt("recMaxA4PerBooklet", { booklets: bookletCount, max: maxA4 }));
      return { ok: false, errors, recs };
    }

    return { ok: true, errors: [], recs: [] };
  }

  function renderResults(result) {
    const container = byId("results");
    container.innerHTML = "";

    for (const b of result.booklets) {
      const wrap = document.createElement("div");
      wrap.className = "results__booklet";

      const title = document.createElement("div");
      title.className = "results__title";
      title.textContent = t("booklet") + " " + String(b.index);
      wrap.appendChild(title);

      const l1 = document.createElement("div");
      l1.className = "results__label";
      l1.textContent = t("side1");
      wrap.appendChild(l1);

      const p1 = document.createElement("pre");
      p1.textContent = b.front;
      wrap.appendChild(p1);

      const l2 = document.createElement("div");
      l2.className = "results__label";
      l2.textContent = t("side2");
      wrap.appendChild(l2);

      const p2 = document.createElement("pre");
      p2.textContent = b.back;
      wrap.appendChild(p2);

      container.appendChild(wrap);
    }
  }

  function recalc() {
    const pgCount = toInt(byId("pgCount").value);
    const pagesPerSheet = toInt(byId("pagesPerSheet").value);
    const bookletCount = toInt(byId("bookletCount").value);
    const a4PerBooklet = toInt(byId("a4PerBooklet").value);
    const blankLastPage = byId("blankLastPage").checked;
    const feedMode = document.querySelector('input[name="feedMode"]:checked')?.value || "standard";

    const validationEl = byId("validationMessage");
    const v = validateInputs({ pgCount, pagesPerSheet, bookletCount, a4PerBooklet, blankLastPage });
    if (!v.ok) {
      validationEl.className = "derived__v danger";
      setText(validationEl, t("invalid"));
      setValidationDetails(v);
      setText(byId("a4Total"), "-");
      setText(byId("foldsTotal"), "-");
      setText(byId("pagesPerBooklet"), "-");
      setText(byId("lastBookletPages"), "-");
      byId("results").innerHTML = "";
      return;
    }

    validationEl.className = "derived__v";
    setText(validationEl, t("valid"));
    setValidationDetails({ errors: [], recs: [] });

    const r0 = window.Calc.calcBooklet0({ pgCount, pagesPerSheet, blankLastPage });
    setText(byId("a4Total"), r0.derived.a4Total);
    setText(byId("foldsTotal"), r0.derived.foldsTotal);

    const r1 = window.Calc.calcBooklet1({ total: r0, bookletCount, a4PerBooklet });
    if (!r1.valid) {
      setValidationDetails({ errors: [t("invalid")], recs: [] });
      setText(byId("pagesPerBooklet"), "-");
      setText(byId("lastBookletPages"), "-");
      byId("results").innerHTML = "";
      return;
    }

    setText(byId("pagesPerBooklet"), r1.derived.pagesPerBooklet);
    setText(byId("lastBookletPages"), r1.derived.lastBookletPages);

    const rr = window.Calc.reckon({ pgCount, pagesPerSheet, bookletCount, a4PerBooklet, blankLastPage });
    if (!rr.valid) {
      setValidationDetails({ errors: [t("invalid")], recs: [] });
      byId("results").innerHTML = "";
      return;
    }

    let output = rr;
    if (feedMode === "reverse") {
      const rev = window.Calc.reverseOutput(rr, bookletCount);
      if (rev.valid) output = rev;
    }

    renderResults(output);
  }

  function init() {
    byId("lang-ru").addEventListener("click", () => {
      state.lang = "ru";
      applyI18n();
      recalc();
    });
    byId("lang-en").addEventListener("click", () => {
      state.lang = "en";
      applyI18n();
      recalc();
    });

    byId("help-toggle").addEventListener("click", () => {
      state.helpOpen = !state.helpOpen;
      byId("help").hidden = !state.helpOpen;
      applyI18n();
    });

    for (const id of ["pgCount", "pagesPerSheet", "bookletCount", "a4PerBooklet", "blankLastPage"]) {
      byId(id).addEventListener("input", recalc);
      byId(id).addEventListener("change", recalc);
    }

    for (const id of ["feed-standard", "feed-reverse"]) {
      byId(id).addEventListener("change", recalc);
    }

    applyI18n();
    recalc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
