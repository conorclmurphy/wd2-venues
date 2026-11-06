/* Wedding Day 2 floating "Your enquiry" pill
   Shows in the bottom-right corner on every page once a couple has added something
   (a musician, the trad band, a package or a venue) to their enquiry. It reads the same
   list the musician and venue pages save in the browser ("wd2EnquiryList").
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
  var KEY = 'wd2EnquiryList';
  var getList = function () { try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; } };
  var setList = function (l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} };
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
#wd2-float *{box-sizing:border-box}\
#wd2-float .wf-pill{display:flex;align-items:center;gap:10px;padding:8px 16px 8px 8px;border-radius:999px;border:1.5px solid #3dc2bb;background:#171d1d;color:#eae6dd;font:inherit;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.45);animation:wfIn .45s cubic-bezier(.2,.8,.2,1)}\
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
#wd2-float .wf-go{display:block;width:100%;text-align:center;text-decoration:none;padding:12px 18px;border-radius:999px;background:#3dc2bb;color:#1f2727;font-weight:600;font-size:15px}\
#wd2-float .wf-note{margin:10px 0 0;font-size:12.5px;color:#b8b3a8;text-align:center}\
@keyframes wfIn{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}\
@media (prefers-reduced-motion:reduce){#wd2-float .wf-pill,#wd2-float .wf-panel{animation:none}}\
@media (max-width:640px){#wd2-float .wf-pill{font-size:14px;padding:6px 14px 6px 6px}#wd2-float .wf-faces span{width:28px;height:28px}}';
  document.head.appendChild(css);

  var box = document.createElement('div');
  box.id = 'wd2-float';
  box.hidden = true;
  box.innerHTML = '<div class="wf-panel" id="wf-panel" role="dialog" aria-label="Your enquiry" hidden></div>'
    + '<button type="button" class="wf-pill" aria-expanded="false" aria-controls="wf-panel"></button>';
  document.body.appendChild(box);
  var pill = box.querySelector('.wf-pill'), panel = box.querySelector('.wf-panel');

  function onFormPage() { return !!document.querySelector('#musician-page .vp-form, #venue-page .vp-form'); }

  function draw() {
    var list = getList();
    // Pages that already have the enquiry form show the list there, so stay out of the way
    if (!list.length || onFormPage()) { box.hidden = true; return; }
    box.hidden = false;
    var anon = list.filter(isAnon), n = 0;
    var name = function (x) {
      if (!isAnon(x)) return x.label || 'Item';
      n++; return anon.length > 1 ? 'Chosen musician ' + n : 'Your chosen musician';
    };
    var faces = list.slice(0, 3).map(function (x) {
      return x.img ? '<span style="background-image:url(\'' + esc(x.img) + '\')' + (x.pos ? ';background-position:' + esc(x.pos) : '') + '"></span>' : '<span>♪</span>';
    }).join('');
    pill.innerHTML = '<span class="wf-faces">' + faces + '</span><span>Your enquiry</span><span class="wf-count">' + list.length + '</span>';
    pill.setAttribute('aria-label', 'Your enquiry, ' + list.length + ' item' + (list.length === 1 ? '' : 's'));
    var last = list[list.length - 1];
    var go = (last && last.url ? last.url : '/packages') + (last && last.url && last.url.indexOf('?') !== -1 ? '&' : '?') + 'enquire=1';
    n = 0;
    panel.innerHTML = '<div class="wf-head"><strong>Your enquiry</strong><button type="button" class="wf-x" aria-label="Close">✕</button></div>'
      + '<ul>' + list.map(function (x) {
        var t = name(x);
        return '<li><span class="wf-who">' + (x.img ? '<img src="' + esc(x.img) + '" alt=""' + (x.pos ? ' style="object-position:' + esc(x.pos) + '"' : '') + '>' : '<span class="wf-dot">♪</span>') + '<span>' + esc(t) + '</span></span>'
          + '<button type="button" data-key="' + esc(x.key) + '" aria-label="Remove ' + esc(t) + '">✕</button></li>';
      }).join('') + '</ul>'
      + '<a class="wf-go" href="' + esc(go) + '">Send my enquiry →</a>'
      + '<p class="wf-note">Add as many musicians, packages or venues as you like, then send them all together.</p>';
    panel.querySelector('.wf-x').addEventListener('click', function () { toggle(false); });
    Array.prototype.forEach.call(panel.querySelectorAll('li button'), function (b) {
      b.addEventListener('click', function () {
        setList(getList().filter(function (x) { return x.key !== b.getAttribute('data-key'); }));
        draw();
        if (!box.hidden) pill.focus();
      });
    });
  }
  function toggle(open) {
    panel.hidden = !open;
    pill.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  pill.addEventListener('click', function () { toggle(panel.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { toggle(false); pill.focus(); } });
  document.addEventListener('click', function (e) { if (!panel.hidden && !box.contains(e.target)) toggle(false); });

  draw();
  // Keep up to date: other tabs, coming back with the browser's Back button, and pages that draw their form a little later
  window.addEventListener('storage', function (e) { if (e.key === KEY) draw(); });
  window.addEventListener('pageshow', draw);
  setTimeout(draw, 1500); setTimeout(draw, 4000);
  window.wd2FloatRefresh = draw;
})();
