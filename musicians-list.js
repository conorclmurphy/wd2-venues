/* Wedding Day 2 "Our musicians" page
   Usage in a Squarespace Code block on /musicians:
     <div id="musicians-list"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/musicians-list.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Musicians come from musicians.json, so new musicians appear here automatically.
   Photos are loaded at card size (not the full original), so the page stays fast. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/musicians.json';
  var root = document.getElementById('musicians-list');
  if (!root) return;

  // Keep the site's photo-link script from turning this whole block into one link
  for (var blk = root; blk && blk !== document.body; blk = blk.parentElement) {
    if (blk.classList && blk.classList.contains('sqs-block')) { blk.wd2Wired = true; break; }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  if (!document.getElementById('vp-fonts')) {
    var f = document.createElement('link');
    f.id = 'vp-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }
  var st = document.createElement('style');
  st.textContent = [
    // Solo Musicians page: pure black, white type, black-and-white photos that turn to colour on hover
    '#musicians-list{--c-bg:#000;--c-line:#222;--c-ink:#fff;--c-muted:#9a9a9a;--c-cyan:#3dc2bb;--c-on:#000;--f-head:"Inter",system-ui,sans-serif;background:var(--c-bg);color:var(--c-ink);font-family:"Inter",system-ui,sans-serif;padding:56px clamp(16px,4vw,48px) 72px}',
    '#musicians-list *{box-sizing:border-box}',
    '#musicians-list .ml-wrap{max-width:1184px;margin:0 auto}',
    '#musicians-list .ml-top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px 32px;margin:0 0 36px}',
    '#musicians-list .ml-eye{display:none}',
    '#musicians-list h1{font-family:var(--f-head);font-weight:500;font-size:clamp(36px,5vw,56px);line-height:1;letter-spacing:-.03em;margin:0;color:var(--c-ink);text-transform:none}',
    '#musicians-list .ml-intro{display:none}',
    '#musicians-list .ml-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0}',
    '#musicians-list .ml-chip{font:inherit;font-size:13.5px;line-height:1.2;cursor:pointer;padding:8px 16px;border-radius:999px;border:1px solid #333;background:transparent;color:var(--c-ink);transition:background .2s,color .2s,border-color .2s}',
    '#musicians-list .ml-chip:hover{border-color:var(--c-cyan)}',
    '#musicians-list .ml-chip.on{background:var(--c-cyan);border-color:var(--c-cyan);color:var(--c-on)}',
    '#musicians-list .ml-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:28px 12px}',
    '#musicians-list .ml-card,#musicians-list .ml-card.wd2-hover,#musicians-list .ml-card.wd2-hover:hover{display:flex;flex-direction:column;gap:10px;text-decoration:none!important;color:var(--c-ink)!important;box-shadow:none!important;transform:none!important;border-radius:0!important;overflow:visible!important}',
    '#musicians-list .ml-card[hidden]{display:none}',
    '#musicians-list .ml-img{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--c-line)}',
    '#musicians-list .ml-img img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(1) contrast(1.08);transition:filter .35s,transform .5s}',
    '#musicians-list .ml-card:hover .ml-img img{filter:none;transform:scale(1.03)}',
    '#musicians-list .ml-name{position:absolute;left:12px;bottom:10px;z-index:1;font-family:var(--f-head);font-size:20px;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6)}',
    '#musicians-list .ml-foot{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 10px}',
    '#musicians-list .ml-tags{font-size:12.5px;line-height:1.4;color:var(--c-muted)}',
    '#musicians-list .ml-more{font-size:13px;font-weight:600;color:var(--c-ink);white-space:nowrap}',
    '#musicians-list .ml-card:hover .ml-more{color:var(--c-cyan)}',
    '#musicians-list .ml-cta{margin-top:48px;padding:22px 24px;border:1px solid var(--c-line);background:transparent;display:flex;flex-wrap:wrap;gap:14px 20px;align-items:center;justify-content:space-between}',
    '#musicians-list .ml-cta strong{display:block;font-family:var(--f-head);font-weight:500;font-size:20px;margin-bottom:4px;letter-spacing:-.01em}',
    '#musicians-list .ml-cta span{color:var(--c-muted);font-size:14.5px}',
    '#musicians-list .ml-btn{display:inline-block;text-decoration:none!important;padding:11px 22px;border-radius:999px;font-weight:600;font-size:14.5px;background:var(--c-cyan);color:var(--c-on)!important;white-space:nowrap}',
    '@media (max-width:1000px){#musicians-list .ml-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}',
    '@media (max-width:700px){#musicians-list{padding-top:32px}#musicians-list .ml-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 10px}#musicians-list .ml-top{margin-bottom:24px}#musicians-list .ml-chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -16px;padding:0 16px;width:calc(100% + 32px)}#musicians-list .ml-chips::-webkit-scrollbar{display:none}#musicians-list .ml-chip{flex:none;font-size:13px;padding:7px 13px}#musicians-list .ml-tags{font-size:11.5px}#musicians-list .ml-more{font-size:12.5px}}',
    // Ceremony & drinks reception page: off-white "magazine" layout, heading and filters in a left column, colour photos
    '#musicians-list.ml-light{--c-bg:#faf8f3;--c-line:#e4dfd3;--c-ink:#1f2727;--c-muted:#5a6464;--c-cyan:#1b7f7a;--c-on:#faf8f3;--f-head:"Young Serif",Georgia,serif}',
    '#musicians-list.ml-light .ml-wrap{display:flex;flex-wrap:wrap;gap:40px 56px;align-items:flex-start}',
    '#musicians-list.ml-light .ml-top{flex:1 1 260px;max-width:320px;flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:18px;margin:0;position:sticky;top:24px}',
    '#musicians-list.ml-light .ml-eye{display:block;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--c-cyan);margin:0}',
    '#musicians-list.ml-light h1{font-weight:400;font-size:clamp(32px,3.6vw,42px);line-height:1.1;letter-spacing:0}',
    '#musicians-list.ml-light .ml-intro{display:block;font-size:15.5px;line-height:1.6;color:var(--c-muted);margin:0}',
    '#musicians-list.ml-light .ml-chips{flex-direction:column;align-items:flex-start;gap:2px;width:100%;border-top:1px solid var(--c-line);padding-top:14px;margin-top:8px}',
    '#musicians-list.ml-light .ml-chip{border:0;border-radius:0;padding:8px 0;font-size:15px;color:var(--c-muted);background:none}',
    '#musicians-list.ml-light .ml-chip:hover{color:var(--c-ink)}',
    '#musicians-list.ml-light .ml-chip.on{background:none;color:var(--c-ink);font-weight:600}',
    '#musicians-list.ml-light .ml-chip.on:before{content:"\\25CF";margin-right:8px;color:var(--c-cyan)}',
    '#musicians-list.ml-light .ml-main{flex:999 1 560px;min-width:0}',
    '#musicians-list.ml-light .ml-grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:28px 18px}',
    '#musicians-list.ml-light .ml-img{border-radius:6px}',
    '#musicians-list.ml-light .ml-img img{filter:none}',
    '#musicians-list.ml-light .ml-foot{flex-direction:column;align-items:flex-start;gap:6px}',
    '#musicians-list.ml-light .ml-more{font-size:13.5px;color:var(--c-cyan)}',
    '#musicians-list.ml-light .ml-cta{border-radius:10px;background:#fff}',
    '#musicians-list.ml-light .ml-cta strong{font-weight:400;font-size:22px}',
    '@media (max-width:700px){#musicians-list.ml-light .ml-top{position:static;max-width:none}#musicians-list.ml-light .ml-chips{flex-direction:row;align-items:center;gap:6px 18px;flex-wrap:wrap;overflow:visible;margin:8px 0 0;padding:14px 0 0;width:100%}#musicians-list.ml-light .ml-chip{padding:4px 0;font-size:14px}#musicians-list.ml-light .ml-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 12px}}'
  ].join('');
  document.head.appendChild(st);

  // Same photos, crop points and order as the original /musicians grid.
  // Musicians not listed here still appear (after these), using their profile photo.
  var LIST_PHOTOS = {
    lee: ['b1d790f4-10b1-49e6-8a3f-d0954b2f1279/0311.jpg', '56% 34%'],
    mathew: ['7f6fbbd3-9308-4647-9a18-d1527e8013a7/2539bfd9-d4db-4962-b79d-9dd152ae4956.jpg', '50% 50%'],
    conorc: ['fed5839c-74d5-4278-951e-aa553f73d566/75d322ea-b351-4ce0-92ed-a0d32b85adfa.jpeg', '57% 32%'],
    josh: ['4e446b89-d89b-4969-85d7-4aa409a8fd4f/%F0%9F%93%B8+%40classytrebor+%23music+%23explorepage+%23foryou+%23jqmusic.jpg', '50% 50%'],
    conort: ['f31ae8b7-63ec-4fd3-aed6-a5e726ad9a41/IMG_0023.jpeg', '50% 50%'],
    cathal: ['bf3659bf-44dc-46c9-be99-e1f9363c15c0/image00002.jpg', '30% 46%'],
    alan: ['93d97748-02ee-4529-9ec7-eb6dd6aeb793/DSC00499_Original.jpg', '39% 54%'],
    craig: ['8039f4a9-6f54-45a8-82a0-acfdc307e41d/e62b1481-6b94-4eec-9d3b-fe878f830d69.png', '0% 67%'],
    karl: ['fc1cc265-3a0e-4cd8-a1a1-bb0402957f35/copy_E566B8C9-484D-45D3-BE09-3864F0978D28.JPEG', '50% 50%'],
    emmett: ['054bee54-e90c-4a94-af76-a20731daa6c4/c8d73e3d-736f-455c-9022-a15527a6d0dd.jpg', '50% 50%'],
    pauric: ['3979008e-db26-424d-8d96-cf31dd9a98ac/WhatsApp+Image+2026-06-02+at+21.59.01.jpg', '31% 68%'],
    phil: ['2135872b-f92c-431c-8435-81225d5fb05c/A66F302B-E872-4BA5-94C3-7CA3ED1B7BA6.JPG', '9% 14%'],
    cian: ['fafe5387-96fe-4348-b492-b14472244729/Cian+Morrin+Photo.jpeg', '50% 50%'],
    james: ['3ece3c6f-4934-4054-8f70-b7eed1dfe7c2/1c21f9d0-4dfe-42c6-979a-a7682324140b.png', '50% 50%'],
    paddy: ['027205ec-38d3-4b68-87b2-8af1fc1b2bfe/IMG_5893.png', '50% 50%'],
    andrew: ['5a74b1f4-88b4-4ac1-b385-dc9f339e8bc5/The+Waterfront+Hall+on+Friday+night+supporting+Bonnie+Tyler.+Surreal+experience+to+say+the+least.jpg', '50% 50%']
  };
  var ORDER_SLUGS = Object.keys(LIST_PHOTOS);

  function render(D) {
    var L = D.eventLabels || {}, ORDER = ['ceremony', 'day2', 'afterdinner'];
    // <div id="musicians-list" data-event="ceremony"> shows only the musicians who play that part of the day
    var only = root.getAttribute('data-event') || '';
    if (only) root.classList.add('ml-light');
    // "ceremonyList" in musicians.json is the hand-picked list for the ceremony page; without it, everyone tagged for that event shows
    var picked = only && D[only + 'List'];
    var list = D.musicians.filter(function (o) { return o.live && o.url && o.listed !== false && o.photo && o.events && (!only || (picked ? picked.indexOf(o.slug) !== -1 : o.events.indexOf(only) !== -1)); });
    var rank = function (o) { var i = ORDER_SLUGS.indexOf(o.slug); return i === -1 ? 999 : i; };
    list.sort(function (a, b) { return picked ? picked.indexOf(a.slug) - picked.indexOf(b.slug) : rank(a) - rank(b); });
    var size = 500;  // card-sized photos (about 1.4MB for the whole page, instead of 8MB+)
    var filters = [['all', 'All musicians'], ['ceremony', L.ceremony || 'Ceremony & drinks reception'], ['day2', L.day2 || 'Day 2'], ['afterdinner', L.afterdinner || 'After dinner'], ['duo', 'Duo'], ['tradBand', 'Trad band']];
    if (only) filters = [['all', 'All musicians'], ['day2', 'Also plays ' + (L.day2 || 'Day 2')], ['afterdinner', 'Also plays ' + (L.afterdinner || 'after dinner').toLowerCase()], ['duo', 'Duo']];
    else filters[0][1] = 'All';
    var h = '<div class="ml-wrap"><div class="ml-top"><p class="ml-eye">' + (only === 'ceremony' ? 'Ceremony &amp; drinks reception' : 'Solo musicians') + '</p><h1>' + (only === 'ceremony' ? 'Ceremony &amp; drinks reception musicians' : 'Solo musicians') + '</h1>'
      + '<p class="ml-intro">' + (only === 'ceremony'
        ? 'Live music for walking down the aisle, signing the register and the drinks reception afterwards. Tap a musician to see their videos and check their availability.'
        : 'Hand-picked singer-guitarists across Ireland. Tap a musician to see their videos and check their availability.') + '</p>'
      + '<div class="ml-chips">' + filters.map(function (f, i) { return '<button type="button" class="ml-chip' + (i ? '' : ' on') + '" data-f="' + f[0] + '">' + esc(f[1]) + '</button>'; }).join('') + '</div></div><div class="ml-main"><div class="ml-grid">';
    list.forEach(function (o, i) {
      var lp = LIST_PHOTOS[o.slug];
      var ev = ORDER.filter(function (e) { return o.events.indexOf(e) !== -1; });
      var tags = ev.filter(function (e) { return e !== only; }).map(function (e) { return e === 'ceremony' ? 'Ceremony' : (L[e] || e); }).concat(o.duo ? ['Duo'] : []).concat(o.tradBand ? ['Trad band'] : []);
      if (only && !tags.length) tags = [only === 'ceremony' ? 'Ceremony & drinks reception' : (L[only] || only)];
      h += '<a class="ml-card" href="' + esc(o.url + (only ? '?for=' + only : '')) + '" data-tags="' + esc(ev.concat(o.duo ? ['duo'] : []).concat(o.tradBand ? ['tradBand'] : []).join(' ')) + '">'
        + '<div class="ml-img"><img src="' + esc((function (p) { return /^https?:/.test(p) ? p : D.imageBase + p + '?format=' + size + 'w'; })(lp ? lp[0] : (o.cardPhoto || o.photo))) + '" alt="' + esc(o.hideName ? 'Wedding musician' : o.name) + '" loading="' + (i < 4 ? 'eager' : 'lazy') + '" decoding="async"'
        + ' style="object-position:' + esc(lp ? lp[1] : (o.cardPosition || o.photoPosition || 'center')) + '">' + (o.hideName ? '' : '<span class="ml-name">' + esc(o.name) + '</span>') + '</div>'
        + '<div class="ml-foot"><span class="ml-tags">' + esc(tags.join(' · ')) + '</span><span class="ml-more">' + (only ? 'View profile →' : 'View →') + '</span></div></a>';
    });
    h += '</div><div class="ml-cta"><div><strong>Can\'t decide?</strong><span>Build your package, pick a few favourites, and we\'ll check who\'s free on your date.</span></div><a class="ml-btn" href="/packages">Build your package</a></div></div></div>';
    root.innerHTML = h;

    Array.prototype.forEach.call(root.querySelectorAll('.ml-chip'), function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-f');
        Array.prototype.forEach.call(root.querySelectorAll('.ml-chip'), function (x) { x.classList.toggle('on', x === c); });
        Array.prototype.forEach.call(root.querySelectorAll('.ml-card'), function (card) {
          card.hidden = f !== 'all' && (' ' + card.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') === -1;
        });
      });
    });
  }

  (window.WD2_MUSICIANS ? Promise.resolve(window.WD2_MUSICIANS) : fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }))
    .then(render)
    .catch(function () { root.innerHTML = '<p style="padding:30px">Musicians could not be loaded. Please refresh the page.</p>'; });
})();
