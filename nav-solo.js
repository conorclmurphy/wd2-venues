/* Wedding Day 2 menu helper (loaded on every page from the site footer code).
   Takes "Ceremony & Reception" out of the Entertainment drop-down, on computers and in the phone menu.
   That page is now reached from the two big tabs on the Solo Musicians page
   (After Dinner | Day 2 and Ceremony | Reception). To put the menu line back, empty this file. */
(function () {
  if (window.wd2NavSolo) return;
  window.wd2NavSolo = true;
  function tidy() {
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll('#header a[href="/ceremony-musicians"], #header a[href="/ceremony-musicians/"], .header-menu a[href="/ceremony-musicians"], .header-menu a[href="/ceremony-musicians/"]'), function (a) {
      var item = a.closest('.header-nav-folder-item, .header-menu-nav-item') || a;
      item.style.display = 'none';
      n++;
    });
    return n;
  }
  var tries = 0, t = setInterval(function () { tidy(); if (++tries > 10) clearInterval(t); }, 400);
  tidy();
})();

/* Site footer (every page): the big logo no longer sits behind the text. A small logo sits on top,
   with a row of page links under the name. The email and Privacy Policy lines are the ones already
   in the Squarespace footer; nothing here retypes them. To go back to the old footer, delete this block. */
(function () {
  if (window.wd2Footer) return;
  window.wd2Footer = true;
  var st = document.createElement('style');
  st.id = 'wd2-footer-css';
  st.textContent = 'footer#footer-sections .section-background img{display:none!important}footer#footer-sections .section-background{background:#091a1c!important}footer#footer-sections .section-background-overlay{opacity:0!important}footer#footer-sections .sqs-html-content{text-align:center}footer#footer-sections .wd2f-logo{width:52px!important;height:auto!important;display:block;margin:0 auto 12px!important;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))}footer#footer-sections .wd2f-nav{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 24px;margin:16px auto 18px;max-width:1000px;font:500 14px/1.3 Bitter,Georgia,serif}footer#footer-sections .wd2f-nav a{color:#eae6dd!important;text-decoration:none!important;opacity:.82;transition:color .2s,opacity .2s}footer#footer-sections .wd2f-nav a:hover{color:#3dc2bb!important;opacity:1}footer#footer-sections .sqs-html-content p{margin:6px 0!important;font-size:14px}@media (max-width:640px){footer#footer-sections .wd2f-nav{gap:12px 18px;max-width:320px}}@media (max-width:1000px){.cookie-banner-manager{background:#091a1c;text-align:center;padding:4px 0 14px}.cookie-banner-manager .manage-cookies-bar{position:static!important;display:inline-block!important;margin:0 auto!important;background:transparent!important}.cookie-banner-manager .manage-cookies-bar .manage-bar-action{color:#b8b3a8!important;font-size:12.5px!important;text-decoration:underline}body:has(#musician-page) .cookie-banner-manager,body:has(#venue-page) .cookie-banner-manager{padding-bottom:88px}}';
  document.head.appendChild(st);
  function build() {
    var f = document.querySelector('footer#footer-sections');
    if (!f || f.getAttribute('data-wd2f')) return !!f;
    var box = f.querySelector('.sqs-block-html .sqs-html-content');
    if (!box) return false;
    f.setAttribute('data-wd2f', '1');
    var lg = document.querySelector('header .header-mobile-logo img');
    var src = lg && (lg.getAttribute('src') || lg.getAttribute('data-src'));
    var links = [['/musicians', 'Solo Musicians'], ['/ceremony-musicians', 'Ceremony & Reception'], ['/djs', 'DJs'], ['/house-of-trad', 'House of Trad'], ['/packages', 'Package Builder'], ['/venues', 'Venues'], ['/faq', 'FAQs'], ['/home#enquiremain', 'Enquire'], ['https://www.instagram.com/weddingday2.ie', 'Instagram']];
    var nav = document.createElement('nav');
    nav.className = 'wd2f-nav';
    nav.setAttribute('aria-label', 'Footer');
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l[0]; a.textContent = l[1];
      if (/^http/.test(l[0])) { a.target = '_blank'; a.rel = 'noopener'; }
      nav.appendChild(a);
    });
    var h = box.firstElementChild;
    if (src) { var i = document.createElement('img'); i.className = 'wd2f-logo'; i.src = src; i.alt = 'Wedding Day 2 logo'; i.loading = 'lazy'; box.insertBefore(i, h); }
    box.insertBefore(nav, h ? h.nextSibling : null);
    return true;
  }
  var n = 0, t = setInterval(function () { if (build() || ++n > 20) clearInterval(t); }, 400);
  build();
})();

/* Home page: the enquiry form and the buttons get the same glass look as the forms on the musician pages.
   It is still the same Squarespace form underneath, so enquiries arrive exactly as before. */
