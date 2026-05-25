document.addEventListener('DOMContentLoaded', function () {
    var stored = JSON.parse(localStorage.getItem('viewingUserReservation'));
    var payMoreBtn = document.getElementById('btn-pay-more');

    if (payMoreBtn) {
        payMoreBtn.addEventListener('click', function () {
            alert('Redirigiendo a pasarela de pagos...');
        });
    }

    if (!stored) {
        window.location.href = 'reservcode.html';
        return;
    }

    function populate(r) {
        var id     = (r.code || r.id || '000000').replace(/^#/, '');
        var groom  = r.groom_name  || r.groom  || '';
        var bride  = r.bride_name  || r.bride  || '';
        var venue  = r.venue_name  || r.venue  || '';
        var date   = r.wedding_date|| r.weddingDate || '';
        var status = r.status      || 'Pendiente';
        var image  = r.venue_image || r.venueImage || '';

        var totalRaw = r.total_price != null
            ? Number(r.total_price)
            : parseInt((r.totalPrice || '0').replace(/[^0-9]/g, '')) || 0;
        var depositRaw = r.deposit_amount != null
            ? Number(r.deposit_amount)
            : parseInt((r.deposit || r.depositAmount || '0').replace(/[^0-9]/g, '')) || 0;

        document.getElementById('res-id').textContent = id;
        document.getElementById('res-couple').innerHTML = groom.toUpperCase() + ' Y<br>' + bride.toUpperCase();
        document.getElementById('res-venue').textContent = venue;
        document.getElementById('res-date').textContent = date;
        document.getElementById('res-status').textContent = status;
        if (image) document.getElementById('res-image').src = image;

        document.getElementById('pay-total').textContent = 'COL$ ' + totalRaw.toLocaleString('es-CO');
        document.getElementById('pay-deposit').textContent = 'COL$ ' + depositRaw.toLocaleString('es-CO');
        document.getElementById('pay-pending').textContent = 'COL$ ' + (totalRaw - depositRaw).toLocaleString('es-CO');
    }

    populate(stored);

    var code = (stored.code || stored.id || '').replace(/^#/, '');
    if (code && typeof apiFetch === 'function') {
        apiFetch('/reservations/' + code)
            .then(function (data) { if (data && (data.code || data.id)) populate(data); })
            .catch(function () { /* keep localStorage render */ });
    }
});
