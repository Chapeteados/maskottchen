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

/** Entrada de `/api/slides`. El vídeo es siempre URL de YouTube (`youtubeUrl`). */
export type StrapiSlide = {
  id: number;
  documentId: string;
  title: string | null;
  description: string | null;
  youtubeUrl: string | null;
  /** URL absoluta o relativa de imagen de fondo (si el modelo la expone como string). */
  imageUrl?: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  durationMs: number | null;
  order: number;
};

export type StrapiSlidesResponse = {
  data: StrapiSlide[];
  meta?: StrapiPaginationMeta;
};

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
