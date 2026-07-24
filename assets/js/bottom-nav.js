(function () {
  const SCROLL_RESET_KEY = "evuy-bottom-nav-scroll-reset";

  function scheduleScrollReset() {
    let targetPath;

    try {
      targetPath = window.sessionStorage.getItem(SCROLL_RESET_KEY);
      if (targetPath !== window.location.pathname) return;
      window.sessionStorage.removeItem(SCROLL_RESET_KEY);
    } catch (error) {
      return;
    }

    // iOS can restore the scroll position from the previous page after the
    // new document has started rendering. Reset twice so that a restoration
    // performed during the first frame cannot leave a blank scrollable area.
    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.requestAnimationFrame(() => {
      reset();
      window.requestAnimationFrame(reset);
    });
  }

  function mountBottomNav() {
    if (document.querySelector(".ev-bottom-nav")) return;

    const path = (window.location.pathname || "/").toLowerCase();

    if (path.includes("/brujula")) return;

    const items = [
      {
        id: "inicio",
        label: "Inicio",
        href: "/",
        active: !path.includes("/carga") && !path.includes("/carbuy") && !path.includes("/comparador") && !path.includes("/instalacion") && !path.includes("/brujula"),
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.2 12 4l9 7.2V21a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.8z"/></svg>`
      },
      {
        id: "redes",
        label: "Redes",
        href: "/carga.html",
        active: path.includes("/carga"),
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>`
      },
      {
        id: "comprar",
        label: "Comprar EV",
        href: "/carbuy/recomendador.html",
        active: path.includes("/carbuy"),
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M5 11l1.5-4.5h11L19 11h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-2 0v-1H7v1a1 1 0 0 1-2 0v-1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h1zm2.2-2.5L6.4 11h11.2l-.8-2.5H7.2zM7 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>`
      },
      {
        id: "comparador",
        label: "Comparar",
        href: "/comparador/",
        active: path.includes("/comparador"),
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3v-2H6V5h3V3H6zm9 0v2h3v14h-3v2h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3zM8 8h8v2H8V8zm0 6h8v2H8v-2zm3-12h2v20h-2V2z"/></svg>`
      },
      {
        id: "instalacion",
        label: "Instalación",
        href: "/instalacion/",
        active: path.includes("/instalacion"),
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94L14.7 6.3z"/></svg>`
      },
      {
        id: "brujula",
        label: "Brújula",
        href: "/brujula/",
        active: path.includes("/brujula"),
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.5 5.5-2.5 5-5 2.5 2.5-5 5-2.5zM12 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>`
      }
    ];

    const nav = document.createElement("nav");
    nav.className = "ev-bottom-nav";
    nav.setAttribute("aria-label", "Navegación principal EVUruguay");

    nav.innerHTML = items.map((item) => `
      <a class="ev-bottom-nav-item ${item.active ? "active" : ""}"
         data-nav="${item.id}"
         href="${item.href}"
         aria-label="${item.label}"
         ${item.active ? 'aria-current="page"' : ""}>
        <span class="ev-bottom-nav-icon" aria-hidden="true">${item.icon}</span>
        <span class="ev-bottom-nav-label">${item.label}</span>
      </a>
    `).join("");

    document.body.classList.add("has-ev-bottom-nav");
    document.body.appendChild(nav);

    nav.addEventListener("click", (event) => {
      const link = event.target.closest("a.ev-bottom-nav-item");
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;

      try {
        window.sessionStorage.setItem(SCROLL_RESET_KEY, destination.pathname);
      } catch (error) {
        // Navigation must still work when storage is unavailable.
      }
    });

    // On phones, keep the navigation out of the way while people read, but
    // bring the labels back as soon as they reverse direction.  The small
    // threshold prevents the bar from flickering during natural scroll bounce.
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastScrollY = window.scrollY;
    let isCompact = false;
    let ticking = false;

    function setCompact(compact) {
      if (isCompact === compact) return;
      isCompact = compact;
      nav.classList.toggle("is-compact", compact);
    }

    function updateNavOnScroll() {
      ticking = false;

      if (!mobileQuery.matches || reducedMotionQuery.matches) {
        setCompact(false);
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = Math.max(0, window.scrollY);
      const distance = currentScrollY - lastScrollY;

      if (currentScrollY < 24) {
        setCompact(false);
      } else if (distance > 8) {
        setCompact(true);
      } else if (distance < -8) {
        setCompact(false);
      }

      lastScrollY = currentScrollY;
    }

    function requestNavUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateNavOnScroll);
    }

    window.addEventListener("scroll", requestNavUpdate, { passive: true });
    mobileQuery.addEventListener("change", requestNavUpdate);
    reducedMotionQuery.addEventListener("change", requestNavUpdate);
    requestNavUpdate();
  }

  scheduleScrollReset();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountBottomNav, { once: true });
  } else {
    mountBottomNav();
  }
})();
