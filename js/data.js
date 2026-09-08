/*
  data.js
  Único punto de contacto con los archivos JSON. Cualquier otro módulo que
  necesite videos o álbumes pasa por aquí, así que si mañana los datos
  vienen de una API en vez de un archivo, solo se toca este archivo.
*/

const VIDEOS_URL = "data/videos.json";
const ALBUMS_URL = "data/albums.json";

export async function loadVideos() {
  const res = await fetch(VIDEOS_URL);
  if (!res.ok) {
    throw new Error(`No se pudo cargar ${VIDEOS_URL} (HTTP ${res.status})`);
  }
  return res.json();
}

export async function loadAlbums() {
  const res = await fetch(ALBUMS_URL);
  if (!res.ok) {
    throw new Error(`No se pudo cargar ${ALBUMS_URL} (HTTP ${res.status})`);
  }
  return res.json();
}
