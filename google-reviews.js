/* Wedding Day 2 Google reviews
   Shows the business's star rating, review count and latest Google reviews, read live from Google.
   Squarespace Code block:
     <div id="wd2-reviews"></div><script>fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/google-reviews.js?t='+Date.now(),{cache:'no-cache'}).then(function(r){return r.text()}).then(function(t){var s=document.createElement('script');s.textContent=t;document.body.appendChild(s)});</script>
   Google gives up to 5 reviews this way. If anything goes wrong the block hides itself, so the page never shows an error. */
(function () {
  /* ============ EDIT HERE ============ */
  var API_KEY = 'AIzaSyD_i-JeysktYe865E8WFSPkSu44CYM6tw8';  // Google API key (locked to weddingday2.ie in Google Cloud)
  var PLACE_ID = 'ChIJqQfHC0SjigYRKmnqMHmIOZQ';  // Wedding Day 2 on Google. Leave empty to look the business up by name:
  var SEARCH = 'Wedding Day 2 Ireland';   // used only when PLACE_ID is empty
  var MIN_STARS = 4;                      // only show reviews with at least this many stars
  var TITLE = 'What couples say';
  /* =================================== */

  var root = document.getElementById('wd2-reviews');
  if (!root || root.getAttribute('data-ready')) return;
  root.setAttribute('data-ready', '1');
  if (!API_KEY) { root.style.display = 'none'; console.warn('[WD2 reviews] No API key set'); return; }

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
  var STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z"/></svg>';
  function stars(n) {
    var h = '';
    for (var i = 1; i <= 5; i++) {
      var fill = Math.max(0, Math.min(1, n - i + 1));
      h += '<span class="gr-star"><span class="gr-star-on" style="width:' + Math.round(fill * 100) + '%">' + STAR + '</span>' + STAR + '</span>';
    }
    return '<span class="gr-stars" role="img" aria-label="' + (Math.round(n * 10) / 10) + ' out of 5 stars">' + h + '</span>';
  }

  var css = document.createElement('style');
  css.textContent = [
    '#wd2-reviews{--gr-bg:#1f2727;--gr-card:#283232;--gr-line:#364242;--gr-ink:#eae6dd;--gr-muted:#b8b3a8;--gr-accent:#3dc2bb;--gr-star:#f4c150;',
    'font-family:"Bitter",Georgia,serif;color:var(--gr-ink);background:var(--gr-bg);padding:8px clamp(12px,2.5vw,32px) 40px;box-sizing:border-box}',
    '#wd2-reviews *{box-sizing:border-box}',
    '#wd2-reviews .gr-in{max-width:1200px;margin:0 auto}',
    '#wd2-reviews .gr-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 24px;margin:0 0 22px}',
    '#wd2-reviews h2{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:clamp(26px,3.4vw,38px);line-height:1.15;margin:0 0 8px;color:var(--gr-ink)}',
    '#wd2-reviews .gr-score{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:15px;color:var(--gr-muted)}',
    '#wd2-reviews .gr-score b{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:30px;line-height:1;color:var(--gr-ink)}',
    '#wd2-reviews .gr-stars{display:inline-flex;gap:2px;vertical-align:middle}',
    '#wd2-reviews .gr-star{position:relative;display:inline-block;width:18px;height:18px}',
    '#wd2-reviews .gr-star svg{width:18px;height:18px;display:block;fill:rgba(234,230,221,.22)}',
    '#wd2-reviews .gr-star-on{position:absolute;inset:0 auto 0 0;overflow:hidden}',
    '#wd2-reviews .gr-star-on svg{fill:var(--gr-star)}',
    '#wd2-reviews .gr-g{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--gr-muted)}',
    '#wd2-reviews .gr-g svg{width:16px;height:16px}',
    '#wd2-reviews .gr-btns{display:flex;gap:10px;flex-wrap:wrap}',
    '#wd2-reviews .gr-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:999px;font:600 14px "Bitter",Georgia,serif;text-decoration:none!important;border:1.5px solid var(--gr-accent);color:var(--gr-accent);background:transparent;transition:background .2s,color .2s}',
    '#wd2-reviews .gr-btn:hover,#wd2-reviews .gr-btn.gr-solid{background:var(--gr-accent);color:#1f2727}',
    '#wd2-reviews .gr-btn.gr-solid:hover{background:transparent;color:var(--gr-accent)}',
    '#wd2-reviews .gr-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}',
    '#wd2-reviews .gr-card{background:var(--gr-card);border:1px solid var(--gr-line);border-radius:14px;padding:18px 18px 16px;display:flex;flex-direction:column;gap:10px;min-width:0}',
    '#wd2-reviews .gr-who{display:flex;align-items:center;gap:10px;min-width:0}',
    '#wd2-reviews .gr-av{flex:none;width:40px;height:40px;border-radius:50%;object-fit:cover;background:#364242;display:grid;place-items:center;font-weight:600;color:var(--gr-accent)}',
    '#wd2-reviews .gr-name{font-weight:600;font-size:15px;color:var(--gr-ink);text-decoration:none;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '#wd2-reviews a.gr-name:hover{color:var(--gr-accent)}',
    '#wd2-reviews .gr-when{font-size:12.5px;color:var(--gr-muted)}',
    '#wd2-reviews .gr-text{font-size:15px;line-height:1.6;color:var(--gr-ink);margin:0;white-space:pre-line;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:6;overflow:hidden}',
    '#wd2-reviews .gr-card.gr-open .gr-text{-webkit-line-clamp:unset;display:block}',
    '#wd2-reviews .gr-more{align-self:flex-start;background:none;border:0;padding:0;font:600 13px "Bitter",Georgia,serif;color:var(--gr-accent);cursor:pointer;text-decoration:underline}',
    '#wd2-reviews .gr-foot{margin-top:14px;font-size:12px;color:var(--gr-muted);text-align:right}',
    '@media (max-width:700px){',
    '#wd2-reviews .gr-list{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;margin:0 calc(-1 * clamp(12px,2.5vw,32px));padding:0 clamp(12px,2.5vw,32px) 8px;scrollbar-width:none}',
    '#wd2-reviews .gr-list::-webkit-scrollbar{display:none}',
    '#wd2-reviews .gr-card{flex:0 0 86%;scroll-snap-align:center}',
    '#wd2-reviews .gr-btn{padding:9px 15px;font-size:13px}',
    '}'
  ].join('');
  document.head.appendChild(css);

  var GLOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

  function show(p) {
    var revs = (p.reviews || []).filter(function (r) { return (r.rating || 0) >= MIN_STARS && r.text; });
    if (!p.rating && !revs.length) { root.style.display = 'none'; return; }
    var url = p.googleMapsURI || ('https://www.google.com/maps/place/?q=place_id:' + encodeURIComponent(p.id || PLACE_ID));
    var write = p.id ? 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(p.id) : url;
    var h = '<div class="gr-in"><div class="gr-head"><div><h2>' + esc(TITLE) + '</h2>';
    if (p.rating) h += '<div class="gr-score"><b>' + p.rating.toFixed(1) + '</b>' + stars(p.rating)
      + '<span>' + (p.userRatingCount ? esc(p.userRatingCount) + ' Google review' + (p.userRatingCount === 1 ? '' : 's') : 'on Google') + '</span></div>';
    h += '</div><div class="gr-btns"><a class="gr-btn" href="' + esc(url) + '" target="_blank" rel="noopener">See all reviews</a>'
      + '<a class="gr-btn gr-solid" href="' + esc(write) + '" target="_blank" rel="noopener">Leave a review</a></div></div>';
    h += '<div class="gr-list">' + revs.map(function (r) {
      var a = r.authorAttribution || {}, name = a.displayName || 'Google user';
      var av = a.photoURI ? '<img class="gr-av" src="' + esc(a.photoURI) + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
        : '<span class="gr-av">' + esc(name.charAt(0).toUpperCase()) + '</span>';
      var nm = a.uri ? '<a class="gr-name" href="' + esc(a.uri) + '" target="_blank" rel="noopener">' + esc(name) + '</a>' : '<span class="gr-name">' + esc(name) + '</span>';
      return '<article class="gr-card"><div class="gr-who">' + av + '<div style="min-width:0">' + nm
        + '<span class="gr-when">' + esc(r.relativePublishTimeDescription || '') + '</span></div></div>'
        + stars(r.rating || 0) + '<p class="gr-text">' + esc(r.text) + '</p><button type="button" class="gr-more" hidden>Read more</button></article>';
    }).join('') + '</div><div class="gr-foot"><span class="gr-g">' + GLOGO + 'Reviews from Google</span></div></div>';
    root.innerHTML = h;
    Array.prototype.forEach.call(root.querySelectorAll('.gr-card'), function (c) {
      var t = c.querySelector('.gr-text'), b = c.querySelector('.gr-more');
      if (t.scrollHeight > t.clientHeight + 4) b.hidden = false;
      b.addEventListener('click', function () { var o = c.classList.toggle('gr-open'); b.textContent = o ? 'Show less' : 'Read more'; });
    });
  }

  function fail(e) { root.style.display = 'none'; console.warn('[WD2 reviews]', e && (e.message || e)); }

  function run() {
    google.maps.importLibrary('places').then(function (lib) {
      var Place = lib.Place, FIELDS = ['id', 'displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsURI'];
      var getId = PLACE_ID ? Promise.resolve(PLACE_ID)
        : Place.searchByText({ textQuery: SEARCH, fields: ['id'], maxResultCount: 1 }).then(function (r) {
            if (!r.places || !r.places.length) throw new Error('Business not found for "' + SEARCH + '"');
            console.info('[WD2 reviews] Place ID: ' + r.places[0].id + ' (put this in PLACE_ID)');
            return r.places[0].id;
          });
      return getId.then(function (id) {
        var p = new Place({ id: id });
        return p.fetchFields({ fields: FIELDS }).then(function () { show(p); });
      });
    }).catch(fail);
  }

  // Load Google's Maps library once (it may already be on the page)
  if (window.google && google.maps && google.maps.importLibrary) run();
  else {
    window.wd2ReviewsReady = run;
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(API_KEY) + '&v=weekly&loading=async&callback=wd2ReviewsReady';
    s.async = true; s.onerror = function () { fail('Could not load Google Maps'); };
    document.head.appendChild(s);
  }
})();