(function () {
  if (window.wd2HomeForm || !document.body || !document.body.classList.contains('homepage')) return;
  window.wd2HomeForm = true;
  var st = document.createElement('style');
  st.id = 'wd2-home-form-css';
  st.textContent = 'html body.homepage .sqs-block:has(form.react-form-contents){border:1px solid #234749!important;border-radius:0!important;background:rgba(14,38,40,.42)!important;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);padding:26px 26px 22px!important;box-shadow:0 20px 50px rgba(0,0,0,.35)}html body.homepage .fe-block:has(form.react-form-contents){mix-blend-mode:normal!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents label,html body.homepage form.react-form-contents.react-form-contents.react-form-contents legend,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .title,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .caption-text{color:#eae6dd!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .description,html body.homepage form.react-form-contents.react-form-contents.react-form-contents p.description{color:#b8b3a8!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents input:not([type=checkbox]):not([type=radio]),html body.homepage form.react-form-contents.react-form-contents.react-form-contents select,html body.homepage form.react-form-contents.react-form-contents.react-form-contents textarea{background:rgba(14,38,40,.5)!important;background-color:rgba(14,38,40,.5)!important;border:1px solid rgba(160,240,235,.28)!important;border-radius:15px 0!important;color:#eae6dd!important;box-shadow:none!important;color-scheme:dark}html body.homepage form.react-form-contents.react-form-contents.react-form-contents select.show-placeholder{color:#b8b3a8!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents input:focus,html body.homepage form.react-form-contents.react-form-contents.react-form-contents select:focus,html body.homepage form.react-form-contents.react-form-contents.react-form-contents textarea:focus{border-color:#3dc2bb!important;outline:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-input-effects{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option label span{background:rgba(234,230,221,.06)!important;border:1px solid rgba(234,230,221,.28)!important;border-radius:8px 0!important;color:#eae6dd!important;padding:6px 14px!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option label input:checked+span{background:#3dc2bb!important;border-color:#3dc2bb!important;color:#0e2628!important;font-weight:600!important;box-shadow:0 0 0 3px rgba(61,194,187,.22)!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option label input:checked+span:before{content:"\\2713";font:700 13px/1 system-ui,-apple-system,Segoe UI,sans-serif}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option label span{cursor:pointer;display:inline-flex!important;align-items:center;gap:6px;transition:background .15s,border-color .15s,color .15s}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-submit-button{background:linear-gradient(135deg,rgba(120,230,224,.13),rgba(61,194,187,.04)),rgba(14,38,40,.35)!important;-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);border:1px solid rgba(160,240,235,.26)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -1px 0 rgba(0,0,0,.15),0 4px 14px rgba(0,0,0,.18)!important;color:#dcefec!important;border-radius:45px 0!important;width:100%!important;padding:15px 26px!important;font-weight:600!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-submit-button:hover{border-color:rgba(61,194,187,.85)!important;box-shadow:0 0 0 1px rgba(61,194,187,.55),0 0 12px rgba(61,194,187,.16),inset 0 1px 0 rgba(255,255,255,.16)!important}html body.homepage a.sqs-block-button-element.sqs-block-button-element{transition:box-shadow .25s ease,border-color .25s ease!important;background:linear-gradient(135deg,rgba(120,230,224,.13),rgba(61,194,187,.04)),rgba(14,38,40,.35)!important;-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);border:1px solid rgba(160,240,235,.26)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -1px 0 rgba(0,0,0,.15),0 4px 14px rgba(0,0,0,.18)!important;color:#dcefec!important;border-radius:45px 0!important;white-space:nowrap}html body.homepage a.sqs-block-button-element.sqs-block-button-element:hover{border-color:rgba(61,194,187,.85)!important;box-shadow:0 0 0 1px rgba(61,194,187,.55),0 0 12px rgba(61,194,187,.16),inset 0 1px 0 rgba(255,255,255,.16)!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px 14px!important;align-items:start}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>*{grid-column:1/-1;order:5;margin:0!important;padding:0!important;min-width:0}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.name{order:1}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.email{order:2}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.date,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.time{order:3;grid-column:auto}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.checkbox~.checkbox{order:6}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.select{order:7;grid-column:auto}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.followup-question-container{order:8}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.checkbox+.followup-question-container{order:5}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.checkbox~.checkbox+.followup-question-container{order:6}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.textarea{order:9}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.text{order:10}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.name>legend{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents p.description{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list .form-item .title,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list legend{margin:0 0 5px!important;padding:0!important;font-size:14px!important;line-height:1.3!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list .caption{margin:0 0 4px!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents input:not([type=checkbox]):not([type=radio]),html body.homepage form.react-form-contents.react-form-contents.react-form-contents select{min-height:0!important;height:42px!important;padding-top:6px!important;padding-bottom:6px!important;width:100%!important;box-sizing:border-box!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents textarea{min-height:84px!important;height:84px!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option{margin:0 6px 6px 0!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option:has(input[value="Corporate"]){display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .followup-question-container .last-name{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .followup-question-container .first-name{width:100%!important;max-width:none!important;flex:1 1 100%!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .followup-question-container .first-name .caption{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-button-wrapper{margin-top:14px!important}html body.homepage .sqs-block:has(form.react-form-contents){padding:22px 24px 20px!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.date,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.time{min-width:0!important;overflow:hidden;grid-template-columns:minmax(0,1fr)!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.date>*,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.time>*{min-width:0!important;max-width:100%!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.date div,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.time div{max-width:100%!important;min-width:0!important;box-sizing:border-box!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.date div:has(>input),html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.time div:has(>input){width:100%!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.date input,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.time input{-webkit-appearance:none!important;appearance:none!important;display:block!important;width:100%!important;min-width:0!important;max-width:100%!important;box-sizing:border-box!important}@media (max-width:640px){html body.homepage form.react-form-contents.react-form-contents.react-form-contents select{padding-left:12px!important;padding-right:30px!important;font-size:15px!important}}@media (max-width:640px){html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.date input,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.time input{padding-left:10px!important;padding-right:28px!important;font-size:15px!important}}@media (max-width:360px){html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list{grid-template-columns:minmax(0,1fr)}}@media (max-width:640px){html body.homepage .sqs-block:has(form.react-form-contents){padding:18px 16px 16px!important}}html body.homepage a.sqs-block-button-element.sqs-block-button-element{position:relative;overflow:hidden}html body.homepage a.sqs-block-button-element.sqs-block-button-element:after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:50%;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(170,245,240,.26),transparent);transform:translate3d(0,0,0) skewX(-18deg);will-change:transform;animation:wd2BtnShine 6s ease-in-out infinite}@keyframes wd2BtnShine{0%{transform:translate3d(0,0,0) skewX(-18deg)}35%,100%{transform:translate3d(340%,0,0) skewX(-18deg)}}@media (prefers-reduced-motion:reduce){html body.homepage a.sqs-block-button-element.sqs-block-button-element:after{animation:none;opacity:0}}@media (max-width:640px){html body.homepage a.sqs-block-button-element.sqs-block-button-element{top:14px}}@media (max-width:1000px){html body.homepage .sqs-block:has(form.react-form-contents){-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:rgba(14,38,40,.6)!important}html body.homepage a.sqs-block-button-element.sqs-block-button-element,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-submit-button{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:linear-gradient(135deg,rgba(120,230,224,.16),rgba(61,194,187,.06)),rgba(14,38,40,.55)!important}}';
  document.head.appendChild(st);
  // the form adds a stray "in Greenwich Mean Time" note under the time box
  var n = 0, t = setInterval(function () {
    var hit = false;
    Array.prototype.forEach.call(document.querySelectorAll('form.react-form-contents *'), function (e) {
      if (!e.children.length && /^in Greenwich Mean Time$/.test((e.textContent || '').trim())) { e.style.display = 'none'; hit = true; }
    });
    if (hit || ++n > 40) clearInterval(t);
  }, 500);
  // The helper lines under "Time" and "Venue" are hidden to keep the form short, so the labels say it instead
  var WORDS = { 'Time': 'Start time', 'Venue': 'Interested in one of our venues?' };
  var relabel = function () {
    Array.prototype.forEach.call(document.querySelectorAll('form.react-form-contents .field-list > .form-item label.title, form.react-form-contents .field-list > .form-item .title'), function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), tn;
      while ((tn = w.nextNode())) { var k = tn.nodeValue.trim(); if (WORDS[k]) tn.nodeValue = tn.nodeValue.replace(k, WORDS[k]); }
    });
  };
  var m = 0, t2 = setInterval(function () { relabel(); if (++m > 40) clearInterval(t2); }, 500);
})();

/* Home page form: smaller option buttons, a line saying we never send spam, and a "Max budget" slider.
   The slider appears when the form in Squarespace has a text box whose label contains the word "budget"
   (e.g. "Max budget"). The text box itself is hidden and the slider fills it in, so the answer arrives with the
   enquiry like any other answer ("Up to EUR 1,500"). It starts as "Not set" at the far left, which sends nothing;
   the far right end means the top figure or more.
   To change the range, edit MIN, MAX and STEP below. */
