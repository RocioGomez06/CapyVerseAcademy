// =============================================
// CAPY LANG — shared language persistence
// One choice, one localStorage key, every page.
// Detects browser language on first visit.
// =============================================
(function () {
  'use strict';

  var KEY = 'capy_lang';
  var SUPPORTED = ['en', 'es', 'pt'];

  function pickInitial() {
    try {
      var stored = localStorage.getItem(KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || 'en')
                .toLowerCase().slice(0, 2);
    if (SUPPORTED.indexOf(nav) !== -1) return nav;
    return 'en';
  }

  var current = pickInitial();

  function get() { return current; }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);
    // Notify listeners (other widgets on the page, e.g. music player).
    try {
      window.dispatchEvent(new CustomEvent('capy:langchange', { detail: { lang: lang } }));
    } catch (e) {}
  }

  // Apply persisted lang to <html> as early as possible.
  document.documentElement.setAttribute('lang', current);

  window.CapyLang = { get: get, set: set, SUPPORTED: SUPPORTED };
})();
