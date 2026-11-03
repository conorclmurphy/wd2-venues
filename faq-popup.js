/* Wedding Day 2 FAQ pop-up
   Adds a small "FAQs" button to every page. Tapping it opens the FAQs in a pop-up, so visitors don't leave the page.
   Install once, site-wide: Squarespace > Settings > Developer tools > Code Injection > Footer:
     <script>fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/faq-popup.js',{cache:'no-cache'}).then(function(r){return r.text()}).then(function(t){var s=document.createElement('script');s.textContent=t;document.body.appendChild(s)});</script>
   Any link to "#faqs" on the site also opens the pop-up. The questions live in musicians.json under "faq". */
(function () {
  if (window.wd2FaqPopup) return;
  window.wd2FaqPopup = true;
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/musicians.json';
  // Not needed on the FAQ page itself
  if (/^\/faq\/?$/.test(location.pathname)) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  if (!document.getElementById('vp-fonts')) {
    var f = document.createElement('link');
    f.id = 'vp-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Bitter:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }
  var st = document.createElement('style');
  st.textContent = [
    '.wfq-btn{position:fixed;left:16px;bottom:16px;z-index:9997;display:inline-flex;align-items:center;gap:7px;padding:10px 16px;border-radius:999px;border:1.5px solid #3dc2bb;background:#1d2525;color:#3dc2bb;font:600 14px "Bitter",Georgia,serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.4);transition:background .2s,color .2s}',
    '.wfq-btn:hover{background:#3dc2bb;color:#273030}',
    '.wfq-btn b{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#3dc2bb;color:#273030;font-size:13px}',
    '.wfq-btn:hover b{background:#273030;color:#3dc2bb}',
    '@media (max-width:1000px){.wfq-btn{bottom:84px;left:12px;padding:8px 13px;font-size:13px}}',
    '.wfq{position:fixed;inset:0;z-index:99998;background:rgba(15,20,20,.78);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:"Bitter",Georgia,serif}',
    '.wfq[hidden]{display:none}',
    '@keyframes wfqIn{0%{opacity:0;transform:translateY(24px) scale(.98)}100%{opacity:1;transform:none}}',
    '.wfq-box{position:relative;width:100%;max-width:640px;max-height:calc(100vh - 40px);max-height:calc(100dvh - 40px);display:flex;flex-direction:column;background:#273030;color:#eae6dd;border:1px solid #3f4b4b;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.5);animation:wfqIn .35s cubic-bezier(.2,.8,.2,1);overflow:hidden}',
    '.wfq-head{padding:20px 22px 12px;border-bottom:1px solid #3f4b4b}',
    '.wfq-head h2{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:24px;margin:0 40px 12px 0;color:#eae6dd}',
    '.wfq-x{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;border:0;background:#1d2525;color:#eae6dd;font-size:15px;cursor:pointer}',
    '.wfq-x:hover{background:#3dc2bb;color:#273030}',
    '.wfq-search{position:relative}',
    '.wfq-search input{font:inherit;font-size:16px;width:100%;box-sizing:border-box;padding:10px 14px 10px 40px;border-radius:999px;border:1.5px solid #3f4b4b;background:#1d2525;color:#eae6dd;outline:none}',
    '.wfq-search input:focus{border-color:#3dc2bb}',
    '.wfq-search svg{position:absolute;left:15px;top:50%;width:16px;height:16px;margin-top:-8px;color:#b8b3a8}',
    '.wfq-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}',
    '.wfq-chip{font:inherit;font-size:12px;cursor:pointer;padding:5px 11px;border-radius:999px;border:1.5px solid #3dc2bb;background:transparent;color:#3dc2bb}',
    '.wfq-chip.on{background:#3dc2bb;color:#273030}',
    '.wfq-body{overflow-y:auto;overscroll-behavior:contain;padding:8px 22px 18px}',
    '.wfq-body h3{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:17px;margin:16px 0 8px;color:#eae6dd}',
    '.wfq details{border:1px solid #3f4b4b;background:#303b3b;border-radius:12px;margin:0 0 8px}',
    '.wfq details[open]{border-color:rgba(61,194,187,.6)}',
    '.wfq summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 14px;font-size:14.5px;font-weight:600;color:#eae6dd}',
    '.wfq summary::-webkit-details-marker{display:none}',
    '.wfq summary:hover{color:#3dc2bb}',
    '.wfq .wfq-ic{flex:none;width:22px;height:22px;border-radius:50%;border:1.5px solid #3dc2bb;color:#3dc2bb;display:grid;place-items:center;transition:transform .25s,background .2s}',
    '.wfq .wfq-ic svg{width:12px;height:12px}',
    '.wfq details[open] .wfq-ic{transform:rotate(45deg);background:#3dc2bb;color:#273030}',
    '.wfq-a{padding:0 14px 13px;font-size:14px;line-height:1.6;color:#eae6dd;opacity:.9}',
    '.wfq-a a{color:#3dc2bb}',
    '.wfq mark{background:rgba(61,194,187,.35);color:inherit;border-radius:3px}',
    '.wfq-none{color:#b8b3a8;font-size:14px;padding:10px 2px}',
    '.wfq-foot{padding:12px 22px 16px;border-top:1px solid #3f4b4b;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;background:#1d2525}',
    '.wfq-foot span{font-size:13.5px;color:#b8b3a8}',
    '.wfq-foot a{display:inline-block;text-decoration:none!important;padding:9px 18px;border-radius:999px;font-weight:600;font-size:14px;background:#3dc2bb;color:#273030!important}',
    'html.wfq-lock,html.wfq-lock body{overflow:hidden!important}',
    '@media (max-width:640px){.wfq{padding:0;align-items:flex-end}.wfq-box{border-radius:20px 20px 0 0;max-height:90dvh}.wfq-head{padding:16px 16px 10px}.wfq-head h2{font-size:20px}.wfq-body{padding:6px 16px 14px}.wfq-foot{padding:10px 16px 14px}}'
  ].join('');
  document.head.appendChild(st);

  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'wfq-btn'; btn.setAttribute('aria-label', 'Frequently asked questions');
  btn.innerHTML = '<b aria-hidden="true">?</b>FAQs';
  document.body.appendChild(btn);

  var pop = document.createElement('div');
  pop.className = 'wfq'; pop.hidden = true; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'true'); pop.setAttribute('aria-label', 'Frequently asked questions');
  pop.innerHTML = '<div class="wfq-box"><button type="button" class="wfq-x" aria-label="Close">✕</button><div class="wfq-head"><h2>Frequently asked questions</h2>'
    + '<div class="wfq-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input type="search" placeholder="Search, e.g. price, trad band, travel" aria-label="Search the FAQs"></div>'
    + '<div class="wfq-chips"></div></div><div class="wfq-body"><p class="wfq-none">Loading…</p></div>'
    + '<div class="wfq-foot"><span>Still have a question?</span><a href="/home#enquiremain">Ask us</a></div></div>';
  document.body.appendChild(pop);

  var body = pop.querySelector('.wfq-body'), input = pop.querySelector('input'), chips = pop.querySelector('.wfq-chips');
  var plus = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var items = [], loaded = false, last = null;

  function build(F) {
    loaded = true;
    var h = '';
    F.groups.forEach(function (g, i) {
      h += '<section data-g="' + i + '"><h3>' + esc(g.title) + '</h3>';
      g.items.forEach(function (it) { h += '<details><summary><span class="wfq-q">' + esc(it.q) + '</span><span class="wfq-ic">' + plus + '</span></summary><div class="wfq-a">' + it.a + '</div></details>'; });
      h += '</section>';
    });
    body.innerHTML = h + '<p class="wfq-none" hidden>No questions match that. Try another word, or ask us below.</p>';
    chips.innerHTML = '<button type="button" class="wfq-chip on" data-g="all">All</button>' + F.groups.map(function (g, i) { return '<button type="button" class="wfq-chip" data-g="' + i + '">' + esc(g.title) + '</button>'; }).join('');
    items = Array.prototype.map.call(body.querySelectorAll('details'), function (d) {
      var q = d.querySelector('.wfq-q'), a = d.querySelector('.wfq-a');
      return { d: d, q: q, a: a, qh: q.innerHTML, ah: a.innerHTML, text: (q.textContent + ' ' + a.textContent).toLowerCase() };
    });
    Array.prototype.forEach.call(chips.querySelectorAll('.wfq-chip'), function (c) {
      c.addEventListener('click', function () {
        Array.prototype.forEach.call(chips.querySelectorAll('.wfq-chip'), function (x) { x.classList.toggle('on', x === c); });
        input.value = ''; filter();
        var g = c.getAttribute('data-g');
        Array.prototype.forEach.call(body.querySelectorAll('section'), function (s) { s.hidden = g !== 'all' && s.getAttribute('data-g') !== g; });
        body.scrollTop = 0;
      });
    });
  }
  var hl = function (html, w) {
    if (!w) return html;
    var re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return html.split(/(<[^>]+>)/).map(function (p) { return p.charAt(0) === '<' ? p : p.replace(re, '<mark>$1</mark>'); }).join('');
  };
  function filter() {
    var w = input.value.trim().toLowerCase(), any = false;
    if (w) Array.prototype.forEach.call(chips.querySelectorAll('.wfq-chip'), function (x) { x.classList.toggle('on', x.getAttribute('data-g') === 'all'); });
    items.forEach(function (it) {
      var ok = !w || it.text.indexOf(w) !== -1;
      it.d.hidden = !ok; if (ok) any = true;
      it.q.innerHTML = hl(it.qh, w); it.a.innerHTML = hl(it.ah, w);
      it.d.open = !!w && ok;
    });
    Array.prototype.forEach.call(body.querySelectorAll('section'), function (s) { s.hidden = !s.querySelector('details:not([hidden])'); });
    var n = body.querySelector('.wfq-none'); if (n) n.hidden = any;
  }
  input.addEventListener('input', filter);

  function load() {
    if (loaded) return;
    (window.WD2_MUSICIANS ? Promise.resolve(window.WD2_MUSICIANS) : fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }))
      .then(function (d) { if (d && d.faq) build(d.faq); else throw 0; })
      .catch(function () { body.innerHTML = '<p class="wfq-none">The FAQs could not be loaded. Please try again, or see our <a href="/faq">FAQ page</a>.</p>'; });
  }
  function open(from) {
    last = from || null; load();
    pop.hidden = false; document.documentElement.classList.add('wfq-lock');
    setTimeout(function () { pop.querySelector('.wfq-x').focus(); }, 50);
  }
  function close() {
    pop.hidden = true; document.documentElement.classList.remove('wfq-lock');
    if (last && last.focus) last.focus();
  }
  btn.addEventListener('click', function () { open(btn); });
  pop.querySelector('.wfq-x').addEventListener('click', close);
  pop.addEventListener('click', function (e) { if (e.target === pop) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) close(); });
  // links to "#faqs" anywhere on the site open the pop-up
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#faqs"]');
    if (a) { e.preventDefault(); open(a); }
  });
  // load the questions quietly in the background so the pop-up opens instantly
  setTimeout(load, 2500);
})();
