class VenueHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "PAZ DEL RÍO";
    const price = this.getAttribute("price") || "COL$ 0.000";
    const guests = this.getAttribute("guests") || "0 invitados";

    this.innerHTML = `
      <header class="hero-selection__top" style="padding: 80px var(--space-3xl) 20px; background: var(--bg); position: relative; border-bottom: 1px solid var(--border);">
        <a href="place.html" class="back-btn" aria-label="Atrás">
          <img alt="" src="../images/atras.svg" class="back-btn__icon" aria-hidden="true" />
        </a>
        <h1 class="hero-selection__title">${title}</h1>
        <button class="hero-cart-btn" id="open-cart-modal" aria-label="Ver resumen">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C21.05 5.17 21.13 4.84 21.13 4.5C21.13 3.4 20.23 2.5 19.13 2.5H5.21L4.27 0.5H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
          </svg>
        </button>
      </header>
      <div style="text-align: center; margin-top: 20px; font-family: var(--font-primary); font-weight: 600; font-size: 24px; color: var(--muted);">
        <span>${price}</span> • <span>${guests}</span>
      </div>
    `;

    this.querySelector("#open-cart-modal").addEventListener("click", () => {
      if (typeof showSummaryPopup === 'function') {
          showSummaryPopup();
      } else {
          console.error("showSummaryPopup is not defined. Make sure manager.js is loaded.");
      }
    });
  }
}

customElements.define("venue-header", VenueHeader);

class VenueVideo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const src = this.getAttribute("src") || "";

    this.innerHTML = `
      <section class="venue-video-container">
        <div class="venue-video-wrapper">
          <video class="venue-video" autoplay loop muted playsinline>
            <source src="${src}" type="video/mp4">
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      </section>
    `;
  }
}

customElements.define("venue-video", VenueVideo);
