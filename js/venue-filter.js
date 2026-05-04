document.addEventListener('DOMContentLoaded', () => {
    const guestInput = document.getElementById('guest-count');
    const venueCards = document.querySelectorAll('.venue-card');
    
    let activeBookingDate = localStorage.getItem('selectedWeddingDate') || null;
    let bookedData = {};

    function updateVenueVisibility() {
        const countValue = parseInt(guestInput.value) || 0;
        
        venueCards.forEach(card => {
            const venueName = card.querySelector('.venue-card__title').textContent.trim();
            const venueGuests = parseInt(card.getAttribute('data-guests')) || 0;
            
            // 1. Capacity filter (Original)
            const matchesCapacity = (venueGuests * 1.5 >= countValue);
            
            // 2. Availability filter (New)
            let isAvailable = true;
            if (activeBookingDate && bookedData[venueName]) {
                if (bookedData[venueName].includes(activeBookingDate)) {
                    isAvailable = false;
                }
            }
            
            if (matchesCapacity && isAvailable) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (guestInput) {
        guestInput.addEventListener('input', () => {
            if (typeof CookieConsent === 'undefined' || CookieConsent.hasConsent()) {
                localStorage.setItem('selectedGuests', guestInput.value);
            }
            updateVenueVisibility();
        });
    }

    // New: Listen for Date Selection from calendar.js
    window.addEventListener('weddingDateChanged', (e) => {
        activeBookingDate = e.detail.date;
        bookedData = e.detail.venueBookedDates;
        updateVenueVisibility();
    });

    // Load initial value from localStorage if exists
    const storedGuests = localStorage.getItem('selectedGuests');
    if (storedGuests && guestInput) {
        guestInput.value = storedGuests;
    }
    
    // Final check for visibility
    updateVenueVisibility();

    // Handle Selection on Card Click (Image or Text Box)
    venueCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // ... (Selection logic remains mostly same)
            if (e.target.closest('.venue-card__more-btn')) return;
            e.preventDefault();
            e.stopPropagation();
            
            const isSelected = card.classList.contains('venue-card--selected');
            venueCards.forEach(c => c.classList.remove('venue-card--selected'));
            if (!isSelected) {
                card.classList.add('venue-card--selected');
            }
        });
    });
});
