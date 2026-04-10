/** Respuesta paginada habitual en la API REST de Strapi. */
export type StrapiPaginationMeta = {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

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
  meta?: StrapiPaginationMeta;
};

/** Entrada de `/api/partners` (Strapi v5, campos alineados con el content-type). */
export type StrapiPartner = {
  id: number;
  documentId: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  /** WGS84; opcional en Strapi. */
  latitude?: number | string | null;
  longitude?: number | string | null;
};

export type StrapiPartnersResponse = {
  data: StrapiPartner[];
  meta?: StrapiPaginationMeta;
};

/** Partner normalizado para la UI (`PartnerCard`). */
export type Partner = {
  id: number;
  documentId: string;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
};

/** Media (imagen) en respuestas REST de Strapi v4/v5. */
export type StrapiSlideImage = {
  id?: number;
  documentId?: string;
  url?: string | null;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  /** Strapi v4 anidaba en attributes */
  attributes?: {
    url?: string | null;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
};

/** Entrada de `/api/slides` con `populate` de imagen. */
export type StrapiSlide = {
  id: number;
  documentId: string;
  title: string | null;
  description: string | null;
  youtubeUrl: string | null;
  /** Campo texto legacy (si existe en el modelo). */
  imageUrl?: string | null;
  /** Relación Media (p. ej. `populate[image]=true`). */
  image?: StrapiSlideImage | StrapiSlideImage[] | { data?: StrapiSlideImage | null } | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  durationMs: number | null;
  order: number;
};

export type StrapiSlidesResponse = {
  data: StrapiSlide[];
  meta?: StrapiPaginationMeta;
};

/** Payload del formulario de contacto (alinear nombres con el content type en Strapi). */
export type ContactFormPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactFormValues = ContactFormPayload;

/** Resultado de un POST genérico a Strapi. */
export type StrapiPostResult = { ok: true } | { ok: false; message: string };

/** Props normalizadas para el hero (`HeroSlider` / `HeroSlide`). */
export type HomeHeroSlide = {
  image?: string;
  youtubeUrl?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  durationMs: number;
};
