/* Wedding Day 2 Google reviews bubble
   A small glass bubble in the bottom-right corner showing the Google star rating.
   Tapping it opens the latest Google reviews (Google gives up to 5), read live from Google.
   Install on a page: Page settings > Advanced > Page Header Code Injection, paste:
     <script>fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/google-reviews.js?t='+Date.now(),{cache:'no-cache'}).then(function(r){return r.text()}).then(function(t){var s=document.createElement('script');s.textContent=t;document.body.appendChild(s)});</script>
   If anything goes wrong the bubble simply doesn't appear, so the page never shows an error. */
(function () {
  /* ============ EDIT HERE ============ */
  var API_KEY = 'AIzaSyD_i-JeysktYe865E8WFSPkSu44CYM6tw8';  // Google API key (locked to weddingday2.ie in Google Cloud)
  var PLACE_ID = 'ChIJqQfHC0SjigYRKmnqMHmIOZQ';  // Wedding Day 2 on Google
  var MIN_STARS = 4;                              // only show reviews with at least this many stars
  var TITLE = 'What people are saying';
  /* =================================== */

  function start() {
    if (window.wd2ReviewsStarted) return;
    window.wd2ReviewsStarted = true;

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
        h += '<span class="grb-star"><span class="grb-star-on" style="width:' + Math.round(fill * 100) + '%">' + STAR + '</span>' + STAR + '</span>';
      }
      return '<span class="grb-stars" role="img" aria-label="' + (Math.round(n * 10) / 10) + ' out of 5 stars">' + h + '</span>';
    }
    var GLOGO = '<svg class="grb-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

    var css = document.createElement('style');
    css.textContent = [
      '.grb{--grb-ink:#eae6dd;--grb-muted:#b8b3a8;--grb-accent:#3dc2bb;--grb-star:#f4c150;font-family:"Bitter",Georgia,serif}',
      '.grb *{box-sizing:border-box}',
      '.grb-stars{display:inline-flex;gap:2px;vertical-align:middle}',
      '.grb-star{position:relative;display:inline-block;width:15px;height:15px}',
      '.grb-star svg{width:15px;height:15px;display:block;fill:rgba(234,230,221,.25)}',
      '.grb-star-on{position:absolute;inset:0 auto 0 0;overflow:hidden}',
      '.grb-star-on svg{fill:var(--grb-star)}',
      '.grb-g{width:18px;height:18px;flex:none}','.grb-btn .grb-g{width:21px;height:21px}','.grb-btn .grb-star,.grb-btn .grb-star svg{width:17px;height:17px}',
      /* the bubble */
      '.grb-btn{position:fixed;right:18px;bottom:18px;z-index:9997;display:inline-flex;align-items:center;gap:9px;padding:11px 17px 11px 13px;border-radius:999px;cursor:pointer;color:var(--grb-ink);font:600 17px "Bitter",Georgia,serif;',
      'background:rgba(31,39,39,.62);-webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);border:1px solid rgba(234,230,221,.28);box-shadow:0 8px 24px rgba(0,0,0,.35);',
      'opacity:0;transform:translateY(12px);transition:opacity .35s,transform .35s,box-shadow .2s}',
      '.grb-btn.grb-in{opacity:1;transform:none}',
      '.grb-btn:hover{box-shadow:0 0 0 2px var(--grb-accent),0 10px 26px rgba(0,0,0,.35)}',
      '.grb-btn b{font-weight:600}',
      '.grb-open .grb-btn{opacity:0;pointer-events:none}',
      /* the panel */
      '.grb-panel{position:fixed;right:16px;bottom:16px;z-index:9998;width:min(380px,calc(100vw - 24px));max-height:min(620px,calc(100vh - 40px));max-height:min(620px,calc(100dvh - 40px));display:flex;flex-direction:column;border-radius:18px;overflow:hidden;color:var(--grb-ink);',
      'background:rgba(31,39,39,.8);-webkit-backdrop-filter:blur(18px) saturate(140%);backdrop-filter:blur(18px) saturate(140%);border:1px solid rgba(234,230,221,.24);box-shadow:0 18px 50px rgba(0,0,0,.5);',
      'transform-origin:bottom right;transform:scale(.6);opacity:0;pointer-events:none;transition:transform .28s cubic-bezier(.2,.9,.3,1.2),opacity .2s}',
      '.grb-open .grb-panel{transform:none;opacity:1;pointer-events:auto}',
      '.grb-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 16px 12px;border-bottom:1px solid rgba(234,230,221,.14)}',
      '.grb-head h2{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:21px;line-height:1.2;margin:0 0 6px;color:var(--grb-ink)}',
      '.grb-score{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--grb-muted)}',
      '.grb-score b{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:20px;color:var(--grb-ink)}',
      '.grb-x{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:rgba(234,230,221,.12);color:var(--grb-ink);font-size:15px;cursor:pointer}',
      '.grb-x:hover{background:var(--grb-accent);color:#1f2727}',
      '.grb-list{overflow-y:auto;overscroll-behavior:contain;padding:12px 16px;display:grid;gap:10px}',
      '.grb-card{background:rgba(234,230,221,.07);border:1px solid rgba(234,230,221,.14);border-radius:12px;padding:12px 13px;display:grid;gap:7px}',
      '.grb-who{display:flex;align-items:center;gap:9px;min-width:0}',
      '.grb-av{flex:none;width:32px;height:32px;border-radius:50%;object-fit:cover;background:#364242;display:grid;place-items:center;font-weight:600;font-size:14px;color:var(--grb-accent)}',
      '.grb-name{display:block;font-weight:600;font-size:14px;color:var(--grb-ink);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      'a.grb-name:hover{color:var(--grb-accent)}',
      '.grb-when{font-size:12px;color:var(--grb-muted)}',
      '.grb-text{font-size:14px;line-height:1.55;margin:0;white-space:pre-line;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:5;overflow:hidden}',
      '.grb-card.grb-full .grb-text{-webkit-line-clamp:unset;display:block}',
      '.grb-more{justify-self:start;background:none;border:0;padding:0;font:600 13px "Bitter",Georgia,serif;color:var(--grb-accent);cursor:pointer;text-decoration:underline}',
      '.grb-foot{padding:12px 16px 14px;border-top:1px solid rgba(234,230,221,.14);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px}',
      '.grb-btns{display:flex;gap:8px}',
      '.grb-link{display:inline-flex;padding:8px 14px;border-radius:999px;font:600 13px "Bitter",Georgia,serif;text-decoration:none!important;border:1.5px solid var(--grb-accent);color:var(--grb-accent)}',
      '.grb-link:hover,.grb-link.grb-solid{background:var(--grb-accent);color:#1f2727}',
      '.grb-link.grb-solid:hover{background:transparent;color:var(--grb-accent)}',
      '.grb-from{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:var(--grb-muted)}',
      '.grb-from .grb-g{width:14px;height:14px}',
      /* phones: sit above the sticky "Check availability" bars */
      '@media (max-width:1000px){.grb-btn{top:var(--grb-top,84px);bottom:auto;right:12px;padding:7px 12px 7px 10px;font-size:14px;transform:translateY(-10px);transition:opacity .35s,transform .35s,top .2s}'+'.grb-btn .grb-g{width:18px;height:18px}.grb-btn .grb-star,.grb-btn .grb-star svg{width:14px;height:14px}'+'.grb-panel{top:var(--grb-top,84px);bottom:auto;right:12px;transform-origin:top right;max-height:calc(100vh - var(--grb-top,84px) - 16px);max-height:calc(100dvh - var(--grb-top,84px) - 16px)}}',
      '@media (prefers-reduced-motion:reduce){.grb-btn,.grb-panel{transition:none}}'
    ].join('');
    document.head.appendChild(css);

    function fail(e) { console.warn('[WD2 reviews]', e && (e.message || e)); }

    function build(p) {
      var revs = (p.reviews || []).filter(function (r) { return (r.rating || 0) >= MIN_STARS && r.text; })
        .sort(function (a, b) { return (b.rating || 0) - (a.rating || 0) || (b.text.length - a.text.length); }).slice(0, 5);
      if (!p.rating || !revs.length) return;
      var url = p.googleMapsURI || 'https://www.google.com/maps/place/?q=place_id:' + encodeURIComponent(PLACE_ID);
      var write = 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(PLACE_ID);
      var rating = p.rating.toFixed(1);

      var wrap = document.createElement('div');
      wrap.className = 'grb';
      wrap.innerHTML = '<button type="button" class="grb-btn" aria-haspopup="dialog" aria-expanded="false">' + GLOGO + '<b>' + rating + '</b>' + stars(p.rating) + '</button>'
        + '<div class="grb-panel" role="dialog" aria-label="Google reviews" aria-hidden="true">'
        + '<div class="grb-head"><div><h2>' + esc(TITLE) + '</h2><div class="grb-score"><b>' + rating + '</b>' + stars(p.rating) + '<span>on Google</span></div></div>'
        + '<button type="button" class="grb-x" aria-label="Close reviews">✕</button></div>'
        + '<div class="grb-list">' + revs.map(function (r) {
            var a = r.authorAttribution || {}, name = a.displayName || 'Google user';
            var av = a.photoURI ? '<img class="grb-av" src="' + esc(a.photoURI) + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
              : '<span class="grb-av">' + esc(name.charAt(0).toUpperCase()) + '</span>';
            var nm = a.uri ? '<a class="grb-name" href="' + esc(a.uri) + '" target="_blank" rel="noopener">' + esc(name) + '</a>' : '<span class="grb-name">' + esc(name) + '</span>';
            return '<article class="grb-card"><div class="grb-who">' + av + '<div style="min-width:0">' + nm
              + '<span class="grb-when">' + esc(r.relativePublishTimeDescription || '') + '</span></div></div>'
              + stars(r.rating || 0) + '<p class="grb-text">' + esc(r.text) + '</p><button type="button" class="grb-more" hidden>Read more</button></article>';
          }).join('') + '</div>'
        + '<div class="grb-foot"><div class="grb-btns"><a class="grb-link" href="' + esc(url) + '" target="_blank" rel="noopener">See all</a>'
        + '<a class="grb-link grb-solid" href="' + esc(write) + '" target="_blank" rel="noopener">Leave a review</a></div>'
        + '<span class="grb-from">' + GLOGO + 'Reviews from Google</span></div></div>';
      document.body.appendChild(wrap);

      var btn = wrap.querySelector('.grb-btn'), panel = wrap.querySelector('.grb-panel'), x = wrap.querySelector('.grb-x'), measured = false;
      function open() {
        wrap.classList.add('grb-open'); btn.setAttribute('aria-expanded', 'true'); panel.setAttribute('aria-hidden', 'false');
        if (!measured) {
          measured = true;
          Array.prototype.forEach.call(wrap.querySelectorAll('.grb-card'), function (c) {
            var t = c.querySelector('.grb-text'), b = c.querySelector('.grb-more');
            if (t.scrollHeight > t.clientHeight + 4) b.hidden = false;
            b.addEventListener('click', function () { var o = c.classList.toggle('grb-full'); b.textContent = o ? 'Show less' : 'Read more'; });
          });
        }
        setTimeout(function () { x.focus(); }, 60);
      }
      function close() {
        wrap.classList.remove('grb-open'); btn.setAttribute('aria-expanded', 'false'); panel.setAttribute('aria-hidden', 'true'); btn.focus();
      }
      btn.addEventListener('click', open);
      x.addEventListener('click', close);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.classList.contains('grb-open')) close(); });
      document.addEventListener('click', function (e) { if (wrap.classList.contains('grb-open') && !wrap.contains(e.target)) close(); });
      // Phones: sit just under the site header (menu button), and stay in the top corner as you scroll
      var hdr = document.querySelector('#header') || document.querySelector('header'), ticking = false;
      function place() {
        ticking = false;
        if (window.innerWidth > 1000) return;
        var b = hdr ? hdr.getBoundingClientRect().bottom : 0;
        wrap.style.setProperty('--grb-top', Math.max(12, Math.round(b + 8)) + 'px');
      }
      function queue() { if (!ticking) { ticking = true; requestAnimationFrame(place); } }
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
      place();
      requestAnimationFrame(function () { setTimeout(function () { btn.classList.add('grb-in'); }, 400); });
    }

    function run() {
      google.maps.importLibrary('places').then(function (lib) {
        var p = new lib.Place({ id: PLACE_ID });
        return p.fetchFields({ fields: ['rating', 'reviews', 'googleMapsURI'] }).then(function () { build(p); });
      }).catch(fail);
    }
    if (window.google && google.maps && google.maps.importLibrary) run();
    else {
      window.wd2ReviewsReady = run;
      var s = document.createElement('script');
      s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(API_KEY) + '&v=weekly&loading=async&callback=wd2ReviewsReady';
      s.async = true; s.onerror = function () { fail('Could not load Google Maps'); };
      document.head.appendChild(s);
    }
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
