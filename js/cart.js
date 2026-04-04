function addToCart(venueData) {
    const currentCart = JSON.parse(localStorage.getItem('weddingCart') || '{}');
    const selectedDate = localStorage.getItem('selectedWeddingDate');

    // FORCE date check
    if (!selectedDate) {
        showCustomAlert('CONFIRMAR FECHA', 'Para confirmar disponibilidad debe seleccionar la fecha aproximada de la boda en el inicio.');
        return;
    }
    
    // Check if a venue is already selected
    if (currentCart.selectedVenue) {
        showCustomAlert('SELECCIÓN YA EXISTENTE', 'Ya tienes un lugar seleccionado. Solo puedes agregar un venue a tu boda.');
        return;
    }

    // Save the selected venue
    currentCart.selectedVenue = venueData;
    localStorage.setItem('weddingCart', JSON.stringify(currentCart));
    
    showCustomAlert('¡ENHORABUENA!', 'Lugar añadido al carrito con éxito. Puedes verlo en el resumen de tu boda.');
}

function showCustomAlert(title, message) {
    let backdrop = document.querySelector(".cart-modal-backdrop");
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "cart-modal-backdrop";
        document.body.appendChild(backdrop);
    }
    
    // Clear backdrop content for notification
    backdrop.innerHTML = `
        <div class="notification-modal">
            <h2 class="notification-modal__title">${title}</h2>
            <p class="notification-modal__text">${message}</p>
            <button class="notification-modal__btn" id="close-alert-btn">ACEPTAR</button>
        </div>
    `;

    function closeAlert() {
        backdrop.classList.remove("active");
        document.body.classList.remove("modal-open");
        setTimeout(() => {
            if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        }, 300);
    }

    document.getElementById("close-alert-btn").addEventListener("click", closeAlert);
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeAlert();
    });

    // Short delay to trigger transitions
    setTimeout(() => {
        backdrop.classList.add("active");
        document.body.classList.add("modal-open");
    }, 10);
}

function showCustomConfirm(title, message, onConfirm) {
    let backdrop = document.querySelector(".cart-modal-backdrop");
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "cart-modal-backdrop";
        document.body.appendChild(backdrop);
    }
    
    backdrop.innerHTML = `
        <div class="notification-modal">
            <h2 class="notification-modal__title">${title}</h2>
            <p class="notification-modal__text">${message}</p>
            <div style="display: flex; gap: 16px; justify-content: center;">
                <button class="notification-modal__btn notification-modal__btn--danger" id="confirm-btn">ELIMINAR</button>
                <button class="notification-modal__btn" id="cancel-btn" style="background: #666;">CANCELAR</button>
            </div>
        </div>
    `;

    function closeConfirm(confirmed) {
        backdrop.classList.remove("active");
        document.body.classList.remove("modal-open");
        setTimeout(() => {
            if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
            if (confirmed && onConfirm) onConfirm();
        }, 300);
    }

    document.getElementById("confirm-btn").addEventListener("click", () => closeConfirm(true));
    document.getElementById("cancel-btn").addEventListener("click", () => closeConfirm(false));
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeConfirm(false);
    });

    setTimeout(() => {
        backdrop.classList.add("active");
        document.body.classList.add("modal-open");
    }, 10);
}

function removeFromCart(category) {
    const currentCart = JSON.parse(localStorage.getItem('weddingCart') || '{}');
    if (currentCart[category]) {
        delete currentCart[category];
        localStorage.setItem('weddingCart', JSON.stringify(currentCart));
        return true;
    }
    return false;
}

// Function to get current cart data
function getCartData() {
    return JSON.parse(localStorage.getItem('weddingCart') || '{}');
}

// Function to clear cart (optional but useful)
function clearCart() {
    localStorage.removeItem('weddingCart');
}
