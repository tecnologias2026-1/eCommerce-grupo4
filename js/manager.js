const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/v1'
    : 'https://back-eventosdecoraciones.onrender.com/api/v1';

function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

async function apiFetch(path) {
    const res = await fetch(API_BASE + path, { headers: getAuthHeaders() });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw Object.assign(new Error(err.error || 'API error ' + res.status), { status: res.status, data: err });
    }
    return res.json();
}

async function apiRequest(method, path, body) {
    const res = await fetch(API_BASE + path, {
        method,
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: body != null ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw Object.assign(new Error(err.error || 'API error ' + res.status), { status: res.status, data: err });
    }
    return res.json();
}


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

function normalizeStylesheetLinks() {
    const expectedBase = `${getProjectRootPath()}css/`;
    const stylesheetMap = {
        "global.css": `${expectedBase}global.css`,
        "media.css": `${expectedBase}media.css`,
    };

    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

    links.forEach((link) => {
        const rawHref = link.getAttribute("href") || "";
        const matchedFile = Object.keys(stylesheetMap).find((fileName) => rawHref.toLowerCase().includes(fileName));
        if (!matchedFile) {
            return;
        }

        const resolved = new URL(rawHref, window.location.href);
        const expectedHref = stylesheetMap[matchedFile];

        if (!resolved.pathname.startsWith(expectedBase)) {
            link.setAttribute("href", expectedHref);
        }
    });
}

function normalizeImageSources(scopeElement) {
    const rootPath = getProjectRootPath();
    const scope = scopeElement || document;
    const images = Array.from(scope.querySelectorAll('img[src^="/assets/"]'));

    images.forEach((image) => {
        const rawSrc = image.getAttribute("src") || "";
        if (!rawSrc.startsWith("/assets/")) {
            return;
        }

        image.setAttribute("src", `${rootPath}${rawSrc.slice(1)}`);
    });
}

normalizeStylesheetLinks();

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
    if (!header) return;

    const logoLink = header.querySelector(".logo");
    if (logoLink) logoLink.setAttribute("href", getHomePath());

    const reservBtn = header.querySelector("[data-header-btn='reserva']");
    if (reservBtn) reservBtn.setAttribute("href", getPublicPagePath("reservcode.html"));

    const loginBtn = header.querySelector("[data-header-btn='login']");
    if (loginBtn) loginBtn.setAttribute("href", getPublicPagePath("auth.html"));
}

function updateFooterState() {
    const footer = document.querySelector("#footer-placeholder .footer");
    if (!footer) {
        return;
    }

    const links = footer.querySelectorAll("a");
    links.forEach((link) => {
        const href = (link.getAttribute("href") || "").toLowerCase();

        if (href.includes("auth.html")) {
            link.setAttribute("href", getPublicPagePath("auth.html"));
            return;
        }
    });
}

// Llamada a las funciones
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.search.includes('popup=true')) {
        document.body.classList.add('is-popup');
        
        // Intercept close button clicks inside iframe to notify parent window
        const closeBtn = document.querySelector(".wedding-header__close");
        if (closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                window.parent.postMessage({ type: 'CLOSE_WEDDING_MODAL' }, '*');
            });
        }
    }
    
    initVenueGalleries();
    initWeddingCardsModal();

    cargarComponente("header-placeholder", getPublicPagePath("header.html")).then((target) => {
        normalizeImageSources(target);
        updateHeaderState();
    });
    cargarComponente("footer-placeholder", getPublicPagePath("footer.html")).then((target) => {
        normalizeImageSources(target);
        updateFooterState();
    });
});


