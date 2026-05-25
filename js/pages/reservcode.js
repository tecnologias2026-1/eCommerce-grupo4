document.addEventListener('DOMContentLoaded', function () {
    var codeInput = document.getElementById('reserve-code');
    var verifyBtn = document.getElementById('verify-btn');
    var reserveCodeForm = document.getElementById('reserve-code-form');

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
