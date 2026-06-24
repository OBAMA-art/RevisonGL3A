/* =========================================================================
   pwa-install.js — Invite d'installation sur l'écran d'accueil (PWA)
   -------------------------------------------------------------------------
   Affiche une bannière à CHAQUE ouverture, tant que l'app n'est pas installée :
   - Android / Chrome / Edge : installation en 1 clic via `beforeinstallprompt`.
   - iPhone / iPad (Safari) : pas d'API d'installation → marche à suivre manuelle
     (Partager → « Sur l'écran d'accueil »).
   - App déjà installée (mode standalone) : rien ne s'affiche.
   Aucune dépendance. S'auto-exécute.
   ========================================================================= */
(function () {
  'use strict';

  let deferredPrompt = null;

  const isStandalone = () =>
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;
  const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent || '') && !window.MSStream;

  // Capter l'invite native dès qu'elle est disponible (navigateurs Chromium)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  // Quand l'app vient d'être installée : on ne propose plus rien
  window.addEventListener('appinstalled', () => {
    try { localStorage.setItem('gl3a_pwa_installed', '1'); } catch {}
    removeBanner();
  });

  function removeBanner() {
    const b = document.getElementById('pwa-install-banner');
    if (b) b.remove();
  }

  function showInstructions() {
    const help = document.getElementById('pwa-install-help');
    if (!help) return;
    help.style.display = 'block';
    help.innerHTML = isIOS()
      ? 'Sur iPhone/iPad (Safari) : touche <strong>Partager</strong> (le carré avec une flèche ↑, en bas), puis <strong>« Sur l\'écran d\'accueil »</strong>.'
      : 'Ouvre le menu du navigateur (⋮ ou ⋯) puis <strong>« Installer l\'application »</strong> / <strong>« Ajouter à l\'écran d\'accueil »</strong>.';
  }

  async function onInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') removeBanner();
      } catch { /* ignore */ }
      deferredPrompt = null;
    } else {
      // iOS, ou invite native pas (encore) disponible → on guide à la main
      showInstructions();
    }
  }

  function buildBanner() {
    if (isStandalone()) return;                                   // déjà installée
    try { if (localStorage.getItem('gl3a_pwa_installed') === '1') return; } catch {}
    if (document.getElementById('pwa-install-banner')) return;     // déjà affichée

    const bar = document.createElement('div');
    bar.id = 'pwa-install-banner';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Installer l\'application');
    bar.style.cssText =
      'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;' +
      'max-width:680px;margin:0 auto;padding:14px 16px;border-radius:16px;' +
      'background:rgba(18,18,38,.97);color:#fff;border:1px solid rgba(99,102,241,.55);' +
      'box-shadow:0 14px 40px rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);' +
      'font-family:system-ui,\'Segoe UI\',Arial,sans-serif;line-height:1.4;';
    bar.innerHTML =
      '<div style="display:flex;gap:12px;align-items:flex-start;">' +
        '<span style="font-size:26px;line-height:1;">📲</span>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-weight:600;margin-bottom:2px;">Installe l\'application</div>' +
          '<div style="opacity:.85;font-size:.92em;">Ajoute <strong>Mon Bon Berger</strong> à ton écran d\'accueil : ouverture en un toucher, plus rapide, et utilisable hors-ligne.</div>' +
          '<div id="pwa-install-help" style="display:none;margin-top:8px;font-size:.9em;background:rgba(255,255,255,.07);padding:8px 10px;border-radius:10px;"></div>' +
        '</div>' +
        '<button id="pwa-install-close" aria-label="Fermer" style="background:none;border:none;color:#fff;opacity:.6;font-size:18px;cursor:pointer;padding:2px 6px;line-height:1;">✕</button>' +
      '</div>' +
      '<button id="pwa-install-go" class="btn-primary" style="width:100%;margin-top:10px;">📲 Installer sur l\'écran d\'accueil</button>';
    document.body.appendChild(bar);

    document.getElementById('pwa-install-close').onclick = removeBanner;
    document.getElementById('pwa-install-go').onclick = onInstallClick;
  }

  // Affichage à chaque ouverture (quand l'app n'est pas installée)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildBanner);
  } else {
    buildBanner();
  }
})();
