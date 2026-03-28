/**
 * Extrae el ID de vídeo de una URL de YouTube (watch, youtu.be, embed, shorts)
 * o devuelve el propio valor si ya es un ID de 11 caracteres.
 */
export function extractYoutubeId(input: string): string | null {
  const s = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return null;
}

/** URL lista para usar en iframe src (embed). */
export function getYoutubeEmbedUrlFromInput(input: string): string | null {
  const id = extractYoutubeId(input);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    controls: "0",
    modestbranding: "1",
    rel: "0",
    loop: "1",
    playlist: id,
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
