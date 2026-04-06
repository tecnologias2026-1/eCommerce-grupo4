const LOGO_ONLY_PAGES = new Set([
    "index.html",
    "place.html",
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

    if (WORKFLOW_PAGES.has(pageName) && activeStep) {
        const currentStepIndex = STEP_SEQUENCE.indexOf(activeStep);
        navLinks.forEach((link) => {
            const step = link.dataset.step;
            const stepIndex = STEP_SEQUENCE.indexOf(step);
            const isBlocked = stepIndex > currentStepIndex + 1;

            if (isBlocked) {
                link.classList.add("nav__link--blocked");
                link.setAttribute("aria-disabled", "true");
                link.setAttribute("tabindex", "-1");
            }
        });
    }

    if (nav && !nav.dataset.linearNavBound) {
        nav.addEventListener("click", (event) => {
            const targetLink = event.target.closest("a[data-step]");
            if (!targetLink) {
                return;
            }

            if (targetLink.classList.contains("nav__link--blocked")) {
                event.preventDefault();
            }
        });
        nav.dataset.linearNavBound = "true";
    }
}

// Llamada a las funciones
document.addEventListener("DOMContentLoaded", () => {
    cargarComponente("header-placeholder", "header.html").then(() => {
        updateHeaderState();
    });
    cargarComponente("footer-placeholder", "footer.html");
});