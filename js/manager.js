const LOGO_ONLY_PAGES = new Set([
    "index.html",
    "auth.html",
    "confirm.html",
    "reservations_view.html",
    "reservations.html",
    "reservcode.html",
    "weding1.html",
    "weding2.html",
    "weding3.html",
    "weding4.html",
]);

const WORKFLOW_PAGES = new Set([
    "place.html",
    "ceremony.html",
    "reception.html",
    "food.html",
    "others.html",
    "payment.html",
]);

const STEP_SEQUENCE = ["place", "ceremony", "reception", "food", "others", "payment"];

const STEP_BY_PAGE = {
    "place.html": "place",
    "ceremony.html": "ceremony",
    "reception.html": "reception",
    "food.html": "food",
    "others.html": "others",
    "payment.html": "payment",
};

function getCurrentPageName() {
    const rawPath = window.location.pathname || "";
    const cleanPath = rawPath.split("?")[0].split("#")[0].toLowerCase();
    const lastSegment = cleanPath.split("/").filter(Boolean).pop();
    return lastSegment || "index.html";
}

// Función para cargar componentes
function cargarComponente(id, url) {
    const target = document.getElementById(id);
    if (!target) {
        return Promise.resolve(null);
    }

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo cargar: " + url);
            }
            return response.text();
        })
        .then((data) => {
            target.innerHTML = data;
            return target;
        })
        .catch((error) => {
            console.error(error);
            return null;
        });
}

function updateHeaderState() {
    const header = document.querySelector("#header-placeholder .header");
    if (!header) {
        return;
    }

    const pageName = getCurrentPageName();
    const navLinks = header.querySelectorAll(".nav a[data-step]");
    const activeStep = STEP_BY_PAGE[pageName];
    const nav = header.querySelector(".nav");

    header.classList.remove("header--logo-only");

    if (LOGO_ONLY_PAGES.has(pageName)) {
        header.classList.add("header--logo-only");
    }

    navLinks.forEach((link) => {
        link.classList.remove("nav__link--active", "nav__link--blocked");
        link.removeAttribute("aria-disabled");
        link.removeAttribute("tabindex");
    });

    if (activeStep) {
        const activeLink = header.querySelector(`.nav a[data-step="${activeStep}"]`);
        if (activeLink) {
            activeLink.classList.add("nav__link--active");
        }
    }

    // Add click listener to the cart to open summary popup
    const cart = header.querySelector(".cart");
    if (cart) {
        cart.addEventListener("click", () => {
            if (typeof showSummaryPopup === "function") {
                showSummaryPopup();
            }
        });
    }
}

// Llamada a las funciones
document.addEventListener("DOMContentLoaded", () => {
    cargarComponente("header-placeholder", "header.html").then(() => {
        updateHeaderState();
        updateHeaderPrice();
    });
    cargarComponente("footer-placeholder", "footer.html");
});

function showSummaryPopup() {
    let backdrop = document.querySelector(".summary-modal-backdrop");
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "summary-modal-backdrop active";
        document.body.appendChild(backdrop);
    }
    
    backdrop.innerHTML = `
        <div class="summary-popup">
            <button class="summary-popup__close" id="close-summary-btn">&times;</button>
            <div class="summary-popup__content">
                <iframe src="/assets/public/summary.html" class="summary-popup__iframe"></iframe>
            </div>
        </div>
    `;

    function closeSummary() {
        backdrop.classList.remove("active");
        document.body.classList.remove("modal-open");
        setTimeout(() => {
            if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        }, 300);
    }

    document.getElementById("close-summary-btn").addEventListener("click", closeSummary);
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeSummary();
    });

    document.body.classList.add("modal-open");
}

function updateHeaderPrice() {
    const cart = JSON.parse(localStorage.getItem('weddingCart') || '{}');
    const priceElement = document.querySelector('.cart-amount');
    if (priceElement) {
        if (cart.selectedVenue) {
            priceElement.textContent = cart.selectedVenue.price;
        } else {
            priceElement.textContent = 'COL$ 0';
        }
    }
}

window.addEventListener('message', (event) => {
    if (event.data.type === 'CART_UPDATED') {
        updateHeaderPrice();
    }
});