const CookieConsent = (function () {
    const COOKIE_NAME = 'cookieConsent';
    const EXPIRY_DAYS = 365;

    function getCookie(name) {
        const match = document.cookie.split('; ').find(r => r.startsWith(name + '='));
        return match ? decodeURIComponent(match.split('=')[1]) : null;
    }

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }

    function hasConsent()  { return getCookie(COOKIE_NAME) === 'accepted'; }
    function hasDeclined() { return getCookie(COOKIE_NAME) === 'declined'; }
    function hasDecided()  { return getCookie(COOKIE_NAME) !== null; }

    function clearData() {
        localStorage.removeItem('weddingCart');
        localStorage.removeItem('selectedWeddingDate');
        localStorage.removeItem('selectedGuests');
    }

    function removeModal() {
        const el = document.getElementById('cookie-consent-backdrop');
        if (!el) return;
        el.classList.remove('cookie-consent--visible');
        setTimeout(() => el.remove(), 300);
        document.body.classList.remove('modal-open');
    }

    function accept() {
        setCookie(COOKIE_NAME, 'accepted', EXPIRY_DAYS);
        removeModal();
    }

    function decline() {
        setCookie(COOKIE_NAME, 'declined', EXPIRY_DAYS);
        clearData();
        removeModal();
    }

    function reset() {
        setCookie(COOKIE_NAME, '', -1);
        createModal();
    }

    function createModal() {
        const backdrop = document.createElement('div');
        backdrop.id = 'cookie-consent-backdrop';
        backdrop.className = 'cookie-consent-backdrop';
        backdrop.setAttribute('role', 'dialog');
        backdrop.setAttribute('aria-modal', 'true');
        backdrop.setAttribute('aria-labelledby', 'cookie-consent-title');

        backdrop.innerHTML = `
            <div class="cookie-consent-modal">
                <h2 class="cookie-consent-modal__title" id="cookie-consent-title">Cookies y privacidad</h2>
                <p class="cookie-consent-modal__text">
                    Usamos almacenamiento local para guardar tu selección de boda (lugar, fecha,
                    invitados y carrito). Si rechazas, no conservaremos ningún dato en tu dispositivo
                    y no podrás recuperar tu progreso entre sesiones.
                </p>
                <div class="cookie-consent-modal__actions">
                    <button class="cookie-consent-modal__btn cookie-consent-modal__btn--accept" id="cookie-accept-btn">
                        Aceptar
                    </button>
                    <button class="cookie-consent-modal__btn cookie-consent-modal__btn--decline" id="cookie-decline-btn">
                        Rechazar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.classList.add('modal-open');

        document.getElementById('cookie-accept-btn').addEventListener('click', accept);
        document.getElementById('cookie-decline-btn').addEventListener('click', decline);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            backdrop.classList.add('cookie-consent--visible');
        }));
    }

    function init() {
        if (window !== window.top) return;
        if (hasDecided()) return;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createModal);
        } else {
            createModal();
        }
    }

    return { init, hasConsent, hasDeclined, reset };
})();

CookieConsent.init();
