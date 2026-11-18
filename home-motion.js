/* Wedding Day 2 home page movement
   Loaded on every page from the site footer code, but only does anything on the home page.
   - the heading comes in word by word, then the button and the "Build your own package" card
   - the big background photo drifts very slowly
   - the four service photos, the "Why book with us" points and the booking form rise in as you scroll to them
   People who have asked their device for less motion get the page exactly as before. */
(function () {
  var html = document.documentElement;
  var done = function () { html.classList.remove('wd2m-pre'); };
  if (window.wd2HomeMotion || !document.body || !document.body.classList.contains('homepage')) return done();
  window.wd2HomeMotion = true;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var secs = Array.prototype.slice.call(document.querySelectorAll('section.page-section'));
  if (calm || !('IntersectionObserver' in window) || !secs.length) return done();

  var st = document.createElement('style');
  st.textContent = [
    '.wd2m{opacity:0;transform:translateY(30px);transition:opacity .7s ease var(--wd,0ms),transform .9s cubic-bezier(.2,.7,.2,1) var(--wd,0ms);will-change:opacity,transform}',
    '.wd2m.wd2m-right{transform:translateX(46px)}',
    '.wd2m.wd2m-zoom{transform:translateY(34px) scale(.94)}',
    '.wd2m.wd2m-in{opacity:1;transform:none}',
    '.wd2m-w{display:inline-block;opacity:0;transform:translateY(.55em) rotate(2deg);transition:opacity .6s ease var(--wd,0ms),transform .8s cubic-bezier(.2,.7,.2,1) var(--wd,0ms)}',
    '.wd2m-in .wd2m-w,.wd2m-w.wd2m-in{opacity:1;transform:none}',
    '.wd2m-kb{animation:wd2mDrift 26s ease-in-out infinite alternate;transform-origin:50% 40%}',
    '@keyframes wd2mDrift{from{transform:scale(1)}to{transform:scale(1.09) translate3d(-1.2%,-1%,0)}}',
    '.wd2-why-item svg,.wd2-why-item img{transition:transform .6s cubic-bezier(.3,1.5,.5,1) calc(var(--wd,0ms) + 200ms)}',
    '.wd2-why-item.wd2m:not(.wd2m-in) svg,.wd2-why-item.wd2m:not(.wd2m-in) img{transform:scale(.4) rotate(-20deg)}'
  ].join('');
  document.head.appendChild(st);

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add('wd2m-in');
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  function mark(el, delay, kind) {
    if (!el || el.classList.contains('wd2m')) return;
    el.classList.add('wd2m');
    if (kind) el.classList.add(kind);
    el.style.setProperty('--wd', (delay || 0) + 'ms');
    io.observe(el);
  }
  var inner = function (b) { return b && (b.querySelector('.sqs-block-content') || b); };

  // 1. Top of the page
  var hero = secs[0];
  var heroBg = hero.querySelector('.section-background img');
  if (heroBg) heroBg.classList.add('wd2m-kb');
  var h1 = hero.querySelector('h1');
  var n = 0;
  if (h1) {
    // split the heading into words so they can come in one after another
    var walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null), texts = [], t;
    while ((t = walker.nextNode())) texts.push(t);
    texts.forEach(function (node) {
      var parts = node.nodeValue.split(/(\s+)/), frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span');
        s.className = 'wd2m-w'; s.textContent = p;
        s.style.setProperty('--wd', (150 + n++ * 85) + 'ms');
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    h1.classList.add('wd2m-h');
  }
  var after = 150 + n * 85;
  Array.prototype.forEach.call(hero.querySelectorAll('.sqs-block'), function (b) {
    if (h1 && b.contains(h1)) return;
    if (b.querySelector('.wd2-byp')) mark(inner(b), after + 260, 'wd2m-right');
    else mark(inner(b), after + 80);
  });
  // show the words on the next frame, once the starting position has been painted
  requestAnimationFrame(function () {
    done();
    requestAnimationFrame(function () { if (h1) h1.classList.add('wd2m-in'); });
  });

  // 2. Everything further down rises in as it scrolls into view
  secs.slice(1).forEach(function (sec) {
    var why = sec.querySelector('.wd2-why');
    if (why) {
      mark(why.querySelector('.wd2-why-h'), 0);
      Array.prototype.forEach.call(why.querySelectorAll('.wd2-why-item'), function (it, i) { mark(it, 120 + i * 130); });
      mark(why.querySelector('.wd2-why-btn'), 200, 'wd2m-right');
      return;
    }
    var blocks = Array.prototype.slice.call(sec.querySelectorAll('.sqs-block'));
    var pics = blocks.filter(function (b) { return b.classList.contains('sqs-block-image'); });
    blocks.forEach(function (b, i) {
      var p = pics.indexOf(b);
      if (p !== -1) mark(inner(b), p * 120, 'wd2m-zoom');
      else mark(inner(b), Math.min(i, 3) * 120);
    });
  });
})();
