(function() {
  'use strict';

  var stack = document.querySelector('.card-stack');
  if (!stack) return;

  var header = document.getElementById('header-placeholder');
  var cards = Array.prototype.filter.call(
    stack.querySelectorAll('.stack-card'),
    function(card) { return !card.classList.contains('stack-card--flow'); }
  );

  function update() {
    var headerH = header ? header.offsetHeight : 90;
    var viewportH = window.innerHeight;

    document.documentElement.style.setProperty('--stack-top', headerH + 'px');

    cards.forEach(function(card) {
      // Tarjetas más altas que el viewport reciben top negativo:
      // se pegan solo cuando ya se recorrió todo su contenido.
      var top = Math.min(headerH, viewportH - card.offsetHeight);
      card.style.top = top + 'px';
    });
  }

  var rafId = null;
  function schedule() {
    if (rafId) return;
    rafId = requestAnimationFrame(function() {
      rafId = null;
      update();
    });
  }

  if ('ResizeObserver' in window) {
    // El header se inyecta async (manager.js) y las tarjetas cambian de
    // altura (imágenes lazy, grid re-renderizado desde la API).
    var observer = new ResizeObserver(schedule);
    if (header) observer.observe(header);
    cards.forEach(function(card) { observer.observe(card); });
  }

  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  schedule();

  // Pausar el video del hero cuando las tarjetas lo cubren por completo.
  var video = document.getElementById('hero-video');
  if (video && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var covered = null;
    window.addEventListener('scroll', function() {
      var isCovered = window.scrollY > window.innerHeight;
      if (isCovered === covered) return;
      covered = isCovered;
      if (isCovered) {
        video.pause();
      } else {
        video.play().catch(function() {});
      }
    }, { passive: true });
  }
})();
