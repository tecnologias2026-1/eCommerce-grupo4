document.addEventListener('DOMContentLoaded', () => {
    const venueCards = document.querySelectorAll('.venue-card');

    function openVenueModal(href) {
        const selectedDate = localStorage.getItem('selectedWeddingDate');
        if (!selectedDate) {
            showCustomAlert('CONFIRMAR DISPONIBILIDAD', 'Para confirmar disponibilidad debe seleccionar la fecha aproximada de la boda en el calendario.');
            return;
        }

        const modal = document.getElementById('venue-modal');
        const iframe = document.getElementById('venue-modal-iframe');

        if (href) {
            if (href.includes('?')) {
                href += '&popup=true';
            } else {
                href += '?popup=true';
            }
            iframe.src = href;
            modal.classList.add('show');
        }
    }

    window.addEventListener('guestsChanged', () => { });

    window.addEventListener('weddingDateChanged', () => { });

    venueCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const href = card.getAttribute('data-href');
            openVenueModal(href);
        });
    });
});
