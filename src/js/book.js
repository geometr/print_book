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

  const state = {
    lang: "ru",
    helpOpen: false,
  };

  function t(key) {
    return window.I18N[state.lang][key];
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

    const r0 = window.Calc.calcBooklet0({ pgCount, pagesPerSheet, blankLastPage });

    const validationEl = byId("validationMessage");
    if (!r0.valid) {
      validationEl.className = "derived__v danger";
      setText(validationEl, t("invalid"));
      setText(byId("a4Total"), "-");
      setText(byId("foldsTotal"), "-");
      setText(byId("pagesPerBooklet"), "-");
      setText(byId("lastBookletPages"), "-");
      byId("results").innerHTML = "";
      return;
    }

    validationEl.className = "derived__v";
    setText(validationEl, t("valid"));

    setText(byId("a4Total"), r0.derived.a4Total);
    setText(byId("foldsTotal"), r0.derived.foldsTotal);

    const r1 = window.Calc.calcBooklet1({ total: r0, bookletCount, a4PerBooklet });
    if (!r1.valid) {
      setText(byId("pagesPerBooklet"), "-");
      setText(byId("lastBookletPages"), "-");
      byId("results").innerHTML = "";
      return;
    }

    setText(byId("pagesPerBooklet"), r1.derived.pagesPerBooklet);
    setText(byId("lastBookletPages"), r1.derived.lastBookletPages);

    const rr = window.Calc.reckon({ pgCount, pagesPerSheet, bookletCount, a4PerBooklet, blankLastPage });
    if (!rr.valid) {
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
