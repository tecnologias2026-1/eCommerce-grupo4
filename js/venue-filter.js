document.addEventListener('DOMContentLoaded', () => {
    const guestInput = document.getElementById('guest-count');
    const venueGrid = document.getElementById('venue-grid');
    const venueCards = document.querySelectorAll('.venue-card');

    if (guestInput) {
        guestInput.addEventListener('input', () => {
            const count = parseInt(guestInput.value) || 0;
            localStorage.setItem('selectedGuests', count);
            
            venueCards.forEach(card => {
                const venueGuests = parseInt(card.getAttribute('data-guests')) || 0;
                // Allowance: 50% more guests than the base capacity (1.5x)
                if (venueGuests * 1.5 >= count) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Load initial value from localStorage if exists
    const storedGuests = localStorage.getItem('selectedGuests');
    if (storedGuests && guestInput) {
        guestInput.value = storedGuests;
        const count = parseInt(storedGuests) || 0;
        venueCards.forEach(card => {
            const venueGuests = parseInt(card.getAttribute('data-guests')) || 0;
            // Allowance: 50% more guests than the base capacity (1.5x)
            if (venueGuests * 1.5 >= count) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Handle Selection on Card Click (Image or Text Box)
    venueCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If the user clicked the "Ver más" button, don't toggle selection
            if (e.target.closest('.venue-card__more-btn')) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            
            // Toggle current card
            card.classList.toggle('venue-card--selected');
        });
    });
});
