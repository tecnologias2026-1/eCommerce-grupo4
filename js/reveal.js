(function() {
  'use strict';

  if (!('IntersectionObserver' in window)) return;

  setTimeout(function() {
    autoApplyReveal();
    observeReveal();
  }, 30);

  function autoApplyReveal() {
    var selectors = [
      'main > section',
      'main > header',
      'main > footer',
      'main > div',
      '.hero-selection',
      '.feature',
      '.nuestras-bodas',
      '.bodas-ejemplares',
      '.faq',
      '.about-us',
      '.mission-vision',
      '.our-history',
      '.our-trajectory',
      '.inspiration-quote',
      '.venue-header',
      '.venue-content > *',
      '.venue-location',
      '.venue-estimation',
      '.venue-features-grid',
      '.venue-footer',
      '.venue-actions',
      '.wedding-header',
      '.wedding-banner',
      '.auth-page',
      '.confirm-container',
      '.summary-section',
      '.summary-pago',
      '.res-view-container',
      '.userdata-form',
      '.payment-title-row',
      '.payment-form-wrap',
      '.payment-checkout',
      '.hero-gallery',
      '.ceremony-options',
      '.venue-gallery',
      '.reservation-calendar',
      '.calendar-container',
      '.next-button-bar',
      '.venue-gallery__actions',
      '.confirm-actions',
      '.venue-card',
      '.selection-item',
      '.boda-card',
      '.faq__item',
      '.wedding-feature-card',
      '.venue-feature-card',
      '.venue-estimation__card',
      '.res-card',
      '.hero-selection__title',
      '.feature__title',
      '.feature__subtitle',
      '.feature-list__subtitle',
      '.venue-gallery__title',
      '.venue-gallery__subtitle',
      '.reservation-calendar__title',
      '.reservation-calendar__subtitle',
      '.venue-title',
      '.venue-card__title',
      '.wedding-header__title',
      '.nuestras-bodas__title',
      '.nuestras-bodas__subtitle',
      '.bodas-ejemplares__title',
      '.about-us__title',
      '.mission-vision__title',
      '.our-history__title',
      '.our-trajectory__title',
      '.inspiration-quote__text',
      '.confirm-title',
      '.confirm-text',
      '.auth-page__title',
      '.summary-section__title',
      '.res-card__title',
      '.boda-card__title',
      '.faq__title',
      '.faq__question',
      '.summary-total-label',
      '.summary-total-value',
      '.summary-footer-note',
      '.userdata-form .form-group',
      '.form-grid .form-group',
      '.payment-section-label'
    ];

    selectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        if (!el.hasAttribute('data-reveal')) {
          el.setAttribute('data-reveal', 'up');
        }
      });
    });

    document.querySelectorAll('h1:not([data-reveal]), h2:not([data-reveal]), h3:not([data-reveal])').forEach(function(el) {
      if (el.closest('.header') || el.closest('.footer') || el.closest('nav') ||
          el.closest('#header-placeholder') || el.closest('#footer-placeholder')) return;
      el.setAttribute('data-reveal', 'up');
    });

    document.querySelectorAll('.venue-gallery__grid .venue-card:not([data-reveal-delay])').forEach(function(el, i) {
      el.setAttribute('data-reveal-delay', (i + 1) * 100);
    });

    document.querySelectorAll('.bodas-ejemplares__grid .boda-card:not([data-reveal-delay])').forEach(function(el, i) {
      el.setAttribute('data-reveal-delay', (i + 1) * 100);
    });

    document.querySelectorAll('.wedding-features .wedding-feature-card:not([data-reveal-delay])').forEach(function(el, i) {
      el.setAttribute('data-reveal-delay', (i + 1) * 100);
    });

    document.querySelectorAll('.venue-features-grid .venue-feature-card:not([data-reveal-delay])').forEach(function(el, i) {
      el.setAttribute('data-reveal-delay', (i + 1) * 100);
    });

    document.querySelectorAll('.faq__list .faq__item:not([data-reveal-delay])').forEach(function(el, i) {
      el.setAttribute('data-reveal-delay', (i + 1) * 100);
    });

    document.querySelectorAll('.venue-estimation__details .venue-estimation__card:not([data-reveal-delay])').forEach(function(el, i) {
      el.setAttribute('data-reveal-delay', (i + 1) * 100);
    });
  }

  function observeReveal() {
    var elements = document.querySelectorAll('[data-reveal]');
    if (elements.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay')) || 0;

        if (delay > 0) {
          setTimeout(function() {
            el.classList.add('is-revealed');
          }, delay);
        } else {
          el.classList.add('is-revealed');
        }

        observer.unobserve(el);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    for (var i = 0; i < elements.length; i++) {
      observer.observe(elements[i]);
    }
  }
})();
