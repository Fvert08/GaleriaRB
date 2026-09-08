/*
  main.js
  Punto de entrada. No contiene lógica de negocio propia: solo registra
  las pantallas, conecta cada módulo con sus datos y define a dónde
  navega cada botón "volver". Cada pieza del sitio vive en su propio
  archivo dentro de /js, así que este archivo es el único que necesita
  conocerlas a todas.
*/

import { registerScreens, showScreen } from "./screens.js";
import { initAuth } from "./auth.js";
import { initMenu } from "./menu.js";
import { initVhsCarousel } from "./vhsCarousel.js";
import { initAlbumCarousel } from "./albumCarousel.js";
import { initVideoPlayer } from "./videoPlayer.js";
import { initPhotoViewer } from "./photoViewer.js";
import { loadVideos, loadAlbums } from "./data.js";

async function bootstrap() {
  registerScreens(["screen-login", "screen-menu", "screen-videos", "screen-albums"]);

  initAuth(() => showScreen("screen-menu"));

  initMenu({
    onVideos: () => showScreen("screen-videos"),
    onPhotos: () => showScreen("screen-albums"),
  });

  document.getElementById("videos-back").addEventListener("click", () => {
    showScreen("screen-menu");
  });

  document.getElementById("albums-back").addEventListener("click", () => {
    showScreen("screen-menu");
  });

  initVideoPlayer();
  initPhotoViewer();

  try {
    const [videos, albums] = await Promise.all([loadVideos(), loadAlbums()]);
    initVhsCarousel(videos);
    initAlbumCarousel(albums);
  } catch (err) {
    console.error("Error cargando los datos del sitio:", err);
    const message =
      '<p class="load-error">No se pudieron cargar los datos. Si abriste el ' +
      "archivo directamente con doble clic, ábrelo en cambio desde un " +
      "servidor local (revisa el README).</p>";
    document.getElementById("vhs-slot").innerHTML = message;
    document.getElementById("album-slot").innerHTML = message;
  }
}

bootstrap();
