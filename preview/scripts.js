/* TRAVERSE: one route through a life. All enhancements are defensive. */
(function () {
  "use strict";

  var docEl = document.documentElement;
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function initTheme() {
    var toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;
    function sync() {
      var dark = docEl.classList.contains("dark-mode");
      document.body.classList.toggle("dark-mode", dark);
      toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    }
    sync();
    toggle.addEventListener("click", function () {
      docEl.classList.toggle("dark-mode");
      try { localStorage.setItem("darkMode", docEl.classList.contains("dark-mode") ? "true" : "false"); } catch (_) {}
      sync();
    });
  }

  function initSkipLink() {
    var main = document.getElementById("main");
    if (!main) return;
    var skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.setAttribute("data-decorative", "");
    skip.textContent = "Skip to content";
    document.body.insertBefore(skip, document.body.firstChild);
  }

  function initCollapsibles() {
    Array.prototype.forEach.call(document.querySelectorAll(".collapsible"), function (button) {
      var content = button.nextElementSibling;
      if (!content) return;
      content.hidden = true;
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", function () {
        content.hidden = !content.hidden;
        button.setAttribute("aria-expanded", content.hidden ? "false" : "true");
      });
    });
  }

  function initGallery() {
    var gallery = document.querySelector(".gallery");
    if (!gallery) return;
    var slides = gallery.querySelectorAll(".slide");
    if (!slides.length) return;
    slides.forEach(function (slide) { slide.hidden = false; });
  }

  function initChart() {
    var main = document.getElementById("main");
    if (!main) return;
    var entries = main.querySelectorAll(".entry");
    if (!entries.length) return;

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "route-map");
    svg.setAttribute("viewBox", "0 0 1000 1000");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("data-decorative", "");
    svg.setAttribute("aria-hidden", "true");

    var route = document.createElementNS(svgNS, "path");
    route.setAttribute("data-route", "");
    route.setAttribute("d", "M420,-20 C420,80 690,90 690,205 S250,290 300,420 S740,510 630,650 S250,745 420,1020");
    svg.appendChild(route);

    var secondary = document.createElementNS(svgNS, "path");
    secondary.setAttribute("class", "secondary");
    secondary.setAttribute("d", "M0,165 L1000,165 M0,505 L1000,505 M0,835 L1000,835");
    svg.appendChild(secondary);
    document.body.appendChild(svg);

    var marker = document.createElement("span");
    marker.className = "route-marker";
    marker.setAttribute("data-decorative", "");
    marker.setAttribute("aria-hidden", "true");
    document.body.appendChild(marker);

    var readout = document.createElement("span");
    readout.className = "coordinate-readout";
    readout.setAttribute("data-decorative", "");
    readout.setAttribute("aria-hidden", "true");
    document.body.appendChild(readout);

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;
    function position() {
      ticking = false;
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      var p = Math.min(1, Math.max(0, scrollY / max));
      var len = route.getTotalLength();
      var point = route.getPointAtLength(len * p);
      marker.style.left = (point.x / 10) + "vw";
      marker.style.top = (point.y / 10) + "vh";
      var north = (13.75 + p * 7.33).toFixed(3);
      var east = (100.50 - p * 11.8).toFixed(3);
      readout.textContent = "FIX " + north + "N / " + east + "E";
    }
    function requestPosition() {
      if (ticking) return;
      ticking = true;
      if (reduce) window.setTimeout(position, 80);
      else requestAnimationFrame(position);
    }
    addEventListener("scroll", requestPosition, { passive: true });
    addEventListener("resize", requestPosition);
    position();
  }

  ready(function () {
    initTheme();
    initSkipLink();
    initCollapsibles();
    initGallery();
    initChart();
  });
})();
