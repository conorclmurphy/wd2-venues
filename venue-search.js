/* Wedding Day 2 venue search
   Usage in the Squarespace Code block on the Venues page:
     <div id="wd2-venues-root"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venue-search.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Venues come from venues.json (the same file the venue pages use), so a venue
   added or changed there shows up here automatically. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venues.json';
  // Small Wedding Day 2 heart logo shown in the corner of each venue photo
  var WD2_MARK_TAG = '<img class="wdvs-mark" src="data:image/png;base64,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" alt="" aria-hidden="true">';
  var WATERMARK_LOGO_URL = 'https://images.squarespace-cdn.com/content/v1/68e3e2b74d7ab5214f499b88/d0f816a6-5802-418f-bd11-37ddd18df645/logo2027transparent.png?format=500w';

  var root = document.getElementById('wd2-venues-root');
  if (!root) return;

  // Tapping a venue shows the blue ring for a moment before the venue page opens (phones have no hover)
  root.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('a.wdvs-card.wdvs-live');
    if (!card || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || card.target === '_blank') return;
    e.preventDefault();
    card.classList.add('wdvs-tap');
    setTimeout(function () { location.href = card.href; }, 180);
  });
  window.addEventListener('pageshow', function () {
    Array.prototype.forEach.call(root.querySelectorAll('.wdvs-tap'), function (c) { c.classList.remove('wdvs-tap'); });
  });

  // Paint the whole page section black so the search runs right up to the top, with no patterned strip above it
  var sec = root.closest('section');
  if (sec) {
    sec.style.backgroundColor = '#000';
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = '#000'; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  }

  if (!document.getElementById('wdvs-search-fonts')) {
    var f = document.createElement('link');
    f.id = 'wdvs-search-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Jost:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }

  var css = '\
#wd2-venues-root{--ink:#f1ede2;--cream:#000000;--card:#191919;--sage:#3dc2bb;--sage-dark:#8adcd7;--brass:#ffffff;--rose:#d9a394;--line:#2e2e2e;--radius:14px;\
font-family:"Jost","Work Sans",-apple-system,BlinkMacSystemFont,sans-serif;color:var(--ink);background:var(--cream);padding:10px clamp(12px,2.5vw,32px) 56px;box-sizing:border-box;position:relative;overflow:hidden;border:0;border-radius:0}\
#wd2-venues-root .wdvs-watermark{position:absolute;top:50%;left:50%;width:min(1100px,140vw);transform:translate(-50%,-50%);opacity:.05;filter:brightness(0) invert(1);pointer-events:none;z-index:0;user-select:none}\
#wd2-venues-root>.wdvs-head,#wd2-venues-root>.wdvs-filters,#wd2-venues-root>.wdvs-reset,#wd2-venues-root>.wdvs-count,#wd2-venues-root>.wdvs-grid,#wd2-venues-root>.wdvs-empty{position:relative;z-index:1}\
#wd2-venues-root *,#wd2-venues-root *::before,#wd2-venues-root *::after{box-sizing:border-box}\
#wd2-venues-root .wdvs-head{max-width:1600px;margin:0 auto 18px;text-align:center}\
#wd2-venues-root .wdvs-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);font-weight:600;margin-bottom:8px}\
#wd2-venues-root .wdvs-title{font-family:"Fraunces",serif;font-optical-sizing:auto;font-weight:500;font-size:clamp(28px,4vw,42px);margin:0 0 8px;color:var(--sage-dark)}\
#wd2-venues-root .wdvs-sub{font-size:15px;color:#b7b2a1;margin:0}\
#wd2-venues-root .wdvs-filters{max-width:1600px;margin:0 auto 30px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:20px 22px;display:grid;gap:16px;grid-template-columns:1.3fr 1fr 1fr}\
@media (max-width:720px){#wd2-venues-root .wdvs-filters{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px 12px;padding:16px}#wd2-venues-root .wdvs-filters>.wdvs-field:nth-child(n+3){grid-column:1 / -1}#wd2-venues-root .wdvs-field input[type="text"],#wd2-venues-root .wdvs-field select{min-width:0;text-overflow:ellipsis}}\
#wd2-venues-root .wdvs-field label{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--sage-dark);margin-bottom:7px}\
#wd2-venues-root .wdvs-field input[type="text"],#wd2-venues-root .wdvs-field select{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:16px;background:var(--cream);color:var(--ink)}\
#wd2-venues-root .wdvs-field input[type="text"]:focus,#wd2-venues-root .wdvs-field select:focus{outline:2px solid var(--sage);outline-offset:1px}\
#wd2-venues-root .wdvs-chiprow{display:flex;flex-wrap:wrap;gap:8px}\
#wd2-venues-root .wdvs-chip{-webkit-appearance:none;appearance:none;margin:0;padding:8px 14px;line-height:1.2;border-radius:999px;border:1px solid var(--line);background:var(--cream);background-clip:padding-box;box-shadow:none;text-decoration:none;text-shadow:none;font-size:13px;cursor:pointer;font-family:inherit;color:var(--ink);transition:none;-webkit-tap-highlight-color:transparent;outline:none}\
#wd2-venues-root .wdvs-chip:hover{border-color:var(--sage)}\
#wd2-venues-root .wdvs-chip:focus{outline:none}\
#wd2-venues-root .wdvs-chip:focus-visible{outline:2px solid var(--sage);outline-offset:2px}\
#wd2-venues-root .wdvs-chip::before,#wd2-venues-root .wdvs-chip::after{content:none;display:none}\
#wd2-venues-root .wdvs-chip[aria-pressed="true"]{background:var(--sage);border-color:var(--sage);color:#fff}\
#wd2-venues-root .wdvs-capacity-row{display:flex;align-items:center;gap:10px}\
#wd2-venues-root .wdvs-capacity-row input[type="range"]{flex:1;accent-color:var(--sage)}\
#wd2-venues-root .wdvs-capacity-val{font-size:13px;font-weight:600;color:var(--sage-dark);min-width:74px;text-align:right}\
#wd2-venues-root .wdvs-reset{max-width:1600px;margin:-14px auto 26px;text-align:right}\
#wd2-venues-root .wdvs-reset button{background:none;border:none;font-family:inherit;font-size:13px;color:var(--brass);cursor:pointer;text-decoration:underline}\
#wd2-venues-root .wdvs-count{max-width:1600px;margin:0 auto 16px;font-size:13px;color:#b7b2a1}\
#wd2-venues-root .wdvs-grid{max-width:1600px;margin:0 auto;display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}\
#wd2-venues-root .wdvs-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;text-decoration:none;color:inherit;transition:transform .18s ease,box-shadow .18s ease;aspect-ratio:auto;max-width:none;margin:0;min-height:0;width:auto;position:relative}\
@media (hover:hover){#wd2-venues-root .wdvs-card.wdvs-live:hover{transform:translateY(-3px);border-color:#3dc2bb;box-shadow:0 0 0 2px #3dc2bb,0 12px 30px rgba(0,0,0,.45)}#wd2-venues-root .wdvs-card.wdvs-live:hover .wdvs-card-img{transform:scale(1.04)}}#wd2-venues-root .wdvs-card-img{transition:transform .5s}#wd2-venues-root .wdvs-card.wdvs-live:active,#wd2-venues-root .wdvs-card.wdvs-live.wdvs-tap{border-color:#3dc2bb;box-shadow:0 0 0 2px #3dc2bb,0 12px 30px rgba(0,0,0,.45);transform:scale(.99)}#wd2-venues-root .wdvs-card.wdvs-live:focus-visible{outline:none;box-shadow:0 0 0 3px #3dc2bb}\
#wd2-venues-root .wdvs-card.wdvs-soon{cursor:default;opacity:.82}\
#wd2-venues-root .wdvs-card>*{flex-shrink:0}\
#wd2-venues-root .wdvs-card-imgwrap{position:relative;width:100%;height:0;padding-top:75%;overflow:hidden;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%)}\
#wd2-venues-root .wdvs-mark{position:absolute;right:8px;bottom:8px;width:30px;height:auto;max-width:none;margin:0;opacity:.85;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;z-index:1}\
#wd2-venues-root .wdvs-card-img{position:absolute;top:0;left:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;object-fit:cover;display:block}\
#wd2-venues-root .wdvs-card-img-fallback{position:absolute;inset:0;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%);display:flex;align-items:center;justify-content:center;font-family:"Fraunces",serif;font-size:34px;color:#fff;opacity:.85}\
#wd2-venues-root .wdvs-card-body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:8px;flex:1}\
#wd2-venues-root .wdvs-card-name{font-family:"Fraunces",serif;font-weight:500;font-size:19px;margin:0;color:var(--sage-dark)}\
#wd2-venues-root .wdvs-card-county{font-size:12.5px;color:#9a9484;letter-spacing:.02em}\
#wd2-venues-root .wdvs-tagrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}\
#wd2-venues-root .wdvs-tag{font-size:11px;padding:4px 9px;border-radius:999px;font-weight:600;letter-spacing:.02em;color:#eae6dd!important;background:rgba(234,230,221,.1)!important;border:1px solid rgba(234,230,221,.3);-webkit-backdrop-filter:blur(10px) saturate(140%);backdrop-filter:blur(10px) saturate(140%);box-shadow:inset 0 1px 0 rgba(255,255,255,.1);white-space:nowrap}\
#wd2-venues-root .wdvs-tag-cap{border-color:rgba(61,194,187,.55)}\
#wd2-venues-root .wdvs-tag-sitdown{background:#f3e6e2;color:#9a5646}\
#wd2-venues-root .wdvs-tag-casual{background:#e9eef5;color:#3f5c80}\
#wd2-venues-root .wdvs-tag-both{background:#f6ecd9;color:#8a6a2d}\
@media (max-width:640px){#wd2-venues-root .wdvs-card-imgwrap{padding-top:52%}#wd2-venues-root .wdvs-card-body{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;row-gap:4px;padding:12px 14px 14px}#wd2-venues-root .wdvs-card-name,#wd2-venues-root .wdvs-card-county,#wd2-venues-root .wdvs-view,#wd2-venues-root .wdvs-soon-badge{grid-column:1}#wd2-venues-root .wdvs-tagrow{grid-column:2;grid-row:1/span 3;flex-direction:column;align-items:flex-end;justify-content:center;margin:0}#wd2-venues-root .wdvs-grid{gap:14px}}\
#wd2-venues-root .wdvs-soon-badge{margin-top:auto;font-size:12px;font-weight:600;color:var(--brass);letter-spacing:.04em;text-transform:uppercase;padding-top:6px}\
#wd2-venues-root .wdvs-view{margin-top:auto;font-size:12.5px;font-weight:600;color:var(--sage);letter-spacing:.03em}\
#wd2-venues-root .wdvs-empty{max-width:1600px;margin:40px auto;text-align:center;padding:40px 20px;color:#9a9484;font-size:15px}';
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
      var VENUES = DATA.venues.map(function (v) {
        var pic = v.cardImg || v.heroImg;
        return {
          name: v.name,
          county: v.location || v.county,
          capacity: Number(v.capacity) || 0,
          foodStyle: v.foodStyle,
          live: !!(v.live && v.url),
          url: v.url,
          img: pic ? (/^https?:/.test(pic) ? pic : DATA.imageBase + pic + '?format=500w') : ''
        };
      });
      build(VENUES);
    })
    .catch(function () {
      root.innerHTML = '<div class="wdvs-empty">Venues could not be loaded. Please refresh the page.</div>';
    });

  function build(VENUES) {
    var counties = Array.from(new Set(VENUES.map(function (v) { return v.county; }))).sort();
    var maxCapacity = Math.max.apply(null, VENUES.map(function (v) { return v.capacity; }).concat([50]));

    root.innerHTML = '\
      <img class="wdvs-watermark" src="' + WATERMARK_LOGO_URL + '" alt="" aria-hidden="true" onerror="this.style.display=\'none\'" />\
      <div class="wdvs-head">\
        <div class="wdvs-eyebrow">Find Your Venue</div>\
        <h2 class="wdvs-title">Search Wedding Day 2 Venues</h2>\
        <p class="wdvs-sub">Filter by location, guest capacity and dining style to find the right fit.</p>\
      </div>\
      <div class="wdvs-filters">\
        <div class="wdvs-field">\
          <label for="wdvs-search">Search by name</label>\
          <input type="text" id="wdvs-search" placeholder="e.g. Dame Tavern" />\
        </div>\
        <div class="wdvs-field">\
          <label for="wdvs-county">Location</label>\
          <select id="wdvs-county"><option value="">All locations</option>' +
            counties.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select>\
        </div>\
        <div class="wdvs-field">\
          <label for="wdvs-capacity">Minimum guest capacity</label>\
          <div class="wdvs-capacity-row">\
            <input type="range" id="wdvs-capacity" min="0" max="' + maxCapacity + '" step="10" value="0" />\
            <span class="wdvs-capacity-val" id="wdvs-capacity-val">Any</span>\
          </div>\
        </div>\
        <div class="wdvs-field" style="grid-column: 1 / -1;">\
          <label>Dining style</label>\
          <div class="wdvs-chiprow" id="wdvs-food-chips">\
            <button type="button" class="wdvs-chip" data-food="" aria-pressed="true">All</button>\
            <button type="button" class="wdvs-chip" data-food="sitdown" aria-pressed="false">Sit-down</button>\
            <button type="button" class="wdvs-chip" data-food="casual" aria-pressed="false">Casual</button>\
            <button type="button" class="wdvs-chip" data-food="both" aria-pressed="false">Both</button>\
          </div>\
        </div>\
      </div>\
      <div class="wdvs-reset"><button type="button" id="wdvs-reset-btn">Reset filters</button></div>\
      <div class="wdvs-count" id="wdvs-count"></div>\
      <div class="wdvs-grid" id="wdvs-grid"></div>\
      <div class="wdvs-empty" id="wdvs-empty" style="display:none;">No venues match those filters yet. Try widening your search.</div>';

    var els = {
      search: root.querySelector('#wdvs-search'),
      county: root.querySelector('#wdvs-county'),
      capacity: root.querySelector('#wdvs-capacity'),
      capacityVal: root.querySelector('#wdvs-capacity-val'),
      chips: Array.prototype.slice.call(root.querySelectorAll('#wdvs-food-chips .wdvs-chip')),
      grid: root.querySelector('#wdvs-grid'),
      empty: root.querySelector('#wdvs-empty'),
      count: root.querySelector('#wdvs-count'),
      reset: root.querySelector('#wdvs-reset-btn')
    };
    var state = { search: '', county: '', minCapacity: 0, food: '' };
    var foodLabel = { sitdown: 'Sit-down', casual: 'Casual', both: 'Sit-down & Casual' };
    var foodTagClass = { sitdown: 'wdvs-tag-sitdown', casual: 'wdvs-tag-casual', both: 'wdvs-tag-both' };

    function matchesFood(venueFood, filter) {
      if (!filter) return true;
      if (filter === 'both') return venueFood === 'both';
      return venueFood === filter || venueFood === 'both';
    }

    function render() {
      var q = state.search.trim().toLowerCase();
      var results = VENUES.filter(function (v) {
        return (!q || v.name.toLowerCase().indexOf(q) !== -1) &&
          (!state.county || v.county === state.county) &&
          (v.capacity >= state.minCapacity) &&
          matchesFood(v.foodStyle, state.food);
      });
      els.count.textContent = results.length + ' venue' + (results.length === 1 ? '' : 's') + ' found';
      els.empty.style.display = results.length ? 'none' : 'block';
      els.grid.innerHTML = results.map(function (v) {
        var imgBlock = '<div class="wdvs-card-imgwrap">' + (v.img
          ? '<img class="wdvs-card-img" src="' + esc(v.img) + '" alt="' + esc(v.name) + '" loading="lazy" onerror="this.outerHTML=\'<div class=&quot;wdvs-card-img-fallback&quot;>' + esc(v.name.charAt(0)) + '</div>\'" />'
          : '<div class="wdvs-card-img-fallback">' + esc(v.name.charAt(0)) + '</div>') + (v.img ? WD2_MARK_TAG : '') + '</div>';
        var inner = imgBlock +
          '<div class="wdvs-card-body">' +
            '<h3 class="wdvs-card-name">' + esc(v.name) + '</h3>' +
            '<div class="wdvs-card-county">' + esc(v.county) + '</div>' +
            '<div class="wdvs-tagrow">' +
              '<span class="wdvs-tag wdvs-tag-cap">Up to ' + v.capacity + ' guests</span>' +
              '<span class="wdvs-tag ' + (foodTagClass[v.foodStyle] || '') + '">' + esc(foodLabel[v.foodStyle] || v.foodStyle) + '</span>' +
            '</div>' +
            (v.live ? '<span class="wdvs-view">View venue →</span>' : '<span class="wdvs-soon-badge">Page coming soon</span>') +
          '</div>';
        return v.live
          ? '<a class="wdvs-card wdvs-live" href="' + esc(v.url) + '">' + inner + '</a>'
          : '<div class="wdvs-card wdvs-soon">' + inner + '</div>';
      }).join('');
    }

    els.search.addEventListener('input', function (e) { state.search = e.target.value; render(); });
    els.county.addEventListener('change', function (e) { state.county = e.target.value; render(); });
    els.capacity.addEventListener('input', function (e) {
      state.minCapacity = Number(e.target.value);
      els.capacityVal.textContent = state.minCapacity === 0 ? 'Any' : state.minCapacity + '+';
      render();
    });
    els.chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        els.chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        state.food = chip.getAttribute('data-food');
        render();
      });
    });
    els.reset.addEventListener('click', function () {
      state = { search: '', county: '', minCapacity: 0, food: '' };
      els.search.value = ''; els.county.value = ''; els.capacity.value = 0;
      els.capacityVal.textContent = 'Any';
      els.chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-food') === '' ? 'true' : 'false'); });
      render();
    });

    render();
  }
})();