(function () {
  if (window.wd2Budget || !document.body || !document.body.classList.contains('homepage')) return;
  window.wd2Budget = true;
  var MIN = 300, MAX = 4000, STEP = 100;
  var F = 'html body.homepage form.react-form-contents.react-form-contents.react-form-contents';
  var st = document.createElement('style');
  st.id = 'wd2-budget-css';
  st.textContent = F + ' .option label span{padding:3px 10px!important;font-size:14px!important;line-height:1.35!important;gap:5px}'
    + F + ' .option{margin:0 1px 1px 0!important}'
    + F + ' .option label input:checked+span{box-shadow:0 0 0 2px rgba(61,194,187,.22)!important}'
    + F + ' .option label input:checked+span:before{font-size:11px}'
    + F + ' .wd2-budget-item{grid-column:1/-1!important;order:6!important}'
    + F + ' .wd2-budget-item input:not(.wd2-budget-range),' + F + ' .wd2-budget-item .description{display:none!important}'
    + 'html body.homepage .wd2-form-note{margin-top:0;margin-right:0;margin-bottom:14px;padding:0;font:500 13.5px/1.4 Bitter,Georgia,serif;color:#b8b3a8;text-align:left}'
    + '.wd2-budget{display:flex;align-items:center;gap:14px;padding:2px 0 0}'
    + '.wd2-budget-out{flex:0 0 auto;min-width:104px;text-align:right;font:600 15px/1.2 Bitter,Georgia,serif;color:#3dc2bb;font-variant-numeric:tabular-nums}'
    + '.wd2-budget-out.wd2-budget-any{color:#b8b3a8;font-weight:500}'
    + F + ' .wd2-budget-item input.wd2-budget-range.wd2-budget-range{-webkit-appearance:none!important;appearance:none!important;flex:1 1 auto;min-width:0;width:auto!important;height:28px!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;outline:none!important;cursor:pointer;touch-action:pan-y}'
    + 'input.wd2-budget-range::-webkit-slider-runnable-track{height:4px;border-radius:0;background:linear-gradient(90deg,#3dc2bb var(--wd2-b,100%),rgba(234,230,221,.25) var(--wd2-b,100%))}'
    + 'input.wd2-budget-range::-moz-range-track{height:4px;border-radius:0;background:linear-gradient(90deg,#3dc2bb var(--wd2-b,100%),rgba(234,230,221,.25) var(--wd2-b,100%))}'
    + 'input.wd2-budget-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;margin-top:-8px;border:2px solid #3dc2bb;border-radius:7px 0;background:#0e2628;box-shadow:0 2px 8px rgba(0,0,0,.35)}'
    + 'input.wd2-budget-range::-moz-range-thumb{width:16px;height:16px;border:2px solid #3dc2bb;border-radius:7px 0;background:#0e2628;box-shadow:0 2px 8px rgba(0,0,0,.35)}'
    + 'input.wd2-budget-range:focus{outline:none}input.wd2-budget-range:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 3px rgba(61,194,187,.35)}';
  document.head.appendChild(st);
  function words(v) { return v <= MIN ? '' : v >= MAX ? money(MAX) + '+' : 'Up to ' + money(v); }
  function money(n) { return '€' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  // Squarespace's form keeps its own copy of every answer, so the hidden box has to be told about a change the way typing would
  function fill(inp, text) {
    var d = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (d && d.set) d.set.call(inp, text); else inp.value = text;
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function build() {
    var form = document.querySelector('form.react-form-contents'); if (!form) return false;
    var items = form.querySelectorAll('.field-list > .form-item'), item = null, inp = null, i;
    for (i = 0; i < items.length; i++) {
      var t = items[i].querySelector('.title, legend, label');
      var q = items[i].querySelector('input[type="text"], input[type="number"], input:not([type])');
      if (t && q && /budget/i.test(t.textContent || '')) { item = items[i]; inp = q; break; }
    }
    if (!item) return false;
    if (item.querySelector('.wd2-budget')) return true;
    item.classList.add('wd2-budget-item');
    var box = document.createElement('div'); box.className = 'wd2-budget';
    var r = document.createElement('input'); r.type = 'range'; r.className = 'wd2-budget-range';
    r.min = MIN; r.max = MAX; r.step = STEP; r.value = MIN; // the bottom end (MIN) is "Not set", also when they drag back down to it r.setAttribute('aria-label', 'Max budget');
    var out = document.createElement('span'); out.className = 'wd2-budget-out wd2-budget-any'; out.textContent = 'Not set';
    function show() {
      var v = +r.value, unset = v <= MIN, lo = MIN;
      out.textContent = words(v) || 'Not set';
      out.classList.toggle('wd2-budget-any', unset);
      r.style.setProperty('--wd2-b', ((v - lo) / (MAX - lo) * 100) + '%');
      r.setAttribute('aria-valuetext', out.textContent);
    }
    function save() { var live = item.querySelector('input:not(.wd2-budget-range)'); if (live) fill(live, words(+r.value)); }
    r.addEventListener('input', show);
    r.addEventListener('change', function () { show(); save(); });
    box.appendChild(r); box.appendChild(out);
    (inp.closest('.form-item') === item ? item : form).appendChild(box);
    show();
    return true;
  }
  // a short promise at the top of the form box
  function note() {
    var form = document.querySelector('form.react-form-contents'); if (!form) return;
    var host = form.closest('.sqs-block-content') || form.parentNode;
    if (!host) return;
    var p = host.querySelector('.wd2-form-note');
    if (!p) {
      p = document.createElement('p'); p.className = 'wd2-form-note';
      p.textContent = 'We will never send spam to your inbox.';
      host.insertBefore(p, host.firstChild);
    }
    // line it up with the left edge of the boxes below it
    var first = form.querySelector('.field-list > .form-item');
    if (first) { p.style.marginLeft = '0px'; var gap = Math.round(first.getBoundingClientRect().left - p.getBoundingClientRect().left); p.style.marginLeft = (gap > 0 && gap < 60 ? gap : 0) + 'px'; }
  }
  var n = 0, t = setInterval(function () { build(); note(); if (++n > 30) clearInterval(t); }, 1000);
  build(); note();
})();

/* Home page image descriptions (for Google and for screen readers). The home page photos were added in
   Squarespace without descriptions, so this fills them in. Matched by the photo's file name. */
(function () {
  if (window.wd2HomeAlt || !document.body || !document.body.classList.contains('homepage')) return;
  window.wd2HomeAlt = true;
  var ALT = [
    [/\/1\.jpg/i, 'Solo wedding musicians in Ireland, singers with acoustic guitars performing live'],
    [/\/2\.jpg/i, 'Modern trad band playing live at a wedding in Ireland'],
    [/\/3\.jpg/i, 'Wedding DJ decks and lights, DJ packages for weddings in Ireland'],
    [/\/4\.jpg/i, 'Private venue hire for a wedding Day 2 celebration in Dublin'],
    [/unsplash-image-1h-64bCdVUI/i, 'Bride and groom kissing on the dance floor, surrounded by cheering wedding guests'],
    [/unsplash-image-dhhbH-bNIG8/i, 'Guests enjoying live music at a wedding celebration'],
    [/IMG_0023/i, 'Wedding musician singing and playing acoustic guitar live in a Dublin bar']
  ];
  function fill() {
    var left = 0;
    Array.prototype.forEach.call(document.querySelectorAll('main img, #sections img'), function (i) {
      if (i.getAttribute('alt')) return;
      var src = (i.getAttribute('src') || '') + ' ' + (i.getAttribute('data-src') || '') + ' ' + (i.getAttribute('data-image') || '');
      for (var k = 0; k < ALT.length; k++) if (ALT[k][0].test(src)) { i.setAttribute('alt', ALT[k][1]); return; }
      left++;
    });
    return left;
  }
  var n = 0, t = setInterval(function () { fill(); if (++n > 8) clearInterval(t); }, 600);
  fill();
})();

/* Home page, phones only: layout try-outs for the two buttons under the heading (Contact us + build a package).
   Nothing changes for visitors unless the address ends in ?buttons=a, b, c or d - that is how Conor previews each one.
   When one is chosen, set LIVE below to its letter and it becomes the layout for everyone. */
(function () {
  if (window.wd2Cta || !document.body || !document.body.classList.contains('homepage')) return;
  window.wd2Cta = true;
  var LIVE = 'a';  // chosen 19 Nov 2026: side by side
  var LOOK = '18'; // chosen 20 Nov 2026: joined slim pair, number 17 made a bit lighter (teal Contact us with a cyan edge + solid cyan package button). ('' = the old glass pair); preview others with ?look=1 to 19
  var look = (/[?&]look=(\d{1,2})\b/.exec(location.search) || [])[1] || LOOK;
  var pick = (/[?&]buttons=([a-e])\b/i.exec(location.search) || [])[1];
  pick = (pick || LIVE).toLowerCase();
  if (!pick) return;
  var G = 'background:linear-gradient(135deg,rgba(120,230,224,.16),rgba(61,194,187,.06)),rgba(14,38,40,.55);border:1px solid rgba(160,240,235,.3);color:#dcefec;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 4px 14px rgba(0,0,0,.2)';
  var C = 'background:#3dc2bb;border:1px solid #3dc2bb;color:#0e2628;box-shadow:0 6px 18px rgba(0,0,0,.28)';
  var st = document.createElement('style');
  st.id = 'wd2-cta-css';
  st.textContent = '.wd2-cta{display:none}.wd2-byp-top{display:none!important}.wd2-trio,.wd2-trio-hold{display:none}'
    + '@media (max-width:767px){'
    + 'html.wd2-cta-on body.homepage .wd2-cta-old{visibility:hidden!important;pointer-events:none!important}'
    + '.wd2-cta{display:flex;gap:10px;justify-content:center;margin:20px auto 0;width:100%;max-width:340px;font-family:Bitter,Georgia,serif}'
    + '.wd2-cta a{flex:1 1 0;min-width:0;display:flex;align-items:center;justify-content:center;gap:6px;min-height:50px;padding:10px 12px;font-size:15px;font-weight:600;line-height:1.2;text-align:center;text-decoration:none!important;white-space:nowrap;-webkit-tap-highlight-color:transparent}'
    + '.wd2-cta .wd2-c1{' + G + ';border-radius:45px 0}'
    + '.wd2-cta .wd2-c2{' + C + ';border-radius:0 45px}'
    // a (the live one): the package button keeps the pale glass of the old "Build your own package" card
    + '.wd2-cta-a .wd2-c2{background:rgba(234,230,221,.14);border:1px solid rgba(234,230,221,.34);color:#eae6dd;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 14px rgba(0,0,0,.2)}'
    // Plainer looks for the side-by-side pair, no glass (preview with ?look=1 to 5; set LOOK below to make one live)
    + '.wd2-cta[class*=wd2-look-] a{background:transparent;box-shadow:none;font-weight:500;font-size:16px;text-shadow:0 1px 8px rgba(0,0,0,.5)}'
    // 1: the original outline, both buttons
    + '.wd2-cta.wd2-look-1 a{border:2px solid #3dc2bb!important;color:#3dc2bb!important}'
    // 2: original outline for Contact us, solid cyan for the package button
    + '.wd2-cta.wd2-look-2 .wd2-c1{border:2px solid #3dc2bb;color:#3dc2bb}.wd2-cta.wd2-look-2 .wd2-c2{background:#3dc2bb!important;border:2px solid #3dc2bb;color:#0e2628;font-weight:600;text-shadow:none}'
    // 3: thin cream outline, both buttons
    + '.wd2-cta.wd2-look-3 a{border:1.5px solid #eae6dd!important;color:#eae6dd!important}'
    // 4: flat dark fill with a cyan edge
    + '.wd2-cta.wd2-look-4 a{background:#0e2628!important;border:1.5px solid #3dc2bb;color:#eae6dd;text-shadow:none}'
    // 6 to 11: different SHAPES. Same colours in each (cyan outline for Contact us, solid cyan for the package button) so only the shape changes.
    + '.wd2-cta.wd2-os .wd2-c1{border:2px solid #3dc2bb;color:#3dc2bb}.wd2-cta.wd2-os .wd2-c2{background:#3dc2bb!important;border:2px solid #3dc2bb;color:#0e2628;font-weight:600;text-shadow:none}'
    + '.wd2-cta.wd2-look-6 a{border-radius:999px!important}'
    + '.wd2-cta.wd2-look-7 a{border-radius:2px!important}'
    + '.wd2-cta.wd2-join{gap:0;max-width:320px}.wd2-cta.wd2-join a{box-sizing:border-box;min-height:44px;padding:4px 12px;font-size:15px}.wd2-cta.wd2-join .wd2-c1{border-radius:12px 0 0 12px!important;border-right-width:0}.wd2-cta.wd2-join .wd2-c2{border-radius:0 12px 12px 0!important}'
    + '.wd2-cta.wd2-look-9{gap:14px}.wd2-cta.wd2-look-9 a{border-radius:3px!important;transform:skewX(-14deg)}.wd2-cta.wd2-look-9 a>span{display:inline-block;transform:skewX(14deg)}.wd2-cta.wd2-look-9 a.wd2-press,.wd2-cta.wd2-look-9 a:active{transform:skewX(-14deg) scale(.94)}'
    + '.wd2-cta.wd2-look-10 .wd2-c1{border:0!important;background:none!important;color:#eae6dd;text-decoration:underline!important;text-underline-offset:6px;text-decoration-thickness:1.5px}.wd2-cta.wd2-look-10 .wd2-c2{border-radius:999px!important}'
    + '.wd2-cta.wd2-look-11 a{border-radius:26px 26px 4px 4px!important}'
    // 12 to 17: the joined, slim shape (same as 8) in different designs
    + '.wd2-cta.wd2-look-12 .wd2-c1{background:linear-gradient(135deg,rgba(120,230,224,.26),rgba(61,194,187,.12))!important;-webkit-backdrop-filter:blur(10px) saturate(150%);backdrop-filter:blur(10px) saturate(150%);border:1px solid rgba(160,240,235,.45);color:#eafffd;text-shadow:none}.wd2-cta.wd2-look-12 .wd2-c2{background:rgba(234,230,221,.18)!important;-webkit-backdrop-filter:blur(10px) saturate(150%);backdrop-filter:blur(10px) saturate(150%);border:1px solid rgba(234,230,221,.42);color:#eae6dd;text-shadow:none}'
    + '.wd2-cta.wd2-look-13 a{background:rgba(234,230,221,.18)!important;-webkit-backdrop-filter:blur(10px) saturate(150%);backdrop-filter:blur(10px) saturate(150%);border:1px solid rgba(234,230,221,.42);color:#eae6dd;text-shadow:none}.wd2-cta.wd2-look-13 .wd2-c2{border-left:1px solid rgba(234,230,221,.42);color:#7fe0d9;font-weight:600}'
    + '.wd2-cta.wd2-look-14 .wd2-c1{background:linear-gradient(135deg,rgba(120,230,224,.26),rgba(61,194,187,.12))!important;-webkit-backdrop-filter:blur(10px) saturate(150%);backdrop-filter:blur(10px) saturate(150%);border:1px solid rgba(160,240,235,.45);color:#eafffd;text-shadow:none}.wd2-cta.wd2-look-14 .wd2-c2{background:#3dc2bb!important;border:1px solid #3dc2bb;color:#0e2628;font-weight:600;text-shadow:none}'
    + '.wd2-cta.wd2-look-15 a{border:2px solid #3dc2bb;color:#3dc2bb}.wd2-cta.wd2-look-15 .wd2-c2{color:#eae6dd}'
    + '.wd2-cta.wd2-look-16 .wd2-c1{border:1.5px solid #eae6dd;color:#eae6dd}.wd2-cta.wd2-look-16 .wd2-c2{background:#eae6dd!important;border:1.5px solid #eae6dd;color:#0e2628;font-weight:600;text-shadow:none}'
    + '.wd2-cta.wd2-look-17 .wd2-c1{background:#0e2628!important;border:2px solid #3dc2bb;color:#3dc2bb;text-shadow:none}.wd2-cta.wd2-look-17 .wd2-c2{background:#3dc2bb!important;border:2px solid #3dc2bb;color:#0e2628;font-weight:600;text-shadow:none}'
    + '.wd2-cta.wd2-look-18 .wd2-c1{background:#234749!important;border:1.5px solid #5ad0c9;color:#8fe6e0;text-shadow:none}.wd2-cta.wd2-look-18 .wd2-c2{background:#5ad0c9!important;border:1.5px solid #5ad0c9;color:#0e2628;font-weight:600;text-shadow:none}'
    + '.wd2-cta.wd2-look-19 .wd2-c1{background:#2f5a5c!important;border:1.5px solid #7adcd6;color:#b4f0eb;text-shadow:none}.wd2-cta.wd2-look-19 .wd2-c2{background:#7adcd6!important;border:1.5px solid #7adcd6;color:#0e2628;font-weight:600;text-shadow:none}'
    // 5: plain rounded rectangles instead of the leaf shape, cyan outline
    + '.wd2-cta.wd2-look-5 a{border:2px solid #3dc2bb;color:#3dc2bb;border-radius:8px!important}'
    // b: stacked, same width, the package button first
    + '.wd2-cta-b{flex-direction:column;max-width:270px}.wd2-cta-b a{flex:none}.wd2-cta-b .wd2-c2{order:-1;border-radius:45px 0}'
    // c: one glass bar split in two
    + '.wd2-cta-c{gap:0;' + G + ';border-radius:45px 0;overflow:hidden;max-width:330px}.wd2-cta-c a{background:none!important;border:0!important;box-shadow:none!important;border-radius:0!important;color:#dcefec!important}'
    + '.wd2-cta-c .wd2-c2{color:#3dc2bb!important;border-left:1px solid rgba(160,240,235,.3)!important}'
    // d: one main button, with contact as a quiet link under it
    + '.wd2-cta-d{flex-direction:column;align-items:center;gap:12px;max-width:270px}.wd2-cta-d a{flex:none}.wd2-cta-d .wd2-c2{order:-1;width:100%;border-radius:45px 0}'
    // e: the existing "Build your own package" box moves up to the top left, under the logo; Contact us stays under the heading
    + '.wd2-byp-top{position:absolute!important;top:126px;left:16px;z-index:6;max-width:250px;margin:0!important}'
    + 'html.wd2-cta-on .wd2-byp-top{display:flex!important}'
    // Live phone layout: Contact us + Build a package side by side with the Google reviews button under them, just under the heading.
    // They are part of the photo section and scroll away with it like everything else (no holding in place, no fading).
    + 'html.wd2-cta-on .wd2-trio-hold{display:block;position:absolute;left:0;right:0;top:0;height:100%;z-index:3;pointer-events:none}'
    + 'html.wd2-cta-on .wd2-trio{display:flex;flex-direction:column;align-items:center;gap:12px;position:absolute;left:0;right:0;top:58vh;box-sizing:border-box;width:100%;padding:0 16px;pointer-events:none;opacity:0;transition:opacity .5s ease}'
    + 'html.wd2-cta-on .wd2-trio.wd2-trio-in{opacity:1}'
    + '.wd2-trio.wd2-trio-in>*{pointer-events:auto}'
    + 'body.header--menu-open .wd2-trio{opacity:0!important}body.header--menu-open .wd2-trio>*{pointer-events:none!important}'
    // the (invisible) layout layer over the photo must not swallow taps meant for the buttons underneath it
    + 'html.wd2-cta-on .wd2-hero .content-wrapper{pointer-events:none}html.wd2-cta-on .wd2-hero .content-wrapper .fe-block:not(.wd2-cta-old){pointer-events:auto}'
    + '.wd2-trio .wd2-cta{margin:0 auto}'
    + '.wd2-trio{--grb-ink:#eae6dd;--grb-muted:#b8b3a8;--grb-accent:#3dc2bb;--grb-star:#f4c150;font-family:Bitter,Georgia,serif}'
    + '.wd2-trio .grb-btn{position:static!important;transform:none!important;opacity:1;margin:0!important;padding:9px 16px 9px 12px!important;gap:8px!important;font-size:15px!important;transition:box-shadow .2s ease!important;z-index:auto!important}'
    + '.wd2-trio .grb-btn .grb-star{display:inline-block!important}'
    // the photo section is a little shorter on phones, so the blue line (and the next section) sits higher
    + 'html.wd2-cta-on .wd2-hero .fluid-engine{margin-top:-70px!important}'
    // tap feedback: the button dips and lights up the moment a finger lands on it
    + '.wd2-cta a{transition:transform .12s ease,box-shadow .15s ease,border-color .15s ease,background .15s ease;touch-action:manipulation}'
    + '.wd2-cta a.wd2-press,.wd2-cta a:active{transform:scale(.94);border-color:#3dc2bb!important;box-shadow:0 0 0 2px rgba(61,194,187,.75),0 0 20px rgba(61,194,187,.4)!important}'
    + '.wd2-cta .wd2-c1.wd2-press,.wd2-cta .wd2-c1:active{background:linear-gradient(135deg,rgba(120,230,224,.38),rgba(61,194,187,.18)),rgba(14,38,40,.55)}'
    + '.wd2-cta-a .wd2-c2.wd2-press,.wd2-cta-a .wd2-c2:active{background:rgba(234,230,221,.32)}'
    + '.wd2-cta-d .wd2-c1{background:none;border:0;box-shadow:none;min-height:0;padding:2px 4px;font-weight:500;color:#eae6dd;text-decoration:underline!important;text-underline-offset:4px;text-shadow:0 1px 6px rgba(0,0,0,.6)}'
    + '}';
  document.head.appendChild(st);
  function build() {
    var hero = document.querySelector('main section.page-section, #sections > section');
    var h1 = hero && hero.querySelector('h1');
    var contact = hero && hero.querySelector('a.sqs-block-button-element');
    var card = hero && hero.querySelector('a.wd2-byp');
    if (!h1 || !contact || !card) return false;
    if (hero.querySelector('.wd2-cta, .wd2-byp-top')) return true;
    if (pick === 'e') {
      var top = card.cloneNode(true);
      top.classList.add('wd2-byp-top');
      hero.appendChild(top);
      (card.closest('.fe-block') || card).classList.add('wd2-cta-old');
      document.documentElement.classList.add('wd2-cta-on');
      return true;
    }
    if (pick === 'a') return trio(hero, h1, contact, card);
    var wide = { a: 'Build a package', b: 'Build your own package', c: 'Build a package', d: 'Build your own package' }[pick];
    var box = document.createElement('div');
    box.className = 'wd2-cta wd2-cta-' + pick;
    var a1 = document.createElement('a'); a1.className = 'wd2-c1'; a1.href = contact.getAttribute('href'); a1.textContent = pick === 'd' ? 'or contact us' : 'Contact us';
    var a2 = document.createElement('a'); a2.className = 'wd2-c2'; a2.href = card.getAttribute('href'); a2.textContent = wide + ' →';
    box.appendChild(a1); box.appendChild(a2);
    h1.parentNode.insertBefore(box, h1.nextSibling);
    var b1 = contact.closest('.fe-block') || contact, b2 = card.closest('.fe-block') || card;
    b1.classList.add('wd2-cta-old'); b2.classList.add('wd2-cta-old');
    document.documentElement.classList.add('wd2-cta-on');
    return true;
  }
  function trio(hero, h1, contact, card) {
    if (document.querySelector('.wd2-trio')) return true;
    var mq = window.matchMedia('(max-width:767px)');
    var wrap = document.createElement('div'); wrap.className = 'wd2-trio';
    var box = document.createElement('div'); box.className = 'wd2-cta wd2-cta-a' + (look ? ' wd2-look-' + look : '') + (+look >= 6 && +look <= 11 ? ' wd2-os' : '') + (+look === 8 || +look >= 12 ? ' wd2-join' : '');
    var a1 = document.createElement('a'); a1.className = 'wd2-c1'; a1.href = contact.getAttribute('href'); a1.innerHTML = '<span>Contact us</span>';
    var a2 = document.createElement('a'); a2.className = 'wd2-c2'; a2.href = card.getAttribute('href'); a2.innerHTML = '<span>Build a package \u2192</span>';
    box.appendChild(a1); box.appendChild(a2); wrap.appendChild(box);
    // The holder sits inside the photo section, so the row is simply part of that section.
    var layer = hero.querySelector('.section-border') || hero;
    var hold = document.createElement('div'); hold.className = 'wd2-trio-hold';
    hold.appendChild(wrap); layer.appendChild(hold);
    hero.classList.add('wd2-hero');
    (contact.closest('.fe-block') || contact).classList.add('wd2-cta-old');
    (card.closest('.fe-block') || card).classList.add('wd2-cta-old');
    document.documentElement.classList.add('wd2-cta-on');
    var home = null;
    // on phones the Google reviews button moves in under the two buttons (full size, five stars); on bigger screens it goes back to its corner
    function dock() {
      var b = document.querySelector('.grb-btn'); if (!b) return;
      if (mq.matches) { if (b.parentNode !== wrap) { home = home || { p: b.parentNode, n: b.nextSibling }; wrap.appendChild(b); } }
      else if (home && b.parentNode === wrap) home.p.insertBefore(b, home.n && home.n.parentNode === home.p ? home.n : null);
    }
    function place() {
      if (!mq.matches) return;
      // where the row sits on the first screen: just under the heading
      wrap.style.top = Math.round(h1.getBoundingClientRect().bottom - hero.getBoundingClientRect().top + 20) + 'px';
    }
    window.addEventListener('resize', function () { dock(); place(); });
    if (mq.addEventListener) mq.addEventListener('change', function () { dock(); place(); });
    var k = 0, t2 = setInterval(function () { dock(); place(); if (k === 3) wrap.classList.add('wd2-trio-in'); if (++k > 24) clearInterval(t2); }, 250);
    dock(); place();
    return true;
  }
  var n = 0, t = setInterval(function () { if (build() || ++n > 20) clearInterval(t); }, 300);
  build();
})();

/* Home page, phones and desktop: each part of the page rolls up over the one before it.
   The photo stays where it is while the cards - led by their angled blue line - slide up over it. When the cards reach the top
   they stay too, and the next part rolls up over them with its own blue line, and so on down to the booking form.
   It uses the browser's own "sticky" positioning, so nothing runs while the finger is scrolling.
   To see the page without it, add ?stack=off to the address. */
(function () {
  if (window.wd2Stack || !document.body || !document.body.classList.contains('homepage')) return;
  window.wd2Stack = true;
  if (/[?&]stack=off\b/.test(location.search)) return;
  if (!window.CSS || !CSS.supports || !CSS.supports('top', 'min(0px, calc(100svh - 10px))') || !window.IntersectionObserver) return;
  var mq = { matches: true }; // every screen size (it was phones only until 20 Nov 2026; put window.matchMedia('(max-width:767px)') back here and in the style below to undo)
  var NS = 'http://www.w3.org/2000/svg';
  var st = document.createElement('style');
  st.id = 'wd2-stack-css';
  st.textContent = '.wd2-st-line,.wd2-st-mark{display:none}'
    + '@media (min-width:0){'
    // a part taller than the screen scrolls until its end is in view, then stays; a shorter one stays as soon as it reaches the top
    + 'html.wd2-stack-on .wd2-st{position:-webkit-sticky!important;position:sticky!important;top:min(0px,calc(100svh - var(--wd2-st-h,0px)))!important}'
    + 'html.wd2-stack-on .wd2-z1{z-index:2!important}html.wd2-stack-on .wd2-z2{z-index:4!important}html.wd2-stack-on .wd2-z3{z-index:6!important}html.wd2-stack-on .wd2-z4{z-index:8!important}html.wd2-stack-on .wd2-z5{z-index:10!important}html.wd2-stack-on .wd2-z6{z-index:12!important}'
    // the top edge of each part is cut to the shape of the blue line above it, and carries that line with it
    + 'html.wd2-stack-on .wd2-ov>.section-border{background-color:transparent!important}'
    + 'html.wd2-stack-on .wd2-ov>.section-border>.section-background{background-color:var(--wd2-ov-bg,transparent);-webkit-clip-path:var(--wd2-ov-clip);clip-path:var(--wd2-ov-clip)}'
    + 'html.wd2-stack-on .wd2-ov>.wd2-st-line{display:block;position:absolute;left:0;width:100%;overflow:visible;z-index:6;pointer-events:none}'
    + 'html.wd2-stack-on .wd2-st-src>.section-divider-display .section-divider-stroke{visibility:hidden}'
    + 'html.wd2-stack-on .wd2-st-mark{display:block;position:absolute;left:0;top:0;width:1px;height:100%;pointer-events:none}'
    // a part that is completely covered is switched off so the phone is not drawing it for nothing
    + 'html.wd2-stack-on .wd2-st.wd2-st-off{visibility:hidden}'
    // the menu bar stays with the photo and is covered along with it
    + 'html.wd2-stack-on main#page{z-index:auto!important}html.wd2-stack-on #header{position:fixed!important;z-index:3!important}html.wd2-stack-on body.header--menu-open #header{z-index:9999!important}'
    + '}';
  document.head.appendChild(st);
  var secs = [], obs = [], timer = 0;
  // the corner points of a section's blue line (Squarespace draws it as a zig-zag in 0-1 units of that section)
  function points(d) {
    var i = d.lastIndexOf('M'); if (i < 0) return null;
    var s = d.slice(i); if (/[^MLl\d\s.,e-]/.test(s)) return null;
    var re = /([MLl])\s*(-?[\d.]+(?:e-?\d+)?)[\s,]+(-?[\d.]+(?:e-?\d+)?)/g, m, x = 0, y = 0, out = [];
    while ((m = re.exec(s))) {
      var a = parseFloat(m[2]), b = parseFloat(m[3]);
      if (m[1] === 'l') { x += a; y += b; } else { x = a; y = b; }
      var last = out[out.length - 1];
      if (!last || last[0] !== x || last[1] !== y) out.push([x, y]);
    }
    return out.length > 1 ? out : null;
  }
  // keep only the stretch of the line between two sides
  function cut(p, a, b) {
    var out = [];
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i], p1 = p[i + 1], dx = p1[0] - p0[0];
      if (dx <= 0 || p1[0] < a || p0[0] > b) continue;
      var q0 = p0[0] < a ? [a, p0[1] + (p1[1] - p0[1]) * (a - p0[0]) / dx] : p0;
      var q1 = p1[0] > b ? [b, p0[1] + (p1[1] - p0[1]) * (b - p0[0]) / dx] : p1;
      if (!out.length) out.push(q0);
      out.push(q1);
    }
    return out.length > 1 ? out : null;
  }
  function r2(n) { return Math.round(n * 100) / 100; }
  function layout() {
    if (!mq.matches || !secs.length) return;
    var vh = window.innerHeight, i;
    for (i = 0; i < secs.length - 1; i++) secs[i].style.setProperty('--wd2-st-h', secs[i].offsetHeight + 'px');
    for (i = 1; i < secs.length; i++) {
      var s = secs[i], prev = secs[i - 1], ok = false;
      var stroke = prev.querySelector('.section-divider-display .section-divider-stroke');
      var sb = null, k;
      for (k = 0; k < s.children.length; k++) if (s.children[k].classList.contains('section-border')) sb = s.children[k];
      var line = s.querySelector('.wd2-st-line');
      // the section's own colour sits on a layer that cannot be cut to shape, so it is moved onto the one that can
      if (sb && !s.wd2Bg) { s.wd2Bg = window.getComputedStyle(sb).backgroundColor || 'transparent'; s.style.setProperty('--wd2-ov-bg', s.wd2Bg); }
      if (stroke && stroke.ownerSVGElement && sb) {
        var all = points(stroke.getAttribute('d') || ''), p = all && cut(all, -0.01, 1.01);
        var H = stroke.ownerSVGElement.getBoundingClientRect().height;
        if (p && H > 0) {
          var ys = p.map(function (q) { return q[1]; }), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
          var D = (y1 - y0) * H, up = sb.getBoundingClientRect().top - s.getBoundingClientRect().top; // up: how far the background starts above the section (negative)
          if (D > 1 && D < 200) {
            var wide = cut(all, -0.5, 1.5) || p;
            var poly = wide.map(function (q) { return r2(q[0] * 100) + '% ' + r2((q[1] - 1) * H - up) + 'px'; });
            s.style.setProperty('--wd2-ov-clip', 'polygon(' + poly.join(',') + ',150% 100%,-50% 100%)');
            if (!line) {
              line = document.createElementNS(NS, 'svg');
              line.setAttribute('class', 'wd2-st-line'); line.setAttribute('viewBox', '0 0 1 1'); line.setAttribute('preserveAspectRatio', 'none'); line.setAttribute('aria-hidden', 'true');
              var path = document.createElementNS(NS, 'path');
              path.setAttribute('fill', 'none'); path.setAttribute('vector-effect', 'non-scaling-stroke');
              line.appendChild(path); s.appendChild(line);
            }
            var cs = window.getComputedStyle(stroke), pe = line.firstChild;
            pe.setAttribute('stroke', cs.stroke && cs.stroke !== 'none' ? cs.stroke : '#3dc2bb');
            pe.setAttribute('stroke-width', parseFloat(cs.strokeWidth) || 2);
            pe.setAttribute('d', p.map(function (q, n) { return (n ? 'L' : 'M') + r2(q[0] * 1000) / 1000 + ',' + Math.round((q[1] - y0) / (y1 - y0) * 1000) / 1000; }).join(' '));
            line.style.top = r2((y0 - 1) * H) + 'px'; line.style.height = r2(D) + 'px';
            ok = true;
          }
        }
      }
      s.classList.toggle('wd2-ov', ok); prev.classList.toggle('wd2-st-src', ok);
    }
    // switch a part off once the part two below it has rolled well up over the one in between (so it is long out of sight), and back on before it can show again
    obs.forEach(function (o) { o.disconnect(); }); obs = [];
    for (i = 0; i < secs.length - 2; i++) (function (hide, mid, mark) {
      var T = Math.min(mid.offsetHeight, vh) - 140;
      if (!mark || T < 80) { hide.classList.remove('wd2-st-off'); return; }
      var o = new IntersectionObserver(function (en) { var covered = en[en.length - 1].isIntersecting; hide.classList.toggle('wd2-st-off', covered); motion(hide, !covered); }, { rootMargin: '0px 0px -' + Math.round(vh - T) + 'px 0px' });
      o.observe(mark); obs.push(o);
    })(secs[i], secs[i + 1], secs[i + 2].querySelector('.wd2-st-mark'));
  }
  // A part with a moving Squarespace background (the knit behind the cards) only needs to move while it can be seen.
  // Squarespace gives that background its own pause and play buttons (hidden on this site), so they are pressed for the visitor:
  // pause once the part is completely covered, play again just before it comes back into view.
  function motion(sec, play) {
    var pause = sec.querySelector('.background-pause-button:not(.paused)'), go = sec.querySelector('.background-pause-button.paused');
    if (!pause) return;
    var playing = pause.classList.contains('visible') || (go ? !go.classList.contains('visible') : false);
    if (play !== playing) { try { (play ? (go || pause) : pause).click(); } catch (e) {} }
  }
  function soon() { clearTimeout(timer); timer = setTimeout(layout, 120); }
  function start() {
    var art = document.querySelector('#page-regions, main#page');
    var list = art ? [].slice.call(art.querySelectorAll('section.page-section')) : [];
    if (list.length < 2 || list.length > 6) return list.length > 6;
    secs = list;
    secs.forEach(function (s, i) {
      s.classList.add('wd2-z' + (i + 1));
      if (i < secs.length - 1) s.classList.add('wd2-st');
      if (i > 1) { var mk = document.createElement('span'); mk.className = 'wd2-st-mark'; mk.setAttribute('aria-hidden', 'true'); s.appendChild(mk); }
    });
    document.documentElement.classList.add('wd2-stack-on');
    layout();
    window.addEventListener('resize', soon);
    if (mq.addEventListener) mq.addEventListener('change', soon);
    if (window.ResizeObserver) { var ro = new ResizeObserver(soon); secs.forEach(function (s) { ro.observe(s); }); }
    [600, 1500, 3500].forEach(function (ms) { setTimeout(layout, ms); });
    return true;
  }
  var n = 0, t = setInterval(function () { if (start() || ++n > 20) clearInterval(t); }, 300);
  if (start()) clearInterval(t);
})();

