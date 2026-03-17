// All UI strings live here.
// Default language is Russian.

(function () {
  const helpRu = `
<h2>Печать документа книгой (тетрадями)</h2>

<p>
  Калькулятор формирует порядок страниц для печати на A4 так, чтобы после печати и сгиба листов можно собрать тетради.
</p>

<h3>▶ Ввод</h3>
  <ul>
    <li><b>Страниц в документе</b>: общее количество страниц.</li>
    <li><b>Страниц на лист</b>: 2 / 4 / 8 (на одной стороне).</li>
  <li><b>Страниц в тетради</b>: размер тетради. Количество тетрадей вычисляется автоматически.</li>
  <li><b>Добить пустыми страницами</b>: если включено, недостающие страницы в каждой тетради заполняются пустыми (0).</li>
    <li><b>Подача бумаги</b>: <b>Стандартная подача</b> или <b>Обратная подача бумаги</b> (см. ниже).</li>
  </ul>

<h3>▶ Масштабирование</h3>
<p>
  Режим 2 / 4 / 8 означает, сколько уменьшенных страниц документа размещается на одной печатной странице (на одной стороне листа).
  Для A4 (210 x 297 мм) получается: 2 листа A5 (148 x 210 мм), 4 листа A6 (105 x 148 мм), 8 листов A7 (74 x 105 мм).
</p>
<p>
  Для оценки результата удобно смотреть страницы в масштабе (если бумага документа A4):
  2 листа A5: 71%, 4 листа A6: 51%, 8 листов A7: 36%.
</p>

<h3>▶ Сгибы</h3>
<p>
  В зависимости от выбранного режима из одного листа A4 получается 1 / 2 / 4 четырехстраничных "листика"-сгиба.
  Из них складываются тетради.
</p>

<h3>▶ Корректность объема</h3>
<p>
  Для корректной нумерации объем должен быть кратен 4 / 8 / 16 (в зависимости от режима).
  Если объем не укладывается ровно, включайте "добить пустыми страницами".
</p>

<h3>▶ Как читать результат</h3>
<p>
  Для каждой тетради выводятся две строки: <b>Сторона 1</b> и <b>Сторона 2</b>.
  Сначала печатайте "Сторона 1", затем переверните стопку и печатайте "Сторона 2".
</p>

<h3>▶ Тетради</h3>
<p>
  Практичный объем тетради около 40 страниц (примерно 8-10 четырехстраничных листиков-сгибов).
  Если документ большой, увеличивайте "Страниц в тетради" или включайте добивку пустыми страницами.
</p>

<h3>▶ Печать обратной стороны (подача бумаги)</h3>
<p>
  Принтеры отличаются тем, как листы загружаются и как выходят после печати: "лицом вверх" и "лицом вниз".
  Это влияет на порядок листов при повторной подаче.
</p>

<div class="help__imggrid">
  <div class="help__img">
    <div class="help__imgtitle">Загрузка: лицом вверх. Вывод: лицом вверх</div>
    <div class="help__imgph">[Фото/схема принтера: face up]</div>
  </div>
  <div class="help__img">
    <div class="help__imgtitle">Загрузка: лицом вверх. Вывод: лицом вниз</div>
    <div class="help__imgph">[Фото/схема принтера: face down]</div>
  </div>
  <div class="help__img">
    <div class="help__imgtitle">Загрузка: лицом вниз. Вывод: лицом вверх</div>
    <div class="help__imgph">[Фото/схема принтера: bottom feed]</div>
  </div>
  <div class="help__img">
    <div class="help__imgtitle">Переключаемый вывод (вверх/вниз)</div>
    <div class="help__imgph">[Фото/схема принтера: switchable output]</div>
  </div>
</div>

<p>
  После печати передней стороны (аверса) листы переворачиваются для печати тыльной стороны (реверса).
  Порядок листов может сохраниться (от первого к последнему) или стать обратным (от последнего к первому).
</p>

<ul>
  <li>Если порядок листов сохраняется: используйте <b>Стандартная подача</b>.</li>
  <li>Если порядок листов становится обратным: включайте <b>Обратная подача бумаги</b>.</li>
</ul>

<p>
  Практический ориентир по повторной подаче:
  для режимов 2 и 8 подавайте бумагу "ногами вперед" (той стороной, которая вышла из принтера в конце),
  для режима 4 — "головой вперед" (той стороной, которая вышла вначале).
</p>

<h3>▶ Полезные советы</h3>
<p>
  Следите за полями. Если левое/правое поле разные, после сгиба текст выглядит смещенным.
  Лучше делать поля равными или включать "Зеркальные поля" и задавать переплет.
  Помните: при масштабировании уменьшаются и внутренние поля.
</p>
`;

  const helpEn = `
<h2>Printing a Document as a Booklet (Signatures)</h2>

<p>
  The calculator generates page order for A4 printing so you can fold sheets and assemble signatures.
</p>

<h3>▶ Inputs</h3>
  <ul>
    <li><b>Document pages</b>: total pages in the document.</li>
    <li><b>Pages per sheet</b>: 2 / 4 / 8 (per side).</li>
  <li><b>Pages per signature</b>: signature size. Number of signatures is computed automatically.</li>
  <li><b>Pad with blank pages</b>: if enabled, missing pages in each signature become blanks (0).</li>
    <li><b>Paper feed</b>: <b>Standard feed</b> or <b>Reverse paper feed</b> (see below).</li>
  </ul>

<h3>▶ Scaling</h3>
<p>
  Mode 2 / 4 / 8 defines how many reduced document pages are placed on one printed page (on one side of the sheet).
  For A4 (210 x 297 mm): 2 sheets of A5 (148 x 210 mm), 4 sheets of A6 (105 x 148 mm), 8 sheets of A7 (74 x 105 mm).
</p>
<p>
  To preview the expected result (if document paper is A4):
  2 sheets of A5: 71%, 4 sheets of A6: 51%, 8 sheets of A7: 36%.
</p>

<h3>▶ Folds</h3>
<p>
  Depending on the mode, one A4 sheet produces 1 / 2 / 4 four-page fold units.
  Signatures are assembled from these units.
</p>

<h3>▶ Volume Correctness</h3>
<p>
  For correct numbering, the volume must be divisible by 4 / 8 / 16 (depending on the mode).
  If it does not fit exactly, enable pad with blank pages.
</p>

<h3>▶ Reading the Output</h3>
<p>
  Each booklet has two strings: <b>Side 1</b> and <b>Side 2</b>.
  Print Side 1 first, then flip the stack and print Side 2.
</p>

<h3>▶ Booklets</h3>
<p>
  A practical booklet size is about 40 pages (roughly 8-10 four-page fold units).
  For large documents, adjust pages per signature or enable padding.
</p>

<h3>▶ Back Side Printing (Paper Feed)</h3>
<p>
  Printers differ in how sheets are loaded and how they exit after printing: face up vs face down.
  This affects sheet order when re-feeding.
</p>

<div class="help__imggrid">
  <div class="help__img">
    <div class="help__imgtitle">Load: face up. Output: face up</div>
    <div class="help__imgph">[Printer photo/diagram placeholder: face up]</div>
  </div>
  <div class="help__img">
    <div class="help__imgtitle">Load: face up. Output: face down</div>
    <div class="help__imgph">[Printer photo/diagram placeholder: face down]</div>
  </div>
  <div class="help__img">
    <div class="help__imgtitle">Load: face down. Output: face up</div>
    <div class="help__imgph">[Printer photo/diagram placeholder: bottom feed]</div>
  </div>
  <div class="help__img">
    <div class="help__imgtitle">Switchable output (up/down)</div>
    <div class="help__imgph">[Printer photo/diagram placeholder: switchable output]</div>
  </div>
</div>

<p>
  After printing the front side (recto), sheets are flipped to print the back side (verso).
  Sheet order may stay the same (first to last) or become reversed (last to first).
</p>

<ul>
  <li>If sheet order stays the same: use <b>Standard feed</b>.</li>
  <li>If sheet order becomes reversed: enable <b>Reverse paper feed</b>.</li>
</ul>

<p>
  Practical re-feed hint:
  for modes 2 and 8 feed paper \"feet first\" (the edge that exited the printer last),
  for mode 4 feed \"head first\" (the edge that exited first).
</p>

<h3>▶ Practical Advice</h3>
<p>
  Watch margins. If left/right margins differ, folded signatures look shifted.
  Prefer equal margins or use mirror margins with binding.
  Remember: scaling reduces inner margins too.
</p>
`;

  const I18N = {
    ru: {
      metaTitle: "Калькулятор печати книги тетрадями — порядок страниц онлайн",
      metaDescription:
        "Бесплатный калькулятор для расчёта порядка страниц при печати книги или брошюры тетрадями на обычном принтере. Поддержка 2, 4 и 8 страниц на лист.",
      metaKeywords: "печать книги тетрадями, порядок страниц для печати, калькулятор печати брошюры, печать буклета онлайн",
      h1: "Калькулятор печати книги тетрадями",
      title: "Печать книг (калькулятор)",
      pgCountLabel: "Страниц в документе",
      pagesPerSheetLabel: "Страниц на лист",
      feedStandard: "Стандартная подача",
      feedReverse: "Обратная подача бумаги",
      a4PerBookletLabel: "Листов A4 на тетрадь",
      numberOfSignatures: "Количество тетрадей",
      pagesPerSignature: "Страниц в тетради",
      hintPagesPerBooklet:
        "Типичная тетрадь: 8, 16 или 32 стр.\nДомашний степлер: до 30–40 стр. (15–20 листов 80г).\nНитками: рекомендуется 16–32 стр. на тетрадь.\nНесколько тетрадей сшиваются в блок для толстых книг.",
      advisoryTooThick:
        "Домашний степлер не пробьёт.\nИспользуйте сшивку нитками или несколько тетрадей.",
      advisoryNearLimit:
        "На пределе для домашнего степлера.\nЗависит от плотности бумаги.",
      advisoryGoodSize: "Хорошо — подходит и для степлера, и для сшивки.",
      advisoryTooSmall:
        "Маленькая тетрадь — потребуется много тетрадей\nдля книги.",
      padToFit: "Добить пустыми страницами",
      validationLabel: "Проверка объема",
      a4TotalLabel: "A4 всего",
      foldsTotalLabel: "Сгибов всего",
      pagesPerBookletLabel: "Страниц в тетради",
      lastBookletPagesLabel: "Страниц в последней тетради",
      blankPagesAdded: "Добавлено пустых страниц: {n}",
      resultsTitle: "Результат",
      side1: "Сторона 1",
      side2: "Сторона 2",
      booklet: "Тетрадь",
      valid: "Объем корректный",
      invalid: "Объем некорректный",
      validationErrorsTitle: "Ошибки",
      validationFixTitle: "Как исправить",
      errPgCountInt: "Введите целое число страниц.",
      errPgCountMin: "Минимум: {min}.",
      errPps: "Выберите 2, 4 или 8 страниц на лист.",
      errPagesPerBookletInt: "Введите целое число страниц в тетради.",
      errPagesPerBookletMin: "Минимум страниц в тетради: {min}.",
      errBookletCountInt: "Введите целое число тетрадей.",
      errBookletMin: "Минимум тетрадей: {min}.",
      errCapacityTooSmall: "Тетради не вмещают документ.",
      recSuggestedBooklets: "Рекомендуемое число тетрадей: {n}.",
      errExactVolume: "Без добивки должно быть ровно {expected} страниц.",
      recEnablePadToFit: "Включите \"Добить пустыми страницами\".",
      errorNotDivisible: "Должно делиться на {n}",
      errorExceedsDoc: "Превышает объём документа",
      errorExceedsSheets: "Тетради не вмещают все листы",
      helpTitle: "Справка",
      footerText: "Бесплатный инструмент. Без регистрации. Работает офлайн.",
      helpToggleClosed: "Справка",
      helpToggleOpen: "Скрыть справку",
      helpHtml: helpRu,
    },
    en: {
      metaTitle: "Booklet Page Order Calculator — Print Book with Signatures",
      metaDescription:
        "Free calculator for booklet printing page order. Supports 2, 4 and 8 pages per sheet, multiple signatures. No install, works in browser.",
      metaKeywords: "booklet page order calculator, print book signatures, booklet printing calculator, saddle stitch imposition",
      h1: "Booklet Page Order Calculator",
      title: "Booklet Print Calculator",
      pgCountLabel: "Document pages",
      pagesPerSheetLabel: "Pages per sheet",
      feedStandard: "Standard feed",
      feedReverse: "Reverse paper feed",
      a4PerBookletLabel: "A4 sheets per booklet",
      numberOfSignatures: "Number of signatures",
      pagesPerSignature: "Pages per signature",
      hintPagesPerBooklet:
        "Typical signature: 8, 16 or 32 pages.\nHome stapler: up to 30–40 pages (15–20 sheets, 80gsm).\nHand-sewn: 16–32 pages per signature recommended.\nMultiple signatures are sewn together for thick books.",
      advisoryTooThick:
        "Home stapler won't punch through.\nUse hand-sewing or split into more signatures.",
      advisoryNearLimit:
        "Near home stapler limit.\nDepends on paper weight.",
      advisoryGoodSize: "Good — works for both staple and hand-sewn binding.",
      advisoryTooSmall:
        "Small signature — you will need many signatures\nfor a full book.",
      padToFit: "Pad with blank pages",
      validationLabel: "Volume validation",
      a4TotalLabel: "A4 total",
      foldsTotalLabel: "Folds total",
      pagesPerBookletLabel: "Pages per booklet",
      lastBookletPagesLabel: "Last booklet pages",
      blankPagesAdded: "Blank pages added: {n}",
      resultsTitle: "Results",
      side1: "Side 1",
      side2: "Side 2",
      booklet: "Booklet",
      valid: "Volume correct",
      invalid: "Volume incorrect",
      validationErrorsTitle: "Errors",
      validationFixTitle: "Fix",
      errPgCountInt: "Enter an integer page count.",
      errPgCountMin: "Minimum: {min}.",
      errPps: "Choose 2, 4, or 8 pages per sheet.",
      errPagesPerBookletInt: "Enter an integer pages per signature.",
      errPagesPerBookletMin: "Minimum pages per signature: {min}.",
      errBookletCountInt: "Enter an integer booklet count.",
      errBookletMin: "Minimum booklets: {min}.",
      errCapacityTooSmall: "Signatures do not fit the document.",
      recSuggestedBooklets: "Suggested booklet count: {n}.",
      errExactVolume: "Without padding, total must be exactly {expected} pages.",
      recEnablePadToFit: "Enable \"Pad with blank pages\".",
      errorNotDivisible: "Must be divisible by {n}",
      errorExceedsDoc: "Exceeds document size",
      errorExceedsSheets: "Signatures exceed total sheets",
      helpTitle: "Help",
      footerText: "Free tool. No registration. Works offline.",
      helpToggleClosed: "Help",
      helpToggleOpen: "Hide help",
      helpHtml: helpEn,
    },
  };

  window.I18N = I18N;
})();



