/**
 * Tipos y cliente para la API REST de Strapi (productos).
 * Home: getHomeProducts() — máx. 3, orden por createdAt asc (no entran productos nuevos).
 */

export type StrapiPresentation = {
  id: number;
  documentId: string;
  name: string;
};

export type StrapiGalleryImage = {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
};

export type StrapiProduct = {
  id: number;
  documentId: string;
  name: string;
  description: string;
  presentations: StrapiPresentation[];
  gallery: StrapiGalleryImage[];
};

export type StrapiProductsResponse = {
  data: StrapiProduct[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

const DEFAULT_STRAPI_URL = "https://maskottchen-be-production.up.railway.app";

function getStrapiBaseUrl(): string {
  const fromEnv = import.meta.env.PUBLIC_STRAPI_URL;
  if (typeof fromEnv === "string" && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_STRAPI_URL;
}

/** Máximo de productos en la home (fijos; no se muestran más aunque Strapi tenga más). */
const HOME_PRODUCTS_LIMIT = 3;

const HOME_PRODUCTS_QUERY =
  "populate[0]=presentations&populate[1]=gallery" +
  "&pagination[limit]=3" +
  "&sort[0]=createdAt:asc";

/**
 * Solo los primeros 3 productos creados en Strapi (home).
 * Con `pagination[limit]=3` y `sort=createdAt:asc`, los que subas después no aparecen aquí.
 */
export async function getHomeProducts(): Promise<StrapiProduct[]> {
  const base = getStrapiBaseUrl();
  const url = `${base}/api/products?${HOME_PRODUCTS_QUERY}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error(`[strapi] getHomeProducts failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const json = (await res.json()) as StrapiProductsResponse;
  const raw = Array.isArray(json.data) ? json.data : [];
  return raw.slice(0, HOME_PRODUCTS_LIMIT);
}
