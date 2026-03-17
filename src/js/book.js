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

  function setFieldError(id, message) {
    const el = byId(id);
    if (!el) return;
    if (!message) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = String(message);
  }

  function setInputValue(id, value) {
    const el = byId(id);
    if (!el) return;
    el.value = String(value);
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

  function getCanonicalUrl() {
    return window.location.origin + window.location.pathname;
  }

  function setUrlLang(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    // No reload.
    window.history.replaceState({}, "", url.toString());
  }

  function applySeo() {
    const canonical = getCanonicalUrl();
    const lang = state.lang;

    document.title = t("metaTitle");
    const metaDesc = document.getElementById("meta-description");
    const metaKw = document.getElementById("meta-keywords");
    if (metaDesc) metaDesc.setAttribute("content", t("metaDescription"));
    if (metaKw) metaKw.setAttribute("content", t("metaKeywords"));

    const canonicalLink = document.getElementById("canonical-url");
    if (canonicalLink) canonicalLink.setAttribute("href", canonical);

    const altRu = document.getElementById("alt-ru");
    const altEn = document.getElementById("alt-en");
    if (altRu) altRu.setAttribute("href", canonical + "?lang=ru");
    if (altEn) altEn.setAttribute("href", canonical + "?lang=en");

    const ogTitle = document.getElementById("og-title");
    const ogDesc = document.getElementById("og-description");
    const ogUrl = document.getElementById("og-url");
    const ogLocale = document.getElementById("og-locale");
    const ogLocaleAlt = document.getElementById("og-locale-alt");
    if (ogTitle) ogTitle.setAttribute("content", t("metaTitle"));
    if (ogDesc) ogDesc.setAttribute("content", t("metaDescription"));
    if (ogUrl) ogUrl.setAttribute("content", canonical);
    if (ogLocale) ogLocale.setAttribute("content", lang === "en" ? "en_US" : "ru_RU");
    if (ogLocaleAlt) ogLocaleAlt.setAttribute("content", lang === "en" ? "ru_RU" : "en_US");

    const jsonldEl = document.getElementById("jsonld");
    if (jsonldEl) {
      const jsonld = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Калькулятор печати книги тетрадями",
        alternateName: "Booklet Page Order Calculator",
        description: t("metaDescription"),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        inLanguage: ["ru", "en"],
        url: canonical,
      };
      jsonldEl.textContent = JSON.stringify(jsonld);
    }
  }

  function setLang(lang) {
    state.lang = lang === "en" ? "en" : "ru";
    document.documentElement.lang = state.lang;
    setUrlLang(state.lang);
    applyI18n();
    applySeo();
    recalc();
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

  function onA4PerBookletChange() {
    const pagesPerSheet = toInt(byId("pagesPerSheet").value);
    const a4PerBooklet = toInt(byId("a4PerBooklet").value);
    const pages = window.Calc.a4ToPages(a4PerBooklet, pagesPerSheet);
    if (pages !== null) {
      setInputValue("pagesPerBooklet", pages);
      setFieldError("pagesPerBookletError", "");
    }
    recalc();
  }

  function onPagesPerBookletChange() {
    const pagesPerSheet = toInt(byId("pagesPerSheet").value);
    const pagesPerBooklet = toInt(byId("pagesPerBooklet").value);
    const a4 = window.Calc.pagesPerBookletToA4(pagesPerBooklet, pagesPerSheet);

    if (a4 === null) {
      setFieldError("pagesPerBookletError", fmt("errorNotDivisible", { n: pagesPerSheet }));
      // Do not recalculate. Keep the last valid output visible.
      return;
    }

    setFieldError("pagesPerBookletError", "");
    setInputValue("a4PerBooklet", a4);
    recalc();
  }

  function onPagesPerSheetChange() {
    const pagesPerSheet = toInt(byId("pagesPerSheet").value);
    const a4PerBooklet = toInt(byId("a4PerBooklet").value);
    const pages = window.Calc.a4ToPages(a4PerBooklet, pagesPerSheet);
    if (pages !== null) {
      setInputValue("pagesPerBooklet", pages);
      setFieldError("pagesPerBookletError", "");
    }
    recalc();
  }

  function onPgCountChange() {
    const pgCount = toInt(byId("pgCount").value);
    const pagesPerSheet = toInt(byId("pagesPerSheet").value);
    const bookletCount = toInt(byId("bookletCount").value);
    const blankLastPage = byId("blankLastPage").checked;

    const r0 = window.Calc.calcBooklet0({ pgCount, pagesPerSheet, blankLastPage });
    if (r0.valid && Number.isInteger(bookletCount) && bookletCount >= 1 && validatePagesPerSheet(pagesPerSheet)) {
      const a4 = Math.floor(r0.volume.paddedPgCount / pagesPerSheet / bookletCount);
      const a4PerBooklet = Math.max(1, a4);
      setInputValue("a4PerBooklet", a4PerBooklet);
      const pages = window.Calc.a4ToPages(a4PerBooklet, pagesPerSheet);
      if (pages !== null) setInputValue("pagesPerBooklet", pages);
      setFieldError("pagesPerBookletError", "");
    }

    recalc();
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
    const pagesPerBooklet = toInt(byId("pagesPerBooklet").value);
    const blankLastPage = byId("blankLastPage").checked;
    const feedMode = document.querySelector('input[name="feedMode"]:checked')?.value || "standard";

    const validationEl = byId("validationMessage");
    const v = validateInputs({ pgCount, pagesPerSheet, bookletCount, a4PerBooklet, blankLastPage });
    if (!v.ok) {
      validationEl.className = "derived__v danger";
      setText(validationEl, t("invalid"));
      setValidationDetails(v);
      setFieldError("a4PerBookletError", "");
      setText(byId("a4Total"), "-");
      setText(byId("foldsTotal"), "-");
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

    // Inline field checks (do not block rendering).
    setFieldError("a4PerBookletError", "");
    if (Number.isInteger(a4PerBooklet) && Number.isInteger(bookletCount) && a4PerBooklet * bookletCount > r0.derived.a4Total) {
      setFieldError("a4PerBookletError", t("errorExceedsSheets"));
    }

    if (Number.isInteger(pagesPerBooklet) && pagesPerBooklet > r0.volume.paddedPgCount) {
      setFieldError("pagesPerBookletError", t("errorExceedsDoc"));
    }

    const r1 = window.Calc.calcBooklet1({ total: r0, bookletCount, a4PerBooklet });
    if (!r1.valid) {
      setValidationDetails({ errors: [t("invalid")], recs: [] });
      setText(byId("lastBookletPages"), "-");
      byId("results").innerHTML = "";
      return;
    }

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
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang === "en" || urlLang === "ru") {
      state.lang = urlLang;
    } else {
      // Always keep explicit lang param in the URL.
      setUrlLang(state.lang);
    }

    byId("lang-ru").addEventListener("click", () => setLang("ru"));
    byId("lang-en").addEventListener("click", () => setLang("en"));

    byId("help-toggle").addEventListener("click", () => {
      state.helpOpen = !state.helpOpen;
      byId("help").hidden = !state.helpOpen;
      applyI18n();
    });

    byId("pgCount").addEventListener("input", onPgCountChange);
    byId("pgCount").addEventListener("change", onPgCountChange);

    byId("pagesPerSheet").addEventListener("change", onPagesPerSheetChange);
    byId("pagesPerSheet").addEventListener("input", onPagesPerSheetChange);

    byId("bookletCount").addEventListener("input", recalc);
    byId("bookletCount").addEventListener("change", recalc);

    byId("a4PerBooklet").addEventListener("input", onA4PerBookletChange);
    byId("a4PerBooklet").addEventListener("change", onA4PerBookletChange);

    byId("pagesPerBooklet").addEventListener("input", onPagesPerBookletChange);
    byId("pagesPerBooklet").addEventListener("change", onPagesPerBookletChange);

    byId("blankLastPage").addEventListener("input", recalc);
    byId("blankLastPage").addEventListener("change", recalc);

    for (const id of ["feed-standard", "feed-reverse"]) {
      byId(id).addEventListener("change", recalc);
    }

    applyI18n();
    applySeo();
    onPagesPerSheetChange();
    recalc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
