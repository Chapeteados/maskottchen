/**
 * Cliente REST Strapi (GET productos/slides, POST genérico).
 *
 * Base URL: ver `src/lib/constants.ts` (`STRAPI_BASE_URL_*`).
 * URLs: `strapiApiUrl("slides", query, base)` — mismo patrón que antes (`base` + `/api/` + recurso). POST: `postStrapi`.
 */

import type {
  HomeHeroSlide,
  StrapiPostResult,
  StrapiProduct,
  StrapiSlide,
  StrapiSlideImage,
  StrapiProductsResponse,
  StrapiSlidesResponse,
} from "./strapi.types";

export type {
  ContactFormPayload,
  ContactFormValues,
  HomeHeroSlide,
  StrapiGalleryImage,
  StrapiPresentation,
  StrapiProduct,
  StrapiPostResult,
  StrapiProductsResponse,
  StrapiSlide,
  StrapiSlideImage,
  StrapiSlidesResponse,
  StrapiPaginationMeta,
} from "./strapi.types";
import { STRAPI_BASE_URL_DEV, STRAPI_BASE_URL_PROD } from "./constants";

const JSON_HEADERS = { Accept: "application/json" } as const;

/**
 * Base URL de Strapi: solo `import.meta.env.DEV` (astro dev) vs producción.
 */
export function getStrapiBaseUrl(): string {
  return import.meta.env.DEV ? STRAPI_BASE_URL_DEV : STRAPI_BASE_URL_PROD;
}

/**
 * Igual que en getSlides/getHomeProducts: `{base}/api/{path}` y query opcional sin `?` inicial.
 * Pasa `baseUrl` si ya llamaste a `getStrapiBaseUrl()` y quieres evitar repetir la llamada.
 */
export function strapiApiUrl(path: string, searchParams?: string, baseUrl?: string): string {
  const base = (baseUrl ?? getStrapiBaseUrl()).replace(/\/$/, "");
  const segment = path.trim().replace(/^\/+|\/+$/g, "");
  const qs =
    searchParams != null && searchParams.length > 0
      ? `?${searchParams.replace(/^\?/, "")}`
      : "";
  return `${base}/api/${segment}${qs}`;
}

const DEFAULT_SLIDE_DURATION_MS = 10_000;

const SLIDES_QUERY = "sort[0]=order:asc&pagination[pageSize]=50&populate[image]=true";

/** Máximo de productos en la home (fijos). */
const HOME_PRODUCTS_LIMIT = 3;

const HOME_PRODUCTS_QUERY =
  "populate[0]=presentations&populate[1]=gallery" +
  "&pagination[limit]=3" +
  "&sort[0]=createdAt:asc";

/** Saca la primera URL de un campo Media (v4/v5) o undefined. */
function pickStrapiMediaUrl(raw: StrapiSlide["image"]): string | undefined {
  if (raw == null) {
    return undefined;
  }
  if (Array.isArray(raw)) {
    const first = raw[0];
    return pickStrapiMediaUrl(first ?? null);
  }
  if (typeof raw === "object" && "data" in raw && raw.data != null) {
    const d = raw.data;
    if (Array.isArray(d)) {
      return pickStrapiMediaUrl(d[0] ?? null);
    }
    return pickStrapiMediaUrl(d as StrapiSlide["image"]);
  }
  const o = raw as StrapiSlideImage;
  const fromAttrs =
    o.attributes?.url != null && String(o.attributes.url).trim() !== ""
      ? String(o.attributes.url).trim()
      : undefined;
  const direct = o.url != null && String(o.url).trim() !== "" ? String(o.url).trim() : undefined;
  return direct ?? fromAttrs;
}

/** Convierte URL de upload (`/uploads/...`) en absoluta usando el mismo host que la API. */
function toAbsoluteMediaUrl(base: string, pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const baseClean = base.replace(/\/$/, "");
  return trimmed.startsWith("/") ? `${baseClean}${trimmed}` : `${baseClean}/${trimmed}`;
}

function normalizeSlide(row: StrapiSlide, apiBase: string): HomeHeroSlide | null {
  const youtubeUrl = row.youtubeUrl?.trim() || undefined;
  const fromField = row.imageUrl?.trim() || undefined;
  const fromMedia = pickStrapiMediaUrl(row.image);
  const imageRaw = fromField ?? fromMedia;
  const image =
    imageRaw != null && imageRaw.length > 0 ? toAbsoluteMediaUrl(apiBase, imageRaw) : undefined;
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
  const url = strapiApiUrl("slides", SLIDES_QUERY, base);

  const res = await fetch(url, { headers: JSON_HEADERS });

  if (!res.ok) {
    console.error(`[strapi] getSlides failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as StrapiSlidesResponse;
  const raw = Array.isArray(json.data) ? json.data : [];
  const out: HomeHeroSlide[] = [];
  for (const row of raw) {
    const n = normalizeSlide(row, base);
    if (n) out.push(n);
  }
  return out;
}

/**
 * Primeros productos de la home (máx. `HOME_PRODUCTS_LIMIT`), orden por `createdAt` asc.
 */
export async function getHomeProducts(): Promise<StrapiProduct[]> {
  const base = getStrapiBaseUrl();
  const url = strapiApiUrl("products", HOME_PRODUCTS_QUERY, base);

  const res = await fetch(url, { headers: JSON_HEADERS });

  if (!res.ok) {
    console.error(`[strapi] getHomeProducts failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as StrapiProductsResponse;
  const raw = Array.isArray(json.data) ? json.data : [];
  return raw.slice(0, HOME_PRODUCTS_LIMIT);
}

function buildStrapiPostHeaders(): Record<string, string> {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

/**
 * POST REST Strapi v5: `{ data: fields }` → `POST /api/{path}`.
 */
export async function postStrapi(
  path: string,
  fields: Record<string, unknown>,
): Promise<StrapiPostResult> {
  const url = strapiApiUrl(path);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: buildStrapiPostHeaders(),
      body: JSON.stringify({ data: fields }),
    });

    if (!res.ok) {
      const text = await res.text();
      let detail = res.statusText;
      try {
        const errJson = JSON.parse(text) as { error?: { message?: string } };
        if (errJson?.error?.message) {
          detail = errJson.error.message;
        } else if (text) {
          detail = text.slice(0, 240);
        }
      } catch {
        if (text) {
          detail = text.slice(0, 240);
        }
      }
      // 405 en POST suele ser ruta sin collection en Strapi (GET 404) o path distinto al API ID plural.
      if (res.status === 405) {
        return {
          ok: false,
          message:
            "El backend no acepta POST en esta ruta. En Strapi crea el collection type, usa el mismo API ID (plural) que en el front y activa create para el rol Public.",
        };
      }
      return { ok: false, message: detail || `Error ${res.status}` };
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error de red";
    return { ok: false, message };
  }
}
