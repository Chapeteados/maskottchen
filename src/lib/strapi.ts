/**
 * Cliente REST Strapi (productos, slides del hero).
 *
 * Base URL: `PUBLIC_STRAPI_URL` en `.env`. Sin ella: en el navegador → Railway; en servidor Astro dev → localhost.
 */

import type {
  HomeHeroSlide,
  StrapiProduct,
  StrapiSlide,
  StrapiProductsResponse,
  StrapiSlidesResponse,
} from "./strapi.types";

export type {
  HomeHeroSlide,
  StrapiGalleryImage,
  StrapiPresentation,
  StrapiProduct,
  StrapiProductsResponse,
  StrapiSlide,
  StrapiSlidesResponse,
  StrapiPaginationMeta,
} from "./strapi.types";

const JSON_HEADERS = { Accept: "application/json" } as const;

const DEFAULT_PROD_STRAPI = "https://maskottchen-be-production.up.railway.app";

/**
 * Base URL de Strapi.
 * - Si `PUBLIC_STRAPI_URL` está definida, se usa siempre.
 * - En el **navegador**, sin variable: URL pública (Railway) para que el `fetch` sea cross-origin
 *   visible en Network y no apunte por defecto a localhost (donde muchas veces no hay Strapi en marcha).
 * - En SSR / Node (sin `window`): `astro dev` → localhost; build/prod → Railway.
 */
export function getStrapiBaseUrl(): string {
  const raw = import.meta.env.PUBLIC_STRAPI_URL;
  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw.trim().replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return DEFAULT_PROD_STRAPI;
  }
  const local = "http://localhost:1337";
  return import.meta.env.DEV ? local : DEFAULT_PROD_STRAPI;
}

const DEFAULT_SLIDE_DURATION_MS = 10_000;

const SLIDES_QUERY = "sort[0]=order:asc&pagination[pageSize]=50";

/** Máximo de productos en la home (fijos). */
const HOME_PRODUCTS_LIMIT = 3;

const HOME_PRODUCTS_QUERY =
  "populate[0]=presentations&populate[1]=gallery" +
  "&pagination[limit]=3" +
  "&sort[0]=createdAt:asc";

function normalizeSlide(row: StrapiSlide): HomeHeroSlide | null {
  const youtubeUrl = row.youtubeUrl?.trim() || undefined;
  const image = row.imageUrl?.trim() || undefined;
  if (!youtubeUrl && !image) {
    return null;
  }
  const durationMs =
    row.durationMs != null && Number.isFinite(row.durationMs) && row.durationMs > 0
      ? row.durationMs
      : DEFAULT_SLIDE_DURATION_MS;
  return {
    image,
    youtubeUrl,
    title: row.title?.trim() || undefined,
    description: row.description?.trim() || undefined,
    buttonLabel: row.buttonLabel?.trim() || undefined,
    buttonHref: row.buttonHref?.trim() || undefined,
    durationMs,
  };
}

/**
 * Slides del hero ordenados por `order` asc. Se omiten entradas sin `youtubeUrl` ni `imageUrl`.
 */
export async function getSlides(): Promise<HomeHeroSlide[]> {
  const base = getStrapiBaseUrl();
  const url = `${base}/api/slides?${SLIDES_QUERY}`;

  const res = await fetch(url, { headers: JSON_HEADERS });

  if (!res.ok) {
    console.error(`[strapi] getSlides failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as StrapiSlidesResponse;
  const raw = Array.isArray(json.data) ? json.data : [];
  const out: HomeHeroSlide[] = [];
  for (const row of raw) {
    const n = normalizeSlide(row);
    if (n) out.push(n);
  }
  return out;
}

/**
 * Primeros productos de la home (máx. `HOME_PRODUCTS_LIMIT`), orden por `createdAt` asc.
 */
export async function getHomeProducts(): Promise<StrapiProduct[]> {
  const base = getStrapiBaseUrl();
  const url = `${base}/api/products?${HOME_PRODUCTS_QUERY}`;

  const res = await fetch(url, { headers: JSON_HEADERS });

  if (!res.ok) {
    console.error(`[strapi] getHomeProducts failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as StrapiProductsResponse;
  const raw = Array.isArray(json.data) ? json.data : [];
  return raw.slice(0, HOME_PRODUCTS_LIMIT);
}
