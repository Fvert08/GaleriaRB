/*
  menu.js
  El menú permite explorar los modelos 3D y usar su botón de texto para
  navegar. Al seleccionar una opción, reproduce una pequeña animación de
  "se hunde y vuelve" antes de avisar a main.js.
*/

export function initMenu({ onVideos, onPhotos }) {
  const videosOption = document.getElementById("option-videos");
  const photosOption = document.getElementById("option-photos");

  videosOption
    .querySelector(".option-label")
    .addEventListener("click", () => pressThenGo(videosOption, onVideos));
  photosOption
    .querySelector(".option-label")
    .addEventListener("click", () => pressThenGo(photosOption, onPhotos));
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
