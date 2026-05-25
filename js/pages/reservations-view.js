document.addEventListener('DOMContentLoaded', function () {
    var stored = JSON.parse(localStorage.getItem('viewingReservation'));

    if (!stored) {
        window.location.href = 'reservations.html';
        return;
    }

    var venueImgMap = {
        'paz-del-rio': '../images/paz%20del%20rio.png',
        'el-cedro':    '../images/el%20cedro.png',
        'san-juan':    '../images/san%20juan.png',
        'las-marias':  '../images/las%20marias.png',
        'arkadia':     '../images/arkadia.png',
        'botania':     '../images/botania.png'
    };

    function populate(r) {
        var id     = (r.code || r.id || '000000').replace(/^#/, '');
        var groom  = r.groom_name  || r.groom  || '';
        var bride  = r.bride_name  || r.bride  || '';
        var venue  = r.venue_name  || r.venue  || '';
        var guests = r.guest_count != null ? r.guest_count + ' invitados' : (r.guests || '100 invitados aprox');
        var date   = r.wedding_date|| r.weddingDate || '';
        var status = r.status      || 'Pendiente';
        var email  = r.email       || '';
        var phone  = r.phone       || '';
        var image  = (r.venue_slug && venueImgMap[r.venue_slug])
            || r.venue_image || r.venueImage || '../images/paz del rio.png';
        var total  = r.total_price != null
            ? 'COL$ ' + Number(r.total_price).toLocaleString('es-CO')
            : (r.totalPrice || 'COL$ 0');

        document.getElementById('res-id').textContent = id;
        document.getElementById('res-couple').innerHTML = groom.toUpperCase() + ' Y<br>' + bride.toUpperCase();
        document.getElementById('res-venue').textContent = venue;
        document.getElementById('res-guests').textContent = guests;
        document.getElementById('res-date').textContent = date;
        document.getElementById('res-status').textContent = status;
        document.getElementById('res-price').textContent = total;
        document.getElementById('res-contact').textContent = 'Email: ' + email + ' | Tel: ' + phone;

        if (image) {
            document.getElementById('res-image').src = image;
            document.getElementById('res-image').alt = venue;
            document.getElementById('res-image-grid').src = image;
            document.getElementById('res-image-grid').alt = venue;
        }
    }

    populate(stored);

    var code = (stored.code || stored.id || '').replace(/^#/, '');
    if (code && typeof apiFetch === 'function') {
        apiFetch('/reservations/' + code)
            .then(function (data) { if (data && (data.code || data.id)) populate(data); })
            .catch(function () { /* keep localStorage render */ });
    }
});