/* Home page, desktop only: looks for the "Contact us" button under the heading, in the same slim shape as the phone buttons.
   Nothing changes for visitors until LIVE below is set to a number. Preview each one by adding ?contact=1 (to 16) to the address.
   1 teal with a cyan edge (like Contact us on phones)   2 solid cyan (like Build a package on phones)
   3 glass with a cyan edge   4 cream outline   5 leaf shape, solid cyan   6 leaf shape, teal with a cyan edge
   7 solid cream   8 solid cyan with an arrow   9 square corners, cyan outline   10 plain words with a cyan underline
   11 to 16 are colour changes on the slim shape: 11 dark with cyan edge   12 deeper cyan   13 cyan outline   14 frosted cream glass   15 deep teal, cream words   16 cyan fading to teal
   21 to 28 keep the button's own leaf shape and change the colour only: 21 solid cyan   22 deeper cyan   23 teal with cyan edge
   24 dark with cyan edge   25 solid cream   26 cream outline   27 cyan outline   28 cyan fading to teal */
(function () {
  if (window.wd2Cu || !document.body || !document.body.classList.contains('homepage')) return;
  window.wd2Cu = true;
  var LIVE = '27'; // chosen 20 Nov 2026: cyan outline in the button's own leaf shape, filling with cyan when pointed at ('' = the button as it was)
  var pick = (/[?&]contact=(2[1-8]|1[0-6]|[1-9])\b/.exec(location.search) || [])[1] || LIVE;
  if (!pick) return;
  document.documentElement.classList.add('wd2-cu-' + pick);
  if (+pick < 21) document.documentElement.classList.add('wd2-cu'); // 21 and up leave the shape alone
  var B = 'html.wd2-cu body.homepage .wd2-hero a.sqs-block-button-element.sqs-block-button-element.sqs-block-button-element';
  var N = function (n) { return 'html.wd2-cu-' + n + ' body.homepage .wd2-hero a.sqs-block-button-element.sqs-block-button-element.sqs-block-button-element'; };
  var st = document.createElement('style');
  st.id = 'wd2-cu-css';
  st.textContent = '@media (min-width:768px){'
    + B + '{border-radius:12px!important;min-height:46px!important;padding:10px 40px!important;font-size:16.5px!important;line-height:1.2!important;display:inline-flex!important;align-items:center;justify-content:center;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;text-shadow:none!important;box-shadow:0 6px 18px rgba(0,0,0,.28)!important}'
    + B + ' *{color:inherit!important}'
    + B + ':hover{box-shadow:0 0 0 2px rgba(61,194,187,.5),0 6px 18px rgba(0,0,0,.28)!important}'
    + N(1) + '{background:#234749!important;border:1.5px solid #5ad0c9!important;color:#8fe6e0!important}'
    + N(2) + '{background:#5ad0c9!important;border:1.5px solid #5ad0c9!important;color:#0e2628!important;font-weight:600!important}'
    + N(3) + '{background:linear-gradient(135deg,rgba(120,230,224,.26),rgba(61,194,187,.12)),rgba(14,38,40,.45)!important;-webkit-backdrop-filter:blur(10px) saturate(150%)!important;backdrop-filter:blur(10px) saturate(150%)!important;border:1.5px solid rgba(160,240,235,.55)!important;color:#eae6dd!important}'
    + N(4) + '{background:rgba(14,38,40,.28)!important;border:1.5px solid #eae6dd!important;color:#eae6dd!important}'
    + N(5) + '{border-radius:26px 0!important;background:#5ad0c9!important;border:1.5px solid #5ad0c9!important;color:#0e2628!important;font-weight:600!important}'
    + N(6) + '{border-radius:26px 0!important;background:#234749!important;border:1.5px solid #5ad0c9!important;color:#8fe6e0!important}'
    + N(7) + '{background:#eae6dd!important;border:1.5px solid #eae6dd!important;color:#0e2628!important;font-weight:600!important}'
    + N(8) + '{background:#5ad0c9!important;border:1.5px solid #5ad0c9!important;color:#0e2628!important;font-weight:600!important;padding:10px 30px!important}' + N(8) + ':before{content:"\\2192";order:2;margin-left:10px;font-weight:600}'
    + N(9) + '{border-radius:0!important;background:rgba(14,38,40,.35)!important;border:1.5px solid #5ad0c9!important;color:#8fe6e0!important;letter-spacing:.04em}'
    + N(10) + '{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;min-height:0!important;padding:4px 2px!important;color:#eae6dd!important;font-size:19px!important;text-decoration:underline!important;text-decoration-color:#5ad0c9!important;text-decoration-thickness:2px!important;text-underline-offset:7px!important;text-shadow:0 1px 8px rgba(0,0,0,.6)!important}' + N(10) + ':hover{box-shadow:none!important;color:#8fe6e0!important}'
    + N(11) + '{background:#0e2628!important;border:1.5px solid #3dc2bb!important;color:#3dc2bb!important}'
    + N(12) + '{background:#3dc2bb!important;border:1.5px solid #3dc2bb!important;color:#0e2628!important;font-weight:600!important}'
    + N(13) + '{background:rgba(14,38,40,.3)!important;border:1.5px solid #5ad0c9!important;color:#8fe6e0!important}'
    + N(14) + '{background:rgba(234,230,221,.2)!important;-webkit-backdrop-filter:blur(10px)!important;backdrop-filter:blur(10px)!important;border:1.5px solid rgba(234,230,221,.5)!important;color:#eae6dd!important}'
    + N(15) + '{background:#163436!important;border:1.5px solid #163436!important;color:#eae6dd!important}'
    + N(16) + '{background:linear-gradient(100deg,#5ad0c9,#2a8f89)!important;border:0!important;color:#0e2628!important;font-weight:600!important}'
    + N(21) + '{background:#5ad0c9!important;border-color:#5ad0c9!important;color:#0e2628!important;font-weight:600!important;text-shadow:none!important}'
    + N(22) + '{background:#3dc2bb!important;border-color:#3dc2bb!important;color:#0e2628!important;font-weight:600!important;text-shadow:none!important}'
    + N(23) + '{background:#234749!important;border-color:#5ad0c9!important;color:#8fe6e0!important}'
    + N(24) + '{background:#0e2628!important;border-color:#3dc2bb!important;color:#3dc2bb!important}'
    + N(25) + '{background:#eae6dd!important;border-color:#eae6dd!important;color:#0e2628!important;font-weight:600!important;text-shadow:none!important}'
    + N(26) + '{background:rgba(14,38,40,.28)!important;border-color:#eae6dd!important;color:#eae6dd!important}'
    + N(27) + '{background:rgba(14,38,40,.3)!important;border-color:#5ad0c9!important;color:#8fe6e0!important;transition:background-color .25s ease,color .25s ease,border-color .25s ease,box-shadow .25s ease!important}'
    + N(27) + ':hover,' + N(27) + ':focus-visible{background:#5ad0c9!important;border-color:#5ad0c9!important;color:#0e2628!important;text-shadow:none!important}'
    + N(28) + '{background:linear-gradient(100deg,#5ad0c9,#2a8f89)!important;border-color:transparent!important;color:#0e2628!important;font-weight:600!important;text-shadow:none!important}'
    + [21,22,23,24,25,26,27,28].map(function (n) { return N(n) + ' *{color:inherit!important}'; }).join('')
    + '}';
  document.head.appendChild(st);
})();

