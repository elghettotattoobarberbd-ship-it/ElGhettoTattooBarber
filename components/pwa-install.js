(function () {
  'use strict';

  var _deferred = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    _deferred = e;
  });

  window.showPWABanner = function () {
    if (localStorage.getItem('pwa-dismissed') === '1') return;
    if (document.getElementById('pwa-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'pwa-banner';
    banner.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:9999',
      'background:#141414', 'border-top:2px solid #ffd60a',
      'padding:16px 20px', 'display:flex', 'align-items:center',
      'gap:16px', 'flex-wrap:wrap',
      'transform:translateY(100%)',
      'transition:transform 320ms cubic-bezier(0.34,1.56,0.64,1)',
      'box-shadow:0 -6px 32px rgba(0,0,0,0.7)',
    ].join(';');

    banner.innerHTML =
      '<img src="assets/leonfavicon.png" style="width:48px;height:48px;object-fit:cover;border-radius:8px;flex-shrink:0;" alt="El Ghetto"/>' +
      '<div style="flex:1;min-width:160px;">' +
        '<div style="font-family:Bungee,sans-serif;font-size:13px;color:#ffd60a;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px;">Agregá El Ghetto</div>' +
        '<div style="font-size:12px;color:#b9b4a4;line-height:1.45;">Guardalo en tu pantalla de inicio para reservar rápido la próxima vez.</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-shrink:0;">' +
        '<button id="pwa-install-btn" style="background:#ffd60a;color:#0a0a0a;border:none;padding:11px 20px;font-family:Bungee,sans-serif;font-size:12px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;">Instalar</button>' +
        '<button id="pwa-dismiss-btn" style="background:transparent;color:#b9b4a4;border:1.5px solid #2a2a2a;padding:11px 14px;font-family:Bungee,sans-serif;font-size:14px;cursor:pointer;line-height:1;">✕</button>' +
      '</div>';

    document.body.appendChild(banner);
    setTimeout(function () { banner.style.transform = 'translateY(0)'; }, 60);

    document.getElementById('pwa-install-btn').addEventListener('click', function () {
      if (_deferred) {
        _deferred.prompt();
        _deferred.userChoice.then(function () {
          _deferred = null;
          dismiss(true);
        });
      } else {
        // iOS no soporta beforeinstallprompt — instrucciones manuales
        alert('Para instalar en tu pantalla de inicio:\n\n• iPhone/iPad: tocá el ícono de compartir ↑ → "Agregar a pantalla de inicio"\n• Android: menú del navegador ⋮ → "Instalar app" o "Agregar a pantalla de inicio"');
        dismiss(true);
      }
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', function () {
      dismiss(false);
    });

    function dismiss(permanent) {
      if (permanent) localStorage.setItem('pwa-dismissed', '1');
      banner.style.transform = 'translateY(100%)';
      setTimeout(function () { banner.remove(); }, 380);
    }
  };
})();
