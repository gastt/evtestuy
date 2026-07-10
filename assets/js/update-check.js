(function () {
  const VERSION_URL = "/version.json";
  const STORAGE_KEY = "evuy-site-version";
  const CHECK_INTERVAL = 10 * 60 * 1000;
  let refreshing = false;
  let bubble = null;

  function safeStorage(method, key, value) {
    try {
      if (method === "get") return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (error) {
      return null;
    }
    return null;
  }

  async function clearAppCaches() {
    if (!("caches" in window)) return;
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("evuruguay-")).map((key) => caches.delete(key)));
  }

  async function requestServiceWorkerUpdate() {
    if (!("serviceWorker" in navigator)) return;
    const registration = await navigator.serviceWorker.getRegistration("/");
    if (!registration) return;
    await registration.update();
    const waiting = registration.waiting || registration.installing;
    if (waiting) waiting.postMessage({ type: "SKIP_WAITING" });
  }

  function reloadFresh() {
    if (refreshing) return;
    refreshing = true;
    Promise.all([clearAppCaches(), requestServiceWorkerUpdate()])
      .catch(() => undefined)
      .finally(() => window.location.reload());
  }

  function showUpdateBubble(version) {
    if (bubble || document.querySelector(".ev-update-bubble")) return;
    bubble = document.createElement("section");
    bubble.className = "ev-update-bubble";
    bubble.setAttribute("role", "status");
    bubble.setAttribute("aria-live", "polite");
    bubble.innerHTML = `
      <div class="ev-update-bubble-icon" aria-hidden="true">↻</div>
      <div class="ev-update-bubble-copy">
        <strong>Nueva versión disponible</strong>
        <span>Actualizá EVUruguay para ver los últimos cambios.</span>
      </div>
      <button class="ev-update-bubble-action" type="button">Actualizar</button>
      <button class="ev-update-bubble-close" type="button" aria-label="Cerrar aviso">×</button>
    `;
    bubble.querySelector(".ev-update-bubble-action").addEventListener("click", () => {
      safeStorage("set", STORAGE_KEY, version);
      reloadFresh();
    });
    bubble.querySelector(".ev-update-bubble-close").addEventListener("click", () => {
      bubble.remove();
      bubble = null;
    });
    document.body.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add("visible"));
  }

  async function checkVersion() {
    const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    if (!response.ok) return;
    const data = await response.json();
    const version = String(data.version || data.updatedAt || "").trim();
    if (!version) return;

    const previous = safeStorage("get", STORAGE_KEY);
    if (!previous) {
      safeStorage("set", STORAGE_KEY, version);
      return;
    }

    if (previous !== version) {
      showUpdateBubble(version);
    }
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) window.location.reload();
    });
  }

  function start() {
    checkVersion().catch(() => undefined);
    setInterval(() => checkVersion().catch(() => undefined), CHECK_INTERVAL);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