/* Home page: try-out animations for the four service cards. Nothing changes for visitors until LIVE below is filled in.
   Preview by adding ?cards=1 (or 2, 3, 4, or several together such as ?cards=12) to the home page address.
   1 dealt in one by one as the section arrives   2 the photo zooms slowly inside the card on hover (desktop)
   3 a soft band of light crosses each card once as it arrives   4 the photo leans towards the mouse (desktop)
   The card frame itself never moves up or grows, so nothing can cross the blue line. */
(function () {
  if (window.wd2CardFx || !document.body || !document.body.classList.contains('homepage')) return;
  window.wd2CardFx = true;
  var LIVE = '123'; // chosen 20 Nov 2026: dealt in + photo zoom + a subtle light sweep ('' = no card animations)
  var pick = (/[?&]cards=([1-4]{1,4})\b/.exec(location.search) || [])[1] || LIVE;
  if (!pick) return;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (calm) return;
  var html = document.documentElement, has = function (n) { return pick.indexOf(n) !== -1; };
  pick.split('').forEach(function (n) { html.classList.add('wd2-cf-' + n); });
  var C = 'body.homepage .wd2-cards a', st = document.createElement('style');
  st.id = 'wd2-cardfx-css';
  st.textContent = C + ':nth-child(1){--i:0}' + C + ':nth-child(2){--i:1}' + C + ':nth-child(3){--i:2}' + C + ':nth-child(4){--i:3}'
    // 1: dealt in (uses "translate", which is separate from the transform the older hover script controls)
    + 'html.wd2-cf-1 body.homepage .sqs-block-content:has(.wd2-cards){opacity:1!important;transform:none!important}'
    + 'html.wd2-cf-1 ' + C + '{opacity:0;translate:0 34px}'
    + 'html.wd2-cf-1 body.homepage .wd2-cards.wd2-cf-in a{animation:wd2Deal .75s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i,0) * 140ms)}'
    + '@keyframes wd2Deal{from{opacity:0;translate:0 34px}to{opacity:1;translate:0 0}}'
    // 2: slow zoom of the photo inside the frame
    + '@media (hover:hover) and (pointer:fine){html.wd2-cf-2 ' + C + ' img{transition:transform 1.1s cubic-bezier(.2,.6,.2,1)}html.wd2-cf-2 ' + C + ':hover img{transform:scale(1.08)}}'
    // 3: one sweep of light
    + 'html.wd2-cf-3 ' + C + ':after{content:"";position:absolute;top:0;bottom:0;left:-70%;width:55%;pointer-events:none;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(200,250,246,.085),rgba(255,255,255,0));transform:skewX(-18deg);opacity:0}'
    + 'html.wd2-cf-3 body.homepage .wd2-cards.wd2-cf-in a:after{animation:wd2Sweep 1.7s ease-out both;animation-delay:calc(500ms + var(--i,0) * 160ms)}'
    + '@keyframes wd2Sweep{0%{opacity:1;translate:0 0}99%{opacity:1;translate:330% 0}100%{opacity:0;translate:330% 0}}'
    // 4: lean
    + 'html.wd2-cf-4 ' + C + ' img{transition:transform .25s ease-out;will-change:transform}';
  document.head.appendChild(st);
  function start() {
    var nav = document.querySelector('.wd2-cards'); if (!nav) return false;
    if (nav.wd2Fx) return true; nav.wd2Fx = true;
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (en) { if (en[en.length - 1].isIntersecting) { nav.classList.add('wd2-cf-in'); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }); // starts a short scroll after the cards begin to show (raise the 10% to make them wait longer)
      io.observe(nav);
    } else nav.classList.add('wd2-cf-in');
    if (has('4') && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
        var img = a.querySelector('img'), raf = 0, px = 0, py = 0;
        if (!img) return;
        a.addEventListener('pointermove', function (e) {
          var r = a.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5;
          if (!raf) raf = requestAnimationFrame(function () { raf = 0; img.style.transform = 'perspective(700px) rotateY(' + (px * 9).toFixed(2) + 'deg) rotateX(' + (-py * 9).toFixed(2) + 'deg) scale(1.07)'; });
        });
        a.addEventListener('pointerleave', function () { img.style.transform = ''; });
      });
    }
    return true;
  }
  var n = 0, t = setInterval(function () { if (start() || ++n > 20) clearInterval(t); }, 300);
  if (start()) clearInterval(t);
})();

