/* Wedding Day 2 venue page
   Usage in a Squarespace Code block:
     <div id="venue-page" data-venue="oneills"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venue-page.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Loading straight from GitHub means updates show on the site within about 5 minutes.
   Change data-venue to the venue's "slug" from venues.json.
   The page is dark by default; add data-theme="light" to the div for the light sand version. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venues.json';
  var HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
  var FORM_URL = 'https://api.web3forms.com/submit';
  var root = document.getElementById('venue-page');
  if (!root) return;

  // Paint the whole page section black so there's no patterned or lighter band around this page
  (function () {
    var sec = root.closest('section');
    if (!sec) return;
    sec.style.backgroundColor = '#1f2727';
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = '#1f2727'; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  })();
  var slug = (root.getAttribute('data-venue') || '').trim().toLowerCase();

  var FOOD = { casual: 'Casual dining', sitdown: 'Sit-down dining', both: 'Sit-down or casual' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // First sentence for the hero, skipping full stops after initials like "J.R." or "J.L."
  function firstSentence(t) {
    t = String(t); var re = /[.!?](\s|$)/g, m;
    while ((m = re.exec(t))) { if (!/(^|[\s.])[A-Z]$/.test(t.slice(0, m.index))) return t.slice(0, m.index + 1); }
    return t;
  }

  // Fonts and styles, scoped to #venue-page so they don't affect the rest of the site.
  if (!document.getElementById('vp-fonts')) {
    var f = document.createElement('link');
    f.id = 'vp-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Bitter:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }
  var css = '\
#venue-page{--vp-radius:14px;--vp-radius-sm:10px;--vp-bg:#1f2727;--vp-surface:#283232;--vp-ink:#eae6dd;--vp-muted:#b8b3a8;--vp-line:#364242;--vp-bottle:#171d1d;--vp-brass:#3dc2bb;--vp-accent-text:#3dc2bb;--vp-on-dark:#eae6dd;\
--vp-display:"Young Serif",Georgia,serif;--vp-body:"Bitter",Georgia,serif;\
background:var(--vp-bg);color:var(--vp-ink);font-family:var(--vp-body);font-size:16px;line-height:1.65;font-weight:400;text-align:left}\
#venue-page[data-theme="light"]{--vp-bg:#eae6dd;--vp-surface:#f1ede2;--vp-ink:#1f2727;--vp-muted:#505c5c;--vp-line:#d3cec2;--vp-bottle:#1f2727;--vp-accent-text:#1b7f7a}\
#venue-page *{box-sizing:border-box}\
#venue-page h1,#venue-page h2,#venue-page h3{font-family:var(--vp-display);font-weight:400;letter-spacing:-.01em;text-transform:none;color:inherit;text-wrap:balance}\
#venue-page p{margin:0}\
#venue-page .vp-pad{padding-left:max(16px,4vw);padding-right:max(16px,4vw)}\
#venue-page .vp-hero{position:relative;z-index:0;min-height:min(70vh,600px);display:flex;align-items:flex-end;color:var(--vp-on-dark);background:#1f2727;overflow:hidden}\
#venue-page .vp-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;max-width:none}\
#venue-page .vp-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.85) 100%)}\
#venue-page .vp-hero:before{content:"";position:absolute;left:0;right:0;top:0;height:35%;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(29,37,37,.6) 0%,rgba(29,37,37,0) 100%)}\
#venue-page .vp-hero-in{position:relative;z-index:1;width:100%;padding-top:48px;padding-bottom:40px}\
#venue-page .vp-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}\
#venue-page .vp-hero h1{font-size:clamp(40px,7vw,76px);line-height:1.02;margin:10px 0 12px;color:var(--vp-on-dark)}\
#venue-page .vp-lede{max-width:56ch;font-size:18px;opacity:.92}\
#venue-page .vp-facts{background:var(--vp-bottle);color:var(--vp-on-dark);display:flex;flex-wrap:wrap;gap:20px 40px;align-items:center;padding-top:22px;padding-bottom:22px}\
#venue-page .vp-fact span{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}\
#venue-page .vp-fact strong{font-family:var(--vp-display);font-weight:400;font-size:24px;color:var(--vp-brass)}\
#venue-page .vp-btn{display:inline-block;margin-left:auto;text-decoration:none;font-weight:500;letter-spacing:.04em;padding:14px 26px;border-radius:999px;background:var(--vp-brass);color:#1f2727;border:0}\
#venue-page .vp-btn:focus-visible,#venue-page button:focus-visible{outline:2px solid var(--vp-brass);outline-offset:3px}\
#venue-page .vp-body{display:grid;grid-template-columns:minmax(0,1fr) clamp(340px,26vw,400px);gap:clamp(40px,4vw,72px);align-items:start;max-width:none;margin:0;padding-top:72px;padding-bottom:72px}\
#venue-page .vp-main{display:grid;gap:72px;min-width:0;container-type:inline-size}\
#venue-page .vp-aside{position:sticky;top:var(--vp-sticky-top,24px);min-width:0}\
#venue-page .vp-main h2{font-size:clamp(28px,4vw,40px);margin:0 0 20px;color:var(--vp-ink)}\
#venue-page .vp-about p{font-size:20px;max-width:62ch}\
#venue-page .vp-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:24px 48px;align-items:start}\
#venue-page .vp-space{display:grid;grid-template-columns:minmax(0,1fr);gap:24px 48px;padding:36px 0;border-bottom:1px solid var(--vp-line);align-items:center}\
#venue-page .vp-space.vp-has-video{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)}\
#venue-page .vp-space{align-items:start}\
#venue-page .vp-space-text{display:grid;gap:10px;min-width:0}\
#venue-page .vp-spaces{border-top:1px solid var(--vp-line)}\
#venue-page .vp-space h3{font-size:24px;margin:0}\
#venue-page .vp-cap{color:var(--vp-accent-text);font-size:14px;font-weight:500}\
#venue-page .vp-space p{color:var(--vp-muted);max-width:62ch}\
#venue-page .vp-capnote{margin-top:20px;font-weight:500;color:var(--vp-accent-text)}\
#venue-page .vp-gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}\
#venue-page .vp-gallery button{padding:0;border:0;background:var(--vp-line);cursor:zoom-in;aspect-ratio:4/3;overflow:hidden;border-radius:var(--vp-radius-sm)}\
#venue-page .vp-gallery img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}\
#venue-page .vp-gallery button:hover img{transform:scale(1.04)}\
#venue-page .vp-space-gallery{grid-column:1/-1;min-width:0}\
#venue-page .vp-gallery.vp-g6{grid-template-columns:repeat(3,minmax(0,1fr))}\
#venue-page .vp-more{margin-top:16px;font:inherit;font-weight:500;background:none;border:1px solid var(--vp-ink);border-radius:999px;color:var(--vp-ink);padding:10px 18px;cursor:pointer}\
#venue-page .vp-video{margin:0;display:grid;gap:8px;min-width:0}\
#venue-page .vp-vwrap{position:relative}\
#venue-page .vp-video video{width:100%;aspect-ratio:16/9;background:#171d1d;display:block;object-fit:cover;border-radius:var(--vp-radius);overflow:hidden}\
#venue-page .vp-play{position:absolute;inset:0;margin:auto;width:76px;height:76px;border-radius:50%;border:0;padding:0;background:var(--vp-brass);color:#1f2727;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35);transition:transform .15s}\
#venue-page .vp-play:hover{transform:scale(1.08)}\
#venue-page .vp-play svg{width:28px;height:28px;margin-left:4px}\
#venue-page .vp-vwrap.vp-playing .vp-play{display:none}\
#venue-page .vp-video figcaption{font-size:13px;color:var(--vp-muted)}\
#venue-page .vp-loc p{margin-bottom:12px;color:var(--vp-muted)}\
#venue-page .vp-similar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}\
#venue-page .vp-card{display:grid;gap:10px;text-decoration:none;color:inherit;min-width:0}\
#venue-page .vp-card-img{aspect-ratio:4/3;border-radius:var(--vp-radius);overflow:hidden;background:var(--vp-line)}\
#venue-page .vp-similar .vp-card-img{position:relative}#venue-page .vp-similar .vp-card-img:after{content:"";position:absolute;right:8px;bottom:8px;width:30px;height:31px;background:url(data:image/png;base64,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) center/contain no-repeat;opacity:.9;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;z-index:2}\
#venue-page .vp-card-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}\
#venue-page .vp-card:hover .vp-card-img img{transform:scale(1.04)}\
#venue-page .vp-card h3{font-size:22px;margin:0}\
#venue-page .vp-card p{margin:0;color:var(--vp-muted);font-size:14px}\
#venue-page .vp-card .vp-cap{margin-top:-4px}\
#venue-page .vp-card:focus-visible{outline:2px solid var(--vp-brass);outline-offset:4px;border-radius:var(--vp-radius)}\
@container (max-width:460px){#venue-page .vp-similar{grid-template-columns:1fr}}\
#venue-page .vp-loc a{color:var(--vp-accent-text);font-weight:500}\
#venue-page .vp-map{width:100%;max-width:640px;height:300px;border:1px solid var(--vp-line);border-radius:var(--vp-radius);display:block;margin-bottom:12px;background:var(--vp-line)}\
#venue-page .vp-form{background:var(--vp-surface);border:1px solid var(--vp-line);border-radius:20px;padding:20px 22px;display:grid;gap:9px;scroll-margin-top:24px}\
#venue-page .vp-form h2{font-size:22px;margin:0 0 2px}\
#venue-page .vp-form .vp-sub{color:var(--vp-muted);font-size:14px;margin-top:-6px}\
#venue-page .vp-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}\
#venue-page .vp-field{display:grid;gap:4px;min-width:0}\
#venue-page .vp-field label{font-size:12.5px;font-weight:500;color:var(--vp-ink)}\
#venue-page .vp-field label i{font-style:normal;color:var(--vp-muted);font-weight:400}\
#venue-page .vp-field input,#venue-page .vp-field select,#venue-page .vp-field textarea{font:inherit;font-size:15px;width:100%;padding:7px 13px;border:1px solid var(--vp-line);border-radius:var(--vp-radius-sm);background:var(--vp-bg);color:var(--vp-ink);color-scheme:dark}\
#venue-page[data-theme="light"] .vp-field input,#venue-page[data-theme="light"] .vp-field select,#venue-page[data-theme="light"] .vp-field textarea{color-scheme:light}\
#venue-page .vp-field textarea{min-height:58px;resize:vertical}\
#venue-page .vp-field input,#venue-page .vp-field select{display:block;height:40px;min-height:40px;line-height:22px;margin:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}\
#venue-page .vp-field input[type=date]{text-align:left;min-width:0}\
#venue-page .vp-field input[type=date]::-webkit-date-and-time-value{text-align:left;margin:0}\
#venue-page .vp-field input[type=date]::-webkit-datetime-edit{padding:0;line-height:22px}\
#venue-page .vp-field input[type=date]::-webkit-calendar-picker-indicator{opacity:.7;cursor:pointer;filter:invert(1)}\
#venue-page[data-theme="light"] .vp-field input[type=date]::-webkit-calendar-picker-indicator{filter:none}\
#venue-page .vp-field select{padding-right:36px;cursor:pointer;background-repeat:no-repeat;background-position:right 13px center;background-size:12px;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1 1l5 5 5-5%27 fill=%27none%27 stroke=%27%233dc2bb%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E")}\
#venue-page .vp-field input:focus,#venue-page .vp-field select:focus,#venue-page .vp-field textarea:focus{outline:2px solid var(--vp-brass);outline-offset:0;border-color:transparent}\
#venue-page .vp-form .vp-btn{padding-top:12px;padding-bottom:12px;margin:4px 0 0;width:100%;font:inherit;font-weight:500;cursor:pointer}\
#venue-page .vp-form .vp-btn[disabled]{opacity:.6;cursor:wait}\
#venue-page .vp-status{font-size:14px;margin:0}\
#venue-page .vp-status a{color:inherit;text-decoration:underline}\
#venue-page .vp-status.vp-err{color:#f0a48c}\
#venue-page .vp-done{display:grid;gap:8px}\
#venue-page .vp-done h2{color:var(--vp-brass)}\
#venue-page .vp-elist .vp-el-who{display:flex;align-items:center;gap:10px;min-width:0}#venue-page .vp-elist li.vp-el-m{align-items:center}#venue-page .vp-elist .vp-el-who img{width:38px;height:38px;border-radius:50%;object-fit:cover;flex:none;border:2px solid #3dc2bb}#venue-page .vp-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}@media (min-width:1001px){#venue-page .vp-aside .vp-form{max-height:calc(100vh - 48px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(61,194,187,.5) transparent}}@keyframes vpField{0%{box-shadow:0 0 0 0 rgba(61,194,187,0);background-color:inherit}30%{box-shadow:0 0 0 3px rgba(61,194,187,.7);background-color:rgba(61,194,187,.22)}100%{box-shadow:0 0 0 0 rgba(61,194,187,0)}}#venue-page .vp-form .vp-flashfield{animation:vpField 1.3s ease-out;border-color:var(--vp-brass)!important}#venue-page .vp-elist{border:1px dashed rgba(61,194,187,.5);background:rgba(61,194,187,.07);border-radius:14px;padding:10px 14px;margin:2px 0 6px}#venue-page .vp-elist[hidden]{display:none}#venue-page .vp-elist-t{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);margin-bottom:6px}#venue-page .vp-elist ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}#venue-page .vp-elist li{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;font-size:14px;color:var(--vp-on-dark);line-height:1.35}#venue-page .vp-elist li button{font:inherit;background:none;border:0;color:var(--vp-muted);cursor:pointer;padding:0 2px;font-size:13px}#venue-page .vp-add{font:inherit;cursor:pointer;width:100%;margin:0;padding:11px 18px;font-size:15px;text-align:center;background:transparent;color:var(--vp-brass);border:1.5px solid var(--vp-brass);border-radius:999px}#venue-page .vp-add-note{margin:0;font-size:13px;color:var(--vp-muted);line-height:1.45}#venue-page .vp-add-note a{color:var(--vp-brass)}#venue-page .vp-add-note[hidden]{display:none}\
@container (max-width:640px){#venue-page .vp-space.vp-has-video,#venue-page .vp-split{grid-template-columns:1fr}}\
#venue-page .vp-sheet-bar{display:none}\
@media (max-width:1000px){\
#venue-page .vp-body{grid-template-columns:1fr;padding-bottom:110px}\
#venue-page .vp-aside{position:fixed;left:0;right:0;bottom:0;top:auto;z-index:9998;pointer-events:none;padding:0 max(12px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px))}\
#venue-page .vp-sheet{pointer-events:auto;max-width:560px;margin:0 auto;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.4)}\
#venue-page .vp-sheet-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:15px 22px;border:0;border-radius:999px;background:var(--vp-brass);color:#1f2727;font:inherit;font-weight:600;font-size:16px;cursor:pointer;text-align:left}\
#venue-page .vp-sheet-bar svg{width:20px;height:20px;flex:none;transition:transform .2s}\
#venue-page .vp-sheet .vp-form{display:none}\
#venue-page .vp-open .vp-sheet{background:var(--vp-surface);border:1px solid var(--vp-line);max-height:calc(100vh - var(--vp-sheet-top,24px) - 12px);max-height:calc(100dvh - var(--vp-sheet-top,24px) - 12px)}\
#venue-page .vp-open .vp-sheet-bar{border-radius:0;background:var(--vp-surface);color:var(--vp-ink);border-bottom:1px solid var(--vp-line);font-family:var(--vp-display);font-weight:400;font-size:20px}\
#venue-page .vp-open .vp-sheet-bar svg{transform:rotate(180deg);color:var(--vp-brass)}\
#venue-page .vp-open .vp-sheet .vp-form{display:grid;border:0;border-radius:0;overflow-y:auto;overscroll-behavior:contain}\
#venue-page .vp-sheet .vp-form h2{display:none}\
#venue-page .vp-aside:not(.vp-open) .vp-sheet{max-width:230px;transition:max-width .25s;overflow:visible;box-shadow:none}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar{padding:11px 18px;font-size:15px;justify-content:center;gap:8px;background:#171d1d;color:var(--vp-brass);border:1.5px solid var(--vp-brass);animation:vpTempt 2.8s ease-in-out infinite}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar svg{color:var(--vp-brass)}#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar.vp-pulse{animation:vpPulse .9s ease-out 2}#venue-page .vp-aside:not(.vp-open) .vp-sheet:has(.vp-bar-msg){max-width:340px}@keyframes vpTempt{0%,100%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 0 rgba(61,194,187,.45)}50%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 9px rgba(61,194,187,0)}}@media (prefers-reduced-motion:reduce){#venue-page .vp-aside:not(.vp-open) .vp-sheet-bar{animation:none}}\
}\
#venue-page .vp-lb{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px}\
#venue-page .vp-lb[hidden]{display:none}\
#venue-page .vp-slider{position:relative;border-radius:var(--vp-radius);overflow:hidden;background:#171d1d}\
#venue-page .vp-sl-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}\
#venue-page .vp-sl-track::-webkit-scrollbar{display:none}\
#venue-page .vp-sl-slide{position:relative;flex:0 0 100%;scroll-snap-align:start;aspect-ratio:16/10;padding:0;border:0;background:#171d1d;cursor:zoom-in}\
@media (min-width:900px){#venue-page .vp-sl-track{gap:8px}#venue-page .vp-sl-slide{flex:0 0 calc((100% - 16px) / 3);aspect-ratio:4/3;border-radius:var(--vp-radius-sm,10px);overflow:hidden}#venue-page .vp-slider{background:none}}\
#venue-page .vp-sl-slide>img:first-child{width:100%;height:100%;object-fit:cover;display:block}\
#venue-page .vp-sl-slide .vp-wm{width:40px!important;right:12px;bottom:12px}\
#venue-page .vp-sl-arr,#venue-page .vp-lb-arr{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;cursor:pointer;color:#eae6dd;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(234,230,221,.35);transition:opacity .2s,background .2s}\
#venue-page .vp-sl-arr svg,#venue-page .vp-lb-arr svg{width:22px;height:22px}\
#venue-page .vp-sl-arr:hover,#venue-page .vp-lb-arr:hover{background:rgba(61,194,187,.45);border-color:#3dc2bb}\
#venue-page .vp-sl-arr:disabled{opacity:0;pointer-events:none}\
#venue-page .vp-sl-prev{left:12px}#venue-page .vp-sl-next{right:12px}\
#venue-page .vp-sl-count{position:absolute;left:12px;bottom:12px;z-index:2;padding:4px 10px;border-radius:999px;font-size:12px;color:#eae6dd;background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);pointer-events:none}\
#venue-page .vp-lb{flex-direction:row}\
#venue-page .vp-lb-prev{left:18px}#venue-page .vp-lb-next{right:18px}\
#venue-page .vp-lb-arr{width:52px;height:52px}\
#venue-page .vp-lb.vp-lb-one .vp-lb-arr{display:none}\
#venue-page .vp-lb-x{position:absolute;top:16px;right:18px;z-index:2;width:44px;height:44px;border-radius:50%;border:0;background:rgba(234,230,221,.12);color:#eae6dd;font-size:26px;line-height:1;cursor:pointer}\
#venue-page .vp-lb .vp-count{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);color:#eae6dd;font-size:14px;opacity:.8}\
#venue-page .vp-lb-pic>img:first-child{max-height:84vh;max-width:calc(100vw - 150px)}\
@media (max-width:640px){#venue-page .vp-sl-arr{width:36px;height:36px}#venue-page .vp-sl-arr svg{width:18px;height:18px}#venue-page .vp-lb-pic>img:first-child{max-width:100%;max-height:80vh}#venue-page .vp-lb-arr{width:40px;height:40px;background:rgba(0,0,0,.6)}#venue-page .vp-lb-prev{left:8px}#venue-page .vp-lb-next{right:8px}}\
#venue-page .vp-lb-pic{position:relative;display:inline-block;max-width:100%;line-height:0}\
#venue-page .vp-lb-pic>img:first-child{max-height:78vh;max-width:100%;object-fit:contain;border-radius:var(--vp-radius)}\
#venue-page .vp-gallery button{position:relative}\
#venue-page .vp-wm{position:absolute;right:6px;bottom:6px;width:30px!important;height:auto!important;object-fit:contain!important;opacity:.85;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;transform:none!important}\
#venue-page .vp-lb-pic .vp-wm{width:60px!important;right:12px;bottom:12px}\
#venue-page .vp-lb-bar{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;align-items:center;color:var(--vp-on-dark)}\
#venue-page .vp-lb-bar button{font:inherit;border-radius:999px;background:none;border:1px solid rgba(234,230,221,.4);color:var(--vp-on-dark);padding:8px 14px;cursor:pointer}\
#venue-page .vp-msg{padding:40px 16px;color:var(--vp-muted)}\
@media (max-width:760px){#venue-page .vp-space.vp-has-video,#venue-page .vp-split{grid-template-columns:1fr}}\
@media (max-width:640px){#venue-page .vp-gallery,#venue-page .vp-gallery.vp-g6{grid-template-columns:repeat(2,minmax(0,1fr))}#venue-page .vp-play{width:60px;height:60px}#venue-page .vp-row{gap:10px}#venue-page .vp-main{gap:56px}#venue-page .vp-body{padding-top:52px;padding-bottom:52px;gap:56px}#venue-page .vp-btn{margin-left:0}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var keyHandler = null;

  function load() {
    slug = (root.getAttribute('data-venue') || '').trim().toLowerCase();
    root.innerHTML = '<style>@keyframes wd2Shim{0%{background-position:-400px 0}100%{background-position:400px 0}}.wd2-sk{background:#283232 linear-gradient(90deg,rgba(234,230,221,0) 0,rgba(234,230,221,.07) 50%,rgba(234,230,221,0) 100%) no-repeat;background-size:400px 100%;animation:wd2Shim 1.3s ease-in-out infinite;border-radius:14px}@media (prefers-reduced-motion:reduce){.wd2-sk{animation:none}}</style><div style="background:#1f2727;padding:0 0 40px"><div class="wd2-sk" style="height:min(62vh,560px);border-radius:0"></div><div style="max-width:1100px;margin:0 auto;padding:28px clamp(16px,4vw,48px);display:grid;gap:12px"><div class="wd2-sk" style="height:34px;width:min(320px,70%)"></div><div class="wd2-sk" style="height:14px;width:min(620px,95%)"></div><div class="wd2-sk" style="height:14px;width:min(540px,85%)"></div><div class="wd2-sk" style="height:14px;width:min(460px,75%)"></div></div></div>';
    // A preview page can supply the data directly; the live site fetches it from GitHub.
    var getData = window.WD2_VENUES ? Promise.resolve(window.WD2_VENUES)
      : fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    getData
      .then(function (DATA) {
        var v = null;
        for (var i = 0; i < DATA.venues.length; i++) if (DATA.venues[i].slug === slug) v = DATA.venues[i];
        if (!v) { root.innerHTML = '<div class="vp-msg">No venue called "' + esc(slug) + '" in venues.json. Check the data-venue name in this code block.</div>'; return; }
        render(DATA, v);
      })
      .catch(function () {
        root.innerHTML = '<div class="vp-msg">Venue details could not be loaded. Please refresh the page.</div>';
      });
  }
  window.WD2VenuePageReload = load;
  load();

  function render(DATA, v) {
    var img = function (p, w) { return DATA.imageBase + p + '?format=' + w + 'w'; };
    var sets = [];  // each photo set (a room's gallery, or the venue's) gets its own viewer
    var rooms = v.rooms || [];
    var vids = v.videos || [];
    var enq = DATA.enquireUrl;
    var area = v.area || ('Co. ' + v.county);

    var facts = [['Guests', 'Up to ' + v.capacity], ['Food', FOOD[v.foodStyle] || 'Ask the venue']];
    if (rooms.length) facts.push(['Private spaces', String(rooms.length)]);

    var h = '';
    h += '<header class="vp-hero"><img src="' + img(v.heroImg || v.cardImg, 2500) + '" alt="' + esc(v.name) + '">';
    h += '<div class="vp-hero-in vp-pad"><div class="vp-eyebrow">' + esc(area) + ' · Co. ' + esc(v.county) + '</div>';
    h += '<h1>' + esc(v.name) + '</h1><p class="vp-lede">' + esc(firstSentence(v.intro)) + '</p></div></header>';

    h += '<div class="vp-facts vp-pad">';
    facts.forEach(function (f) { h += '<div class="vp-fact"><span>' + f[0] + '</span><strong>' + esc(f[1]) + '</strong></div>'; });
    h += '<a class="vp-btn" href="#vp-enquire">Get a quote</a></div>';

    var allVideos = [];
    function videoTag(x, label) {
      var mm = Math.floor(x.seconds / 60) + ':' + ('0' + (x.seconds % 60)).slice(-2);
      allVideos.push(x);
      return '<figure class="vp-video"><div class="vp-vwrap"><video data-v="' + (allVideos.length - 1) + '" playsinline preload="none" poster="' + DATA.videoBase + x.id + '/thumbnail" aria-label="Walk-around video of ' + esc(label) + '"></video>'
        + '<button type="button" class="vp-play" aria-label="Play walk-around of ' + esc(label) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 4l15 8-15 8z"/></svg></button></div><figcaption>Walk-around of ' + esc(label) + ' · ' + mm + '</figcaption></figure>';
    }

    var ARW_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ARW_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // Small Wedding Day 2 heart logo in the bottom corner of every gallery photo
    var WM_TAG = '<img class="vp-wm" src="data:image/png;base64,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" alt="" aria-hidden="true" loading="lazy" onerror="this.remove()">';

    function galleryTag(list, label) {
      if (!list || !list.length) return '';
      // Swipeable slider: one big photo at a time, arrows either side, tap to open full screen
      var si = sets.push(list) - 1, n = list.length;
      var g = '<div class="vp-slider" data-set="' + si + '"><div class="vp-sl-track">';
      list.forEach(function (p, i) {
        g += '<button type="button" class="vp-sl-slide" data-set="' + si + '" data-i="' + i + '" aria-label="Open photo ' + (i + 1) + ' of ' + n + ' of ' + esc(label) + '"><img src="' + img(p, 1000) + '" alt="' + esc(label) + ' photo ' + (i + 1) + '"' + (i > 1 ? ' loading="lazy"' : '') + ' decoding="async">' + WM_TAG + '</button>';
      });
      g += '</div>';
      if (n > 1) g += '<button type="button" class="vp-sl-arr vp-sl-prev" aria-label="Previous photo">' + ARW_L + '</button><button type="button" class="vp-sl-arr vp-sl-next" aria-label="Next photo">' + ARW_R + '</button><span class="vp-sl-count">1 / ' + n + '</span>';
      g += '</div>';
      return g;
    }

    h += '<div class="vp-body vp-pad"><div class="vp-main">';
    // The header already shows the first sentence, so "About the venue" only shows what comes after it
    var aboutText = v.intro ? String(v.intro).slice(firstSentence(v.intro).length).trim() : '';
    if (v.intro && (aboutText || vids.length)) {
      var aboutP = aboutText ? '<p>' + esc(aboutText) + '</p>' : '';
      if (vids.length) h += '<section class="vp-about vp-split"><div><h2>About the venue</h2>' + aboutP + '</div>' + videoTag(vids[0], v.name) + '</section>';
      else h += '<section class="vp-about"><h2>About the venue</h2>' + aboutP + '</section>';
    }

    if (rooms.length) {
      h += '<section><h2>The spaces</h2><div class="vp-spaces">';
      rooms.forEach(function (r) {
        h += '<div class="vp-space' + (r.video ? ' vp-has-video' : '') + '"><div class="vp-space-text"><h3>' + esc(r.name) + '</h3>'
          + (r.capacity ? '<div class="vp-cap">' + esc(r.capacity) + '</div>' : '')
          + '<p>' + esc(r.description) + '</p></div>'
          + (r.video ? videoTag(r.video, r.name) : '')
          + (r.gallery && r.gallery.length ? '<div class="vp-space-gallery">' + galleryTag(r.gallery, r.name) + '</div>' : '') + '</div>';
      });
      h += '</div>' + (v.capacityNote ? '<p class="vp-capnote">' + esc(v.capacityNote) + '</p>' : '') + '</section>';
    }

    if (v.gallery && v.gallery.length) h += '<section><h2>Gallery</h2>' + galleryTag(v.gallery, v.name) + '</section>';

    var q = encodeURIComponent(v.mapQuery || (v.name + ', ' + (v.area || '') + ', ' + v.county));
    h += '<section class="vp-loc"><h2>Location</h2><p>' + esc(v.name) + ', ' + esc(area) + '</p>';
    h += '<iframe class="vp-map" title="Map showing ' + esc(v.name) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + q + '&z=15&output=embed"></iframe>';
    h += '</section>';

    // Similar venues: two other live venues, closest in guest numbers, same food style first.
    // Venues this visitor has already opened go to the back of the queue
    var seenV = [];
    try { seenV = JSON.parse(localStorage.getItem('wd2SeenVenues') || '[]'); } catch (e) {}
    if (seenV.indexOf(v.slug) === -1) seenV.push(v.slug);
    try { localStorage.setItem('wd2SeenVenues', JSON.stringify(seenV)); } catch (e) {}
    var others = DATA.venues.filter(function (o) { return o.live && o.url && o.slug !== v.slug; });
    others.sort(function (a, b) {
      var da = Math.abs(a.capacity - v.capacity) + (a.foodStyle === v.foodStyle ? 0 : 60) + (seenV.indexOf(a.slug) !== -1 ? 100000 : 0);
      var db = Math.abs(b.capacity - v.capacity) + (b.foodStyle === v.foodStyle ? 0 : 60) + (seenV.indexOf(b.slug) !== -1 ? 100000 : 0);
      return da - db;
    });
    others = others.slice(0, 2);
    if (others.length) {
      h += '<section><h2>Similar venues</h2><div class="vp-similar">';
      others.forEach(function (o) {
        h += '<a class="vp-card" href="' + esc(o.url) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(o.heroImg || o.cardImg, 750) + '" alt="' + esc(o.name) + '"></div>'
          + '<h3>' + esc(o.name) + '</h3><p>' + esc(o.area || ('Co. ' + o.county)) + '</p><div class="vp-cap">Up to ' + esc(o.capacity) + ' guests</div></a>';
      });
      h += '</div></section>';
    }

    h += '</div>';  // end of main column

    // Enquiry form: stays in view beside the content on wide screens, sits at the end on phones.
    var today = new Date(); today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    h += '<aside class="vp-aside"><div class="vp-sheet">'
      + '<button type="button" class="vp-sheet-bar" aria-expanded="false" aria-controls="vp-enquire"><span>Enquire about ' + esc(v.name) + '</span>'
      + '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M6 15l6-6 6 6"/></svg></button>'
      + '<form class="vp-form" id="vp-enquire" novalidate>'
      + '<h2>Enquire about ' + esc(v.name) + '</h2>'
      + '<div class="vp-elist" hidden><span class="vp-elist-t">Also in your enquiry</span><ul></ul></div>'
      + '<div class="vp-row"><div class="vp-field"><label for="vp-fname">First name</label><input id="vp-fname" name="First name" autocomplete="given-name" required></div>'
      + '<div class="vp-field"><label for="vp-lname">Last name</label><input id="vp-lname" name="Last name" autocomplete="family-name" required></div></div>'
      + '<div class="vp-field"><label for="vp-email">Email</label><input id="vp-email" name="email" type="email" autocomplete="email" required></div>'
      + '<div class="vp-field"><label for="vp-date">Event date <i>(optional)</i></label><input id="vp-date" name="Event date" type="date" min="' + today + '"></div>'
      + '<div class="vp-field"><label for="vp-venue">Venue(s) you are interested in</label><input id="vp-venue" name="Venue" value="' + esc(v.name) + '"></div>'
      + '<div class="vp-field"><label for="vp-music">Interested in our live music or karaoke options?</label><select id="vp-music" name="Live music / karaoke"><option value="">Select an option</option><option>Yes</option><option>No</option></select></div>'
      + '<div class="vp-field"><label for="vp-heard">How did you hear about us?</label><select id="vp-heard" name="How they heard about us"><option value="">Select an option</option><option>Instagram</option><option>Google Search</option><option>Musician referral</option><option>Friends or family</option><option>Other</option></select></div>'
      + '<div class="vp-field"><label for="vp-msg">Let us know how we can help <i>(optional)</i></label><textarea id="vp-msg" name="Message" placeholder="Guest numbers, questions, anything else"></textarea></div>'
      + '<input type="checkbox" name="botcheck" class="vp-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'
      + '<button class="vp-btn" type="submit">Send enquiry</button><button type="button" class="vp-btn vp-btn-ghost vp-add">+ Add to my enquiry and keep browsing</button><p class="vp-add-note" hidden></p><p class="vp-status" role="status" aria-live="polite"></p>'
      + '</form></div></aside>';
    h += '</div>';  // end of body

    h += '<div class="vp-lb" hidden><button type="button" class="vp-lb-x" data-a="close" aria-label="Close">&times;</button><button type="button" class="vp-lb-arr vp-lb-prev" data-a="prev" aria-label="Previous photo">' + ARW_L + '</button><div class="vp-lb-pic"><img alt="">' + WM_TAG + '</div><button type="button" class="vp-lb-arr vp-lb-next" data-a="next" aria-label="Next photo">' + ARW_R + '</button><span class="vp-count"></span></div>';

    // The site's photo-link script turns a whole block into a link when it spots a known photo in it.
    // Mark this block as already handled so clicks inside it work normally.
    for (var blk = root; blk && blk !== document.body; blk = blk.parentElement) {
      if (blk.classList && blk.classList.contains('sqs-block')) { blk.wd2Wired = true; break; }
    }
    root.innerHTML = h;

    // Slide the main photo up to the very top of the page, underneath the site's see-through header.
    var hero = root.querySelector('.vp-hero');
    function pullUp() {
      // Squarespace code blocks hide anything outside them; let the banner show above the block.
      for (var el = root.parentElement; el && el !== document.body && !(el.matches && el.matches('section')); el = el.parentElement) {
        var ov = getComputedStyle(el).overflowY;
        if (el.classList) el.classList.remove('wd2-hover');  // the site's photo hover-ring script also clips and rounds blocks
        if (ov === 'hidden' || ov === 'clip') el.style.setProperty('overflow', 'visible', 'important');
      }
      hero.style.marginTop = ''; hero.style.paddingTop = '';
      var gap = Math.round(hero.getBoundingClientRect().top + window.pageYOffset);
      if (gap > 0 && gap < 400) { hero.style.marginTop = -gap + 'px'; hero.style.paddingTop = gap + 'px'; }
    }
    pullUp();
    setTimeout(pullUp, 600); setTimeout(pullUp, 2000);
    window.__vpPull = pullUp;
    if (!window.__vpPullBound) { window.__vpPullBound = true; window.addEventListener('load', function () { if (window.__vpPull) window.__vpPull(); }); window.addEventListener('resize', function () { if (window.__vpPull) window.__vpPull(); }); }

    // Lightbox
    var lb = root.querySelector('.vp-lb'), lbImg = lb.querySelector('img'), count = lb.querySelector('.vp-count'), idx = 0, cur = [];
    var BIG = window.innerWidth < 700 ? 1000 : 1500, cache = {};
    function preload(p) { if (!p) return; var u = img(p, BIG); if (!cache[u]) { cache[u] = new Image(); cache[u].src = u; } }
    function open(i) {
      if (!cur.length) return;
      idx = (i + cur.length) % cur.length;
      var p = cur[idx], big = img(p, BIG);
      // show the slider-size photo straight away (already loaded), then swap in the sharper one
      lbImg.src = (cache[big] && cache[big].complete) ? big : img(p, 1000);
      if (lbImg.src.indexOf(big) === -1) { preload(p); cache[big].onload = function () { if (cur[idx] === p) lbImg.src = big; }; }
      count.textContent = (idx + 1) + ' / ' + cur.length;
      lb.classList.toggle('vp-lb-one', cur.length < 2);
      lb.hidden = false;
      preload(cur[(idx + 1) % cur.length]); preload(cur[(idx - 1 + cur.length) % cur.length]);
    }
    // swipe left/right in the full-screen viewer
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) open(idx + (dx < 0 ? 1 : -1)); });
    // on-page sliders: arrows, counter
    Array.prototype.forEach.call(root.querySelectorAll('.vp-slider'), function (sl) {
      var tr = sl.querySelector('.vp-sl-track'), ct = sl.querySelector('.vp-sl-count'), n = tr.children.length;
      // one photo per step on phones, two side by side on desktop
      var step = function () { var a = tr.children[0], b = tr.children[1]; return b ? b.offsetLeft - a.offsetLeft : tr.clientWidth; };
      var per = function () { return Math.max(1, Math.round(tr.clientWidth / step())); };
      var at = function () { return Math.round(tr.scrollLeft / step()); };
      var go = function (d) { var i = Math.max(0, Math.min(n - per(), at() + d)); tr.scrollTo({ left: i * step(), behavior: 'smooth' }); };
      var upd = function () { var i = at(), k = per(); if (ct) ct.textContent = (k > 1 ? (i + 1) + '–' + Math.min(n, i + k) : (i + 1)) + ' / ' + n; var p = sl.querySelector('.vp-sl-prev'), q = sl.querySelector('.vp-sl-next'); if (p) p.disabled = i === 0; if (q) q.disabled = i >= n - k; };
      var pv = sl.querySelector('.vp-sl-prev'), nx = sl.querySelector('.vp-sl-next');
      if (pv) pv.addEventListener('click', function () { go(-1); });
      if (nx) nx.addEventListener('click', function () { go(1); });
      tr.addEventListener('scroll', function () { window.requestAnimationFrame(upd); }, { passive: true });
      upd();
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-set]');
      if (b && root.contains(b)) { cur = sets[+b.getAttribute('data-set')] || []; open(+b.getAttribute('data-i')); }
    });
    lb.addEventListener('click', function (e) {
      var t = e.target.closest('[data-a]'), a = t && t.getAttribute('data-a');
      if (a === 'prev') open(idx - 1); else if (a === 'next') open(idx + 1); else if (a === 'close' || e.target === lb) lb.hidden = true;
    });
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = function (e) {
      if (e.key === 'Escape' && lb.hidden) { var a = root.querySelector('.vp-aside.vp-open'); if (a) a.querySelector('.vp-sheet-bar').click(); return; }
      if (lb.hidden) return;
      if (e.key === 'Escape') lb.hidden = true; else if (e.key === 'ArrowRight') open(idx + 1); else if (e.key === 'ArrowLeft') open(idx - 1);
    };
    document.addEventListener('keydown', keyHandler);

    // Keep the whole form visible: if it is taller than the window, let it stick by its bottom edge.
    var aside = root.querySelector('.vp-aside');
    var mobileQ = window.matchMedia('(max-width:1000px)');
    // Desktop: the form stays pinned near the top and fits the screen; if it's taller than the screen it scrolls inside itself, so nothing gets cut off
    function fitSticky() { if (mobileQ.matches) return; root.style.setProperty('--vp-sticky-top', '24px'); }
    if ('ResizeObserver' in window) new ResizeObserver(function () { fitSticky(); }).observe(aside);

    // Phones: a bar pinned to the bottom opens and closes the form.
    var sheetBar = aside.querySelector('.vp-sheet-bar'), sheetLabel = sheetBar.querySelector('span'), openLabel = sheetLabel.textContent;
    function setSheet(open) {
      if (open) {
        // Keep the open form below the site's logo and menu button.
        var hd = document.querySelector('#header') || document.querySelector('header:not(.vp-hero)'), top = 24;
        if (hd) {
          var r = hd.getBoundingClientRect();
          if (r.bottom > 0) top = Math.max(top, Math.round(r.bottom) + 8);
          var logo = hd.querySelector('.header-title, .header-burger, .header-display-mobile');
          if (logo) { var lr = logo.getBoundingClientRect(); if (lr.bottom > 0 && lr.height) top = Math.max(top, Math.round(lr.bottom) + 8); }
        }
        root.style.setProperty('--vp-sheet-top', Math.min(top, Math.round(window.innerHeight * 0.4)) + 'px');
      }
      aside.classList.toggle('vp-open', open);
      if (window.__vpKbFit) window.__vpKbFit();
      sheetBar.setAttribute('aria-expanded', open ? 'true' : 'false');
      sheetBar.setAttribute('aria-label', open ? 'Close the enquiry form' : openLabel);
    }
    sheetBar.addEventListener('click', function () { setSheet(!aside.classList.contains('vp-open')); });
    // Arriving from the floating "Send my enquiry" button: open the form straight away
    if (/[?&]enquire=1/.test(location.search)) setTimeout(function () {
      if (mobileQ.matches) setSheet(true);
      else { var f = root.querySelector('.vp-form'); if (f) { f.scrollIntoView({ behavior: 'smooth', block: 'start' }); var i = f.querySelector('input:not([type=hidden])'); if (i) try { i.focus({ preventScroll: true }); } catch (x) {} } }
    }, 700);
    // Phones: keep the open form sitting above the keyboard, and keep the box being typed in visible
    (function () {
      var vv = window.visualViewport;
      var fit = function () {
        if (!vv || !aside.classList.contains('vp-open')) { aside.style.removeProperty('bottom'); aside.style.removeProperty('top'); return; }
        var kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        aside.style.bottom = kb + 'px';
        aside.style.top = (vv.offsetTop + (kb > 80 ? 8 : parseInt(getComputedStyle(root).getPropertyValue('--vp-sheet-top')) || 12)) + 'px';
      };
      if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }
      aside.addEventListener('focusin', function (e) {
        if (!mobileQ.matches || !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
        setTimeout(function () { fit(); try { e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) { e.target.scrollIntoView(); } }, 320);
      });
      aside.addEventListener('focusout', function () { setTimeout(fit, 200); });
      window.__vpKbFit = fit;
    })();
    root.querySelector('.vp-facts .vp-btn').addEventListener('click', function (e) { if (mobileQ.matches) { e.preventDefault(); setSheet(true); } });
    fitSticky();
    if (!window.__vpFitBound) { window.__vpFitBound = true; window.addEventListener('resize', function () { if (window.__vpFit) window.__vpFit(); }); }
    window.__vpFit = fitSticky;

    // Enquiry form
    // Visitors arriving from an Instagram link get "How did you hear about us?" filled in for them
    (function () {
      var src = (location.search.match(/[?&]utm_source=([^&]+)/) || [])[1] || '';
      var heard = root.querySelector('#vp-heard');
      if (heard && /instagram|^ig$/i.test(decodeURIComponent(src)) && !heard.value) heard.value = 'Instagram';
    })();
    // Remember the couple's details on this device, so the form is already filled in on the next musician or venue page
    (function () {
      var KEY = 'wd2EnquiryDetails', ids = ['vp-fname', 'vp-lname', 'vp-email', 'vp-date', 'vp-time', 'vp-heard', 'vp-msg'], saved = {};
      try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
      ids.forEach(function (id) {
        var f = root.querySelector('#' + id); if (!f) return;
        if (saved[id] && !f.value) {
          if (f.tagName === 'SELECT') { if (Array.prototype.some.call(f.options, function (o) { return o.value === saved[id]; })) f.value = saved[id]; }
          else if (!(f.type === 'date' && f.min && saved[id] < f.min)) f.value = saved[id];
        }
        var keep = function () {
          try { var d = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; d[id] = f.value; localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
        };
        f.addEventListener('input', keep); f.addEventListener('change', keep);
      });
    })();

    // ===== Enquiry list: couples add several musicians / packages / venues and send ONE enquiry =====
    var ELIST = 'wd2VenueEnquiryList';  // venues have their own list, separate from musicians and packages
    var getList = function () { try { return JSON.parse(localStorage.getItem(ELIST) || '[]') || []; } catch (e) { return []; } };
    var setList = function (l) { try { localStorage.setItem(ELIST, JSON.stringify(l)); } catch (e) {} if (window.wd2FloatRefresh) window.wd2FloatRefresh(); };
    var curItem = function () { var vi = v.cardImg || v.heroImg; return { key: 'v:' + v.slug, label: 'Venue: ' + v.name, url: location.pathname, img: vi ? img(vi, 150) : '' }; };
    var elistBox = root.querySelector('.vp-elist'), addBtn = root.querySelector('.vp-add'), addNote = root.querySelector('.vp-add-note');
    var renderList = function () {
      var me = curItem(), others = getList().filter(function (x) { return !me || x.key !== me.key; });
      elistBox.hidden = !others.length;
      var anon = others.filter(function (x) { return /^Musician: Musician [A-Z]$/.test(x.label); }), anonN = 0;
      var shown = function (x) { if (!/^Musician: Musician [A-Z]$/.test(x.label)) return x.label; anonN++; return anon.length > 1 ? 'Chosen musician ' + anonN : 'Your chosen musician'; };
      elistBox.querySelector('ul').innerHTML = others.map(function (x) {
        var t = shown(x);
        return '<li' + (x.img ? ' class="vp-el-m"' : '') + '><span class="vp-el-who">' + (x.img ? '<img src="' + esc(x.img) + '" alt=""' + (x.pos ? ' style="object-position:' + esc(x.pos) + '"' : '') + '>' : '') + '<span>' + esc(t) + '</span></span><button type="button" data-key="' + esc(x.key) + '" aria-label="Remove ' + esc(t) + '">✕</button></li>';
      }).join('');
      Array.prototype.forEach.call(elistBox.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { setList(getList().filter(function (x) { return x.key !== b.getAttribute('data-key'); })); renderList(); }); });
      var inList = me && getList().some(function (x) { return x.key === me.key; });
      addBtn.disabled = !me;
      addBtn.textContent = inList ? '✓ In your enquiry. Keep browsing' : '+ Add to my enquiry and keep browsing';
      var bar = root.querySelector('.vp-sheet-bar span');
      if (bar && !bar.parentNode.classList.contains('vp-bar-msg')) {
        var base = bar.getAttribute('data-base') || bar.textContent; bar.setAttribute('data-base', base);
        bar.textContent = base + (others.length ? ' + ' + others.length + ' more' : ''); bar.setAttribute('data-label', bar.textContent);
      }
    };
    addBtn.addEventListener('click', function () {
      var me = curItem(); if (!me) return;
      var l = getList().filter(function (x) { return x.key !== me.key; }); l.push(me); setList(l);
      renderList();
      addNote.hidden = false;
      addNote.innerHTML = 'Added. Have a look at our other <a href="/venues">venues</a>, then send one enquiry for all of them. Your details are saved.';
    });
    window.addEventListener('pageshow', renderList);
    renderList();
    var form = root.querySelector('.vp-form'), status = form.querySelector('.vp-status'), sendBtn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'vp-status'; status.textContent = '';
      var missing = [];
      ['vp-fname', 'vp-lname', 'vp-email'].forEach(function (id) { var f = form.querySelector('#' + id); if (!f.value.trim()) missing.push(f); });
      var em = form.querySelector('#vp-email');
      if (missing.length) { status.className = 'vp-status vp-err'; status.textContent = 'Please fill in your first name, last name and email.'; missing[0].focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { status.className = 'vp-status vp-err'; status.textContent = 'Please check your email address.'; em.focus(); return; }
      if (!DATA.formAccessKey) { status.className = 'vp-status vp-err'; status.innerHTML = 'Online enquiries are not switched on yet. Please use our <a href="' + enq + '">enquiry page</a>.'; return; }
      var payload = { access_key: DATA.formAccessKey, page: location.href };
      Array.prototype.forEach.call(form.elements, function (f) { if (f.name && f.type !== 'checkbox') payload[f.name] = f.value.trim(); });
      // Email subject reads like "Aoife Byrne - J.R. Mahon's Enquiry"; the sender shows as the person's name.
      var fullName = payload['First name'] + ' ' + payload['Last name'];
      // Same subject for every enquiry from the same couple, so their emails land in one thread;
      // what they asked about goes in the body instead.
      var tidy = fullName.replace(/\s+/g, ' ').trim().toLowerCase().replace(/(^|[\s'-])([a-z])/g, function (a, b, c) { return b + c.toUpperCase(); });
      payload.subject = tidy + ' - Wedding Day 2 Enquiry';
      var me = curItem(), all = getList().filter(function (x) { return x.key !== me.key; }); all.push(me);
      payload['Enquiry about'] = all.map(function (x, i) { return (all.length > 1 ? (i + 1) + '. ' : '') + x.label; }).join('\n');
      payload.from_name = fullName;
      payload.botcheck = form.querySelector('[name=botcheck]').checked;
      sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
      fetch(FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message || 'failed');
          setTimeout(fitSticky, 0);
          setList([]);
          // tell the Meta pixel a lead came in (for Instagram/Facebook ads)
          try { if (window.fbq) window.fbq('track', 'Lead', { content_name: v.name, content_category: 'Venue' }); } catch (x) {}
          form.innerHTML = '<div class="vp-done"><h2>Thanks, ' + esc(payload['First name']) + '</h2><p>We have your enquiry' + (all.length > 1 ? ' about ' + all.length + ' options' : ' about ' + esc(v.name)) + ' and will be in touch soon by email.</p></div>';
        })
        .catch(function () {
          sendBtn.disabled = false; sendBtn.textContent = 'Send enquiry';
          status.className = 'vp-status vp-err';
          status.innerHTML = 'Your enquiry did not send. Please try again, or use our <a href="' + enq + '">enquiry page</a>.';
        });
    });

    // Videos: stream with hls.js where needed; the video only downloads once someone presses play.
    if (allVideos.length) {
      var setup = function () {
        allVideos.forEach(function (x, i) {
          var el = root.querySelector('video[data-v="' + i + '"]'), src = DATA.videoBase + x.id + '/playlist.m3u8';
          if (!el || el.getAttribute('data-ready')) return;  // page re-drawn or already set up
          el.setAttribute('data-ready', '1');
          var wrap = el.parentNode, btn = wrap.querySelector('.vp-play');
          btn.addEventListener('click', function () { var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); });
          el.addEventListener('play', function () { wrap.classList.add('vp-playing'); el.setAttribute('controls', ''); });
          el.addEventListener('ended', function () { wrap.classList.remove('vp-playing'); });
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ autoStartLoad: false, abrEwmaDefaultEstimate: 6000000, capLevelToPlayerSize: false, maxBufferLength: 10, startFragPrefetch: true });  // start in good quality instead of the lowest
            hls.loadSource(src); hls.attachMedia(el);
            // Start buffering the first few seconds as the video scrolls near the screen, so it plays straight away when tapped
            var started = false, kick = function () { if (!started) { started = true; hls.startLoad(); } };
            el.addEventListener('play', kick, { once: true });
            if ('IntersectionObserver' in window) {
              var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { kick(); io.disconnect(); } }); }, { rootMargin: '300px 0px' });
              io.observe(el);
            }
          } else { el.src = src; }
        });
      };
      if (window.Hls) setup();
      else { var s = document.createElement('script'); s.src = HLS_URL; s.onload = setup; s.onerror = setup; document.head.appendChild(s); }
    }
  }
})();
