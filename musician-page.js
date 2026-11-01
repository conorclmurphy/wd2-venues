/* Wedding Day 2 musician page
   Usage in a Squarespace Code block:
     <div id="musician-page" data-musician="lee"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/musician-page.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Change data-musician to the musician's "slug" from musicians.json.
   Same look as the venue pages. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/musicians.json';
  var VENUES_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venues.json';
  var HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
  var FORM_URL = 'https://api.web3forms.com/submit';
  var FALLBACK_ENQUIRY = 'https://weddingday2.ie/home#enquiremain';
  var root = document.getElementById('musician-page');
  if (!root) return;
  var slug = '';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function firstSentence(t) {
    t = String(t || ''); var re = /[.!?](\s|$)/g, m;
    while ((m = re.exec(t))) { if (!/(^|[\s.])[A-Z]$/.test(t.slice(0, m.index))) return t.slice(0, m.index + 1); }
    return t;
  }

  // Fonts and styles, scoped to #musician-page so they don't affect the rest of the site.
  if (!document.getElementById('vp-fonts')) {
    var f = document.createElement('link');
    f.id = 'vp-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Bitter:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }
  var css = '\
#musician-page{--vp-radius:14px;--vp-radius-sm:10px;--vp-bg:#273030;--vp-surface:#303b3b;--vp-ink:#eae6dd;--vp-muted:#b8b3a8;--vp-line:#3f4b4b;--vp-bottle:#1d2525;--vp-brass:#3dc2bb;--vp-accent-text:#3dc2bb;--vp-on-dark:#eae6dd;\
--vp-display:"Young Serif",Georgia,serif;--vp-body:"Bitter",Georgia,serif;\
background:var(--vp-bg);color:var(--vp-ink);font-family:var(--vp-body);font-size:16px;line-height:1.65;font-weight:400;text-align:left}\
#musician-page[data-theme="light"]{--vp-bg:#eae6dd;--vp-surface:#f1ede2;--vp-ink:#273030;--vp-muted:#505c5c;--vp-line:#d3cec2;--vp-bottle:#273030;--vp-accent-text:#1b7f7a}\
#musician-page *{box-sizing:border-box}\
#musician-page h1,#musician-page h2,#musician-page h3{font-family:var(--vp-display);font-weight:400;letter-spacing:-.01em;text-transform:none;color:inherit;text-wrap:balance}\
#musician-page p{margin:0}\
#musician-page .vp-pad{padding-left:max(16px,4vw);padding-right:max(16px,4vw)}\
#musician-page .vp-hero{position:relative;z-index:0;min-height:min(70vh,600px);display:flex;align-items:flex-end;color:var(--vp-on-dark);background:#273030;overflow:hidden}\
#musician-page .vp-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;max-width:none}\
#musician-page .vp-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(39,48,48,0) 35%,rgba(39,48,48,.85) 100%)}\
#musician-page .vp-hero:before{content:"";position:absolute;left:0;right:0;top:0;height:35%;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(29,37,37,.6) 0%,rgba(29,37,37,0) 100%)}\
#musician-page .vp-hero-in{position:relative;z-index:1;width:100%;padding-top:48px;padding-bottom:40px}\
#musician-page .vp-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}\
#musician-page .vp-hero h1{font-size:clamp(40px,7vw,76px);line-height:1.02;margin:10px 0 12px;color:var(--vp-on-dark)}\
#musician-page .vp-lede{max-width:56ch;font-size:18px;opacity:.92}\
#musician-page .vp-facts{background:var(--vp-bottle);color:var(--vp-on-dark);display:flex;flex-wrap:wrap;gap:20px 40px;align-items:center;padding-top:22px;padding-bottom:22px}\
#musician-page .vp-fact span{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}\
#musician-page .vp-fact strong{font-family:var(--vp-display);font-weight:400;font-size:24px;color:var(--vp-brass)}\
#musician-page .vp-btn{display:inline-block;margin-left:auto;text-decoration:none;font-weight:500;letter-spacing:.04em;padding:14px 26px;border-radius:999px;background:var(--vp-brass);color:#273030;border:0}\
#musician-page .vp-btn:focus-visible,#musician-page button:focus-visible{outline:2px solid var(--vp-brass);outline-offset:3px}\
#musician-page .vp-body{display:grid;grid-template-columns:minmax(0,1fr) clamp(340px,26vw,400px);gap:clamp(40px,4vw,72px);align-items:start;max-width:none;margin:0;padding-top:72px;padding-bottom:72px}\
#musician-page .vp-main{display:grid;gap:72px;min-width:0;container-type:inline-size}\
#musician-page .vp-aside{position:sticky;top:var(--vp-sticky-top,24px);min-width:0}\
#musician-page .vp-main h2{font-size:clamp(28px,4vw,40px);margin:0 0 20px;color:var(--vp-ink)}\
#musician-page .vp-about p{font-size:20px;max-width:62ch}\
#musician-page .vp-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:24px 48px;align-items:start}\
#musician-page .vp-space{display:grid;grid-template-columns:minmax(0,1fr);gap:24px 48px;padding:36px 0;border-bottom:1px solid var(--vp-line);align-items:center}\
#musician-page .vp-space.vp-has-video{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)}\
#musician-page .vp-space{align-items:start}\
#musician-page .vp-space-text{display:grid;gap:10px;min-width:0}\
#musician-page .vp-spaces{border-top:1px solid var(--vp-line)}\
#musician-page .vp-space h3{font-size:24px;margin:0}\
#musician-page .vp-cap{color:var(--vp-accent-text);font-size:14px;font-weight:500}\
#musician-page .vp-space p{color:var(--vp-muted);max-width:62ch}\
#musician-page .vp-capnote{margin-top:20px;font-weight:500;color:var(--vp-accent-text)}\
#musician-page .vp-gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}\
#musician-page .vp-gallery button{padding:0;border:0;background:var(--vp-line);cursor:zoom-in;aspect-ratio:4/3;overflow:hidden;border-radius:var(--vp-radius-sm)}\
#musician-page .vp-gallery img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}\
#musician-page .vp-gallery button:hover img{transform:scale(1.04)}\
#musician-page .vp-space-gallery{grid-column:1/-1;min-width:0}\
#musician-page .vp-gallery.vp-g6{grid-template-columns:repeat(3,minmax(0,1fr))}\
#musician-page .vp-more{margin-top:16px;font:inherit;font-weight:500;background:none;border:1px solid var(--vp-ink);border-radius:999px;color:var(--vp-ink);padding:10px 18px;cursor:pointer}\
#musician-page .vp-video{margin:0;display:grid;gap:8px;min-width:0}\
#musician-page .vp-vwrap{position:relative}\
#musician-page .vp-video video{width:100%;aspect-ratio:16/9;background:#1d2525;display:block;object-fit:cover;border-radius:var(--vp-radius);overflow:hidden}\
#musician-page .vp-play{position:absolute;inset:0;margin:auto;width:76px;height:76px;border-radius:50%;border:0;padding:0;background:var(--vp-brass);color:#273030;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35);transition:transform .15s}\
#musician-page .vp-play:hover{transform:scale(1.08)}\
#musician-page .vp-play svg{width:28px;height:28px;margin-left:4px}\
#musician-page .vp-vwrap.vp-playing .vp-play{display:none}\
#musician-page .vp-video figcaption{font-size:13px;color:var(--vp-muted)}\
#musician-page .vp-loc p{margin-bottom:12px;color:var(--vp-muted)}\
#musician-page .vp-similar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}\
#musician-page .vp-card{display:grid;gap:10px;text-decoration:none;color:inherit;min-width:0}\
#musician-page .vp-card-img{aspect-ratio:4/3;border-radius:var(--vp-radius);overflow:hidden;background:var(--vp-line)}\
#musician-page .vp-card-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}\
#musician-page .vp-card:hover .vp-card-img img{transform:scale(1.04)}\
#musician-page .vp-card h3{font-size:22px;margin:0}\
#musician-page .vp-card p{margin:0;color:var(--vp-muted);font-size:14px}\
#musician-page .vp-card .vp-cap{margin-top:-4px}\
#musician-page .vp-card,#musician-page .vp-card.wd2-hover,#musician-page .vp-card.wd2-hover:hover{box-shadow:none!important;transform:none!important;border-radius:0!important;overflow:visible!important;outline:none}#musician-page .vp-card-img{transition:box-shadow .25s}#musician-page .vp-card:hover .vp-card-img,#musician-page .vp-card:focus-visible .vp-card-img{box-shadow:0 0 0 3px var(--vp-brass),0 8px 24px rgba(0,0,0,.35)}\
@container (max-width:460px){#musician-page .vp-similar{grid-template-columns:1fr}}\
#musician-page .vp-loc a{color:var(--vp-accent-text);font-weight:500}\
#musician-page .vp-map{width:100%;max-width:640px;height:300px;border:1px solid var(--vp-line);border-radius:var(--vp-radius);display:block;margin-bottom:12px;background:var(--vp-line)}\
#musician-page .vp-form{background:var(--vp-surface);border:1px solid var(--vp-line);border-radius:20px;padding:20px 22px;display:grid;gap:9px;scroll-margin-top:24px}\
#musician-page .vp-form h2{font-size:22px;margin:0 0 2px}\
#musician-page .vp-form .vp-sub{color:var(--vp-muted);font-size:14px;margin-top:-6px}\
#musician-page .vp-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}\
#musician-page .vp-field{display:grid;gap:4px;min-width:0}\
#musician-page .vp-field label{font-size:12.5px;font-weight:500;color:var(--vp-ink)}\
#musician-page .vp-field label i{font-style:normal;color:var(--vp-muted);font-weight:400}\
#musician-page .vp-field input,#musician-page .vp-field select,#musician-page .vp-field textarea{font:inherit;font-size:15px;width:100%;padding:7px 13px;border:1px solid var(--vp-line);border-radius:var(--vp-radius-sm);background:var(--vp-bg);color:var(--vp-ink);color-scheme:dark}\
#musician-page[data-theme="light"] .vp-field input,#musician-page[data-theme="light"] .vp-field select,#musician-page[data-theme="light"] .vp-field textarea{color-scheme:light}\
#musician-page .vp-field textarea{min-height:58px;resize:vertical}\
#musician-page .vp-field input,#musician-page .vp-field select{display:block;height:40px;min-height:40px;line-height:22px;margin:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}\
#musician-page .vp-field input[type=date]{text-align:left;min-width:0}\
#musician-page .vp-field input[type=date]::-webkit-date-and-time-value{text-align:left;margin:0}\
#musician-page .vp-field input[type=date]::-webkit-datetime-edit{padding:0;line-height:22px}\
#musician-page .vp-field input[type=date]::-webkit-calendar-picker-indicator{opacity:.7;cursor:pointer;filter:invert(1)}\
#musician-page[data-theme="light"] .vp-field input[type=date]::-webkit-calendar-picker-indicator{filter:none}\
#musician-page .vp-field select{padding-right:36px;cursor:pointer;background-repeat:no-repeat;background-position:right 13px center;background-size:12px;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1 1l5 5 5-5%27 fill=%27none%27 stroke=%27%233dc2bb%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E")}\
#musician-page .vp-field input:focus,#musician-page .vp-field select:focus,#musician-page .vp-field textarea:focus{outline:2px solid var(--vp-brass);outline-offset:0;border-color:transparent}\
#musician-page .vp-form .vp-btn{padding-top:12px;padding-bottom:12px;margin:4px 0 0;width:100%;font:inherit;font-weight:500;cursor:pointer}\
#musician-page .vp-form .vp-btn[disabled]{opacity:.6;cursor:wait}\
#musician-page .vp-status{font-size:14px;margin:0}\
#musician-page .vp-status a{color:inherit;text-decoration:underline}\
#musician-page .vp-status.vp-err{color:#f0a48c}\
#musician-page .vp-done{display:grid;gap:8px}\
#musician-page .vp-done h2{color:var(--vp-brass)}\
#musician-page .vp-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}\
@container (max-width:640px){#musician-page .vp-space.vp-has-video,#musician-page .vp-split{grid-template-columns:1fr}}\
#musician-page .vp-sheet-bar{display:none}\
@media (max-width:1000px){\
#musician-page .vp-body{grid-template-columns:1fr;padding-bottom:110px}\
#musician-page .vp-aside{position:fixed;left:0;right:0;bottom:0;top:auto;z-index:9998;pointer-events:none;padding:0 max(12px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px))}\
#musician-page .vp-sheet{pointer-events:auto;max-width:560px;margin:0 auto;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.4)}\
#musician-page .vp-sheet-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:15px 22px;border:0;border-radius:999px;background:var(--vp-brass);color:#273030;font:inherit;font-weight:600;font-size:16px;cursor:pointer;text-align:left}\
#musician-page .vp-sheet-bar svg{width:20px;height:20px;flex:none;transition:transform .2s}\
#musician-page .vp-sheet .vp-form{display:none}\
#musician-page .vp-open .vp-sheet{background:var(--vp-surface);border:1px solid var(--vp-line);max-height:calc(100vh - var(--vp-sheet-top,24px) - 12px);max-height:calc(100dvh - var(--vp-sheet-top,24px) - 12px)}\
#musician-page .vp-open .vp-sheet-bar{border-radius:0;background:var(--vp-surface);color:var(--vp-ink);border-bottom:1px solid var(--vp-line);font-family:var(--vp-display);font-weight:400;font-size:20px}\
#musician-page .vp-open .vp-sheet-bar svg{transform:rotate(180deg);color:var(--vp-brass)}\
#musician-page .vp-open .vp-sheet .vp-form{display:grid;border:0;border-radius:0;overflow-y:auto;overscroll-behavior:contain}#musician-page .vp-aside.vp-open{top:var(--vp-sheet-top,12px)}#musician-page .vp-aside.vp-open .vp-sheet{height:100%;max-height:none}#musician-page .vp-aside.vp-open .vp-form{flex:1 1 auto;min-height:0;-webkit-overflow-scrolling:touch;padding-bottom:40px}html.vp-lock,html.vp-lock body{overflow:hidden!important;overscroll-behavior:none}#musician-page .vp-open .vp-sheet-bar.vp-pulse{animation:none}\
#musician-page .vp-sheet .vp-form h2{display:none}\
}\
#musician-page .vp-lb{position:fixed;inset:0;z-index:99999;background:rgba(39,48,48,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px}\
#musician-page .vp-lb[hidden]{display:none}\
#musician-page .vp-lb img{max-height:78vh;max-width:100%;object-fit:contain;border-radius:var(--vp-radius)}\
#musician-page .vp-lb-bar{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;align-items:center;color:var(--vp-on-dark)}\
#musician-page .vp-lb-bar button{font:inherit;border-radius:999px;background:none;border:1px solid rgba(234,230,221,.4);color:var(--vp-on-dark);padding:8px 14px;cursor:pointer}\
#musician-page .vp-msg{padding:40px 16px;color:var(--vp-muted)}\
@media (max-width:760px){#musician-page .vp-space.vp-has-video,#musician-page .vp-split{grid-template-columns:1fr}}\
@media (max-width:640px){#musician-page .vp-gallery,#musician-page .vp-gallery.vp-g6{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-play{width:60px;height:60px}#musician-page .vp-row{gap:10px}#musician-page .vp-main{gap:56px}#musician-page .vp-body{padding-top:52px;padding-bottom:52px;gap:56px}#musician-page .vp-btn{margin-left:0}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
  var st2 = document.createElement('style');
  st2.textContent = '\
#musician-page .vp-about p+p{margin-top:16px}\
#musician-page .vp-about p{font-size:18px}\
#musician-page .vp-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}\
#musician-page .vp-tag{display:inline-block;padding:6px 14px;border-radius:999px;border:1px solid var(--vp-line);color:var(--vp-accent-text);font-size:13.5px;font-weight:500}\
#musician-page .vp-similar.vp-three{grid-template-columns:repeat(3,minmax(0,1fr))}\
#musician-page .vp-card-img{aspect-ratio:4/3}\
#musician-page .vp-videos{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:20px;align-items:start}\
#musician-page .vp-videos .vp-video:not(.vp-tall){grid-column:span 2}\
#musician-page .vp-video.vp-tall video{aspect-ratio:9/16;object-fit:cover}\
#musician-page .vp-video.vp-tall{width:100%;max-width:340px}\
#musician-page .vp-h2row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 20px;margin-bottom:18px}#musician-page .vp-h2row h2{margin:0}\
#musician-page .vp-btn.vp-btn-ghost{background:transparent;color:var(--vp-brass);border:1.5px solid var(--vp-brass);padding:9px 18px;font-size:14px}#musician-page .vp-btn.vp-btn-ghost:hover{background:var(--vp-brass);color:#273030}\
#musician-page video:fullscreen{object-fit:contain!important;aspect-ratio:auto!important;width:100%!important;height:100%!important;max-width:none!important;border-radius:0!important;background:#000}\
#musician-page video:-webkit-full-screen{object-fit:contain!important;aspect-ratio:auto!important;width:100%!important;height:100%!important;max-width:none!important;border-radius:0!important;background:#000}\
#musician-page .vp-split.vp-split-tall{grid-template-columns:minmax(0,1fr) minmax(220px,320px)}\
#musician-page .vp-split.vp-split-tall .vp-video.vp-tall{justify-self:end}\
@container (max-width:640px){#musician-page .vp-similar.vp-three{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-videos{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#musician-page .vp-videos .vp-video:not(.vp-tall){grid-column:1/-1}#musician-page .vp-split.vp-split-tall{grid-template-columns:1fr}#musician-page .vp-split.vp-split-tall .vp-video.vp-tall{justify-self:center;max-width:320px}}\
@container (max-width:380px){#musician-page .vp-similar.vp-three{grid-template-columns:1fr}}\
@media (min-width:900px){#musician-page .vp-hero.vp-portrait{background:#000}#musician-page .vp-hero img{left:auto;right:0;width:60%;-webkit-mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 18%,#000 42%);mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 18%,#000 42%)}#musician-page .vp-hero:after{background:linear-gradient(180deg,rgba(39,48,48,0) 60%,rgba(39,48,48,.7) 100%)}#musician-page .vp-hero.vp-portrait:after{background:linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(0,0,0,.6) 100%)}#musician-page .vp-hero.vp-portrait:before{background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.15) 30%,rgba(0,0,0,.15) 100%)}#musician-page .vp-hero:not(.vp-portrait) img{width:100%;-webkit-mask-image:none;mask-image:none}#musician-page .vp-hero.vp-portrait img{width:75%;-webkit-mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 12%,#000 30%);mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 12%,#000 30%)}}\
@media (max-width:899px){#musician-page .vp-hero{min-height:330px}#musician-page .vp-hero-in{padding-top:24px;padding-bottom:20px}#musician-page .vp-hero h1{font-size:44px;margin-bottom:0}#musician-page .vp-facts{gap:10px 24px;padding-top:14px;padding-bottom:16px}#musician-page .vp-fact strong{font-size:17px;line-height:1.35}#musician-page .vp-fact span{font-size:10px;margin-bottom:2px}}\
#musician-page .vp-hero:before,#musician-page .vp-hero.vp-portrait:before{top:0;bottom:0;height:auto;background:linear-gradient(90deg,rgba(10,14,14,.55) 0%,rgba(10,14,14,.2) 55%,rgba(10,14,14,0) 80%),linear-gradient(180deg,rgba(10,14,14,.55) 0%,rgba(10,14,14,.3) 30%,rgba(10,14,14,.4) 70%,rgba(10,14,14,.7) 100%)}#musician-page .vp-facts{align-items:flex-end}#musician-page .vp-facts .vp-btn{margin-left:0}\
@media (max-width:899px){#musician-page .vp-facts .vp-btn{padding:9px 18px;font-size:14px;letter-spacing:.02em}}#musician-page .vp-hero .vp-facts{background:none;padding:0;margin-top:18px;text-shadow:0 1px 8px rgba(0,0,0,.55)}#musician-page .vp-hero .vp-facts .vp-btn{text-shadow:none}#musician-page .vp-hero h1{margin-bottom:0}#musician-page .vp-similar.vp-two{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-card[hidden]{display:none}#musician-page .vp-pk-step[hidden],#musician-page .vp-field[hidden],#musician-page .vp-lineup[hidden]{display:none}#musician-page .vp-pk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}#musician-page .vp-pk{font:inherit;color:var(--vp-on-dark);text-align:left;cursor:pointer;background:none;border:0;padding:0;display:grid;gap:6px}#musician-page .vp-pk .vp-card-img{position:relative;aspect-ratio:3/2;transition:box-shadow .2s}#musician-page .vp-pk:hover .vp-card-img,#musician-page .vp-pk.vp-picked .vp-card-img{box-shadow:0 0 0 3px var(--vp-brass)}#musician-page .vp-pk.vp-picked .vp-tick{display:grid}#musician-page .vp-pk strong{font-family:var(--vp-display);font-weight:400;font-size:20px;margin-top:4px}#musician-page .vp-pk>span:not(.vp-tick){color:var(--vp-muted);font-size:14px;line-height:1.45}#musician-page .vp-pk-meta{font-style:normal;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--vp-brass)}#musician-page .vp-pk-price{font-weight:600;color:var(--vp-on-dark);font-size:16px;margin-top:2px}#musician-page .vp-pk-add small{font-family:var(--vp-body);font-size:14px;color:var(--vp-brass);margin-left:6px}#musician-page .vp-pk-total{margin-top:24px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}#musician-page .vp-pk-total[hidden]{display:none}#musician-page .vp-pk-total span{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-muted)}#musician-page .vp-pk-total strong{font-family:var(--vp-display);font-weight:400;font-size:30px;color:var(--vp-on-dark)}#musician-page .vp-any-img{display:grid;place-items:center;background:rgba(61,194,187,.1);border:2px dashed rgba(61,194,187,.5)}#musician-page .vp-any-img>span:first-child{font-family:var(--vp-display);font-size:30px;color:var(--vp-brass)}#musician-page .vp-any-sub{font-size:13px;color:var(--vp-muted)}#musician-page .vp-lineups.vp-whens{grid-template-columns:repeat(3,minmax(0,1fr))}#musician-page .vp-whens .vp-lineup{padding:18px}#musician-page .vp-whens .vp-lineup strong{font-size:21px}@container (max-width:640px){#musician-page .vp-lineups.vp-whens{grid-template-columns:1fr}}#musician-page .vp-when-hint{margin:22px 0 -8px;color:var(--vp-on-dark);font-weight:500}#musician-page .vp-pk-tag{font:inherit;font-size:15px;padding:10px 20px;background:transparent;cursor:pointer;transition:background .2s,border-color .2s,color .2s}#musician-page .vp-pk-tag:hover{border-color:var(--vp-brass)}#musician-page .vp-pk-tag.vp-picked{background:var(--vp-brass);border-color:var(--vp-brass);color:#273030}#musician-page .vp-pk-tag.vp-picked:before{content:"\\2713  "}#musician-page .vp-pk-solo{font:inherit;color:var(--vp-on-dark);cursor:pointer;position:relative;width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;text-align:left;padding:24px 26px;border-radius:var(--vp-radius);border:2px solid rgba(234,230,221,.18);background:rgba(234,230,221,.05);transition:border-color .2s,background .2s}#musician-page .vp-pk-solo:hover{border-color:var(--vp-brass)}#musician-page .vp-pk-solo.vp-picked{border-color:var(--vp-brass);background:rgba(61,194,187,.12)}#musician-page .vp-pk-solo-l{display:grid;gap:4px}#musician-page .vp-pk-solo strong{font-family:var(--vp-display);font-weight:400;font-size:28px}#musician-page .vp-pk-solo-l span{color:var(--vp-muted);font-size:15px}#musician-page .vp-pk-solo b{font-size:20px;white-space:nowrap;margin-right:34px}#musician-page .vp-pk-solo .vp-tick{top:50%;right:18px;margin-top:-15px}#musician-page .vp-pk-solo.vp-picked .vp-tick{display:grid}#musician-page .vp-lineups.vp-extras{grid-template-columns:repeat(3,minmax(0,1fr))}#musician-page .vp-pk-linewrap,#musician-page .vp-pk-djwrap{margin-top:26px}#musician-page .vp-pk-linewrap[hidden],#musician-page .vp-pk-djwrap[hidden]{display:none}#musician-page .vp-pk-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}#musician-page .vp-pk-row .vp-pk strong{font-size:18px}#musician-page .vp-pk-row .vp-pk{opacity:.7;transition:opacity .45s,filter .45s,transform .45s}#musician-page .vp-pk-row .vp-pk:hover{opacity:1}#musician-page .vp-pk-row.vp-has-pick .vp-pk:not(.vp-picked){opacity:.22;filter:grayscale(1);transform:scale(.96)}#musician-page .vp-pk-row.vp-has-pick .vp-pk:not(.vp-picked):hover{opacity:.5}#musician-page .vp-pk-row .vp-pk.vp-picked{opacity:1;filter:none;transform:translateY(-4px)}@keyframes vpRise{0%{opacity:0;transform:translateY(26px)}100%{opacity:1;transform:none}}#musician-page .vp-pk-sum.vp-rise{animation:vpRise .6s cubic-bezier(.2,.8,.2,1)}#musician-page .vp-pk-tname{font-family:var(--vp-display);font-size:18px;color:var(--vp-on-dark)}@container (max-width:640px){#musician-page .vp-pk-row{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-lineups.vp-extras{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}}#musician-page .vp-pk-next{position:sticky;bottom:16px;z-index:3;margin-top:22px;display:flex;align-items:center;justify-content:space-between;gap:12px 18px;flex-wrap:wrap;padding:12px 12px 12px 20px;border-radius:999px;background:#1d2525;border:1px solid var(--vp-brass);box-shadow:0 10px 30px rgba(0,0,0,.45)}#musician-page .vp-pk-next[hidden]{display:none}#musician-page .vp-pk-next-t{font-size:14px;color:var(--vp-on-dark);min-width:0}#musician-page .vp-pk-next .vp-btn{margin:0;padding:11px 22px}@media (max-width:1000px){#musician-page .vp-pk-next{bottom:84px;border-radius:22px}}#musician-page .vp-explore[hidden]{display:none}#musician-page .vp-pk-lp{display:block;margin-top:6px;color:var(--vp-brass);font-weight:500}#musician-page .vp-pk-starts{display:grid;gap:14px}#musician-page .vp-pk-from{font-size:18px;color:var(--vp-brass);font-weight:500}#musician-page .vp-nosolo-img{background:rgba(234,230,221,.04);border-color:rgba(234,230,221,.3)}#musician-page .vp-nosolo-img>span:first-child{color:var(--vp-muted)}#musician-page .vp-pk-nosolo.vp-picked .vp-card-img,#musician-page .vp-pk-any.vp-picked .vp-card-img{border-style:solid;border-color:var(--vp-brass)}#musician-page .vp-pk-nosolo.vp-picked .vp-tick,#musician-page .vp-pk-any.vp-picked .vp-tick{display:grid}#musician-page .vp-pk-sum{margin-top:14px;padding:18px 22px;border-radius:var(--vp-radius);background:rgba(234,230,221,.05);border:1px solid rgba(234,230,221,.14);max-width:620px}#musician-page .vp-pk-sum[hidden]{display:none}#musician-page .vp-pk-sum h3{font-size:18px;margin:0 0 10px;color:var(--vp-on-dark)}#musician-page .vp-pk-sum ul{margin:0;padding:0;list-style:none;display:grid;gap:8px}#musician-page .vp-pk-sum li{position:relative;padding-left:26px;color:var(--vp-on-dark);font-size:15px;line-height:1.45}#musician-page .vp-pk-sum li:before{content:"\\2713";position:absolute;left:0;top:0;color:var(--vp-brass);font-weight:700}#musician-page .vp-lineup.vp-has-img{padding:0 0 18px;overflow:hidden;align-content:start}#musician-page .vp-lineup.vp-has-img>strong,#musician-page .vp-lineup.vp-has-img>span:not(.vp-x-img){padding:0 20px}#musician-page .vp-pk-djwrap .vp-x-img{aspect-ratio:16/7}#musician-page .vp-pk-djwrap .vp-lineups{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-has-img>strong{font-size:21px}#musician-page .vp-x-img{display:block;aspect-ratio:16/10;overflow:hidden;margin-bottom:8px;background:var(--vp-line)}#musician-page .vp-x-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}#musician-page .vp-lineup.vp-has-img:hover .vp-x-img img{transform:scale(1.04)}@keyframes vpFlash{0%{box-shadow:0 0 0 0 rgba(61,194,187,.0)}25%{box-shadow:0 0 0 4px rgba(61,194,187,.9),0 0 40px rgba(61,194,187,.45)}100%{box-shadow:0 0 0 0 rgba(61,194,187,0)}}#musician-page .vp-form.vp-flash{animation:vpFlash 1.8s ease-out 2}#musician-page .vp-form.vp-flash #vp-fname{border-color:var(--vp-brass)}@keyframes vpPulse{0%{box-shadow:0 0 0 0 rgba(61,194,187,0)}35%{box-shadow:0 0 0 3px rgba(61,194,187,.85),0 0 26px rgba(61,194,187,.35)}100%{box-shadow:0 0 0 0 rgba(61,194,187,0)}}#musician-page .vp-form.vp-pulse,#musician-page .vp-sheet-bar.vp-pulse{animation:vpPulse .9s ease-out 2}#musician-page .vp-sheet-bar.vp-bar-msg span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 30px)}#musician-page .vp-pk-tradwrap,#musician-page .vp-pk-tradwrap[hidden]{margin-top:22px}#musician-page .vp-pk-tradwrap[hidden]{display:none}#musician-page .vp-pk-pills{display:flex;flex-wrap:wrap;gap:10px}#musician-page .vp-pk-pill{font:inherit;cursor:pointer;padding:10px 18px;border-radius:999px;border:2px solid rgba(234,230,221,.22);background:rgba(234,230,221,.05);color:var(--vp-on-dark);font-size:15px;text-align:left;transition:border-color .2s,background .2s}#musician-page .vp-pk-pill strong{font-weight:600}#musician-page .vp-pk-pill span{color:var(--vp-muted);font-size:14px}#musician-page .vp-pk-pill:hover{border-color:var(--vp-brass)}#musician-page .vp-pk-pill.vp-picked{border-color:var(--vp-brass);background:var(--vp-brass);color:#273030}#musician-page .vp-pk-pill.vp-picked span{color:#273030}#musician-page .vp-pk-btns{display:flex;flex-wrap:wrap;gap:12px;align-items:center}#musician-page .vp-pk-reset{font:inherit;cursor:pointer;margin:0;padding:12px 22px;font-size:15px}#musician-page .vp-pk-cta{display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin-top:18px}#musician-page .vp-pk-cta .vp-btn{margin:0;position:static}#musician-page .vp-pk-foot{margin:0;font-size:16px;line-height:1.55;color:var(--vp-on-dark);opacity:.85;max-width:620px}#musician-page .vp-pk-group{font-size:22px;margin:30px 0 6px;color:var(--vp-on-dark)}#musician-page .vp-build h2+.vp-pk-group{margin-top:0}#musician-page .vp-pk-small{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}#musician-page .vp-pk-small .vp-pk{padding:18px;border-radius:var(--vp-radius);border:2px solid rgba(234,230,221,.18);background:rgba(234,230,221,.05);align-content:start}#musician-page .vp-pk-small .vp-pk:hover,#musician-page .vp-pk-small .vp-pk.vp-picked{border-color:var(--vp-brass)}#musician-page .vp-pk-small .vp-pk.vp-picked{background:rgba(61,194,187,.12)}#musician-page .vp-pk-small .vp-pk-price{font-size:13px;font-weight:500;color:var(--vp-brass)}@container (max-width:640px){#musician-page .vp-pk-small{grid-template-columns:repeat(2,minmax(0,1fr))}}@container (max-width:640px){#musician-page .vp-pk-grid{grid-template-columns:1fr}}#musician-page .vp-step{display:inline-block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);margin-bottom:6px}#musician-page .vp-build h2{margin-bottom:18px}#musician-page .vp-build .vp-h2row{margin-bottom:6px}#musician-page .vp-build .vp-h2row h2{margin-bottom:0}#musician-page .vp-build-note{margin:-6px 0 18px;color:var(--vp-muted)}#musician-page .vp-lineups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}#musician-page .vp-lineup{font:inherit;text-align:left;cursor:pointer;display:grid;gap:6px;padding:22px 24px;border-radius:var(--vp-radius);background:rgba(234,230,221,.05);border:2px solid rgba(234,230,221,.18);color:var(--vp-on-dark);transition:border-color .2s,background .2s}#musician-page .vp-lineup strong{font-family:var(--vp-display);font-weight:400;font-size:26px;color:var(--vp-on-dark)}#musician-page .vp-lineup span{color:var(--vp-muted);font-size:15px;line-height:1.45}#musician-page .vp-lineup:hover{border-color:var(--vp-brass)}#musician-page .vp-lineup.vp-picked{border-color:var(--vp-brass);background:rgba(61,194,187,.12)}#musician-page .vp-performers{grid-template-columns:repeat(4,minmax(0,1fr));gap:18px 14px}#musician-page .vp-performer{gap:6px}#musician-page .vp-pick{font:inherit;color:inherit;background:none;border:0;padding:0;text-align:left;cursor:pointer;display:grid;gap:8px}#musician-page .vp-pick h3{font-size:19px}#musician-page .vp-performer a{font-size:13px;color:var(--vp-brass);text-decoration:none}#musician-page .vp-pick .vp-card-img{position:relative;transition:box-shadow .2s}#musician-page .vp-pick:hover .vp-card-img{box-shadow:0 0 0 3px var(--vp-brass)}#musician-page .vp-tick{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;background:var(--vp-brass);color:#273030;display:none;place-items:center;font-weight:700}#musician-page .vp-pick.vp-picked .vp-card-img{box-shadow:0 0 0 3px var(--vp-brass)}#musician-page .vp-pick.vp-picked .vp-tick{display:grid}@container (max-width:640px){#musician-page .vp-performers{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-lineups{grid-template-columns:1fr}}@container (min-width:461px){#musician-page .vp-split.vp-split-tall{grid-template-columns:minmax(0,1fr) minmax(200px,260px)!important;gap:24px 32px;align-items:center}#musician-page .vp-split.vp-split-tall .vp-video.vp-tall{justify-self:end;max-width:260px}}';
  document.head.appendChild(st2);

  var keyHandler = null;

  function load() {
    slug = (root.getAttribute('data-musician') || '').trim().toLowerCase();
    root.innerHTML = '<div class="vp-msg">Loading…</div>';
    var getData = window.WD2_MUSICIANS ? Promise.resolve(window.WD2_MUSICIANS)
      : fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    getData
      .then(function (DATA) {
        var m = null;
        for (var i = 0; i < DATA.musicians.length; i++) if (DATA.musicians[i].slug === slug) m = DATA.musicians[i];
        if (!m) { root.innerHTML = '<div class="vp-msg">No musician called "' + esc(slug) + '" in musicians.json. Check the data-musician name in this code block.</div>'; return; }
        render(DATA, m);
      })
      .catch(function () {
        root.innerHTML = '<div class="vp-msg">Musician details could not be loaded. Please refresh the page.</div>';
      });
  }
  window.WD2MusicianPageReload = load;
  load();

  function render(DATA, m) {
    var img = function (p, w) { return DATA.imageBase + p + '?format=' + w + 'w'; };
    var L = DATA.eventLabels || { ceremony: 'Ceremony & drinks reception', day2: 'Day 2', afterdinner: 'After dinner' };
    var ORDER = ['ceremony', 'day2', 'afterdinner'];
    var sets = [];
    var bio = m.bio || [];
    var vids = m.videos || [];
    var events = ORDER.filter(function (e) { return (m.events || []).indexOf(e) !== -1; });
    var extras = [];
    if (m.tradBand) extras.push('Trad band');
    if (m.duo) extras.push('Duo');

    var h = '';
    var pos = m.photoPosition ? ' style="object-position:' + esc(m.photoPosition) + '"' : '';
    h += '<header class="vp-hero"><img src="' + img(m.photo, 2500) + '" alt="' + esc(m.name) + '"' + pos + '>';
    h += '<div class="vp-hero-in vp-pad"><div class="vp-eyebrow">Wedding Day 2 · ' + esc(m.eyebrow || 'Live musician') + '</div>';
    h += '<h1>' + esc(m.name) + '</h1>';

    h += '<div class="vp-facts">';
    if (m.facts) m.facts.forEach(function (f) { h += '<div class="vp-fact"><span>' + esc(f.label) + '</span><strong>' + esc(f.value) + '</strong></div>'; });
    else {
      h += '<div class="vp-fact"><span>Plays at</span><strong>' + esc(events.map(function (e) { return L[e]; }).join(' · ') || 'Ask us') + '</strong></div>';
      if (extras.length) h += '<div class="vp-fact"><span>Also available</span><strong>' + esc(extras.join(' · ')) + '</strong></div>';
    }
    h += '<a class="vp-btn" href="#vp-enquire">Check availability</a></div></div></header>';

    var allVideos = [];
    function videoTag(x, label) {
      var mm = x.seconds ? Math.floor(x.seconds / 60) + ':' + ('0' + Math.round(x.seconds % 60)).slice(-2) : '';
      allVideos.push(x);
      return '<figure class="vp-video' + (x.shape === 'tall' ? ' vp-tall' : '') + '"><div class="vp-vwrap"><video data-v="' + (allVideos.length - 1) + '" playsinline preload="none" poster="' + (x.poster ? img(x.poster, 1500) : DATA.videoBase + x.id + '/thumbnail') + '" aria-label="Video of ' + esc(label) + '"></video>'
        + '<button type="button" class="vp-play" aria-label="Play video of ' + esc(label) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 4l15 8-15 8z"/></svg></button></div><figcaption>' + esc(x.title || (label + ' live')) + (mm ? ' · ' + mm : '') + '</figcaption></figure>';
    }
    function galleryTag(list, label) {
      if (!list || !list.length) return '';
      var n = list.length >= 6 ? 6 : list.length >= 4 ? 4 : list.length;
      var si = sets.push(list) - 1, shown = list.slice(0, n);
      var g = '<div class="vp-gallery' + (n === 6 ? ' vp-g6' : '') + '" data-set="' + si + '">';
      shown.forEach(function (p, i) {
        g += '<button type="button" data-set="' + si + '" data-i="' + i + '" aria-label="Open photo ' + (i + 1) + ' of ' + list.length + ' of ' + esc(label) + '"><img loading="lazy" src="' + img(p, 750) + '" alt="' + esc(label) + ' photo ' + (i + 1) + '"></button>';
      });
      g += '</div>';
      if (list.length > shown.length) g += '<button class="vp-more" type="button" data-set="' + si + '" data-i="0">View all ' + list.length + ' photos</button>';
      return g;
    }

    h += '<div class="vp-body vp-pad"><div class="vp-main">';

    // About, with the first video beside it when there is one
    if (m.packages) var tags = '<p class="vp-build-note vp-when-hint">' + esc(m.packages.whenHint || 'When do you need music? Tap all that apply.') + '</p><div class="vp-tags vp-when-tags">'
      + events.map(function (e) { return '<button type="button" class="vp-tag vp-pk-tag" data-when="' + esc(e) + '" aria-pressed="false">' + esc(L[e]) + '</button>'; }).join('') + '</div>';
    else var tags = '<div class="vp-tags">' + events.map(function (e) { return '<span class="vp-tag">' + esc(L[e]) + '</span>'; }).join('')
      + extras.concat(m.tags || []).map(function (x) { return '<span class="vp-tag">' + esc(x) + '</span>'; }).join('') + '</div>';
    var aboutText = '<h2>' + esc(m.aboutTitle || ('About ' + m.name)) + '</h2>' + (bio.length ? bio.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') : '<p>' + esc(m.name) + ' is one of the live musicians on the Wedding Day 2 roster. Get in touch to hear more and check availability for your date.</p>') + tags;
    if (vids.length) h += '<section class="vp-about vp-split' + (vids[0].shape === 'tall' ? ' vp-split-tall' : '') + '"><div>' + aboutText + '</div>' + videoTag(vids[0], m.name) + '</section>';
    else h += '<section class="vp-about">' + aboutText + '</section>';

    if (vids.length > 1) {
      h += '<section><h2>More videos</h2><div class="vp-videos">';
      vids.slice(1).forEach(function (x) { h += videoTag(x, m.name); });
      h += '</div></section>';
    }

    if (m.gallery && m.gallery.length) h += '<section><h2>Gallery</h2>' + galleryTag(m.gallery, m.name) + '</section>';

    // Build-your-band pages (the trad band): step 1 pick the line-up, step 2 pick the solo performer
    if (m.builder) {
      var b = m.builder;
      h += '<section class="vp-build"><span class="vp-step">Step 1</span><h2>' + esc(b.step1 || 'Choose your line-up') + '</h2><div class="vp-lineups">';
      b.lineups.forEach(function (x) {
        h += '<button type="button" class="vp-lineup" data-lineup="' + esc(x.title) + '" data-needs="' + esc(x.needs || '') + '"><strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + '</span></button>';
      });
      h += '</div></section>';
      var needsAny = b.lineups.map(function (x) { return x.needs; }).filter(Boolean);
      var pool = DATA.musicians.filter(function (o) { return o.live && o.url && o.listed !== false && o.slug !== m.slug && (!needsAny.length || needsAny.some(function (k) { return o[k]; })); });
      h += '<section class="vp-build"><span class="vp-step">Step 2</span><div class="vp-h2row"><h2>' + esc(b.step2 || 'Pick your solo performer') + '</h2></div>'
        + (b.step2Text ? '<p class="vp-build-note">' + esc(b.step2Text) + '</p>' : '') + '<div class="vp-similar vp-performers">';
      pool.forEach(function (o) {
        h += '<div class="vp-card vp-performer" data-can="' + esc(needsAny.filter(function (k) { return o[k]; }).join(' ')) + '"><button type="button" class="vp-pick" data-name="' + esc(o.name) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(o.photo, 500) + '" alt="' + esc(o.name) + '"' + (o.photoPosition ? ' style="object-position:' + esc(o.photoPosition) + '"' : '') + '><span class="vp-tick" aria-hidden="true">✓</span></div><h3>' + esc(o.name) + '</h3></button>'
          + '<a href="' + esc(o.url) + '" target="_blank" rel="noopener">View profile →</a></div>';
      });
      h += '</div></section>';
    }

    // Packages page: 1 choose solo musician(s) (or "no solo musician" -> trad band / DJ), then extras; the matching package lights up
    if (m.packages) {
      var P = m.packages, euro = function (n) { return '€' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
      var perf = DATA.musicians.filter(function (o) { return o.live && o.url && o.listed !== false && o.photo && o.slug !== m.slug && o.events; });
      h += '<section class="vp-build vp-pk-step" data-step="musician"><span class="vp-step"></span><div class="vp-h2row"><h2 class="vp-pk-mtitle">Choose your solo musician</h2><span class="vp-pk-from">From ' + euro(P.soloFrom) + '</span></div><p class="vp-build-note vp-pk-mnote"></p><div class="vp-similar vp-performers">'
        + '<div class="vp-card vp-performer vp-any-card"><button type="button" class="vp-pick vp-pk-any"><div class="vp-card-img vp-any-img"><span>Any</span><span class="vp-tick" aria-hidden="true">✓</span></div><h3>No preference</h3></button><span class="vp-any-sub">We\'ll match you with whoever is free</span></div>'
        + '<div class="vp-card vp-performer vp-any-card vp-nosolo-card"><button type="button" class="vp-pick vp-pk-nosolo"><div class="vp-card-img vp-any-img vp-nosolo-img"><span>None</span><span class="vp-tick" aria-hidden="true">✓</span></div><h3>No solo musician</h3></button><span class="vp-any-sub">Choose a trad band or DJ instead</span></div>';
      perf.forEach(function (o) {
        h += '<div class="vp-card vp-performer" data-duo="' + (o.duo ? 1 : 0) + '" data-tradband="' + (o.tradBand ? 1 : 0) + '"><button type="button" class="vp-pick vp-pk-pick" data-name="' + esc(o.name) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(o.photo, 500) + '" alt="' + esc(o.name) + '"' + (o.photoPosition ? ' style="object-position:' + esc(o.photoPosition) + '"' : '') + '><span class="vp-tick" aria-hidden="true">✓</span></div><h3>' + esc(o.name) + '</h3></button>'
          + '<a href="' + esc(o.url) + '" target="_blank" rel="noopener">View profile →</a></div>';
      });
      h += '</div><div class="vp-pk-next" data-next="extras" hidden><span class="vp-pk-next-t"></span><button type="button" class="vp-btn">Next: add extras ↓</button></div></section>';
      h += '<section class="vp-build vp-pk-step" data-step="alt" hidden><span class="vp-step"></span><h2>What would you like instead?</h2><div class="vp-pk-starts">';
      P.alts.forEach(function (x) {
        h += '<button type="button" class="vp-pk-solo vp-pk-alt" data-start="' + esc(x.id) + '"><span class="vp-pk-solo-l"><strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + '</span></span><b>' + esc(x.price) + '</b><span class="vp-tick" aria-hidden="true">✓</span></button>';
      });
      h += '</div></section>';
      h += '<section class="vp-build vp-pk-step" data-step="style" hidden><span class="vp-step"></span><h2>Which style?</h2><div class="vp-lineups vp-extras">';
      P.styles.forEach(function (x) { h += '<button type="button" class="vp-lineup vp-pk-style" data-style="' + esc(x.title) + '"><strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + '</span></button>'; });
      h += '</div></section>';
      h += '<section class="vp-build vp-pk-step" data-step="lineup" hidden><span class="vp-step"></span><h2 class="vp-pk-ltitle">Choose your trad band line-up</h2><p class="vp-build-note vp-pk-lnote"></p><div class="vp-lineups">';
      P.lineups.forEach(function (x) { h += '<button type="button" class="vp-lineup vp-pk-line" data-lineup="' + esc(x.title) + '"><strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + (x.price ? ' <b class="vp-pk-lp">' + esc(x.price) + '</b>' : '') + '</span></button>'; });
      h += '</div></section>';
      h += '<section class="vp-build vp-pk-step" data-step="extras" hidden><span class="vp-step"></span><h2>Add extras</h2><p class="vp-build-note">Optional. Adding extras moves you up to the package that matches.</p><div class="vp-lineups vp-extras">';
      P.extras.forEach(function (x) {
        h += '<button type="button" class="vp-lineup vp-pk-x' + (x.image ? ' vp-has-img' : '') + '" data-x="' + esc(x.id) + '">' + (x.image ? '<span class="vp-x-img"><img loading="lazy" src="' + img(x.image, 600) + '" alt=""' + (x.imagePosition ? ' style="object-position:' + esc(x.imagePosition) + '"' : '') + '></span>' : '') + '<strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + '</span></button>';
      });
      h += '</div><div class="vp-pk-tradwrap" hidden><h3 class="vp-pk-group">Trad band size</h3><p class="vp-build-note">Your solo musician plays first, followed by a separate trad band.</p><div class="vp-pk-pills">';
      P.lineups.forEach(function (x) { h += '<button type="button" class="vp-pk-pill vp-pk-line" data-lineup="' + esc(x.title) + '"><strong>' + esc(x.title) + '</strong> <span>' + esc(x.text) + '</span></button>'; });
      h += '</div></div><div class="vp-pk-djwrap" hidden><h3 class="vp-pk-group">DJ extras</h3><p class="vp-build-note">Choose one, or neither.</p><div class="vp-lineups">';
      P.djExtras.forEach(function (x) { h += '<button type="button" class="vp-lineup vp-pk-dx' + (x.image ? ' vp-has-img' : '') + '" data-dx="' + esc(x.title) + '">' + (x.image ? '<span class="vp-x-img"><img loading="lazy" src="' + img(x.image, 600) + '" alt=""' + (x.imagePosition ? ' style="object-position:' + esc(x.imagePosition) + '"' : '') + '></span>' : '') + '<strong>' + esc(x.title) + ' <small>+' + (x.priceFrom ? 'from ' : '') + euro(x.price) + '</small></strong><span>' + esc(x.text) + '</span></button>'; });
      h += '</div></div><div class="vp-pk-next" data-next="result"><span class="vp-pk-next-t">Happy with your extras?</span><button type="button" class="vp-btn">Next: see your package ↓</button></div></section>';
      h += '<section class="vp-build vp-pk-step" data-step="result" hidden><span class="vp-step">Your package</span><h2>Here\'s what you\'ve built</h2><div class="vp-pk-row">';
      P.list.forEach(function (x) {
        h += '<button type="button" class="vp-pk" data-id="' + esc(x.id) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(x.image, 500) + '" alt="' + esc(x.title) + '"' + (x.imagePosition ? ' style="object-position:' + esc(x.imagePosition) + '"' : '') + '><span class="vp-tick" aria-hidden="true">✓</span></div>'
          + '<strong>' + esc(x.title) + '</strong><em class="vp-pk-meta">' + esc(x.hours) + '</em><span>' + esc(x.text) + '</span><b class="vp-pk-price">From ' + euro(x.from) + '</b></button>';
      });
      h += '</div><div class="vp-pk-total"><span class="vp-pk-tname"></span><strong></strong></div><div class="vp-pk-sum" hidden><h3>What\'s included</h3><ul></ul></div><div class="vp-pk-cta"><div class="vp-pk-btns"><a class="vp-btn vp-pk-go" href="#vp-enquire">Check availability</a><button type="button" class="vp-btn vp-btn-ghost vp-pk-reset">↺ Start again</button></div>'
        + (P.note ? '<p class="vp-pk-foot">' + esc(P.note) + '</p>' : '') + '</div></section>';
    }
    // Other musicians: three who cover the most of the same events and extras
    var others = DATA.musicians.filter(function (o) { return o.live && o.url && o.slug !== m.slug && o.listed !== false; });
    function score(o) {
      var s = 0; (o.events || []).forEach(function (e) { if (events.indexOf(e) !== -1) s += 2; });
      if (m.tradBand && o.tradBand) s += 2; if (m.duo && o.duo) s += 1; return s;
    }
    var seed = 0; for (var c = 0; c < m.slug.length; c++) seed += m.slug.charCodeAt(c);
    // Remember which musicians this visitor has opened, and show ones they haven't seen first.
    var seen = [];
    try { seen = JSON.parse(localStorage.getItem('wd2SeenMusicians') || '[]'); } catch (e) {}
    if (seen.indexOf(m.slug) === -1) seen.push(m.slug);
    try { localStorage.setItem('wd2SeenMusicians', JSON.stringify(seen)); } catch (e) {}
    function isSeen(o) { return seen.indexOf(o.slug) !== -1 ? 1 : 0; }
    others.sort(function (a, b) { return isSeen(a) - isSeen(b) || score(b) - score(a) || ((a.slug.charCodeAt(0) + seed) % 7) - ((b.slug.charCodeAt(0) + seed) % 7); });
    others = others.slice(0, 3);
    if (others.length && !m.builder && !m.packages) {
      h += '<section><div class="vp-h2row"><h2>Other musicians</h2><a class="vp-btn vp-btn-ghost" href="/musicians">← All musicians</a></div><div class="vp-similar vp-three">';
      others.forEach(function (o) {
        var oe = ORDER.filter(function (e) { return (o.events || []).indexOf(e) !== -1; }).map(function (e) { return L[e]; });
        h += '<a class="vp-card" href="' + esc(o.url) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(o.photo, 750) + '" alt="' + esc(o.name) + '"' + (o.photoPosition ? ' style="object-position:' + esc(o.photoPosition) + '"' : '') + '></div>'
          + '<h3>' + esc(o.name) + '</h3><p>' + esc(oe.join(' · ')) + '</p></a>';
      });
      h += '</div></section>';
    }

    // Explore more: one venue (filled in once venues.json loads) and the DJ options
    var dj = DATA.djCard;
    h += '<section class="vp-explore"' + (m.packages ? ' hidden' : '') + '><h2>Explore more</h2><div class="vp-similar vp-three">';
    h += '<a class="vp-card vp-venue-card" href="/venues" hidden><div class="vp-card-img"><img loading="lazy" alt=""></div><h3></h3><p></p></a>';
    var trad = DATA.tradCard;
    if (trad && trad.url !== m.url) h += '<a class="vp-card" href="' + esc(trad.url) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(trad.image, 750) + '" alt="' + esc(trad.title) + '"></div><h3>' + esc(trad.title) + '</h3><p>' + esc(trad.text) + '</p></a>';
    if (dj) h += '<a class="vp-card vp-dj-card" href="' + esc(dj.url) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(dj.image, 750) + '" alt="' + esc(dj.title) + '"></div><h3>' + esc(dj.title) + '</h3><p>' + esc(dj.text) + '</p></a>';
    h += '</div></section>';
    h += '</div>';  // end of main column

    // Enquiry form, same questions as the home page form, with the musician filled in
    var today = new Date(); today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    var opt = function (list) { return '<option value="">Select an option</option>' + list.map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + '</option>'; }).join(''); };
    h += '<aside class="vp-aside"><div class="vp-sheet">'
      + '<button type="button" class="vp-sheet-bar" aria-expanded="false" aria-controls="vp-enquire"><span>' + esc(m.formTitle || ('Book ' + m.name)) + '</span>'
      + '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M6 15l6-6 6 6"/></svg></button>'
      + '<form class="vp-form" id="vp-enquire" novalidate>'
      + '<h2>' + esc(m.formTitle || ('Book ' + m.name)) + '</h2>'
      + '<div class="vp-row"><div class="vp-field"><label for="vp-fname">First name</label><input id="vp-fname" name="First name" autocomplete="given-name" required></div>'
      + '<div class="vp-field"><label for="vp-lname">Last name</label><input id="vp-lname" name="Last name" autocomplete="family-name" required></div></div>'
      + '<div class="vp-field"><label for="vp-email">Email</label><input id="vp-email" name="email" type="email" autocomplete="email" required></div>'
      + '<div class="vp-row"><div class="vp-field"><label for="vp-date">Event date</label><input id="vp-date" name="Event date" type="date" min="' + today + '" required></div>'
      + '<div class="vp-field"><label for="vp-time">Start time</label><input id="vp-time" name="Time" type="time" required></div></div>'
      + (m.packages
        ? '<div class="vp-field"><label for="vp-package">Package</label><input id="vp-package" name="Package" placeholder="Choose above"></div>'
          + '<div class="vp-field vp-pk-linefield" hidden><label for="vp-lineup">Trad line-up</label><select id="vp-lineup" name="Trad line-up">' + opt(m.packages.lineups.map(function (x) { return x.title; })) + '</select></div>'
          + '<div class="vp-field"><label for="vp-musician">Musician(s)</label><input id="vp-musician" name="Musician" placeholder="Pick from the list, or leave blank"></div>'
          + '<div class="vp-field"><label for="vp-addons">Extras</label><input id="vp-addons" name="Extras" placeholder="None"></div>'
          + '<input type="hidden" id="vp-estimate" name="Estimated price"><input type="hidden" id="vp-summary" name="Included"><input type="hidden" id="vp-when" name="Part of the day">'
        : m.builder
        ? '<div class="vp-field"><label for="vp-lineup">Line-up</label><select id="vp-lineup" name="Line-up">' + opt(m.builder.lineups.map(function (x) { return x.title; })) + '</select></div>'
          + '<div class="vp-field"><label for="vp-musician">Solo performer</label><select id="vp-musician" name="Musician">' + opt(pool.map(function (o) { return o.name; }).concat(['Not sure yet'])) + '</select></div>'
        : '<div class="vp-field"><label for="vp-musician">Musician</label><input id="vp-musician" name="Musician" value="' + esc(m.name) + '"></div>')
      + '<div class="vp-field"><label for="vp-type">Event type</label><select id="vp-type" name="Event type">' + opt(['Wedding Day 2', 'Ceremony', 'Drinks Reception', 'Wedding Day After Dinner', 'Corporate', 'Other']) + '</select></div>'
      + '<div class="vp-field"><label for="vp-venue">Venue <i>(if chosen)</i></label><input id="vp-venue" name="Venue"></div>'
      + '<div class="vp-field"><label for="vp-heard">How did you hear about us?</label><select id="vp-heard" name="How they heard about us">' + opt(['Instagram', 'Google Search', 'Musician referral', 'Venue recommendation', 'Friends or family', 'Other']) + '</select></div>'
      + '<div class="vp-field"><label for="vp-msg">Let us know how we can help <i>(optional)</i></label><textarea id="vp-msg" name="Message" placeholder="Guest numbers, add-ons like trad band, DJ or karaoke, questions"></textarea></div>'
      + '<input type="checkbox" name="botcheck" class="vp-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'
      + '<button class="vp-btn" type="submit">Send enquiry</button><p class="vp-status" role="status" aria-live="polite"></p>'
      + '</form></div></aside>';
    h += '</div>';  // end of body

    h += '<div class="vp-lb" hidden><img alt=""><div class="vp-lb-bar"><button type="button" data-a="prev">Previous</button><span class="vp-count"></span><button type="button" data-a="next">Next</button><button type="button" data-a="close">Close</button></div></div>';

    // The site's photo-link script turns a whole block into a link when it spots a known photo in it.
    // Mark this block as already handled so clicks inside it work normally.
    for (var blk = root; blk && blk !== document.body; blk = blk.parentElement) {
      if (blk.classList && blk.classList.contains('sqs-block')) { blk.wd2Wired = true; break; }
    }
    root.innerHTML = h;
    // Gentle glow on the enquiry form (and its phone bar) when a choice fills something in
    var pulseTimer = null;
    var pulseForm = function (msg) {
      ['.vp-form', '.vp-sheet-bar'].forEach(function (q) {
        var el = root.querySelector(q); if (!el) return;
        el.classList.remove('vp-pulse'); void el.offsetWidth; el.classList.add('vp-pulse');
      });
      // On phones the form is tucked in the bottom bar, so say what was just added
      var bar = root.querySelector('.vp-sheet-bar span');
      if (bar && msg) {
        if (!bar.getAttribute('data-label')) bar.setAttribute('data-label', bar.textContent);
        bar.textContent = '✓ ' + msg; bar.parentNode.classList.add('vp-bar-msg');
        clearTimeout(pulseTimer);
        pulseTimer = setTimeout(function () { bar.textContent = bar.getAttribute('data-label'); bar.parentNode.classList.remove('vp-bar-msg'); }, 2200);
      }
    };

    // Packages page behaviour
    if (m.packages) (function () {
      var P = m.packages, euro = function (n) { return '€' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
      var lastSnap = null, lastName = '', pendingRise = false;
      var playRise = function () {
        var sum = $('.vp-pk-sum'); pendingRise = false;
        sum.classList.remove('vp-rise'); void sum.offsetWidth; sum.classList.add('vp-rise');
        $$('.vp-pk-row .vp-pk').forEach(function (b, i) { b.style.transitionDelay = (i * 60) + 'ms'; });
      };
      // if the package changed while they were further up the page, play the rise when they scroll down to it
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && pendingRise) playRise(); }); }, { threshold: 0.3 }).observe(root.querySelector('.vp-pk-sum'));
      var start = '', alt = '', style = '', noSolo = false, picked = [], anyPick = false, xs = [], line = '', dx = '', when = [];
      var $ = function (q) { return root.querySelector(q); }, $$ = function (q) { return Array.prototype.slice.call(root.querySelectorAll(q)); };
      var step = function (n) { return $('.vp-pk-step[data-step="' + n + '"]'); };
      var has = function (id) { return start === id || xs.indexOf(id) !== -1; };
      var go = function (el) { if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60); };
      function match() {
        var solo = has('solo'), trad = has('trad'), dj = has('dj'), two = solo && has('second');
        var base = solo && trad && dj ? 'full-experience' : solo && trad ? 'party' : solo && dj && !two ? 'celebration' : solo && two ? 'double-trouble' : '';
        var pk = P.list.filter(function (x) { return x.id === base; })[0];
        var tradPrice = line === 'Three-piece' ? P.trioFrom : P.duoFrom;
        var price = 0, name = '', extra = [];
        if (pk) {
          price = pk.from; name = pk.title;
          if (two && (trad || dj)) { price += P.soloFrom; extra.push('second solo musician'); }
          if (two && dj && !trad) { price += P.djFrom; extra.push('DJ'); }
        } else if (solo) { price = P.soloFrom; name = 'Solo musician'; }
        else if (trad && alt) { price = tradPrice; name = (alt === 'trio' ? 'Trio' : 'Duo') + (style ? ' (' + style + ')' : ''); if (dj) { price += P.djFrom; extra.push('DJ'); } }
        else if (trad) { price = tradPrice; name = 'Trad band' + (line ? ' (' + line + ')' : ''); if (dj) { price += P.djFrom; extra.push('DJ'); } }
        else if (dj) { price = P.djFrom; name = 'DJ'; }
        var d = P.djExtras.filter(function (x) { return x.title === dx; })[0];
        if (d && dj) { price += d.price; extra.push(d.title); }
        return { pk: pk, price: price, name: name + (extra.length ? ' + ' + extra.join(' + ') : '') };
      }
      function render() {
        start = noSolo ? (start === 'solo' ? '' : start) : ((picked.length || anyPick) ? 'solo' : '');
        if (start) xs = xs.filter(function (x) { return x !== start; });
        if (!has('solo')) xs = xs.filter(function (x) { return x !== 'second'; });
        var started = !!start, two = has('second'), trad = has('trad'), dj = has('dj');
        if (!dj) dx = '';
        if (!trad) line = '';
        if (noSolo && start === 'trad') line = alt === 'trio' ? 'Three-piece' : 'Duo';
        if (!noSolo) { alt = ''; style = ''; }
        step('alt').hidden = !noSolo;
        var lt = $('.vp-pk-ltitle'), ln = $('.vp-pk-lnote');
        if (has('solo')) { lt.textContent = 'Choose your trad band line-up'; ln.textContent = 'Your solo musician plays first, followed by a separate trad band. Choose the size of the band:'; }
        else { lt.textContent = 'Choose your trad band line-up'; ln.textContent = ''; }
        step('style').hidden = !(noSolo && start === 'trad');
        step('lineup').hidden = true;  // the trad size is now chosen inline in the extras step
        $('.vp-pk-tradwrap').hidden = !trad || (noSolo && start === 'trad');
        step('extras').hidden = step('result').hidden = !started;
        var ex = root.querySelector('.vp-explore'); if (ex) ex.hidden = !started;
        $('.vp-pk-djwrap').hidden = !dj;
        $$('.vp-pk-x').forEach(function (b) { var id = b.getAttribute('data-x'); b.hidden = id === start || (id === 'second' && !has('solo')); });
        var sn = 1; $$('.vp-pk-step').forEach(function (sec) { if (sec.getAttribute('data-step') === 'result' || sec.hidden) return; sec.querySelector('.vp-step').textContent = 'Step ' + (sn++); });
        // musician step
        $('.vp-pk-mtitle').textContent = two ? 'Choose your solo musicians' : 'Choose your solo musician';
        $('.vp-pk-mnote').textContent = (two ? 'You need 2 musicians. ' : '') + 'Pick a few favourites in case your first choice isn\'t available on your date, or choose No preference and we\'ll match you with someone great.'
;
        var need = '';  // the trad band is a separate act, so any solo musician can be chosen
        $$('.vp-performer').forEach(function (c) {
          if (c.classList.contains('vp-any-card')) return;
          var ok = !need || c.getAttribute('data-' + need) === '1' || (need === 'duo' && c.getAttribute('data-tradband') === '1');
          c.hidden = !ok;
          if (!ok) { var nm = c.querySelector('.vp-pick').getAttribute('data-name'); picked = picked.filter(function (x) { return x !== nm; }); }
        });
        $$('.vp-pk-pick').forEach(function (b) { b.classList.toggle('vp-picked', picked.indexOf(b.getAttribute('data-name')) !== -1); });
        $('.vp-pk-any').classList.toggle('vp-picked', anyPick);
        $('.vp-pk-nosolo').classList.toggle('vp-picked', noSolo);
        var nx = $('.vp-pk-next[data-next="extras"]');
        nx.hidden = !(anyPick || picked.length);
        nx.querySelector('.vp-pk-next-t').textContent = anyPick ? 'No preference chosen.' : picked.length + ' musician' + (picked.length > 1 ? 's' : '') + ' picked: ' + picked.join(', ');
        $$('.vp-pk-alt').forEach(function (b) { b.classList.toggle('vp-picked', noSolo && b.getAttribute('data-start') === (start === 'trad' ? alt : start)); });
        $$('.vp-pk-style').forEach(function (b) { b.classList.toggle('vp-picked', b.getAttribute('data-style') === style); });
        $$('.vp-pk-x').forEach(function (b) { b.classList.toggle('vp-picked', xs.indexOf(b.getAttribute('data-x')) !== -1); });
        $$('.vp-pk-line').forEach(function (b) { b.classList.toggle('vp-picked', b.getAttribute('data-lineup') === line); });
        $$('.vp-pk-dx').forEach(function (b) { b.classList.toggle('vp-picked', b.getAttribute('data-dx') === dx); });
        $$('.vp-pk-tag').forEach(function (b) { var on = when.indexOf(b.getAttribute('data-when')) !== -1; b.classList.toggle('vp-picked', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        var r = match();
        $$('.vp-pk').forEach(function (b) { b.classList.toggle('vp-picked', !!r.pk && b.getAttribute('data-id') === r.pk.id); });
        $('.vp-pk-row').classList.toggle('vp-has-pick', !!r.pk);
        $('.vp-pk-tname').textContent = r.name;
        $('.vp-pk-total strong').textContent = started ? 'From ' + euro(r.price) : '';
        // Summary of what's in it
        var items = [], who = anyPick ? 'we\'ll match you with whoever is free' : picked.join(', ');
        if (r.pk && r.pk.hours) items.push(r.pk.hours.charAt(0).toUpperCase() + r.pk.hours.slice(1));
        if (has('solo')) items.push((two ? 'Two solo musicians, back to back' : 'Solo musician (singer-guitarist)') + (who ? ': ' + who : ''));
        if (trad) {
          var tl = (has('solo') ? 'Followed by a separate ' : 'Modern ') + (line === 'Three-piece' ? 'trad band three-piece (musician, fiddle and banjo)' : 'trad band duo (musician plus fiddle or banjo)');
          if (noSolo && style) tl = (line === 'Three-piece' ? 'Trio' : 'Duo') + ', ' + style.toLowerCase() + ' style';
          items.push(line || noSolo ? tl : 'Modern trad band (choose duo or three-piece)');
        }
        if (dj) items.push('DJ set');
        if (dx && dj) items.push(dx === 'Saxophone' ? 'Live saxophone with the DJ' : 'Karaoke with the DJ');
        if (started) items.push('Professional audio and lighting');
        var wl = events.filter(function (e) { return when.indexOf(e) !== -1; }).map(function (e) { return L[e]; });
        if (wl.length) items.push('For: ' + wl.join(', '));
        var sum = $('.vp-pk-sum'); sum.hidden = !started;
        // the summary rises into place whenever the package changes
        if (started && r.name !== lastName) { pendingRise = true; var sr = sum.getBoundingClientRect(); if (sr.top < window.innerHeight && sr.bottom > 0) playRise(); }
        lastName = started ? r.name : '';
        sum.querySelector('ul').innerHTML = items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
        $('#vp-summary').value = started ? items.join('; ') : '';
        // fill the form
        $('#vp-package').value = started ? r.name : '';
        $('.vp-pk-linefield').hidden = !trad; $('#vp-lineup').value = line;
        $('#vp-musician').value = noSolo ? 'No solo musician' : anyPick ? 'No preference' : picked.join(', ');
        $('#vp-addons').value = dx;
        $('#vp-estimate').value = started ? 'From ' + euro(r.price) : '';
        $('#vp-when').value = events.filter(function (e) { return when.indexOf(e) !== -1; }).map(function (e) { return L[e]; }).join(', ');
        // Event type in the form follows the bubbles at the top
        var et = $('#vp-type'), map = { ceremony: 'Ceremony', day2: 'Wedding Day 2', afterdinner: 'Wedding Day After Dinner' };
        if (et) {
          var picks = events.filter(function (e) { return when.indexOf(e) !== -1; });
          var old = et.querySelector('option.vp-combo'); if (old) old.parentNode.removeChild(old);
          if (picks.length === 1) et.value = map[picks[0]];
          else if (picks.length > 1) {
            var o = document.createElement('option'); o.className = 'vp-combo';
            o.value = o.textContent = picks.map(function (e) { return map[e] === 'Ceremony' ? 'Ceremony & Drinks Reception' : map[e]; }).join(' + ');
            et.appendChild(o); et.value = o.value;
          } else et.value = '';
        }
        // pulse the form whenever a choice changes what's filled in
        var snap = ['#vp-package', '#vp-lineup', '#vp-musician', '#vp-addons', '#vp-type'].map(function (q) { var f = $(q); return f ? f.value : ''; }).join('|');
        if (lastSnap !== null && snap !== lastSnap) {
          var was = lastSnap.split('|'), now = snap.split('|'), names = ['Package', 'Line-up', 'Musician', 'Extras', 'Event'], msg = '';
          for (var k = now.length - 1; k >= 0; k--) if (now[k] !== was[k]) { msg = now[k] ? (k === 2 ? 'Added to your form: ' : names[k] + ': ') + now[k] : names[k] + ' removed'; break; }
          if (now[2] !== was[2] && now[2]) msg = 'Added to your form: ' + now[2];
          pulseForm(msg);
        }
        lastSnap = snap;
      }
      $$('.vp-pk-pick').forEach(function (b) { b.addEventListener('click', function () {
        var nm = b.getAttribute('data-name'), i = picked.indexOf(nm); anyPick = false; noSolo = false;
        if (i !== -1) picked.splice(i, 1); else picked.push(nm); render();
      }); });
      $('.vp-pk-any').addEventListener('click', function () {
        anyPick = !anyPick; noSolo = false; if (anyPick) picked = []; render();
        if (anyPick) go(step('extras'));
      });
      $('.vp-pk-nosolo').addEventListener('click', function () {
        noSolo = !noSolo; if (noSolo) { picked = []; anyPick = false; xs = []; dx = ''; } else start = '';
        render(); if (noSolo) go(step('alt'));
      });
      $$('.vp-pk-alt').forEach(function (b) { b.addEventListener('click', function () {
        var v = b.getAttribute('data-start');
        if (v === 'duo' || v === 'trio') { start = 'trad'; alt = v; } else { start = v; alt = v; }
        render(); go(start === 'trad' ? step('style') : start === 'dj' ? $('.vp-pk-djwrap') : step('extras'));
      }); });
      $$('.vp-pk-style').forEach(function (b) { b.addEventListener('click', function () { style = b.getAttribute('data-style'); render(); go(step('extras')); }); });
      $$('.vp-pk-x').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-x'), i = xs.indexOf(id);
        if (i !== -1) xs.splice(i, 1); else xs.push(id); render();
        if (id === 'trad' && i === -1 && !line) go($('.vp-pk-tradwrap'));
        if (id === 'dj' && i === -1) go($('.vp-pk-djwrap'));
      }); });
      $$('.vp-pk-line').forEach(function (b) { b.addEventListener('click', function () { line = b.getAttribute('data-lineup'); render(); go(has('dj') ? $('.vp-pk-djwrap') : step('result')); }); });
      $$('.vp-pk-dx').forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute('data-dx'); dx = dx === v ? '' : v; render(); }); });
      $$('.vp-pk-tag').forEach(function (b) { b.addEventListener('click', function () {
        var w = b.getAttribute('data-when'), i = when.indexOf(w); if (i !== -1) when.splice(i, 1); else when.push(w); render();
      }); });
      // Start again: clear every choice and go back to the top
      $('.vp-pk-reset').addEventListener('click', function () {
        start = ''; alt = ''; style = ''; noSolo = false; picked = []; anyPick = false; xs = []; line = ''; dx = ''; when = [];
        render();
        var top = root.querySelector('.vp-about') || step('musician');
        go(top);
      });
      $$('.vp-pk-next button').forEach(function (b) { b.addEventListener('click', function () { go(step(b.parentNode.getAttribute('data-next'))); }); });
      // Clicking a package card sets things up to match it
      var setPk = function (id) {
        var x = P.list.filter(function (p) { return p.id === id; })[0]; if (!x) return;
        noSolo = false; if (!picked.length) anyPick = true; xs = (x.extras || []).slice(); render();
      };
      $$('.vp-pk').forEach(function (b) { b.addEventListener('click', function () { setPk(b.getAttribute('data-id')); }); });
      $('#vp-lineup').addEventListener('change', function () { line = this.value; render(); });
      $('.vp-pk-go').addEventListener('click', function (e) { e.preventDefault(); window.wd2OpenForm && window.wd2OpenForm(); });
      var want = (location.search.match(/[?&]package=([^&]+)/) || [])[1];
      if (want) setPk(decodeURIComponent(want)); else render();
    })();
    // Build-your-band: picking a line-up or performer highlights it and fills in the form
    if (m.builder) {
      var pickIn = function (sel, attr, field) {
        root.querySelectorAll(sel).forEach(function (btn) {
          btn.addEventListener('click', function () {
            root.querySelectorAll(sel).forEach(function (x) { x.classList.remove('vp-picked'); x.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('vp-picked'); btn.setAttribute('aria-pressed', 'true');
            var f = root.querySelector(field); if (f) { f.value = btn.getAttribute(attr); pulseForm('Added to your form: ' + btn.getAttribute(attr)); }
          });
        });
      };
      pickIn('.vp-lineup', 'data-lineup', '#vp-lineup');
      // Only show performers who play with the chosen line-up
      var showFor = function (need) {
        root.querySelectorAll('.vp-performer').forEach(function (card) {
          var ok = !need || (' ' + card.getAttribute('data-can') + ' ').indexOf(' ' + need + ' ') !== -1;
          card.hidden = !ok;
          var btn = card.querySelector('.vp-pick');
          if (!ok && btn.classList.contains('vp-picked')) { btn.classList.remove('vp-picked'); var f = root.querySelector('#vp-musician'); if (f) f.value = ''; }
          var o = root.querySelector('#vp-musician option[value="' + btn.getAttribute('data-name').replace(/"/g, '\\"') + '"]');
          if (o) { o.hidden = !ok; o.disabled = !ok; }
        });
      };
      root.querySelectorAll('.vp-lineup').forEach(function (btn) { btn.addEventListener('click', function () { showFor(btn.getAttribute('data-needs')); }); });
      var lineSel = root.querySelector('#vp-lineup');
      if (lineSel) lineSel.addEventListener('change', function () {
        var hit = null;
        root.querySelectorAll('.vp-lineup').forEach(function (x) { var on = x.getAttribute('data-lineup') === lineSel.value; x.classList.toggle('vp-picked', on); if (on) hit = x; });
        showFor(hit ? hit.getAttribute('data-needs') : '');
      });
      var perfSel = root.querySelector('#vp-musician');
      if (perfSel) perfSel.addEventListener('change', function () {
        root.querySelectorAll('.vp-pick').forEach(function (x) { x.classList.toggle('vp-picked', x.getAttribute('data-name') === perfSel.value); });
      });
      pickIn('.vp-pick', 'data-name', '#vp-musician');
    }

    // DJ card opens the site's "DJ Packages" popup, like the home page (falls back to the DJs page)
    var djCard = root.querySelector('.vp-dj-card');
    if (djCard) djCard.addEventListener('click', function (e) {
      var ov = document.querySelector('.wd2-overlay');
      if (!ov || e.metaKey || e.ctrlKey) return;
      e.preventDefault(); e.stopPropagation();
      ov.classList.add('wd2-open'); document.body.style.overflow = 'hidden';
    });

    // Pick one venue to show under "Explore more"
    fetch(VENUES_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (vd) {
      var vs = (vd.venues || []).filter(function (v) { return v.live && v.url && (v.cardImg || v.heroImg); });
      if (!vs.length) return;
      var v = vs[Math.floor(Math.random() * vs.length)], card = root.querySelector('.vp-venue-card');
      if (!card) return;
      card.href = v.url;
      card.querySelector('img').src = vd.imageBase + (v.cardImg || v.heroImg) + '?format=750w';
      card.querySelector('img').alt = v.name;
      card.querySelector('h3').textContent = 'Venue: ' + v.name;
      card.querySelector('p').textContent = [v.area, v.county].filter(Boolean).join(', ') + ' · Check out this venue';
      card.hidden = false;
    }).catch(function () {});

    // Upright photos get a narrower panel on wide screens, so more of the photo shows.
    var heroPic = root.querySelector('.vp-hero img');
    function checkShape() {
      if (!heroPic.naturalWidth) return;
      var tall = heroPic.naturalHeight > heroPic.naturalWidth * 1.05;
      root.querySelector('.vp-hero').classList.toggle('vp-portrait', tall);
      // Wide photos: make the banner as tall as the photo needs, so none of it is cut off.
      root.querySelector('.vp-hero').style.setProperty('--vp-ar', (heroPic.naturalHeight / heroPic.naturalWidth).toFixed(4));
      if (tall && !m.photoPosition) heroPic.style.objectPosition = 'center 20%';
    }
    if (heroPic.complete) checkShape(); else heroPic.addEventListener('load', checkShape);

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
    window.__mpPull = pullUp;
    if (!window.__mpPullBound) { window.__mpPullBound = true; window.addEventListener('load', function () { if (window.__mpPull) window.__mpPull(); }); window.addEventListener('resize', function () {
      // the phone keyboard opening fires "resize": don't shuffle the page around while someone is typing in the form
      if (document.querySelector('.vp-aside.vp-open') || (document.activeElement && /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))) return;
      if (window.__mpPull) window.__mpPull();
    }); }

    // Lightbox
    var lb = root.querySelector('.vp-lb'), lbImg = lb.querySelector('img'), count = lb.querySelector('.vp-count'), idx = 0, cur = [];
    function open(i) { if (!cur.length) return; idx = (i + cur.length) % cur.length; lbImg.src = img(cur[idx], 2500); count.textContent = (idx + 1) + ' / ' + cur.length; lb.hidden = false; }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-set]');
      if (b && root.contains(b)) { cur = sets[+b.getAttribute('data-set')] || []; open(+b.getAttribute('data-i')); }
    });
    lb.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-a');
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
    function fitSticky() { if (mobileQ.matches) return; var gap = 24; root.style.setProperty('--vp-sticky-top', Math.min(gap, window.innerHeight - aside.offsetHeight - gap) + 'px'); }

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
      // stop the page behind from scrolling while the form is open on a phone
      document.documentElement.classList.toggle('vp-lock', open && mobileQ.matches);
      sheetBar.setAttribute('aria-expanded', open ? 'true' : 'false');
      sheetBar.setAttribute('aria-label', open ? 'Close the enquiry form' : openLabel);
    }
    sheetBar.addEventListener('click', function () { setSheet(!aside.classList.contains('vp-open')); });
    // Open the enquiry form and make it obvious: on phones the sheet slides up; on desktop it scrolls into view, glows and the first box is ready to type in
    window.wd2OpenForm = function () {
      var form = root.querySelector('.vp-form'), first = root.querySelector('#vp-fname');
      if (mobileQ.matches) setSheet(true);
      else {
        // pin the top of the form in view so the first boxes show; it goes back to normal once they move further down the form
        root.style.setProperty('--vp-sticky-top', '24px');
        var top = form.getBoundingClientRect().top; if (top < 0 || top > window.innerHeight * 0.4) window.scrollBy({ top: top - 24, behavior: 'smooth' });
        var undo = function (ev) {
          var r = ev.target.getBoundingClientRect();
          if (r.bottom > window.innerHeight - 20) { form.removeEventListener('focusin', undo); if (window.__mpFit) window.__mpFit(); setTimeout(function () { ev.target.scrollIntoView({ block: 'nearest' }); }, 50); }
        };
        form.addEventListener('focusin', undo);
      }
      form.classList.remove('vp-flash'); void form.offsetWidth; form.classList.add('vp-flash');
      // on phones don't pop the keyboard up straight away (it shoves the form around); they tap a box when ready
      if (!mobileQ.matches) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (x) { first.focus(); } }, 500);
    };
    root.querySelector('.vp-facts .vp-btn').addEventListener('click', function (e) { e.preventDefault(); window.wd2OpenForm(); return; if (mobileQ.matches) { e.preventDefault(); setSheet(true); } });
    fitSticky();
    if (!window.__mpFitBound) { window.__mpFitBound = true; window.addEventListener('resize', function () { if (window.__mpFit) window.__mpFit(); }); }
    window.__mpFit = fitSticky;

    // Enquiry form
    var form = root.querySelector('.vp-form'), status = form.querySelector('.vp-status'), sendBtn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'vp-status'; status.textContent = '';
      var missing = [];
      ['vp-fname', 'vp-lname', 'vp-email', 'vp-date', 'vp-time'].forEach(function (id) { var f = form.querySelector('#' + id); if (!f.value.trim()) missing.push(f); });
      var em = form.querySelector('#vp-email');
      if (missing.length) { status.className = 'vp-status vp-err'; status.textContent = 'Please fill in your name, email, event date and start time.'; missing[0].focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { status.className = 'vp-status vp-err'; status.textContent = 'Please check your email address.'; em.focus(); return; }
      if (!DATA.formAccessKey) { status.className = 'vp-status vp-err'; status.innerHTML = 'Online enquiries are not switched on yet. Please use our <a href="' + FALLBACK_ENQUIRY + '">enquiry form</a>.'; return; }
      var payload = { access_key: DATA.formAccessKey, page: location.href };
      Array.prototype.forEach.call(form.elements, function (f) { if (f.name && f.type !== 'checkbox') payload[f.name] = f.value.trim(); });
      // Email subject reads like "Aoife Byrne - J.R. Mahon's Enquiry"; the sender shows as the person's name.
      var fullName = payload['First name'] + ' ' + payload['Last name'];
      payload.subject = fullName + ' - ' + (m.subjectName || m.name) + ' Enquiry';
      payload.from_name = fullName;
      payload.botcheck = form.querySelector('[name=botcheck]').checked;
      sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
      fetch(FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message || 'failed');
          setTimeout(fitSticky, 0);
          form.innerHTML = '<div class="vp-done"><h2>Thanks, ' + esc(payload['First name']) + '</h2><p>We have your enquiry about ' + esc(m.name) + ' and will be in touch soon by email.</p></div>';
        })
        .catch(function () {
          sendBtn.disabled = false; sendBtn.textContent = 'Send enquiry';
          status.className = 'vp-status vp-err';
          status.innerHTML = 'Your enquiry did not send. Please try again, or use our <a href="' + FALLBACK_ENQUIRY + '">enquiry form</a>.';
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
            var hls = new window.Hls({ autoStartLoad: false, abrEwmaDefaultEstimate: 6000000, capLevelToPlayerSize: false });  // start in good quality instead of the lowest
            hls.loadSource(src); hls.attachMedia(el);
            el.addEventListener('play', function () { hls.startLoad(); }, { once: true });
          } else { el.src = src; }
        });
      };
      if (window.Hls) setup();
      else { var s = document.createElement('script'); s.src = HLS_URL; s.onload = setup; s.onerror = setup; document.head.appendChild(s); }
    }
  }
})();
