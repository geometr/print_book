// DOM glue for the calculator.
// Pure math lives in calc.js.

(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function getCheckedValue(name, fallback) {
    const el = document.querySelector('input[name="' + name + '"]:checked');
    if (!el) return fallback;
    return el.value;
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

  function setAdvisory(message) {
    const el = byId("pagesPerBookletAdvisory");
    if (!el) return;
    if (!message) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = String(message);
  }

  function updatePagesPerBookletAdvisory(pagesPerBooklet) {
    if (!Number.isInteger(pagesPerBooklet) || pagesPerBooklet <= 0) {
      setAdvisory("");
      return;
    }

    if (pagesPerBooklet > 40) {
      setAdvisory(t("advisoryTooThick"));
      return;
    }

    if (pagesPerBooklet > 32 && pagesPerBooklet <= 40) {
      setAdvisory(t("advisoryNearLimit"));
      return;
    }

    if (pagesPerBooklet >= 16 && pagesPerBooklet <= 32) {
      setAdvisory(t("advisoryGoodSize"));
      return;
    }

    setAdvisory(t("advisoryTooSmall"));
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
    theme: "light",
    printState: {},
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

  function applyTheme(theme) {
    state.theme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem("theme", state.theme);
    updateThemeToggle();
  }

  function updateThemeToggle() {
    const btn = byId("theme-toggle");
    if (!btn) return;
    // Spec: ☀ = currently dark (click for light), ☾ = currently light (click for dark)
    btn.textContent = state.theme === "dark" ? "☀" : "☾";
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
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
    updatePagesPerBookletAdvisory(toInt(byId("pagesPerBooklet")?.value));
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

  function validateInputs({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit }) {
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

    if (!Number.isInteger(pagesPerBooklet)) {
      errors.push(t("errPagesPerBookletInt"));
      return { ok: false, errors, recs };
    }

    if (pagesPerBooklet < 1) {
      errors.push(fmt("errPagesPerBookletMin", { min: 1 }));
      return { ok: false, errors, recs };
    }

    const unit = pagesPerSheet * 2;
    if (pagesPerBooklet % unit !== 0) {
      errors.push(fmt("errorNotDivisible", { n: unit }));
      return { ok: false, errors, recs };
    }

    if (typeof padToFit !== "boolean") {
      errors.push("padToFit must be boolean");
      return { ok: false, errors, recs };
    }

    const bookletCount = window.Calc.suggestBookletCount(pgCount, pagesPerBooklet);
    if (!Number.isInteger(bookletCount) || bookletCount < 1) {
      errors.push(t("errCapacityTooSmall"));
      return { ok: false, errors, recs };
    }

    const capacity = bookletCount * pagesPerBooklet;
    if (!padToFit && capacity !== pgCount) {
      errors.push(fmt("errExactVolume", { expected: capacity }));
      recs.push(t("recEnablePadToFit"));
      return { ok: false, errors, recs };
    }

    return { ok: true, errors: [], recs: [] };
  }

  function onPagesPerBookletChange() {
    const pagesPerSheet = toInt(getCheckedValue("pagesPerSheet", "4"));
    const pagesPerBooklet = toInt(byId("pagesPerBooklet").value);
    updatePagesPerBookletAdvisory(pagesPerBooklet);

    const unit = pagesPerSheet * 2;
    if (!Number.isInteger(pagesPerBooklet) || pagesPerBooklet <= 0 || pagesPerBooklet % unit !== 0) {
      setFieldError("pagesPerBookletError", fmt("errorNotDivisible", { n: unit }));
      // Keep the last valid output visible.
      return;
    }

    setFieldError("pagesPerBookletError", "");
    recalc();
  }

  function onPgCountChange() {
    recalc();
  }

  function onPagesPerSheetChange() {
    const pagesPerSheet = toInt(getCheckedValue("pagesPerSheet", "4"));
    const pgCount = toInt(byId("pgCount").value);
    const pagesPerBooklet0 = toInt(byId("pagesPerBooklet").value);

    const unit = pagesPerSheet * 2;
    if (!Number.isInteger(unit) || unit <= 0) {
      recalc();
      return;
    }

    let pagesPerBooklet = pagesPerBooklet0;
    if (!Number.isInteger(pagesPerBooklet) || pagesPerBooklet <= 0) {
      pagesPerBooklet = unit;
    } else if (pagesPerBooklet % unit !== 0) {
      // Nearest valid multiple.
      const nearest = Math.round(pagesPerBooklet / unit) * unit;
      pagesPerBooklet = Math.max(unit, nearest);
    }

    setInputValue("pagesPerBooklet", pagesPerBooklet);
    setFieldError("pagesPerBookletError", "");
    updatePagesPerBookletAdvisory(pagesPerBooklet);

    recalc();
  }

  function clearPrintState() {
    state.printState = {};
  }

  function ensurePrintState(bookletCount) {
    const next = {};
    for (let i = 0; i < bookletCount; i++) {
      next[i] = { front: false, back: false };
    }
    state.printState = next;
  }

  function countProgress(bookletCount) {
    let done = 0;
    const total = bookletCount * 2;
    for (let i = 0; i < bookletCount; i++) {
      const st = state.printState[i] || { front: false, back: false };
      if (st.front) done++;
      if (st.back) done++;
    }
    return { done, total };
  }

  function updateProgressIndicator(bookletCount) {
    const el = byId("printProgress");
    if (!el) return;
    const p = countProgress(bookletCount);
    if (p.total > 0 && p.done === p.total) {
      el.className = "progress progress--done";
      el.textContent = t("allDone");
      return;
    }
    el.className = "progress";
    el.textContent = fmt("progressLabel", { done: p.done, total: p.total });
  }

  function setSignatureDoneStyles(sigIndex) {
    const st = state.printState[sigIndex];
    const sigEl = document.querySelector('[data-sig-index="' + String(sigIndex) + '"]');
    if (!sigEl) return;
    const titleEl = sigEl.querySelector(".sig__title");
    const complete = !!(st && st.front && st.back);
    if (complete) {
      sigEl.classList.add("sig--done");
      if (titleEl) {
        titleEl.classList.add("sig__title--done");
        titleEl.textContent = "✓ " + fmt("signatureN", { n: sigIndex + 1 });
      }
    } else {
      sigEl.classList.remove("sig--done");
      if (titleEl) {
        titleEl.classList.remove("sig__title--done");
        titleEl.textContent = fmt("signatureN", { n: sigIndex + 1 });
      }
    }
  }

  function setRowDoneStyles(sigIndex, side) {
    const row = document.querySelector(
      '[data-sig-index="' + String(sigIndex) + '"][data-side="' + String(side) + '"]',
    );
    if (!row) return;
    const st = state.printState[sigIndex];
    const done = !!(st && st[side] === true);
    if (done) row.classList.add("sig-row--done");
    else row.classList.remove("sig-row--done");
  }

  function copyToClipboard(text) {
    const s = String(text || "");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(s);
    }
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement("textarea");
        ta.value = s;
        ta.setAttribute("readonly", "readonly");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) return reject(new Error("copy failed"));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  function renderResults(result) {
    const container = byId("results");
    container.innerHTML = "";
    const resultsSection = byId("results-section");
    if (resultsSection) {
      resultsSection.setAttribute("data-print-title", t("printTitle"));
    }

    ensurePrintState(result.booklets.length);
    updateProgressIndicator(result.booklets.length);

    for (let i = 0; i < result.booklets.length; i++) {
      const b = result.booklets[i];

      const sig = document.createElement("div");
      sig.className = "sig signature-block";
      sig.setAttribute("data-sig-index", String(i));

      const header = document.createElement("div");
      header.className = "sig__header signature-header";

      const title = document.createElement("div");
      title.className = "sig__title";
      title.textContent = fmt("signatureN", { n: i + 1 });
      header.appendChild(title);

      sig.appendChild(header);

      function makeRow(side, labelKey, pages) {
        const row = document.createElement("div");
        row.className = "sig-row signature-row";
        row.setAttribute("data-sig-index", String(i));
        row.setAttribute("data-side", side);

        const label = document.createElement("div");
        label.className = "sig-row__label";
        label.textContent = t(labelKey) + ":";
        row.appendChild(label);

        const pagesEl = document.createElement("div");
        pagesEl.className = "sig-row__pages page-string";
        pagesEl.textContent = pages;
        row.appendChild(pagesEl);

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "mini-btn copy-btn";
        copyBtn.textContent = t("copyPages");
        copyBtn.title = t("copyTooltip");
        copyBtn.addEventListener("click", () => {
          copyToClipboard(pages)
            .then(() => {
              copyBtn.textContent = t("copied");
              copyBtn.disabled = true;
              setTimeout(() => {
                copyBtn.disabled = false;
                copyBtn.textContent = t("copyPages");
              }, 2000);
            })
            .catch(() => {
              // No-op: clipboard may be blocked by browser permissions.
            });
        });
        row.appendChild(copyBtn);

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "sig-check";
        cb.checked = false;
        cb.addEventListener("change", () => {
          if (!state.printState[i]) state.printState[i] = { front: false, back: false };
          state.printState[i][side] = !!cb.checked;
          setRowDoneStyles(i, side);
          setSignatureDoneStyles(i);
          updateProgressIndicator(result.booklets.length);
        });
        row.appendChild(cb);

        return row;
      }

      sig.appendChild(makeRow("front", "frontSide", b.front));
      sig.appendChild(makeRow("back", "backSide", b.back));

      container.appendChild(sig);
    }
  }

  function recalc() {
    clearPrintState();
    const pgCount = toInt(byId("pgCount").value);
    const pagesPerSheet = toInt(getCheckedValue("pagesPerSheet", "4"));
    const pagesPerBooklet = toInt(byId("pagesPerBooklet").value);
    const padToFit = byId("padToFit").checked;
    const feedMode = getCheckedValue("feedMode", "standard") || "standard";

    updatePagesPerBookletAdvisory(pagesPerBooklet);

    const validationEl = byId("validationMessage");
    const v = validateInputs({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit });
    if (!v.ok) {
      validationEl.className = "result-v status-badge status-badge--bad";
      setText(validationEl, t("invalid"));
      setValidationDetails(v);
      setText(byId("a4Total"), "-");
      setText(byId("bookletCountValue"), "-");
      setText(byId("foldsTotal"), "-");
      setText(byId("a4PerBookletValue"), "-");
      setText(byId("lastBookletPages"), "-");
      byId("blankPagesRow").hidden = true;
      setText(byId("printProgress"), "");
      byId("results").innerHTML = "";
      return;
    }

    validationEl.className = "result-v status-badge status-badge--ok";
    setText(validationEl, t("valid"));
    setValidationDetails({ errors: [], recs: [] });

    const r0 = window.Calc.calcBooklet0({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit });
    setText(byId("a4Total"), r0.derived.a4Total);
    setText(byId("bookletCountValue"), r0.volume.bookletCount);
    setText(byId("foldsTotal"), r0.derived.foldsTotal);

    const a4PerBooklet = window.Calc.pagesPerBookletToA4(pagesPerBooklet, pagesPerSheet);
    setText(byId("a4PerBookletValue"), a4PerBooklet === null ? "-" : a4PerBooklet);
    setText(byId("lastBookletPages"), pagesPerBooklet);

    if (padToFit && r0.volume.totalBlankPages > 0) {
      byId("blankPagesRow").hidden = false;
      setText(byId("blankPagesAdded"), r0.volume.totalBlankPages);
    } else {
      byId("blankPagesRow").hidden = true;
      setText(byId("blankPagesAdded"), "");
    }

    const rr = window.Calc.reckon({ pgCount, pagesPerSheet, pagesPerBooklet, padToFit });
    if (!rr.valid) {
      setValidationDetails({ errors: [t("invalid")], recs: [] });
      setText(byId("printProgress"), "");
      byId("results").innerHTML = "";
      return;
    }

    let output = rr;
    if (feedMode === "reverse") {
      const rev = window.Calc.reverseOutput(rr, rr.bookletCount);
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

    initTheme();
    byId("theme-toggle").addEventListener("click", () => applyTheme(state.theme === "dark" ? "light" : "dark"));

    byId("lang-ru").addEventListener("change", () => setLang("ru"));
    byId("lang-en").addEventListener("change", () => setLang("en"));
    // Sync radio state from URL.
    if (state.lang === "en") byId("lang-en").checked = true;
    if (state.lang === "ru") byId("lang-ru").checked = true;

    byId("help-toggle").addEventListener("click", () => {
      state.helpOpen = !state.helpOpen;
      byId("help").hidden = !state.helpOpen;
      applyI18n();
    });

    byId("pgCount").addEventListener("input", onPgCountChange);
    byId("pgCount").addEventListener("change", onPgCountChange);

    for (const el of document.querySelectorAll('input[name="pagesPerSheet"]')) {
      el.addEventListener("change", onPagesPerSheetChange);
    }

    byId("pagesPerBooklet").addEventListener("input", onPagesPerBookletChange);
    byId("pagesPerBooklet").addEventListener("change", onPagesPerBookletChange);

    byId("padToFit").addEventListener("input", recalc);
    byId("padToFit").addEventListener("change", recalc);

    for (const id of ["feed-standard", "feed-reverse"]) {
      byId(id).addEventListener("change", recalc);
    }
    byId("print-results-btn").addEventListener("click", () => window.print());

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
