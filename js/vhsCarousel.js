/*
  vhsCarousel.js
  Construye y controla el carrusel de cintas VHS: una cinta visible a la
  vez, con flechas a los lados para deslizar hacia la anterior/siguiente,
  y clic sobre la cinta para abrir el reproductor de video.
*/

import { openPlayer } from "./videoPlayer.js";

let videos = [];
let currentIndex = 0;
let isAnimating = false;

let slot;
let prevBtn;
let nextBtn;

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return dateFormatter.format(date);
}

function buildCard(video) {
  const card = document.createElement("div");
  card.className = "vhs-card slide-card";
  card.dataset.id = video.id;

  card.innerHTML = `
    <div class="vhs-shell">
      <img class="vhs-preview" src="${video.thumbnail}" alt="Previsualización de ${video.title}">
      <div class="storage-model vhs-model">
        <iframe
          title="Cinta VHS en 3D para ${video.title}"
          src="https://sketchfab.com/models/efce8c21a9ac4a4fa33a336127007c48/embed"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
      <span class="vhs-duration-badge">${video.duration}</span>
    </div>
    <div class="vhs-info">
      <h3 class="vhs-name">${video.title}</h3>
      <p class="vhs-date">${formatDate(video.date)}</p>
    </div>
  `;

  const preview = card.querySelector(".vhs-preview");
  let previewTimer;

  const showPreviewAfterDelay = () => {
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(() => {
      card.classList.add("preview-visible");
    }, 1500);
  };

  const hidePreview = () => {
    window.clearTimeout(previewTimer);
    card.classList.remove("preview-visible");
  };

  card.addEventListener("pointerenter", showPreviewAfterDelay);
  card.addEventListener("pointerleave", hidePreview);
  card.addEventListener("focusin", showPreviewAfterDelay);
  card.addEventListener("focusout", hidePreview);
  card.addEventListener("click", () => openPlayer(video, preview));

  return card;
}

function render(direction) {
  slot.innerHTML = "";
  const card = buildCard(videos[currentIndex]);

  if (direction) {
    card.classList.add(direction > 0 ? "enter-from-right" : "enter-from-left");
    slot.appendChild(card);
    requestAnimationFrame(() => {
      card.classList.add("settled");
    });
  } else {
    slot.appendChild(card);
  }
}

function go(direction) {
  if (!videos.length || isAnimating) return;
  isAnimating = true;

  const outgoing = slot.querySelector(".vhs-card");
  if (!outgoing) {
    isAnimating = false;
    return;
  }

  outgoing.classList.add(direction > 0 ? "exit-to-left" : "exit-to-right");
  outgoing.addEventListener(
    "transitionend",
    () => {
      currentIndex = (currentIndex + direction + videos.length) % videos.length;
      render(direction);
      isAnimating = false;
    },
    { once: true }
  );
}

function handleKeydown(event) {
  const screen = document.getElementById("screen-videos");
  if (!screen.classList.contains("active")) return;
  if (event.key === "ArrowLeft") go(-1);
  if (event.key === "ArrowRight") go(1);
}

export function initVhsCarousel(videoList) {
  videos = videoList || [];
  currentIndex = 0;

  slot = document.getElementById("vhs-slot");
  prevBtn = document.getElementById("videos-prev");
  nextBtn = document.getElementById("videos-next");

  if (!videos.length) {
    slot.innerHTML = '<p class="load-error">Todavía no hay videos guardados.</p>';
    return;
  }

  render(null);
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  document.addEventListener("keydown", handleKeydown);
}
