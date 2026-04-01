(function () {
  const forgotLink = document.getElementById("auth-forgot-password");
  const modal = document.getElementById("recovery-modal");
  const backBtn = document.getElementById("recovery-back");

  if (!forgotLink || !modal || !backBtn) return;

  forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
  });

  backBtn.addEventListener("click", function () {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
  });

  // Cerrar al hacer clic fuera del contenido
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
    }
  });
})();
