/*
  albumCarousel.js
  Misma mecánica que vhsCarousel.js pero para álbumes de fotos: un álbum
  visible a la vez, flechas laterales para deslizar, y clic sobre el
  álbum para hacer zoom y entrar al visor de fotos.
*/

import { openViewer } from "./photoViewer.js";

let albums = [];
let currentIndex = 0;
let isAnimating = false;

let slot;
let prevBtn;
let nextBtn;

function countLabel(count) {
  return count === 1 ? "1 foto" : `${count} fotos`;
}

function buildCard(album) {
  const card = document.createElement("div");
  card.className = "album-card slide-card";
  card.dataset.id = album.id;
  card.style.setProperty("--album-color", album.color || "var(--color-accent)");

  const photoCount = Array.isArray(album.photos) ? album.photos.length : 0;

  card.innerHTML = `
    <div class="album-shell">
      <div class="album-spine"></div>
      <div class="album-cover">
        <svg class="album-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="14" rx="1.6" stroke="currentColor" stroke-width="1.4"/>
          <circle cx="8.3" cy="9.6" r="1.4" fill="currentColor"/>
          <path d="M4 16.2l4.6-4 3.6 3 3-2.6 5.3 4.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <div class="album-info">
      <h3 class="album-name">${album.title}</h3>
      <p class="album-count">${countLabel(photoCount)}</p>
    </div>
  `;

  card.addEventListener("click", () => openViewer(album, card));

  return card;
}

function render(direction) {
  slot.innerHTML = "";
  const card = buildCard(albums[currentIndex]);

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
  if (!albums.length || isAnimating) return;
  isAnimating = true;

  const outgoing = slot.querySelector(".album-card");
  if (!outgoing) {
    isAnimating = false;
    return;
  }

  outgoing.classList.add(direction > 0 ? "exit-to-left" : "exit-to-right");
  outgoing.addEventListener(
    "transitionend",
    () => {
      currentIndex = (currentIndex + direction + albums.length) % albums.length;
      render(direction);
      isAnimating = false;
    },
    { once: true }
  );
}

function handleKeydown(event) {
  const screen = document.getElementById("screen-albums");
  if (!screen.classList.contains("active")) return;
  if (event.key === "ArrowLeft") go(-1);
  if (event.key === "ArrowRight") go(1);
}

export function initAlbumCarousel(albumList) {
  albums = albumList || [];
  currentIndex = 0;

  slot = document.getElementById("album-slot");
  prevBtn = document.getElementById("albums-prev");
  nextBtn = document.getElementById("albums-next");

  if (!albums.length) {
    slot.innerHTML = '<p class="load-error">Todavía no hay álbumes guardados.</p>';
    return;
  }

  render(null);
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  document.addEventListener("keydown", handleKeydown);
}
