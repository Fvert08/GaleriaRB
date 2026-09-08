/*
  screens.js
  Controla cuál de las pantallas de nivel superior está visible
  (#screen-login, #screen-menu, #screen-videos, #screen-albums).
  Los overlays del reproductor de video y del visor de fotos NO pasan por
  aquí: se manejan aparte porque nacen del elemento en el que se hizo clic.
*/

const screens = new Map();

export function registerScreens(ids) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) screens.set(id, el);
  });
}

export function showScreen(id) {
  screens.forEach((el, key) => {
    el.classList.toggle("active", key === id);
  });
}
