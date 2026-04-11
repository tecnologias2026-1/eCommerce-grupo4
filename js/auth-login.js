(function () {
  const form = document.querySelector(".auth-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    window.location.href = "/assets/public/reservations.html";
  });
})();
