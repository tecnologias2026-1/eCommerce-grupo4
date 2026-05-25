(function () {
    /* ──── Helpers ──────────────────────────────── */
    function getCart() {
      return JSON.parse(localStorage.getItem('weddingCart') || '{}');
    }
    function saveCart(cart) {
      localStorage.setItem('weddingCart', JSON.stringify(cart));
      renderCart();
      syncItemStates();
      updateSectionLocks();
    }
    function fmt(n) {
      return 'COL$ ' + Number(n).toLocaleString('es-CO');
    }
    function raw(str) {
      return parseInt(String(str).replace(/[^\d]/g, '')) || 0;
    }

    /* ──── Cart render ──────────────────────────── */
    function renderCart() {
      var cart = getCart();
      var total = 0;
      var html = '';

      if (cart.selectedVenue) {
        var vp = raw(cart.selectedVenue.price);
        total += vp;
        html += cartSection('Lugar', [
          { name: cart.selectedVenue.name, detail: cart.selectedVenue.guests + ' invitados aprox', price: vp, cat: 'venue', id: null }
        ]);
      }

      if (cart.ceremony && Object.keys(cart.ceremony).length) {
        var citems = Object.values(cart.ceremony).map(function (i) {
          var p = raw(i.price); total += p;
          return { name: i.name, detail: i.detail || null, price: p, cat: 'ceremony', id: i.id };
        });
        html += cartSection('Ceremonia', citems);
      }

      if (cart.reception && Object.keys(cart.reception).length) {
        var ritems = Object.values(cart.reception).map(function (i) {
          var p = raw(i.price); total += p;
          return { name: i.name, detail: 'Recepción completa', price: p, cat: 'reception', id: i.id };
        });
        html += cartSection('Recepción', ritems);
      }

      if (cart.food && Object.keys(cart.food).length) {
        var fitems = Object.values(cart.food).map(function (i) {
          var tp = i.totalPrice || (parseInt(i.unitPrice) * (i.quantity || 1)); total += tp;
          return {
            name: i.name,
            detail: (i.quantity || 1) + ' persona' + ((i.quantity || 1) !== 1 ? 's' : '') + ' · ' + fmt(i.unitPrice) + ' c/u',
            price: tp, cat: 'food', id: i.id
          };
        });
        html += cartSection('Comida', fitems);
      }

      if (cart.others && Object.keys(cart.others).length) {
        var oitems = Object.values(cart.others).map(function (i) {
          var tp = i.totalPrice || (parseInt(i.unitPrice) * (i.quantity || 1)); total += tp;
          return {
            name: i.name,
            detail: (i.quantity || 1) > 1 ? 'Cantidad: ' + i.quantity : null,
            price: tp, cat: 'others', id: i.id
          };
        });
        html += cartSection('Otros', oitems);
      }

      document.getElementById('planner-total').textContent = fmt(total);
      var itemsHtml = html || '<p class="planner-cart__empty">Tu selección aparecerá aquí</p>';
      var container = document.getElementById('planner-cart-items');
      container.innerHTML = itemsHtml;
      var drawerList = document.getElementById('planner-drawer-list');
      if (drawerList) drawerList.innerHTML = itemsHtml;
    }

    function cartSection(title, items) {
      return '<div class="planner-cart__section">' +
        '<p class="planner-cart__section-lbl">' + title + '</p>' +
        items.map(function (item) {
          var delBtn = item.cat === 'venue'
            ? '<button class="planner-cart__row-del" onclick="plannerRemove(\'venue\',null)">×</button>'
            : '<button class="planner-cart__row-del" onclick="plannerRemove(\'' + item.cat + '\',\'' + item.id + '\')">×</button>';
          return '<div class="planner-cart__row">' +
            '<div class="planner-cart__row-info">' +
              '<p class="planner-cart__row-name">' + item.name + '</p>' +
              (item.detail ? '<p class="planner-cart__row-detail">' + item.detail + '</p>' : '') +
            '</div>' +
            '<span class="planner-cart__row-price">' + fmt(item.price) + '</span>' +
            delBtn +
          '</div>';
        }).join('') +
        '</div>';
    }

    /* ──── Public remove (called via onclick) ───── */
    window.plannerRemove = function (cat, id) {
      var cart = getCart();
      if (cat === 'venue') {
        delete cart.selectedVenue;
        delete cart.ceremony;
        delete cart.reception;
        delete cart.food;
        delete cart.others;
      } else if (cart[cat]) {
        delete cart[cat][id];
      }
      saveCart(cart);
      syncVenueCards();
    };

    /* ──── Section locks ─────────────────────────── */
    function hasDetalles() {
      var g = (document.getElementById('planner-guests') || {}).value || '';
      var d = (document.getElementById('planner-date') || {}).value || '';
      return g.trim() !== '' && d.trim() !== '';
    }

    function updateSectionLocks() {
      var det      = hasDetalles();
      var hasVenue = !!getCart().selectedVenue;

      var lugar = document.getElementById('section-lugar');
      if (lugar) lugar.classList.toggle('planner-section--locked', !det);

      ['ceremonia', 'recepcion', 'comida', 'otros'].forEach(function (id) {
        var s = document.getElementById('section-' + id);
        if (s) s.classList.toggle('planner-section--locked', !hasVenue);
      });

      updateNavLocks(det, hasVenue);
    }

    function updateNavLocks(det, hasVenue) {
      document.querySelectorAll('.planner-nav__item').forEach(function (item) {
        var t = item.dataset.target;
        if (t === 'section-detalles') {
          item.classList.remove('planner-nav__item--locked');
        } else if (t === 'section-lugar') {
          item.classList.toggle('planner-nav__item--locked', !det);
        } else {
          item.classList.toggle('planner-nav__item--locked', !hasVenue);
        }
      });
    }

    /* ──── Direct item select / deselect ────────── */
    function handleItemSelect(item, cat) {
      var cart = getCart();
      var id       = item.dataset.id;
      var name     = item.dataset.name;
      var priceRaw = parseInt(item.dataset.price) || 0;
      var isSel    = item.classList.contains('is-selected');

      if (isSel) {
        if (cart[cat]) delete cart[cat][id];
      } else {
        if (!cart[cat]) cart[cat] = {};
        if (cat === 'ceremony') {
          cart.ceremony = {};
          cart.ceremony[id] = { id: id, name: name, price: fmt(priceRaw) };
        } else if (cat === 'reception') {
          cart.reception = {};
          cart.reception[id] = { id: id, name: name, price: fmt(priceRaw) };
        } else if (cat === 'food') {
          cart.food[id] = { id: id, name: name, mode: 'full', quantity: 1, unitPrice: priceRaw, totalPrice: priceRaw };
        } else if (cat === 'others') {
          cart.others[id] = { id: id, name: name, quantity: 1, unitPrice: priceRaw, totalPrice: priceRaw, priceLabel: fmt(priceRaw) };
        }
      }

      saveCart(cart);
      updateInlineQtyDisplay(item, cat);
    }

    /* ──── Inline qty +/- on card ────────────────── */
    function handleInlineQty(item, cat, dir) {
      var cart = getCart();
      var id   = item.dataset.id;
      if (!cart[cat] || !cart[cat][id]) return;
      var entry    = cart[cat][id];
      var newQty   = Math.max(1, (entry.quantity || 1) + dir);
      var priceRaw = parseInt(item.dataset.price) || 0;
      entry.quantity   = newQty;
      entry.totalPrice = priceRaw * newQty;
      saveCart(cart);
      updateInlineQtyDisplay(item, cat);
    }

    function updateInlineQtyDisplay(item, cat) {
      var qtyVal = item.querySelector('.selection-item__qty-val');
      if (!qtyVal) return;
      var cart = getCart();
      var qty  = ((cart[cat] || {})[item.dataset.id] || {}).quantity || 1;
      qtyVal.textContent = qty;
    }

    /* ──── Sync item selected states ─────────────── */
    function syncItemStates() {
      var cart = getCart();
      var cer  = cart.ceremony || {};
      var rec  = cart.reception || {};
      var food = cart.food || {};
      var oth  = cart.others || {};

      document.querySelectorAll('#grid-ceremonia .selection-item').forEach(function (el) {
        el.classList.toggle('is-selected', !!cer[el.dataset.id]);
        updateInlineQtyDisplay(el, 'ceremony');
      });
      document.querySelectorAll('#grid-recepcion .selection-item').forEach(function (el) {
        el.classList.toggle('is-selected', !!rec[el.dataset.id]);
        updateInlineQtyDisplay(el, 'reception');
      });
      document.querySelectorAll('#grid-comida .selection-item').forEach(function (el) {
        el.classList.toggle('is-selected', !!food[el.dataset.id]);
        updateInlineQtyDisplay(el, 'food');
      });
      document.querySelectorAll('#grid-otros .selection-item').forEach(function (el) {
        el.classList.toggle('is-selected', !!oth[el.dataset.id]);
        updateInlineQtyDisplay(el, 'others');
      });
    }

    /* ──── Continue to payment ──────────────────────── */
    window.goToContinuar = function (e) {
      var guests = (document.getElementById('planner-guests').value || '').trim();
      var date   = (document.getElementById('planner-date').value || '').trim();
      if (!guests || !date) {
        if (typeof showCustomAlert === 'function') {
          showCustomAlert('Información incompleta', 'Por favor ingresa el número de invitados y la fecha de la boda antes de continuar.');
        } else {
          alert('Por favor ingresa el número de invitados y la fecha de la boda antes de continuar.');
        }
        return;
      }
      var notes = (document.getElementById('planner-notes-input') || {}).value || '';
      localStorage.setItem('selectedWeddingDate', date);
      localStorage.setItem('weddingNotes', notes);
      window.location.href = 'payment.html';
    };

    function syncVenueCards() {
      var cart = getCart();
      var selSlug = cart.selectedVenue ? cart.selectedVenue.slug : null;
      document.querySelectorAll('.planner-venue-card').forEach(function (c) {
        c.classList.toggle('is-selected', c.dataset.slug === selSlug);
      });
    }

    /* ──── Venue click ───────────────────────────── */
    function handleVenueClick(card) {
      var cart = getCart();
      var isSelected = card.classList.contains('is-selected');

      if (isSelected) {
        delete cart.selectedVenue;
        delete cart.ceremony;
        delete cart.reception;
        delete cart.food;
        delete cart.others;
        saveCart(cart);
        syncVenueCards();
        return;
      }

      var priceRaw = parseInt(card.dataset.price) || 0;
      cart.selectedVenue = {
        name:   card.dataset.name,
        slug:   card.dataset.slug,
        guests: card.dataset.guests + ' invitados aprox',
        price:  fmt(priceRaw),
        image:  card.querySelector('img').getAttribute('src')
      };

      saveCart(cart);
      syncVenueCards();
    }

    /* ──── Modal ─────────────────────────────────── */
    var modalItem    = null;
    var modalCat     = null;
    var modalIsVenue = false;

    function openModal(item, cat) {
      modalItem    = item;
      modalCat     = cat;
      modalIsVenue = false;

      var priceRaw = parseInt(item.dataset.price) || 0;
      var isFood   = cat === 'food';
      var hasQty   = isFood || cat === 'others';
      var isSelected = item.classList.contains('is-selected');

      document.getElementById('pm-img').src   = (item.querySelector('img') || {}).src || '';
      document.getElementById('pm-img').alt   = item.dataset.name;
      document.getElementById('pm-title').textContent = item.dataset.name;
      document.getElementById('pm-price').textContent = fmt(priceRaw) + (isFood ? ' / persona' : '');
      document.getElementById('pm-desc').textContent  = item.dataset.description || '';

      try {
        var feats = JSON.parse(item.dataset.features || '[]');
        document.getElementById('pm-features').innerHTML = feats.map(function (f) { return '<li>' + f + '</li>'; }).join('');
      } catch (e) { document.getElementById('pm-features').innerHTML = ''; }

      var qtySection = document.getElementById('pm-qty-section');
      if (hasQty) {
        qtySection.style.display = 'flex';
        var cart = getCart();
        var existing = (cart[cat] || {})[item.dataset.id];
        document.getElementById('pm-qty').value = existing ? existing.quantity : 1;
      } else {
        qtySection.style.display = 'none';
      }

      document.getElementById('pm-add-btn').textContent = isSelected ? 'QUITAR DEL CARRITO' : 'AGREGAR AL CARRITO';
      document.getElementById('planner-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function openVenueModal(card) {
      modalItem    = card;
      modalCat     = 'venue';
      modalIsVenue = true;

      var priceRaw   = parseInt(card.dataset.price) || 0;
      var isSelected = card.classList.contains('is-selected');

      document.getElementById('pm-img').src   = (card.querySelector('img') || {}).src || '';
      document.getElementById('pm-img').alt   = card.dataset.name;
      document.getElementById('pm-title').textContent = card.dataset.name;
      document.getElementById('pm-price').textContent = fmt(priceRaw);
      document.getElementById('pm-desc').textContent  = card.dataset.description || '';

      try {
        var feats = JSON.parse(card.dataset.features || '[]');
        document.getElementById('pm-features').innerHTML = feats.map(function (f) { return '<li>' + f + '</li>'; }).join('');
      } catch (e) { document.getElementById('pm-features').innerHTML = ''; }

      document.getElementById('pm-qty-section').style.display = 'none';
      document.getElementById('pm-add-btn').textContent = isSelected ? 'QUITAR SELECCIÓN' : 'SELECCIONAR HACIENDA';
      document.getElementById('planner-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      document.getElementById('planner-modal').classList.remove('active');
      document.body.style.overflow = '';
      modalItem    = null;
      modalCat     = null;
      modalIsVenue = false;
    }

    function modalConfirm() {
      if (!modalItem || !modalCat) return;

      if (modalIsVenue) {
        var venueCard = modalItem;
        closeModal();
        handleVenueClick(venueCard);
        return;
      }

      var cart = getCart();
      var id   = modalItem.dataset.id;
      var name = modalItem.dataset.name;
      var priceRaw = parseInt(modalItem.dataset.price) || 0;
      var isSelected = modalItem.classList.contains('is-selected');
      var cat = modalCat;

      if (isSelected) {
        if (cart[cat]) delete cart[cat][id];
      } else {
        if (!cart[cat]) cart[cat] = {};

        if (cat === 'ceremony') {
          cart.ceremony = {};
          cart.ceremony[id] = { id: id, name: name, price: fmt(priceRaw) };

        } else if (cat === 'reception') {
          cart.reception = {};
          cart.reception[id] = { id: id, name: name, price: fmt(priceRaw) };

        } else if (cat === 'food') {
          var qty = parseInt(document.getElementById('pm-qty').value) || 1;
          cart.food[id] = { id: id, name: name, mode: 'full', quantity: qty, unitPrice: priceRaw, totalPrice: priceRaw * qty };

        } else if (cat === 'others') {
          var qtyO = parseInt(document.getElementById('pm-qty').value) || 1;
          cart.others[id] = { id: id, name: name, quantity: qtyO, unitPrice: priceRaw, totalPrice: priceRaw * qtyO, priceLabel: fmt(priceRaw) };
        }
      }

      saveCart(cart);
      closeModal();
    }

    /* ──── Left nav scroll tracking ─────────────── */
    var sections = document.querySelectorAll('.planner-section');

    function updateNavActive() {
      var current = null;
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top <= 160) current = s.id;
      });
      if (!current) current = 'section-detalles';
      document.querySelectorAll('.planner-nav__item').forEach(function (item) {
        item.classList.toggle('planner-nav__item--active', item.dataset.target === current);
      });
    }

    /* ──── Init ──────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
      var storedGuests = localStorage.getItem('selectedGuests');
      if (storedGuests) document.getElementById('planner-guests').value = storedGuests;

      var storedDate = localStorage.getItem('selectedWeddingDate');
      if (storedDate) document.getElementById('planner-date').value = storedDate;

      syncVenueCards();
      syncItemStates();
      updateSectionLocks();
      renderCart();

      window.addEventListener('scroll', updateNavActive, { passive: true });
      updateNavActive();

      document.querySelectorAll('.planner-nav__item').forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          var target = document.getElementById(this.dataset.target);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      document.querySelectorAll('.planner-venue-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('[data-action="details"]')) return;
          handleVenueClick(card);
        });
      });

      document.querySelectorAll('.planner-venue-card .planner-venue-details-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          openVenueDetailsPopup(btn.closest('.planner-venue-card'));
        });
      });

      var catMap = { 'grid-ceremonia': 'ceremony', 'grid-recepcion': 'reception', 'grid-comida': 'food', 'grid-otros': 'others' };
      ['grid-ceremonia', 'grid-recepcion', 'grid-comida', 'grid-otros'].forEach(function (gridId) {
        var grid = document.getElementById(gridId);
        if (!grid) return;
        grid.addEventListener('click', function (e) {
          if (e.target.closest('[data-action="item-details"]')) {
            var item = e.target.closest('.selection-item');
            if (item) openModal(item, catMap[gridId]);
            return;
          }
          var qtyBtn = e.target.closest('.selection-item__qty-btn');
          if (qtyBtn) {
            var item = qtyBtn.closest('.selection-item');
            if (item) handleInlineQty(item, catMap[gridId], parseInt(qtyBtn.dataset.dir));
            return;
          }
          var item = e.target.closest('.selection-item');
          if (item) handleItemSelect(item, catMap[gridId]);
        });
      });

      document.getElementById('pm-close').addEventListener('click', closeModal);
      document.getElementById('planner-modal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
      });
      document.getElementById('pm-add-btn').addEventListener('click', modalConfirm);
      document.getElementById('pm-qty-minus').addEventListener('click', function () {
        var inp = document.getElementById('pm-qty');
        var v = parseInt(inp.value) || 1;
        if (v > 1) inp.value = v - 1;
      });
      document.getElementById('pm-qty-plus').addEventListener('click', function () {
        var inp = document.getElementById('pm-qty');
        inp.value = (parseInt(inp.value) || 1) + 1;
      });

      document.getElementById('planner-guests').addEventListener('input', function () {
        localStorage.setItem('selectedGuests', this.value);
        renderCart();
        updateSectionLocks();
      });

      document.getElementById('planner-date').addEventListener('change', function () {
        localStorage.setItem('selectedWeddingDate', this.value);
        updateSectionLocks();
      });

      var savedNotes = localStorage.getItem('weddingNotes') || '';
      var notesInput = document.getElementById('planner-notes-input');
      if (notesInput && savedNotes) notesInput.value = savedNotes;
      if (notesInput) {
        notesInput.addEventListener('input', function () {
          localStorage.setItem('weddingNotes', this.value);
        });
      }
    });

    /* ──── Venue details popup ───────────────────────── */
    var vdpCard = null;

    function openVenueDetailsPopup(card) {
      vdpCard = card;
      var priceRaw = parseInt(card.dataset.price) || 0;
      var guests   = parseInt(card.dataset.guests) || 100;
      var selGuests = parseInt(localStorage.getItem('selectedGuests')) || guests;
      var perGuest  = priceRaw / guests;
      var estimated = Math.round(perGuest * selGuests);

      document.getElementById('vdp-img').src = (card.querySelector('img') || {}).src || '';
      document.getElementById('vdp-name').textContent = card.dataset.name || '';
      document.getElementById('vdp-price').textContent = 'COL$ ' + priceRaw.toLocaleString('es-CO');
      document.getElementById('vdp-guests').textContent = card.dataset.guests + ' invitados aprox';
      document.getElementById('vdp-desc').textContent  = card.dataset.description || '';

      try {
        var feats = JSON.parse(card.dataset.features || '[]');
        document.getElementById('vdp-features').innerHTML = feats.map(function (f) {
          return '<div class="vdp-feature"><span class="vdp-feature__check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>' + f + '</span></div>';
        }).join('');
      } catch (e) { document.getElementById('vdp-features').innerHTML = ''; }

      document.getElementById('vdp-estimation').innerHTML =
        '<p class="vdp-estimation__title">Precio estimado para tu boda</p>' +
        '<div class="vdp-estimation__row"><span class="vdp-estimation__lbl">Invitados</span><span class="vdp-estimation__val">' + selGuests + '</span></div>' +
        '<div class="vdp-estimation__row"><span class="vdp-estimation__lbl">Precio base (' + guests + ' inv.)</span><span class="vdp-estimation__val">COL$ ' + priceRaw.toLocaleString('es-CO') + '</span></div>' +
        '<div class="vdp-estimation__row vdp-estimation__row--total"><span class="vdp-estimation__lbl">Total proyectado</span><span class="vdp-estimation__val vdp-estimation__val--total">COL$ ' + estimated.toLocaleString('es-CO') + '</span></div>';

      var isSelected = card.classList.contains('is-selected');
      var btn = document.getElementById('vdp-select-btn');
      btn.textContent = isSelected ? 'QUITAR SELECCIÓN' : 'SELECCIONAR HACIENDA';
      btn.classList.toggle('vdp-select-btn--selected', isSelected);

      document.getElementById('vdp-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeVenueDetailsPopup() {
      document.getElementById('vdp-modal').classList.remove('active');
      document.body.style.overflow = '';
      vdpCard = null;
    }

    document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('vdp-close').addEventListener('click', closeVenueDetailsPopup);
      document.getElementById('vdp-modal').addEventListener('click', function (e) {
        if (e.target === this) closeVenueDetailsPopup();
      });
      document.getElementById('vdp-select-btn').addEventListener('click', function () {
        if (!vdpCard) return;
        var card = vdpCard;
        closeVenueDetailsPopup();
        handleVenueClick(card);
      });
    });

    /* ──── Mobile cart drawer ────────────────────── */
    function openDrawer() {
      var drawer   = document.getElementById('planner-cart-drawer');
      var backdrop = document.getElementById('planner-drawer-backdrop');
      var cartTop  = document.querySelector('.planner-cart__top');
      if (drawer)   { drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); }
      if (backdrop) backdrop.classList.add('is-active');
      if (cartTop)  cartTop.classList.add('is-open');
    }

    function closeDrawer() {
      var drawer   = document.getElementById('planner-cart-drawer');
      var backdrop = document.getElementById('planner-drawer-backdrop');
      var cartTop  = document.querySelector('.planner-cart__top');
      if (drawer)   { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); }
      if (backdrop) backdrop.classList.remove('is-active');
      if (cartTop)  cartTop.classList.remove('is-open');
    }

    document.addEventListener('DOMContentLoaded', function () {
      function updateCartBarHeight() {
        var bar = document.querySelector('.planner-cart');
        if (!bar) return;
        document.documentElement.style.setProperty('--cart-bar-height', bar.offsetHeight + 'px');
      }
      updateCartBarHeight();
      window.addEventListener('resize', updateCartBarHeight);

      var cartTop = document.querySelector('.planner-cart__top');
      if (cartTop) {
        cartTop.addEventListener('click', function () {
          if (window.innerWidth > 768) return;
          var drawer = document.getElementById('planner-cart-drawer');
          if (!drawer) return;
          drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
        });
      }

      var drawerClose = document.getElementById('planner-drawer-close');
      if (drawerClose) drawerClose.addEventListener('click', function (e) { e.stopPropagation(); closeDrawer(); });

      var drawerBackdrop = document.getElementById('planner-drawer-backdrop');
      if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
    });
  })();
