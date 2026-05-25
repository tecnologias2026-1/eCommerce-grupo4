// Wire up header logout button once it loads
(function () {
    var headerEl = document.getElementById('header-placeholder');
    if (!headerEl) return;
    var observer = new MutationObserver(function (_, obs) {
        var btn = headerEl.querySelector('[data-header-btn="logout"]');
        if (!btn) return;
        obs.disconnect();
        btn.addEventListener('click', function () {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        });
    });
    observer.observe(headerEl, { childList: true, subtree: true });
})();

document.addEventListener('DOMContentLoaded', function () {
    var listContainer = document.getElementById('reservations-list');
    var allReservations = [];
    var activeFilter = 'all';

    var logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        });
    }

    document.querySelectorAll('.res-filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.res-filter-btn').forEach(function (b) {
                b.classList.remove('res-filter-btn--active');
            });
            btn.classList.add('res-filter-btn--active');
            activeFilter = btn.dataset.filter;
            renderCards();
        });
    });

    function statusLabel(status) {
        var map = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Finalizada' };
        return map[status] || status;
    }

    function formatPrice(value) {
        var n = Number(value);
        return isNaN(n) ? 'COL$ 0' : 'COL$ ' + n.toLocaleString('es-CO');
    }

    var venueImgMap = {
        'paz-del-rio': '../images/paz%20del%20rio.png',
        'el-cedro':    '../images/el%20cedro.png',
        'san-juan':    '../images/san%20juan.png',
        'las-marias':  '../images/las%20marias.png',
        'arkadia':     '../images/arkadia.png',
        'botania':     '../images/botania.png'
    };

    function renderCards() {
        var filtered = allReservations.filter(function (r) {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'pending') return r.status === 'pending';
            if (activeFilter === 'completed') return r.status === 'completed';
            return true;
        });

        if (filtered.length === 0) {
            listContainer.innerHTML = '<p class="empty-msg">No hay reservaciones para mostrar.</p>';
            return;
        }

        listContainer.innerHTML = '';
        filtered.forEach(function (res) {
            var groom  = res.groom_name   || '';
            var bride  = res.bride_name   || '';
            var venue  = res.venue_name   || '';
            var date   = res.wedding_date || '';
            var status = res.status       || 'pending';
            var code   = res.code         || res.id || '';
            var price  = formatPrice(res.total_price);
            var canConclude = status === 'pending' || status === 'confirmed';

            var venueImg = venueImgMap[res.venue_slug] || res.venue_image || '';

            var card = document.createElement('div');
            card.className = 'res-card';
            card.dataset.code = code;

            card.innerHTML = `
                <div class="res-card__info">
                    <h2 class="res-card__title">${groom.toUpperCase()} Y<br>${bride.toUpperCase()}</h2>
                    <p class="res-card__venue">${venue}</p>
                    <p class="res-card__date">Fecha: ${date}</p>
                    <p class="res-card__status">Estado: <span data-status="${status}">${statusLabel(status)}</span></p>
                    <p class="res-card__price">${price}</p>
                    ${canConclude ? `<button class="btn-conclude" data-code="${code}">Marcar como concluida</button>` : ''}
                </div>

                <div class="res-card__media-grid">
                    <div class="media-slot">
                        <img src="${venueImg}" alt="${venue}" loading="lazy">
                        <span>HACIENDA</span>
                    </div>
                    <div class="media-slot">
                        <img src="../images/c1.png" alt="Ceremonia" loading="lazy">
                        <span>CEREMONIA</span>
                    </div>
                    <div class="media-slot">
                        <img src="../images/r1.png" alt="Recepción" loading="lazy">
                        <span>RECEPCIÓN</span>
                    </div>
                    <div class="media-slot">
                        <img src="../images/f1.png" alt="Decoración" loading="lazy">
                        <span>DECORACIÓN</span>
                    </div>
                </div>
            `;

            card.addEventListener('click', function (e) {
                if (e.target.closest('.btn-conclude')) return;
                localStorage.setItem('viewingReservation', JSON.stringify(res));
                window.location.href = 'reservations_view.html';
            });

            var concludeBtn = card.querySelector('.btn-conclude');
            if (concludeBtn) {
                concludeBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    concludeReservation(code, card);
                });
            }

            listContainer.appendChild(card);
        });
    }

    function concludeReservation(code, card) {
        if (!confirm('¿Marcar esta reserva como finalizada?')) return;

        var btn = card.querySelector('.btn-conclude');
        if (btn) { btn.disabled = true; btn.textContent = 'Actualizando…'; }

        apiRequest('PATCH', '/reservations/' + code + '/status', { status: 'completed' })
            .then(function () {
                var res = allReservations.find(function (r) { return (r.code || r.id) === code; });
                if (res) res.status = 'completed';
                renderCards();
            })
            .catch(function (err) {
                alert('No se pudo actualizar: ' + (err.message || 'Error desconocido'));
                if (btn) { btn.disabled = false; btn.textContent = 'Marcar como concluida'; }
            });
    }

    function showLoading() {
        listContainer.innerHTML =
            '<div class="server-status">' +
            '  <div class="server-status__icon"></div>' +
            '  <p class="server-status__title">Cargando reservaciones…</p>' +
            '</div>';
    }

    function showWakingUp(secondsLeft) {
        listContainer.innerHTML =
            '<div class="server-status">' +
            '  <div class="server-status__icon"></div>' +
            '  <p class="server-status__title">El servidor está iniciando</p>' +
            '  <p class="server-status__text">El servicio estaba inactivo y está despertando. Esto puede tomar hasta 60 segundos la primera vez.</p>' +
            '  <p class="server-status__countdown" id="wakeup-countdown">Esperando' + (secondsLeft ? ' (~' + secondsLeft + 's)' : '…') + '</p>' +
            '</div>';
    }

    function showRetryError(autoRetryIn) {
        listContainer.innerHTML =
            '<div class="server-status">' +
            '  <div class="server-status__icon server-status__icon--error"></div>' +
            '  <p class="server-status__title">No se pudo conectar</p>' +
            '  <p class="server-status__text">El servidor tardó demasiado en responder. Suele ocurrir después de un período de inactividad en Render.</p>' +
            '  <button class="server-status__retry" id="retry-btn">Reintentar</button>' +
            (autoRetryIn ? '<p class="server-status__countdown" id="retry-countdown">Reintento automático en ' + autoRetryIn + 's…</p>' : '') +
            '</div>';

        document.getElementById('retry-btn').addEventListener('click', function () {
            clearRetryCountdown();
            loadReservations();
        });
    }

    var retryTimer = null;
    var countdownTimer = null;
    var wakeupTimer = null;

    function clearAllTimers() {
        clearTimeout(retryTimer);
        clearTimeout(wakeupTimer);
        clearInterval(countdownTimer);
        retryTimer = null;
        wakeupTimer = null;
        countdownTimer = null;
    }

    function clearRetryCountdown() {
        clearTimeout(retryTimer);
        clearInterval(countdownTimer);
        retryTimer = null;
        countdownTimer = null;
    }

    function startAutoRetry(seconds) {
        var remaining = seconds;
        countdownTimer = setInterval(function () {
            remaining--;
            var el = document.getElementById('retry-countdown');
            if (el) el.textContent = 'Reintento automático en ' + remaining + 's…';
            if (remaining <= 0) {
                clearRetryCountdown();
                loadReservations();
            }
        }, 1000);
    }

    function loadReservations() {
        if (typeof apiFetch !== 'function') {
            listContainer.innerHTML = '<p class="empty-msg">Error: manager.js no cargó.</p>';
            return;
        }

        clearAllTimers();
        showLoading();

        wakeupTimer = setTimeout(function () {
            showWakingUp(48);
            var remaining = 48;
            countdownTimer = setInterval(function () {
                remaining--;
                var el = document.getElementById('wakeup-countdown');
                if (el && remaining > 0) el.textContent = 'Esperando (~' + remaining + 's)';
                if (remaining <= 0) clearInterval(countdownTimer);
            }, 1000);
        }, 12000);

        apiFetch('/reservations')
            .then(function (data) {
                clearAllTimers();
                if (!Array.isArray(data)) throw new Error('Respuesta inesperada');
                allReservations = data.sort(function (a, b) {
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                });
                renderCards();
            })
            .catch(function (err) {
                clearAllTimers();
                var status = err.status || 0;
                var msg = err.message || '';
                if (status === 401 || status === 403 || msg.includes('401') || msg.includes('403')) {
                    window.location.href = 'auth.html';
                    return;
                }
                showRetryError(40);
                startAutoRetry(40);
            });
    }

    loadReservations();
});
