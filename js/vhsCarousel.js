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
  return Number.isNaN(date.getTime()) ? isoDate : dateFormatter.format(date);
}

function buildCard(video) {
  const card = document.createElement("div");
  card.className = "vhs-card slide-card";
  card.dataset.id = video.id;
  card.style.setProperty("--media-color", video.color || "var(--color-accent)");

  card.innerHTML = `
    <div class="vhs-shell">
      <img class="vhs-preview" src="${video.thumbnail}" alt="Previsualización de ${video.title}">
      <div class="vhs-model native-model native-vhs" aria-hidden="true">
        <span class="vhs-front">
          <span class="vhs-label"></span>
          <span class="vhs-reel vhs-reel-left"></span>
          <span class="vhs-reel vhs-reel-right"></span>
          <span class="vhs-window"></span>
        </span>
        <span class="vhs-side"></span>
      </div>
    </div>
    <div class="media-info vhs-info">
      <div class="media-title-row">
        <span class="media-color-dot" aria-hidden="true"></span>
        <h3 class="media-title">${video.title}</h3>
      </div>
      <p class="media-detail">${formatDate(video.date)} · ${video.duration}</p>
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
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", "Reproducir " + video.title);
  const select = () => {
    if (card.classList.contains("pressed")) return;
    card.classList.add("pressed");
    card.querySelector(".vhs-model").addEventListener(
      "animationend",
      () => {
        card.classList.remove("pressed");
        openPlayer(video, preview);
      },
      { once: true }
    );
  };
  card.addEventListener("click", select);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select();
    }
  });

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