/* Home page: tap feedback. A finger landing on Contact us / Build a package (and the older versions of those
   buttons) adds a "pressed" look straight away and keeps it for a moment, so there is a clear sign the tap registered. */
(function () {
  if (window.wd2Press || !document.body || !document.body.classList.contains('homepage')) return;
  window.wd2Press = true;
  var SEL = '.wd2-cta a, a.sqs-block-button-element, a.wd2-byp';
  var st = document.createElement('style');
  st.id = 'wd2-press-css';
  st.textContent = 'body.homepage .wd2-cards a.wd2-hover.wd2-hover,body.homepage .wd2-cards a.wd2-hover.wd2-hover:hover,body.homepage .wd2-cards a.wd2-tap.wd2-tap{transform:none!important;border-radius:20px!important}body.homepage .wd2-cards a.wd2-hover.wd2-hover:active{transform:scale(.97)!important}'
    // (above) the four home page cards never grow when pointed at or tapped, so a card cannot lip over the blue line
    + 'body.homepage section.page-section:has(.wd2-cards) .section-background canvas{filter:brightness(.78)}'
    // (above) the knit background behind the cards is dimmed a little so the knitted 2s are darker; raise the number towards 1 for brighter, lower for darker
    + 'body.homepage a.sqs-block-button-element.wd2-press,body.homepage a.wd2-byp.wd2-press{transform:scale(.95)!important;border-color:#3dc2bb!important;box-shadow:0 0 0 2px rgba(61,194,187,.75),0 0 20px rgba(61,194,187,.4)!important;transition:transform .12s ease,box-shadow .15s ease!important}';
  document.head.appendChild(st);
  var cur = null, t = 0;
  function down(e) {
    var a = e.target.closest && e.target.closest(SEL);
    if (!a) return;
    clearTimeout(t); if (cur && cur !== a) cur.classList.remove('wd2-press');
    cur = a; a.classList.add('wd2-press');
  }
  function up() { if (!cur) return; var a = cur; t = setTimeout(function () { a.classList.remove('wd2-press'); if (cur === a) cur = null; }, 450); }
  document.addEventListener('pointerdown', down, { passive: true });
  document.addEventListener('touchstart', down, { passive: true });
  ['pointerup', 'pointercancel', 'touchend', 'touchcancel'].forEach(function (ev) { document.addEventListener(ev, up, { passive: true }); });
  window.addEventListener('pageshow', function () { if (cur) { cur.classList.remove('wd2-press'); cur = null; } });
})();
