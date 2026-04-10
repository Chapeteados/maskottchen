/**
 * Indicaciones en Google Maps. Si hay `address`, se usa como destino (Google lo geocodifica);
 * suele coincidir mejor con la dirección del partner que unas coordenadas erróneas en el CMS.
 * Sin texto, destino = `lat,lng`.
 * @see https://developers.google.com/maps/documentation/urls/get-started#directions-action
 */
export function googleMapsDirectionsUrl(opts: {
  latitude: number;
  longitude: number;
  address?: string;
}): string {
  const a = opts.address?.trim();
  if (a) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a)}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${opts.latitude},${opts.longitude}`;
}
