(function () {
  const STORAGE_KEY = "evuy-install-bubble-dismissed-at";
  const DISMISS_DAYS = 14;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isIos = /iphone|ipad|ipod/i.test(ua) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  const isSafari = /^((?!chrome|android|crios|fxios|edg|opr).)*safari/i.test(ua);
  const isChromeLike = /chrome|crios|edg|opr|samsungbrowser/i.test(ua);
  let deferredPrompt = null;
  let bubble = null;

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function isDismissed() {
    try {
      const value = Number(localStorage.getItem(STORAGE_KEY) || 0);
      if (!value) return false;
      return Date.now() - value < DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch (error) {
      return false;
    }
  }

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (error) {}
    if (bubble) bubble.remove();
    bubble = null;
  }

  function instructions() {
    if (isIos) {
      return {
        title: "Instalá EVUruguay en tu iPhone",
        text: "Abrilo como app, sin buscar la página cada vez.",
        action: "Ver pasos",
        steps: ["Tocá Compartir", "Elegí Agregar a pantalla de inicio", "Confirmá con Agregar"]
      };
    }

    if (isAndroid) {
      return {
        title: "Instalá EVUruguay en Android",
        text: isChromeLike ? "Guardalo como app desde tu navegador." : "Buscá la opción de instalar o agregar al inicio en el menú del navegador.",
        action: deferredPrompt ? "Instalar" : "Ver cómo",
        steps: ["Abrí el menú del navegador", "Tocá Instalar app o Agregar a pantalla principal", "Confirmá la instalación"]
      };
    }

    if (isSafari) {
      return {
        title: "Agregá EVUruguay al Dock",
        text: "En Safari podés guardar esta web como app.",
        action: "Ver pasos",
        steps: ["Abrí el menú Archivo", "Elegí Agregar al Dock", "Confirmá el nombre EVUruguay"]
      };
    }

    return {
      title: "Instalá EVUruguay",
      text: "Tené la calculadora y herramientas EV siempre a mano.",
      action: deferredPrompt ? "Instalar" : "Ver cómo",
      steps: ["Abrí el menú del navegador", "Elegí Instalar EVUruguay", "Confirmá la instalación"]
    };
  }

  function toggleSteps() {
    if (!bubble) return;
    bubble.classList.toggle("show-steps");
  }

  async function install() {
    if (!deferredPrompt) {
      toggleSteps();
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    dismiss();
  }

  function renderBubble(force) {
    if (bubble || isStandalone() || isDismissed()) return;
    if (!force && !isIos && !isAndroid && !isSafari && !deferredPrompt) return;

    const copy = instructions();
    bubble = document.createElement("section");
    bubble.className = "ev-install-bubble";
    bubble.setAttribute("role", "dialog");
    bubble.setAttribute("aria-label", "Instalar EVUruguay como webapp");
    bubble.innerHTML = `
      <button class="ev-install-bubble-close" type="button" aria-label="No mostrar por ahora">×</button>
      <div class="ev-install-bubble-icon" aria-hidden="true">EV</div>
      <div class="ev-install-bubble-body">
        <strong>${copy.title}</strong>
        <span>${copy.text}</span>
        <ol>${copy.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
      </div>
      <button class="ev-install-bubble-action" type="button">${copy.action}</button>
    `;

    bubble.querySelector(".ev-install-bubble-close").addEventListener("click", dismiss);
    bubble.querySelector(".ev-install-bubble-action").addEventListener("click", install);
    document.body.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add("visible"));
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    renderBubble(true);
  });

  window.addEventListener("appinstalled", dismiss);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(() => renderBubble(false), 1600), { once: true });
  } else {
    setTimeout(() => renderBubble(false), 1600);
  }
})();
