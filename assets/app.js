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

  /* 3) Gallery lightbox — popup card with animation, arrows and keyboard */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");
    var figs = Array.prototype.slice.call(document.querySelectorAll(".gal-grid figure"));
    var cur = 0;
    var show = function (i) {
      cur = (i + figs.length) % figs.length;
      var img = figs[cur].querySelector("img");
      lbImg.src = img.getAttribute("data-full") || img.src;
      lbImg.alt = img.alt;
      var cap = figs[cur].querySelector("figcaption");
      lbCap.textContent = cap ? cap.textContent : img.alt;
    };
    figs.forEach(function (f, i) {
      f.addEventListener("click", function () { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; });
    });
    var close = function () { lb.classList.remove("open"); document.body.style.overflow = ""; };
    lb.querySelector(".x").addEventListener("click", close);
    lb.querySelector(".prev").addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
    lb.querySelector(".next").addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(cur + (document.documentElement.dir === "rtl" ? -1 : 1));
      if (e.key === "ArrowLeft") show(cur + (document.documentElement.dir === "rtl" ? 1 : -1));
    });
  }

  /* 4) Service quick-view popup (homepage cards) */
  var pop = document.getElementById("svcPop");
  if (pop) {
    var pImg = pop.querySelector("img");
    var pTitle = pop.querySelector("h3");
    var pDesc = pop.querySelector("p");
    var pLink = pop.querySelector(".svc-link");
    document.querySelectorAll(".svc-open").forEach(function (b) {
      b.addEventListener("click", function () {
        pImg.src = b.getAttribute("data-img");
        pImg.alt = b.getAttribute("data-title");
        pTitle.textContent = b.getAttribute("data-title");
        pDesc.textContent = b.getAttribute("data-desc");
        pLink.href = b.getAttribute("data-link");
        pop.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    var pClose = function () { pop.classList.remove("open"); document.body.style.overflow = ""; };
    pop.querySelector(".svc-x").addEventListener("click", pClose);
    pop.addEventListener("click", function (e) { if (e.target === pop) pClose(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && pop.classList.contains("open")) pClose(); });
  }

  /* 5) Reveal on scroll */
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
