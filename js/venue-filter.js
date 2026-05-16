document.addEventListener('DOMContentLoaded', () => {
    const venueCards = document.querySelectorAll('.venue-card');
    
    let activeBookingDate = localStorage.getItem('selectedWeddingDate') || null;
    let bookedData = {};

    function updateVenueVisibility() {
        venueCards.forEach(card => {
            // Force all cards to be visible regardless of date or guests
            card.style.display = 'flex';
        });
    }
    function updateCartForCard(card) {
        const currentCart = JSON.parse(localStorage.getItem('weddingCart') || '{}');
        
        const titleEl = card.querySelector('.venue-card__title');
        const priceEl = card.querySelector('.venue-card__price');
        const imgEl = card.querySelector('img');
        
        const baseGuestsNum = parseInt(card.getAttribute('data-guests')) || 100;
        const basePriceStr = priceEl ? priceEl.textContent.replace(/[^\d]/g, '') : '0';
        const basePriceNum = parseInt(basePriceStr) || 0;
        
        const guestsSelection = localStorage.getItem('selectedGuests');
        const selectedGuests = (guestsSelection && parseInt(guestsSelection) > 0) ? parseInt(guestsSelection) : baseGuestsNum;
        
        const pricePerGuest = basePriceNum / baseGuestsNum;
        const total = pricePerGuest * selectedGuests;
        const totalFormatted = 'COL$ ' + Math.round(total).toLocaleString('es-CO');
        
        currentCart.selectedVenue = {
            name: titleEl ? titleEl.textContent.trim() : 'Venue',
            guests: `${selectedGuests} invitados`,
            price: totalFormatted,
            image: imgEl ? imgEl.getAttribute('src') : ''
        };
        
        localStorage.setItem('weddingCart', JSON.stringify(currentCart));
        if (typeof updateHeaderPrice === 'function') {
            updateHeaderPrice();
        }
    }

    window.addEventListener('guestsChanged', () => {
        updateVenueVisibility();
        
        const selectedCard = document.querySelector('.venue-card--selected');
        if (selectedCard) {
            updateCartForCard(selectedCard);
        }
    });

    // New: Listen for Date Selection from calendar.js
    window.addEventListener('weddingDateChanged', (e) => {
        activeBookingDate = e.detail.date;
        bookedData = e.detail.venueBookedDates;
        updateVenueVisibility();
    });

    // Final check for visibility
    updateVenueVisibility();
    
    // Restore selection state from cart
    const initialCart = JSON.parse(localStorage.getItem('weddingCart') || '{}');
    if (initialCart.selectedVenue) {
        const selectedName = initialCart.selectedVenue.name;
        venueCards.forEach(card => {
            const titleEl = card.querySelector('.venue-card__title');
            if (titleEl && titleEl.textContent.trim() === selectedName) {
                card.classList.add('venue-card--selected');
            }
        });
    }

    // Handle Selection on Card Click
    venueCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.venue-card__more-btn')) return;
            e.preventDefault();
            e.stopPropagation();
            
            const isSelected = card.classList.contains('venue-card--selected');
            venueCards.forEach(c => c.classList.remove('venue-card--selected'));
            
            if (!isSelected) {
                card.classList.add('venue-card--selected');
                updateCartForCard(card);
            } else {
                const currentCart = JSON.parse(localStorage.getItem('weddingCart') || '{}');
                delete currentCart.selectedVenue;
                localStorage.setItem('weddingCart', JSON.stringify(currentCart));
                if (typeof updateHeaderPrice === 'function') {
                    updateHeaderPrice();
                }
            }
        });
    });
});
