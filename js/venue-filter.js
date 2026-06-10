document.addEventListener('DOMContentLoaded', () => {
    const venueCards = document.querySelectorAll('.venue-card');

    function getGuestInput() {
        return document.getElementById('global-guest-count');
    }

    function getGuests() {
        const input = getGuestInput();
        return parseInt(input ? input.value : '0') || 0;
    }

    function getCapacity(card) {
        return parseInt(card.dataset.guests) || 0;
    }

    function filterByGuests() {
        const guests = getGuests();

        let minSuitable = Infinity;
        if (guests > 0) {
            venueCards.forEach(card => {
                const cap = getCapacity(card);
                if (cap >= guests && cap < minSuitable) {
                    minSuitable = cap;
                }
            });
        }

        venueCards.forEach(card => {
            const cap = getCapacity(card);

            if (guests === 0) {
                card.classList.remove('venue-card--ideal', 'venue-card--spacious', 'venue-card--insufficient');
                return;
            }

            if (cap >= guests) {
                const margin = cap - minSuitable;
                if (margin <= 50) {
                    card.classList.add('venue-card--ideal');
                    card.classList.remove('venue-card--spacious', 'venue-card--insufficient');
                } else {
                    card.classList.add('venue-card--spacious');
                    card.classList.remove('venue-card--ideal', 'venue-card--insufficient');
                }
            } else if (guests > 300 && cap >= 300) {
                card.classList.add('venue-card--ideal');
                card.classList.remove('venue-card--spacious', 'venue-card--insufficient');
            } else {
                card.classList.add('venue-card--insufficient');
                card.classList.remove('venue-card--ideal', 'venue-card--spacious');
            }
        });
    }

    window.addEventListener('guestsChanged', filterByGuests);
    window.addEventListener('weddingDateChanged', () => { });

    function openVenueModal(href, card) {
        const selectedDate = localStorage.getItem('selectedWeddingDate');
        if (!selectedDate) {
            showCustomAlert('CONFIRMAR DISPONIBILIDAD', 'Para confirmar disponibilidad debe seleccionar la fecha aproximada de la boda en el calendario.');
            return;
        }

        if (card) {
            const cap = getCapacity(card);
            const nameEl = card.querySelector('.venue-card__title');
            const name = nameEl ? nameEl.textContent : 'Este lugar';

            if (card.classList.contains('venue-card--spacious')) {
                showSpaciousConfirm(name, cap, () => {
                    doOpenModal(href);
                });
                return;
            }

            if (card.classList.contains('venue-card--insufficient')) {
                showInsufficientConfirm(name, cap, () => {
                    doOpenModal(href);
                });
                return;
            }
        }

        doOpenModal(href);
    }

    function doOpenModal(href) {
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

    function showSpaciousConfirm(name, capacity, onConfirm) {
        let backdrop = document.querySelector(".cart-modal-backdrop");
        if (!backdrop) {
            backdrop = document.createElement("div");
            backdrop.className = "cart-modal-backdrop";
            document.body.appendChild(backdrop);
        }

        backdrop.innerHTML = `
            <div class="notification-modal" style="max-width: 480px; text-align: left;">
                <h2 class="notification-modal__title" style="text-align: center;">Espacio amplio</h2>
                <p class="notification-modal__text" style="text-align: left;">
                    <strong>${name}</strong> está diseñado para aproximadamente <strong>${capacity} invitados</strong>.
                </p>
                <p class="notification-modal__text" style="text-align: left;">
                    Según la cantidad de invitados que ingresaste, podría ser un espacio más amplio de lo necesario para tu evento.
                </p>
                <p class="notification-modal__text" style="text-align: left; margin-bottom: 24px;">
                    Sin embargo, aún puedes seleccionarlo si deseas una experiencia más espaciosa o una distribución diferente.
                </p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="notification-modal__btn" id="spacious-cancel-btn" style="background: #999;">Cancelar</button>
                    <button class="notification-modal__btn" id="spacious-confirm-btn">Seleccionar</button>
                </div>
            </div>
        `;

        function closeAlert() {
            backdrop.classList.remove("active");
            document.body.classList.remove("modal-open");
            setTimeout(() => {
                if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
            }, 300);
        }

        document.getElementById("spacious-confirm-btn").addEventListener("click", () => {
            closeAlert();
            onConfirm();
        });
        document.getElementById("spacious-cancel-btn").addEventListener("click", closeAlert);
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) closeAlert();
        });

        setTimeout(() => {
            backdrop.classList.add("active");
            document.body.classList.add("modal-open");
        }, 10);
    }

    function showInsufficientConfirm(name, capacity, onConfirm) {
        let backdrop = document.querySelector(".cart-modal-backdrop");
        if (!backdrop) {
            backdrop = document.createElement("div");
            backdrop.className = "cart-modal-backdrop";
            document.body.appendChild(backdrop);
        }

        backdrop.innerHTML = `
            <div class="notification-modal" style="max-width: 480px; text-align: left;">
                <h2 class="notification-modal__title" style="text-align: center;">Capacidad reducida</h2>
                <p class="notification-modal__text" style="text-align: left;">
                    <strong>${name}</strong> tiene capacidad para aproximadamente <strong>${capacity} invitados</strong>.
                </p>
                <p class="notification-modal__text" style="text-align: left;">
                    La cantidad de invitados que ingresaste supera esta capacidad, por lo que es posible que el espacio no sea suficiente para todos tus invitados.
                </p>
                <p class="notification-modal__text" style="text-align: left; margin-bottom: 24px;">
                    Te recomendamos considerar otras opciones que se ajusten mejor a tu número de invitados.
                </p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="notification-modal__btn" id="insufficient-cancel-btn" style="background: #999;">Cancelar</button>
                    <button class="notification-modal__btn" id="insufficient-confirm-btn">Ver de todos modos</button>
                </div>
            </div>
        `;

        function closeAlert() {
            backdrop.classList.remove("active");
            document.body.classList.remove("modal-open");
            setTimeout(() => {
                if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
            }, 300);
        }

        document.getElementById("insufficient-confirm-btn").addEventListener("click", () => {
            closeAlert();
            onConfirm();
        });
        document.getElementById("insufficient-cancel-btn").addEventListener("click", closeAlert);
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) closeAlert();
        });

        setTimeout(() => {
            backdrop.classList.add("active");
            document.body.classList.add("modal-open");
        }, 10);
    }

    venueCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const href = card.getAttribute('data-href');
            openVenueModal(href, card);
        });
    });
});
