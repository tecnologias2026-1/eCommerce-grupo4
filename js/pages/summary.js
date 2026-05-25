document.addEventListener('DOMContentLoaded', function () {
    if (window.self !== window.top) {
        document.body.classList.add('is-popup');
    }
    renderSummary();
});

window.addEventListener('message', function (event) {
    if (event.data.type === 'CART_UPDATED') {
        renderSummary();
    }
});

function renderSummary() {
    var cart = getCartData();
    var summaryContainer = document.getElementById('dynamic-summary');
    var footer = document.getElementById('summary-footer');
    var actionBtn = document.getElementById('main-action-btn');
    var actionText = document.getElementById('action-btn-text');

    summaryContainer.innerHTML = '';

    var isIframe = window.self !== window.top;

    var totalBudget = 0;

    var checkIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="summary-checkmark-icon"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function parsePrice(priceStr) {
        if (typeof priceStr === 'number') return priceStr;
        return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    }

    if (cart.selectedVenue) {
        var venue = cart.selectedVenue;
        totalBudget += parsePrice(venue.price);

        var section = document.createElement('div');
        section.className = 'summary-section';
        section.innerHTML =
            '<h2 class="summary-section__title">LUGAR SELECCIONADO</h2>' +
            '<div class="summary-section__items">' +
                '<div class="summary-item">' +
                    '<div class="summary-checkmark">' + checkIcon + '</div>' +
                    '<div class="summary-item__content">' +
                        '<p class="summary-item__text">' + venue.name + '</p>' +
                        '<p class="summary-item__subtext">' + venue.guests + '</p>' +
                        '<p class="summary-item__subtext">' + venue.price + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="summary-image-box">' +
                '<img src="' + venue.image + '" alt="' + venue.name + '" class="summary-image-box__img">' +
            '</div>' +
            '<button class="summary-section__remove" data-remove-category="selectedVenue">Eliminar</button>';
        summaryContainer.appendChild(section);
    }

    function addSimpleCategory(category, title) {
        if (cart[category] && Object.keys(cart[category]).length > 0) {
            var section = document.createElement('div');
            section.className = 'summary-section';

            var itemsHtml = '';
            Object.values(cart[category]).forEach(function (item) {
                var itemTotal = item.totalPrice || parsePrice(item.price);
                totalBudget += itemTotal;
                itemsHtml +=
                    '<div class="summary-item">' +
                        '<div class="summary-checkmark">' + checkIcon + '</div>' +
                        '<div class="summary-item__content">' +
                            '<p class="summary-item__text">' + item.name + '</p>' +
                            '<p class="summary-item__subtext">' + (item.priceLabel || item.price) + (item.quantity ? ' - ' + item.quantity + ' unidad(es)' : '') + '</p>' +
                            (item.detail ? '<p class="summary-item__detail">' + item.detail + '</p>' : '') +
                        '</div>' +
                    '</div>' +
                    (item.image ? '<div class="summary-image-box" style="margin-top: 8px;"><img src="' + item.image + '" alt="' + item.name + '" class="summary-image-box__img"></div>' : '');
            });

            section.innerHTML =
                '<h2 class="summary-section__title">' + title + '</h2>' +
                '<div class="summary-section__items">' + itemsHtml + '</div>' +
                '<button class="summary-section__remove" data-remove-category="' + category + '">Eliminar</button>';
            summaryContainer.appendChild(section);
        }
    }

    addSimpleCategory('ceremony', 'CEREMONIA');
    addSimpleCategory('reception', 'RECEPCIÓN');
    addSimpleCategory('others', 'OTROS SERVICIOS');

    if (cart.food && Object.keys(cart.food).length > 0) {
        var foodSection = document.createElement('div');
        foodSection.className = 'summary-section';

        var foodHtml = '';
        Object.values(cart.food).forEach(function (item) {
            var qty = item.quantity || 1;
            var itemTotal = parsePrice(item.unitPrice) * qty;
            totalBudget += itemTotal;
            foodHtml +=
                '<div class="summary-item">' +
                    '<div class="summary-checkmark">' + checkIcon + '</div>' +
                    '<div class="summary-item__content">' +
                        '<p class="summary-item__text">' + item.name + '</p>' +
                        '<p class="summary-item__subtext">' + qty + ' personas - COL$ ' + itemTotal.toLocaleString('es-CO') + '</p>' +
                    '</div>' +
                '</div>' +
                (item.image ? '<div class="summary-image-box" style="margin-top: 8px;"><img src="' + item.image + '" alt="' + item.name + '" class="summary-image-box__img"></div>' : '');
        });

        foodSection.innerHTML =
            '<h2 class="summary-section__title">COMIDA</h2>' +
            '<div class="summary-section__items">' + foodHtml + '</div>' +
            '<button class="summary-section__remove" data-remove-category="food">Eliminar</button>';
        summaryContainer.appendChild(foodSection);
    }

    if (totalBudget > 0) {
        footer.classList.remove('summary-pago--hidden');
        document.getElementById('final-total').textContent = 'COL$ ' + totalBudget.toLocaleString('es-CO');

        var storedDate = localStorage.getItem('selectedWeddingDate');
        if (!storedDate && isIframe) {
            actionText.textContent = 'SELECCIONA UNA FECHA';
            actionBtn.style.opacity = '0.7';
            actionBtn.style.cursor = 'not-allowed';
            actionBtn.onclick = function (e) {
                e.preventDefault();
                alert('Para confirmar disponibilidad debe seleccionar la fecha aproximada de la boda en el inicio.');
                return false;
            };

            var warning = document.createElement('p');
            warning.className = 'summary-warning';
            warning.textContent = 'Para confirmar disponibilidad debe seleccionar la fecha aproximada de la boda en la página principal';
            summaryContainer.appendChild(warning);
        } else {
            actionBtn.style.opacity = '1';
            actionBtn.style.cursor = 'pointer';
            if (isIframe) {
                actionText.textContent = 'FINALIZAR COMPRA';
                actionBtn.onclick = function () { window.open('summary.html', '_blank'); };
            } else {
                actionText.textContent = 'CONTINUAR COMPRA';
                actionBtn.onclick = function () { window.location.href = 'payment.html'; };
            }
        }
    } else {
        summaryContainer.innerHTML = '<div class="empty-cart-message">Aún no has seleccionado nada para tu boda.</div>';
        footer.classList.add('summary-pago--hidden');
    }
}

function handleRemove(category) {
    showCustomConfirm(
        '¿ELIMINAR SELECCIÓN?',
        '¿Estás seguro de que deseas eliminar este lugar de tu selección?',
        function () {
            removeFromCart(category);
            renderSummary();
            window.parent.postMessage({ type: 'CART_UPDATED' }, '*');
        }
    );
}

document.addEventListener('DOMContentLoaded', function () {
    var summaryContainer = document.getElementById('dynamic-summary');
    if (!summaryContainer) return;

    summaryContainer.addEventListener('click', function (event) {
        var removeBtn = event.target.closest('.summary-section__remove[data-remove-category]');
        if (!removeBtn) return;
        handleRemove(removeBtn.dataset.removeCategory);
    });
});
