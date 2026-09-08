/*
  menu.js
  El menú reacciona al clic sobre cada objeto 3D, reproduce una pequeña
  animación de "se hunde y vuelve" y después avisa a main.js para navegar.
*/

export function initMenu({ onVideos, onPhotos }) {
  const videosBtn = document.getElementById("option-videos");
  const photosBtn = document.getElementById("option-photos");

  videosBtn.addEventListener("click", () => pressThenGo(videosBtn, onVideos));
  photosBtn.addEventListener("click", () => pressThenGo(photosBtn, onPhotos));
}

function pressThenGo(el, callback) {
  el.classList.add("pressed");

  const handleEnd = () => {
    el.classList.remove("pressed");
    el.removeEventListener("animationend", handleEnd);
    callback();
  };

  el.addEventListener("animationend", handleEnd, { once: true });
}
