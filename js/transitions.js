/*
  transitions.js
  Animación de "elemento compartido": un overlay de pantalla completa nace
  exactamente en la posición y tamaño del elemento en el que se hizo clic
  (el recuadro de la miniatura del VHS, o la tarjeta del álbum) y crece
  hasta cubrir toda la pantalla. `collapseTo` hace el camino inverso.

  Ambos módulos (videoPlayer.js y photoViewer.js) reutilizan estas dos
  funciones para no duplicar la lógica de la animación.
*/

const TRANSITION_PROPS =
  "top var(--dur-slow) var(--ease-standard), " +
  "left var(--dur-slow) var(--ease-standard), " +
  "width var(--dur-slow) var(--ease-standard), " +
  "height var(--dur-slow) var(--ease-standard), " +
  "border-radius var(--dur-slow) var(--ease-standard)";

function applyRect(frameEl, rect, borderRadius) {
  frameEl.style.top = `${rect.top}px`;
  frameEl.style.left = `${rect.left}px`;
  frameEl.style.width = `${rect.width}px`;
  frameEl.style.height = `${rect.height}px`;
  frameEl.style.borderRadius = borderRadius;
}

/**
 * Expande `overlayEl`/`frameEl` desde el rectángulo de `sourceEl` hasta
 * cubrir la pantalla completa. Devuelve una promesa que se resuelve al
 * terminar la animación.
 */
export function expandFrom(sourceEl, overlayEl, frameEl) {
  return new Promise((resolve) => {
    const rect = sourceEl.getBoundingClientRect();
    const startRadius = getComputedStyle(sourceEl).borderRadius || "0px";

    frameEl.style.transition = "none";
    applyRect(frameEl, rect, startRadius);
    overlayEl.classList.add("active");

    // Forzar reflow para que el navegador registre el estado inicial
    // antes de animar hacia el estado final.
    // eslint-disable-next-line no-unused-expressions
    frameEl.getBoundingClientRect();

    requestAnimationFrame(() => {
      frameEl.style.transition = TRANSITION_PROPS;
      frameEl.style.top = "0px";
      frameEl.style.left = "0px";
      frameEl.style.width = "100vw";
      frameEl.style.height = "100vh";
      frameEl.style.borderRadius = "0px";

      const onEnd = (event) => {
        if (event.target !== frameEl || event.propertyName !== "width") return;
        frameEl.removeEventListener("transitionend", onEnd);
        resolve();
      };
      frameEl.addEventListener("transitionend", onEnd);
    });
  });
}

/**
 * Hace el camino inverso: encoge el overlay de vuelta hacia el rectángulo
 * de `sourceEl` y, al terminar, lo oculta.
 */
export function collapseTo(sourceEl, overlayEl, frameEl) {
  return new Promise((resolve) => {
    if (!sourceEl) {
      overlayEl.classList.remove("active");
      resolve();
      return;
    }

    const rect = sourceEl.getBoundingClientRect();
    frameEl.style.transition = TRANSITION_PROPS;
    applyRect(frameEl, rect, "10px");

    const onEnd = (event) => {
      if (event.target !== frameEl || event.propertyName !== "width") return;
      frameEl.removeEventListener("transitionend", onEnd);
      overlayEl.classList.remove("active");
      resolve();
    };
    frameEl.addEventListener("transitionend", onEnd);
  });
}
