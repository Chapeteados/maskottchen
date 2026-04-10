/** Origen del pin: coordenadas exactas (sin Nominatim) o dirección a geocodificar. */
export type OsmMapTarget =
  | {
      kind: "coordinates";
      latitude: number;
      longitude: number;
      /** Texto del popup; si falta, el mapa puede mostrar lat/lng redondeados. */
      popupLabel?: string;
    }
  | { kind: "address"; address: string };

/**
 * Si hay lat/lng finitos, usa coordenadas y `address` solo como etiqueta del popup.
 * Si no, geocodifica `address`.
 */
export function buildOsmMapTarget(
  address: string,
  latitude?: number,
  longitude?: number,
): OsmMapTarget {
  if (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    return {
      kind: "coordinates",
      latitude,
      longitude,
      popupLabel: address.trim() || undefined,
    };
  }
  return { kind: "address", address: address.trim() || "" };
}

/** Campos de partner suficientes para el mapa (Strapi / UI). */
export type PartnerMapSource = {
  address: string;
  latitude?: number;
  longitude?: number;
};

/** `null` si no hay dirección ni coordenadas para mostrar un pin. */
export function partnerToMapTarget(partner: PartnerMapSource): OsmMapTarget | null {
  const addr = partner.address.trim();
  const { latitude: lat, longitude: lng } = partner;
  const hasCoords =
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng);
  if (!addr && !hasCoords) return null;
  return buildOsmMapTarget(addr, lat, lng);
}
