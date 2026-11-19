/* Wedding Day 2 musicians grid (Solo Musicians page and Ceremony & Reception page)
   Usage in a Squarespace Code block:
     <div id="musicians-list"></div>                          (Solo Musicians, /musicians)
     <div id="musicians-list" data-event="ceremony"></div>    (Ceremony & Reception, /ceremony-musicians)
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
  var only = root.getAttribute('data-event') || '';  // "ceremony" on the Ceremony & Reception page
  var BG = '#0e2628', SURFACE = '#163436';        // same dark grey-green as the musician profile pages

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
    '#musicians-list{--c-bg:#0e2628;--c-surface:#163436;--c-line:#234749;--c-ink:#eae6dd;--c-muted:#b8b3a8;--c-cyan:#3dc2bb;background:var(--c-bg);color:var(--c-ink);font-family:"Bitter",Georgia,serif;padding:4px clamp(12px,2.5vw,32px) 56px}',
    '#musicians-list *{box-sizing:border-box}',
    '#musicians-list .ml-wrap{max-width:1600px;margin:0 auto}',
    '#musicians-list .ml-eye{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--c-cyan);margin:0 0 8px}',
    '#musicians-list h1{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:clamp(30px,4.4vw,48px);line-height:1.08;margin:0;color:var(--c-cyan)}',
    '#musicians-list .ml-from{display:inline-flex;align-items:baseline;gap:8px;margin:0;padding:0;color:var(--c-cyan)}',
    '#musicians-list .ml-from span{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--c-cyan);opacity:.8}',
    '#musicians-list .ml-from strong{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:28px;line-height:1}',
    '#musicians-list .ml-hero{position:relative;z-index:0;display:flex;align-items:flex-end;min-height:min(62vh,540px);margin:-4px 0 18px;overflow:hidden;background:#0e2628;border-bottom:1px solid rgba(234,230,221,.22)}',
    '#musicians-list .ml-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;max-width:none}',
    '#musicians-list .ml-hero:before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.82) 0%,rgba(0,0,0,.6) 45%,rgba(0,0,0,.35) 100%),linear-gradient(180deg,rgba(0,0,0,.6) 0%,rgba(0,0,0,.25) 35%,rgba(0,0,0,.75) 100%)}',
    '#musicians-list .ml-hero-in{position:relative;z-index:2;width:100%;padding:48px max(16px,4vw) 40px}',
    '#musicians-list .ml-hero .ml-eye{font-size:12px;letter-spacing:.18em;font-weight:500;color:var(--c-ink);margin:0}',
    '#musicians-list .ml-hero h1{font-size:clamp(40px,7vw,76px);line-height:1.02;margin:10px 0 14px;color:var(--c-ink)}',
    '#musicians-list .ml-hero p.ml-lead{margin:0;max-width:560px;font-size:17px;line-height:1.55;color:rgba(234,230,221,.88);text-shadow:0 1px 8px rgba(0,0,0,.55)}',
    '#musicians-list .ml-tabs{display:flex;gap:10px;max-width:1600px;margin:0 auto 26px}',
    '#musicians-list .ml-tab{flex:1 1 0;min-width:0;display:grid;gap:2px;text-decoration:none!important;padding:14px 20px;border-radius:14px;border:1.5px solid rgba(234,230,221,.18);background:rgba(234,230,221,.04);color:var(--c-ink)!important;transition:border-color .2s,background .2s,transform .2s}',
    '#musicians-list .ml-tab strong{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:21px;line-height:1.2}',
    '#musicians-list .ml-tab span{font-size:13.5px;color:var(--c-muted)}',
    '#musicians-list .ml-tab:hover{border-color:var(--c-cyan);transform:translateY(-2px)}',
    '#musicians-list .ml-tab.ml-tab-on{border-color:var(--c-cyan);background:rgba(61,194,187,.12)}',
    '#musicians-list .ml-tab.ml-tab-on span{color:var(--c-cyan)}',
    '#musicians-list.ml-anim .ml-tabs{animation:mlRise .7s cubic-bezier(.2,.7,.2,1) .2s both}',
    '@media (max-width:700px){#musicians-list .ml-tabs{gap:8px;margin-bottom:18px}#musicians-list .ml-tab{padding:10px 12px}#musicians-list .ml-tab strong{font-size:15.5px}#musicians-list .ml-tab span{font-size:11.5px;line-height:1.3}}',
    '#musicians-list .ml-top h2{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:clamp(22px,2.6vw,30px);line-height:1.1;margin:0;color:var(--c-cyan)}',
    '@media (max-width:700px){#musicians-list .ml-hero{min-height:330px;margin-bottom:12px}#musicians-list .ml-hero-in{padding-top:24px;padding-bottom:22px}#musicians-list .ml-hero h1{font-size:40px;margin-bottom:10px}#musicians-list .ml-hero p.ml-lead{font-size:14.5px}}',
    // Movement: cards rise in one after another as they scroll into view, lift on hover, and the banner settles in
    '#musicians-list.ml-anim .ml-card .ml-img{opacity:0;transform:translateY(26px) scale(.96)}',
    '#musicians-list.ml-anim .ml-card.ml-in .ml-img{opacity:1;transform:none;transition:opacity .6s ease var(--d,0ms),transform .7s cubic-bezier(.2,.7,.2,1) var(--d,0ms),box-shadow .25s}',
    '#musicians-list.ml-anim .ml-card .ml-tags{opacity:0;transform:translateY(-6px)}',
    '#musicians-list.ml-anim .ml-card.ml-in .ml-tags{opacity:1;transform:none;transition:opacity .45s ease calc(var(--d,0ms) + 280ms),transform .45s ease calc(var(--d,0ms) + 280ms)}',
    '@media (hover:hover){#musicians-list.ml-anim .ml-card.ml-in:hover .ml-img{transform:translateY(-7px);transition:transform .3s cubic-bezier(.2,.7,.2,1),box-shadow .25s}#musicians-list.ml-anim .ml-card:hover .ml-img img:not(.ml-wm){transform:scale(1.07)}#musicians-list .ml-card:hover .ml-more{transform:translateX(5px)}#musicians-list.ml-anim .ml-card:hover img.ml-wm{transform:scale(1.12) rotate(-4deg)!important}}',
    '#musicians-list .ml-more{transition:transform .3s ease,color .2s}',
    '#musicians-list img.ml-wm{transition:transform .35s ease}',
    '#musicians-list .ml-card:active .ml-img{transform:scale(.98)!important;transition:transform .12s!important}',
    '#musicians-list.ml-anim .ml-hero>img{animation:mlSettle 1.8s cubic-bezier(.2,.7,.2,1) both}',
    '#musicians-list.ml-anim .ml-hero-in>*{animation:mlRise .7s cubic-bezier(.2,.7,.2,1) both}',
    '#musicians-list.ml-anim .ml-hero-in>:nth-child(2){animation-delay:.12s}#musicians-list.ml-anim .ml-hero-in>:nth-child(3){animation-delay:.24s}',
    '#musicians-list.ml-anim .ml-top{animation:mlRise .7s cubic-bezier(.2,.7,.2,1) .3s both}',
    '#musicians-list .ml-chip{transition:background .2s,border-color .2s,color .2s,transform .15s}#musicians-list .ml-chip:active{transform:scale(.94)}',
    '@keyframes mlSettle{from{transform:scale(1.12);opacity:0}to{transform:none;opacity:1}}',
    '@keyframes mlRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}',
    '#musicians-list .ml-top{display:flex;flex-wrap:wrap;align-items:center;gap:12px 22px;margin:0 0 22px}',
    '#musicians-list .ml-head{flex:1 1 420px;min-width:0}',
    '#musicians-list .ml-intro{margin:8px 0 0;max-width:720px;font-size:15px;line-height:1.55;color:var(--c-muted)}',
    '#musicians-list .ml-top{align-items:flex-end}',
    '#musicians-list .ml-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 0 auto;justify-content:flex-end}',
    '#musicians-list .ml-chip{font:inherit;font-size:13px;cursor:pointer;padding:6px 13px;border-radius:999px;color:#eae6dd;background:rgba(234,230,221,.08);-webkit-backdrop-filter:blur(12px) saturate(140%);backdrop-filter:blur(12px) saturate(140%);border:1px solid rgba(234,230,221,.28);box-shadow:inset 0 1px 0 rgba(255,255,255,.12);transition:background .2s,border-color .2s,color .2s}',
    '#musicians-list .ml-chip:hover{background:rgba(234,230,221,.16)}',
    '#musicians-list .ml-chip.on{background:#3dc2bb;border-color:#3dc2bb;color:#142020;font-weight:600;box-shadow:0 0 0 3px rgba(61,194,187,.25)}',
    '#musicians-list .ml-chip.on:before{content:"\\2713";margin-right:7px;font-weight:700}',
    '#musicians-list .ml-chip{font-size:15px;padding:9px 17px}',
    '#musicians-list .ml-pick{display:flex;flex-direction:column;align-items:flex-end;gap:8px;margin-left:auto}',
    '#musicians-list .ml-ask{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--c-muted)}',
    '#musicians-list .ml-count{margin:8px 0 0;font-size:15px;color:var(--c-muted)}#musicians-list .ml-count strong{color:var(--c-ink);font-weight:600}',
    '#musicians-list .ml-tag{transition:background .25s,color .25s,border-color .25s}',
    '#musicians-list .ml-tag.ml-hit{background:#3dc2bb;border-color:#3dc2bb;color:#142020;font-weight:600;-webkit-backdrop-filter:none;backdrop-filter:none}',
    '@media (max-width:700px){#musicians-list .ml-pick{align-items:flex-start;margin-left:0;width:100%}#musicians-list .ml-chip{font-size:14px;padding:8px 14px}#musicians-list .ml-count{font-size:13.5px;margin-top:4px}}',
    '#musicians-list .ml-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:26px 18px}',
    '#musicians-list .ml-card,#musicians-list .ml-card.wd2-hover,#musicians-list .ml-card.wd2-hover:hover{display:grid;gap:8px;text-decoration:none!important;color:var(--c-ink)!important;box-shadow:none!important;transform:none!important;border-radius:0!important;overflow:visible!important}',
    '#musicians-list .ml-card[hidden]{display:none}',
    '#musicians-list .ml-img{position:relative;aspect-ratio:3/4;border-radius:16px;overflow:hidden;background:var(--c-line);transition:box-shadow .25s}',
    '#musicians-list .ml-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}',
    '#musicians-list .ml-img:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.75) 100%)}',
    '#musicians-list .ml-card:hover .ml-img{box-shadow:0 0 0 3px var(--c-cyan),0 12px 30px rgba(0,0,0,.35)}',
    '#musicians-list .ml-card:hover .ml-img img{transform:scale(1.04)}',
    '#musicians-list .ml-name{position:absolute;left:14px;bottom:11px;z-index:1;font-family:"Young Serif",Georgia,serif;font-size:24px;color:#eae6dd}',
    '#musicians-list img.ml-wm{position:absolute;inset:auto 12px 12px auto;width:30px;height:auto;object-fit:contain;z-index:2;opacity:.85;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));pointer-events:none;transform:none!important}',
    '#musicians-list .ml-xc img.ml-wm{inset:auto 14px 14px auto;width:30px;height:auto}',
    '#musicians-list .ml-tags{position:absolute;top:9px;left:9px;right:9px;z-index:1;display:flex;flex-wrap:wrap;gap:4px}',
    '#musicians-list .ml-tag{font-size:10.5px;line-height:1;padding:4px 7px;border-radius:999px;color:#eae6dd;background:rgba(0,0,0,.35);-webkit-backdrop-filter:blur(8px) saturate(140%);backdrop-filter:blur(8px) saturate(140%);border:1px solid rgba(234,230,221,.3)}',
    '#musicians-list .ml-more{position:absolute;right:50px;bottom:12px;z-index:1;font-size:10px;letter-spacing:.04em;color:rgba(234,230,221,.8)}',
    '#musicians-list .ml-card:hover .ml-more{color:#3dc2bb}',
    '#musicians-list .ml-about{margin-top:28px;border:1px solid var(--c-line);border-radius:14px;background:rgba(234,230,221,.04)}',
    '#musicians-list .ml-about summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;font-size:15px;font-weight:600;color:var(--c-ink)}',
    '#musicians-list .ml-about summary::-webkit-details-marker{display:none}',
    '#musicians-list .ml-about summary:after{content:"+";font-size:20px;line-height:1;color:var(--c-cyan);transition:transform .25s}',
    '#musicians-list .ml-about[open] summary:after{transform:rotate(45deg)}',
    '#musicians-list .ml-about p{margin:0;padding:0 16px 14px;font-size:14.5px;line-height:1.6;color:var(--c-muted)}',
    '#musicians-list .ml-more3{margin-top:44px}',
    '#musicians-list .ml-more3 h2{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:clamp(22px,2.6vw,30px);margin:0 0 16px;color:var(--c-ink)}',
    '#musicians-list .ml-x{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}',
    '#musicians-list .ml-xc{position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:260px;padding:20px;border-radius:18px;overflow:hidden;text-decoration:none!important;color:#eae6dd!important;font:inherit;text-align:left;cursor:pointer;border:1px solid rgba(234,230,221,.14);background:#0e2628;transition:box-shadow .25s,transform .25s}',
    '#musicians-list .ml-xc:hover{box-shadow:0 0 0 3px #3dc2bb,0 12px 30px rgba(0,0,0,.35);transform:translateY(-2px)}',
    '#musicians-list .ml-xc img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .5s}',
    '#musicians-list .ml-xc:hover img{transform:scale(1.04)}',
    '#musicians-list .ml-xc:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.85) 100%)}',
    '#musicians-list .ml-xc>span{position:relative;z-index:1;display:block}',
    '#musicians-list .ml-xe{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#3dc2bb;margin-bottom:4px}',
    '#musicians-list .ml-xt{font-family:"Young Serif",Georgia,serif;font-size:26px;line-height:1.1}',
    '#musicians-list .ml-xs{font-size:13.5px;color:rgba(234,230,221,.8);margin-top:4px}',
    '#musicians-list .ml-xk{display:grid;gap:6px;align-content:start;text-align:left;font:inherit;color:#eae6dd!important;background:none;border:0;padding:0;cursor:pointer;text-decoration:none!important}',
    '#musicians-list .ml-xi{position:relative;display:block;aspect-ratio:4/3;border-radius:16px;overflow:hidden;background:#0e2628;transition:box-shadow .25s}',
    '#musicians-list .ml-xi img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}',
    '#musicians-list .ml-xk:hover .ml-xi{box-shadow:0 0 0 3px #3dc2bb,0 8px 24px rgba(0,0,0,.35)}',
    '#musicians-list .ml-xk:hover .ml-xi img:not(.ml-wm){transform:scale(1.04)}',
    '#musicians-list .ml-xk strong{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:24px;line-height:1.2;margin-top:8px}',
    '#musicians-list .ml-xp{font-size:15px;color:var(--c-muted)}',
    '#musicians-list .ml-xi img.ml-wm{inset:auto 12px 12px auto;width:30px;height:auto}',
    '#musicians-list .ml-more3 .ml-xg{min-height:0;aspect-ratio:4/3;align-self:start}',
    '#musicians-list .ml-xg{background:rgba(234,230,221,.08);-webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);border-color:rgba(234,230,221,.28);justify-content:center}',
    '#musicians-list .ml-xg:after{display:none}',
    '#musicians-list .ml-xb{align-self:flex-start;display:inline-flex;gap:6px;align-items:center;margin-top:14px;padding:9px 20px;border-radius:999px;background:#3dc2bb;color:#0e2628;font-weight:600;font-size:14px;animation:mlBounce 2.6s ease-in-out infinite}',
    '@keyframes mlBounce{0%,60%,100%{transform:translateY(0)}70%{transform:translateY(-5px)}80%{transform:translateY(0)}88%{transform:translateY(-2px)}}',
    '@media (prefers-reduced-motion:reduce){#musicians-list .ml-xb{animation:none}}',
    '#musicians-list .ml-pop{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px}',
    '#musicians-list .ml-pop[hidden]{display:none}',
    '#musicians-list .ml-pop-in{width:100%;max-width:980px;text-align:center}',
    '#musicians-list .ml-pop h3{font-family:"Young Serif",Georgia,serif;font-weight:400;font-size:clamp(26px,3.4vw,38px);margin:0 0 6px;color:#eae6dd}',
    '#musicians-list .ml-pop p{margin:0 0 20px;color:rgba(234,230,221,.8)}',
    '#musicians-list .ml-pop .ml-x{text-align:left}',
    '#musicians-list .ml-pop-x{position:absolute;top:16px;right:18px;width:42px;height:42px;border-radius:50%;border:0;background:rgba(234,230,221,.12);color:#eae6dd;font-size:24px;cursor:pointer}',
    '@media (max-width:760px){#musicians-list .ml-x{grid-template-columns:1fr;gap:12px}#musicians-list .ml-xc{min-height:170px}#musicians-list .ml-xg{min-height:0}#musicians-list .ml-pop .ml-xc{min-height:120px}#musicians-list .ml-xt{font-size:22px}}',
    '@media (max-width:1000px){#musicians-list .ml-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}',
    '@media (max-width:700px){#musicians-list{padding-top:0}#musicians-list .ml-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 12px}#musicians-list .ml-name{font-size:19px;bottom:9px;left:11px}#musicians-list .ml-img img.ml-wm{width:24px;inset:auto 9px 9px auto}#musicians-list .ml-more{display:none}#musicians-list .ml-tag{font-size:9.5px;padding:3px 6px}#musicians-list .ml-tags{top:7px;left:7px;right:7px;gap:3px}#musicians-list .ml-top{gap:10px 14px;margin-bottom:14px}#musicians-list .ml-from strong{font-size:23px}#musicians-list .ml-from span{font-size:11.5px}#musicians-list .ml-chips{margin:0;justify-content:flex-start;width:100%}#musicians-list .ml-intro{font-size:13.5px;margin-top:6px}}'
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
  var H1 = only === 'ceremony' ? 'Ceremony & Drinks Reception' : 'Solo Musicians';
  var EYE = only === 'ceremony' ? 'Wedding Day 2 \u00B7 Ceremony musicians' : 'Wedding Day 2 \u00B7 Wedding musicians across Ireland';
  var LEAD = only === 'ceremony'
    ? 'Live music for walking down the aisle, signing the register and the drinks reception afterwards. Watch their videos, then check who\u2019s free on your date.'
    : 'Hand-picked singer-guitarists for your after-dinner set or Day 2. Watch their videos, then check who\u2019s free on your date.';
  // Wide photo behind the heading, darkened so the text reads
  var HERO = only === 'ceremony'
    ? ['0a59b978-2181-4711-b4a2-2fc6cb3515cf/musician-t-orlaith-2.jpg', '80% 40%']
    : ['bdca61da-023e-41a9-85f2-bca8ec528a2c/A+few+from+Gorey+Market+Festival+during+summer%2C+never+got+around+to+posting+but+better+late+tha.jpg', 'center 35%'];
  var ABOUT = only === 'ceremony' ? 'About our ceremony musicians' : 'About our musicians';
  var INTRO = only === 'ceremony'
    ? 'Find live musicians for your wedding ceremony and drinks reception, in Dublin and across Ireland. Browse performer profiles, then tell Wedding Day 2 your date, venue and music preferences. We’ll check availability and help you find suitable options.'
    : 'Find live wedding musicians for your ceremony, drinks reception or Day 2 celebration, in Dublin and across Ireland. Browse performer profiles, then tell WeddingDay2 your date, venue and music preferences. We’ll check availability and help you find suitable options.';
  var WM = '<img class="ml-wm" src="data:image/png;base64,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" alt="" aria-hidden="true">';
  var IMG = 'https://images.squarespace-cdn.com/content/v1/68e3e2b74d7ab5214f499b88/';
  var VENUES_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venues.json';
  var DJ_IMG = '94137cf3-c61b-4326-9a8a-4cd0fc2344de/3.jpg'; // same photo as the DJ card on the home page
  var DJS = [ // the same three options as the home page DJ pop-up
    ["DJ's", '/djs', IMG + '1790699637462-NX43EIAYBZJ73ZH5245J/unsplash-image-ttv1pX6tk7o.jpg?format=750w'],
    ['DJ & Sax', '/saxdj', IMG + 'cca93cb1-94fe-4860-a650-152bf3cd2039/sax+dj%281%29.jpg?format=750w'],
    ['Karaoke', '/dj-karaoke', IMG + '1790699848604-H16VA8BSP7PD0RD8C0KQ/unsplash-image-6_1tYvLLZqo.jpg?format=750w']
  ];

  function render(D) {
    var L = D.eventLabels || {}, ORDER = ['ceremony', 'day2', 'afterdinner'];
    var list = D.musicians.filter(function (o) { return o.live && o.url && o.listed !== false && o.photo && o.events; });
    var rank = function (o) { var i = ORDER_SLUGS.indexOf(o.slug); return i === -1 ? 999 : i; };
    list.sort(function (a, b) { return rank(a) - rank(b); });
    if (only === 'ceremony' && D.ceremonyList) {
      // Ceremony & Reception page: only the hand-picked musicians, in the hand-picked order
      var CL = D.ceremonyList;
      list = list.filter(function (o) { return CL.indexOf(o.slug) !== -1; });
      list.sort(function (a, b) { return CL.indexOf(a.slug) - CL.indexOf(b.slug); });
    } else if (only) {
      list = list.filter(function (o) { return o.events.indexOf(only) !== -1; });
    } else {
      // Solo Musicians page = the "After Dinner | Day 2" tab; ceremony-only musicians live on the other tab
      list = list.filter(function (o) { return o.events.indexOf('day2') !== -1 || o.events.indexOf('afterdinner') !== -1; });
    }
    // The two big tabs under the banner (same idea as DJ / DJ & Sax / Karaoke): each is its own page
    var TABS = [['After Dinner | Day 2', 'Lively sets to get the party going', '/musicians', !only], ['Ceremony | Reception', 'Music for the aisle and the drinks reception', '/ceremony-musicians', only === 'ceremony']];
    var SHARPER = { cathal: 1500, alan: 1500 }; // wide photos cropped into tall cards, so they need the bigger version
    var size = 500; // card-sized photos (about 1.4MB for the whole page, instead of 8MB+)
    var DJC = D.djCard || {}; // same DJ card as on the musician pages
    var filters = [['all', 'Either'], ['day2', L.day2 || 'Day 2'], ['afterdinner', L.afterdinner || 'After dinner']];
    if (only) filters = [['all', 'All'], ['later', 'Also plays Day 2 & after dinner'], ['duo', 'Duo']];
    var h = '<header class="ml-hero"><img src="' + IMG + HERO[0] + '?format=2500w" alt="" style="object-position:' + HERO[1] + '" fetchpriority="high">'
      + '<div class="ml-hero-in"><p class="ml-eye">' + esc(EYE) + '</p><h1>' + esc(H1) + '</h1><p class="ml-lead">' + esc(LEAD) + '</p></div></header>'
      + '<nav class="ml-tabs" aria-label="Solo musicians">' + TABS.map(function (t) { return '<a class="ml-tab' + (t[3] ? ' ml-tab-on" aria-current="page' : '') + '" href="' + t[2] + '"><strong>' + esc(t[0]) + '</strong><span>' + esc(t[1]) + '</span></a>'; }).join('') + '</nav>'
      + '<div class="ml-wrap"><div class="ml-top"><div class="ml-head"><h2>Pick your musician</h2><p class="ml-count" aria-live="polite"></p></div>'
      + (only ? '<div class="ml-pick"><span class="ml-ask">Show</span>'
      + '<div class="ml-chips">' + filters.map(function (f, i) { return '<button type="button" class="ml-chip' + (i ? '' : ' on') + '" data-f="' + f[0] + '" aria-pressed="' + (i ? 'false' : 'true') + '">' + esc(f[1]) + '</button>'; }).join('') + '</div></div>' : '') + '</div><div class="ml-grid">';
    list.forEach(function (o, i) {
      var lp = LIST_PHOTOS[o.slug];
      var ev = ORDER.filter(function (e) { return o.events.indexOf(e) !== -1; });
      // Day 2 and after dinner are one offer now: everyone who plays one plays both
      var tags = only && (ev.indexOf('day2') !== -1 || ev.indexOf('afterdinner') !== -1) ? [['later', 'Day 2 & after dinner']] : [];
      if (only && o.duo) tags.push(['duo', 'Duo']);
      if (only === 'ceremony') tags.unshift(['ceremony', 'Ceremony & reception']);  // every card on this tab says what it is for
      var p = lp ? lp[0] : (o.cardPhoto || o.photo);
      h += '<a class="ml-card" data-slug="' + esc(o.slug) + '" href="' + esc(o.url + (only ? '?for=' + only : '')) + '" data-tags="' + esc(ev.concat(ev.indexOf('day2') !== -1 || ev.indexOf('afterdinner') !== -1 ? ['later'] : []).concat(o.duo ? ['duo'] : []).concat(o.tradBand ? ['tradBand'] : []).join(' ')) + '">'
        + '<div class="ml-img"><img src="' + esc(/^https?:/.test(p) ? p : D.imageBase + p + '?format=' + (SHARPER[o.slug] || size) + 'w') + '" alt="' + esc(o.hideName ? 'Wedding musician' : o.name) + '" loading="' + (i < 4 ? 'eager' : 'lazy') + '" decoding="async"'
        + ' style="object-position:' + esc(lp ? lp[1] : (o.cardPosition || o.photoPosition || 'center')) + '"><span class="ml-tags">' + tags.map(function (t) { return '<span class="ml-tag" data-e="' + t[0] + '">' + esc(t[1]) + '</span>'; }).join('') + '</span>' + WM + (o.hideName ? '' : '<span class="ml-name">' + esc(o.name) + '</span>') + '<span class="ml-more">View profile →</span></div></a>';
    });
    h += '</div><details class="ml-about"><summary>' + esc(ABOUT) + '</summary><p>' + esc(INTRO) + '</p></details><div class="ml-more3"><h2>Explore more</h2><div class="ml-x">'
      + '<a class="ml-xk ml-venue" href="/venues"><span class="ml-xi"></span><strong>Our venues</strong><span class="ml-xp">Find the perfect place for your Day 2</span></a>'
      + '<button type="button" class="ml-xk ml-dj"><span class="ml-xi"><img src="' + IMG + (DJC.image || DJ_IMG) + '?format=750w" alt="" loading="lazy">' + WM + '</span><strong>' + esc(DJC.title || 'Our DJ options') + '</strong><span class="ml-xp">' + esc(DJC.text || 'DJs, DJ & Sax and Karaoke') + '</span></button>'
      + '<a class="ml-xc ml-xg" href="/packages"><span class="ml-xt">Build your own package</span><span class="ml-xs">Pick your musician, add a trad band or DJ, and get an estimated price.</span><span class="ml-xb">Start building <span aria-hidden="true">→</span></span></a>'
      + '</div></div></div>'
      + '<div class="ml-pop" hidden><button type="button" class="ml-pop-x" aria-label="Close">&times;</button><div class="ml-pop-in"><h3>DJ Packages</h3><p>Pick an option to see what\'s available.</p><div class="ml-x">'
      + DJS.map(function (d) { return '<a class="ml-xc" href="' + d[1] + '"><img src="' + d[2] + '" alt="" loading="lazy">' + WM + '<span class="ml-xt">' + d[0] + '</span></a>'; }).join('')
      + '</div></div></div>';
    root.innerHTML = h;
    bleed();
    window.addEventListener('resize', bleed);

    // Cards rise in one after another as they come into view (skipped for people who've asked for less motion)
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    var cards = Array.prototype.slice.call(root.querySelectorAll('.ml-card'));
    var showCards = function (els) {
      els.forEach(function (c, n) { c.style.setProperty('--d', Math.min(n, 7) * 80 + 'ms'); c.classList.add('ml-in'); });
    };
    if (!calm && 'IntersectionObserver' in window) {
      root.classList.add('ml-anim');
      var io = new IntersectionObserver(function (es) {
        var hit = es.filter(function (e) { return e.isIntersecting; }).map(function (e) { io.unobserve(e.target); return e.target; });
        hit.sort(function (a, b) { return cards.indexOf(a) - cards.indexOf(b); });
        showCards(hit);
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      cards.forEach(function (c) { io.observe(c); });
    }
    var replay = function () {
      if (!root.classList.contains('ml-anim')) return;
      var vis = cards.filter(function (c) { return !c.hidden; });
      vis.forEach(function (c) { if (io) io.unobserve(c); c.classList.remove('ml-in'); });
      void root.offsetWidth;
      requestAnimationFrame(function () { showCards(vis); });
    };

    // Stop the site's photo-link script from taking over these links and photos
    var claim = function () { Array.prototype.forEach.call(root.querySelectorAll('a, img, button'), function (el) { el.wd2Wired = true; }); };
    claim();

    // DJ card opens the three DJ options
    var pop = root.querySelector('.ml-pop');
    var closePop = function () { pop.hidden = true; document.body.style.overflow = ''; };
    root.querySelector('.ml-dj').addEventListener('click', function () { pop.hidden = false; document.body.style.overflow = 'hidden'; });
    pop.querySelector('.ml-pop-x').addEventListener('click', closePop);
    pop.addEventListener('click', function (e) { if (e.target === pop) closePop(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) closePop(); });

    // Venue card shows a different random venue each visit
    fetch(VENUES_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (V) {
      var vs = (V.venues || []).filter(function (v) { return String(v.live) !== 'false' && v.listed !== false && v.url && (v.cardImg || v.heroImg); });
      if (!vs.length) return;
      var seenV = []; // skip venues this visitor has already looked at, unless they've seen them all
      try { seenV = JSON.parse(localStorage.getItem('wd2SeenVenues') || '[]'); } catch (e) {}
      var fresh = vs.filter(function (x) { return seenV.indexOf(x.slug) === -1; });
      if (fresh.length) vs = fresh;
      var v = vs[Math.floor(Math.random() * vs.length)], card = root.querySelector('.ml-venue');
      card.href = v.url;
      card.innerHTML = '<span class="ml-xi"><img src="' + esc((V.imageBase || IMG) + (v.cardImg || v.heroImg) + '?format=750w') + '" alt="" loading="lazy">' + WM + '</span><strong>' + esc(v.name) + '</strong><span class="ml-xp">' + esc(v.area || v.county || '') + '</span>';
      claim();
    }).catch(function () {});

    // Say plainly what is being shown, and light up the matching tag on each card
    var FL = {}; filters.forEach(function (f) { FL[f[0]] = f[1]; });
    var tell = function () {
      var on = root.querySelector('.ml-chip.on'), f = on ? on.getAttribute('data-f') : 'all';
      var n = root.querySelectorAll('.ml-card:not([hidden])').length, who = n + ' musician' + (n === 1 ? '' : 's');
      var txt = f === 'all' ? 'Showing all ' + who + (only ? ' for ceremony & drinks reception' : ' for after dinner & Day 2') : only ? who + ': ' + FL[f].charAt(0).toLowerCase() + FL[f].slice(1) : who + ' for <strong>' + esc(FL[f]) + '</strong>';
      root.querySelector('.ml-count').innerHTML = txt;
      Array.prototype.forEach.call(root.querySelectorAll('.ml-tag'), function (t) { var e = t.getAttribute('data-e'); t.classList.toggle('ml-hit', f !== 'all' && (e === f || (f === 'later' && (e === 'day2' || e === 'afterdinner')))); });
    };
    tell();
    Array.prototype.forEach.call(root.querySelectorAll('.ml-chip'), function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-f');
        Array.prototype.forEach.call(root.querySelectorAll('.ml-chip'), function (x) { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        setTimeout(tell, 0);
        // Smooth shuffle: note where every card is, apply the filter, then slide each card from its old spot to its new one
        var smooth = root.classList.contains('ml-anim') && !!root.animate, was = [];
        if (smooth) cards.forEach(function (card) { was.push(card.hidden ? null : card.getBoundingClientRect()); });
        Array.prototype.forEach.call(root.querySelectorAll('.ml-card'), function (card) {
          card.hidden = f !== 'all' && (' ' + card.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') === -1;
        });
        if (!smooth) return replay();
        var ease = 'cubic-bezier(.2,.7,.2,1)', fresh = 0;
        cards.forEach(function (card, n) {
          if (card.hidden) return;
          var im = card.querySelector('.ml-img'), old = was[n], now = card.getBoundingClientRect();
          if (io) io.unobserve(card);
          card.style.setProperty('--d', '0ms');
          card.classList.add('ml-in');
          if (!im) return;
          if (old) {
            var dx = old.left - now.left, dy = old.top - now.top;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) im.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 560, easing: ease });
          } else {
            // cards that weren't showing before fade and grow in, just after the others start moving
            im.animate([{ opacity: 0, transform: 'scale(.88)' }, { opacity: 1, transform: 'none' }], { duration: 440, easing: ease, delay: 140 + Math.min(fresh++, 6) * 50, fill: 'backwards' });
          }
        });
      });
    });
  }

  // Stretch the photo banner edge to edge and up behind the site menu, like the other pages
  function bleed() {
    var hero = root.querySelector('.ml-hero');
    if (!hero) return;
    hero.style.marginLeft = hero.style.marginRight = hero.style.marginTop = hero.style.paddingTop = '';
    var r = root.getBoundingClientRect(), cs = getComputedStyle(root);
    var top = r.top + (window.pageYOffset || 0), vw = document.documentElement.clientWidth;
    var pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0;
    hero.style.marginLeft = -(r.left + pl) + 'px';
    hero.style.marginRight = -(vw - r.right + pr) + 'px';
    hero.style.marginTop = -(top + (parseFloat(cs.paddingTop) || 0)) + 'px';
    hero.style.paddingTop = top + 'px';
  }

  // Paint the whole Squarespace section dark too, so there's no lighter band around the grid
  var sec = root.closest('section');
  if (sec) {
    sec.style.backgroundColor = BG;
    var sb = sec.querySelector('.section-background');
    if (sb) { sb.style.backgroundColor = BG; Array.prototype.forEach.call(sb.children, function (c) { c.style.opacity = '0'; }); }
  }

  // Shimmering placeholder cards while the musician list loads
  root.innerHTML = '<style>@keyframes wd2Shim{0%{background-position:-400px 0}100%{background-position:400px 0}}.wd2-sk{background:' + SURFACE + ' linear-gradient(90deg,rgba(234,230,221,0) 0,rgba(234,230,221,.07) 50%,rgba(234,230,221,0) 100%) no-repeat;background-size:400px 100%;animation:wd2Shim 1.3s ease-in-out infinite;border-radius:14px}@media (prefers-reduced-motion:reduce){.wd2-sk{animation:none}}</style><div class="ml-wrap"><div class="wd2-sk" style="height:44px;width:min(300px,70%);margin-bottom:22px"></div><div class="ml-grid">' + new Array(9).join('<div class="wd2-sk" style="aspect-ratio:3/4;border-radius:16px"></div>') + '</div></div>';

  (window.WD2_MUSICIANS ? Promise.resolve(window.WD2_MUSICIANS) : fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }))
    .then(render)
    .catch(function () { root.innerHTML = '<p style="padding:30px">Musicians could not be loaded. Please refresh the page.</p>'; });
})();

;(function(){if(document.getElementById('wd2-glass-musicians-list'))return;var g=document.createElement('style');g.id='wd2-glass-musicians-list';g.textContent='#musicians-list .ml-chip.on,#musicians-list .ml-tag.ml-hit,#musicians-list .ml-xb{background:linear-gradient(135deg,rgba(120,230,224,.13),rgba(61,194,187,.04)),rgba(14,38,40,.35)!important;-webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);border:1px solid rgba(160,240,235,.26)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -1px 0 rgba(0,0,0,.15),0 4px 14px rgba(0,0,0,.18)!important;color:#dcefec!important}#musicians-list .ml-xb:hover{background:linear-gradient(135deg,rgba(120,230,224,.22),rgba(61,194,187,.08)),rgba(14,38,40,.35)!important;border-color:rgba(160,240,235,.42)!important}#musicians-list .ml-chip.on svg,#musicians-list .ml-tag.ml-hit svg,#musicians-list .ml-xb svg{color:inherit!important}';document.head.appendChild(g);})();
;(function(){var g=document.createElement('style');g.id='ml-chip-row';g.textContent='@media (max-width:520px){#musicians-list .ml-chips{flex-wrap:nowrap!important;gap:6px}#musicians-list .ml-chip{white-space:nowrap;font-size:13px!important;padding:8px 11px!important}#musicians-list .ml-chip.on:before{margin-right:5px}}';document.head.appendChild(g);})();
