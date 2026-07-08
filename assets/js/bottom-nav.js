(function () {
  const navItems = [
    { key: "inicio", label: "Inicio", href: "/", icon: "🏠", match: (path) => path === "/" || path === "/index.html" || path.endsWith("/index.html") && !path.includes("/brujula/") && !path.includes("/instalacion/") },
    { key: "redes", label: "Redes", href: "/carga.html", icon: "📍", match: (path) => path.includes("/carga") },
    { key: "comprar", label: "Comprar EV", href: "/carbuy/recomendador.html", icon: "🚗", match: (path) => path.includes("/carbuy") },
    { key: "instalacion", label: "Instalación", href: "/instalacion/", icon: "🔧", match: (path) => path.includes("/instalacion") },
    { key: "brujula", label: "Brújula", href: "/brujula/", icon: "🧭", match: (path) => path.includes("/brujula") }
  ];

  function mountBottomNav() {
    if (document.querySelector(".ev-bottom-nav")) return;

    const path = (window.location.pathname || "/").toLowerCase();
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
