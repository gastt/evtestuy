(function () {
  function mountBottomNav() {
    if (document.querySelector(".ev-bottom-nav")) return;

    const path = (window.location.pathname || "/").toLowerCase();

    const items = [
      {
        id: "inicio",
        label: "Inicio",
        href: "/",
        active: !path.includes("/carga") && !path.includes("/carbuy") && !path.includes("/instalacion") && !path.includes("/brujula"),
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountBottomNav, { once: true });
  } else {
    mountBottomNav();
  }
})();
