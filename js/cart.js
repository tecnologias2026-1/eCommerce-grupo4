function addToCart(venueData) {
    const currentCart = JSON.parse(localStorage.getItem('weddingCart') || '{}');
    
    // Check if a venue is already selected
    if (currentCart.selectedVenue) {
        alert('Ya tienes un lugar seleccionado. Solo puedes agregar un venue a tu boda.');
        return;
    }

    // Save the selected venue
    currentCart.selectedVenue = venueData;
    localStorage.setItem('weddingCart', JSON.stringify(currentCart));
    
    alert('¡Lugar añadido al carrito con éxito!');
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
