/** URL base de Strapi (sin barra final). */
export const STRAPI_BASE_URL_DEV = "http://localhost:1337";
export const STRAPI_BASE_URL_PROD = "https://maskottchen-be-production.up.railway.app";

/** Enlaces a redes (https absolutas). Dejar `""` para ocultar o usar `#` desde el componente. */
export const FACEBOOK_URL = "https://www.facebook.com/Maskottchen.petfood";
export const INSTAGRAM_URL = "";
export const TIKTOK_URL = "";

/** Tiendas online (producto o búsqueda). Sustituir por URLs definitivas de Maskottchen. */
export const AMAZON_STORE_URL = "https://www.amazon.com.mx/s?k=maskottchen";
export const MERCADO_LIBRE_STORE_URL = "https://listado.mercadolibre.com.mx/maskottchen";

/**
 * Pin del mapa «Dónde comprar» (`public/footer_logo.webp`).
 * Ajusta `MAP_MARKER_ICON_SIZE` si el logo se ve deformado o pequeño.
 */
export const MAP_MARKER_ICON_URL: string | undefined = "/footer_logo.webp";
/** Ancho×alto en px en el mapa; el ancla queda abajo-centro. */
export const MAP_MARKER_ICON_SIZE: [number, number] | undefined = [48, 48];
