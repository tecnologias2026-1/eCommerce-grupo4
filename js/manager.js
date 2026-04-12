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

const PAGE_BY_STEP = {
    place: "place.html",
    ceremony: "ceremony.html",
    reception: "reception.html",
    food: "food.html",
    others: "others.html",
    payment: "payment.html",
};

function getCurrentPageName() {
    const rawPath = window.location.pathname || "";
    const cleanPath = rawPath.split("?")[0].split("#")[0].toLowerCase();
    const lastSegment = cleanPath.split("/").filter(Boolean).pop();
    return lastSegment || "index.html";
}

function isPublicPage() {
    const rawPath = window.location.pathname || "";
    const cleanPath = rawPath.split("?")[0].split("#")[0].toLowerCase();
    return cleanPath.includes("/assets/public/");
}

function getProjectRootPath() {
    const rawPath = window.location.pathname || "/";
    const cleanPath = rawPath.split("?")[0].split("#")[0];
    const segments = cleanPath.split("/").filter(Boolean);

    const assetsIndex = segments.findIndex((segment) => segment.toLowerCase() === "assets");
    if (assetsIndex > -1 && segments[assetsIndex + 1] && segments[assetsIndex + 1].toLowerCase() === "public") {
        const rootSegments = segments.slice(0, assetsIndex);
        return rootSegments.length ? `/${rootSegments.join("/")}/` : "/";
    }

    const lastSegment = segments[segments.length - 1] || "";
    const isFilePath = lastSegment.includes(".");
    const rootSegments = isFilePath ? segments.slice(0, -1) : segments;
    return rootSegments.length ? `/${rootSegments.join("/")}/` : "/";
}

function getPublicPagePath(pageName) {
    return `${getProjectRootPath()}assets/public/${pageName}`;
}

function getHomePath(anchor) {
    const hash = anchor ? `#${anchor}` : "";
    return `${getProjectRootPath()}index.html${hash}`;
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
    const logoLink = header.querySelector(".logo");

    if (logoLink) {
        logoLink.setAttribute("href", getHomePath());
    }

    header.classList.remove("header--logo-only");

    if (LOGO_ONLY_PAGES.has(pageName)) {
        header.classList.add("header--logo-only");
    }

    navLinks.forEach((link) => {
        const step = link.dataset.step;
        const stepPage = step ? PAGE_BY_STEP[step] : null;
        if (stepPage) {
            link.setAttribute("href", getPublicPagePath(stepPage));
        }

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

function updateFooterState() {
    const footer = document.querySelector("#footer-placeholder .footer");
    if (!footer) {
        return;
    }

    const links = footer.querySelectorAll("a");
    links.forEach((link) => {
        const href = (link.getAttribute("href") || "").toLowerCase();

        if (href.includes("place.html")) {
            link.setAttribute("href", getPublicPagePath("place.html"));
            return;
        }

        if (href.includes("auth.html")) {
            link.setAttribute("href", getPublicPagePath("auth.html"));
            return;
        }

        if (href.includes("index.html#about-us") || href === "#about-us") {
            link.setAttribute("href", getHomePath("about-us"));
        }
    });
}

// Llamada a las funciones
document.addEventListener("DOMContentLoaded", () => {
    cargarComponente("header-placeholder", getPublicPagePath("header.html")).then(() => {
        updateHeaderState();
        updateHeaderPrice();
    });
    cargarComponente("footer-placeholder", getPublicPagePath("footer.html")).then(() => {
        updateFooterState();
    });
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
                <iframe src="${getPublicPagePath("summary.html")}" class="summary-popup__iframe"></iframe>
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

    const closeBtn = document.getElementById("close-alert-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeAlert);
    
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

    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    if (confirmBtn) confirmBtn.addEventListener("click", () => closeConfirm(true));
    if (cancelBtn) cancelBtn.addEventListener("click", () => closeConfirm(false));
    
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeConfirm(false);
    });

    setTimeout(() => {
        backdrop.classList.add("active");
        document.body.classList.add("modal-open");
    }, 10);
}