function initVenueGalleries() {
    const grids = document.querySelectorAll('.venue-features-grid');
    grids.forEach(grid => {
        const wrapper = document.createElement('div');
        wrapper.className = 'venue-gallery-wrapper';
        
        grid.parentNode.insertBefore(wrapper, grid);
        wrapper.appendChild(grid);
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&#10094;';
        prevBtn.className = 'venue-gallery-btn prev-btn';
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&#10095;';
        nextBtn.className = 'venue-gallery-btn next-btn';
        
        wrapper.appendChild(prevBtn);
        wrapper.appendChild(nextBtn);
        
        let currentIndex = 0;
        const cards = Array.from(grid.children);
        
        function updateScroll() {
            grid.scrollTo({
                left: currentIndex * grid.clientWidth,
                behavior: 'smooth'
            });
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = cards.length - 1;
            }
            updateScroll();
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateScroll();
        });
        
        window.addEventListener('resize', () => {
            grid.scrollTo({ left: currentIndex * grid.clientWidth, behavior: 'instant' });
        });
    });
}

function formatCurrency(amount) {
    return 'COL$ ' + amount.toLocaleString('es-CO');
}

function parsePrice(strip) {
    if (typeof strip !== 'string') return 0;
    return parseInt(strip.replace(/[^\d]/g, '')) || 0;
}

document.addEventListener("DOMContentLoaded", function preloadCart() {
    var backdrop = document.createElement("div");
    backdrop.className = "summary-modal-backdrop";
    backdrop.innerHTML = `
        <div class="summary-popup">
            <button class="summary-popup__close" id="close-summary-btn">&times;</button>
            <div class="summary-popup__content">
                <iframe src="${getPublicPagePath("summary.html")}" class="summary-popup__iframe"></iframe>
            </div>
        </div>
    `;
    document.body.appendChild(backdrop);

    function closeSummary() {
        backdrop.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    backdrop.querySelector("#close-summary-btn").addEventListener("click", closeSummary);
    backdrop.addEventListener("click", function(e) {
        if (e.target === backdrop) closeSummary();
    });
});

function showSummaryPopup() {
    var backdrop = document.querySelector(".summary-modal-backdrop");
    if (!backdrop) return;

    backdrop.classList.add("active");
    document.body.classList.add("modal-open");

    var iframe = backdrop.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'CART_UPDATED' }, '*');
    }
}

window.addEventListener('message', (event) => {
    if (event.data.type === 'SHOW_CART') {
        showSummaryPopup();
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
            <button class="notification-modal__btn" id="close-alert-btn">Aceptar</button>
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
                <button class="notification-modal__btn notification-modal__btn--danger" id="confirm-btn">Eliminar</button>
                <button class="notification-modal__btn" id="cancel-btn" style="background: #666;">Cancelar</button>
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

function initWeddingCardsModal() {
    const weddingLinks = document.querySelectorAll(".boda-card__link");
    weddingLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            showWeddingModal(href);
        });
    });

    // Listen to messages from the iframe to close the modal
    window.addEventListener("message", (event) => {
        if (event.data.type === 'CLOSE_WEDDING_MODAL') {
            closeWeddingModal();
        }
    });
}

function showWeddingModal(url) {
    let backdrop = document.querySelector(".wedding-modal-backdrop");
    if (backdrop) {
        const iframe = backdrop.querySelector('iframe');
        if (iframe) {
            iframe.src = `${url}?popup=true`;
        }
        backdrop.classList.add("active");
        document.body.classList.add("modal-open");
        return;
    }

    backdrop = document.createElement("div");
    backdrop.className = "wedding-modal-backdrop";
    document.body.appendChild(backdrop);

    backdrop.innerHTML = `
        <div class="wedding-popup">
            <button class="wedding-popup__close" id="close-wedding-btn" aria-label="Cerrar">&times;</button>
            <div class="wedding-popup__content">
                <iframe src="${url}?popup=true" class="wedding-popup__iframe"></iframe>
            </div>
        </div>
    `;

    // Trigger transition
    setTimeout(() => {
        backdrop.classList.add("active");
        document.body.classList.add("modal-open");
    }, 10);

    const closeBtn = backdrop.querySelector("#close-wedding-btn");
    closeBtn.addEventListener("click", closeWeddingModal);
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
            closeWeddingModal();
        }
    });
}

function closeWeddingModal() {
    const backdrop = document.querySelector(".wedding-modal-backdrop");
    if (backdrop) {
        backdrop.classList.remove("active");
        document.body.classList.remove("modal-open");
        setTimeout(() => {
            if (backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }
        }, 400);
    }
}