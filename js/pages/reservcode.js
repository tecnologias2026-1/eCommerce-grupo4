document.addEventListener('DOMContentLoaded', function () {
    var codeInput = document.getElementById('reserve-code');
    var verifyBtn = document.getElementById('verify-btn');
    var reserveCodeForm = document.getElementById('reserve-code-form');

    var loginToggle = document.getElementById('login-toggle');
    var loginPanel = document.getElementById('login-panel');
    if (loginToggle && loginPanel) {
        var loginInner = loginPanel.querySelector('.login-panel__inner');
        loginToggle.addEventListener('click', function () {
            var open = loginPanel.classList.toggle('is-open');
            loginToggle.setAttribute('aria-expanded', String(open));
            if (loginInner) loginInner.toggleAttribute('inert', !open);
            if (open) {
                var identifier = document.getElementById('identifier');
                if (identifier) setTimeout(function () { identifier.focus(); }, 350);
            }
        });
    }

    codeInput.addEventListener('input', function () {
        var value = codeInput.value.trim();
        if (value.length > 0) {
            verifyBtn.classList.add('active');
        } else {
            verifyBtn.classList.remove('active');
        }
    });

    reserveCodeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var raw = codeInput.value.trim();
        if (!raw) return;

        var normalized = raw.replace(/^#/, '');
        if (!/^WP-/i.test(normalized)) normalized = 'WP-' + normalized;

        function goToView(data) {
            localStorage.setItem('viewingUserReservation', JSON.stringify(data));
            window.location.href = 'reserview_user.html';
        }

        function fallbackLocal() {
            var all = JSON.parse(localStorage.getItem('allReservations') || '[]');
            var found = all.find(function (r) {
                return (r.id || '').replace(/^#/, '').toUpperCase() === normalized.toUpperCase();
            });
            if (found) { goToView(found); }
            else { alert('Reserva no encontrada. Por favor verifica el código ingresado.'); }
        }

        if (typeof apiFetch === 'function') {
            verifyBtn.disabled = true;
            apiFetch('/reservations/' + normalized)
                .then(function (data) {
                    if (data && (data.code || data.id)) { goToView(data); }
                    else { fallbackLocal(); }
                })
                .catch(fallbackLocal)
                .finally(function () { verifyBtn.disabled = false; });
        } else {
            fallbackLocal();
        }
    });
});
