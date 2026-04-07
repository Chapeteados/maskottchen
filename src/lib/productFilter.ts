import type { StrapiProduct } from "./strapi.types";

/** Etapas fijas (negocio). El filtro busca la palabra en minúsculas en nombre, descripción y presentaciones. */
export const ETAPA_FILTER_OPTIONS = ["Cachorro", "Adulto"] as const;

/** Presentación que parece peso (kg) o talla de raza (heurística para priorizar en el desplegable). */
const SIZE_HINT =
  /\d+\s*kg|pequeño|mediano|grande|mini|maxi|peque|chico|gde|m\.|razas?|toy|standard|jumbo/i;

/**
 * Etapa: siempre Cachorro / Adulto. Tamaño: opciones únicas desde `presentations[].name` (heurística de talla).
 */
export function buildProductFilterOptions(products: StrapiProduct[]): {
  etapaOptions: string[];
  tamañoOptions: string[];
} {
  const names = new Set<string>();
  for (const p of products) {
    for (const pr of p.presentations ?? []) {
      const n = pr.name?.trim();
      if (n) names.add(n);
    }
  }

  const sorted = [...names].sort((a, b) => a.localeCompare(b, "es"));

  if (sorted.length === 0) {
    return {
      etapaOptions: [...ETAPA_FILTER_OPTIONS],
      tamañoOptions: [],
    };
  }

  const tamañoCandidates = sorted.filter((n) => SIZE_HINT.test(n));

  return {
    etapaOptions: [...ETAPA_FILTER_OPTIONS],
    tamañoOptions: tamañoCandidates.length > 0 ? tamañoCandidates : sorted,
  };
}

/**
 * - Etapa: la cadena debe aparecer en nombre, descripción o nombres de presentación (minúsculas).
 * - Tamaño/peso: **coincidencia exacta** con algún `presentations[].name` (normalizado).
 *   Evita el falso positivo de `hay.includes("5 kg")` cuando el producto solo tiene "15 kg" o "25 kg"
 *   (porque "15 kg".includes("5 kg") y "25 kg".includes("5 kg") serían true).
 */
export function productMatchesFilters(
  product: StrapiProduct,
  etapa: string,
  tamaño: string,
): boolean {
  const e = etapa.trim().toLowerCase();
  const t = tamaño.trim().toLowerCase();
  if (!e && !t) return true;

  const presentationNamesLower = (product.presentations ?? []).map((p) =>
    (p.name ?? "").trim().toLowerCase(),
  );

  const hay = [product.name, product.description, ...presentationNamesLower].join(" ").toLowerCase();

  if (e && !hay.includes(e)) return false;
  if (t && !presentationNamesLower.some((name) => name === t)) return false;
  return true;
}
