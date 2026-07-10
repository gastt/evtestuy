(function () {
  const STORAGE_KEY = "ev-theme";
  const root = document.documentElement;
  const path = (window.location.pathname || "/").toLowerCase();

  function readStoredTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function writeStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore private-mode/storage-disabled errors.
    }
  }

  function defaultTheme() {
    return path.includes("/brujula") ? "dark" : "light";
  }

  function updateThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#06120d" : "#f1f9f5");
  }

  function updateToggleLabels(theme) {
    const compassToggle = document.getElementById("themeBtn");
    if (compassToggle) compassToggle.textContent = theme === "dark" ? "🌙" : "☀️";

    document.querySelectorAll(".ev-theme-toggle").forEach((button) => {
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      button.setAttribute("title", theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    });
  }

  function applyTheme(theme, persist) {
    const normalized = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", normalized);
    updateThemeColor(normalized);
    if (persist) writeStoredTheme(normalized);
    updateToggleLabels(normalized);
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function toggleTheme() {
    applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
  }

  function createToggleButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ev-theme-toggle ev-theme-toggle-shared";
    button.setAttribute("aria-label", "Cambiar entre modo claro y oscuro");
    button.setAttribute("data-ev-theme-toggle", "true");
    button.innerHTML = '<span class="icon-light">💡</span><span class="icon-dark">🌙</span>';
    document.body.appendChild(button);
    updateToggleLabels(currentTheme());
  }

  function ensureThemeToggle() {
    if (!document.body) return;
    if (path.includes("/instalacion")) {
      updateToggleLabels(currentTheme());
      return;
    }
    if (document.querySelector("#themeToggle, #themeBtn, .ev-theme-toggle")) {
      updateToggleLabels(currentTheme());
      return;
    }
    createToggleButton();
  }

  applyTheme(readStoredTheme() || defaultTheme(), false);

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("#themeToggle, #themeBtn, [data-ev-theme-toggle]");
    if (!toggle) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    toggleTheme();
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureThemeToggle, { once: true });
  } else {
    ensureThemeToggle();
  }

  window.EVUYTheme = {
    apply: (theme) => applyTheme(theme, true),
    current: currentTheme,
    toggle: toggleTheme
  };
})();
