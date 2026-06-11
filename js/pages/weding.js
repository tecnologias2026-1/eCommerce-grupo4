// Detalle de boda único: weding.html?id=N
// La conexión con la base de datos queda abierta: cuando el backend
// exponga GET /weddings/:id, fetchWedding() la usará automáticamente
// (apiFetch viene de manager.js). Mientras tanto se sirven los datos
// locales de respaldo.

(function () {
    'use strict';

    // Datos de respaldo con la misma forma que devolverá la API:
    // { title, date, venue, media: [{ type: 'image'|'video', src }], features: [{ title, desc, image }] }
    var FALLBACK_WEDDINGS = {
        '1': {
            title: 'Vanessa y Pedro',
            date: '15/09/2025',
            venue: 'Hacienda San Juan',
            media: [
                { type: 'image', src: '../images/VyP w1.jpg' },
                { type: 'image', src: '../images/w1.png' },
                { type: 'image', src: '../images/w1r.png' }
            ],
            features: [
                { title: 'Lugar y Hacienda', desc: 'Espacios elegantes y naturales para eventos inolvidables.', image: '../images/w1.png' },
                { title: 'Experiencia Gastronómica', desc: 'Menús exclusivos preparados por chefs profesionales.', image: '../images/w1c.png' },
                { title: 'Recepción', desc: 'Ambientes sofisticados para celebrar momentos especiales.', image: '../images/w1r.png' },
                { title: 'Decoraciones', desc: 'Diseños personalizados que transforman cada evento.', image: '../images/w1d.png' }
            ]
        },
        '2': {
            title: 'Tatiana y Felipe',
            date: '05/04/2023',
            venue: 'Hacienda Paz del Río',
            media: [
                { type: 'image', src: '../images/TyF w2.png' },
                { type: 'image', src: '../images/w2.png' },
                { type: 'image', src: '../images/w2r.png' }
            ],
            features: [
                { title: 'Lugar y Hacienda', desc: 'Espacios elegantes y naturales para eventos inolvidables.', image: '../images/w2.png' },
                { title: 'Experiencia Gastronómica', desc: 'Menús exclusivos preparados por chefs profesionales.', image: '../images/w2c.jpg' },
                { title: 'Recepción', desc: 'Ambientes sofisticados para celebrar momentos especiales.', image: '../images/w2r.png' },
                { title: 'Decoraciones', desc: 'Diseños personalizados que transforman cada evento.', image: '../images/w2d.png' }
            ]
        },
        '3': {
            title: 'Laura y Jorge',
            date: '14/06/2025',
            venue: 'Hacienda Arkadia',
            media: [
                { type: 'image', src: '../images/LyJ w3.png' },
                { type: 'image', src: '../images/lugar y hacienda w3.png' },
                { type: 'image', src: '../images/recepcio w3.png' }
            ],
            features: [
                { title: 'Lugar y Hacienda', desc: 'Espacios elegantes y naturales para eventos inolvidables.', image: '../images/lugar y hacienda w3.png' },
                { title: 'Experiencia Gastronómica', desc: 'Menús exclusivos preparados por chefs profesionales.', image: '../images/exp gastronomica w3.png' },
                { title: 'Recepción', desc: 'Ambientes sofisticados para celebrar momentos especiales.', image: '../images/recepcio w3.png' },
                { title: 'Ceremonia Campestre', desc: 'Ceremonias al aire libre rodeadas de naturaleza y romance.', image: '../images/ceremonia campestre w3.png' }
            ]
        },
        '4': {
            title: 'Juana y Carlos',
            date: '10/05/2018',
            venue: 'Hacienda Maria Clarita',
            media: [
                { type: 'image', src: '../images/anillos desktop.png' },
                { type: 'image', src: '../images/las marias.png' },
                { type: 'image', src: '../images/r3.png' }
            ],
            features: [
                { title: 'Lugar y Hacienda', desc: 'La majestuosa Hacienda María Clarita ofreció el escenario perfecto al aire libre.', image: '../images/las marias.png' },
                { title: 'Experiencia Gastronómica', desc: 'Un banquete premium diseñado a su medida y estilo tradicional.', image: '../images/f4.png' },
                { title: 'Recepción', desc: 'Ambientes festivos y románticos donde celebraron con sus seres queridos.', image: '../images/r3.png' },
                { title: 'Decoraciones', desc: 'Arreglos florales rústicos y detalles vintage que cautivaron a todos.', image: '../images/ceremonia campestre w3.png' }
            ]
        }
    };

    function getWeddingId() {
        return new URLSearchParams(window.location.search).get('id') || '1';
    }

    // Normaliza la respuesta de la API al formato que usa la página,
    // tolerando los nombres de columna de la base de datos
    function normalizeApiWedding(w) {
        return {
            title: w.title || ((w.groom_name || '') + ' y ' + (w.bride_name || '')),
            date: w.date || (w.wedding_date ? new Date(w.wedding_date).toLocaleDateString('es-CO') : ''),
            venue: w.venue || w.venue_name || '',
            media: w.media || [],
            features: w.features || []
        };
    }

    function fetchWedding(id) {
        var fallback = FALLBACK_WEDDINGS[id] || FALLBACK_WEDDINGS['1'];
        if (typeof apiFetch !== 'function') {
            return Promise.resolve(fallback);
        }
        return apiFetch('/weddings/' + id)
            .then(function (w) {
                var data = normalizeApiWedding(w);
                // Si la API aún no entrega media/features, completa con el respaldo
                if (!data.media.length) data.media = fallback.media;
                if (!data.features.length) data.features = fallback.features;
                return data;
            })
            .catch(function () { return fallback; });
    }

    function renderHeader(data) {
        document.title = 'Boda: ' + data.title + ' - Eventos Decoraciones';
        document.getElementById('wedding-title').textContent = data.title;
        document.getElementById('wedding-date').textContent = data.date;
        document.getElementById('wedding-location').textContent = data.venue;
    }

    function renderCarousel(data) {
        var track = document.getElementById('wedding-carousel-track');
        track.innerHTML = '';

        data.media.forEach(function (item, i) {
            var slide = document.createElement('div');
            slide.className = 'wedding-carousel__slide';
            if (item.type === 'video') {
                var video = document.createElement('video');
                video.src = item.src;
                video.controls = true;
                video.preload = 'metadata';
                if (item.poster) video.poster = item.poster;
                slide.appendChild(video);
            } else {
                var img = document.createElement('img');
                img.src = item.src;
                img.alt = data.title + ' — foto ' + (i + 1);
                if (i > 0) {
                    img.loading = 'lazy';
                    img.decoding = 'async';
                }
                slide.appendChild(img);
            }
            track.appendChild(slide);
        });

        function move(dir) {
            var width = track.clientWidth;
            var maxScroll = track.scrollWidth - width;
            var target = track.scrollLeft + dir * width;
            // Al llegar a un extremo, vuelve al otro lado
            if (target > maxScroll + 1) target = 0;
            if (target < -1) target = maxScroll;
            track.scrollTo({ left: target, behavior: 'smooth' });
        }

        document.getElementById('carousel-prev').addEventListener('click', function () { move(-1); });
        document.getElementById('carousel-next').addEventListener('click', function () { move(1); });
    }

    function renderFeatures(data) {
        var container = document.getElementById('wedding-features');
        container.innerHTML = data.features.map(function (f) {
            return (
                '<div class="wedding-feature-card">' +
                '<div class="wedding-feature-card__image-container">' +
                '<img src="' + f.image + '" alt="' + f.title + '" class="wedding-feature-card__image" loading="lazy" decoding="async">' +
                '<div class="wedding-feature-card__overlay"></div>' +
                '<div class="wedding-feature-card__info-panel">' +
                '<h4 class="wedding-feature-card__info-title">' + f.title + '</h4>' +
                '<p class="wedding-feature-card__info-desc">' + f.desc + '</p>' +
                '</div>' +
                '</div>' +
                '<h5 class="wedding-feature-card__title">' + f.title + '</h5>' +
                '</div>'
            );
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        fetchWedding(getWeddingId()).then(function (data) {
            renderHeader(data);
            renderCarousel(data);
            renderFeatures(data);
        });
    });
})();
