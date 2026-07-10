(function () {
  const AD_HTML = `
    <div class="ad-slot">
      <a href="mailto:contacto@evuruguay.com?subject=Quiero%20anunciar%20en%20EVUruguay" title="Anunciate en EVUruguay">
        <img src="/img/publicidad.png" alt="Anunciate en EVUruguay" loading="lazy" />
      </a>
    </div>
  `;

  function ensureBodyClass() {
    document.body.classList.add("instalacion-page");
  }

  function ensureSharedStylesheet() {
    if (document.querySelector('link[href="/evuy-design.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/evuy-design.css";
    document.head.appendChild(link);
  }

  function ensureAdBanners() {
    const root = document.getElementById("root");
    if (!root) return;

    if (!document.querySelector(".ad-banner-wrap.ad-top")) {
      const top = document.createElement("div");
      top.className = "ad-banner-wrap ad-top";
      top.innerHTML = `<span class="ad-label">Publicidad</span>${AD_HTML.replace('loading="lazy"', 'loading="eager"')}`;
      root.before(top);
    }

    if (!document.querySelector(".ad-banner-wrap.ad-bottom")) {
      const bottom = document.createElement("div");
      bottom.className = "ad-banner-wrap ad-bottom";
      bottom.innerHTML = `${AD_HTML}<span class="ad-label">Publicidad</span>`;
      root.after(bottom);
    }
  }

  function buildBrandLink() {
    const link = document.createElement("a");
    link.href = "/";
    link.className = "ev-brand ev-brand-centered";
    link.setAttribute("aria-label", "Ir al inicio de EVUruguay");
    link.innerHTML = '<div class="ev-brand-logo">EV</div><div class="ev-brand-text">EV<span>Uruguay</span></div>';
    return link;
  }

  function replaceSimulatorBadge() {
    const target = Array.from(document.querySelectorAll("span")).find((span) =>
      span.textContent && span.textContent.trim().toLowerCase() === "simulador ev · uruguay"
    );
    if (!target || !target.parentElement || target.parentElement.dataset.evBrandReplaced === "true") return false;

    const badge = target.parentElement;
    badge.dataset.evBrandReplaced = "true";
    badge.replaceChildren(buildBrandLink());
    Object.assign(badge.style, {
      background: "transparent",
      border: "0",
      borderRadius: "0",
      padding: "0",
      marginBottom: "10px",
      justifyContent: "center",
      width: "auto",
      display: "inline-flex"
    });
    return true;
  }

  function enhanceInstallHeader() {
    const root = document.getElementById("root");
    const title = root && root.querySelector("h1");
    if (!title || title.dataset.evHeaderEnhanced === "true") return false;

    title.dataset.evHeaderEnhanced = "true";
    title.classList.add("ev-heading", "ev-heading-xl", "instalacion-tool-title");

    const parent = title.parentElement;
    if (!parent) return true;
    parent.classList.add("ev-page-header", "ev-tool-header", "instalacion-tool-header");

    if (!parent.querySelector(".instalacion-tool-subtitle")) {
      const subtitle = document.createElement("p");
      subtitle.className = "ev-subtitle instalacion-tool-subtitle";
      subtitle.textContent = "Simulá el punto de carga ideal para tu hogar según vehículo, potencia, distancia al tablero, cableado y ubicación.";
      title.insertAdjacentElement("afterend", subtitle);
    }

    const subtitle = parent.querySelector(".instalacion-tool-subtitle");
    if (subtitle && !parent.querySelector(".instalacion-tool-description")) {
      const description = document.createElement("p");
      description.className = "ev-tool-description instalacion-tool-description";
      description.textContent = "Calculá una instalación doméstica compatible con normativa UTE, revisando materiales, protecciones y recomendaciones prácticas antes de avanzar con un técnico.";
      subtitle.insertAdjacentElement("afterend", description);
    }

    const description = parent.querySelector(".instalacion-tool-description");
    if (description && !parent.querySelector(".instalacion-tool-pills")) {
      const pills = document.createElement("div");
      pills.className = "ev-chip-row ev-pill-row instalacion-tool-pills";
      pills.setAttribute("aria-label", "Características del simulador");
      pills.innerHTML = '<div class="ev-pill">Dimensioná <strong>cable y protecciones</strong></div><div class="ev-pill">Estimá <strong>materiales</strong></div><div class="ev-pill">Pensado para <strong>hogares</strong></div>';
      description.insertAdjacentElement("afterend", pills);
    }

    return true;
  }

  function applyEnhancements() {
    ensureBodyClass();
    ensureSharedStylesheet();
    ensureAdBanners();
    return {
      brand: replaceSimulatorBadge(),
      header: enhanceInstallHeader()
    };
  }

  function start() {
    const root = document.getElementById("root");
    const initial = applyEnhancements();
    if (initial.brand && initial.header) return;
    if (!root) return;

    const observer = new MutationObserver(() => {
      const result = applyEnhancements();
      if (result.brand && result.header) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
