/* Wedding Day 2 menu helper (loaded on every page from the site footer code).
   Takes "Ceremony & Reception" out of the Entertainment drop-down, on computers and in the phone menu.
   That page is now reached from the two big tabs on the Solo Musicians page
   (After Dinner | Day 2 and Ceremony | Reception). To put the menu line back, empty this file. */
(function () {
  if (window.wd2NavSolo) return;
  window.wd2NavSolo = true;
  function tidy() {
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll('#header a[href="/ceremony-musicians"], #header a[href="/ceremony-musicians/"], .header-menu a[href="/ceremony-musicians"], .header-menu a[href="/ceremony-musicians/"]'), function (a) {
      var item = a.closest('.header-nav-folder-item, .header-menu-nav-item') || a;
      item.style.display = 'none';
      n++;
    });
    return n;
  }
  var tries = 0, t = setInterval(function () { tidy(); if (++tries > 10) clearInterval(t); }, 400);
  tidy();
})();
