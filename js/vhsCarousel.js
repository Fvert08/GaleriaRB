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
      <div class="vhs-reels"><span></span><span></span></div>
      <div class="vhs-window">
        <img class="vhs-thumb" src="${video.thumbnail}" alt="Previsualización de ${video.title}">
        <div class="vhs-play-badge" aria-hidden="true">&#9654;</div>
        <span class="vhs-duration-badge">${video.duration}</span>
      </div>
    </div>
    <div class="vhs-info">
      <h3 class="vhs-name">${video.title}</h3>
      <p class="vhs-date">${formatDate(video.date)}</p>
    </div>
  `;

  const windowEl = card.querySelector(".vhs-window");
  card.addEventListener("click", () => openPlayer(video, windowEl));

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
