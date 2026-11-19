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
    var links = [['/musicians', 'Solo Musicians'], ['/ceremony-musicians', 'Ceremony & Reception'], ['/djs', 'DJs'], ['/trad', 'Trad Band'], ['/packages', 'Package Builder'], ['/venues', 'Venues'], ['/faq', 'FAQs'], ['/home#enquiremain', 'Enquire'], ['https://www.instagram.com/weddingday2.ie', 'Instagram']];
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
  st.textContent = 'html body.homepage .sqs-block:has(form.react-form-contents){border:1px solid #234749!important;border-radius:0!important;background:rgba(14,38,40,.42)!important;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);padding:26px 26px 22px!important;box-shadow:0 20px 50px rgba(0,0,0,.35)}html body.homepage .fe-block:has(form.react-form-contents){mix-blend-mode:normal!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents label,html body.homepage form.react-form-contents.react-form-contents.react-form-contents legend,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .title,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .caption-text{color:#eae6dd!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .description,html body.homepage form.react-form-contents.react-form-contents.react-form-contents p.description{color:#b8b3a8!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents input:not([type=checkbox]):not([type=radio]),html body.homepage form.react-form-contents.react-form-contents.react-form-contents select,html body.homepage form.react-form-contents.react-form-contents.react-form-contents textarea{background:rgba(14,38,40,.5)!important;background-color:rgba(14,38,40,.5)!important;border:1px solid rgba(160,240,235,.28)!important;border-radius:15px 0!important;color:#eae6dd!important;box-shadow:none!important;color-scheme:dark}html body.homepage form.react-form-contents.react-form-contents.react-form-contents select.show-placeholder{color:#b8b3a8!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents input:focus,html body.homepage form.react-form-contents.react-form-contents.react-form-contents select:focus,html body.homepage form.react-form-contents.react-form-contents.react-form-contents textarea:focus{border-color:#3dc2bb!important;outline:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-input-effects{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option label span{background:rgba(234,230,221,.06)!important;border:1px solid rgba(234,230,221,.28)!important;border-radius:8px 0!important;color:#eae6dd!important;padding:6px 14px!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option label input:checked+span{background:#3dc2bb!important;border-color:#3dc2bb!important;color:#0e2628!important;font-weight:600!important;box-shadow:0 0 0 3px rgba(61,194,187,.22)!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option label input:checked+span:before{content:"\\2713";font:700 13px/1 system-ui,-apple-system,Segoe UI,sans-serif}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option label span{cursor:pointer;display:inline-flex!important;align-items:center;gap:6px;transition:background .15s,border-color .15s,color .15s}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-submit-button{background:linear-gradient(135deg,rgba(120,230,224,.13),rgba(61,194,187,.04)),rgba(14,38,40,.35)!important;-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);border:1px solid rgba(160,240,235,.26)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -1px 0 rgba(0,0,0,.15),0 4px 14px rgba(0,0,0,.18)!important;color:#dcefec!important;border-radius:45px 0!important;width:100%!important;padding:15px 26px!important;font-weight:600!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-submit-button:hover{border-color:rgba(61,194,187,.85)!important;box-shadow:0 0 0 1px rgba(61,194,187,.55),0 0 12px rgba(61,194,187,.16),inset 0 1px 0 rgba(255,255,255,.16)!important}html body.homepage a.sqs-block-button-element.sqs-block-button-element{transition:box-shadow .25s ease,border-color .25s ease!important;background:linear-gradient(135deg,rgba(120,230,224,.13),rgba(61,194,187,.04)),rgba(14,38,40,.35)!important;-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);border:1px solid rgba(160,240,235,.26)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -1px 0 rgba(0,0,0,.15),0 4px 14px rgba(0,0,0,.18)!important;color:#dcefec!important;border-radius:45px 0!important;white-space:nowrap}html body.homepage a.sqs-block-button-element.sqs-block-button-element:hover{border-color:rgba(61,194,187,.85)!important;box-shadow:0 0 0 1px rgba(61,194,187,.55),0 0 12px rgba(61,194,187,.16),inset 0 1px 0 rgba(255,255,255,.16)!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px 14px!important;align-items:start}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>*{grid-column:1/-1;order:5;margin:0!important;padding:0!important;min-width:0}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.name{order:1}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.email{order:2}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.date,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.time{order:3;grid-column:auto}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.checkbox~.checkbox{order:6}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.select{order:7;grid-column:auto}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.followup-question-container{order:8}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.checkbox+.followup-question-container{order:5}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.checkbox~.checkbox+.followup-question-container{order:6}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.textarea{order:9}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.text{order:10}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list>.name>legend{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents p.description{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list .form-item .title,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list legend{margin:0 0 5px!important;padding:0!important;font-size:14px!important;line-height:1.3!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list .caption{margin:0 0 4px!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents input:not([type=checkbox]):not([type=radio]),html body.homepage form.react-form-contents.react-form-contents.react-form-contents select{min-height:0!important;height:42px!important;padding-top:6px!important;padding-bottom:6px!important;width:100%!important;box-sizing:border-box!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents textarea{min-height:84px!important;height:84px!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option{margin:0 6px 6px 0!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .option:has(input[value="Corporate"]){display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .followup-question-container .last-name{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .followup-question-container .first-name{width:100%!important;max-width:none!important;flex:1 1 100%!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .followup-question-container .first-name .caption{display:none!important}html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-button-wrapper{margin-top:14px!important}html body.homepage .sqs-block:has(form.react-form-contents){padding:22px 24px 20px!important}@media (max-width:360px){html body.homepage form.react-form-contents.react-form-contents.react-form-contents .field-list{grid-template-columns:minmax(0,1fr)}}@media (max-width:640px){html body.homepage .sqs-block:has(form.react-form-contents){padding:18px 16px 16px!important}}html body.homepage a.sqs-block-button-element.sqs-block-button-element{position:relative;overflow:hidden}html body.homepage a.sqs-block-button-element.sqs-block-button-element:after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:50%;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(170,245,240,.26),transparent);transform:translate3d(0,0,0) skewX(-18deg);will-change:transform;animation:wd2BtnShine 6s ease-in-out infinite}@keyframes wd2BtnShine{0%{transform:translate3d(0,0,0) skewX(-18deg)}35%,100%{transform:translate3d(340%,0,0) skewX(-18deg)}}@media (prefers-reduced-motion:reduce){html body.homepage a.sqs-block-button-element.sqs-block-button-element:after{animation:none;opacity:0}}@media (max-width:640px){html body.homepage a.sqs-block-button-element.sqs-block-button-element{top:14px}}@media (max-width:1000px){html body.homepage .sqs-block:has(form.react-form-contents){-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:rgba(14,38,40,.6)!important}html body.homepage a.sqs-block-button-element.sqs-block-button-element,html body.homepage form.react-form-contents.react-form-contents.react-form-contents .form-submit-button{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:linear-gradient(135deg,rgba(120,230,224,.16),rgba(61,194,187,.06)),rgba(14,38,40,.55)!important}}';
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
