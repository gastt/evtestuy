(function () {
  function mountTopAppBar() {
    if (document.querySelector(".ev-top-app-bar")) return;

    const path = (window.location.pathname || "/").toLowerCase();
    const isCompass = path.includes("/brujula");
    const bar = document.createElement("header");
    bar.className = "ev-top-app-bar";
    bar.setAttribute("aria-label", "Barra superior EVUruguay");
    bar.innerHTML = `
      <a class="ev-top-app-brand" href="/" aria-label="Ir al inicio de EVUruguay">
        <span class="ev-top-app-logo" aria-hidden="true">EV</span>
        <span class="ev-top-app-name">EV<span>Uruguay</span></span>
      </a>
      <div class="ev-top-app-actions"></div>
    `;

    const actions = bar.querySelector(".ev-top-app-actions");

    if (isCompass) {
      document.documentElement.classList.add("has-ev-compass-top-app-bar");
      document.body.classList.add("has-ev-compass-top-app-bar");

      const legacyActions = document.querySelectorAll(".topbar .top-right > *");
      legacyActions.forEach((control) => {
        control.classList.add("ev-top-app-action");
        if (control.id === "themeBtn") control.classList.add("ev-top-app-theme");
        if (control.matches('a[href*="evuruguay.com"], a[data-nav="inicio"]')) {
          control.setAttribute("href", "/");
          control.setAttribute("aria-label", "Ir al inicio");
          control.setAttribute("data-nav", "inicio");
          control.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 11.2 12 4l9 7.2V21a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.8z" fill="currentColor"/>
            </svg>
          `;
        }
        actions.appendChild(control);
      });
    } else {
      actions.innerHTML = `
        <button class="ev-theme-toggle ev-top-app-theme" type="button" data-ev-theme-toggle="true" aria-label="Cambiar entre modo claro y oscuro">
          <span class="icon-light">💡</span>
          <span class="icon-dark">🌙</span>
        </button>
      `;
    }

    document.body.classList.add("has-ev-top-app-bar");

    if (isCompass) {
      const legacyTopbar = document.querySelector(".topbar");
      const app = document.querySelector(".app");
      if (legacyTopbar) {
        legacyTopbar.replaceWith(bar);
      } else if (app) {
        app.prepend(bar);
      } else {
        document.body.prepend(bar);
      }
      return;
    }

    document.body.prepend(bar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountTopAppBar, { once: true });
  } else {
    mountTopAppBar();
  }
})();
