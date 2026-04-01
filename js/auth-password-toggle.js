(function () {
  const input = document.getElementById("password");
  const btn = document.getElementById("password-toggle");
  if (!input || !btn) return;

  function setState(visible) {
    input.type = visible ? "text" : "password";
    btn.classList.toggle("is-password-visible", visible);
    btn.setAttribute("aria-pressed", String(visible));
    btn.setAttribute("aria-label", visible ? "Ocultar contraseña" : "Mostrar contraseña");
  }

  btn.addEventListener("click", function () {
    setState(input.type === "password");
  });
})();
