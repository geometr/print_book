// All UI strings live here.
// Default language is Russian.

(function () {
  const helpRu = `
                <h2>ПЕЧАТЬ ДОКУМЕНТА КНИГОЙ (ТЕТРАДЯМИ). РУКОВОДСТВО.</h2>
                <p>
                    Страничные принтеры формата А4 (лазерные и струйные)
                    являются сейчас наиболее распространенными.
                    Но печать документов в таком формате не всегда оптимальна с точки зрения пользования.
                    Часто более приемлемыми представляются меньшие форматы: А5, А6, А7.
                    Ну а если при этом документ еще и многостраничный,
                    то возникает желание получить из него брошюру (тетрадь) либо даже книгу.
                    Для этого нужно или искать бумагу таких форматов (отдельные листы),
                    или распечатывать документ в выбранном формате на листах А4,
                    размещая по несколько страниц меньших форматов на листе,
                    причем так, чтобы затем согнуть эти листы,
                    получив практически готовую книгу (тетрадь), пригодную для простой прошивки.
                </p>
                <p>
                    Самым лучшим представляется использование <b>масштабирования документа при выводе на
                                                                 печать</b>.
                    Такую возможность представляют либо драйверы большинства современных принтеров,
                    либо сами программы-редакторы.
                    При этом оформление страниц остается таким, каким Вы видите его в редакторе.
                    Вдобавок к этому можно добиться масштабирования до форматов А6 и А7,
                    непосредственную печать на которых принтеры могут и не поддерживать.
                    В данном случае главное - чтобы Ваш редактор позволял задавать на печать
                    произвольную последовательность страниц документа, а не только диапазон (с такой-то по такую-то
                    страницу).
                </p>
                <p>
                    Возникает последняя преграда на пути к распечатке книги:
                    популярные текстовые процессоры не имеют гибких встроенных средств автоматизации такой печати.
                    То есть последовательность страниц печатного задания Вам нужно будет задавать вручную,
                    предварительно ее рассчитав.
                </p>
                <p>
                    Вот здесь и приходит на выручку представленная на этой странице <b>программа по расчету печатных
                                                                                       заданий</b>.
                </p>
                <p>
                    В первом пункте Вы должны указать <b>объем Вашего документа</b>.
                </p><h3>▶ Масштабирование</h3>
                <p>
                    Далее Вы должны определиться, <b>сколько Страниц документа будет размещено на одной печатной
                                                     странице</b>
                    (на одной стороне листа бумаги).
                    Драйверы большинства принтеров и редакторы позволяют масштабировать (в нашем случае - уменьшать)
                    печатаемые страницы так, чтобы, к примеру, размещать на одной странице бумаги
                    стразу 2, 4, 6, 8, 9 или даже 16 уменьшенных страниц документа.
                    Наиболее практичными представляются варианты по 2, 4 и 8 страниц.</p>
                <p>
                    При печати на листе A4 (210 x 297 mm) получается:
                        <span>- 2 листа A5</span>
                        <span>(148 x 210 mm);</span>
                        <span>- 4 листа A6</span>
                        <span>(105 x 148 mm);</span>
                        <span>- 8 листов A7</span>
                        <span>(74 x 105 mm).</span>
                </p><p>
                Чтобы оценить предполагаемый результат печати,
                нужно просматривать страницы в указанном ниже масштабе
                (при условии, что размером бумаги для Вашего документа задан формат А4):
                        <span>2 листа A5</span>
                        <span>71%</span>
                        <span>4 листа A6</span>
                        <span>51%</span>
                        <span>8 листов A7</span>
                        <span>36%</span>
                </p><h3>▶ Сгибы</h3>
                <p>
                    В зависимости от выбранного в пункте 2 количества страниц, печатаемых на одном листе А4,
                    из этого листа получается соответственно 1, 2 либо 4 четырехстраничных <b>"листика"-сгиба</b>,
                    из которых непосредственно и складываются тетради.
                </p>
                <h3>▶ Корректность объема документа</h3>
                <p>
                    При формировании печатного задания очень важно,
                    чтобы количество страниц в документе было кратным количеству страниц,
                    распечатываемых на листе (с двух сторон), то есть - 4, 8 и 16.
                    В противном случае порядок нумерации страниц будет нарушен.
                    Во избежание подобных сбоев для документов с некорректным объемом предусматривается
                    использование так называемой <b>"пустой" страницы</b>.
                </p>
                <h3>▶ Тетради</h3>
                <p>
                    Оптимальный объем тетрадей составляет около 40 страниц (примерно по 8-10 четырехстраничных
                    листиков-сгибов).
                    В этом случае листы удобно согнуть, прогладить и скрепить.
                    Так собирают книги и в типографиях.
                    Если объем документа существенно больше,
                    то возникает необходимость распечатать его не одной толстой тетрадью, а несколькими тонкими.
                    При этом <b>количество тетрадей и их объем можно регулировать</b>,
                    меняя значения в соответствующих полях четвертого раздела формы.
                </p>
                <p>
                    Когда все исходные данные в форме заданы - нужно нажать на кнопку <span>[ПОСЧИТАТЬ]</span>.
                    Ниже, под кнопкой, появится <b>РЕЗУЛЬТАТ РАСЧЕТА ПЕЧАТНОГО ЗАДАНИЯ</b> со всеми необходимыми для
                    печати деталями.
                    Вам нужно лишь использовать <b>строчки-последовательности</b> для непосредственной печати документа.
                </p>
                <p>
                    <span>Как настроить драйвер принтера?</span>:
                     |
                            <p>
                                После щелчка по кнопке <span>[Свойства]</span>
                                в диалоге <span>[Печать]</span>
                                (см. раздел <a href="#printing">[Печать]</a>)
                                открывается окно свойств драйвера принтера, указанного в диалоге.
                                Данное окно может сильно отличаться у разных моделей принтеров.
                                Мы рассмотрим пример модели Canon LASER SHOT LBP-1120.
                            </p><p>
                            В открывшемся окне <span>[Свойства: Canon LASER SHOT LBP-1120]</span>
                            нас будет интересовать пункт <span>[Разметка страницы:]</span> (обведен
                            желтой рамкой).
                            В выпадающем списке нужно выбрать то же значение, которое Вы указывали и в расчетной форме.
                            Ниже появится пункт <span>[Порядок страниц:]</span>.
                            Нужно выбрать вариант <span>[слева направо]</span> при печати 2-х страниц на
                            листе
                            и вариант <span>[поперек слева]</span> при печати 4-х и 8-ми страниц на
                            листе.
                            Значения пунктов <span>[Размер страницы:]</span>, <span>[Копии:]</span>
                            и
                            <span>[Ориентация:]</span> должны совпадать со значениями, приведенными на
                            рисунках ниже.
                            </p><p>
                            Обратите внимание, что параметры, указанные в окне свойств драйвера принтера,
                            остаются актуальными до закрытия редактора либо до последующего их изменения.
                        </p>
                            <p>
                                <a href="#printer_setup">К разделу
                                                                                                         [Настройка
                                                                                                         драйвера
                                                                                                         принтера]</a>
                                 |
                            </p>
                </p>
                <h3>▶ Печать обратной стороны листов</h3>
                <p>
                    Будьте внимательны при печати обратной стороны листов!
                    Принтеры различаются по способу загрузки и вывода отпечатанных листов:
                    <b>"лицом" вверх</b> и <b>"лицом" вниз</b>. <br>
                </p>
                <li>Самый простой способ - загрузка и вывод листов "лицом" вверх,
                                    - когда бумага подается той стороной вверх, на которой будет производиться печать,
                                    и выходит из принтера той стороной вверх, на которой сейчас произведена печать.
                                    Так работает большинство струйных принтеров. <br>
                </li>
                <li>Второй способ (наиболее распространенный среди лазерных принтеров)
                                    - загрузка "лицом" вверх, вывод "лицом" вниз.
                                    При этом пользователю не виден результат сразу при печати. <br>
                </li>
                <li>Третий способ - загрузка "лицом" вниз, вывод "лицом" вверх.
                                    При этом можно видеть результат печати по мере выхода листов.<br>
                </li>
                <li>Есть модели, позволяющие переключать выходной поток листов в одно из этих положений.
                    <br><br>
                                Печать <b>"лицом"</b> (напечатанным) <b>вверх</b><br>
                                и
                                <b>"лицом" вниз</b><br>
                    <br><br>
                            <b>Принтеры с загрузкой и печатью "лицом" вверх</b>
                            <b>Принтеры, имеющие переключатель "вверх/вниз"</b>
                            <br><b>Принтеры с загрузкой "лицом" вверх и
                                                                                печатью "лицом" вниз</b>
                            <br><b>Принтеры с загрузкой "лицом" вниз и
                                                                                печатью "лицом" вверх</b>
                                    Соответственно, когда после печати передней стороны (аверса)
                                    листы тетради переворачиваются для подачи на печать тыльной стороны (реверса),
                                    порядок листов может быть либо от первого до последнего листа (<i>подача и печать
                                                                                                      "лицом" вверх</i>),
                                    либо от последнего до первого
                                    (<i>подача "лицом" вверх и печать "лицом" вниз</i>, <i>подача "лицом" вниз и печать
                                                                                           "лицом" вверх</i>).
                                    В первом случае используйте рассчитанные последовательности <span>[Сторона 2 (реверс)]</span>,
                                    во втором - <span>[Сторона 2 (реверс) с обратным порядком листов]</span>
                    <p>
                        При печати тыльной стороны (реверса) в режимах по 2 и по 8 страниц
                        - бумагу подавайте <b>"ногами" вперед</b> (<i>той стороной, которая вышла из принтера в
                                                                      конце</i>).<br>
                        При печати тыльной стороны (реверса) в режиме по 4 страницы
                        - бумагу подавайте <b>"головой" вперед</b> (<i>той стороной, которая вышла из принтера
                                                                       вначале</i>).
                    </p>
                </li>
                <h3>▶ Полезные советы</h3>
                <p>
                    При подготовке документа к печати обратите внимание на поля в документе.
                    Если выбран обычный режим, а левое и правое поле не равны,
                    то при сгибании листов в тетради текст будет выглядеть сдвинуто.
                    Предпочтительно делать эти поля равными либо выбрать режим "Зеркальные поля"
                    и необходимую разницу полей задать в поле "переплет".
                    Не забывайте, что при масштабировании будут уменьшаться и внутренние поля,
                    что может лишить Вас пространства для сшивания.
                        <br><br>
            </p>
`;

  const helpEn = `
<h2>PRINTING A DOCUMENT AS A BOOKLET (SIGNATURES). GUIDE.</h2>

<p>
  A4 page printers (laser and inkjet) are now the most common.
  But printing documents in this format is not always the most convenient.
  Smaller formats are often preferable: A5, A6, A7.
  And if the document is also multi-page, you may want a brochure (signature) or even a book.
  To get this, you either need paper in these formats (separate sheets),
  or print the document in the chosen format on A4 sheets,
  placing several smaller-format pages on a single sheet,
  and doing it in such a way that you can then fold the sheets,
  getting an almost finished book (signature) suitable for simple stitching.
</p>

<p>
  The best approach is to use <b>document scaling when printing</b>.
  This is supported either by the drivers of most modern printers,
  or by the editor applications themselves.
  Page layout stays the same as you see it in the editor.
  In addition, you can scale down to A6 and A7,
  which printers may not support as native paper sizes.
  The main requirement is that your editor can print an arbitrary page sequence,
  not only a continuous range (from page N to page M).
</p>

<p>
  This leaves the last obstacle on the way to printing a book:
  popular word processors do not have flexible built-in automation for this kind of printing.
  That means you have to set the print job page sequence manually,
  after calculating it.
</p>

<p>
  This is where the <b>print job calculator</b> on this page helps.
</p>

<p>
  In the first step you must specify the <b>volume of your document</b>.
</p>

<h3>▶ Scaling</h3>

<p>
  Next you need to decide <b>how many document pages will be placed on one printed page</b>
  (on one side of a sheet of paper).
  Most printer drivers and editors can scale (in our case, reduce) printed pages so that,
  for example, 2, 4, 6, 8, 9, or even 16 reduced document pages are placed on one paper page.
  The most practical options are 2, 4, and 8 pages.
</p>

<p>
  When printing on A4 (210 x 297 mm) you get:
  <span>- 2 sheets of A5</span>
  <span>(148 x 210 mm);</span>
  <span>- 4 sheets of A6</span>
  <span>(105 x 148 mm);</span>
  <span>- 8 sheets of A7</span>
  <span>(74 x 105 mm).</span>
</p>

<p>
  To preview the expected print result,
  view the pages at the scale below
  (assuming your document paper size is set to A4):
  <span>2 sheets of A5</span>
  <span>71%</span>
  <span>4 sheets of A6</span>
  <span>51%</span>
  <span>8 sheets of A7</span>
  <span>36%</span>
</p>

<h3>▶ Folds</h3>

<p>
  Depending on the number of pages per A4 sheet chosen in step 2,
  a single A4 sheet yields 1, 2, or 4 four-page <b>fold units</b>,
  which are used to assemble the signatures.
</p>

<h3>▶ Document Volume Correctness</h3>

<p>
  When building a print job it is very important
  that the number of pages in the document is divisible by the number of pages
  printed on a sheet (both sides), that is 4, 8, and 16.
  Otherwise the page numbering order will be broken.
  To avoid such failures, for documents with an incorrect volume
  a so-called <b>"blank" page</b> is used.
</p>

<h3>▶ Booklets (Signatures)</h3>

<p>
  The optimal signature size is about 40 pages
  (roughly 8-10 four-page fold units).
  In that case, sheets are easy to fold, crease, and fasten.
  This is how books are assembled in print shops.
  If the document volume is much larger,
  you need to print it not as one thick signature but as several thinner ones.
  You can <b>adjust the number of signatures and their size</b>
  by changing the values in the corresponding fields of the 4th section of the form.
</p>

<p>
  When all inputs in the form are set, click <span>[CALCULATE]</span>.
  Below the button you will see the <b>PRINT JOB RESULT</b>
  with all details required for printing.
  You only need to use the <b>sequence strings</b> to print the document.
</p>

<p><b>How to configure the printer driver?</b></p>

<p>
  After clicking <span>[Properties]</span>
  in the <span>[Print]</span> dialog
  (see section <a href="#printing">[Print]</a>),
  the printer driver properties window opens.
  This window can be very different for different printer models.
  We will consider Canon LASER SHOT LBP-1120 as an example.
</p>

<p>
  In the <span>[Properties: Canon LASER SHOT LBP-1120]</span> window,
  we are interested in <span>[Page layout:]</span> (highlighted with a yellow frame).
  In the dropdown, select the same value you entered in the calculator form.
  Then <span>[Page order:]</span> appears.
  Choose <span>[left to right]</span> when printing 2 pages per sheet,
  and choose <span>[across left]</span> when printing 4 and 8 pages per sheet.
  The values for <span>[Page size:]</span>, <span>[Copies:]</span>, and <span>[Orientation:]</span>
  must match the values shown in the reference screenshots.
</p>

<p>
  Note that the parameters set in the printer driver properties window
  remain in effect until you close the editor or change them again.
</p>

<p>
  <a href="#printer_setup">Back to [Printer driver setup]</a>
</p>

<h3>▶ Printing the Back Side of Sheets</h3>

<p>
  Be careful when printing the back side of sheets.
  Printers differ by how they load paper and how printed sheets are output:
  <b>face up</b> and <b>face down</b>.<br>
</p>

<li>
  The simplest method is loading and outputting sheets face up.
  Paper is fed with the side up that will be printed,
  and it leaves the printer with the printed side up.
  Most inkjet printers work this way.<br>
</li>

<li>
  The second method (most common for laser printers): load face up, output face down.
  The user does not see the printed result immediately.<br>
</li>

<li>
  The third method: load face down, output face up.
  In this case you can see the printed result as the sheets come out.<br>
</li>

<li>
  Some models allow switching the sheet output direction.
  Printing <b>face up</b> and <b>face down</b>.
  <b>Printers with face-up loading and printing</b>.
  <b>Printers with an up/down switch</b>.
  <b>Printers with face-up loading and face-down printing</b>.
  <b>Printers with face-down loading and face-up printing</b>.

  Accordingly, after printing the front side (recto),
  when the signature sheets are flipped to feed the back side (verso),
  the sheet order can be either from the first sheet to the last
  (<i>face-up feed and print</i>),
  or from the last to the first
  (<i>face-up feed + face-down print</i>, <i>face-down feed + face-up print</i>).

  In the first case use the calculated sequences <span>[Side 2 (verso)]</span>,
  in the second use <span>[Side 2 (verso) with reversed sheet order]</span>.

  <p>
    When printing the back side (verso) in 2-page and 8-page modes,
    feed paper <b>"feet first"</b>
    (<i>the edge that exited the printer last</i>).<br>

    When printing the back side (verso) in 4-page mode,
    feed paper <b>"head first"</b>
    (<i>the edge that exited the printer first</i>).
  </p>
</li>

<h3>▶ Practical Advice</h3>

<p>
  When preparing the document for printing, pay attention to page margins.
  If you use the normal mode and left/right margins are not equal,
  then after folding sheets into a signature the text will look shifted.
  It is preferable to make these margins equal,
  or use "Mirror margins" and set the required difference in the "binding" field.
  Do not forget that scaling also reduces inner margins,
  which can leave you without enough space for stitching.
</p>
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



