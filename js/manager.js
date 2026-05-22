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
        updateHeaderPrice();
        initGlobalGuestSelector();
    });
    cargarComponente("footer-placeholder", getPublicPagePath("footer.html")).then((target) => {
        normalizeImageSources(target);
        updateFooterState();
    });
});

function initGlobalGuestSelector() {
    const globalGuestInput = document.getElementById('global-guest-count');
    if (!globalGuestInput) return;

    // Load initial value
    const storedGuests = localStorage.getItem('selectedGuests');
    if (storedGuests) {
        globalGuestInput.value = storedGuests;
    }

    // Dispatch initial event so venue-filter.js runs right away with stored value
    window.dispatchEvent(new CustomEvent('guestsChanged'));

    globalGuestInput.addEventListener('input', () => {
        if (typeof CookieConsent === 'undefined' || CookieConsent.hasConsent()) {
            localStorage.setItem('selectedGuests', globalGuestInput.value);
        }
        updateHeaderPrice();
        // Dispatch event for local scripts to react (like venue-filter.js)
        window.dispatchEvent(new CustomEvent('guestsChanged'));
    });
}

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

function updateHeaderPrice() {
    const cart = JSON.parse(localStorage.getItem('weddingCart') || '{}');
    const badge = document.getElementById('cart-badge');
    const totalEl = document.getElementById('cart-total');
    if (!badge) return;

    let count = 0;
    let total = 0;

    function parsePrice(priceStr) {
        if (typeof priceStr === 'number') return priceStr;
        return parseInt(String(priceStr).replace(/[^0-9]/g, "")) || 0;
    }

    if (cart.selectedVenue) {
        count++;
        total += parsePrice(cart.selectedVenue.price);
    }
    if (cart.ceremony) {
        const items = Object.values(cart.ceremony);
        count += items.length;
        items.forEach(item => { total += parsePrice(item.price); });
    }
    if (cart.reception) {
        const items = Object.values(cart.reception);
        count += items.length;
        items.forEach(item => { total += parsePrice(item.price); });
    }
    if (cart.food) {
        const items = Object.values(cart.food);
        count += items.length;
        items.forEach(item => {
            total += parsePrice(item.unitPrice) * (item.quantity || 1);
        });
    }
    if (cart.others) {
        const items = Object.values(cart.others);
        count += items.length;
        items.forEach(item => { total += item.totalPrice || parsePrice(item.price); });
    }

    badge.textContent = count;
    badge.dataset.count = count;
    if (totalEl) {
        totalEl.textContent = total > 0 ? 'COL$ ' + total.toLocaleString('es-CO') : 'COL$ 0';
    }
}

window.addEventListener('message', (event) => {
    if (event.data.type === 'CART_UPDATED') {
        updateHeaderPrice();
    }
    if (event.data.type === 'SHOW_CART') {
        showSummaryPopup();
    }
});

window.addEventListener('storage', (event) => {
    if (event.key === 'weddingCart' || event.key === 'selectedGuests') {
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

// Premium Smooth Scroll Momentum (Inertial Scrolling)
(function initPremiumSmoothScroll() {
    // Only apply on non-touch devices for native feel on mobile/tablet
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Dynamically disable native smooth scroll to avoid double-animation fight/stutter
    document.documentElement.style.scrollBehavior = "auto";

    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let isScrolling = false;
    
    // Luxury scrolling parameters:
    // LOWER ease factor = longer, softer, more luxurious momentum glide.
    // LOWER multiplier = slower, highly elegant scroll speed per wheel click.
    const ease = 0.035; // Highly noticeable, silky deceleration glide (previous: 0.046)
    const multiplier = 1.15; // Effortless and responsive scroll distance per tick (previous: 0.88)

    function updateScroll() {
        const diff = targetScrollY - currentScrollY;
        if (Math.abs(diff) > 0.3) {
            currentScrollY += diff * ease;
            window.scrollTo(0, currentScrollY);
            requestAnimationFrame(updateScroll);
        } else {
            currentScrollY = targetScrollY;
            window.scrollTo(0, currentScrollY);
            isScrolling = false;
        }
    }

    window.addEventListener("wheel", (e) => {
        // Do not intercept if scrolling inside an element with overflow (e.g. textareas or sliders)
        const path = e.composedPath();
        for (let i = 0; i < path.length; i++) {
            const el = path[i];
            if (el === document.body || el === document || el === window) break;
            if (el.scrollHeight > el.clientHeight) {
                const overflowY = window.getComputedStyle(el).overflowY;
                if (overflowY === 'auto' || overflowY === 'scroll') {
                    return; // Let native scrolling handle it
                }
            }
        }

        e.preventDefault();

        // Calculate target scroll position based on delta
        targetScrollY += e.deltaY * multiplier;

        // Clamp values to body bounds
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));

        if (!isScrolling) {
            isScrolling = true;
            currentScrollY = window.scrollY;
            requestAnimationFrame(updateScroll);
        }
    }, { passive: false });

    // Sync targets on user drag scroll or keyboard scroll
    window.addEventListener("scroll", () => {
        if (!isScrolling) {
            targetScrollY = window.scrollY;
            currentScrollY = window.scrollY;
        }
    });

    // Custom smooth scroll animation for internal anchor links (like #about-us)
    // This provides a beautiful, slow, elegant glide when navigating between sections.
    document.addEventListener("click", (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (!href) return;

        // Check if it's a hash link pointing to an element on the current page
        let targetId = "";
        if (href.startsWith("#")) {
            targetId = href;
        } else if (href.includes("#")) {
            try {
                const url = new URL(href, window.location.href);
                if (url.pathname === window.location.pathname || url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '')) {
                    targetId = url.hash;
                }
            } catch (err) {
                // Fail-safe for invalid URLs
            }
        }

        if (targetId && targetId !== "#") {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Get absolute vertical position of target
                const targetY = targetElement.getBoundingClientRect().top + window.scrollY;
                
                // Animate to target scroll position with custom timing for premium aesthetic
                animateScrollTo(targetY, 1200); // 1.2 seconds elegant slow glide
            }
        }
    });

    // Elegant scroll animation with cubic ease-in-out easing
    function animateScrollTo(destinationY, duration) {
        const startY = window.scrollY;
        const difference = destinationY - startY;
        const startTime = performance.now();

        isScrolling = true;

        function scrollStep(timestamp) {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Cubic Ease-In-Out formula
            const easeProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const nextScrollY = startY + difference * easeProgress;
            window.scrollTo(0, nextScrollY);

            // Update momentum variables to avoid jarring jumps if wheeling right after click
            currentScrollY = nextScrollY;
            targetScrollY = nextScrollY;

            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            } else {
                isScrolling = false;
            }
        }

        requestAnimationFrame(scrollStep);
    }
})();

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