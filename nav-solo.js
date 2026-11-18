/* Wedding Day 2 menu: "Solo Musicians" in the Entertainment drop-down opens a second level
     After Dinner | Day 2   -> /musicians
     Ceremony | Reception   -> /ceremony-musicians
   (computer menu only; the phone menu keeps "Solo Musicians" and "Ceremony & Reception" as two separate lines).
   Loaded on every page from the site footer code. */
(function () {
  if (window.wd2NavSolo) return;
  var SUB = [['After Dinner | Day 2', '/musicians'], ['Ceremony | Reception', '/ceremony-musicians']];
  function build() {
    var done = false;
    Array.prototype.forEach.call(document.querySelectorAll('#header .header-nav-folder-content'), function (folder) {
      var solo = null, cer = null;
      Array.prototype.forEach.call(folder.querySelectorAll('.header-nav-folder-item > a'), function (a) {
        var h = (a.getAttribute('href') || '').replace(/\/$/, '');
        if (h === '/musicians') solo = a; else if (h === '/ceremony-musicians') cer = a;
      });
      if (!solo || solo.parentNode.querySelector('.wd2-sub')) return;
      var item = solo.parentNode, box = document.createElement('div');
      item.classList.add('wd2-has-sub');
      box.className = 'wd2-sub';
      SUB.forEach(function (s) { var a = document.createElement('a'); a.href = s[1]; a.textContent = s[0]; box.appendChild(a); });
      item.appendChild(box);
      solo.insertAdjacentHTML('beforeend', '<span class="wd2-sub-arr" aria-hidden="true">›</span>');
      solo.setAttribute('aria-haspopup', 'true');
      if (cer) cer.parentNode.style.display = 'none';  // it now lives under Solo Musicians
      done = true;
    });
    return done;
  }
  var st = document.createElement('style');
  st.textContent = '#header .header-nav-folder-item.wd2-has-sub{position:relative}'
    + '#header .wd2-sub{position:absolute;left:calc(100% - 16px);top:0;display:flex;flex-direction:column;white-space:nowrap;z-index:6;opacity:0;visibility:hidden;transform:translateX(-10px);transition:opacity .2s ease,transform .25s cubic-bezier(.2,.7,.2,1),visibility 0s linear .25s}'
    + '#header .wd2-has-sub:hover>.wd2-sub,#header .wd2-has-sub:focus-within>.wd2-sub{opacity:1;visibility:visible;transform:none;transition-delay:0s}'
    + '#header .wd2-sub-arr{display:inline-block;margin-left:8px;transition:transform .25s ease}'
    + '#header .wd2-has-sub:hover .wd2-sub-arr{transform:translateX(4px)}';
  document.head.appendChild(st);
  window.wd2NavSolo = true;
  if (!build()) { var n = 0, t = setInterval(function () { if (build() || ++n > 20) clearInterval(t); }, 300); }
})();
