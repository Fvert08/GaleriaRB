/*
  videoPlayer.js
  Al hacer clic en una cinta, la imagen de previsualización se expande
  hasta cubrir la pantalla (transitions.js) y, justo al terminar, se
  sustituye por el <video> real con controles y arranca la reproducción.
  El enlace del video llega siempre desde data/videos.json.
*/

import { expandFrom, collapseTo } from "./transitions.js";

let overlay;
let frame;
let thumbEl;
let videoEl;
let titleEl;
let closeBtn;
let chrome;
let sourceEl = null;

export function initVideoPlayer() {
  overlay = document.getElementById("video-player-overlay");
  frame = overlay.querySelector(".player-frame");
  thumbEl = document.getElementById("player-thumb");
  videoEl = document.getElementById("player-video");
  titleEl = document.getElementById("player-title");
  closeBtn = document.getElementById("player-close");
  chrome = overlay.querySelector(".player-chrome");

  closeBtn.addEventListener("click", closePlayer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      closePlayer();
    }
  });
}

export async function openPlayer(videoData, fromEl) {
  sourceEl = fromEl;

  chrome.classList.remove("visible");
  videoEl.pause();
  videoEl.removeAttribute("src");
  videoEl.style.display = "none";

  thumbEl.src = videoData.thumbnail;
  thumbEl.style.display = "block";
  titleEl.textContent = videoData.title;

  await expandFrom(fromEl, overlay, frame);

  thumbEl.style.display = "none";
  videoEl.style.display = "block";
  videoEl.src = videoData.src;
  chrome.classList.add("visible");

  try {
    await videoEl.play();
  } catch (err) {
    // El navegador puede bloquear el autoplay; el usuario puede darle
    // play manualmente con los controles nativos.
  }
}

async function closePlayer() {
  chrome.classList.remove("visible");
  videoEl.pause();
  thumbEl.style.display = "block";
  videoEl.style.display = "none";

  await collapseTo(sourceEl, overlay, frame);

  videoEl.removeAttribute("src");
  videoEl.load();
}
