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

  // Paint the whole page section black so there's no patterned or lighter band around this page
  (function () {
    var sec = root.closest('section');
    if (!sec) return;
    sec.style.backgroundColor = '#1f2727';
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = '#1f2727'; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  })();
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
#musician-page{--vp-radius:14px;--vp-radius-sm:10px;--vp-bg:#1f2727;--vp-surface:#283232;--vp-ink:#eae6dd;--vp-muted:#b8b3a8;--vp-line:#364242;--vp-bottle:#171d1d;--vp-brass:#3dc2bb;--vp-accent-text:#3dc2bb;--vp-on-dark:#eae6dd;\
--vp-display:"Young Serif",Georgia,serif;--vp-body:"Bitter",Georgia,serif;\
background:var(--vp-bg);color:var(--vp-ink);font-family:var(--vp-body);font-size:16px;line-height:1.65;font-weight:400;text-align:left}\
#musician-page[data-theme="light"]{--vp-bg:#eae6dd;--vp-surface:#f1ede2;--vp-ink:#1f2727;--vp-muted:#505c5c;--vp-line:#d3cec2;--vp-bottle:#1f2727;--vp-accent-text:#1b7f7a}\
#musician-page *{box-sizing:border-box}\
#musician-page h1,#musician-page h2,#musician-page h3{font-family:var(--vp-display);font-weight:400;letter-spacing:-.01em;text-transform:none;color:inherit;text-wrap:balance}\
#musician-page p{margin:0}\
#musician-page .vp-pad{padding-left:max(16px,4vw);padding-right:max(16px,4vw)}\
#musician-page .vp-hero{position:relative;z-index:0;min-height:min(70vh,600px);display:flex;align-items:flex-end;color:var(--vp-on-dark);background:#1f2727;overflow:hidden}\
#musician-page .vp-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;max-width:none}\
#musician-page .vp-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.85) 100%)}\
#musician-page .vp-hero:before{content:"";position:absolute;left:0;right:0;top:0;height:35%;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(29,37,37,.6) 0%,rgba(29,37,37,0) 100%)}\
#musician-page .vp-hero-in{position:relative;z-index:1;width:100%;padding-top:48px;padding-bottom:40px}\
#musician-page .vp-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}\
#musician-page .vp-hero h1{font-size:clamp(40px,7vw,76px);line-height:1.02;margin:10px 0 12px;color:var(--vp-on-dark)}\
#musician-page .vp-lede{max-width:56ch;font-size:18px;opacity:.92}\
#musician-page .vp-facts{background:var(--vp-bottle);color:var(--vp-on-dark);display:flex;flex-wrap:wrap;gap:20px 40px;align-items:center;padding-top:22px;padding-bottom:22px}\
#musician-page .vp-fact span{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}\
#musician-page .vp-fact strong{font-family:var(--vp-display);font-weight:400;font-size:24px;color:var(--vp-brass)}\
#musician-page .vp-btn{display:inline-block;margin-left:auto;text-decoration:none;font-weight:500;letter-spacing:.04em;padding:14px 26px;border-radius:999px;background:var(--vp-brass);color:#1f2727;border:0}\
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
#musician-page .vp-video video{width:100%;aspect-ratio:16/9;background:#171d1d;display:block;object-fit:cover;border-radius:var(--vp-radius);overflow:hidden}\
#musician-page .vp-play{position:absolute;inset:0;margin:auto;width:76px;height:76px;border-radius:50%;border:0;padding:0;background:var(--vp-brass);color:#1f2727;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35);transition:transform .15s}\
#musician-page .vp-play:hover{transform:scale(1.08)}\
#musician-page .vp-play svg{width:28px;height:28px;margin-left:4px}\
#musician-page .vp-vwrap.vp-playing .vp-play{display:none}\
#musician-page .vp-video figcaption{font-size:13px;color:var(--vp-muted)}\
#musician-page .vp-loc p{margin-bottom:12px;color:var(--vp-muted)}\
#musician-page .vp-similar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}\
#musician-page .vp-card{display:grid;gap:10px;text-decoration:none;color:inherit;min-width:0}\
#musician-page .vp-card-img{aspect-ratio:4/3;border-radius:var(--vp-radius);overflow:hidden;background:var(--vp-line)}\
#musician-page .vp-similar .vp-card-img{position:relative}#musician-page .vp-similar .vp-card-img:after{content:"";position:absolute;right:8px;bottom:8px;width:30px;height:31px;background:url(data:image/png;base64,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) center/contain no-repeat;opacity:.9;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;z-index:2}#musician-page .vp-similar .vp-card-img.vp-any-img:after{display:none}\
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
#musician-page .vp-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}@media (min-width:1001px){#musician-page .vp-aside .vp-form{max-height:calc(100vh - 48px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(61,194,187,.5) transparent}}@keyframes vpField{0%{box-shadow:0 0 0 0 rgba(61,194,187,0);background-color:inherit}30%{box-shadow:0 0 0 3px rgba(61,194,187,.7);background-color:rgba(61,194,187,.22)}100%{box-shadow:0 0 0 0 rgba(61,194,187,0)}}#musician-page .vp-form .vp-flashfield{animation:vpField 1.3s ease-out;border-color:var(--vp-brass)!important}\
@container (max-width:640px){#musician-page .vp-space.vp-has-video,#musician-page .vp-split{grid-template-columns:1fr}}\
#musician-page .vp-sheet-bar{display:none}\
@media (max-width:1000px){\
#musician-page .vp-body{grid-template-columns:1fr;padding-bottom:110px}\
#musician-page .vp-aside{position:fixed;left:0;right:0;bottom:0;top:auto;z-index:9998;pointer-events:none;padding:0 max(12px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px))}\
#musician-page .vp-sheet{pointer-events:auto;max-width:560px;margin:0 auto;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.4)}\
#musician-page .vp-sheet-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:15px 22px;border:0;border-radius:999px;background:var(--vp-brass);color:#1f2727;font:inherit;font-weight:600;font-size:16px;cursor:pointer;text-align:left}\
#musician-page .vp-sheet-bar svg{width:20px;height:20px;flex:none;transition:transform .2s}\
#musician-page .vp-sheet .vp-form{display:none}\
#musician-page .vp-open .vp-sheet{background:var(--vp-surface);border:1px solid var(--vp-line);max-height:calc(100vh - var(--vp-sheet-top,24px) - 12px);max-height:calc(100dvh - var(--vp-sheet-top,24px) - 12px)}\
#musician-page .vp-open .vp-sheet-bar{border-radius:0;background:var(--vp-surface);color:var(--vp-ink);border-bottom:1px solid var(--vp-line);font-family:var(--vp-display);font-weight:400;font-size:20px}\
#musician-page .vp-open .vp-sheet-bar svg{transform:rotate(180deg);color:var(--vp-brass)}\
#musician-page .vp-open .vp-sheet .vp-form{display:grid;border:0;border-radius:0;overflow-y:auto;overscroll-behavior:contain}#musician-page .vp-aside.vp-open{top:var(--vp-sheet-top,12px)}#musician-page .vp-aside.vp-open .vp-sheet{height:100%;max-height:none}#musician-page .vp-aside.vp-open .vp-form{flex:1 1 auto;min-height:0;-webkit-overflow-scrolling:touch;padding-bottom:40px}html.vp-lock,html.vp-lock body{overflow:hidden!important;overscroll-behavior:none}#musician-page .vp-open .vp-sheet-bar.vp-pulse{animation:none}\
#musician-page .vp-sheet .vp-form h2{display:none}\
#musician-page .vp-aside:not(.vp-open) .vp-sheet{max-width:230px;transition:max-width .25s;overflow:visible;box-shadow:none}#musician-page .vp-aside:not(.vp-open) .vp-sheet-bar{padding:11px 18px;font-size:15px;justify-content:center;gap:8px;background:#171d1d;color:var(--vp-brass);border:1.5px solid var(--vp-brass);animation:vpTempt 2.8s ease-in-out infinite}#musician-page .vp-aside:not(.vp-open) .vp-sheet-bar svg{color:var(--vp-brass)}#musician-page .vp-aside:not(.vp-open) .vp-sheet-bar.vp-pulse{animation:vpPulse .9s ease-out 2}#musician-page .vp-aside:not(.vp-open) .vp-sheet:has(.vp-bar-msg){max-width:340px}@keyframes vpTempt{0%,100%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 0 rgba(61,194,187,.45)}50%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 9px rgba(61,194,187,0)}}@media (prefers-reduced-motion:reduce){#musician-page .vp-aside:not(.vp-open) .vp-sheet-bar{animation:none}}\
}\
#musician-page .vp-lb{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px}\
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
#musician-page .vp-btn.vp-btn-ghost{background:transparent;color:var(--vp-brass);border:1.5px solid var(--vp-brass);padding:9px 18px;font-size:14px}#musician-page .vp-btn.vp-btn-ghost:hover{background:var(--vp-brass);color:#1f2727}\
#musician-page video:fullscreen{object-fit:contain!important;aspect-ratio:auto!important;width:100%!important;height:100%!important;max-width:none!important;border-radius:0!important;background:#000}\
#musician-page video:-webkit-full-screen{object-fit:contain!important;aspect-ratio:auto!important;width:100%!important;height:100%!important;max-width:none!important;border-radius:0!important;background:#000}\
#musician-page .vp-split.vp-split-tall{grid-template-columns:minmax(0,1fr) minmax(220px,320px)}\
#musician-page .vp-split.vp-split-tall .vp-video.vp-tall{justify-self:end}\
@container (max-width:640px){#musician-page .vp-similar.vp-three{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-videos{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#musician-page .vp-videos .vp-video:not(.vp-tall){grid-column:1/-1}#musician-page .vp-split.vp-split-tall{grid-template-columns:1fr}#musician-page .vp-split.vp-split-tall .vp-video.vp-tall{justify-self:center;max-width:320px}}\
@container (max-width:380px){#musician-page .vp-similar.vp-three{grid-template-columns:1fr}}\
@media (min-width:900px){#musician-page .vp-hero.vp-portrait{background:#000}#musician-page .vp-hero img{left:auto;right:0;width:60%;-webkit-mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 18%,#000 42%);mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 18%,#000 42%)}#musician-page .vp-hero:after{background:linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(0,0,0,.7) 100%)}#musician-page .vp-hero.vp-portrait:after{background:linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(0,0,0,.6) 100%)}#musician-page .vp-hero.vp-portrait:before{background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.15) 30%,rgba(0,0,0,.15) 100%)}#musician-page .vp-hero:not(.vp-portrait) img{width:100%;-webkit-mask-image:none;mask-image:none}#musician-page .vp-hero.vp-portrait img{width:75%;-webkit-mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 12%,#000 30%);mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 12%,#000 30%)}}\
@media (max-width:899px){#musician-page .vp-hero{min-height:330px}#musician-page .vp-hero-in{padding-top:24px;padding-bottom:20px}#musician-page .vp-hero h1{font-size:44px;margin-bottom:0}#musician-page .vp-facts{gap:10px 24px;padding-top:14px;padding-bottom:16px}#musician-page .vp-fact strong{font-size:17px;line-height:1.35}#musician-page .vp-fact span{font-size:10px;margin-bottom:2px}}\
#musician-page .vp-hero:before,#musician-page .vp-hero.vp-portrait:before{top:0;bottom:0;height:auto;background:linear-gradient(90deg,rgba(10,14,14,.55) 0%,rgba(10,14,14,.2) 55%,rgba(10,14,14,0) 80%),linear-gradient(180deg,rgba(10,14,14,.55) 0%,rgba(10,14,14,.3) 30%,rgba(10,14,14,.4) 70%,rgba(10,14,14,.7) 100%)}#musician-page .vp-facts{align-items:flex-end}#musician-page .vp-facts .vp-btn{margin-left:0}\
@media (max-width:899px){#musician-page .vp-facts .vp-btn{padding:9px 18px;font-size:14px;letter-spacing:.02em}}#musician-page .vp-hero .vp-facts{background:none;padding:0;margin-top:18px;text-shadow:0 1px 8px rgba(0,0,0,.55)}#musician-page .vp-hero .vp-facts .vp-btn{text-shadow:none}#musician-page .vp-hero h1{margin-bottom:0}#musician-page .vp-similar.vp-two{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-card[hidden]{display:none}#musician-page .vp-pk-step[hidden],#musician-page .vp-field[hidden],#musician-page .vp-lineup[hidden]{display:none}#musician-page .vp-pk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}#musician-page .vp-pk{font:inherit;color:var(--vp-on-dark);text-align:left;cursor:pointer;background:none;border:0;padding:0;display:grid;gap:6px}#musician-page .vp-pk .vp-card-img{position:relative;aspect-ratio:3/2;transition:box-shadow .2s}#musician-page .vp-pk:hover .vp-card-img,#musician-page .vp-pk.vp-picked .vp-card-img{box-shadow:0 0 0 3px var(--vp-brass)}#musician-page .vp-pk.vp-picked .vp-tick{display:grid}#musician-page .vp-pk strong{font-family:var(--vp-display);font-weight:400;font-size:20px;margin-top:4px}#musician-page .vp-pk>span:not(.vp-tick){color:var(--vp-muted);font-size:14px;line-height:1.45}#musician-page .vp-pk-meta{font-style:normal;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--vp-brass)}#musician-page .vp-pk-price{font-weight:600;color:var(--vp-on-dark);font-size:16px;margin-top:2px}#musician-page .vp-pk-add small{font-family:var(--vp-body);font-size:14px;color:var(--vp-brass);margin-left:6px}#musician-page .vp-pk-total{margin-top:24px;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}#musician-page .vp-pk-total[hidden]{display:none}#musician-page .vp-pk-total span{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-muted)}#musician-page .vp-pk-total strong{font-family:var(--vp-display);font-weight:400;font-size:30px;color:var(--vp-on-dark)}#musician-page .vp-any-img{display:grid;place-items:center;background:rgba(61,194,187,.1);border:2px dashed rgba(61,194,187,.5)}#musician-page .vp-any-img>span:first-child{font-family:var(--vp-display);font-size:30px;color:var(--vp-brass)}#musician-page .vp-any-sub{font-size:13px;color:var(--vp-muted)}#musician-page .vp-lineups.vp-whens{grid-template-columns:repeat(3,minmax(0,1fr))}#musician-page .vp-whens .vp-lineup{padding:18px}#musician-page .vp-whens .vp-lineup strong{font-size:21px}@container (max-width:640px){#musician-page .vp-lineups.vp-whens{grid-template-columns:1fr}}#musician-page .vp-when-hint{margin:24px 0 -6px;color:var(--vp-on-dark);font-weight:600;font-size:17px}#musician-page .vp-pk-tag{font:inherit;font-size:16px;font-weight:600;padding:13px 24px;background:rgba(61,194,187,.12);border:2px solid var(--vp-brass);color:var(--vp-brass);cursor:pointer;transition:background .2s,border-color .2s,color .2s,transform .15s}#musician-page .vp-pk-tag:active{transform:scale(.96)}#musician-page .vp-pk-tag:not(.vp-picked):before{content:"+ "}@keyframes vpNudge{0%,100%{box-shadow:0 0 0 0 rgba(61,194,187,.5)}50%{box-shadow:0 0 0 7px rgba(61,194,187,0)}}#musician-page .vp-when-tags.vp-none .vp-pk-tag{animation:vpNudge 2.2s ease-in-out infinite}#musician-page .vp-when-tags.vp-none .vp-pk-tag:nth-child(2){animation-delay:.3s}#musician-page .vp-when-tags.vp-none .vp-pk-tag:nth-child(3){animation-delay:.6s}@media (prefers-reduced-motion:reduce){#musician-page .vp-when-tags.vp-none .vp-pk-tag{animation:none}}#musician-page .vp-when-tags{gap:10px}#musician-page .vp-pk-tag:hover{background:rgba(61,194,187,.25)}#musician-page .vp-pk-tag.vp-picked{background:var(--vp-brass);border-color:var(--vp-brass);color:#1f2727}#musician-page .vp-pk-tag.vp-picked:before{content:"\\2713  "}#musician-page .vp-pk-solo{font:inherit;color:var(--vp-on-dark);cursor:pointer;position:relative;width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;text-align:left;padding:24px 26px;border-radius:var(--vp-radius);border:2px solid rgba(234,230,221,.18);background:rgba(234,230,221,.05);transition:border-color .2s,background .2s}#musician-page .vp-pk-solo:hover{border-color:var(--vp-brass)}#musician-page .vp-pk-solo.vp-picked{border-color:var(--vp-brass);background:rgba(61,194,187,.12)}#musician-page .vp-pk-solo-l{display:grid;gap:4px}#musician-page .vp-pk-solo strong{font-family:var(--vp-display);font-weight:400;font-size:28px}#musician-page .vp-pk-solo-l span{color:var(--vp-muted);font-size:15px}#musician-page .vp-pk-solo b{font-size:20px;white-space:nowrap;margin-right:34px}#musician-page .vp-pk-solo .vp-tick{top:50%;right:18px;margin-top:-15px}#musician-page .vp-pk-solo.vp-picked .vp-tick{display:grid}#musician-page .vp-lineups.vp-extras{grid-template-columns:repeat(3,minmax(0,1fr))}#musician-page .vp-pk-linewrap,#musician-page .vp-pk-djwrap{margin-top:26px}#musician-page .vp-pk-linewrap[hidden],#musician-page .vp-pk-djwrap[hidden]{display:none}#musician-page .vp-pk-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}#musician-page .vp-pk-row .vp-pk strong{font-size:18px}#musician-page .vp-pk-row .vp-pk{opacity:.7;transition:opacity .45s,filter .45s,transform .45s}#musician-page .vp-pk-row .vp-pk:hover{opacity:1}#musician-page .vp-pk-row.vp-has-pick .vp-pk:not(.vp-picked){opacity:.22;filter:grayscale(1);transform:scale(.96)}#musician-page .vp-pk-row.vp-has-pick .vp-pk:not(.vp-picked):hover{opacity:.5}#musician-page .vp-pk-row .vp-pk.vp-picked{opacity:1;filter:none;transform:translateY(-4px)}@keyframes vpRise{0%{opacity:0;transform:translateY(26px)}100%{opacity:1;transform:none}}#musician-page .vp-pk-sum.vp-rise{animation:vpRise .6s cubic-bezier(.2,.8,.2,1)}#musician-page .vp-pk-tname{font-family:var(--vp-display);font-size:18px;color:var(--vp-on-dark)}#musician-page .vp-pk-budget{margin-top:14px;padding:12px 14px 8px;max-width:420px;border-radius:var(--vp-radius);background:rgba(234,230,221,.1);-webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);border:1px solid rgba(234,230,221,.28);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 8px 24px rgba(0,0,0,.18)}#musician-page .vp-pk-budget .vp-pk-group{margin:0 0 4px;font-size:14px}#musician-page .vp-pk-bud-val{display:block;font-family:var(--vp-display);font-size:22px;line-height:1.1;color:var(--vp-brass);margin:0 0 6px}#musician-page .vp-pk-range{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:999px;margin:4px 0;cursor:pointer;background:linear-gradient(to right,var(--vp-brass) 0,var(--vp-brass) var(--vp-fill,66.6%),rgba(255,255,255,.18) var(--vp-fill,66.6%));outline:none}#musician-page .vp-pk-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:var(--vp-brass);border:3px solid #1f2727;box-shadow:0 0 0 2px var(--vp-brass),0 4px 10px rgba(0,0,0,.35)}#musician-page .vp-pk-range::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--vp-brass);border:3px solid #1f2727;box-shadow:0 0 0 2px var(--vp-brass)}#musician-page .vp-pk-range:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 2px var(--vp-brass),0 0 0 6px rgba(61,194,187,.35)}#musician-page .vp-pk-bud-scale{display:flex;justify-content:space-between;font-size:11px;color:var(--vp-muted);margin-top:4px}@container (max-width:640px){#musician-page .vp-pk-row{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-lineups.vp-extras{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}}#musician-page .vp-pk-next{position:sticky;bottom:16px;z-index:3;margin-top:22px;display:flex;align-items:center;justify-content:space-between;gap:12px 18px;flex-wrap:wrap;padding:12px 12px 12px 20px;border-radius:999px;background:#171d1d;border:1px solid var(--vp-brass);box-shadow:0 10px 30px rgba(0,0,0,.45)}#musician-page .vp-pk-next[hidden]{display:none}#musician-page .vp-pk-next[data-next=result]{position:static;box-shadow:none}#musician-page .vp-pk-next-when{position:static;margin-top:18px}@keyframes vpPop{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:none}}#musician-page .vp-pk-next.vp-pop{animation:vpPop .45s cubic-bezier(.2,.8,.2,1)}#musician-page .vp-pk-next-t{font-size:14px;color:var(--vp-on-dark);min-width:0}#musician-page .vp-pk-next .vp-btn{margin:0;padding:11px 22px}@media (max-width:1000px){#musician-page .vp-pk-next{bottom:84px;border-radius:22px}}#musician-page .vp-explore[hidden]{display:none}#musician-page .vp-pk-lp{display:block;margin-top:6px;color:var(--vp-brass);font-weight:500}#musician-page .vp-pk-starts{display:grid;gap:14px}#musician-page .vp-pk-from{font-size:18px;color:var(--vp-brass);font-weight:500;text-align:right;line-height:1.2}#musician-page .vp-pk-from small{display:block;font-size:12px;color:var(--vp-muted);font-weight:400;letter-spacing:.02em}#musician-page .vp-nosolo-img{background:rgba(234,230,221,.04);border-color:rgba(234,230,221,.3)}#musician-page .vp-nosolo-img>span:first-child{color:var(--vp-muted)}#musician-page .vp-pk-nosolo.vp-picked .vp-card-img,#musician-page .vp-pk-any.vp-picked .vp-card-img{border-style:solid;border-color:var(--vp-brass)}#musician-page .vp-pk-nosolo.vp-picked .vp-tick,#musician-page .vp-pk-any.vp-picked .vp-tick{display:grid}#musician-page .vp-pk-sum{margin-top:14px;padding:18px 22px;border-radius:var(--vp-radius);background:rgba(234,230,221,.05);border:1px solid rgba(234,230,221,.14);max-width:620px}#musician-page .vp-pk-sum[hidden]{display:none}#musician-page .vp-pk-sum h3{font-size:18px;margin:0 0 10px;color:var(--vp-on-dark)}#musician-page .vp-pk-sum ul{margin:0;padding:0;list-style:none;display:grid;gap:8px}#musician-page .vp-pk-sum li{position:relative;padding-left:26px;color:var(--vp-on-dark);font-size:15px;line-height:1.45}#musician-page .vp-pk-sum li:before{content:"\\2713";position:absolute;left:0;top:0;color:var(--vp-brass);font-weight:700}#musician-page .vp-lineup.vp-has-img{padding:0 0 18px;overflow:hidden;align-content:start}#musician-page .vp-lineup.vp-has-img>strong,#musician-page .vp-lineup.vp-has-img>span:not(.vp-x-img){padding:0 20px}#musician-page .vp-pk-djwrap .vp-x-img{aspect-ratio:16/7}#musician-page .vp-pk-djwrap .vp-lineups{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-has-img>strong{font-size:21px}#musician-page .vp-x-img{display:block;aspect-ratio:16/10;overflow:hidden;margin-bottom:8px;background:var(--vp-line)}#musician-page .vp-x-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}#musician-page .vp-lineup.vp-has-img:hover .vp-x-img img{transform:scale(1.04)}@keyframes vpFlash{0%{box-shadow:0 0 0 0 rgba(61,194,187,.0)}25%{box-shadow:0 0 0 4px rgba(61,194,187,.9),0 0 40px rgba(61,194,187,.45)}100%{box-shadow:0 0 0 0 rgba(61,194,187,0)}}#musician-page .vp-form.vp-flash{animation:vpFlash 1.8s ease-out 2}#musician-page .vp-form.vp-flash #vp-fname{border-color:var(--vp-brass)}@keyframes vpPulse{0%{box-shadow:0 0 0 0 rgba(61,194,187,0)}35%{box-shadow:0 0 0 3px rgba(61,194,187,.85),0 0 26px rgba(61,194,187,.35)}100%{box-shadow:0 0 0 0 rgba(61,194,187,0)}}#musician-page .vp-form.vp-pulse,#musician-page .vp-sheet-bar.vp-pulse{animation:vpPulse .9s ease-out 2}#musician-page .vp-sheet-bar.vp-bar-msg span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 30px)}#musician-page .vp-pk-tradwrap{order:9;grid-column:1/-1;margin:-4px 0 6px;padding:14px 16px;border-radius:var(--vp-radius);background:rgba(61,194,187,.08);border:1px dashed rgba(61,194,187,.45)}#musician-page .vp-pk-tradwrap .vp-pk-group{margin:0 0 10px;font-size:17px}#musician-page .vp-pk-tradwrap[hidden]{display:none}#musician-page .vp-pk-mains{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:stretch}#musician-page .vp-pk-mains:not(.vp-pk-started) .vp-pk-opt{grid-template-rows:1fr}#musician-page .vp-pk-mains:not(.vp-pk-started) .vp-pk-card{height:100%}#musician-page .vp-pk-mains.vp-pk-started{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}#musician-page .vp-pk-opt.vp-pk-wide{grid-column:1/-1}#musician-page .vp-pk-opt.vp-pk-wide .vp-x-img{aspect-ratio:4/1}#musician-page .vp-pk-addhead{display:none}#musician-page .vp-pk-addtag{display:none;font-style:normal;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);padding:0 20px;margin-bottom:-2px}#musician-page .vp-pk-isadd .vp-pk-addtag{display:block}#musician-page .vp-pk-mains+.vp-pk-next{margin-top:18px}#musician-page .vp-pk-wbar{display:none}@media (max-width:760px){#musician-page.vp-pk-wz .vp-pk-wbar{display:flex;align-items:center;gap:10px;margin:8px 0 -4px;padding:10px 0;scroll-margin-top:70px}#musician-page.vp-pk-wz .vp-pk-back{font:inherit;font-size:14px;color:var(--vp-brass);background:none;border:1.5px solid rgba(61,194,187,.5);border-radius:999px;padding:5px 12px;cursor:pointer}#musician-page.vp-pk-wz .vp-pk-dots{display:flex;gap:6px}#musician-page.vp-pk-wz .vp-pk-dots i{width:8px;height:8px;border-radius:50%;background:rgba(234,230,221,.25);transition:background .2s,width .2s}#musician-page.vp-pk-wz .vp-pk-dots i.vp-on{background:var(--vp-brass)}#musician-page.vp-pk-wz .vp-pk-dots i.vp-on:nth-last-child(1),#musician-page.vp-pk-wz[data-ws="1"] .vp-pk-dots i:nth-child(1),#musician-page.vp-pk-wz[data-ws="2"] .vp-pk-dots i:nth-child(2){width:22px;border-radius:4px}#musician-page.vp-pk-wz .vp-pk-wlabel{margin-left:auto;font-size:12px;letter-spacing:.06em;color:var(--vp-muted)}#musician-page.vp-pk-wz .vp-pk-step>.vp-step{display:none}#musician-page.vp-pk-wz:not([data-ws="3"]) .vp-pk-step[data-step=result]{display:none!important}#musician-page.vp-pk-wz[data-ws="3"] .vp-pk-step[data-step=pick]{display:none!important}#musician-page.vp-pk-wz:not([data-ws="3"]) .vp-explore{display:none!important}#musician-page.vp-pk-wz[data-ws="1"] .vp-pk-sub,#musician-page.vp-pk-wz[data-ws="1"] .vp-pk-addhead,#musician-page.vp-pk-wz[data-ws="1"] .vp-pk-next[data-next=result]{display:none!important}#musician-page.vp-pk-wz[data-ws="1"] .vp-pk-opt{order:0!important}#musician-page.vp-pk-wz[data-ws="1"] .vp-pk-addtag{display:none}#musician-page.vp-pk-wz .vp-pk-mains,#musician-page.vp-pk-wz .vp-pk-mains.vp-pk-started{display:flex!important;flex-direction:column;gap:10px}#musician-page.vp-pk-wz .vp-pk-opt{display:grid;gap:8px;grid-column:auto!important;width:100%}#musician-page.vp-pk-wz .vp-pk-step[data-step]{padding-top:6px!important;margin-top:0!important}#musician-page.vp-pk-wz .vp-pk-wbar{margin-bottom:-44px}#musician-page.vp-pk-wz .vp-pk-card.vp-lineup.vp-has-img{display:grid;grid-template-columns:76px 1fr;grid-template-rows:auto auto;column-gap:14px;row-gap:2px;align-items:center;align-content:center;padding:8px 40px 8px 8px;min-height:92px;height:auto!important}#musician-page.vp-pk-wz .vp-pk-card .vp-x-img{grid-row:1/3;grid-column:1;width:76px;height:76px;aspect-ratio:1/1!important;margin:0;border-radius:10px}#musician-page.vp-pk-wz .vp-pk-card>strong{grid-column:2;align-self:end;padding:0!important;font-size:17px;line-height:1.25}#musician-page.vp-pk-wz .vp-pk-card>strong small{display:block;margin-top:2px}#musician-page.vp-pk-wz .vp-pk-card>span:not(.vp-x-img):not(.vp-tick){grid-column:2;align-self:start;padding:0!important;font-size:13px;line-height:1.4;color:var(--vp-muted)}#musician-page.vp-pk-wz .vp-pk-card .vp-pk-addtag{position:absolute;top:8px;right:10px;left:auto;margin:0;padding:2px 8px;font-size:9.5px}#musician-page.vp-pk-wz .vp-pk-card .vp-tick{top:50%!important;right:12px!important;left:auto!important;transform:translateY(-50%)}#musician-page.vp-pk-wz .vp-pk-addhead{order:2;margin-top:10px}#musician-page.vp-pk-wz .vp-pk-row{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin:0!important;padding:4px 0 10px!important;scrollbar-width:none}#musician-page.vp-pk-wz .vp-pk-row::-webkit-scrollbar{display:none}#musician-page.vp-pk-wz .vp-pk-row .vp-pk{flex:0 0 64%;scroll-snap-align:start}#musician-page.vp-pk-wz .vp-pk-row .vp-pk .vp-card-img{aspect-ratio:16/10}#musician-page.vp-pk-wz .vp-pk-in-r{animation:vpPkInR .3s ease-out}#musician-page.vp-pk-wz .vp-pk-in-l{animation:vpPkInL .3s ease-out}}@keyframes vpPkInR{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}@keyframes vpPkInL{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){#musician-page.vp-pk-wz .vp-pk-in-r,#musician-page.vp-pk-wz .vp-pk-in-l{animation:none}}#musician-page .vp-pk-opt{display:grid;gap:10px}@container (max-width:640px){#musician-page .vp-pk-mains,#musician-page .vp-pk-mains.vp-pk-started{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}#musician-page .vp-pk-mains:not(.vp-pk-started) .vp-pk-opt[data-o=dj]{grid-column:1/-1}#musician-page .vp-pk-mains:not(.vp-pk-started) .vp-pk-opt[data-o=dj] .vp-x-img{aspect-ratio:4/1!important}#musician-page .vp-pk-opt.vp-pk-ismain{grid-column:1/-1}#musician-page .vp-pk-opt.vp-pk-ismain .vp-x-img{aspect-ratio:3/1!important}#musician-page .vp-pk-opt.vp-pk-wide{grid-column:auto}#musician-page .vp-pk-opt.vp-pk-wide .vp-x-img{aspect-ratio:2/1!important}#musician-page .vp-pk-addhead:not([hidden]){display:block;order:2;grid-column:1/-1;margin-top:6px;font-size:14px;color:var(--vp-muted)}#musician-page .vp-pk-addhead strong{color:var(--vp-on-dark);font-size:16px;margin-right:4px}#musician-page .vp-pk-isadd .vp-pk-addtag{display:none}#musician-page .vp-pk-isadd{align-content:start}}#musician-page .vp-pk-card{position:relative;width:100%}#musician-page .vp-pk-card .vp-tick{top:10px;right:10px;z-index:2}#musician-page .vp-pk-card.vp-picked .vp-tick{display:grid}#musician-page .vp-pk-cprice{display:block;font-family:var(--vp-body);font-size:14px;color:var(--vp-brass);margin-top:4px}#musician-page .vp-pk-sub{padding:14px 16px;border-radius:var(--vp-radius);background:rgba(61,194,187,.08);border:1px dashed rgba(61,194,187,.45)}#musician-page .vp-pk-sub[hidden]{display:none}#musician-page .vp-pk-sub .vp-pk-group{margin:0 0 10px;font-size:17px}#musician-page .vp-pk-opt.vp-on .vp-pk-sub{animation:vpPop .45s cubic-bezier(.2,.8,.2,1)}#musician-page .vp-pk-change{margin:0;padding:8px 16px;font-size:14px}#musician-page .vp-pk-change[hidden]{display:none}#musician-page .vp-pk-hours{display:block;font-style:normal;font-size:15px;letter-spacing:.04em;text-transform:none;color:var(--vp-brass);margin-top:4px}#musician-page .vp-pk-hours.vp-pk-big{display:inline-block;margin-top:8px;padding:4px 12px;border-radius:999px;border:1.5px solid var(--vp-brass);background:rgba(61,194,187,.14);font-weight:600}#musician-page .vp-pk-opt[data-o=solo]{order:1}#musician-page .vp-pk-opt[data-o=trad]{order:2}#musician-page .vp-pk-opt[data-o=dj]{order:3}@container (max-width:640px){#musician-page .vp-pk-card.vp-lineup.vp-has-img{padding:0 0 10px;gap:2px}#musician-page .vp-pk-card .vp-x-img{aspect-ratio:2/1!important;margin-bottom:6px}#musician-page .vp-pk-card>strong{font-size:17px!important;line-height:1.2;padding:0 12px!important}#musician-page .vp-pk-card .vp-pk-cprice{font-size:12px;margin-top:2px}#musician-page .vp-pk-card>span:not(.vp-x-img):not(.vp-tick){display:none}#musician-page .vp-pk-card .vp-tick{width:24px;height:24px;top:6px;right:6px;font-size:13px}#musician-page .vp-pk-sub{padding:10px 12px}#musician-page .vp-pk-sub .vp-pk-group{font-size:15px;margin-bottom:8px}#musician-page .vp-pk-pill{padding:8px 13px;font-size:14px}#musician-page.vp-pk-page .vp-about p{font-size:14.5px;line-height:1.55}#musician-page .vp-when-hint{font-size:15px;margin-top:16px}#musician-page .vp-when-tags{flex-wrap:nowrap;gap:6px}#musician-page .vp-pk-tag{font-size:12px;padding:8px 10px;white-space:nowrap;flex:0 1 auto}#musician-page .vp-pk-tag:not(.vp-picked):before{content:"+"}}#musician-page .vp-pk-pills{display:flex;flex-wrap:wrap;gap:10px}#musician-page .vp-pk-pill{font:inherit;cursor:pointer;padding:10px 18px;border-radius:999px;border:2px solid rgba(234,230,221,.22);background:rgba(234,230,221,.05);color:var(--vp-on-dark);font-size:15px;text-align:left;transition:border-color .2s,background .2s}#musician-page .vp-pk-pill strong{font-weight:600}#musician-page .vp-pk-pill span{color:var(--vp-muted);font-size:14px}#musician-page .vp-pk-pill:hover{border-color:var(--vp-brass)}#musician-page .vp-pk-pill.vp-picked{border-color:var(--vp-brass);background:var(--vp-brass);color:#1f2727}#musician-page .vp-pk-pill.vp-picked span{color:#1f2727}#musician-page .vp-aside.vp-aside-off{opacity:0;visibility:hidden;pointer-events:none}@keyframes vpAsideIn{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:none}}#musician-page .vp-aside.vp-aside-in .vp-sheet,#musician-page .vp-aside.vp-aside-in .vp-form{animation:vpAsideIn .6s cubic-bezier(.2,.8,.2,1)}#musician-page .vp-pk-picks{margin-top:18px}#musician-page .vp-pk-picks[hidden]{display:none}#musician-page .vp-pk-picks-t{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);margin-bottom:8px}#musician-page .vp-pk-chips{display:flex;flex-wrap:wrap;gap:8px}@keyframes vpDrop{0%{opacity:0;transform:translateY(-40px) scale(.9)}70%{transform:translateY(4px)}100%{opacity:1;transform:none}}#musician-page .vp-pk-chip{font:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:8px;padding:4px 12px 4px 4px;border-radius:999px;background:var(--vp-brass);color:#1f2727;border:0;font-weight:600;font-size:15px;transition:opacity .2s}#musician-page .vp-ghost{position:fixed;z-index:99991;object-fit:cover;border-radius:14px;pointer-events:none;box-shadow:0 12px 30px rgba(0,0,0,.45),0 0 0 3px var(--vp-brass);transform-origin:0 0;transition:transform .9s cubic-bezier(.55,0,.25,1),border-radius .9s,opacity .9s;background:var(--vp-line)}@keyframes vpLand{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}#musician-page .vp-chip-land{animation:vpLand .5s ease-out}#musician-page .vp-pk-chip img{width:34px;height:34px;border-radius:50%;object-fit:cover}#musician-page .vp-pk-chip b{font-size:13px;opacity:.7;margin-left:2px}#musician-page .vp-main>section{min-width:0}#musician-page [data-step=musician] .vp-car{position:relative}#musician-page [data-step=musician] .vp-performers{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;padding:4px 2px 12px;scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-behavior:smooth}#musician-page [data-step=musician] .vp-performers::-webkit-scrollbar{display:none}#musician-page [data-step=musician] .vp-performers>.vp-performer{flex:0 0 calc((100% - 48px)/5);scroll-snap-align:start;min-width:0}#musician-page [data-step=musician] .vp-pick h3{font-size:16px}#musician-page [data-step=musician] .vp-any-sub{font-size:12px}#musician-page .vp-car-btn{position:absolute;top:calc(50% - 46px);z-index:3;width:44px;height:44px;border-radius:50%;border:1.5px solid var(--vp-brass);background:rgba(0,0,0,.88);color:var(--vp-brass);cursor:pointer;display:grid;place-items:center;box-shadow:0 6px 18px rgba(0,0,0,.4);transition:opacity .2s,background .2s}#musician-page .vp-car-btn svg{width:22px;height:22px}#musician-page .vp-car-btn:hover{background:var(--vp-brass);color:#1f2727}#musician-page .vp-car-btn:disabled{opacity:0;pointer-events:none}#musician-page .vp-car-prev{left:-14px}#musician-page .vp-car-next{right:-14px}@container (max-width:640px){#musician-page [data-step=musician] .vp-performers{margin:0 -16px;padding:4px 16px 14px;scroll-padding:0 16px}#musician-page .vp-car-btn{display:none}#musician-page [data-step=musician] .vp-performers::-webkit-scrollbar{display:none}#musician-page [data-step=musician] .vp-performers>.vp-performer{flex:0 0 44%}#musician-page [data-step=musician] .vp-performers>.vp-performer.vp-is-picked{display:none}#musician-page .vp-pk-tradwrap{order:0}}#musician-page .vp-elist{border:1px dashed rgba(61,194,187,.5);background:rgba(61,194,187,.07);border-radius:14px;padding:10px 14px;margin:2px 0 6px}#musician-page .vp-elist[hidden]{display:none}#musician-page .vp-elist-t{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);margin-bottom:6px}#musician-page .vp-elist ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}#musician-page .vp-elist li{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;font-size:14px;color:var(--vp-on-dark);line-height:1.35}#musician-page .vp-elist li button{font:inherit;background:none;border:0;color:var(--vp-muted);cursor:pointer;padding:0 2px;font-size:13px}#musician-page .vp-elist li button:hover{color:var(--vp-brass)}#musician-page .vp-add{font:inherit;cursor:pointer;width:100%;margin:0;padding:11px 18px;font-size:15px;text-align:center}#musician-page .vp-add-note{margin:0;font-size:13px;color:var(--vp-muted);line-height:1.45}#musician-page .vp-add-note a{color:var(--vp-brass)}#musician-page .vp-add-note[hidden],#musician-page .vp-add[hidden]{display:none}#musician-page .vp-pk-other{margin-top:28px;padding:18px 20px;border-radius:var(--vp-radius);border:1px solid rgba(234,230,221,.16);background:rgba(234,230,221,.04);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px 20px}#musician-page .vp-pk-other strong{display:block;font-family:var(--vp-display);font-weight:400;font-size:21px;color:var(--vp-on-dark);margin-bottom:4px}#musician-page .vp-pk-other span{color:var(--vp-muted);font-size:15px;line-height:1.45}#musician-page .vp-pk-other .vp-btn{margin:0;white-space:nowrap}#musician-page .vp-pm{position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.78);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px}#musician-page .vp-pm[hidden]{display:none}@keyframes vpPmIn{0%{opacity:0;transform:translateY(24px) scale(.98)}100%{opacity:1;transform:none}}#musician-page .vp-pm-box{position:relative;width:100%;max-width:640px;max-height:calc(100vh - 40px);max-height:calc(100dvh - 40px);overflow-y:auto;overscroll-behavior:contain;background:var(--vp-surface);border:1px solid var(--vp-line);border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.5);animation:vpPmIn .35s cubic-bezier(.2,.8,.2,1)}#musician-page .vp-pm-x{position:absolute;top:12px;right:12px;z-index:2;width:38px;height:38px;border-radius:50%;border:0;background:rgba(0,0,0,.7);color:#eae6dd;font-size:16px;cursor:pointer}#musician-page .vp-pm-top{position:relative}#musician-page .vp-pm-top img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}#musician-page .vp-pm-top:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.85) 100%)}#musician-page .vp-pm-top h3{position:absolute;left:24px;bottom:14px;z-index:1;margin:0;font-family:var(--vp-display);font-weight:400;font-size:34px;color:#eae6dd}#musician-page .vp-pm-in{padding:18px 24px 24px;display:grid;gap:12px}#musician-page .vp-pm-in .vp-tags{margin:0}#musician-page .vp-pm-in p{margin:0;color:var(--vp-on-dark);line-height:1.6;font-size:15.5px}#musician-page .vp-pm-vid{position:relative;margin:4px 0 0}#musician-page .vp-pm-vid video{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--vp-radius);background:#171d1d;display:block}#musician-page .vp-pm-tall{max-width:300px}#musician-page .vp-pm-tall video{aspect-ratio:9/16}#musician-page .vp-pm-btns{display:flex;flex-wrap:wrap;gap:10px;position:sticky;bottom:0;z-index:2;margin:6px -24px -24px;padding:14px 24px 18px;background:var(--vp-surface);border-top:1px solid var(--vp-line)}#musician-page .vp-performer.vp-skipped{opacity:.35;filter:grayscale(1);transition:opacity .3s,filter .3s}#musician-page .vp-performer.vp-skipped:hover{opacity:.7}#musician-page .vp-pm-skip{color:var(--vp-muted)!important;border-color:rgba(234,230,221,.3)!important}#musician-page .vp-pm-btns .vp-btn{margin:0;font:inherit;cursor:pointer;padding:12px 22px;font-size:15px}@media (max-width:640px){#musician-page .vp-pm{padding:0;align-items:flex-end}#musician-page .vp-pm-box{border-radius:20px 20px 0 0;max-height:92dvh}#musician-page .vp-pm-top h3{font-size:28px}}#musician-page .vp-arw{width:15px;height:15px;margin-left:6px;vertical-align:-2px}#musician-page .vp-collage{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:2px;opacity:.55;filter:grayscale(.3)}#musician-page .vp-collage img{width:100%;height:100%;object-fit:cover;display:block}#musician-page .vp-pk-any .vp-any-img{position:relative;overflow:hidden}#musician-page .vp-pk-any .vp-any-label{position:relative;z-index:1;padding:6px 18px;border-radius:999px;background:rgba(0,0,0,.75);font-family:var(--vp-display);font-size:26px;color:var(--vp-brass)}#musician-page .vp-pk-any:hover .vp-collage,#musician-page .vp-pk-any.vp-picked .vp-collage{opacity:.85;filter:none}#musician-page .vp-collage{transition:opacity .3s,filter .3s}@container (max-width:640px){#musician-page .vp-pk-any .vp-any-label{padding:4px 12px;font-size:20px}}#musician-page .vp-build-note.vp-pk-mnote{color:var(--vp-on-dark)}#musician-page .vp-pk-price-line{display:block;color:var(--vp-brass);font-weight:600;font-size:17px;margin-bottom:4px}#musician-page .vp-rel .vp-card-img{position:relative}#musician-page .vp-rel .vp-here .vp-card-img{box-shadow:0 0 0 3px var(--vp-brass)}#musician-page .vp-here-tag{position:absolute;left:10px;top:10px;padding:4px 10px;border-radius:999px;background:var(--vp-brass);color:#1f2727;font-size:12px;font-weight:600}#musician-page .vp-rel p{min-height:0}#musician-page .vp-tabs{display:flex;gap:10px;flex-wrap:wrap;padding-top:18px;padding-bottom:6px}#musician-page .vp-tab{flex:1 1 160px;display:grid;gap:2px;text-decoration:none!important;padding:12px 18px;border-radius:14px;border:1.5px solid rgba(234,230,221,.18);background:rgba(234,230,221,.04);color:var(--vp-on-dark)!important;transition:border-color .2s,background .2s}#musician-page .vp-tab strong{font-family:var(--vp-display);font-weight:400;font-size:19px}#musician-page .vp-tab span{font-size:13px;color:var(--vp-muted)}#musician-page .vp-tab:hover{border-color:var(--vp-brass)}#musician-page .vp-tab.vp-tab-on{border-color:var(--vp-brass);background:rgba(61,194,187,.12)}#musician-page .vp-tab.vp-tab-on span{color:var(--vp-brass)}@media (max-width:640px){#musician-page .vp-tabs{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:8px}#musician-page .vp-tabs::-webkit-scrollbar{display:none}#musician-page .vp-tab{flex:0 0 auto;padding:9px 14px}#musician-page .vp-tab strong{font-size:16px}#musician-page .vp-tab span{font-size:12px}}#musician-page.vp-theme-dj .vp-hero:after{background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.85) 100%),radial-gradient(120% 90% at 85% 10%,rgba(124,92,255,.35) 0%,rgba(124,92,255,0) 55%),radial-gradient(90% 80% at 10% 100%,rgba(61,194,187,.28) 0%,rgba(61,194,187,0) 60%)}#musician-page.vp-theme-dj .vp-eyebrow{color:#b9a8ff}#musician-page.vp-theme-dj .vp-tab.vp-tab-on{border-color:#8f7bff;background:linear-gradient(135deg,rgba(124,92,255,.22),rgba(61,194,187,.14))}#musician-page.vp-theme-dj .vp-tab.vp-tab-on span{color:#c9bcff}#musician-page.vp-theme-dj .vp-tag{border-color:rgba(143,123,255,.55)}#musician-page.vp-theme-dj .vp-main h2:after{content:"";display:block;width:46px;height:3px;border-radius:3px;margin-top:10px;background:linear-gradient(90deg,#8f7bff,#3dc2bb)}#musician-page .vp-pk-btns{display:flex;flex-wrap:wrap;gap:12px;align-items:center}#musician-page .vp-pk-reset{font:inherit;cursor:pointer;margin:0;padding:12px 22px;font-size:15px}#musician-page .vp-pk-cta{display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin-top:18px}#musician-page .vp-pk-cta .vp-btn{margin:0;position:static}#musician-page .vp-pk-foot{margin:0;font-size:16px;line-height:1.55;color:var(--vp-on-dark);opacity:.85;max-width:620px}#musician-page .vp-pk-group{font-size:22px;margin:30px 0 6px;color:var(--vp-on-dark)}#musician-page .vp-build h2+.vp-pk-group{margin-top:0}#musician-page .vp-pk-small{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}#musician-page .vp-pk-small .vp-pk{padding:18px;border-radius:var(--vp-radius);border:2px solid rgba(234,230,221,.18);background:rgba(234,230,221,.05);align-content:start}#musician-page .vp-pk-small .vp-pk:hover,#musician-page .vp-pk-small .vp-pk.vp-picked{border-color:var(--vp-brass)}#musician-page .vp-pk-small .vp-pk.vp-picked{background:rgba(61,194,187,.12)}#musician-page .vp-pk-small .vp-pk-price{font-size:13px;font-weight:500;color:var(--vp-brass)}@container (max-width:640px){#musician-page .vp-pk-small{grid-template-columns:repeat(2,minmax(0,1fr))}}@container (max-width:640px){#musician-page .vp-pk-grid{grid-template-columns:1fr}}#musician-page .vp-step{display:inline-block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);margin-bottom:6px}#musician-page .vp-build h2{margin-bottom:18px}#musician-page .vp-build .vp-h2row{margin-bottom:6px}#musician-page .vp-build .vp-h2row h2{margin-bottom:0}#musician-page .vp-build-note{margin:-6px 0 18px;color:var(--vp-muted)}#musician-page .vp-lineups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}#musician-page .vp-lineup{font:inherit;text-align:left;cursor:pointer;display:grid;gap:6px;padding:22px 24px;border-radius:var(--vp-radius);background:rgba(234,230,221,.05);border:2px solid rgba(234,230,221,.18);color:var(--vp-on-dark);transition:border-color .2s,background .2s}#musician-page .vp-lineup strong{font-family:var(--vp-display);font-weight:400;font-size:26px;color:var(--vp-on-dark)}#musician-page .vp-lineup span{color:var(--vp-muted);font-size:15px;line-height:1.45}#musician-page .vp-lineup:hover{border-color:var(--vp-brass)}#musician-page .vp-lineup.vp-picked{border-color:var(--vp-brass);background:rgba(61,194,187,.12)}#musician-page .vp-performers{grid-template-columns:repeat(4,minmax(0,1fr));gap:18px 14px}#musician-page .vp-performer{gap:6px}#musician-page .vp-pick{font:inherit;color:inherit;background:none;border:0;padding:0;text-align:left;cursor:pointer;display:grid;gap:8px}#musician-page .vp-pick h3{font-size:19px}#musician-page .vp-performer a{font-size:13px;color:var(--vp-brass);text-decoration:none}#musician-page .vp-pick .vp-card-img{position:relative;transition:box-shadow .2s}#musician-page .vp-pick:hover .vp-card-img{box-shadow:0 0 0 3px var(--vp-brass)}#musician-page .vp-tick{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;background:var(--vp-brass);color:#1f2727;display:none;place-items:center;font-weight:700}#musician-page .vp-pick.vp-picked .vp-card-img{box-shadow:0 0 0 3px var(--vp-brass)}#musician-page .vp-pick.vp-picked .vp-tick{display:grid}@container (max-width:640px){#musician-page .vp-performers{grid-template-columns:repeat(2,minmax(0,1fr))}#musician-page .vp-lineups{grid-template-columns:1fr}}@container (min-width:461px){#musician-page .vp-split.vp-split-tall{grid-template-columns:minmax(0,1fr) minmax(200px,260px)!important;gap:24px 32px;align-items:center}#musician-page .vp-split.vp-split-tall .vp-video.vp-tall{justify-self:end;max-width:260px}}/* tidy builder: tag sits on the photo so cards line up */#musician-page .vp-pk-card .vp-pk-addtag{position:absolute;top:10px;left:10px;z-index:2;margin:0;padding:4px 10px;border-radius:999px;background:rgba(31,39,39,.82);font-size:10.5px;line-height:1.3}#musician-page .vp-pk-budget.vp-pk-budget .vp-pk-group{font-size:15px;margin:0 0 4px}@media (min-width:900px){#musician-page .vp-pk-mains.vp-pk-started{align-items:stretch;grid-auto-rows:auto;row-gap:0;column-gap:16px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-opt{grid-row:span 2;grid-template-rows:subgrid;row-gap:10px;margin-bottom:16px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-card{height:100%;align-content:start}#musician-page .vp-pk-mains.vp-pk-started .vp-x-img{aspect-ratio:21/9!important}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-opt.vp-pk-wide .vp-x-img{aspect-ratio:5/1!important}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-card.vp-lineup.vp-has-img{padding-bottom:14px;gap:4px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-card>strong{font-size:22px;padding:0 18px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-card>span:not(.vp-x-img):not(.vp-tick){font-size:14px;padding:0 18px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-sub{padding:12px 14px;align-self:start}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-sub .vp-pk-group{font-size:16px;margin:0 0 8px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-pills{gap:8px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-pill{padding:7px 14px;font-size:14px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-pill span{font-size:13px}}@media (max-width:899px){#musician-page .vp-pk-sub .vp-pk-pill{padding:7px 12px;font-size:13px;line-height:1.3}#musician-page .vp-pk-sub .vp-pk-pill span{font-size:12px}#musician-page .vp-pk-budget.vp-pk-budget{padding:10px 11px 6px}#musician-page .vp-pk-budget.vp-pk-budget .vp-pk-group{font-size:13px;line-height:1.3}#musician-page .vp-pk-bud-val{font-size:20px}}';
  document.head.appendChild(st2);
  var st3 = document.createElement('style');
  st3.textContent = '#musician-page .vp-hero h1.vp-sr{position:absolute;width:1px;height:1px;margin:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'
    + '#musician-page .vp-hero h1.vp-sr+.vp-facts{margin-top:14px}'
    + '#musician-page .vp-pk-parts{margin:4px 0 14px;padding:14px 16px;border-radius:var(--vp-radius);border:1px solid rgba(61,194,187,.45);background:rgba(61,194,187,.08)}#musician-page .vp-pk-parts[hidden]{display:none}'
    + '#musician-page .vp-pk-parts-t{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);margin-bottom:10px}'
    + '#musician-page .vp-pk-parts-row{display:flex;flex-wrap:wrap;gap:8px}#musician-page .vp-pk-part{font:inherit;font-size:14.5px;cursor:pointer;padding:8px 14px;border-radius:999px;border:1.5px solid rgba(234,230,221,.25);background:none;color:var(--vp-on-dark)}'
    + '#musician-page .vp-pk-part.vp-done{border-color:var(--vp-brass);color:var(--vp-brass)}#musician-page .vp-pk-part.vp-on{background:var(--vp-brass);border-color:var(--vp-brass);color:#1f2727;font-weight:600}'
    + '#musician-page .vp-pk-budget{display:grid;grid-template-columns:1fr auto;grid-template-areas:"h h" "note note" "val btn" "rng rng" "sc sc" "msg msg";align-items:center;column-gap:12px}'
    + '#musician-page .vp-pk-budget>h3{grid-area:h}#musician-page .vp-pk-bud-note{grid-area:note;margin:0 0 8px!important;font-size:13px;line-height:1.4;color:var(--vp-muted)}#musician-page .vp-pk-budget>.vp-pk-bud-val{grid-area:val;margin:0}#musician-page .vp-pk-budget>.vp-pk-range{grid-area:rng;margin-top:8px}#musician-page .vp-pk-budget>.vp-pk-bud-scale{grid-area:sc}'
    + '#musician-page .vp-pk-budget>.vp-pk-bud-ok{display:contents}#musician-page .vp-pk-bud-ok>.vp-pk-bud-btn{grid-area:btn;justify-self:end;white-space:nowrap}'
    + '@container (max-width:640px){#musician-page .vp-pk-bud-ok>.vp-pk-bud-btn{padding:7px 11px;font-size:12.5px}#musician-page .vp-pk-budget .vp-pk-bud-val{font-size:18px}}#musician-page .vp-pk-bud-ok>.vp-pk-bud-msg{grid-area:msg;margin-top:6px}#musician-page .vp-pk-bud-msg:empty{display:none}'
    + '#musician-page .vp-pk-bud-ok{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-top:12px}#musician-page .vp-pk-bud-btn{margin:0;font:inherit;font-weight:600;cursor:pointer;padding:10px 18px;font-size:14.5px}'
    + '#musician-page .vp-pk-bud-btn.vp-ok{background:transparent;color:var(--vp-brass);border:1.5px solid var(--vp-brass)}#musician-page .vp-pk-bud-msg{font-size:14px;color:var(--vp-muted)}#musician-page .vp-pk-bud-msg.vp-err{color:#f0a48c;font-weight:600}'
    + '#musician-page .vp-pk-budget.vp-flashfield{animation:vpField 1.3s ease-out}'
    // Packages: once something is picked, the three options sit side by side in compact columns (wider screens only)
    + '@container (min-width:641px){#musician-page .vp-pk-mains.vp-pk-started{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:start}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-opt{gap:8px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-opt.vp-pk-wide{grid-column:auto}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-card .vp-x-img,#musician-page .vp-pk-mains.vp-pk-started .vp-pk-opt.vp-pk-wide .vp-x-img{aspect-ratio:16/9!important;margin-bottom:6px}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-card.vp-lineup.vp-has-img{padding:0 0 12px;gap:3px}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-card>strong{font-size:18px!important;line-height:1.2;padding:0 14px!important}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-card>span:not(.vp-x-img):not(.vp-tick){padding:0 14px!important;font-size:13px;line-height:1.4}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-cprice{font-size:13px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-addtag{padding:0 14px;font-size:10px}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-sub{padding:10px 11px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-sub .vp-pk-group{font-size:14.5px;margin:0 0 8px}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-pills{gap:6px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-pill{padding:7px 12px;font-size:13.5px;border-width:1.5px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-pill span{font-size:12.5px}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-pk-budget{max-width:none;margin-top:10px}#musician-page .vp-pk-mains.vp-pk-started .vp-pk-bud-btn{padding:7px 12px;font-size:13px}'
    + '#musician-page .vp-pk-mains.vp-pk-started .vp-tick{width:24px;height:24px;font-size:13px;top:8px;right:8px}}'
    // "When do you need music?": a pick-one choice (no plus signs, no pulsing)
    + '#musician-page .vp-when-tags{gap:8px!important}#musician-page .vp-when-tags.vp-none .vp-pk-tag,#musician-page .vp-pk-tag{animation:none!important}'
    + '#musician-page .vp-pk-tag{display:inline-flex;align-items:center;gap:9px;font:inherit;font-size:15px;font-weight:500;padding:10px 18px 10px 14px;border-radius:999px;border:1.5px solid rgba(234,230,221,.22);background:rgba(234,230,221,.04);color:var(--vp-on-dark);cursor:pointer;box-shadow:none;transition:border-color .2s,background .2s}'
    + '#musician-page .vp-pk-tag:hover{border-color:var(--vp-brass);background:rgba(61,194,187,.08)}'
    + '#musician-page .vp-pk-tag:before,#musician-page .vp-pk-tag:not(.vp-picked):before,#musician-page .vp-pk-tag.vp-picked:before{content:"";flex:none;width:15px;height:15px;border-radius:50%;border:2px solid rgba(234,230,221,.45);box-sizing:border-box;transition:border-color .2s,background .2s}'
    + '#musician-page .vp-pk-tag.vp-picked{background:rgba(61,194,187,.14);border-color:var(--vp-brass);color:var(--vp-on-dark);font-weight:600}'
    + '#musician-page .vp-pk-tag.vp-picked:before{border-color:var(--vp-brass);background:var(--vp-brass);box-shadow:inset 0 0 0 3px #1f2727}'
    + '@container (max-width:640px){#musician-page .vp-when-tags{flex-wrap:wrap!important}#musician-page .vp-pk-tag{font-size:13.5px;padding:8px 13px 8px 11px;gap:7px;white-space:nowrap}#musician-page .vp-pk-tag:before,#musician-page .vp-pk-tag:not(.vp-picked):before{width:13px;height:13px;content:""}}'
    + '#musician-page .vp-pk-days{margin-top:14px}#musician-page .vp-pk-days[hidden]{display:none}#musician-page .vp-pk-days>h3{font-size:19px;margin:0 0 12px;color:var(--vp-on-dark)}'
    + '#musician-page .vp-pk-days-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;align-items:stretch}'
    + '#musician-page .vp-pk-day{font:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:var(--vp-radius);border:1.5px solid rgba(234,230,221,.18);background:rgba(234,230,221,.05);color:var(--vp-on-dark);transition:border-color .2s}'
    + '#musician-page .vp-pk-day:hover{border-color:var(--vp-brass)}#musician-page .vp-pk-day.vp-on{border-color:var(--vp-brass);background:rgba(61,194,187,.1)}'
    + '#musician-page .vp-pk-day-t{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass)}#musician-page .vp-pk-day-t em{font-style:normal;margin-left:6px;padding:2px 8px;border-radius:999px;background:var(--vp-brass);color:#1f2727;letter-spacing:.06em;font-size:10px}'
    + '#musician-page .vp-pk-day strong{font-family:var(--vp-display);font-weight:400;font-size:19px;line-height:1.2}'
    + '#musician-page .vp-pk-day ul{list-style:none;margin:2px 0 0;padding:0;display:grid;gap:4px}#musician-page .vp-pk-day li{position:relative;padding-left:18px;font-size:13.5px;line-height:1.4;color:var(--vp-muted)}#musician-page .vp-pk-day li:before{content:"\\2713";position:absolute;left:0;color:var(--vp-brass);font-weight:700}'
    + '#musician-page .vp-pk-day-h{margin-top:auto;padding-top:6px;font-size:13px;color:var(--vp-muted)}#musician-page .vp-pk-day-p{font-weight:600;font-size:16px;color:var(--vp-on-dark)}#musician-page .vp-pk-day-go{font-size:13px;color:var(--vp-brass);font-weight:600}'
    + '#musician-page .vp-pk-day-empty{border-style:dashed;justify-content:center}#musician-page .vp-pk-day-empty strong{color:var(--vp-muted);font-size:17px}'
    + '#musician-page .vp-pk-grand{margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 20px;padding:16px 20px;border-radius:var(--vp-radius);background:var(--vp-brass);color:#1f2727}'
    + '#musician-page .vp-pk-grand span{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:600}#musician-page .vp-pk-grand small{display:block;font-size:13px;margin-top:2px}'
    + '#musician-page .vp-pk-grand strong{font-family:var(--vp-display);font-weight:400;font-size:clamp(24px,3vw,32px);line-height:1}'
    + '#musician-page .vp-pk-tpart{display:block;font-family:var(--vp-body);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--vp-brass);margin-bottom:2px}'
    + '#musician-page .vp-pk-more{margin-top:18px;padding:18px 20px;border-radius:var(--vp-radius);border:1px dashed rgba(61,194,187,.55);background:rgba(61,194,187,.06);max-width:620px}#musician-page .vp-pk-more[hidden]{display:none}'
    + '#musician-page .vp-pk-more h3{font-size:19px;margin:0 0 4px;color:var(--vp-on-dark)}#musician-page .vp-pk-more p{color:var(--vp-muted);font-size:14.5px;margin:0 0 12px}'
    + '#musician-page .vp-pk-more-btns{display:flex;flex-wrap:wrap;gap:10px}#musician-page .vp-pk-more-btns .vp-btn{margin:0;font:inherit;font-weight:600;cursor:pointer;padding:10px 18px;font-size:14.5px}'
    + '#musician-page .vp-pk-nextpart{margin:0;font:inherit;font-weight:600;cursor:pointer;padding:12px 22px}#musician-page .vp-pk-nextpart[hidden],#musician-page .vp-pk-go[hidden]{display:none}'
    + '#musician-page .vp-elist .vp-el-who{display:flex;align-items:center;gap:10px;min-width:0}#musician-page .vp-elist li.vp-el-m{align-items:center}'
    + '#musician-page .vp-elist .vp-el-who img{width:38px;height:38px;border-radius:50%;object-fit:cover;flex:none;border:2px solid var(--vp-brass)}'
    + '#musician-page .vp-choose{display:grid;gap:10px;justify-items:start}#musician-page .vp-choose.vp-choose-tight{margin-bottom:-48px}#musician-page .vp-choose .vp-add{margin:0;font:inherit;font-weight:600;cursor:pointer;padding:14px 26px}#musician-page .vp-choose .vp-add[disabled]{opacity:.6}#musician-page .vp-choose .vp-add-note{color:var(--vp-muted);font-size:14.5px;max-width:60ch}#musician-page .vp-choose .vp-add-note a{color:var(--vp-brass)}'
    + '@media (max-width:640px){#musician-page .vp-choose.vp-choose-tight{margin-bottom:-36px}#musician-page .vp-choose .vp-add{width:100%}}'
    + '#musician-page .vp-addpk{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 28px;padding:22px 24px;border-radius:var(--vp-radius);border:1px solid rgba(61,194,187,.45);background:rgba(61,194,187,.08)}'
    + '#musician-page .vp-addpk h2{font-size:clamp(22px,2.6vw,28px)!important;margin:0 0 6px!important}#musician-page .vp-addpk p{color:var(--vp-muted);max-width:52ch;font-size:15.5px}'
    + '#musician-page .vp-addpk .vp-addpk-btn{margin:0;white-space:nowrap}'
    + '#musician-page .vp-pk-with{margin:0 0 16px;padding:12px 16px;border-radius:var(--vp-radius-sm);background:rgba(61,194,187,.12);border:1px solid var(--vp-brass);color:var(--vp-on-dark);font-size:15px}#musician-page .vp-pk-with strong{color:var(--vp-brass)}'
    + '#musician-page.vp-anon .vp-hero{min-height:min(48vh,420px)}#musician-page.vp-anon .vp-hero-in{padding-bottom:28px}'
    + '#musician-page.vp-anon .vp-body{padding-top:36px}#musician-page.vp-anon .vp-main h2{margin-bottom:12px}'
    + '@container (min-width:641px){#musician-page.vp-anon .vp-split.vp-split-tall{grid-template-columns:minmax(0,1fr) minmax(180px,220px)!important}#musician-page.vp-anon .vp-split.vp-split-tall .vp-video.vp-tall{max-width:220px}}'
    + '@media (max-width:899px){#musician-page.vp-anon .vp-hero{min-height:260px}#musician-page.vp-anon .vp-body{padding-top:28px}}';
  document.head.appendChild(st3);

  var keyHandler = null;

  function load() {
    slug = (root.getAttribute('data-musician') || '').trim().toLowerCase();
    root.innerHTML = '<style>@keyframes wd2Shim{0%{background-position:-400px 0}100%{background-position:400px 0}}.wd2-sk{background:#283232 linear-gradient(90deg,rgba(234,230,221,0) 0,rgba(234,230,221,.07) 50%,rgba(234,230,221,0) 100%) no-repeat;background-size:400px 100%;animation:wd2Shim 1.3s ease-in-out infinite;border-radius:14px}@media (prefers-reduced-motion:reduce){.wd2-sk{animation:none}}</style><div style="background:#1f2727;padding:0 0 40px"><div class="wd2-sk" style="height:min(62vh,560px);border-radius:0"></div><div style="max-width:1100px;margin:0 auto;padding:28px clamp(16px,4vw,48px);display:grid;gap:12px"><div class="wd2-sk" style="height:34px;width:min(320px,70%)"></div><div class="wd2-sk" style="height:14px;width:min(620px,95%)"></div><div class="wd2-sk" style="height:14px;width:min(540px,85%)"></div><div class="wd2-sk" style="height:14px;width:min(460px,75%)"></div></div></div>';
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
    // Musicians with hidden names get no visible heading: the "Available for" line is the first thing under the photo
    h += '<h1' + (m.hideName ? ' class="vp-sr"' : '') + '>' + esc(m.hideName ? 'Live wedding musician' : m.name) + '</h1>';

    h += '<div class="vp-facts">';
    if (m.facts) m.facts.forEach(function (f) { h += '<div class="vp-fact"><span>' + esc(f.label) + '</span><strong>' + esc(f.value) + '</strong></div>'; });
    else {
      h += '<div class="vp-fact">' + '<span>' + (m.hideName ? 'Available for' : 'Plays at') + '</span>' + '<strong>' + esc(events.map(function (e) { return L[e]; }).join(' · ') || 'Ask us') + '</strong></div>';
      if (extras.length) h += '<div class="vp-fact"><span>Also available</span><strong>' + esc(extras.join(' · ')) + '</strong></div>';
    }
    h += '<a class="vp-btn" href="#vp-enquire">Check availability</a></div></div></header>';
    // DJ pages: a row of tabs under the banner to switch between DJ / DJ & Sax / Karaoke
    if (m.related) {
      h += '<nav class="vp-tabs vp-pad" aria-label="' + esc(m.relatedTitle || 'Options') + '">';
      m.related.forEach(function (sl) {
        var o = DATA.musicians.filter(function (x) { return x.slug === sl; })[0]; if (!o) return;
        var here = o.slug === m.slug, pr = ((o.facts || [])[0] || {}).value || '';
        h += '<a class="vp-tab' + (here ? ' vp-tab-on' : '') + '" href="' + esc(o.url) + '"' + (here ? ' aria-current="page"' : '') + '><strong>' + esc(o.name) + '</strong><span>' + esc(pr) + '</span></a>';
      });
      h += '</nav>';
    }

    var allVideos = [];
    function videoTag(x, label) {
      var mm = x.seconds ? Math.floor(x.seconds / 60) + ':' + ('0' + Math.round(x.seconds % 60)).slice(-2) : '';
      allVideos.push(x);
      return '<figure class="vp-video' + (x.shape === 'tall' ? ' vp-tall' : '') + '"><div class="vp-vwrap"><video data-v="' + (allVideos.length - 1) + '" playsinline preload="none" poster="' + (x.poster ? img(x.poster, 1500) : DATA.videoBase + x.id + '/thumbnail') + '" aria-label="Video of ' + esc(label) + '"></video>'
        + '<button type="button" class="vp-play" aria-label="Play video of ' + esc(label) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 4l15 8-15 8z"/></svg></button></div><figcaption>' + esc(x.title || (m.hideName ? 'Live video' : label + ' live')) + (mm ? ' · ' + mm : '') + '</figcaption></figure>';
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
      + events.map(function (e) { return '<button type="button" class="vp-tag vp-pk-tag" data-when="' + esc(e) + '" aria-pressed="false">' + esc(L[e]) + '</button>'; }).join('')
      + '<button type="button" class="vp-tag vp-pk-tag" data-when="other" aria-pressed="false">Other</button></div>'
      + '<div class="vp-pk-next vp-pk-next-when" data-next="pick" hidden><span class="vp-pk-next-t"></span><button type="button" class="vp-btn">Next: choose your music ↓</button></div>';
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

    // Solo musician profiles: offer to add this musician to a package
    var soloPage = !m.builder && !m.packages && !m.related;
    if (soloPage) h += '<section class="vp-choose vp-choose-tight"><button type="button" class="vp-btn vp-add">+ Add to my enquiry and keep browsing</button><p class="vp-add-note" hidden></p></section>';
    if (soloPage) h += '<section class="vp-addpk"><div><h2>Add this musician to a package</h2><p>Want more than 2 hours of music? Pair this musician with a second musician, our trad band or a DJ. We\'ll keep this musician in your enquiry while you choose.</p></div>'
      + '<a class="vp-btn vp-addpk-btn" href="/packages">Add to a package →</a></section>';

    // Build-your-band pages (the trad band): step 1 pick the line-up, step 2 pick the solo performer
    if (m.builder) {
      var b = m.builder;
      h += '<section class="vp-build"><h2>' + esc(b.step1 || 'Choose your line-up') + '</h2><div class="vp-lineups">';
      b.lineups.forEach(function (x) {
        h += '<button type="button" class="vp-lineup" data-lineup="' + esc(x.title) + '" data-needs="' + esc(x.needs || '') + '"><strong>' + esc(x.title) + '</strong><span>' + esc(x.text) + '</span></button>';
      });
      h += '</div></section>';
      var pool = [];
    }

    // Packages page: 1 pick the main act (solo musician, trad band or DJ), 2 add the other two as add-ons; the matching package lights up
    if (m.packages) {
      var P = m.packages, euro = function (n) { return '€' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
      var xImg = function (id) { var x = P.extras.filter(function (e) { return e.id === id; })[0]; return x && x.image; };
      var pill = function (attr, val, label, sub) { return '<button type="button" class="vp-pk-pill" data-' + attr + '="' + esc(val) + '"><strong>' + esc(label) + '</strong>' + (sub ? ' <span>' + esc(sub) + '</span>' : '') + '</button>'; };
      var OPTS = [
        { id: 'solo', title: 'Solo musician', price: 'From ' + euro(P.soloFrom), text: 'One of our hand-picked singer-guitarists.', image: xImg('second'),
          sub: '<h3 class="vp-pk-group">How many musicians?</h3><div class="vp-pk-pills">' + pill('solo', '1', 'One musician', '2 hours') + pill('solo', '2', 'Two, back to back', '4 hours') + '</div>'
            + '<div class="vp-pk-budget"><h3 class="vp-pk-group">Maximum budget for your solo musician</h3>'
            + '<p class="vp-pk-bud-note">This will allow us to give you all the options within this budget.</p>'
            + '<output class="vp-pk-bud-val" for="vp-pk-range">€650</output>'
            + '<input type="range" id="vp-pk-range" class="vp-pk-range" min="650" max="1500" step="50" value="650" aria-label="Maximum budget for your solo musician">'
            + '<div class="vp-pk-bud-scale"><span>€650</span><span>€1,500</span></div>'
            + '<div class="vp-pk-bud-ok"><button type="button" class="vp-btn vp-pk-bud-btn">Confirm budget</button><span class="vp-pk-bud-msg" role="status" aria-live="polite"></span></div></div>' },
        { id: 'trad', title: 'Trad band', price: 'From ' + euro(P.duoFrom), text: 'Our modern trad band as a duo or trio.', image: xImg('trad'),
          sub: '<h3 class="vp-pk-group">Trad band size</h3><div class="vp-pk-pills">' + P.lineups.map(function (x) { return pill('line', x.title, x.title, 'from ' + euro(x.title === 'Trio' ? P.trioFrom : P.duoFrom)); }).join('') + '</div>' },
        { id: 'dj', title: 'DJ', price: 'From ' + euro(P.djFrom), text: 'A DJ set with professional audio and lighting.', image: xImg('dj'),
          sub: '<h3 class="vp-pk-group">Add to the DJ</h3><div class="vp-pk-pills">' + pill('dx', '', 'DJ only', '') + P.djExtras.map(function (x) { return pill('dx', x.title, '+ ' + x.title, '+' + (x.priceFrom ? 'from ' : '') + euro(x.price)); }).join('') + '</div>' }
      ];
      h += '<div class="vp-pk-wbar" aria-hidden="true"><button type="button" class="vp-pk-back" hidden>‹ Back</button><span class="vp-pk-dots"><i></i><i></i><i></i></span><span class="vp-pk-wlabel"></span></div>';
      h += '<section class="vp-build vp-pk-step" data-step="pick"><span class="vp-step">Step 1</span><div class="vp-pk-parts" hidden></div><h2>What would you like?</h2><p class="vp-build-note vp-pk-picknote">Choose your main act. You can add the others next.</p><div class="vp-pk-mains">';
      OPTS.forEach(function (o) {
        h += '<div class="vp-pk-opt" data-o="' + o.id + '"><button type="button" class="vp-lineup vp-has-img vp-pk-card" data-o="' + o.id + '">'
          + (o.image ? '<span class="vp-x-img"><img loading="lazy" src="' + img(o.image, 600) + '" alt=""></span>' : '')
          + '<em class="vp-pk-addtag">Add-on</em><strong>' + esc(o.title) + ' <small class="vp-pk-cprice">' + esc(o.price) + '</small></strong><span>' + esc(o.text) + '</span><span class="vp-tick" aria-hidden="true">✓</span></button>'
          + '<div class="vp-pk-sub" hidden>' + o.sub + '</div></div>';
      });
      h += '<div class="vp-pk-addhead" hidden><strong>Add-ons</strong> <span>Optional. Add one or both.</span></div></div>'
        + '<div class="vp-pk-next" data-next="result" hidden><span class="vp-pk-next-t">Happy with your add-ons?</span><button type="button" class="vp-btn">Next: see your package ↓</button></div></section>';
      h += '<section class="vp-build vp-pk-step" data-step="result" hidden><span class="vp-step">Your package</span><h2>Here\'s what you\'ve built</h2><div class="vp-pk-row">';
      P.list.forEach(function (x) {
        h += '<button type="button" class="vp-pk" data-id="' + esc(x.id) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(x.image, 500) + '" alt="' + esc(x.title) + '"' + (x.imagePosition ? ' style="object-position:' + esc(x.imagePosition) + '"' : '') + '><span class="vp-tick" aria-hidden="true">✓</span></div>'
          + '<strong>' + esc(x.title) + '</strong><em class="vp-pk-meta">' + esc(x.hours) + '</em><span>' + esc(x.text) + '</span><b class="vp-pk-price">From ' + euro(x.from) + '</b></button>';
      });
      h += '</div><div class="vp-pk-total"><span class="vp-pk-tname"></span><strong></strong></div><div class="vp-pk-sum" hidden><h3>What\'s included</h3><ul></ul></div><div class="vp-pk-days" hidden></div><div class="vp-pk-more" hidden></div><div class="vp-pk-cta"><div class="vp-pk-btns"><button type="button" class="vp-btn vp-pk-nextpart" hidden></button><a class="vp-btn vp-pk-go" href="#vp-enquire">Check availability</a><button type="button" class="vp-btn vp-btn-ghost vp-pk-reset">↺ Start again</button></div>'
        + (P.note ? '<p class="vp-pk-foot">' + esc(P.note) + '</p>' : '') + '</div>'
        + '<div class="vp-pk-other"><div><strong>Want something different?</strong><span>Tell us what you have in mind and we\'ll put together something just for you.</span></div><a class="vp-btn vp-btn-ghost" href="/home#enquiremain">Send us a general enquiry →</a></div></section>';
    }
    if (!soloPage && !m.packages) h += '<section class="vp-choose' + (m.related ? ' vp-choose-tight' : '') + '"><button type="button" class="vp-btn vp-add">+ Add to my enquiry and keep browsing</button><p class="vp-add-note" hidden></p></section>';
    if (m.related) h += '<section class="vp-addpk"><div><h2>Add the DJ to a package</h2><p>Want live music too? Start with ' + esc(m.subjectName || m.name) + ' and add a solo musician or our trad band to build a full package.</p></div>'
      + '<a class="vp-btn vp-addpk-btn" href="/packages?dj=' + encodeURIComponent(m.slug) + '">Add to a package →</a></section>';
    // DJ pages: show the other DJ options as cards (DJ / DJ & Sax / Karaoke), with this one marked
    if (m.related) {
      h += '<section><div class="vp-h2row"><h2>' + esc(m.relatedTitle || 'More options') + '</h2></div><div class="vp-similar vp-three vp-rel">';
      m.related.forEach(function (sl) {
        var o = DATA.musicians.filter(function (x) { return x.slug === sl; })[0]; if (!o) return;
        var here = o.slug === m.slug;
        h += '<a class="vp-card' + (here ? ' vp-here' : '') + '" href="' + esc(o.url) + '"' + (here ? ' aria-current="page"' : '') + '><div class="vp-card-img"><img loading="lazy" src="' + img(o.photo, 750) + '" alt="' + esc(o.name) + '"' + (o.cardPosition || o.photoPosition ? ' style="object-position:' + esc(o.cardPosition || o.photoPosition) + '"' : '') + '>' + (here ? '<span class="vp-here-tag">You\'re here</span>' : '') + '</div>'
          + '<h3>' + esc(o.name) + '</h3><p>' + esc(o.cardText || '') + '</p></a>';
      });
      h += '</div></section>';
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
    if (others.length && !m.builder && !m.packages && !m.related) {
      h += '<section><div class="vp-h2row"><h2>Other musicians</h2><a class="vp-btn vp-btn-ghost" href="/musicians">← All musicians</a></div><div class="vp-similar vp-three">';
      others.forEach(function (o) {
        var oe = ORDER.filter(function (e) { return (o.events || []).indexOf(e) !== -1; }).map(function (e) { return L[e]; });
        h += '<a class="vp-card" href="' + esc(o.url) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(o.photo, 750) + '" alt="' + esc(o.name) + '"' + (o.photoPosition ? ' style="object-position:' + esc(o.photoPosition) + '"' : '') + '></div>'
          + (o.hideName ? '' : '<h3>' + esc(o.name) + '</h3>') + '<p>' + esc(oe.join(' · ')) + '</p></a>';
      });
      h += '</div></section>';
    }

    // Explore more: one venue (filled in once venues.json loads) and the DJ options
    var dj = DATA.djCard;
    h += '<section class="vp-explore"' + (m.packages ? ' hidden' : '') + '><h2>Explore more</h2><div class="vp-similar vp-three">';
    h += '<a class="vp-card vp-venue-card" href="/venues" hidden><div class="vp-card-img"><img loading="lazy" alt=""></div><h3></h3><p></p></a>';
    var trad = DATA.tradCard;
    if (trad && trad.url !== m.url) h += '<a class="vp-card" href="' + esc(trad.url) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(trad.image, 750) + '" alt="' + esc(trad.title) + '"></div><h3>' + esc(trad.title) + '</h3><p>' + esc(trad.text) + '</p></a>';
    if (dj && !m.related) h += '<a class="vp-card vp-dj-card" href="' + esc(dj.url) + '"><div class="vp-card-img"><img loading="lazy" src="' + img(dj.image, 750) + '" alt="' + esc(dj.title) + '"></div><h3>' + esc(dj.title) + '</h3><p>' + esc(dj.text) + '</p></a>';
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
      + '<div class="vp-elist" hidden><span class="vp-elist-t">Also in your enquiry</span><ul></ul></div>'
      + '<div class="vp-row"><div class="vp-field"><label for="vp-fname">First name</label><input id="vp-fname" name="First name" autocomplete="given-name" required></div>'
      + '<div class="vp-field"><label for="vp-lname">Last name</label><input id="vp-lname" name="Last name" autocomplete="family-name" required></div></div>'
      + '<div class="vp-field"><label for="vp-email">Email</label><input id="vp-email" name="email" type="email" autocomplete="email" required></div>'
      + '<div class="vp-row"><div class="vp-field"><label for="vp-date">Event date</label><input id="vp-date" name="Event date" type="date" min="' + today + '" required></div>'
      + '<div class="vp-field"><label for="vp-time">Start time</label><input id="vp-time" name="Time" type="time" required></div></div>'
      + (m.packages
        ? '<div class="vp-field"><label for="vp-package">Package</label><input id="vp-package" name="Package" placeholder="Choose above"></div>'
          + '<div class="vp-field vp-pk-linefield" hidden><label for="vp-lineup">Trad line-up</label><select id="vp-lineup" name="Trad line-up">' + opt(m.packages.lineups.map(function (x) { return x.title; })) + '</select></div>'
          + '<div class="vp-field"><label for="vp-addons">Extras</label><input id="vp-addons" name="Extras" placeholder="None"></div>'
          + '<input type="hidden" id="vp-estimate" name="Estimated price"><input type="hidden" id="vp-summary" name="Included"><input type="hidden" id="vp-when" name="Part of the day"><input type="hidden" id="vp-budget" name="Maximum budget for solo musician">'
        : m.builder
        ? '<div class="vp-field"><label for="vp-lineup">Line-up</label><select id="vp-lineup" name="Line-up">' + opt(m.builder.lineups.map(function (x) { return x.title; })) + '</select></div>'

        : m.hideName
        ? '<input type="hidden" id="vp-musician" name="Musician" value="' + esc(m.name) + '">'
        : '<div class="vp-field"><label for="vp-musician">' + esc(m.fieldLabel || 'Musician') + '</label><input id="vp-musician" name="Musician" value="' + esc(m.name) + '"></div>')
      + '<div class="vp-field"><label for="vp-type">Event type</label><select id="vp-type" name="Event type">' + opt(['Wedding Day 2', 'Ceremony', 'Drinks Reception', 'Wedding Day After Dinner', 'Corporate', 'Other']) + '</select></div>'
      + '<div class="vp-field"><label for="vp-venue">Venue <i>(if chosen)</i></label><input id="vp-venue" name="Venue"></div>'
      + '<div class="vp-field"><label for="vp-heard">How did you hear about us?</label><select id="vp-heard" name="How they heard about us">' + opt(['Instagram', 'Google Search', 'Musician referral', 'Venue recommendation', 'Friends or family', 'Other']) + '</select></div>'
      + '<div class="vp-field"><label for="vp-msg">Let us know how we can help <i>(optional)</i></label><textarea id="vp-msg" name="Message" placeholder="Guest numbers, add-ons like trad band, DJ or karaoke, questions"></textarea></div>'
      + '<input type="checkbox" name="botcheck" class="vp-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'
      + '<button class="vp-btn" type="submit">Send enquiry</button>' + '<button type="button" class="vp-btn vp-btn-ghost vp-add"' + (m.packages ? ' hidden' : '') + '>+ Add to my enquiry and keep browsing</button><p class="vp-add-note" hidden></p>' + '<p class="vp-status" role="status" aria-live="polite"></p>'
      + '</form></div></aside>';
    h += '</div>';  // end of body

    h += '<div class="vp-lb" hidden><img alt=""><div class="vp-lb-bar"><button type="button" data-a="prev">Previous</button><span class="vp-count"></span><button type="button" data-a="next">Next</button><button type="button" data-a="close">Close</button></div></div>';

    // The site's photo-link script turns a whole block into a link when it spots a known photo in it.
    // Mark this block as already handled so clicks inside it work normally.
    for (var blk = root; blk && blk !== document.body; blk = blk.parentElement) {
      if (blk.classList && blk.classList.contains('sqs-block')) { blk.wd2Wired = true; break; }
    }
    root.classList.toggle('vp-theme-dj', m.theme === 'dj');
    root.classList.toggle('vp-pk-page', !!m.packages);
    root.classList.toggle('vp-anon', !!m.hideName);  // hidden-name profiles: shorter banner so the bio sits higher
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
      var $ = function (q) { return root.querySelector(q); }, $$ = function (q) { return Array.prototype.slice.call(root.querySelectorAll(q)); };
      var step = function (n) { return $('.vp-pk-step[data-step="' + n + '"]'); };
      var go = function (el) { if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60); };
      var main = '', adds = [], soloN = '1', line = 'Duo', dx = '', when = [], lastSnap = null, lastName = '', budget = 650, budgetOk = false;
      var partIdx = 0, saved = {};  // music for more than one part of the day: one package per part, built in order
      var has = function (id) { return main === id || adds.indexOf(id) !== -1; };
      // Phones: one step per screen (1 choose, 2 options & add-ons, 3 your package), with dots, a back button and swipe
      var mq = window.matchMedia('(max-width:760px)'), ws = 1, wsPart = -1, wbar = $('.vp-pk-wbar');
      var wiz = function () { return mq.matches; };
      var WL = ['', 'Choose your music', 'Options & add-ons', 'Your package'];
      function setWs(n, back) {
        if (n === ws) return;
        ws = n; render();
        var vis = step(n === 3 ? 'result' : 'pick');
        if (vis) { vis.classList.remove('vp-pk-in-r', 'vp-pk-in-l'); void vis.offsetWidth; vis.classList.add(back ? 'vp-pk-in-l' : 'vp-pk-in-r'); }
        if (n === 3) { var pk = $('.vp-pk.vp-picked'); if (pk) setTimeout(function () { var row = $('.vp-pk-row'); row.scrollTo({ left: pk.offsetLeft - row.offsetLeft, behavior: 'smooth' }); }, 250); }
        go(wbar);
      }
      // Solo price depends on the part of the day: ceremony & drinks reception from €650, after dinner and Day 2 from €750
      var pricePart = null;
      var evening = function () { var e = pricePart !== null ? pricePart : (parts()[partIdx] || ''); return e === 'day2' || e === 'afterdinner'; };
      function soloFrom() { return evening() ? P.soloFrom : (P.soloFromCeremony || P.soloFrom); }
      // Trad band: ceremony & drinks reception duo from €1,150 / trio €1,500; after dinner and Day 2 duo €1,350 / trio €1,750
      function duoFrom() { return evening() ? P.duoFrom : (P.duoFromCeremony || P.duoFrom); }
      function trioFrom() { return evening() ? P.trioFrom : (P.trioFromCeremony || P.trioFrom); }
      function match() {
        var solo = has('solo'), trad = has('trad'), dj = has('dj'), two = solo && soloN === '2';
        var base = solo && trad && dj ? 'full-experience' : solo && trad ? 'party' : solo && dj && !two ? 'celebration' : solo && two && !dj ? 'double-trouble' : '';
        var pk = P.list.filter(function (x) { return x.id === base; })[0];
        var tradPrice = line === 'Trio' ? trioFrom() : duoFrom();
        var price = 0, name = '', extra = [];
        if (pk) {
          price = pk.from; name = pk.title;
          if (two && trad) { price += soloFrom(); extra.push(dj ? 'Double Trouble' : 'second solo musician'); }  // trad packages only include one musician
        } else if (solo && two && dj) { price = 2 * soloFrom() + P.djFrom; name = 'Two solo musicians + DJ'; }
        else if (solo) { price = soloFrom(); name = 'Solo musician'; }
        else if (trad) { price = tradPrice; name = 'Trad band (' + line + ')'; if (dj) { price += P.djFrom; extra.push('DJ'); } }
        else if (dj) { price = P.djFrom; name = 'DJ'; }
        var d = P.djExtras.filter(function (x) { return x.title === dx; })[0];
        if (d && dj) { price += d.price; extra.push(d.title); }
        var hours = (solo ? (two ? 4 : 2) : 0) + (trad ? 2 : 0) + (dj ? 2 : 0);  // each act plays about 2 hours
        return { pk: pk, price: price, hours: hours, name: name + (extra.length ? ' + ' + extra.join(' + ') : '') };
      }
      // Parts of the day in the order they happen, so couples build the drinks reception music first, then after dinner, then Day 2
      var PART_ORDER = ['ceremony', 'afterdinner', 'day2'];
      var PICKS = events.concat(['other']);  // the three times of day, plus "Other" (an event that isn't one of them)
      if (!L.other) L.other = 'Other';
      var parts = function () { return PART_ORDER.concat(['other']).filter(function (e) { return when.indexOf(e) !== -1 && PICKS.indexOf(e) !== -1; }); };
      var snapPart = function () { return { main: main, adds: adds.slice(), soloN: soloN, line: line, dx: dx, budget: budget, budgetOk: budgetOk }; };
      var loadPart = function (st) { st = st || {}; main = st.main || ''; adds = (st.adds || []).slice(); soloN = st.soloN || '1'; line = st.line || 'Duo'; dx = st.dx || ''; budget = st.budget || 650; budgetOk = !!st.budgetOk; };
      var partName = function (e) { return e === 'day2' ? 'Day 2' : e === 'afterdinner' ? 'after dinner' : e === 'other' ? 'your event' : 'ceremony & drinks reception'; };
      // What the current choices add up to (used for the part being built and for parts already built)
      function describe() {
        var solo = has('solo'), trad = has('trad'), dj = has('dj'), d = dj ? dx : '', r = match(), it = [];
        if (solo) it.push(soloN === '2' ? 'Two solo musicians, back to back (4 hours)' : 'Solo musician (2 hours)');
        if (trad) it.push('Trad band ' + line.toLowerCase() + (solo ? (soloN === '2' ? ', after your solo musicians' : ', after your solo musician') : ''));
        if (dj) it.push('DJ set' + (d ? (d === 'Saxophone' ? ' with live saxophone' : ' with karaoke') : ''));
        if (solo && budgetOk) it.push((soloN === '2' ? 'Maximum budget for each solo musician: ' : 'Maximum budget for solo musician: ') + euro(budget));
        return { r: r, items: it, started: !!main, line: trad ? line : '', dx: d, budget: solo && budgetOk ? euro(budget) + (soloN === '2' ? ' each' : '') : '' };
      }
      function describePart(st, e) { var keep = snapPart(); pricePart = e || null; loadPart(st); var d = describe(); loadPart(keep); pricePart = null; return d; }
      function render() {
        var started = !!main, solo = has('solo'), trad = has('trad'), dj = has('dj');
        var PP = parts(); if (partIdx > PP.length - 1) partIdx = Math.max(0, PP.length - 1);
        var multi = PP.length > 1, curPart = multi ? PP[partIdx] : '';
        var nextPart = multi ? PP.filter(function (e, i) { return i !== partIdx && !(saved[e] && saved[e].main); })[0] || '' : '';
        if (!dj) dx = '';
        if (partIdx !== wsPart) { if (wsPart !== -1) ws = main ? 2 : 1; wsPart = partIdx; }  // a new part of the day starts at its first step
        if (!started) ws = 1; else if (ws === 1 && !wiz()) ws = 2;
        root.classList.toggle('vp-pk-wz', wiz());
        root.setAttribute('data-ws', String(ws));
        if (wbar) {
          wbar.querySelector('.vp-pk-back').hidden = ws === 1;
          Array.prototype.forEach.call(wbar.querySelectorAll('.vp-pk-dots i'), function (d, k) { d.classList.toggle('vp-on', k < ws); });
          wbar.querySelector('.vp-pk-wlabel').textContent = 'Step ' + ws + ' of 3 · ' + WL[ws];
        }
        // one grid: the main act first, then the other two as add-ons (the last one spans the full width on desktop)
        var mains = $('.vp-pk-mains'), others = ['solo', 'trad', 'dj'].filter(function (x) { return x !== main; });
        $$('.vp-pk-opt').forEach(function (o) {
          var id = o.getAttribute('data-o'), on = has(id);
          o.style.order = !main ? ['solo', 'trad', 'dj'].indexOf(id) + 1 : id === main ? 1 : others.indexOf(id) + 3;
          o.classList.toggle('vp-pk-ismain', !!main && id === main);
          o.classList.toggle('vp-pk-isadd', !!main && id !== main);
          o.classList.toggle('vp-pk-wide', !!main && id === others[1]);
          o.classList.toggle('vp-on', on);
          o.querySelector('.vp-pk-card').classList.toggle('vp-picked', on);
          o.querySelector('.vp-pk-sub').hidden = !on;
        });
        mains.classList.toggle('vp-pk-started', !!main);
        $('.vp-pk-addhead').hidden = !main;
        $('.vp-pk-next[data-next="result"]').hidden = !main;
        $('.vp-pk-picknote').textContent = main ? 'Choose the options for your main act (tap it again to change), then add either of the others.' : 'Choose your main act. You can add the others next.';
        step('result').hidden = !started;
        var pb = $('.vp-pk-parts');
        pb.hidden = !multi;
        if (multi) {
          pb.innerHTML = '<span class="vp-pk-parts-t">Your music, part ' + (partIdx + 1) + ' of ' + PP.length + '</span><div class="vp-pk-parts-row">'
            + PP.map(function (e, i) {
              var done = i === partIdx ? !!main : !!(saved[e] && saved[e].main);
              return '<button type="button" class="vp-pk-part' + (i === partIdx ? ' vp-on' : '') + (done ? ' vp-done' : '') + '" data-i="' + i + '"' + (i === partIdx ? ' aria-current="step"' : '') + '>' + (done ? '✓ ' : '') + esc(L[e]) + '</button>';
            }).join('') + '</div>';
          Array.prototype.forEach.call(pb.querySelectorAll('.vp-pk-part'), function (b) { b.addEventListener('click', function () {
            var i = +b.getAttribute('data-i'); if (i === partIdx) return;
            saved[curPart] = snapPart(); partIdx = i; loadPart(saved[PP[i]]); render(); go(step('pick'));
          }); });
        }
        $('.vp-pk-step[data-step="pick"] h2').textContent = multi ? 'What would you like for ' + partName(curPart) + '?' : 'What would you like?';
        $('.vp-pk-step[data-step="result"] h2').textContent = multi ? 'Your ' + partName(curPart) + ' music' : 'Here\'s what you\'ve built';
        if (wiz()) {
          if (ws === 2) $('.vp-pk-step[data-step="pick"] h2').textContent = multi ? 'Options for ' + partName(curPart) : 'Your options';
          $('.vp-pk-picknote').textContent = ws === 2 ? 'Set up your main act, then add the others if you like.' : 'Tap your main act to start.';
        }
        var npb = $('.vp-pk-nextpart');
        npb.hidden = !(started && nextPart);
        if (nextPart) npb.textContent = 'Next: build your ' + partName(nextPart) + ' music →';
        $('.vp-pk-go').hidden = !!(started && nextPart);
        var more = $('.vp-pk-more'), left = when.indexOf('other') !== -1 ? [] : PART_ORDER.filter(function (e) { return events.indexOf(e) !== -1 && when.indexOf(e) === -1; });
        more.hidden = !(started && PP.length && left.length);
        if (!more.hidden) {
          more.innerHTML = '<h3>Would you like music for ' + left.map(partName).join(' or ') + ' as well?</h3><p>Build it next and we\'ll send everything in one enquiry.</p><div class="vp-pk-more-btns">'
            + left.map(function (e) { return '<button type="button" class="vp-btn vp-btn-ghost" data-more="' + e + '">+ Add ' + esc(partName(e)) + ' music</button>'; }).join('') + '</div>';
          Array.prototype.forEach.call(more.querySelectorAll('[data-more]'), function (b) { b.addEventListener('click', function () {
            var e = b.getAttribute('data-more'), cur = parts()[partIdx];
            if (cur) saved[cur] = snapPart();
            if (when.indexOf(e) === -1) when.push(e);
            partIdx = parts().indexOf(e); loadPart(saved[e]); render(); go(step('pick'));
          }); });
        }
        $$('.vp-pk-pill[data-solo]').forEach(function (b) { b.classList.toggle('vp-picked', b.getAttribute('data-solo') === soloN); });
        $$('.vp-pk-pill[data-line]').forEach(function (b) { b.classList.toggle('vp-picked', b.getAttribute('data-line') === line); });
        $$('.vp-pk-pill[data-dx]').forEach(function (b) { b.classList.toggle('vp-picked', b.getAttribute('data-dx') === dx); });
        $$('.vp-pk-tag').forEach(function (b) { var on = when.indexOf(b.getAttribute('data-when')) !== -1; b.classList.toggle('vp-picked', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        var wt = $('.vp-when-tags'); if (wt) wt.classList.toggle('vp-none', !when.length);
        var wn = $('.vp-pk-next-when');
        if (wn) { wn.hidden = !(when.length && !main); wn.querySelector('.vp-pk-next-t').textContent = 'Music for: ' + PICKS.filter(function (e) { return when.indexOf(e) !== -1; }).map(function (e) { return L[e]; }).join(', '); }
        var ex = root.querySelector('.vp-explore'); if (ex) ex.hidden = !started;
        // phones: the form appears once they've chosen something (desktop always shows it)
        var asideEl = root.querySelector('.vp-aside');
        if (asideEl) { var off = window.matchMedia('(max-width:1000px)').matches && !started && !window.wd2FormShown; if (asideEl.classList.contains('vp-aside-off') && !off) { asideEl.classList.add('vp-aside-in'); setTimeout(function () { asideEl.classList.remove('vp-aside-in'); }, 700); } asideEl.classList.toggle('vp-aside-off', off); }
        // result
        var scp = $('.vp-pk-card[data-o="solo"] .vp-pk-cprice'); if (scp) scp.textContent = 'From ' + euro(soloFrom());
        var tcp = $('.vp-pk-card[data-o="trad"] .vp-pk-cprice'); if (tcp) tcp.textContent = 'From ' + euro(duoFrom());
        $$('.vp-pk-pill[data-line]').forEach(function (b) { var sp = b.querySelector('span'); if (sp) sp.textContent = 'from ' + euro(b.getAttribute('data-line') === 'Trio' ? trioFrom() : duoFrom()); });
        var r = match();
        $$('.vp-pk').forEach(function (b) { b.classList.toggle('vp-picked', !!r.pk && b.getAttribute('data-id') === r.pk.id); });
        $('.vp-pk-row').classList.toggle('vp-has-pick', !!r.pk);
        $('.vp-pk-tname').innerHTML = started ? esc(r.name) + '<em class="vp-pk-hours' + (r.hours >= 8 ? ' vp-pk-big' : '') + '">' + r.hours + ' hours of music</em>' : '';
        $('.vp-pk-total strong').textContent = started ? 'From ' + euro(r.price) : '';
        var nbtn = $('.vp-pk-next[data-next="result"] button'); if (nbtn) nbtn.textContent = wiz() ? 'See your package →' : 'Next: see your package ↓';
        var nb = $('.vp-pk-next[data-next="result"] .vp-pk-next-t'); if (nb) nb.innerHTML = started ? '<b>' + r.hours + ' hours of music</b> · From ' + euro(r.price) : 'Happy with your add-ons?';
        var dNow = describe(), items = dNow.items.filter(function (t) { return t.indexOf('Maximum budget') !== 0; });
        if (started) items.push(r.hours + ' hours of music in total');
        if (started) items.push('Professional audio and lighting');
        var wl = PICKS.filter(function (e) { return when.indexOf(e) !== -1; }).map(function (e) { return L[e]; });
        if (wl.length) items.push('For: ' + (multi ? L[curPart] : wl.join(', ')));
        dNow.items.filter(function (t) { return t.indexOf('Maximum budget') === 0; }).forEach(function (t) { items.push(t); });
        // the whole day, part by part
        var day = !multi ? [] : PP.map(function (e) { return { e: e, d: e === curPart ? dNow : (saved[e] ? describePart(saved[e], e) : null) }; }).filter(function (x) { return x.d && x.d.started; });
        var dayTotal = day.reduce(function (t, x) { return t + x.d.r.price; }, 0);
        var sum = $('.vp-pk-sum'); sum.hidden = !started || multi;
        // Several parts of the weekend: one card per part, side by side, with a grand total underneath
        var daysBox = $('.vp-pk-days');
        daysBox.hidden = !(started && multi);
        if (multi) $('.vp-pk-tname').innerHTML = started ? '<span class="vp-pk-tpart">' + esc(L[curPart]) + '</span>' + esc(r.name) + '<em class="vp-pk-hours">' + r.hours + ' hours of music</em>' : '';
        if (started && multi) {
          var totHours = 0;
          daysBox.innerHTML = '<h3>Your music, part by part</h3><div class="vp-pk-days-grid">' + PP.map(function (e, i) {
            var d = e === curPart ? dNow : (saved[e] && saved[e].main ? describePart(saved[e], e) : null), here = e === curPart;
            if (!d) return '<button type="button" class="vp-pk-day vp-pk-day-empty" data-i="' + i + '"><span class="vp-pk-day-t">' + esc(L[e]) + '</span><strong>Not chosen yet</strong><span class="vp-pk-day-go">Choose music →</span></button>';
            totHours += d.r.hours;
            return '<button type="button" class="vp-pk-day' + (here ? ' vp-on' : '') + '" data-i="' + i + '"' + (here ? ' aria-current="true"' : '') + '><span class="vp-pk-day-t">' + esc(L[e]) + (here ? ' <em>Editing</em>' : '') + '</span>'
              + '<strong>' + esc(d.r.name) + '</strong><ul>' + d.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'
              + '<span class="vp-pk-day-h">' + d.r.hours + ' hours of music</span><span class="vp-pk-day-p">From ' + euro(d.r.price) + '</span>' + (here ? '' : '<span class="vp-pk-day-go">Change →</span>') + '</button>';
          }).join('') + '</div>'
            + '<div class="vp-pk-grand"><div><span>Estimated total</span><small>' + totHours + ' hours of music · Professional audio and lighting included</small></div><strong>From ' + euro(dayTotal) + '</strong></div>';
          Array.prototype.forEach.call(daysBox.querySelectorAll('.vp-pk-day'), function (b) { b.addEventListener('click', function () {
            var i = +b.getAttribute('data-i'); if (i === partIdx) return;
            saved[curPart] = snapPart(); partIdx = i; loadPart(saved[PP[i]]); render(); go(step('pick'));
          }); });
        }
        if (started && r.name !== lastName) { sum.classList.remove('vp-rise'); void sum.offsetWidth; sum.classList.add('vp-rise'); }
        lastName = started ? r.name : '';
        sum.querySelector('ul').innerHTML = items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
        // fill the form
        $('#vp-summary').value = started ? items.join('; ') : '';
        $('#vp-package').value = started ? r.name : '';
        $('.vp-pk-linefield').hidden = !trad; $('#vp-lineup').value = trad ? line : '';
        $('#vp-addons').value = dx;
        $('#vp-estimate').value = started ? 'From ' + euro(r.price) : '';
        $('#vp-when').value = wl.join(', ');
        $('#vp-budget').value = solo && budgetOk ? euro(budget) + (soloN === '2' ? ' each (two musicians)' : '') : '';
        if (day.length) {
          $('#vp-package').value = day.map(function (x) { return L[x.e] + ': ' + x.d.r.name; }).join(' | ');
          $('#vp-estimate').value = 'From ' + euro(dayTotal);
          $('#vp-summary').value = day.map(function (x) { return L[x.e] + ': ' + x.d.items.concat([x.d.r.hours + ' hours of music']).join(', '); }).join('; ') + '; Professional audio and lighting';
          var dl = day.filter(function (x) { return x.d.line; });
          $('.vp-pk-linefield').hidden = !dl.length; $('#vp-lineup').value = dl.length ? dl[0].d.line : '';
          $('#vp-addons').value = day.filter(function (x) { return x.d.dx; }).map(function (x) { return L[x.e] + ': ' + x.d.dx; }).join(', ');
          $('#vp-budget').value = day.filter(function (x) { return x.d.budget; }).map(function (x) { return L[x.e] + ': ' + x.d.budget; }).join(', ');
        }
        var budH = $('.vp-pk-budget h3'), budT = soloN === '2' ? 'Maximum budget for each solo musician' : 'Maximum budget for your solo musician';
        if (budH && budH.textContent !== budT) { budH.textContent = budT; $('#vp-pk-range').setAttribute('aria-label', budT); }
        $('.vp-pk-bud-val').textContent = euro(budget); $('#vp-pk-range').value = budget;
        $('#vp-pk-range').style.setProperty('--vp-fill', ((budget - 650) / 8.5) + '%');
        var bb = $('.vp-pk-bud-btn'), bm = $('.vp-pk-bud-msg');
        if (bb) { bb.textContent = budgetOk ? '✓ Budget confirmed' : 'Confirm ' + euro(budget) + (soloN === '2' ? ' each' : ''); bb.classList.toggle('vp-ok', budgetOk); }
        if (bm && budgetOk) { bm.textContent = ''; bm.classList.remove('vp-err'); }
        var et = $('#vp-type'), map = { ceremony: 'Ceremony', day2: 'Wedding Day 2', afterdinner: 'Wedding Day After Dinner', other: 'Other' };
        if (et) {
          var picks = PICKS.filter(function (e) { return when.indexOf(e) !== -1; });
          var old = et.querySelector('option.vp-combo'); if (old) old.parentNode.removeChild(old);
          if (picks.length === 1) et.value = map[picks[0]];
          else if (picks.length > 1) { var o = document.createElement('option'); o.className = 'vp-combo'; o.value = o.textContent = picks.map(function (e) { return map[e] === 'Ceremony' ? 'Ceremony & Drinks Reception' : map[e]; }).join(' + '); et.appendChild(o); et.value = o.value; }
          else et.value = '';
        }
        // pulse the form whenever a choice changes what's filled in
        var F = ['#vp-package', '#vp-lineup', '#vp-addons', '#vp-type'], names = ['Package', 'Trad line-up', 'Extras', 'Event'];
        var snap = F.map(function (q) { var f = $(q); return f ? f.value : ''; }).join('|');
        if (lastSnap !== null && snap !== lastSnap) {
          var was = lastSnap.split('|'), now = snap.split('|'), msg = '';
          F.forEach(function (q, k) { var f = $(q); if (!f || now[k] === was[k]) return; f.classList.remove('vp-flashfield'); void f.offsetWidth; f.classList.add('vp-flashfield'); if (!msg) msg = now[k] ? names[k] + ': ' + now[k] : names[k] + ' removed'; });
          pulseForm(msg);
        }
        lastSnap = snap;
        if (window.wd2RenderList) window.wd2RenderList();
      }
      // main act / add-on cards
      $$('.vp-pk-card').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.getAttribute('data-o');
        if (wiz() && ws === 1) { if (id !== main) { adds = adds.filter(function (x) { return x !== id; }); main = id; } setWs(2); return; }
        if (!main) { main = id; render(); go(b.parentNode); return; }
        if (id === main) { main = adds.shift() || ''; render(); if (!main && wiz()) go(wbar); return; }  // tap the main act again to remove it; the first add-on (if any) becomes the main act
        var i = adds.indexOf(id); if (i === -1) adds.push(id); else adds.splice(i, 1);
        render();
      }); });
      $$('.vp-pk-pill').forEach(function (b) { b.addEventListener('click', function () {
        if (b.hasAttribute('data-solo')) soloN = b.getAttribute('data-solo');
        if (b.hasAttribute('data-line')) line = b.getAttribute('data-line');
        if (b.hasAttribute('data-dx')) dx = b.getAttribute('data-dx');
        render();
      }); });
      $$('.vp-pk-tag').forEach(function (b) { b.addEventListener('click', function () {
        var w = b.getAttribute('data-when'), i = when.indexOf(w), before = parts()[partIdx];
        if (before) saved[before] = snapPart();
        if (i !== -1) { when.splice(i, 1); delete saved[w]; }       // tap again to remove that part
        else if (when.length <= 1 || w === 'other' || when.indexOf('other') !== -1) {   // one at a time ("Other" is always on its own): swap, keeping the current choices
          saved = {}; when = [w]; before = w;
        } else when.push(w);                                       // already building several parts of the day: add this one too
        // stay on the same part of the day if it's still picked; otherwise go back to the first part
        var now = parts(), k = now.indexOf(before); partIdx = k === -1 ? 0 : k;
        if (now.length > 1 && now[partIdx] !== before) loadPart(saved[now[partIdx]]);
        render();
      }); });
      $('.vp-pk-nextpart').addEventListener('click', function () {
        var PP = parts(), nx = PP.filter(function (e, i) { return i !== partIdx && !(saved[e] && saved[e].main); })[0]; if (!nx) return;
        saved[PP[partIdx]] = snapPart(); partIdx = PP.indexOf(nx); loadPart(saved[nx]); render(); go(step('pick'));
      });
      $$('.vp-pk-next').forEach(function (n) { var b = n.querySelector('button'); if (b) b.addEventListener('click', function () {
        if (wiz() && n.getAttribute('data-next') === 'result') { setWs(3); return; }
        go(step(n.getAttribute('data-next')));
      }); });
      wbar.querySelector('.vp-pk-back').addEventListener('click', function () { if (ws > 1) setWs(ws - 1, true); });
      // swipe left / right between steps on phones
      var sx = 0, sy = 0, sOk = false;
      [step('pick'), step('result')].forEach(function (sec) {
        sec.addEventListener('touchstart', function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; sOk = wiz() && !(e.target.closest && e.target.closest('.vp-pk-row, .vp-pk-range, .vp-pk-parts, input, select, textarea')); }, { passive: true });
        sec.addEventListener('touchend', function (e) {
          if (!sOk) return; sOk = false;
          var t = e.changedTouches[0], dx2 = t.clientX - sx, dy = t.clientY - sy;
          if (Math.abs(dx2) < 70 || Math.abs(dx2) < Math.abs(dy) * 1.5) return;
          if (dx2 < 0 && ws < 3 && main) setWs(ws + 1);
          else if (dx2 > 0 && ws > 1) setWs(ws - 1, true);
        }, { passive: true });
      });
      var mqc = function () { render(); }; if (mq.addEventListener) mq.addEventListener('change', mqc); else if (mq.addListener) mq.addListener(mqc);
      // tapping a package card picks the matching combination
      var PK = { 'double-trouble': ['solo', [], '2'], celebration: ['solo', ['dj'], '1'], party: ['solo', ['trad'], '1'], 'full-experience': ['solo', ['trad', 'dj'], '1'] };
      $$('.vp-pk').forEach(function (b) { b.addEventListener('click', function () { var c = PK[b.getAttribute('data-id')]; if (!c) return; main = c[0]; adds = c[1].slice(); soloN = c[2]; render(); }); });
      $('#vp-pk-range').addEventListener('input', function () { budget = +this.value || 650; budgetOk = false; render(); });
      $('.vp-pk-bud-btn').addEventListener('click', function () { budgetOk = true; render(); });
      // Before sending: every part with a solo musician needs a confirmed budget
      window.wd2PkCheck = function () {
        var PP = parts(), cur = PP[partIdx] || '', bad = '';
        if (has('solo') && !budgetOk) bad = cur || 'here';
        else PP.forEach(function (e) { var st = saved[e]; if (!bad && e !== cur && st && st.main && (st.main === 'solo' || (st.adds || []).indexOf('solo') !== -1) && !st.budgetOk) bad = e; });
        if (!bad) return true;
        if (bad !== 'here' && bad !== cur) { saved[cur] = snapPart(); partIdx = PP.indexOf(bad); loadPart(saved[bad]); render(); }
        var bx = $('.vp-pk-budget'), msg = $('.vp-pk-bud-msg');
        if (msg) { msg.textContent = 'Please confirm your budget for your solo musician' + (PP.length > 1 ? ' (' + partName(bad === 'here' ? cur : bad) + ')' : '') + '.'; msg.classList.add('vp-err'); }
        if (bx) { bx.scrollIntoView({ behavior: 'smooth', block: 'center' }); bx.classList.remove('vp-flashfield'); void bx.offsetWidth; bx.classList.add('vp-flashfield'); }
        return false;
      };
      $('.vp-pk-reset').addEventListener('click', function () { main = ''; adds = []; soloN = '1'; line = 'Duo'; dx = ''; when = []; budget = 650; budgetOk = false; partIdx = 0; saved = {}; ws = 1; render(); go(wiz() ? wbar : step('pick')); });
      $('.vp-pk-go').addEventListener('click', function (e) { e.preventDefault(); if (!window.wd2PkCheck()) return; window.wd2OpenForm && window.wd2OpenForm(); });
      var want = (location.search.match(/[?&]package=([^&]+)/) || [])[1], wc = want && PK[decodeURIComponent(want)];
      if (wc) { main = wc[0]; adds = wc[1].slice(); soloN = wc[2]; ws = 3; }
      var djSlug = decodeURIComponent((location.search.match(/[?&]dj=([^&]+)/) || [])[1] || '');
      if (djSlug && /^(djs|saxdj|karaoke)$/.test(djSlug)) {
        if (!main) main = 'dj'; else if (adds.indexOf('dj') === -1 && main !== 'dj') adds.push('dj');
        dx = djSlug === 'saxdj' ? 'Saxophone' : djSlug === 'karaoke' ? 'Karaoke' : '';
        var djNote = document.createElement('p'), djS = step('pick');
        djNote.className = 'vp-pk-with';
        djNote.innerHTML = '<strong>' + (djSlug === 'saxdj' ? 'DJ &amp; Sax' : djSlug === 'karaoke' ? 'DJ &amp; Karaoke' : 'The DJ') + '</strong> is in your package. Now add a solo musician or the trad band.';
        djS.insertBefore(djNote, djS.querySelector('h2'));
      }
      var withSlug = (location.search.match(/[?&]with=([^&]+)/) || [])[1], withM = null;
      if (withSlug) DATA.musicians.forEach(function (x) { if (x.slug === decodeURIComponent(withSlug) && !x.packages && !x.builder && !x.related) withM = x; });
      if (withM) {
        if (!main) main = 'solo';
        var s1 = step('pick'), note = document.createElement('p');
        note.className = 'vp-pk-with';
        note.innerHTML = '<strong>' + (withM.hideName ? 'Your musician preference' : esc(withM.name)) + '</strong> is in your enquiry. Now choose what to add: a second musician, the trad band or a DJ.';
        s1.insertBefore(note, s1.querySelector('h2'));
      }
      // Start the package with whatever is already in their enquiry (musicians, trad band, DJ), unless they arrived with a set package
      if (!wc) (function () {
        var el = []; try { el = JSON.parse(localStorage.getItem('wd2EnquiryList') || '[]') || []; } catch (e) {}
        var DJ = /^m:(djs|saxdj|karaoke)$/;
        var mus = el.filter(function (x) { return /^m:/.test(x.key || '') && !DJ.test(x.key); });
        var tr = el.filter(function (x) { return x.key === 'trad'; })[0];
        var djs = el.filter(function (x) { return DJ.test(x.key || ''); });
        var added = [];
        var take = function (id) { if (!main) { main = id; added.push(id); } else if (main !== id && adds.indexOf(id) === -1) { adds.push(id); added.push(id); } };
        if (mus.length) { if (!has('solo')) soloN = mus.length > 1 ? '2' : '1'; else if (mus.length > 1) soloN = '2'; take('solo'); }
        if (tr) { take('trad'); line = /Trio/.test(tr.label || '') ? 'Trio' : 'Duo'; }
        if (djs.length) { take('dj'); if (!dx) { var k = djs[djs.length - 1].key; dx = k === 'm:saxdj' ? 'Saxophone' : k === 'm:karaoke' ? 'Karaoke' : ''; } }
        if (!added.length || withM || djSlug) return;  // those pages already show their own note
        var s2 = step('pick'), n2 = document.createElement('p');
        n2.className = 'vp-pk-with';
        n2.innerHTML = '<strong>We\'ve started your package</strong> with what\'s already in your enquiry. Change anything you like below.';
        s2.insertBefore(n2, s2.querySelector('h2'));
      })();
      render();
    })();
    // Build-your-band: picking a line-up or performer highlights it and fills in the form
    if (m.builder) {
      var pickIn = function (sel, attr, field) {
        root.querySelectorAll(sel).forEach(function (btn) {
          btn.addEventListener('click', function () {
            root.querySelectorAll(sel).forEach(function (x) { x.classList.remove('vp-picked'); x.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('vp-picked'); btn.setAttribute('aria-pressed', 'true');
            var f = root.querySelector(field); if (f) { f.value = btn.getAttribute(attr); f.classList.remove('vp-flashfield'); void f.offsetWidth; f.classList.add('vp-flashfield'); pulseForm('Added to your form: ' + btn.getAttribute(attr)); }
          });
        });
      };
      pickIn('.vp-lineup', 'data-lineup', '#vp-lineup');
      root.querySelectorAll('.vp-lineup').forEach(function (b) { b.addEventListener('click', function () { if (window.wd2RenderList) window.wd2RenderList(); }); });
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
      if (lineSel) lineSel.addEventListener('change', function () { if (window.wd2RenderList) setTimeout(window.wd2RenderList, 0); });
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
      // skip venues this visitor has already looked at, unless they've seen them all
      var seenV = [];
      try { seenV = JSON.parse(localStorage.getItem('wd2SeenVenues') || '[]'); } catch (e) {}
      var fresh = vs.filter(function (x) { return seenV.indexOf(x.slug) === -1; });
      if (fresh.length) vs = fresh;
      var v = vs[Math.floor(Math.random() * vs.length)], card = root.querySelector('.vp-venue-card');
      if (!card) return;
      card.href = v.url;
      var vp = v.cardImg || v.heroImg; card.querySelector('img').src = /^https?:/.test(vp) ? vp : vd.imageBase + vp + '?format=750w';
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
    // Desktop: the form stays pinned near the top and fits the screen; if it's taller than the screen it scrolls inside itself, so nothing gets cut off
    function fitSticky() { if (mobileQ.matches) return; root.style.setProperty('--vp-sticky-top', '24px'); }

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
      // stop the page behind from scrolling while the form is open on a phone
      document.documentElement.classList.toggle('vp-lock', open && mobileQ.matches);
      sheetBar.setAttribute('aria-expanded', open ? 'true' : 'false');
      sheetBar.setAttribute('aria-label', open ? 'Close the enquiry form' : openLabel);
    }
    sheetBar.addEventListener('click', function () { setSheet(!aside.classList.contains('vp-open')); });
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
    // Open the enquiry form and make it obvious: on phones the sheet slides up; on desktop it scrolls into view, glows and the first box is ready to type in
    window.wd2OpenForm = function () {
      window.wd2FormShown = true; aside.classList.remove('vp-aside-off');
      var form = root.querySelector('.vp-form'), first = root.querySelector('#vp-fname');
      if (mobileQ.matches) setSheet(true);
      else {
        // pin the top of the form in view so the first boxes show; it goes back to normal once they move further down the form
        root.style.setProperty('--vp-sticky-top', '24px'); window.__vpPinned = true;
        var top = form.getBoundingClientRect().top; if (top < 0 || top > window.innerHeight * 0.4) window.scrollBy({ top: top - 24, behavior: 'smooth' });
        var undo = function (ev) {
          var r = ev.target.getBoundingClientRect();
          if (r.bottom > window.innerHeight - 20) { window.__vpPinned = false; form.removeEventListener('focusin', undo); if (window.__mpFit) window.__mpFit(); setTimeout(function () { ev.target.scrollIntoView({ block: 'nearest' }); }, 50); }
        };
        form.addEventListener('focusin', undo);
        // as soon as they scroll the page themselves, go back to normal so the bottom of the form (Send) can be reached
        setTimeout(function () {
          var back = function () { window.__vpPinned = false; window.removeEventListener('scroll', back); form.removeEventListener('focusin', undo); if (window.__mpFit) window.__mpFit(); };
          window.addEventListener('scroll', back, { passive: true });
        }, 900);
      }
      form.classList.remove('vp-flash'); void form.offsetWidth; form.classList.add('vp-flash');
      // on phones don't pop the keyboard up straight away (it shoves the form around); they tap a box when ready
      if (!mobileQ.matches) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (x) { first.focus(); } }, 500);
    };
    root.querySelector('.vp-facts .vp-btn').addEventListener('click', function (e) { e.preventDefault();
      if (m.packages && root.querySelector('.vp-aside.vp-aside-off')) { var s1 = root.querySelector('.vp-pk-step[data-step="pick"]'); if (s1) s1.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      window.wd2OpenForm(); return; if (mobileQ.matches) { e.preventDefault(); setSheet(true); } });
    fitSticky();
    if (/[?&]enquire=1/.test(location.search)) setTimeout(function () { window.wd2OpenForm(); }, 700);
    // re-fit whenever the form changes height (enquiry list, notes, messages), so the bottom never gets cut off
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (!window.__vpPinned) fitSticky(); }).observe(aside);
    if (!window.__mpFitBound) { window.__mpFitBound = true; window.addEventListener('resize', function () { if (window.__mpFit) window.__mpFit(); }); }
    window.__mpFit = fitSticky;

    // Enquiry form
    // Visitors arriving from an Instagram link get "How did you hear about us?" filled in for them
    (function () {
      var src = (location.search.match(/[?&]utm_source=([^&]+)/) || [])[1] || '';
      var heard = root.querySelector('#vp-heard');
      if (heard && /instagram|^ig$/i.test(decodeURIComponent(src)) && !heard.value) heard.value = 'Instagram';
    })();
    // Remember the couple's details on this device, so the form is already filled in on the next musician or venue page
    (function () {
      var KEY = 'wd2EnquiryDetails', ids = ['vp-fname', 'vp-lname', 'vp-email', 'vp-date', 'vp-time', 'vp-heard', 'vp-msg', 'vp-venue'], saved = {};
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
    var ELIST = 'wd2EnquiryList';
    var getList = function () { try { return JSON.parse(localStorage.getItem(ELIST) || '[]') || []; } catch (e) { return []; } };
    var setList = function (l) { try { localStorage.setItem(ELIST, JSON.stringify(l)); } catch (e) {} if (window.wd2FloatRefresh) window.wd2FloatRefresh(); };
    var curItem = function () {
      var v = function (q) { var f = root.querySelector(q); return f ? f.value.trim() : ''; };
      if (m.packages) {
        var pk = v('#vp-package'); if (!pk) return null;
        var who = v('#vp-musician');
        return { key: 'pkg', label: 'Package: ' + pk + (who ? ' (musicians: ' + who + ')' : '') + (v('#vp-summary') ? '. Includes: ' + v('#vp-summary') : ''), url: location.pathname };
      }
      if (m.builder) {
        var ln = v('#vp-lineup'), pf = v('#vp-musician');
        return { key: 'trad', label: 'Modern Trad Band' + (ln ? ' (' + ln + ')' : '') + (pf ? ' with ' + pf : ''), url: location.pathname, img: img(m.photo, 150), pos: m.cardPosition || m.photoPosition || '' };
      }
      return { key: 'm:' + m.slug, label: m.related ? (m.subjectName || m.name) : 'Musician: ' + m.name, url: location.pathname, img: img(m.photo, 150), pos: m.cardPosition || m.photoPosition || '' };
    };
    var elistBox = root.querySelector('.vp-elist'), addBtns = Array.prototype.slice.call(root.querySelectorAll('.vp-add')), addNotes = Array.prototype.slice.call(root.querySelectorAll('.vp-add-note'));
    var renderList = function () {
      var me = curItem(), meKey = me && me.key, isMusicianPage = meKey && (meKey.indexOf('m:') === 0 || meKey === 'trad');
      // Trad band already in the enquiry: keep its saved line-up (Duo / Trio) in step with the form
      if (meKey === 'trad') {
        var tl = getList(), ti = -1; tl.forEach(function (x, i) { if (x.key === 'trad') ti = i; });
        if (ti !== -1) {
          // Coming back to the trad page: fill the form with their saved Duo / Trio instead of losing it
          var savedLine = ((tl[ti].label || '').match(/\((Duo|Trio)\)/) || [])[1], ls = root.querySelector('#vp-lineup');
          if (savedLine && ls && !ls.value) {
            ls.value = savedLine;
            root.querySelectorAll('.vp-lineup').forEach(function (b) { b.classList.toggle('vp-picked', b.getAttribute('data-lineup') === savedLine); });
            me = curItem();
          }
          if (tl[ti].label !== me.label) { tl[ti] = me; setList(tl); }
        }
      }
      // On a musician's own page, show them in the box once they've been picked, so the couple can see their choice
      var others = getList().filter(function (x) { return !me || x.key !== me.key || isMusicianPage; });
      elistBox.hidden = !others.length;
      var elT = elistBox.querySelector('.vp-elist-t'); if (elT) elT.textContent = isMusicianPage && others.length === 1 && others[0].key === meKey ? 'Your choice' : 'In your enquiry';
      // Musicians whose names are hidden show as "Your musician preference" (numbered if there are several)
      var anon = others.filter(function (x) { return /^Musician: Musician [A-Z]$/.test(x.label); }), anonN = 0;
      var shown = function (x) {
        if (!/^Musician: Musician [A-Z]$/.test(x.label)) return x.label;
        anonN++; return anon.length > 1 ? 'Musician preference ' + anonN : 'Your musician preference';
      };
      var thumb = function (x) {
        if (x.img) return { src: x.img, pos: x.pos || '' };
        if (!x.key || x.key.indexOf('m:') !== 0) return null;
        var o = DATA.musicians.filter(function (y) { return 'm:' + y.slug === x.key; })[0];  // items saved before photos were stored
        return o && o.photo ? { src: img(o.photo, 150), pos: o.cardPosition || o.photoPosition || '' } : null;
      };
      elistBox.querySelector('ul').innerHTML = others.map(function (x) {
        var t = shown(x), th = thumb(x);
        return '<li' + (th ? ' class="vp-el-m"' : '') + '><span class="vp-el-who">' + (th ? '<img src="' + esc(th.src) + '" alt=""' + (th.pos ? ' style="object-position:' + esc(th.pos) + '"' : '') + '>' : '') + '<span>' + esc(t) + '</span></span><button type="button" data-key="' + esc(x.key) + '" aria-label="Remove ' + esc(t) + '">✕</button></li>';
      }).join('');
      Array.prototype.forEach.call(elistBox.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { setList(getList().filter(function (x) { return x.key !== b.getAttribute('data-key'); })); renderList(); }); });
      var inList = me && getList().some(function (x) { return x.key === me.key; });
      addBtns.forEach(function (b) { b.disabled = !me; });
      addBtns.forEach(function (b) { b.textContent = inList ? '✓ In your enquiry. Keep browsing' : '+ Add to my enquiry and keep browsing'; });
      var bar = root.querySelector('.vp-sheet-bar span');
      if (bar && !bar.parentNode.classList.contains('vp-bar-msg')) {
        var base = bar.getAttribute('data-base') || bar.textContent; bar.setAttribute('data-base', base);
        var moreN = others.filter(function (x) { return x.key !== meKey; }).length; bar.textContent = base + (moreN ? ' (+' + moreN + ')' : ''); bar.setAttribute('data-label', bar.textContent);
      }
    };
    addBtns.forEach(function (ab) { ab.addEventListener('click', function () {
      var me = curItem(); if (!me) return;
      var l = getList().filter(function (x) { return x.key !== me.key; }); l.push(me); setList(l);
      renderList();
      var noteHtml = 'Added. Have a look at our other <a href="/musicians">musicians</a>, the <a href="/trad">trad band</a> or <a href="/packages">packages</a>, then send everything in one enquiry. Your details are saved.';
      addNotes.forEach(function (n) { n.hidden = false; n.innerHTML = noteHtml; });
    }); });
    var addPk = root.querySelector('.vp-addpk-btn');
    if (addPk && soloPage) addPk.addEventListener('click', function (e) {
      e.preventDefault();
      var me = curItem();
      if (me) { var l = getList().filter(function (x) { return x.key !== me.key; }); l.push(me); setList(l); }
      location.href = '/packages?with=' + encodeURIComponent(m.slug);
    });
    window.addEventListener('pageshow', renderList); window.wd2RenderList = renderList;
    renderList();
    var form = root.querySelector('.vp-form'), status = form.querySelector('.vp-status'), sendBtn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'vp-status'; status.textContent = '';
      if (m.packages && window.wd2PkCheck && !window.wd2PkCheck()) {
        status.className = 'vp-status vp-err'; status.textContent = 'Please confirm your budget for your solo musician first.';
        if (mobileQ.matches && aside.classList.contains('vp-open')) setSheet(false);
        return;
      }
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
      // Same subject for every enquiry from the same couple, so their emails land in one thread;
      // what they asked about goes in the body instead.
      var tidy = fullName.replace(/\s+/g, ' ').trim().toLowerCase().replace(/(^|[\s'-])([a-z])/g, function (a, b, c) { return b + c.toUpperCase(); });
      payload.subject = tidy + ' - Wedding Day 2 Enquiry';
      // everything they added on other pages, plus this page
      var me = curItem(), all = getList().filter(function (x) { return !me || x.key !== me.key; });
      if (me) all.push(me);
      payload['Enquiry about'] = all.length ? all.map(function (x, i) { return (all.length > 1 ? (i + 1) + '. ' : '') + x.label; }).join('\n') : (m.subjectName || m.name);
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
          try { if (window.fbq) window.fbq('track', 'Lead', { content_name: m.subjectName || m.name, content_category: 'Music' }); } catch (x) {}
          form.innerHTML = '<div class="vp-done"><h2>Thanks, ' + esc(payload['First name']) + '</h2><p>We have your enquiry' + (all.length > 1 ? ' about ' + all.length + ' options' : ' about ' + (m.hideName ? 'your musician preference' : esc(m.name))) + ' and will be in touch soon by email.</p></div>';
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
            var hls = new window.Hls({ autoStartLoad: false, abrEwmaDefaultEstimate: 6000000, capLevelToPlayerSize: false, maxBufferLength: 10, startFragPrefetch: true, testBandwidth: false });
            // Always start in the top quality (1080p), on phones too, instead of letting the phone pick the low 360p version first
            hls.on(window.Hls.Events.MANIFEST_PARSED, function (ev, d) {
              var lv = d.levels || hls.levels, top = 0; lv.forEach(function (l, li) { if ((l.height || 0) > (lv[top].height || 0)) top = li; });
              hls.startLevel = top;
            });
            try { el.disableRemotePlayback = true; } catch (e) {}  // lets iPhones (iOS 17.1+) use this player rather than their own
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
