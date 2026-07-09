(function () {
  const iconAttrs = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const icons = {
    inicio: `<svg ${iconAttrs} aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h5v-5h4v5h5v-9.5"/></svg>`,
    redes: `<svg ${iconAttrs} aria-hidden="true"><path d="M12 21s7-5.6 7-12a7 7 0 0 0-14 0c0 6.4 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
    comprar: `<svg ${iconAttrs} aria-hidden="true"><path d="M5 11 7 6h10l2 5"/><path d="M4 11h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2"/><path d="M6 18H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1"/><path d="M7 18h10"/><circle cx="7" cy="15" r="2"/><circle cx="17" cy="15" r="2"/></svg>`,
    instalacion: `<svg ${iconAttrs} aria-hidden="true"><path d="M14.7 6.3a4.5 4.5 0 0 0 5 5L11 20a2.8 2.8 0 0 1-4-4l8.7-8.7Z"/><path d="m16 5 3 3"/><path d="M7.5 17.5h.01"/></svg>`,
    brujula: `<svg ${iconAttrs} aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>`
  };

  const navItems = [
    { key: "inicio", label: "Inicio", href: "/", icon: icons.inicio, match: (path) => path === "/" || path === "/index.html" || (path.endsWith("/index.html") && !path.includes("/brujula/") && !path.includes("/instalacion/")) },
    { key: "redes", label: "Redes", href: "/carga.html", icon: icons.redes, match: (path) => path.includes("/carga") },
    { key: "comprar", label: "Comprar EV", href: "/carbuy/recomendador.html", icon: icons.comprar, match: (path) => path.includes("/carbuy") },
    { key: "instalacion", label: "Instalación", href: "/instalacion/", icon: icons.instalacion, match: (path) => path.includes("/instalacion") },
    { key: "brujula", label: "Brújula", href: "/brujula/", icon: icons.brujula, match: (path) => path.includes("/brujula") }
  ];

  function mountBottomNav() {
    const path = (window.location.pathname || "/").toLowerCase();

    if (path.includes("/brujula")) return;
    if (document.querySelector(".ev-bottom-nav")) return;

    const nav = document.createElement("nav");
    nav.className = "ev-bottom-nav";
    nav.setAttribute("aria-label", "Navegación principal");

    nav.innerHTML = navItems.map((item) => {
      const active = item.match(path);
      return `
        <a class="ev-bottom-nav-item${active ? " active" : ""}" href="${item.href}" aria-label="${item.label}"${active ? ' aria-current="page"' : ""} data-nav="${item.key}">
          <span class="ev-bottom-nav-icon" aria-hidden="true">${item.icon}</span>
          <span class="ev-bottom-nav-label">${item.label}</span>
        </a>`;
    }).join("");

    document.body.classList.add("has-ev-bottom-nav");
    document.body.appendChild(nav);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountBottomNav, { once: true });
  } else {
    mountBottomNav();
  }
})();
