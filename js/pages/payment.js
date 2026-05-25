(function () {

    /* ──── Helpers ─────────────────────────────────── */
    function getCart() { return JSON.parse(localStorage.getItem('weddingCart') || '{}'); }
    function fmt(n) { return 'COL$ ' + Number(n).toLocaleString('es-CO'); }
    function raw(str) { return parseInt(String(str).replace(/[^\d]/g, '')) || 0; }

    /* ──── Planner nav states ──────────────────────── */
    function initPlannerNav() {
      var cart = getCart();
      var states = {
        lugar:     !!cart.selectedVenue,
        ceremonia: !!(cart.ceremony && Object.keys(cart.ceremony).length),
        recepcion: !!(cart.reception && Object.keys(cart.reception).length),
        comida:    !!(cart.food && Object.keys(cart.food).length),
        otros:     !!(cart.others && Object.keys(cart.others).length)
      };
      Object.keys(states).forEach(function (k) {
        var el = document.getElementById('pnav-' + k);
        if (!el) return;
        el.classList.remove('planner-nav__item--locked', 'planner-nav__item--done');
        el.classList.add(states[k] ? 'planner-nav__item--done' : 'planner-nav__item--locked');
      });
    }

    /* ──── Summary render ──────────────────────────── */
    function renderSummary() {
      var cart  = getCart();
      var total = 0;
      var html  = '';

      if (cart.selectedVenue) {
        var vp = raw(cart.selectedVenue.price); total += vp;
        html += summarySection('Lugar', [{ name: cart.selectedVenue.name, detail: cart.selectedVenue.guests, price: vp }]);
      }
      if (cart.ceremony && Object.keys(cart.ceremony).length) {
        var ci = Object.values(cart.ceremony).map(function (i) {
          var p = raw(i.price); total += p;
          return { name: i.name, detail: null, price: p };
        });
        html += summarySection('Ceremonia', ci);
      }
      if (cart.reception && Object.keys(cart.reception).length) {
        var ri = Object.values(cart.reception).map(function (i) {
          var p = raw(i.price); total += p;
          return { name: i.name, detail: 'Recepción', price: p };
        });
        html += summarySection('Recepción', ri);
      }
      if (cart.food && Object.keys(cart.food).length) {
        var fi = Object.values(cart.food).map(function (i) {
          var tp = i.totalPrice || (parseInt(i.unitPrice) * (i.quantity || 1)); total += tp;
          return { name: i.name, detail: (i.quantity || 1) + ' pers. · ' + fmt(i.unitPrice) + ' c/u', price: tp };
        });
        html += summarySection('Comida', fi);
      }
      if (cart.others && Object.keys(cart.others).length) {
        var oi = Object.values(cart.others).map(function (i) {
          var tp = i.totalPrice || (parseInt(i.unitPrice) * (i.quantity || 1)); total += tp;
          return { name: i.name, detail: (i.quantity || 1) > 1 ? 'x' + i.quantity : null, price: tp };
        });
        html += summarySection('Servicios adicionales', oi);
      }

      document.getElementById('pay-total-val').textContent = fmt(total);
      var el = document.getElementById('pay-summary-items');
      el.innerHTML = html || '<p class="pay-summary__empty">Sin selecciones</p>';

      var notes = localStorage.getItem('weddingNotes') || '';
      var notesWrap = document.getElementById('pay-summary-notes');
      if (notes.trim()) {
        document.getElementById('pay-summary-notes-text').textContent = notes;
        notesWrap.style.display = 'block';
      } else {
        notesWrap.style.display = 'none';
      }

      return total;
    }

    function summarySection(title, items) {
      return '<div class="pay-summary__section">' +
        '<p class="pay-summary__section-lbl">' + title + '</p>' +
        items.map(function (it) {
          return '<div class="pay-summary__row">' +
            '<div><p class="pay-summary__row-name">' + it.name + '</p>' +
            (it.detail ? '<p class="pay-summary__row-detail">' + it.detail + '</p>' : '') +
            '</div><span class="pay-summary__row-price">' + fmt(it.price) + '</span></div>';
        }).join('') + '</div>';
    }

    /* ──── Deposit info panel ──────────────────────── */
    function renderDepositInfo(total) {
      var minimo = Math.round(total * 0.5);
      document.getElementById('pay-deposit').placeholder = fmt(minimo) + ' (mínimo 50%)';
      document.getElementById('pay-deposit').dataset.minimo = minimo;
      document.getElementById('pay-deposit').dataset.total  = total;

      document.getElementById('pay-deposit-info').innerHTML =
        '<p class="pay-deposit-info__title">Resumen de cobro</p>' +
        '<div class="pay-deposit-info__row"><span class="pay-deposit-info__lbl">Total de la reserva</span><span class="pay-deposit-info__val">' + fmt(total) + '</span></div>' +
        '<div class="pay-deposit-info__row"><span class="pay-deposit-info__lbl">Abono mínimo (50%)</span><span class="pay-deposit-info__val accent">' + fmt(minimo) + '</span></div>';
    }

    /* ──── Step navigation ─────────────────────────── */
    var completedSteps = {};
    var currentStep = 'contacto';
    var stepOrder    = ['contacto', 'pago', 'confirmacion'];

    window.goToStep = function (step) {
      if (step === 'pago' && !validateContacto()) return;
      if (step === 'confirmacion' && !validatePago()) return;

      document.querySelectorAll('.pay-step').forEach(function (s) {
        s.classList.remove('pay-step--active');
      });
      var target = document.getElementById('pay-step-' + step);
      if (target) target.classList.add('pay-step--active');

      var stepIndex = stepOrder.indexOf(step);
      stepOrder.forEach(function (s, i) {
        var navEl = document.getElementById('pnav-' + s);
        if (!navEl) return;
        navEl.classList.remove('planner-nav__item--active', 'planner-nav__item--locked', 'planner-nav__item--done');
        if (i < stepIndex) navEl.classList.add('planner-nav__item--done');
        else if (i === stepIndex) navEl.classList.add('planner-nav__item--active');
        else navEl.classList.add('planner-nav__item--locked');
      });

      currentStep = step;
      if (step === 'confirmacion') buildConfirmation();
      document.getElementById('pay-content').scrollTo({ top: 0, behavior: 'smooth' });
    };

    /* ──── Validation ──────────────────────────────── */
    function validateContacto() {
      var fields = ['pay-groom', 'pay-bride', 'pay-email', 'pay-phone', 'pay-date'];
      var ok = true;

      document.getElementById('pay-email-error').style.display = 'none';
      document.getElementById('pay-phone-error').style.display = 'none';
      fields.forEach(function (id) {
        var inp = document.getElementById(id);
        if (inp) inp.classList.remove('is-invalid');
      });

      fields.forEach(function (id) {
        var inp = document.getElementById(id);
        if (!inp) return;
        if (!inp.value.trim()) {
          inp.classList.add('is-invalid');
          ok = false;
        } else {
          if (id === 'pay-email' && !inp.value.includes('@')) {
            inp.classList.add('is-invalid');
            document.getElementById('pay-email-error').style.display = 'block';
            ok = false;
          }
          if (id === 'pay-phone' && !/^\d+$/.test(inp.value.trim())) {
            inp.classList.add('is-invalid');
            document.getElementById('pay-phone-error').style.display = 'block';
            ok = false;
          }
        }
      });

      if (!ok && typeof showCustomAlert === 'function') {
        showCustomAlert('Información incompleta', 'Por favor completa todos los campos requeridos correctamente.');
      }
      return ok;
    }

    function validatePago() {
      var inp  = document.getElementById('pay-deposit');
      var err  = document.getElementById('pay-deposit-error');
      var val  = parseInt((inp.value || '').replace(/[^\d]/g, '')) || 0;
      var min  = parseInt(inp.dataset.minimo) || 0;
      var tot  = parseInt(inp.dataset.total) || 0;
      inp.classList.remove('is-invalid');
      err.style.display = 'none';

      if (!val) {
        inp.classList.add('is-invalid');
        err.textContent = 'Ingresa el monto del abono';
        err.style.display = 'block';
        return false;
      }
      if (val < min) {
        inp.classList.add('is-invalid');
        err.textContent = 'Debe ser mínimo el 50% (' + fmt(min) + ')';
        err.style.display = 'block';
        return false;
      }
      if (val > tot) {
        inp.classList.add('is-invalid');
        err.textContent = 'No puede superar el total (' + fmt(tot) + ')';
        err.style.display = 'block';
        return false;
      }
      return true;
    }

    /* ──── Confirmation ────────────────────────────── */
    var _confirmationBuilt = false;

    function buildConfirmation() {
      if (_confirmationBuilt) return;
      _confirmationBuilt = true;

      var groom  = (document.getElementById('pay-groom') || {}).value || '';
      var bride  = (document.getElementById('pay-bride') || {}).value || '';
      var email  = (document.getElementById('pay-email') || {}).value || '';
      var phone  = (document.getElementById('pay-phone') || {}).value || '';
      var date   = (document.getElementById('pay-date') || {}).value || '';
      var dep    = (document.getElementById('pay-deposit') || {}).value || '';
      var total  = document.getElementById('pay-total-val').textContent;

      var codeEl = document.getElementById('pay-confirm-code');
      if (codeEl) codeEl.textContent = 'Generando…';

      document.getElementById('pay-confirm-summary').innerHTML =
        '<div class="pay-confirm-summary__head"><p class="pay-confirm-summary__head-title">Resumen de tu reserva</p></div>' +
        '<div class="pay-confirm-summary__body">' +
        row('Novios', groom + ' & ' + bride) +
        row('Correo', email) +
        row('Teléfono', phone) +
        row('Fecha de la boda', date) +
        row('Total de la reserva', total) +
        row('Abono confirmado', 'COL$ ' + dep.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'), true) +
        '</div>';

      saveReservation(groom, bride, email, phone, date, dep, total);
    }

    function row(lbl, val, accent) {
      return '<div class="pay-confirm-row"><span class="pay-confirm-row__lbl">' + lbl + '</span>' +
             '<span class="pay-confirm-row__val' + (accent ? ' accent' : '') + '">' + val + '</span></div>';
    }

    /* ──── Save reservation ────────────────────────── */
    function saveReservation(groom, bride, email, phone, date, dep, total) {
      var cart = getCart();
      var venue = cart.selectedVenue || {};
      var depAmt = parseInt((dep || '').replace(/[^\d]/g, '')) || 0;
      var notes  = localStorage.getItem('weddingNotes') || '';

      var reservation = {
        id: null,
        groom: groom, bride: bride, email: email, phone: phone,
        venue: venue.name || '', venueImage: venue.image || '',
        guests: venue.guests || localStorage.getItem('selectedGuests') || '0',
        weddingDate: date, status: 'Pendiente', totalPrice: total,
        depositAmount: depAmt, cart: cart, comments: notes, timestamp: Date.now()
      };

      var all = JSON.parse(localStorage.getItem('allReservations') || '[]');
      all.push(reservation);
      localStorage.setItem('allReservations', JSON.stringify(all));

      fetch(API_BASE + '/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groom_name: groom, bride_name: bride, email: email, phone: phone,
          venue_slug: venue.slug || '', wedding_date: date,
          guest_count: parseInt(reservation.guests) || 0,
          special_requirements: notes, deposit_amount: depAmt,
          total_price: parseInt(String(total).replace(/[^\d]/g, '')) || 0,
          cart: cart
        })
      })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
      .then(function (data) {
        if (data && data.code) {
          var codeEl = document.getElementById('pay-confirm-code');
          if (codeEl) codeEl.textContent = data.code;
          localStorage.setItem('reservationCode', data.code);
          var a2 = JSON.parse(localStorage.getItem('allReservations') || '[]');
          if (a2.length) a2[a2.length - 1].id = data.code;
          localStorage.setItem('allReservations', JSON.stringify(a2));
        }
        localStorage.removeItem('weddingCart');
      })
      .catch(function () {
        var codeEl = document.getElementById('pay-confirm-code');
        if (codeEl) codeEl.textContent = 'Error al generar — contáctenos';
        localStorage.removeItem('weddingCart');
      });
    }

    /* ──── Deposit field formatting ────────────────── */
    function initDepositField() {
      var inp = document.getElementById('pay-deposit');
      if (!inp) return;
      inp.addEventListener('input', function () {
        var raw2 = inp.value.replace(/[^\d]/g, '');
        inp.value = raw2 ? parseInt(raw2).toLocaleString('es-CO') : '';
        validatePago();
      });
    }

    /* ──── MP button ───────────────────────────────── */
    function initMPButton() {
      var btn = document.getElementById('btn-pay-mp');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!validatePago()) return;
        goToStep('confirmacion');
      });
    }

    /* ──── Payment nav clicks ──────────────────────── */
    function initPayNav() {
      document.querySelectorAll('[data-paystep]').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          var step = this.dataset.paystep;
          var idx  = stepOrder.indexOf(step);
          var cur  = stepOrder.indexOf(currentStep);
          if (idx <= cur) goToStep(step);
        });
      });
    }

    /* ──── Init ────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
      var date = localStorage.getItem('selectedWeddingDate') || '';
      if (date) document.getElementById('pay-date').value = date;

      var notes = localStorage.getItem('weddingNotes') || '';
      if (notes) document.getElementById('pay-comments').value = notes;

      initPlannerNav();
      var total = renderSummary();
      renderDepositInfo(total);
      initDepositField();
      initMPButton();
      initPayNav();
    });

  })();
