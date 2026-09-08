/*
  photoViewer.js
  Al hacer clic en un álbum, la tarjeta hace zoom hasta cubrir la pantalla
  (transitions.js) y aparece el visor: una foto a la vez, con flechas para
  pasar de foto y la posibilidad de acercar/alejar con un clic sobre ella.
  El botón de volver deshace el zoom y regresa al carrusel de álbumes.
*/

import { expandFrom, collapseTo } from "./transitions.js";

let overlay;
let frame;
let content;
let titleEl;
let imgEl;
let counterEl;
let prevBtn;
let nextBtn;
let backBtn;

let currentAlbum = null;
let photoIndex = 0;
let sourceEl = null;

function updatePhoto() {
  if (!currentAlbum || !currentAlbum.photos.length) return;
  const photo = currentAlbum.photos[photoIndex];
  imgEl.classList.remove("zoomed");
  imgEl.src = photo.src;
  imgEl.alt = photo.caption || currentAlbum.title;
  counterEl.textContent = `${photoIndex + 1} / ${currentAlbum.photos.length}`;
}

function move(direction) {
  if (!currentAlbum || !currentAlbum.photos.length) return;
  const total = currentAlbum.photos.length;
  photoIndex = (photoIndex + direction + total) % total;
  updatePhoto();
}

async function closeViewer() {
  content.classList.remove("visible");
  await collapseTo(sourceEl, overlay, frame);
}

export function initPhotoViewer() {
  overlay = document.getElementById("photo-viewer-overlay");
  frame = overlay.querySelector(".viewer-frame");
  content = overlay.querySelector(".viewer-content");
  titleEl = document.getElementById("viewer-album-title");
  imgEl = document.getElementById("viewer-photo");
  counterEl = document.getElementById("viewer-counter");
  prevBtn = document.getElementById("viewer-prev");
  nextBtn = document.getElementById("viewer-next");
  backBtn = document.getElementById("viewer-back");

  prevBtn.addEventListener("click", () => move(-1));
  nextBtn.addEventListener("click", () => move(1));
  backBtn.addEventListener("click", closeViewer);
  imgEl.addEventListener("click", () => imgEl.classList.toggle("zoomed"));

  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("active")) return;
    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
}

export async function openViewer(albumData, fromEl) {
  currentAlbum = albumData;
  photoIndex = 0;
  sourceEl = fromEl;

  titleEl.textContent = albumData.title;
  content.classList.remove("visible");

  await expandFrom(fromEl, overlay, frame);

  updatePhoto();
  content.classList.add("visible");
}
