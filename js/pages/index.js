document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('wedding-modal');
    var closeBtn = document.getElementById('wedding-modal-close');
    var content = document.getElementById('wedding-modal-content');
    var viewBtns = document.querySelectorAll('.boda-card__view-btn, .nuestras-bodas__view-btn');

    function buildFeaturedContent() {
        return (
            '<header class="wedding-header">' +
            '<div class="wedding-header__details">' +
            '<h1 class="wedding-header__title">Juana y Carlos</h1>' +
            '<div class="wedding-header__info">' +
            '<p class="wedding-header__date">10 de Mayo, 2018</p>' +
            '<p class="wedding-header__location">Hacienda Maria Clarita</p>' +
            '</div>' +
            '</div>' +
            '</header>' +
            '<section class="wedding-banner">' +
            '<div class="wedding-banner__image-container">' +
            '<img src="assets/images/imagen novios.png" alt="Juana y Carlos" class="wedding-banner__image">' +
            '</div>' +
            '</section>' +
            '<section class="wedding-features">' +
            '<div class="wedding-feature-card">' +
            '<div class="wedding-feature-card__image-container">' +
            '<img src="assets/images/el cedro.png" alt="Lugar y Hacienda" class="wedding-feature-card__image">' +
            '<div class="wedding-feature-card__overlay"></div>' +
            '<div class="wedding-feature-card__info-panel">' +
            '<h4 class="wedding-feature-card__info-title">Lugar y Hacienda</h4>' +
            '<p class="wedding-feature-card__info-desc">La Hacienda Maria Clarita nos enamoró con sus jardines y su capilla al aire libre.</p>' +
            '</div>' +
            '</div>' +
            '<h5 class="wedding-feature-card__title">Lugar y Hacienda</h5>' +
            '</div>' +
            '<div class="wedding-feature-card">' +
            '<div class="wedding-feature-card__image-container">' +
            '<img src="assets/images/c1.png" alt="Experiencia Gastronómica" class="wedding-feature-card__image">' +
            '<div class="wedding-feature-card__overlay"></div>' +
            '<div class="wedding-feature-card__info-panel">' +
            '<h4 class="wedding-feature-card__info-title">Experiencia Gastronómica</h4>' +
            '<p class="wedding-feature-card__info-desc">Un banquete con sabores tradicionales que sorprendió a todos nuestros invitados.</p>' +
            '</div>' +
            '</div>' +
            '<h5 class="wedding-feature-card__title">Experiencia Gastronómica</h5>' +
            '</div>' +
            '<div class="wedding-feature-card">' +
            '<div class="wedding-feature-card__image-container">' +
            '<img src="assets/images/r1.png" alt="Recepción" class="wedding-feature-card__image">' +
            '<div class="wedding-feature-card__overlay"></div>' +
            '<div class="wedding-feature-card__info-panel">' +
            '<h4 class="wedding-feature-card__info-title">Recepción</h4>' +
            '<p class="wedding-feature-card__info-desc">Una fiesta llena de música, baile y momentos que recordaremos por siempre.</p>' +
            '</div>' +
            '</div>' +
            '<h5 class="wedding-feature-card__title">Recepción</h5>' +
            '</div>' +
            '<div class="wedding-feature-card">' +
            '<div class="wedding-feature-card__image-container">' +
            '<img src="assets/images/f1.png" alt="Decoraciones" class="wedding-feature-card__image">' +
            '<div class="wedding-feature-card__overlay"></div>' +
            '<div class="wedding-feature-card__info-panel">' +
            '<h4 class="wedding-feature-card__info-title">Decoraciones</h4>' +
            '<p class="wedding-feature-card__info-desc">Arreglos florales y detalles que reflejaron nuestra esencia y estilo único.</p>' +
            '</div>' +
            '</div>' +
            '<h5 class="wedding-feature-card__title">Decoraciones</h5>' +
            '</div>' +
            '</section>' +
            '<section class="wedding-review" style="background-color:var(--white);padding:60px var(--page-gutter);text-align:center;">' +
            '<div style="max-width:850px;margin:0 auto;background:var(--gray-light);padding:45px var(--space-2xl);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);border:1px solid var(--border);">' +
            '<div style="color:var(--primary);font-size:26px;margin-bottom:15px;letter-spacing:2px;">★★★★★</div>' +
            '<blockquote style="font-family:var(--font-secondary);font-size:30px;line-height:1.35;color:#25393b;font-style:italic;margin:0 0 20px 0;">' +
            '"Encontrar esta página fue un verdadero regalo. Desde el primer momento nos sentimos guiados: elegimos la Hacienda Maria Clarita viendo cada detalle en fotos y videos reales, comparamos opciones sin presión y armamos todo a nuestro ritmo. El día de la boda cada cosa estaba exactamente como la habíamos soñado. Nuestros invitados quedaron maravillados y nosotros sentimos que vivimos cada segundo al máximo, sin estrés, porque la plataforma ya había resuelto todo. Sin duda, la mejor decisión fue confiar en este equipo."' +
            '</blockquote>' +
            '<cite style="font-family:var(--font-primary);font-weight:600;font-size:18px;color:var(--black);font-style:normal;display:block;">&mdash; Juana &amp; Carlos</cite>' +
            '<span style="font-family:var(--font-primary);font-size:14px;color:var(--muted);display:block;margin-top:5px;">Casados el 10 de Mayo de 2018</span>' +
            '</div>' +
            '</section>'
        );
    }

    function openModal(url) {
        content.innerHTML = '<div style="text-align:center;padding:80px 20px;font-family:var(--font-secondary);color:var(--muted);font-size:20px;">Cargando...</div>';
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';

        if (url === 'featured') {
            content.innerHTML = buildFeaturedContent();
            return;
        }

        fetch(url)
            .then(function (res) {
                if (!res.ok) throw new Error();
                return res.text();
            })
            .then(function (html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                var body = doc.body;
                var h = body.querySelector('#header-placeholder');
                var f = body.querySelector('#footer-placeholder');
                if (h) h.remove();
                if (f) f.remove();
                content.innerHTML = body.innerHTML.replace(/src="\.\.\//g, 'src="assets/');
            })
            .catch(function () {
                content.innerHTML = '<div style="text-align:center;padding:80px 20px;font-family:var(--font-secondary);color:var(--error);font-size:20px;">Error al cargar la información.</div>';
            });
    }

    function closeModal() {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
        setTimeout(function () { content.innerHTML = ''; }, 400);
    }

    for (var i = 0; i < viewBtns.length; i++) {
        viewBtns[i].addEventListener('click', function (e) {
            e.stopPropagation();
            openModal(this.getAttribute('data-wedding'));
        });
    }

    window.openModal = openModal;
    window.closeModal = closeModal;

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });

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
                var dateStr = w.wedding_date
                    ? new Date(w.wedding_date).toLocaleDateString('es-CO') : '';
                var imgSrc = w.banner_image
                    ? 'assets/images/' + w.banner_image
                    : (fallbackImages[idx] || 'assets/images/boda1.jpg');
                var pageUrl = w.page_url || 'assets/public/weding1.html';
                return (
                    '<li class="boda-card">' +
                    '<div class="boda-card__link">' +
                    '<div class="boda-card__image-container">' +
                    '<img src="' + imgSrc + '" alt="' + w.groom_name + ' y ' + w.bride_name + '" class="boda-card__image" loading="lazy" decoding="async">' +
                    '<button class="boda-card__view-btn" data-wedding="' + pageUrl + '">Ver boda</button>' +
                    '</div>' +
                    '<div class="boda-card__content">' +
                    '<h5 class="boda-card__title">' + w.groom_name + ' y ' + w.bride_name + '</h5>' +
                    '<div class="boda-card__info">' +
                    '<span>' + dateStr + '</span>' +
                    '<span>' + (w.venue_name || '') + '</span>' +
                    '</div></div></div></li>'
                );
            }).join('');

            grid.querySelectorAll('.boda-card__view-btn').forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var url = btn.getAttribute('data-wedding');
                    if (typeof openModal === 'function') openModal(url);
                });
            });
        })
        .catch(function () { /* API no disponible — fallback estático activo */ });
});
