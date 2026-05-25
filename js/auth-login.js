(function () {
  const form = document.querySelector(".auth-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const email    = (document.getElementById('identifier') || {}).value || '';
    const password = (document.getElementById('password')   || {}).value || '';
    const submitBtn = form.querySelector('[type="submit"]');

    if (submitBtn) submitBtn.disabled = true;

    fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(function (res) {
        return res.json().then(function (d) { return { ok: res.ok, data: d }; });
      })
      .then(function (result) {
        if (!result.ok) {
          alert(result.data.error || 'Credenciales incorrectas');
          if (submitBtn) submitBtn.disabled = false;
          return;
        }
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('authUser',  JSON.stringify(result.data.user));
        window.location.href = 'reservations.html';
      })
      .catch(function () {
        alert('Error de conexión. Intenta de nuevo.');
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
