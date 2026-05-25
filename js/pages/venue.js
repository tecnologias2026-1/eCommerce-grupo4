document.addEventListener('DOMContentLoaded', function () {
    var guestsSelection = localStorage.getItem('selectedGuests');
    var venueHeader = document.querySelector('.venue-header');

    var basePriceNum = parseInt(venueHeader && venueHeader.dataset.basePrice || '0', 10) || 0;
    var baseGuestsNum = parseInt(venueHeader && venueHeader.dataset.baseGuests || '100', 10) || 100;

    var selectedGuests = (guestsSelection && parseInt(guestsSelection) > 0)
        ? parseInt(guestsSelection)
        : baseGuestsNum;

    var pricePerGuest = basePriceNum / baseGuestsNum;
    var total = pricePerGuest * selectedGuests;

    var finalGuestsEl = document.getElementById('final-guest-count');
    var baseRentEl = document.getElementById('base-rent');
    var projectedTotalEl = document.getElementById('projected-total');

    if (finalGuestsEl) finalGuestsEl.textContent = selectedGuests;
    if (baseRentEl) baseRentEl.textContent = 'COL$ ' + basePriceNum.toLocaleString('es-CO');

    var totalFormatted = 'COL$ ' + Math.round(total).toLocaleString('es-CO');
    if (projectedTotalEl) projectedTotalEl.textContent = totalFormatted;

    var addToCartBtn = document.querySelector('.btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.onclick = function () {
            var name  = (venueHeader && venueHeader.dataset.name)  || '';
            var slug  = (venueHeader && venueHeader.dataset.slug)  || '';
            var image = (venueHeader && venueHeader.dataset.image) || '';
            addToCart({
                name:   name,
                slug:   slug,
                guests: selectedGuests + ' invitados',
                price:  totalFormatted,
                image:  image
            });
        };
    }
});
