/* Wedding Day 2 venue page
   Usage in a Squarespace Code block:
     <div id="venue-page" data-venue="oneills"></div>
     <script src="https://cdn.jsdelivr.net/gh/conorclmurphy/wd2-venues@main/venue-page.js"></script>
   Change data-venue to the venue's "slug" from venues.json.
   The page is dark by default; add data-theme="light" to the div for the light sand version. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venues.json';
  var HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
  var FORM_URL = 'https://api.web3forms.com/submit';
  var root = document.getElementById('venue-page');
  if (!root) return;
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
#venue-page{--vp-bg:#273030;--vp-surface:#303b3b;--vp-ink:#eae6dd;--vp-muted:#b8b3a8;--vp-line:#3f4b4b;--vp-bottle:#1d2525;--vp-brass:#3dc2bb;--vp-accent-text:#3dc2bb;--vp-on-dark:#eae6dd;\
--vp-display:"Young Serif",Georgia,serif;--vp-body:"Bitter",Georgia,serif;\
background:var(--vp-bg);color:var(--vp-ink);font-family:var(--vp-body);font-size:16px;line-height:1.65;font-weight:400;text-align:left}\
#venue-page[data-theme="light"]{--vp-bg:#eae6dd;--vp-surface:#f1ede2;--vp-ink:#273030;--vp-muted:#505c5c;--vp-line:#d3cec2;--vp-bottle:#273030;--vp-accent-text:#1b7f7a}\
#venue-page *{box-sizing:border-box}\
#venue-page h1,#venue-page h2,#venue-page h3{font-family:var(--vp-display);font-weight:400;letter-spacing:-.01em;text-transform:none;color:inherit;text-wrap:balance}\
#venue-page p{margin:0}\
#venue-page .vp-pad{padding-left:max(16px,4vw);padding-right:max(16px,4vw)}\
#venue-page .vp-hero{position:relative;min-height:min(70vh,600px);display:flex;align-items:flex-end;color:var(--vp-on-dark);background:#273030;overflow:hidden}\
#venue-page .vp-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;max-width:none}\
#venue-page .vp-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(39,48,48,0) 35%,rgba(39,48,48,.85) 100%)}\
#venue-page .vp-hero-in{position:relative;z-index:1;width:100%;padding-top:48px;padding-bottom:40px}\
#venue-page .vp-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}\
#venue-page .vp-hero h1{font-size:clamp(40px,7vw,76px);line-height:1.02;margin:10px 0 12px;color:var(--vp-on-dark)}\
#venue-page .vp-lede{max-width:56ch;font-size:18px;opacity:.92}\
#venue-page .vp-facts{background:var(--vp-bottle);color:var(--vp-on-dark);display:flex;flex-wrap:wrap;gap:20px 40px;align-items:center;padding-top:22px;padding-bottom:22px}\
#venue-page .vp-fact span{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}\
#venue-page .vp-fact strong{font-family:var(--vp-display);font-weight:400;font-size:24px;color:var(--vp-brass)}\
#venue-page .vp-btn{display:inline-block;margin-left:auto;text-decoration:none;font-weight:500;letter-spacing:.04em;padding:14px 24px;border-radius:2px;background:var(--vp-brass);color:#273030;border:0}\
#venue-page .vp-btn:focus-visible,#venue-page button:focus-visible{outline:2px solid var(--vp-brass);outline-offset:3px}\
#venue-page .vp-body{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:56px;align-items:start;max-width:1240px;margin:0 auto;padding-top:72px;padding-bottom:72px}\
#venue-page .vp-main{display:grid;gap:72px;min-width:0;container-type:inline-size}\
#venue-page .vp-aside{position:sticky;top:var(--vp-sticky-top,110px);min-width:0;max-height:calc(100vh - var(--vp-sticky-top,110px) - 16px);overflow-y:auto;overscroll-behavior:contain}\
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
#venue-page .vp-gallery button{padding:0;border:0;background:var(--vp-line);cursor:zoom-in;aspect-ratio:4/3;overflow:hidden}\
#venue-page .vp-gallery img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}\
#venue-page .vp-gallery button:hover img{transform:scale(1.04)}\
#venue-page .vp-space-gallery{grid-column:1/-1;min-width:0}\
#venue-page .vp-more{margin-top:16px;font:inherit;font-weight:500;background:none;border:1px solid var(--vp-ink);color:var(--vp-ink);padding:10px 18px;cursor:pointer}\
#venue-page .vp-video{margin:0;display:grid;gap:8px;min-width:0}\
#venue-page .vp-vwrap{position:relative}\
#venue-page .vp-video video{width:100%;aspect-ratio:16/9;background:#1d2525;display:block;object-fit:cover}\
#venue-page .vp-play{position:absolute;inset:0;margin:auto;width:76px;height:76px;border-radius:50%;border:0;padding:0;background:var(--vp-brass);color:#273030;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35);transition:transform .15s}\
#venue-page .vp-play:hover{transform:scale(1.08)}\
#venue-page .vp-play svg{width:28px;height:28px;margin-left:4px}\
#venue-page .vp-vwrap.vp-playing .vp-play{display:none}\
#venue-page .vp-video figcaption{font-size:13px;color:var(--vp-muted)}\
#venue-page .vp-loc p{margin-bottom:12px;color:var(--vp-muted)}\
#venue-page .vp-loc a{color:var(--vp-accent-text);font-weight:500}\
#venue-page .vp-map{width:100%;max-width:640px;height:300px;border:1px solid var(--vp-line);display:block;margin-bottom:12px;background:var(--vp-line)}\
#venue-page .vp-form{background:var(--vp-surface);border:1px solid var(--vp-line);padding:22px 24px;display:grid;gap:11px;scroll-margin-top:var(--vp-sticky-top,110px)}\
#venue-page .vp-form h2{font-size:24px;margin:0}\
#venue-page .vp-form .vp-sub{color:var(--vp-muted);font-size:14px;margin-top:-6px}\
#venue-page .vp-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}\
#venue-page .vp-field{display:grid;gap:5px;min-width:0}\
#venue-page .vp-field label{font-size:13px;font-weight:500;color:var(--vp-ink)}\
#venue-page .vp-field label i{font-style:normal;color:var(--vp-muted);font-weight:400}\
#venue-page .vp-field input,#venue-page .vp-field select,#venue-page .vp-field textarea{font:inherit;font-size:15px;width:100%;padding:8px 11px;border:1px solid var(--vp-line);border-radius:2px;background:var(--vp-bg);color:var(--vp-ink);color-scheme:dark}\
#venue-page[data-theme="light"] .vp-field input,#venue-page[data-theme="light"] .vp-field select,#venue-page[data-theme="light"] .vp-field textarea{color-scheme:light}\
#venue-page .vp-field textarea{min-height:72px;resize:vertical}\
#venue-page .vp-field input:focus,#venue-page .vp-field select:focus,#venue-page .vp-field textarea:focus{outline:2px solid var(--vp-brass);outline-offset:0;border-color:transparent}\
#venue-page .vp-form .vp-btn{margin:4px 0 0;width:100%;font:inherit;font-weight:500;cursor:pointer}\
#venue-page .vp-form .vp-btn[disabled]{opacity:.6;cursor:wait}\
#venue-page .vp-status{font-size:14px;margin:0}\
#venue-page .vp-status a{color:inherit;text-decoration:underline}\
#venue-page .vp-status.vp-err{color:#f0a48c}\
#venue-page .vp-done{display:grid;gap:8px}\
#venue-page .vp-done h2{color:var(--vp-brass)}\
#venue-page .vp-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}\
@container (max-width:640px){#venue-page .vp-space.vp-has-video,#venue-page .vp-split{grid-template-columns:1fr}}\
@media (max-width:1000px){#venue-page .vp-body{grid-template-columns:1fr}#venue-page .vp-aside{position:static;max-height:none;overflow:visible}}\
#venue-page .vp-lb{position:fixed;inset:0;z-index:99999;background:rgba(39,48,48,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px}\
#venue-page .vp-lb[hidden]{display:none}\
#venue-page .vp-lb img{max-height:78vh;max-width:100%;object-fit:contain}\
#venue-page .vp-lb-bar{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;align-items:center;color:var(--vp-on-dark)}\
#venue-page .vp-lb-bar button{font:inherit;background:none;border:1px solid rgba(234,230,221,.4);color:var(--vp-on-dark);padding:8px 14px;cursor:pointer}\
#venue-page .vp-msg{padding:40px 16px;color:var(--vp-muted)}\
@media (max-width:760px){#venue-page .vp-space.vp-has-video,#venue-page .vp-split{grid-template-columns:1fr}}\
@media (max-width:640px){#venue-page .vp-gallery{grid-template-columns:repeat(2,minmax(0,1fr))}#venue-page .vp-play{width:60px;height:60px}#venue-page .vp-form{padding:22px 18px}#venue-page .vp-row{grid-template-columns:1fr}#venue-page .vp-main{gap:56px}#venue-page .vp-body{padding-top:52px;padding-bottom:52px;gap:56px}#venue-page .vp-btn{margin-left:0}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var keyHandler = null;

  function load() {
    slug = (root.getAttribute('data-venue') || '').trim().toLowerCase();
    root.innerHTML = '<div class="vp-msg">Loading venue…</div>';
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
      return '<figure class="vp-video"><div class="vp-vwrap"><video data-v="' + (allVideos.length - 1) + '" controls playsinline preload="none" poster="' + DATA.videoBase + x.id + '/thumbnail" aria-label="Walk-around video of ' + esc(label) + '"></video>'
        + '<button type="button" class="vp-play" aria-label="Play walk-around of ' + esc(label) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 4l15 8-15 8z"/></svg></button></div><figcaption>Walk-around of ' + esc(label) + ' · ' + mm + '</figcaption></figure>';
    }

    function galleryTag(list, label) {
      if (!list || !list.length) return '';
      var si = sets.push(list) - 1, shown = list.slice(0, 8);
      var g = '<div class="vp-gallery" data-set="' + si + '">';
      shown.forEach(function (p, i) {
        g += '<button type="button" data-set="' + si + '" data-i="' + i + '" aria-label="Open photo ' + (i + 1) + ' of ' + list.length + ' of ' + esc(label) + '"><img loading="lazy" src="' + img(p, 750) + '" alt="' + esc(label) + ' photo ' + (i + 1) + '"></button>';
      });
      g += '</div>';
      if (list.length > shown.length) g += '<button class="vp-more" type="button" data-set="' + si + '" data-i="0">View all ' + list.length + ' photos</button>';
      return g;
    }

    h += '<div class="vp-body vp-pad"><div class="vp-main">';
    if (v.intro) {
      if (vids.length) h += '<section class="vp-about vp-split"><div><h2>About the venue</h2><p>' + esc(v.intro) + '</p></div>' + videoTag(vids[0], v.name) + '</section>';
      else h += '<section class="vp-about"><h2>About the venue</h2><p>' + esc(v.intro) + '</p></section>';
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

    h += '</div>';  // end of main column

    // Enquiry form: stays in view beside the content on wide screens, sits at the end on phones.
    var today = new Date(); today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    h += '<aside class="vp-aside"><form class="vp-form" id="vp-enquire" novalidate>'
      + '<h2>Enquire about ' + esc(v.name) + '</h2><p class="vp-sub">Tell us your date and we will check availability and put together your entertainment.</p>'
      + '<div class="vp-row"><div class="vp-field"><label for="vp-fname">First name</label><input id="vp-fname" name="First name" autocomplete="given-name" required></div>'
      + '<div class="vp-field"><label for="vp-lname">Last name</label><input id="vp-lname" name="Last name" autocomplete="family-name" required></div></div>'
      + '<div class="vp-field"><label for="vp-email">Email</label><input id="vp-email" name="email" type="email" autocomplete="email" required></div>'
      + '<div class="vp-field"><label for="vp-date">Event date <i>(optional)</i></label><input id="vp-date" name="Event date" type="date" min="' + today + '"></div>'
      + '<div class="vp-field"><label for="vp-venue">Venue(s) you are interested in</label><input id="vp-venue" name="Venue" value="' + esc(v.name) + '"></div>'
      + '<div class="vp-field"><label for="vp-music">Interested in our live music or karaoke options?</label><select id="vp-music" name="Live music / karaoke"><option value="">Select an option</option><option>Yes</option><option>No</option></select></div>'
      + '<div class="vp-field"><label for="vp-heard">How did you hear about us?</label><select id="vp-heard" name="How they heard about us"><option value="">Select an option</option><option>Instagram</option><option>Google Search</option><option>Musician referral</option><option>Friends or family</option><option>Other</option></select></div>'
      + '<div class="vp-field"><label for="vp-msg">Let us know how we can help <i>(optional)</i></label><textarea id="vp-msg" name="Message" placeholder="Guest numbers, questions, anything else"></textarea></div>'
      + '<input type="checkbox" name="botcheck" class="vp-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'
      + '<button class="vp-btn" type="submit">Send enquiry</button><p class="vp-status" role="status" aria-live="polite"></p>'
      + '</form></aside>';
    h += '</div>';  // end of body

    h += '<div class="vp-lb" hidden><img alt=""><div class="vp-lb-bar"><button type="button" data-a="prev">Previous</button><span class="vp-count"></span><button type="button" data-a="next">Next</button><button type="button" data-a="close">Close</button></div></div>';

    root.innerHTML = h;

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
      if (lb.hidden) return;
      if (e.key === 'Escape') lb.hidden = true; else if (e.key === 'ArrowRight') open(idx + 1); else if (e.key === 'ArrowLeft') open(idx - 1);
    };
    document.addEventListener('keydown', keyHandler);

    // Enquiry form
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
      var payload = { access_key: DATA.formAccessKey, subject: 'Venue enquiry: ' + v.name, from_name: 'Wedding Day 2 website', page: location.href };
      Array.prototype.forEach.call(form.elements, function (f) { if (f.name && f.type !== 'checkbox') payload[f.name] = f.value; });
      payload.botcheck = form.querySelector('[name=botcheck]').checked;
      sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
      fetch(FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message || 'failed');
          form.innerHTML = '<div class="vp-done"><h2>Thanks, ' + esc(payload['First name']) + '</h2><p>We have your enquiry about ' + esc(v.name) + ' and will be in touch soon by email.</p></div>';
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
          var wrap = el.parentNode, btn = wrap.querySelector('.vp-play');
          btn.addEventListener('click', function () { var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); });
          el.addEventListener('play', function () { wrap.classList.add('vp-playing'); });
          el.addEventListener('ended', function () { wrap.classList.remove('vp-playing'); });
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ autoStartLoad: false });
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
