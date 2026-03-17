// All UI strings live here.
// Default language is Russian.

(function () {
  const helpRu = `
<h3>Что делает калькулятор</h3>
<p>Калькулятор помогает подготовить печать документа \"книгой\" (тетрадями) на листах A4: показывает порядок страниц для стороны 1 (face) и стороны 2 (back).</p>

<h3>Как ввести количество страниц</h3>
<p>Введите общее количество страниц в документе. Если объем некорректен, можно разрешить \"пустую\" последнюю страницу (в этом режиме лишние позиции будут заполняться последней страницей).</p>

<h3>Страниц на лист</h3>
<p>Выберите 2 / 4 / 8. Это влияет на разметку и порядок печати, особенно для режима 8.</p>

<h3>Тетради (booklets)</h3>
<p>Выберите количество тетрадей и листов A4 на тетрадь. Если последняя тетрадь получается меньшей, сервис покажет ее объем отдельно.</p>

<h3>Пустая последняя страница</h3>
<p>Если включено, сервис допускает некратный объем и заполняет недостающие места последней страницей документа.</p>

<h3>Как читать результат</h3>
<p>Для каждой тетради есть две строки:</p>
<ul>
  <li><b>Сторона 1</b>: печать лицевой стороны листа</li>
  <li><b>Сторона 2</b>: печать обратной стороны листа (для 8 страниц на лист используется особый порядок)</li>
</ul>

<h3>Инструкция печати</h3>
<ol>
  <li>Распечатайте \"Сторона 1\" для нужной тетради.</li>
  <li>Переверните стопку как требует ваш принтер и распечатайте \"Сторона 2\".</li>
  <li>Согните листы и соберите тетради.</li>
</ol>
`;

  const helpEn = `
<h3>What the calculator does</h3>
<p>This calculator helps you print a document as a booklet (in signatures) on A4 sheets. It outputs the page order for side 1 (front) and side 2 (back).</p>

<h3>How to enter page count</h3>
<p>Enter the total number of pages in the document. If the volume is not valid, you can allow a \"blank last page\" (extra slots will be filled using the last page number).</p>

<h3>Pages per sheet</h3>
<p>Select 2 / 4 / 8. This affects layout and print order, especially for mode 8.</p>

<h3>Booklets / signatures</h3>
<p>Select the number of booklets and A4 sheets per booklet. If the last booklet is smaller, the service shows its size separately.</p>

<h3>Blank last page</h3>
<p>If enabled, the service allows a non-divisible page count and fills missing slots with the last page.</p>

<h3>How to read the output</h3>
<p>Each booklet has two strings:</p>
<ul>
  <li><b>Side 1</b>: print the front side</li>
  <li><b>Side 2</b>: print the back side (mode 8 uses a special order)</li>
</ul>

<h3>Printing steps</h3>
<ol>
  <li>Print \"Side 1\" for the selected booklet.</li>
  <li>Flip the stack as required by your printer, then print \"Side 2\".</li>
  <li>Fold sheets and assemble booklets.</li>
</ol>
`;

  const I18N = {
    ru: {
      title: "Печать книг (калькулятор)",
      pgCountLabel: "Страниц в документе",
      pagesPerSheetLabel: "Страниц на лист",
      feedStandard: "Стандартная подача",
      feedReverse: "Обратная подача бумаги",
      bookletCountLabel: "Тетрадей (booklets)",
      a4PerBookletLabel: "Листов A4 на тетрадь",
      blankLastPageLabel: "Пустая последняя страница (разрешить)",
      validationLabel: "Проверка объема",
      a4TotalLabel: "A4 всего",
      foldsTotalLabel: "Сгибов всего",
      pagesPerBookletLabel: "Страниц в тетради",
      lastBookletPagesLabel: "Страниц в последней тетради",
      resultsTitle: "Результат",
      side1: "Сторона 1",
      side2: "Сторона 2",
      booklet: "Тетрадь",
      valid: "Объем корректный",
      invalid: "Объем некорректный",
      helpToggleClosed: "Справка",
      helpToggleOpen: "Скрыть справку",
      helpHtml: helpRu,
    },
    en: {
      title: "Booklet Print Calculator",
      pgCountLabel: "Document pages",
      pagesPerSheetLabel: "Pages per sheet",
      feedStandard: "Standard feed",
      feedReverse: "Reverse paper feed",
      bookletCountLabel: "Booklets (signatures)",
      a4PerBookletLabel: "A4 sheets per booklet",
      blankLastPageLabel: "Allow blank last page",
      validationLabel: "Volume validation",
      a4TotalLabel: "A4 total",
      foldsTotalLabel: "Folds total",
      pagesPerBookletLabel: "Pages per booklet",
      lastBookletPagesLabel: "Last booklet pages",
      resultsTitle: "Results",
      side1: "Side 1",
      side2: "Side 2",
      booklet: "Booklet",
      valid: "Volume correct",
      invalid: "Volume incorrect",
      helpToggleClosed: "Help",
      helpToggleOpen: "Hide help",
      helpHtml: helpEn,
    },
  };

  window.I18N = I18N;
})();
