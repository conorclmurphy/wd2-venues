/* Wedding Day 2 floating "Your enquiry" pill
   Shows in the bottom-right corner on every page once a couple has added something to their enquiry:
   one pill for venues and one for music (musicians, trad band, packages), stacked when both are in use. It reads the same
   lists the musician and venue pages save in the browser ("wd2EnquiryList" for music, "wd2VenueEnquiryList" for venues).
   Hidden on pages that already show the enquiry form.
   Loaded site-wide from Squarespace: Settings > Developer tools > Code injection > Footer:
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/enquiry-float.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script> */
(function () {
  if (window.__wd2Float) return;
  window.__wd2Float = true;
  // Music (musicians, trad band, packages) and venues are saved in separate lists by their pages
  var KEY = 'wd2EnquiryList', VKEY = 'wd2VenueEnquiryList';
  var read = function (k) { try { return JSON.parse(localStorage.getItem(k) || '[]') || []; } catch (e) { return []; } };
  var write = function (k, l) { try { localStorage.setItem(k, JSON.stringify(l)); } catch (e) {} };
  var getList = function () { return read(KEY).concat(read(VKEY)); };
  var removeKey = function (key) {
    [KEY, VKEY].forEach(function (k) { var l = read(k), f = l.filter(function (x) { return x.key !== key; }); if (f.length !== l.length) write(k, f); });
  };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var isAnon = function (x) { return /^Musician: Musician [A-Z]$/.test(x.label || ''); };

  var css = document.createElement('style');
  css.textContent = '\
#wd2-float{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9997;font-family:"Bitter",Georgia,serif;color:#eae6dd;display:flex;flex-direction:column;align-items:flex-end;gap:10px}\
#wd2-float[hidden]{display:none}\
#wd2-float.wf-new{animation:wfIn .45s cubic-bezier(.2,.8,.2,1)}\
#wd2-float *{box-sizing:border-box}\
#wd2-float .wf-group{display:flex;flex-direction:column;align-items:flex-end;gap:10px}\
#wd2-float .wf-pill{display:flex;align-items:center;gap:10px;padding:8px 16px 8px 8px;border-radius:999px;border:1.5px solid #3dc2bb;background:#171d1d;color:#eae6dd;font:inherit;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.45)}\
#wd2-float .wf-pill:hover{background:#1f2727}\
#wd2-float .wf-pill:focus-visible,#wd2-float button:focus-visible,#wd2-float a:focus-visible{outline:2px solid #3dc2bb;outline-offset:3px}\
#wd2-float .wf-faces{display:flex}\
#wd2-float .wf-faces span{width:32px;height:32px;border-radius:50%;border:2px solid #3dc2bb;background:#283232 center/cover no-repeat;margin-left:-10px;display:grid;place-items:center;font-size:14px;color:#3dc2bb}\
#wd2-float .wf-faces span:first-child{margin-left:0}\
#wd2-float .wf-count{display:inline-grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:#3dc2bb;color:#1f2727;font-size:13px}\
#wd2-float .wf-panel{width:min(340px,calc(100vw - 32px));background:#283232;border:1px solid #364242;border-radius:18px;padding:16px;box-shadow:0 14px 40px rgba(0,0,0,.5);animation:wfIn .3s cubic-bezier(.2,.8,.2,1)}\
#wd2-float .wf-panel[hidden]{display:none}\
#wd2-float .wf-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}\
#wd2-float .wf-head strong{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:19px}\
#wd2-float .wf-x{background:none;border:0;color:#b8b3a8;font-size:15px;cursor:pointer;padding:4px 6px}\
#wd2-float ul{list-style:none;margin:0 0 12px;padding:0;display:grid;gap:8px;max-height:45vh;overflow-y:auto}\
#wd2-float li{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:14.5px;line-height:1.35}\
#wd2-float li .wf-who{display:flex;align-items:center;gap:10px;min-width:0}\
#wd2-float li img{width:36px;height:36px;border-radius:50%;object-fit:cover;flex:none;border:2px solid #3dc2bb}\
#wd2-float li .wf-dot{width:36px;height:36px;border-radius:50%;flex:none;border:2px dashed rgba(61,194,187,.6);display:grid;place-items:center;color:#3dc2bb;font-size:15px}\
#wd2-float li button{background:none;border:0;color:#b8b3a8;cursor:pointer;font-size:14px;padding:2px 4px;flex:none}\
#wd2-float li button:hover{color:#3dc2bb}\
#wd2-float .wf-photos{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0 0 12px;max-height:45vh;overflow-y:auto;padding:2px}\
#wd2-float .wf-photo{position:relative;aspect-ratio:1;border-radius:14px;overflow:hidden;border:2px solid #3dc2bb;background:#1f2727}\
#wd2-float .wf-photo img{width:100%;height:100%;object-fit:cover;display:block}\
#wd2-float .wf-photo button{position:absolute;top:5px;right:5px;width:24px;height:24px;border-radius:50%;border:0;background:rgba(23,29,29,.82);color:#eae6dd;font-size:12px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0}\
#wd2-float .wf-photo button:hover{background:#3dc2bb;color:#1f2727}\
#wd2-float .wf-go{display:block;width:100%;text-align:center;text-decoration:none;padding:12px 18px;border-radius:999px;background:#3dc2bb;color:#1f2727;font-weight:600;font-size:15px}\
#wd2-float .wf-note{margin:10px 0 0;font-size:12.5px;color:#b8b3a8;text-align:center}\
@keyframes wfIn{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}\
@media (prefers-reduced-motion:reduce){#wd2-float.wf-new,#wd2-float .wf-panel{animation:none}}\
@media (max-width:640px){#wd2-float .wf-pill{font-size:14px;padding:6px 14px 6px 6px}#wd2-float .wf-faces span{width:28px;height:28px}}';
  document.head.appendChild(css);

  // Two pills: venues on top, music (musicians, trad band, packages) underneath
  var box = document.createElement('div');
  box.id = 'wd2-float';
  box.hidden = true;
  document.body.appendChild(box);
  var GROUPS = [
    { id: 'venue', title: 'Your venues', empty: '⌂', test: function (x) { return (x.key || '').indexOf('v:') === 0; }, back: '/venues' },
    { id: 'music', title: 'Your music', empty: '♪', test: function (x) { return (x.key || '').indexOf('v:') !== 0; }, back: '/packages' }
  ];
  var openId = '';

  // The Google reviews button sits in the same corner, so stack the pills just above it
  function place() {
    var rb = document.querySelector('.grb-btn'), r = rb && rb.getBoundingClientRect();
    var up = r && r.height && getComputedStyle(rb).display !== 'none' && getComputedStyle(rb).visibility !== 'hidden' ? Math.round(window.innerHeight - r.top) + 10 : 0;
    box.style.bottom = up ? up + 'px' : '';
  }
  window.addEventListener('resize', place);

  function onFormPage() { return !!document.querySelector('#musician-page .vp-form, #venue-page .vp-form'); }

  function draw() {
    var all = getList();
    // Pages that already have the enquiry form show the list there, so stay out of the way
    if (!all.length || onFormPage()) { box.hidden = true; box.innerHTML = ''; return; }
    place();
    if (box.hidden) { box.classList.remove('wf-new'); void box.offsetWidth; box.classList.add('wf-new'); }
    box.hidden = false;
    var html = '';
    GROUPS.forEach(function (g) {
      var list = all.filter(g.test);
      if (!list.length) return;
      var anon = list.filter(isAnon), n = 0;
      var name = function (x) {
        if (isAnon(x)) { n++; return anon.length > 1 ? 'Musician preference ' + n : 'Your musician preference'; }
        return (x.label || 'Item').replace(/^Venue: /, '');
      };
      var faces = list.slice(0, 3).map(function (x) {
        return x.img ? '<span style="background-image:url(\'' + esc(x.img) + '\')' + (x.pos ? ';background-position:' + esc(x.pos) : '') + '"></span>' : '<span>' + g.empty + '</span>';
      }).join('');
      var last = list[list.length - 1];
      var go = (last && last.url ? last.url : g.back) + (last && last.url && last.url.indexOf('?') !== -1 ? '&' : '?') + 'enquire=1';
      var open = openId === g.id;
      html += '<div class="wf-group" data-g="' + g.id + '">'
        + '<div class="wf-panel" id="wf-panel-' + g.id + '" role="dialog" aria-label="' + esc(g.title) + '"' + (open ? '' : ' hidden') + '>'
        + '<div class="wf-head"><strong>' + esc(g.title) + '</strong><button type="button" class="wf-x" aria-label="Close">✕</button></div>'
        + (function () {
          // Anonymous musicians: just their photos, no labels
          var pics = list.filter(function (x) { return isAnon(x) && x.img; });
          if (!pics.length) return '';
          return '<div class="wf-photos">' + pics.map(function (x) {
            var t = name(x);
            return '<div class="wf-photo"><img src="' + esc(x.img) + '" alt="' + esc(t) + '"' + (x.pos ? ' style="object-position:' + esc(x.pos) + '"' : '') + '>'
              + '<button type="button" data-key="' + esc(x.key) + '" aria-label="Remove ' + esc(t) + '">✕</button></div>';
          }).join('') + '</div>';
        })()
        + (function () { var rest = list.filter(function (x) { return !(isAnon(x) && x.img); }); return rest.length ? '<ul>' + rest.map(function (x) {
          var t = name(x);
          return '<li><span class="wf-who">' + (x.img ? '<img src="' + esc(x.img) + '" alt=""' + (x.pos ? ' style="object-position:' + esc(x.pos) + '"' : '') + '>' : '<span class="wf-dot">' + g.empty + '</span>') + '<span>' + esc(t) + '</span></span>'
            + '<button type="button" data-key="' + esc(x.key) + '" aria-label="Remove ' + esc(t) + '">✕</button></li>';
        }).join('') + '</ul>' : ''; })()
        + '<a class="wf-go" href="' + esc(go) + '">Send my enquiry →</a>'
        + '<p class="wf-note">' + (g.id === 'venue' ? 'Add as many venues as you like, then send them in one enquiry.' : 'Add as many musicians or packages as you like, then send them in one enquiry.') + '</p>'
        + '</div>'
        + '<button type="button" class="wf-pill" aria-expanded="' + open + '" aria-controls="wf-panel-' + g.id + '" aria-label="' + esc(g.title) + ', ' + list.length + ' item' + (list.length === 1 ? '' : 's') + '">'
        + '<span class="wf-faces">' + faces + '</span><span>' + esc(g.title) + '</span><span class="wf-count">' + list.length + '</span></button>'
        + '</div>';
    });
    box.innerHTML = html;
    Array.prototype.forEach.call(box.querySelectorAll('.wf-group'), function (grp) {
      var id = grp.getAttribute('data-g');
      grp.querySelector('.wf-pill').addEventListener('click', function () { openId = openId === id ? '' : id; draw(); var p = box.querySelector('.wf-group[data-g="' + id + '"] .wf-pill'); if (p) p.focus(); });
      grp.querySelector('.wf-x').addEventListener('click', function () { openId = ''; draw(); });
      Array.prototype.forEach.call(grp.querySelectorAll('li button, .wf-photo button'), function (b) {
        b.addEventListener('click', function () {
          removeKey(b.getAttribute('data-key'));
          draw();
        });
      });
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openId) { openId = ''; draw(); } });
  document.addEventListener('click', function (e) { if (openId && e.target.isConnected && !box.contains(e.target)) { openId = ''; draw(); } });

  draw();
  // Keep up to date: other tabs, coming back with the browser's Back button, and pages that draw their form a little later
  window.addEventListener('storage', function (e) { if (e.key === KEY || e.key === VKEY) draw(); });
  window.addEventListener('pageshow', draw);
  setTimeout(draw, 1500); setTimeout(draw, 4000); setTimeout(place, 8000);
  window.wd2FloatRefresh = draw;
})();
