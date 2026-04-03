class VenueHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "PAZ DEL RÍO";
    const price = this.getAttribute("price") || "COL$ 0.000";
    const guests = this.getAttribute("guests") || "0 invitados";

    this.innerHTML = `
      <header class="venue-header">
        <div class="venue-details">
          <h1 class="venue-title">${title}</h1>
          <div class="venue-info-row">
            <span class="venue-price">${price}</span>
            <button class="venue-info-btn" aria-label="Información adicional">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <p class="venue-guests">${guests}</p>
        </div>
        <div class="header-controls">
          <button class="venue-cart-btn" id="open-cart-modal" aria-label="Ver resumen de compra">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C21.05 5.17 21.13 4.84 21.13 4.5C21.13 3.4 20.23 2.5 19.13 2.5H5.21L4.27 0.5H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
            </svg>
          </button>
          <a href="/assets/public/place.html" class="venue-close-btn" aria-label="Volver a lugares">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.5 11.5L11.5 34.5M11.5 11.5L34.5 34.5" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </header>
    `;

    this.querySelector("#open-cart-modal").addEventListener("click", () => {
      this.openModal();
    });
  }

  openModal() {
    let backdrop = document.querySelector(".cart-modal-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "cart-modal-backdrop";
      backdrop.innerHTML = `
        <div class="cart-modal">
          <button class="cart-modal__close" id="close-cart-modal">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="black"/>
            </svg>
          </button>
          <iframe src="/assets/public/summary.html"></iframe>
        </div>
      `;
      document.body.appendChild(backdrop);

      backdrop.querySelector("#close-cart-modal").addEventListener("click", () => {
        this.closeModal(backdrop);
      });

      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.closeModal(backdrop);
      });
    }

    setTimeout(() => {
      backdrop.classList.add("active");
      document.body.classList.add("modal-open");
    }, 10);
  }

  closeModal(backdrop) {
    backdrop.classList.remove("active");
    document.body.classList.remove("modal-open");
    // We could remove it from DOM after transition if we want, but keeping it is fine too.
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
