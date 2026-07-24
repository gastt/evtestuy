(function () {
  // Part A — runs immediately, no DOM dependency. Ported from
  // assets/glass/glass-element.js's own browser-sniffing heuristic: only
  // Chromium engines reliably support SVG filters inside backdrop-filter.
  function detectSVGFilterSupport() {
    var testElement = document.createElement("div");
    testElement.style.backdropFilter = "blur(1px)";

    if (!testElement.style.backdropFilter) return false;

    var userAgent = navigator.userAgent.toLowerCase();

    // Every browser on iOS/iPadOS (Safari, Chrome/CriOS, Firefox/FxiOS, Edge/EdgiOS...)
    // is required by Apple to run on WebKit under the hood, regardless of its name or
    // icon, and WebKit does not support SVG filters inside backdrop-filter. Without this
    // check, "crios" below would be misread as real Chrome and get a filter WebKit
    // silently drops, leaving no blur and no glass at all.
    var isIOS = /iphone|ipad|ipod/.test(userAgent) ||
      (userAgent.indexOf("mac") !== -1 && navigator.maxTouchPoints > 1);
    if (isIOS) return false;

    var isChrome = /chrome|chromium|crios|edg/.test(userAgent) && !/firefox|fxios/.test(userAgent);
    var isFirefox = /firefox|fxios/.test(userAgent);
    var isSafari = /safari/.test(userAgent) && !/chrome|chromium|crios|edg/.test(userAgent);

    if (isChrome) return true;
    if (isFirefox || isSafari) return false;

    try {
      testElement.style.backdropFilter = "url(#test)";
      return testElement.style.backdropFilter.indexOf("url") !== -1;
    } catch (error) {
      return false;
    }
  }

  var supportsSVGGlass = detectSVGFilterSupport();
  document.documentElement.classList.toggle("ev-glass-svg", supportsSVGGlass);

  // Browsers without SVG backdrop-filter support keep the plain CSS blur
  // approximation already defined in evuy-design.css — nothing else to do.
  if (!supportsSVGGlass) return;

  // Part B — needs the shared top bar / bottom nav to exist in the DOM.
  // top-app-bar.js and bottom-nav.js are loaded (deferred) before this
  // script and mount synchronously, so by the time this file runs the
  // elements are normally already present; DOMContentLoaded is a fallback.
  function applyGlass(el, options) {
    if (!el || !window.DisplacementUtils) return;

    var rect = el.getBoundingClientRect();
    var width = Math.ceil(rect.width);
    var height = Math.ceil(rect.height);
    if (width < 2 || height < 2) return;

    var radius = parseFloat(getComputedStyle(el).borderRadius) || 0;
    var depth = (options && options.depth) || 6;
    var strength = (options && options.strength) || 70;
    var chromaticAberration = (options && options.chromaticAberration) || 1;

    var filterUrl = window.DisplacementUtils.getDisplacementFilter({
      height: height,
      width: width,
      radius: radius,
      depth: depth,
      strength: strength,
      chromaticAberration: chromaticAberration
    });

    var value = "url('" + filterUrl + "') blur(4px) saturate(1.5) brightness(1.05)";
    el.style.backdropFilter = value;
    el.style.webkitBackdropFilter = value;
  }

  function clearGlass(el) {
    if (!el) return;
    el.style.backdropFilter = "";
    el.style.webkitBackdropFilter = "";
  }

  function mountAll() {
    if (!window.DisplacementUtils) return;

    var topBar = document.querySelector(".ev-top-app-bar");
    var bottomNav = document.querySelector(".ev-bottom-nav");

    function recalcTopBar() {
      if (!topBar) return;
      // Brújula's compass layout keeps its top bar static/transparent —
      // never apply the glass filter there.
      if (document.documentElement.classList.contains("has-ev-compass-top-app-bar")) {
        clearGlass(topBar);
        return;
      }
      applyGlass(topBar);
    }

    function recalcBottomNav() {
      applyGlass(bottomNav);
    }

    function recalcAll() {
      recalcTopBar();
      recalcBottomNav();
    }

    recalcAll();

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recalcAll, 120);
    });

    var orientationQuery = window.matchMedia("(orientation: portrait)");
    if (orientationQuery.addEventListener) {
      orientationQuery.addEventListener("change", recalcAll);
    }

    if (bottomNav) {
      // The bottom nav toggles a `is-compact` class on scroll (bottom-nav.js)
      // which animates its width/border-radius — recompute the displacement
      // map for both the immediate class flip and once the transition ends,
      // so the map matches the final compact/expanded geometry.
      var classObserver = new MutationObserver(recalcBottomNav);
      classObserver.observe(bottomNav, { attributes: true, attributeFilter: ["class"] });

      bottomNav.addEventListener("transitionend", function (event) {
        if (event.target !== bottomNav) return;
        if (event.propertyName === "width" || event.propertyName === "border-radius") {
          recalcBottomNav();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll, { once: true });
  } else {
    mountAll();
  }
})();
