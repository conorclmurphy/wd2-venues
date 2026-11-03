/* Wedding Day 2 FAQ page
   Usage in a Squarespace Code block:
     <div id="faq-page"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/faq-page.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   The questions and answers live in musicians.json under "faq". */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/musicians.json';
  var root = document.getElementById('faq-page');
  if (!root) return;

  // Paint the whole page section black so there's no patterned or lighter band around this page
  (function () {
    var sec = root.closest('section');
    if (!sec) return;
    sec.style.backgroundColor = '#000';
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = '#000'; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  })();

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var plain = function (html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; };

  if (!document.getElementById('vp-fonts')) {
    var f = document.createElement('link');
    f.id = 'vp-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Bitter:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }
  var st = document.createElement('style');
  st.textContent = [
    '#faq-page{--c-bg:#000000;--c-surface:#191919;--c-line:#2e2e2e;--c-ink:#eae6dd;--c-muted:#b8b3a8;--c-cyan:#3dc2bb;--f-display:"Young Serif",Georgia,serif;--f-body:"Bitter",Georgia,serif;background:var(--c-bg);color:var(--c-ink);font-family:var(--f-body);padding:14px clamp(12px,2.5vw,32px) 72px;border-radius:0}',
    '#faq-page *{box-sizing:border-box}',
    '#faq-page .fq-wrap{max-width:1200px;margin:0 auto}',
    '#faq-page .fq-eye{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--c-cyan);margin:0 0 8px}',
    '#faq-page h1{font-family:var(--f-display);font-weight:400;font-size:clamp(26px,4vw,40px);line-height:1.1;margin:0 0 10px;color:var(--c-ink)}',
    '#faq-page .fq-intro{font-size:15px;line-height:1.55;color:var(--c-muted);margin:0 0 26px;max-width:900px}',
    '#faq-page .fq-search{position:relative;margin:0 0 30px}',
    '#faq-page .fq-search input{font:inherit;font-size:16px;width:100%;padding:11px 16px 11px 42px;border-radius:999px;border:1.5px solid var(--c-line);background:#0d0d0d;color:var(--c-ink);outline:none}',
    '#faq-page .fq-search input:focus{border-color:var(--c-cyan)}',
    '#faq-page .fq-search svg{position:absolute;left:17px;top:50%;width:18px;height:18px;margin-top:-9px;color:var(--c-muted)}',
    '#faq-page .fq-chips{display:flex;flex-wrap:wrap;gap:8px;margin:-12px 0 30px}',
    '#faq-page .fq-chip{font:inherit;font-size:13px;cursor:pointer;padding:6px 13px;border-radius:999px;border:1.5px solid var(--c-cyan);background:transparent;color:var(--c-cyan)}',
    '#faq-page .fq-chip:hover{background:rgba(61,194,187,.15)}',
    '#faq-page h2{font-family:var(--f-display);font-weight:400;font-size:21px;margin:28px 0 10px;color:var(--c-ink);scroll-margin-top:90px}',
    '#faq-page details{border:1px solid var(--c-line);background:var(--c-surface);border-radius:14px;margin:0 0 10px;transition:border-color .2s}',
    '#faq-page details[open]{border-color:rgba(61,194,187,.6)}',
    '#faq-page summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 18px;font-size:15px;font-weight:600;color:var(--c-ink)}',
    '#faq-page summary::-webkit-details-marker{display:none}',
    '#faq-page summary:hover{color:var(--c-cyan)}',
    '#faq-page summary .fq-ic{flex:none;width:24px;height:24px;border-radius:50%;border:1.5px solid var(--c-cyan);color:var(--c-cyan);display:grid;place-items:center;transition:transform .25s,background .2s}',
    '#faq-page summary .fq-ic svg{width:14px;height:14px}',
    '#faq-page details[open] summary .fq-ic{transform:rotate(45deg);background:var(--c-cyan);color:#000000}',
    '#faq-page .fq-a{padding:0 18px 15px;font-size:14.5px;line-height:1.6;color:var(--c-ink);opacity:.9}',
    '#faq-page .fq-a a{color:var(--c-cyan)}',
    '#faq-page .fq-none{color:var(--c-muted);padding:10px 2px}',
    '#faq-page .fq-cta{margin-top:44px;padding:26px 28px;border-radius:18px;border:1px solid var(--c-line);background:#0d0d0d;display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center;justify-content:space-between}',
    '#faq-page .fq-cta strong{display:block;font-family:var(--f-display);font-weight:400;font-size:20px;margin-bottom:4px}',
    '#faq-page .fq-cta span{color:var(--c-muted);font-size:15px}',
    '#faq-page .fq-btns{display:flex;flex-wrap:wrap;gap:10px}',
    '#faq-page .fq-btn{display:inline-block;text-decoration:none!important;padding:12px 24px;border-radius:999px;font-weight:600;font-size:15px;background:var(--c-cyan);color:#000000!important}',
    '#faq-page .fq-btn.fq-ghost{background:transparent;color:var(--c-cyan)!important;border:1.5px solid var(--c-cyan)}',
    '#faq-page mark{background:rgba(61,194,187,.35);color:inherit;border-radius:3px;padding:0 1px}',
    '@media (max-width:640px){#faq-page{padding-top:28px;padding-bottom:48px}#faq-page h1{font-size:25px}#faq-page .fq-intro{font-size:14px}#faq-page h2{font-size:18px;margin:22px 0 8px}#faq-page summary{font-size:14px;padding:11px 13px;gap:10px}#faq-page summary .fq-ic{width:22px;height:22px}#faq-page details{border-radius:12px;margin-bottom:8px}#faq-page .fq-a{padding:0 13px 13px;font-size:13.5px;line-height:1.55}#faq-page .fq-chip{font-size:12px;padding:5px 11px}#faq-page .fq-cta{padding:18px}#faq-page .fq-cta strong{font-size:18px}#faq-page .fq-cta span{font-size:13.5px}#faq-page .fq-btn{font-size:14px;padding:10px 18px}}'
  ].join('');
  document.head.appendChild(st);

  var plus = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function render(F) {
    var h = '<div class="fq-wrap"><p class="fq-eye">Wedding Day 2</p><h1>' + esc(F.title) + '</h1><p class="fq-intro">' + esc(F.intro) + '</p>'
      + '<div class="fq-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input type="search" placeholder="Search questions, e.g. price, trad band, travel" aria-label="Search the FAQ"></div>'
      + '<div class="fq-chips">' + F.groups.map(function (g, i) { return '<button type="button" class="fq-chip" data-go="fq-g' + i + '">' + esc(g.title) + '</button>'; }).join('') + '</div>';
    F.groups.forEach(function (g, i) {
      h += '<section class="fq-group"><h2 id="fq-g' + i + '">' + esc(g.title) + '</h2>';
      g.items.forEach(function (it) {
        // answers may contain simple links written in the data file
        h += '<details><summary><span class="fq-q">' + esc(it.q) + '</span><span class="fq-ic">' + plus + '</span></summary><div class="fq-a">' + it.a + '</div></details>';
      });
      h += '</section>';
    });
    h += '<p class="fq-none" hidden>No questions match that. Try another word, or ask us directly below.</p>'
      + '<div class="fq-cta"><div><strong>Still have a question?</strong><span>Send us a message and we\'ll get back to you.</span></div>'
      + '<div class="fq-btns"><a class="fq-btn" href="/home#enquiremain">Ask us a question</a><a class="fq-btn fq-ghost" href="/packages">Build your package</a></div></div></div>';
    root.innerHTML = h;

    // Google-friendly FAQ markup, so questions can show directly in search results
    var ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };
    F.groups.forEach(function (g) { g.items.forEach(function (it) { ld.mainEntity.push({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: plain(it.a) } }); }); });
    var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld); document.head.appendChild(s);

    // category chips jump to their section
    Array.prototype.forEach.call(root.querySelectorAll('.fq-chip'), function (b) {
      b.addEventListener('click', function () { var t = document.getElementById(b.getAttribute('data-go')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    });

    // search: show only matching questions, opened, with the words highlighted
    var input = root.querySelector('.fq-search input'), none = root.querySelector('.fq-none');
    var items = Array.prototype.map.call(root.querySelectorAll('details'), function (d) {
      var q = d.querySelector('.fq-q'), a = d.querySelector('.fq-a');
      return { d: d, q: q, a: a, qh: q.innerHTML, ah: a.innerHTML, text: (q.textContent + ' ' + a.textContent).toLowerCase() };
    });
    var hl = function (html, word) {
      if (!word) return html;
      var re = new RegExp('(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return html.split(/(<[^>]+>)/).map(function (part) { return part.charAt(0) === '<' ? part : part.replace(re, '<mark>$1</mark>'); }).join('');
    };
    input.addEventListener('input', function () {
      var w = input.value.trim().toLowerCase(), any = false;
      items.forEach(function (it) {
        var ok = !w || it.text.indexOf(w) !== -1;
        it.d.hidden = !ok; if (ok) any = true;
        it.q.innerHTML = hl(it.qh, w); it.a.innerHTML = hl(it.ah, w);
        it.d.open = !!w && ok;
      });
      Array.prototype.forEach.call(root.querySelectorAll('.fq-group'), function (g) { g.hidden = !g.querySelector('details:not([hidden])'); });
      none.hidden = any;
    });
  }

  (window.WD2_MUSICIANS ? Promise.resolve(window.WD2_MUSICIANS)
    : fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }))
    .then(function (d) { if (d && d.faq) render(d.faq); else root.innerHTML = '<p style="padding:30px">FAQ could not be loaded. Please refresh the page.</p>'; })
    .catch(function () { root.innerHTML = '<p style="padding:30px">FAQ could not be loaded. Please refresh the page.</p>'; });
})();
