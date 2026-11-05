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
    f.href = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Bitter:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }
  var st = document.createElement('style');
  st.textContent = [
    '#musicians-list{--c-bg:#273030;--c-surface:#303b3b;--c-line:#3f4b4b;--c-ink:#eae6dd;--c-muted:#b8b3a8;--c-cyan:#3dc2bb;background:var(--c-bg);color:var(--c-ink);font-family:"Bitter",Georgia,serif;padding:48px clamp(16px,4vw,56px) 64px}',
    '#musicians-list *{box-sizing:border-box}',
    '#musicians-list .ml-wrap{max-width:1240px;margin:0 auto}',
    '#musicians-list .ml-eye{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--c-cyan);margin:0 0 8px}',
    '#musicians-list h1{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:clamp(30px,4.4vw,48px);line-height:1.08;margin:0 0 10px;color:var(--c-ink)}',
    '#musicians-list .ml-intro{font-size:16px;line-height:1.6;color:var(--c-muted);margin:0 0 22px;max-width:680px}',
    '#musicians-list .ml-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 26px}',
    '#musicians-list .ml-chip{font:inherit;font-size:14px;cursor:pointer;padding:8px 16px;border-radius:999px;border:1.5px solid var(--c-cyan);background:transparent;color:var(--c-cyan);transition:background .2s,color .2s}',
    '#musicians-list .ml-chip:hover{background:rgba(61,194,187,.15)}',
    '#musicians-list .ml-chip.on{background:var(--c-cyan);color:#273030}',
    '#musicians-list .ml-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:26px 18px}',
    '#musicians-list .ml-card,#musicians-list .ml-card.wd2-hover,#musicians-list .ml-card.wd2-hover:hover{display:grid;gap:8px;text-decoration:none!important;color:var(--c-ink)!important;box-shadow:none!important;transform:none!important;border-radius:0!important;overflow:visible!important}',
    '#musicians-list .ml-card[hidden]{display:none}',
    '#musicians-list .ml-img{position:relative;aspect-ratio:3/4;border-radius:16px;overflow:hidden;background:var(--c-line);transition:box-shadow .25s}',
    '#musicians-list .ml-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}',
    '#musicians-list .ml-img:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,26,26,0) 55%,rgba(20,26,26,.75) 100%)}',
    '#musicians-list .ml-card:hover .ml-img{box-shadow:0 0 0 3px var(--c-cyan),0 12px 30px rgba(0,0,0,.35)}',
    '#musicians-list .ml-card:hover .ml-img img{transform:scale(1.04)}',
    '#musicians-list .ml-name{position:absolute;left:14px;bottom:11px;z-index:1;font-family:"Young Serif",Georgia,serif;font-size:24px;color:#eae6dd}',
    '#musicians-list .ml-tags{position:absolute;top:9px;left:9px;right:9px;z-index:1;display:flex;flex-wrap:wrap;gap:4px}',
    '#musicians-list .ml-tag{font-size:10.5px;line-height:1;padding:4px 7px;border-radius:999px;color:#eae6dd;background:rgba(39,48,48,.35);-webkit-backdrop-filter:blur(8px) saturate(140%);backdrop-filter:blur(8px) saturate(140%);border:1px solid rgba(234,230,221,.3)}',
    '#musicians-list .ml-more{font-size:13.5px;color:var(--c-cyan)}',
    '#musicians-list .ml-cta{margin-top:40px;padding:22px 24px;border-radius:18px;border:1px solid var(--c-line);background:#1d2525;display:flex;flex-wrap:wrap;gap:14px 20px;align-items:center;justify-content:space-between}',
    '#musicians-list .ml-cta strong{display:block;font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:22px;margin-bottom:4px}',
    '#musicians-list .ml-cta span{color:var(--c-muted);font-size:14.5px}',
    '#musicians-list .ml-btn{display:inline-block;text-decoration:none!important;padding:12px 24px;border-radius:999px;font-weight:600;font-size:15px;background:var(--c-cyan);color:#273030!important;white-space:nowrap}',
    '@media (max-width:1000px){#musicians-list .ml-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}',
    '@media (max-width:700px){#musicians-list{padding-top:30px}#musicians-list .ml-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}#musicians-list .ml-name{font-size:19px;left:11px;bottom:9px}#musicians-list .ml-tag{font-size:9.5px;padding:3px 6px}#musicians-list .ml-tags{top:7px;left:7px;right:7px;gap:3px}#musicians-list .ml-intro{font-size:14.5px}#musicians-list .ml-chip{font-size:13px;padding:7px 13px}}'
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
    var list = D.musicians.filter(function (o) { return o.live && o.url && o.listed !== false && o.photo && o.events; });
    var rank = function (o) { var i = ORDER_SLUGS.indexOf(o.slug); return i === -1 ? 999 : i; };
    list.sort(function (a, b) { return rank(a) - rank(b); });
    var size = 500;  // card-sized photos (about 1.4MB for the whole page, instead of 8MB+)
    var filters = [['all', 'All musicians'], ['ceremony', L.ceremony || 'Ceremony & drinks reception'], ['day2', L.day2 || 'Day 2'], ['afterdinner', L.afterdinner || 'After dinner'], ['duo', 'Duo'], ['tradBand', 'Trad band']];
    var h = '<div class="ml-wrap"><p class="ml-eye">Wedding Day 2</p><h1>Our musicians</h1>'
      + '<p class="ml-intro">Hand-picked singer-guitarists who know how to fill a dance floor. Tap a musician to see their videos and check their availability. Solo musicians start from €650.</p>'
      + '<div class="ml-chips">' + filters.map(function (f, i) { return '<button type="button" class="ml-chip' + (i ? '' : ' on') + '" data-f="' + f[0] + '">' + esc(f[1]) + '</button>'; }).join('') + '</div><div class="ml-grid">';
    list.forEach(function (o, i) {
      var lp = LIST_PHOTOS[o.slug];
      var ev = ORDER.filter(function (e) { return o.events.indexOf(e) !== -1; });
      var tags = ev.map(function (e) { return e === 'ceremony' ? 'Ceremony' : (L[e] || e); }).concat(o.duo ? ['Duo'] : []).concat(o.tradBand ? ['Trad band'] : []);
      h += '<a class="ml-card" href="' + esc(o.url) + '" data-tags="' + esc(ev.concat(o.duo ? ['duo'] : []).concat(o.tradBand ? ['tradBand'] : []).join(' ')) + '">'
        + '<div class="ml-img"><img src="' + esc(D.imageBase + (lp ? lp[0] : o.photo) + '?format=' + size + 'w') + '" alt="' + esc(o.name) + '" loading="' + (i < 4 ? 'eager' : 'lazy') + '" decoding="async"'
        + ' style="object-position:' + esc(lp ? lp[1] : (o.cardPosition || o.photoPosition || 'center')) + '"><span class="ml-tags">' + tags.map(function (t) { return '<span class="ml-tag">' + esc(t) + '</span>'; }).join('') + '</span>' + (o.hideName ? '' : '<span class="ml-name">' + esc(o.name) + '</span>') + '</div>'
        + '<span class="ml-more">View profile →</span></a>';
    });
    h += '</div><div class="ml-cta"><div><strong>Can\'t decide?</strong><span>Build your package, pick a few favourites, and we\'ll check who\'s free on your date.</span></div><a class="ml-btn" href="/packages">Build your package</a></div></div>';
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
