document.addEventListener('DOMContentLoaded', () => {
    const guestInput = document.getElementById('guest-count');
    const venueCards = document.querySelectorAll('.venue-card');
    const venueGrid = document.getElementById('venue-grid');

    // Create a "No results" message element
    const noResults = document.createElement('div');
    noResults.className = 'venue-gallery__no-results';
    noResults.innerHTML = `
        <p class="venue-gallery__subtitle">No se encontraron haciendas para esa cantidad de invitados.</p>
        <p style="font-family: 'Spectral', serif; color: rgba(0,0,0,0.4); font-size: 18px;">Intenta con otro número.</p>
    `;
    noResults.style.display = 'none';
    noResults.style.width = '100%';
    noResults.style.textAlign = 'center';
    noResults.style.gridColumn = '1 / -1';
    noResults.style.padding = '40px 0';
    venueGrid.appendChild(noResults);

    guestInput.addEventListener('input', () => {
        const count = parseInt(guestInput.value) || 0;
        let visibleCount = 0;

        venueCards.forEach(card => {
            const capacity = parseInt(card.dataset.guests);
            
            // Logic: Show if within +/- 50 range, or if input is 0 (show all)
            // Or if the capacity is greater than the count (it fits)
            // User said "más o menos en relación", so a range is better.
            const range = 50;
            const isInRange = (count === 0) || (capacity >= count - range && capacity <= count + range);
            
            if (isInRange) {
                card.style.display = 'flex';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 10);
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    });

    // Selection logic (Toggleable)
    venueCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent Card selection if the "Ver más" button is clicked
            if (e.target.closest('.venue-card__more-btn')) {
                return;
            }
            
            const isSelected = card.classList.contains('venue-card--selected');
            
            // First, remove selection from all cards
            venueCards.forEach(c => c.classList.remove('venue-card--selected'));
            
            // If it wasn't selected, select it now (toggle on)
            if (!isSelected) {
                card.classList.add('venue-card--selected');
            }
        });
    });
});
