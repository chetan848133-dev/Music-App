(() => {
  const STORAGE_KEY = "tunewaveTheme";
  const DEFAULT_THEME = "dark";
  let autoTimer = null;

  function normalizeTheme(theme) {
    return theme === "light" || theme === "auto" ? theme : "dark";
  }

  function resolveAutoTheme(date = new Date()) {
    const hours = date.getHours();
    return hours >= 18 || hours < 6 ? "dark" : "light";
  }

  function getAppliedTheme(themeMode) {
    return themeMode === "auto" ? resolveAutoTheme() : themeMode;
  }

  function getTheme() {
    try {
      return normalizeTheme(window.localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME);
    } catch (error) {
      return DEFAULT_THEME;
    }
  }

  function syncAutoTheme() {
    const mode = getTheme();
    if (mode !== "auto") return;
    const appliedTheme = getAppliedTheme(mode);
    document.body.dataset.theme = appliedTheme;
    document.documentElement.dataset.theme = appliedTheme;
    window.dispatchEvent(new CustomEvent("tunewave-theme-changed", { detail: { theme: appliedTheme, mode } }));
  }

  function applyTheme(theme) {
    const mode = normalizeTheme(theme);
    const appliedTheme = getAppliedTheme(mode);
    document.body.dataset.theme = appliedTheme;
    document.documentElement.dataset.theme = appliedTheme;
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      // Ignore storage failures in preview mode.
    }
    if (autoTimer) window.clearInterval(autoTimer);
    if (mode === "auto") {
      autoTimer = window.setInterval(syncAutoTheme, 60 * 1000);
    }
    window.dispatchEvent(new CustomEvent("tunewave-theme-changed", { detail: { theme: appliedTheme, mode } }));
    return appliedTheme;
  }

  function applySavedTheme() {
    return applyTheme(getTheme());
  }

  window.TuneWaveTheme = {
    getTheme,
    getAppliedTheme,
    applyTheme,
    applySavedTheme,
    resolveAutoTheme
  };

  document.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
  });
})();
