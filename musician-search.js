/* Wedding Day 2 musician search
   Usage in the Squarespace Code block on the Venues page:
     <div id="wd2-musicians-root"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/musician-search.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Musicians come from musicians.json (the same file the musician pages use), so a
   musician added or changed there shows up here automatically. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/musicians.json';
  var WATERMARK_LOGO_URL = 'https://images.squarespace-cdn.com/content/v1/68e3e2b74d7ab5214f499b88/d0f816a6-5802-418f-bd11-37ddd18df645/logo2027transparent.png?format=500w';

  var root = document.getElementById('wd2-musicians-root');
  if (!root) return;

  if (!document.getElementById('wdms-search-fonts')) {
    var f = document.createElement('link');
    f.id = 'wdms-search-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Jost:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }

  var css = '\
#wd2-musicians-root{--ink:#f1ede2;--cream:#000000;--card:#191919;--sage:#3dc2bb;--sage-dark:#8adcd7;--brass:#ffffff;--rose:#d9a394;--line:#2e2e2e;--radius:14px;\
font-family:"Jost","Work Sans",-apple-system,BlinkMacSystemFont,sans-serif;color:var(--ink);background:var(--cream);padding:40px 20px 56px;box-sizing:border-box;position:relative;overflow:hidden;border:1px solid var(--line);border-radius:24px}\
#wd2-musicians-root .wdms-watermark{position:absolute;top:50%;left:50%;width:min(1100px,140vw);transform:translate(-50%,-50%);opacity:.05;filter:brightness(0) invert(1);pointer-events:none;z-index:0;user-select:none}\
#wd2-musicians-root>.wdms-head,#wd2-musicians-root>.wdms-filters,#wd2-musicians-root>.wdms-reset,#wd2-musicians-root>.wdms-count,#wd2-musicians-root>.wdms-grid,#wd2-musicians-root>.wdms-empty{position:relative;z-index:1}\
#wd2-musicians-root *,#wd2-musicians-root *::before,#wd2-musicians-root *::after{box-sizing:border-box}\
#wd2-musicians-root .wdms-head{max-width:1040px;margin:0 auto 28px;text-align:center}\
#wd2-musicians-root .wdms-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);font-weight:600;margin-bottom:8px}\
#wd2-musicians-root .wdms-title{font-family:"Fraunces",serif;font-optical-sizing:auto;font-weight:500;font-size:clamp(28px,4vw,42px);margin:0 0 8px;color:var(--sage-dark)}\
#wd2-musicians-root .wdms-sub{font-size:15px;color:#b7b2a1;margin:0}\
#wd2-musicians-root .wdms-filters{max-width:1040px;margin:0 auto 30px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:20px 22px;display:grid;gap:16px;grid-template-columns:1fr 1fr}\
@media (max-width:720px){#wd2-musicians-root .wdms-filters{grid-template-columns:1fr}}\
#wd2-musicians-root .wdms-field label{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--sage-dark);margin-bottom:7px}\
#wd2-musicians-root .wdms-field input[type="text"],#wd2-musicians-root .wdms-field select{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:16px;background:var(--cream);color:var(--ink)}\
#wd2-musicians-root .wdms-field input[type="text"]:focus,#wd2-musicians-root .wdms-field select:focus{outline:2px solid var(--sage);outline-offset:1px}\
#wd2-musicians-root .wdms-chiprow{display:flex;flex-wrap:wrap;gap:8px}\
#wd2-musicians-root .wdms-chip{-webkit-appearance:none;appearance:none;margin:0;padding:8px 14px;line-height:1.2;border-radius:999px;border:1px solid var(--line);background:var(--cream);background-clip:padding-box;box-shadow:none;text-decoration:none;text-shadow:none;font-size:13px;cursor:pointer;font-family:inherit;color:var(--ink);transition:none;-webkit-tap-highlight-color:transparent;outline:none}\
#wd2-musicians-root .wdms-chip:hover{border-color:var(--sage)}\
#wd2-musicians-root .wdms-chip:focus{outline:none}\
#wd2-musicians-root .wdms-chip:focus-visible{outline:2px solid var(--sage);outline-offset:2px}\
#wd2-musicians-root .wdms-chip::before,#wd2-musicians-root .wdms-chip::after{content:none;display:none}\
#wd2-musicians-root .wdms-chip[aria-pressed="true"]{background:var(--sage);border-color:var(--sage);color:#fff}\
#wd2-musicians-root .wdms-capacity-row{display:flex;align-items:center;gap:10px}\
#wd2-musicians-root .wdms-capacity-row input[type="range"]{flex:1;accent-color:var(--sage)}\
#wd2-musicians-root .wdms-capacity-val{font-size:13px;font-weight:600;color:var(--sage-dark);min-width:74px;text-align:right}\
#wd2-musicians-root .wdms-reset{max-width:1040px;margin:-14px auto 26px;text-align:right}\
#wd2-musicians-root .wdms-reset button{background:none;border:none;font-family:inherit;font-size:13px;color:var(--brass);cursor:pointer;text-decoration:underline}\
#wd2-musicians-root .wdms-count{max-width:1040px;margin:0 auto 16px;font-size:13px;color:#b7b2a1}\
#wd2-musicians-root .wdms-grid{max-width:1040px;margin:0 auto;display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}\
#wd2-musicians-root .wdms-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;text-decoration:none;color:inherit;transition:transform .18s ease,box-shadow .18s ease;aspect-ratio:auto;max-width:none;margin:0;min-height:0;width:auto;position:relative}\
@media (hover:hover){#wd2-musicians-root .wdms-card.wdms-live:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(32,40,31,.12)}}\
#wd2-musicians-root .wdms-card.wdms-soon{cursor:default;opacity:.82}\
#wd2-musicians-root .wdms-card>*{flex-shrink:0}\
#wd2-musicians-root .wdms-card-imgwrap{position:relative;width:100%;height:0;padding-top:75%;overflow:hidden;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%)}\
#wd2-musicians-root .wdms-card-img{position:absolute;top:0;left:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;object-fit:cover;display:block}\
#wd2-musicians-root .wdms-card-img-fallback{position:absolute;inset:0;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%);display:flex;align-items:center;justify-content:center;font-family:"Fraunces",serif;font-size:34px;color:#fff;opacity:.85}\
#wd2-musicians-root .wdms-card-body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:8px;flex:1}\
#wd2-musicians-root .wdms-card-name{font-family:"Fraunces",serif;font-weight:500;font-size:19px;margin:0;color:var(--sage-dark)}\
#wd2-musicians-root .wdms-card-county{font-size:12.5px;color:#9a9484;letter-spacing:.02em}\
#wd2-musicians-root .wdms-tagrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}\
#wd2-musicians-root .wdms-tag{font-size:11px;padding:4px 9px;border-radius:999px;font-weight:600;letter-spacing:.02em}\
#wd2-musicians-root .wdms-tag-ev{background:#eef1e9;color:#2f6f6b}\
#wd2-musicians-root .wdms-tag-x{background:#f6ecd9;color:#8a6a2d}\
#wd2-musicians-root .wdms-tag-sitdown{background:#f3e6e2;color:#9a5646}\
#wd2-musicians-root .wdms-tag-casual{background:#e9eef5;color:#3f5c80}\
#wd2-musicians-root .wdms-tag-both{background:#f6ecd9;color:#8a6a2d}\
#wd2-musicians-root .wdms-soon-badge{margin-top:auto;font-size:12px;font-weight:600;color:var(--brass);letter-spacing:.04em;text-transform:uppercase;padding-top:6px}\
#wd2-musicians-root .wdms-view{margin-top:auto;font-size:12.5px;font-weight:600;color:var(--sage);letter-spacing:.03em}\
#wd2-musicians-root .wdms-empty{max-width:1040px;margin:40px auto;text-align:center;padding:40px 20px;color:#9a9484;font-size:15px}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  root.innerHTML = '<style>@keyframes wd2Shim{0%{background-position:-400px 0}100%{background-position:400px 0}}.wd2-sk{background:#303b3b linear-gradient(90deg,rgba(234,230,221,0) 0,rgba(234,230,221,.07) 50%,rgba(234,230,221,0) 100%) no-repeat;background-size:400px 100%;animation:wd2Shim 1.3s ease-in-out infinite;border-radius:14px}@media (prefers-reduced-motion:reduce){.wd2-sk{animation:none}}</style><div style="display:grid;gap:12px"><div class="wd2-sk" style="height:46px;border-radius:999px"></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px"><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div><div class="wd2-sk" style="aspect-ratio:3/4"></div></div></div>';

  fetch(DATA_URL, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (DATA) {
      var L = DATA.eventLabels || { ceremony: 'Ceremony & drinks reception', day2: 'Day 2', afterdinner: 'After dinner' };
      var MUSICIANS = DATA.musicians.map(function (m) {
        return {
          name: m.name, hideName: !!m.hideName, events: m.events || [], tradBand: !!m.tradBand, duo: !!m.duo, pos: m.photoPosition || '',
          live: !!(m.live && m.url), url: m.url,
          img: m.photo ? (/^https?:/.test(m.photo) ? m.photo : DATA.imageBase + m.photo + '?format=500w') : ''
        };
      });
      build(MUSICIANS, L);
    })
    .catch(function () {
      root.innerHTML = '<div class="wdms-empty">Musicians could not be loaded. Please refresh the page.</div>';
    });

  function build(MUSICIANS, L) {
    var ORDER = ['ceremony', 'day2', 'afterdinner'];
    var short = { ceremony: 'Ceremony & drinks', day2: 'Day 2', afterdinner: 'After dinner' };

    root.innerHTML = '\
      <img class="wdms-watermark" src="' + WATERMARK_LOGO_URL + '" alt="" aria-hidden="true" onerror="this.style.display=\'none\'" />\
      <div class="wdms-head">\
        <div class="wdms-eyebrow">Find Your Musician</div>\
        <h2 class="wdms-title">Search Wedding Day 2 Musicians</h2>\
        <p class="wdms-sub">Filter by the part of the day you need music for, and whether you want a trad band or duo.</p>\
      </div>\
      <div class="wdms-filters">\
        <div class="wdms-field">\
          <label for="wdms-search">Search by name</label>\
          <input type="text" id="wdms-search" placeholder="e.g. Lee" />\
        </div>\
        <div class="wdms-field">\
          <label>Also available as</label>\
          <div class="wdms-chiprow">\
            <button type="button" class="wdms-chip" id="wdms-trad" aria-pressed="false">Trad band</button>\
            <button type="button" class="wdms-chip" id="wdms-duo" aria-pressed="false">Duo</button>\
          </div>\
        </div>\
        <div class="wdms-field" style="grid-column: 1 / -1;">\
          <label>Music for</label>\
          <div class="wdms-chiprow" id="wdms-event-chips">\
            <button type="button" class="wdms-chip" data-ev="" aria-pressed="true">Any part of the day</button>' +
            ORDER.map(function (e) { return '<button type="button" class="wdms-chip" data-ev="' + e + '" aria-pressed="false">' + esc(L[e]) + '</button>'; }).join('') + '\
          </div>\
        </div>\
      </div>\
      <div class="wdms-reset"><button type="button" id="wdms-reset-btn">Reset filters</button></div>\
      <div class="wdms-count" id="wdms-count"></div>\
      <div class="wdms-grid" id="wdms-grid"></div>\
      <div class="wdms-empty" id="wdms-empty" style="display:none;">No musicians match those filters. Try fewer filters, or get in touch and we will find someone for you.</div>';

    var els = {
      search: root.querySelector('#wdms-search'),
      trad: root.querySelector('#wdms-trad'),
      duo: root.querySelector('#wdms-duo'),
      chips: Array.prototype.slice.call(root.querySelectorAll('#wdms-event-chips .wdms-chip')),
      grid: root.querySelector('#wdms-grid'),
      empty: root.querySelector('#wdms-empty'),
      count: root.querySelector('#wdms-count'),
      reset: root.querySelector('#wdms-reset-btn')
    };
    var state = { search: '', ev: '', trad: false, duo: false };

    function render() {
      var q = state.search.trim().toLowerCase();
      var results = MUSICIANS.filter(function (m) {
        return (!q || m.name.toLowerCase().indexOf(q) !== -1) &&
          (!state.ev || m.events.indexOf(state.ev) !== -1) &&
          (!state.trad || m.tradBand) &&
          (!state.duo || m.duo);
      });
      els.count.textContent = results.length + ' musician' + (results.length === 1 ? '' : 's') + ' found';
      els.empty.style.display = results.length ? 'none' : 'block';
      els.grid.innerHTML = results.map(function (m) {
        var imgBlock = '<div class="wdms-card-imgwrap">' + (m.img
          ? '<img class="wdms-card-img" src="' + esc(m.img) + '" alt="' + esc(m.name) + '"' + (m.pos ? ' style="object-position:' + esc(m.pos) + '"' : '') + ' loading="lazy" onerror="this.outerHTML=\'<div class=&quot;wdms-card-img-fallback&quot;>' + esc(m.name.charAt(0)) + '</div>\'" />'
          : '<div class="wdms-card-img-fallback">' + esc(m.name.charAt(0)) + '</div>') + '</div>';
        var tags = ORDER.filter(function (e) { return m.events.indexOf(e) !== -1; })
          .map(function (e) { return '<span class="wdms-tag wdms-tag-ev">' + esc(short[e]) + '</span>'; }).join('') +
          (m.tradBand ? '<span class="wdms-tag wdms-tag-x">Trad band</span>' : '') +
          (m.duo ? '<span class="wdms-tag wdms-tag-x">Duo</span>' : '');
        var inner = imgBlock +
          '<div class="wdms-card-body">' +
            (m.hideName ? '' : '<h3 class="wdms-card-name">' + esc(m.name) + '</h3>') +
            '<div class="wdms-tagrow">' + tags + '</div>' +
            (m.live ? '<span class="wdms-view">View musician →</span>' : '<span class="wdms-soon-badge">Page coming soon</span>') +
          '</div>';
        return m.live
          ? '<a class="wdms-card wdms-live" href="' + esc(m.url) + '">' + inner + '</a>'
          : '<div class="wdms-card wdms-soon">' + inner + '</div>';
      }).join('');
    }

    els.search.addEventListener('input', function (e) { state.search = e.target.value; render(); });
    els.chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        els.chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        state.ev = chip.getAttribute('data-ev');
        render();
      });
    });
    [['trad', els.trad], ['duo', els.duo]].forEach(function (p) {
      p[1].addEventListener('click', function () {
        state[p[0]] = !state[p[0]];
        p[1].setAttribute('aria-pressed', state[p[0]] ? 'true' : 'false');
        render();
      });
    });
    els.reset.addEventListener('click', function () {
      state = { search: '', ev: '', trad: false, duo: false };
      els.search.value = '';
      els.trad.setAttribute('aria-pressed', 'false'); els.duo.setAttribute('aria-pressed', 'false');
      els.chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-ev') === '' ? 'true' : 'false'); });
      render();
    });

    render();
  }
})();
