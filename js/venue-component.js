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
        <a href="/assets/public/place.html" class="venue-close-btn" aria-label="Volver a lugares">
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.5 11.5L11.5 34.5M11.5 11.5L34.5 34.5" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </header>
    `;
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

class VenueCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const imgSrc = this.getAttribute("img-src") || "";
    const title = this.getAttribute("title") || "";

    this.innerHTML = `
      <div class="venue-card">
        <div class="venue-card__image-container">
          <img class="venue-card__image" src="${imgSrc}" alt="${title}">
        </div>
        <h2 class="venue-card__title">${title}</h2>
      </div>
    `;
  }
}

customElements.define("venue-card", VenueCard);
