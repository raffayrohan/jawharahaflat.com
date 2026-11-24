// Jawhara Riyadh — light effects, no libraries. Transform/opacity only; respects reduced motion.
// Effects: page loading line, scroll progress, scrolled header, reveal-on-scroll.
(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1) Page loading line — gold bar at the very top */
  var loadLine = document.getElementById("loadLine");
  var loadBar = loadLine ? loadLine.querySelector("span") : null;
  if (loadBar) {
    if (reduced) {
      loadBar.style.width = "100%";
      loadLine.classList.add("done");
    } else {
      requestAnimationFrame(function () { loadBar.style.width = "68%"; });
      var finishLoad = function () {
        loadBar.style.width = "100%";
        setTimeout(function () {
          loadLine.classList.add("done");
          setTimeout(function () { if (loadLine.parentNode) loadLine.parentNode.removeChild(loadLine); }, 500);
        }, 250);
      };
      if (document.readyState === "complete") finishLoad();
      else window.addEventListener("load", finishLoad);
    }
  }

  /* 2) Scrolled header state + scroll progress */
  var header = document.querySelector("header");
  var prog = document.querySelector(".progress span");
  var onScroll = function () {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (prog) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 3) Reveal on scroll */
  var els = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window) || reduced) {
    els.forEach(function (e) { e.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();
