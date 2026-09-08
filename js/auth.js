/*
  auth.js
  Puerta de acceso a la bóveda. La contraseña es solo un filtro de
  interfaz (no hay backend ni cifrado real), pensado para uso personal.
  Para cambiarla, edita la constante CORRECT_PASSWORD.
*/

const CORRECT_PASSWORD = "2003";

export function initAuth(onSuccess) {
  const form = document.getElementById("login-form");
  const input = document.getElementById("password-input");
  const errorEl = document.getElementById("login-error");
  const card = document.getElementById("login-card");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value.trim() === CORRECT_PASSWORD) {
      errorEl.textContent = "";
      input.value = "";
      onSuccess();
      return;
    }

    errorEl.textContent = "Contraseña incorrecta. Inténtalo de nuevo.";
    input.value = "";
    input.focus();

    card.classList.remove("shake");
    // Reflow para poder reiniciar la animación si se falla varias veces seguidas.
    void card.offsetWidth;
    card.classList.add("shake");
  });
}
