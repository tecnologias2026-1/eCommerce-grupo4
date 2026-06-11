document.addEventListener('DOMContentLoaded', function () {
    // Las tarjetas de boda son enlaces a weding.html?id=N; manager.js
    // (initWeddingCardsModal) las abre en el popup iframe compartido.

    var slideshows = document.querySelectorAll('.slideshow-container');
    var supportsObserver = 'IntersectionObserver' in window;
    for (var s = 0; s < slideshows.length; s++) {
        (function (container, indexOffset) {
            var imagesAttr = container.getAttribute('data-slideshow');
            if (!imagesAttr) return;
            var sources;
            try { sources = JSON.parse(imagesAttr); } catch (e) { return; }
            if (sources.length < 2) return;

            var firstImg = container.querySelector('img');
            if (!firstImg) return;

            for (var i = 1; i < sources.length; i++) {
                var img = document.createElement('img');
                img.src = sources[i];
                img.alt = firstImg.alt || '';
                img.className = firstImg.className;
                img.loading = 'lazy';
                img.decoding = 'async';
                container.appendChild(img);
            }

            var imgs = container.querySelectorAll('img');
            imgs[0].classList.add('active');

            var speed = parseInt(container.getAttribute('data-speed'), 10) || 4500;
            var currentIndex = 0;
            var timerId = null;

            function tick() {
                var nextIndex = (currentIndex + 1) % sources.length;
                imgs[currentIndex].classList.remove('active');
                imgs[nextIndex].classList.add('active');
                currentIndex = nextIndex;
            }

            function start() {
                if (timerId) return;
                var initialDelay = speed + (indexOffset * 800);
                timerId = setTimeout(function loop() {
                    tick();
                    timerId = setTimeout(loop, speed);
                }, initialDelay);
            }

            function stop() {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
            }

            if (supportsObserver) {
                var io = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) start();
                        else stop();
                    });
                }, { threshold: 0.15 });
                io.observe(container);
            } else {
                start();
            }
        })(slideshows[s], s);
    }

    // Populate weddings from API when available; fallback to hardcoded HTML
    if (typeof apiFetch !== 'function') return;

    apiFetch('/weddings')
        .then(function (weddings) {
            if (!Array.isArray(weddings) || weddings.length === 0) return;

            var featured = weddings.find(function (w) { return w.is_featured; }) || weddings[0];
            if (featured) {
                var titleEl = document.querySelector('.nuestras-bodas__wedding-title');
                var infoEls = document.querySelectorAll('.nuestras-bodas__wedding-info p');
                if (titleEl) titleEl.textContent = featured.groom_name + ' y ' + featured.bride_name;
                if (infoEls[0]) infoEls[0].textContent = featured.wedding_date
                    ? new Date(featured.wedding_date).toLocaleDateString('es-CO') : '';
                if (infoEls[1]) infoEls[1].textContent = featured.venue_name || '';
            }

            var others = weddings.filter(function (w) { return !w.is_featured; });
            if (others.length === 0) return;
            var grid = document.querySelector('.bodas-ejemplares__grid');
            if (!grid) return;

            var fallbackImages = ['assets/images/boda1.jpg', 'assets/images/boda2.png', 'assets/images/boda3.jpg'];
            grid.innerHTML = others.map(function (w, idx) {
                var imgSrc = w.banner_image
                    ? 'assets/images/' + w.banner_image
                    : (fallbackImages[idx] || 'assets/images/boda1.jpg');
                var pageUrl = 'assets/public/weding.html?id=' + (w.id || idx + 1);
                var review = w.review || w.review_text || '';
                return (
                    '<li class="boda-card">' +
                    '<a class="boda-card__link" href="' + pageUrl + '">' +
                    '<div class="boda-card__image-container">' +
                    '<img src="' + imgSrc + '" alt="' + w.groom_name + ' y ' + w.bride_name + '" class="boda-card__image" loading="lazy" decoding="async">' +
                    '<div class="boda-card__overlay" aria-hidden="true"></div>' +
                    '<div class="boda-card__content">' +
                    (review ? '<blockquote class="boda-card__review">"' + review + '"</blockquote>' : '') +
                    '<h5 class="boda-card__title">' + w.groom_name + ' y ' + w.bride_name + '</h5>' +
                    '</div></div></a></li>'
                );
            }).join('');

            // El listener de manager.js se enganchó a las tarjetas estáticas;
            // las re-renderizadas necesitan el suyo
            grid.querySelectorAll('.boda-card__link[href]').forEach(function (card) {
                card.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (typeof showWeddingModal === 'function') {
                        showWeddingModal(card.getAttribute('href'));
                    }
                });
            });
        })
        .catch(function () { /* API no disponible — fallback estático activo */ });
});
