(function () {
  function mountTopAppBar() {
    if (document.querySelector(".ev-top-app-bar")) return;

    const bar = document.createElement("header");
    bar.className = "ev-top-app-bar";
    bar.setAttribute("aria-label", "Barra superior EVUruguay");
    bar.innerHTML = `
      <a class="ev-top-app-brand" href="/" aria-label="Ir al inicio de EVUruguay">
        <span class="ev-top-app-logo" aria-hidden="true">EV</span>
        <span class="ev-top-app-name">EV<span>Uruguay</span></span>
      </a>
      <button class="ev-theme-toggle ev-top-app-theme" type="button" data-ev-theme-toggle="true" aria-label="Cambiar entre modo claro y oscuro">
        <span class="icon-light">💡</span>
        <span class="icon-dark">🌙</span>
      </button>
    `;

    document.body.classList.add("has-ev-top-app-bar");
    document.body.prepend(bar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountTopAppBar, { once: true });
  } else {
    mountTopAppBar();
  }
})();
