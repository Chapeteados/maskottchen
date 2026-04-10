import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { googleMapsDirectionsUrl } from "../../lib/googleMaps";

/** Iconos por defecto de Leaflet en bundlers (Vite). Solo aplica si no hay `markerIcon`. */
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

export type MapMarkerIconConfig = {
  iconUrl: string;
  iconSize?: [number, number];
  /** Punto del icono que coincide con lat/lng (p. ej. punta del pin abajo-centro). */
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
};

function createLeafletIcon(config: MapMarkerIconConfig): L.Icon {
  const w = config.iconSize?.[0] ?? 40;
  const h = config.iconSize?.[1] ?? 40;
  return L.icon({
    iconUrl: config.iconUrl,
    iconSize: [w, h],
    iconAnchor: config.iconAnchor ?? [Math.floor(w / 2), h],
    popupAnchor: config.popupAnchor ?? [0, Math.max(-Math.floor(h * 0.85), -h + 4)],
  });
}

/**
 * Geocodificación vía API pública Nominatim (datos OpenStreetMap).
 * Política: https://operations.osmfoundation.org/policies/nominatim/ — uso razonable, no masivo.
 * En sitios estáticos no hay proxy propio; con mucho tráfico conviene backend propio o proveedor.
 */
async function geocodeAddress(address: string): Promise<{ lat: number; lon: number }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "es",
    },
  });
  if (!res.ok) {
    throw new Error("No se pudo geocodificar la dirección");
  }
  const data = (await res.json()) as { lat: string; lon: string }[];
  const first = data[0];
  if (!first) {
    throw new Error("Sin resultados para esa dirección");
  }
  return { lat: parseFloat(first.lat), lon: parseFloat(first.lon) };
}

type OsmAddressMapProps = {
  /** Texto del popup; si solo hay coordenadas, puede quedar vacío y se muestran lat/lng. */
  address?: string;
  /** Si `latitude` y `longitude` son válidos, se centra el pin ahí y no se llama a Nominatim. */
  latitude?: number;
  longitude?: number;
  /** Imagen propia del pin (`L.icon`); si falta, marcador por defecto de Leaflet. */
  markerIcon?: MapMarkerIconConfig;
  className?: string;
};

function coordsFromProps(latitude?: number, longitude?: number): [number, number] | null {
  if (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    return [latitude, longitude];
  }
  return null;
}

function LeafletMapView(props: {
  position: [number, number];
  popupText: string;
  /** Dirección para «Cómo llegar»; si existe, el enlace prioriza el texto sobre las coordenadas. */
  directionsAddress?: string;
  className: string;
  markerIcon?: MapMarkerIconConfig;
}) {
  const { position, popupText, directionsAddress, className, markerIcon } = props;
  const leafletIcon = useMemo(
    () => (markerIcon ? createLeafletIcon(markerIcon) : undefined),
    [markerIcon],
  );

  return (
    <div
      className={`relative z-0 w-full overflow-hidden rounded-xl md:max-h-[min(70vh,32rem)] ${className}`}
    >
      <MapContainer
        center={position}
        zoom={15}
        className="h-[min(70vh,32rem)] min-h-[280px] w-full [&_.leaflet-control-attribution]:text-[10px]"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} {...(leafletIcon ? { icon: leafletIcon } : {})}>
          <Popup>
            <div className="min-w-48 text-sm text-neutral-800">
              {popupText ? <p className="mb-2 leading-snug">{popupText}</p> : null}
              <a
                href={googleMapsDirectionsUrl({
                  latitude: position[0],
                  longitude: position[1],
                  address: directionsAddress,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-800 underline decoration-blue-800/50 underline-offset-2 hover:text-blue-950"
              >
                Cómo llegar
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default function OsmAddressMap({
  address = "",
  latitude,
  longitude,
  markerIcon,
  className = "",
}: OsmAddressMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fixed = useMemo(() => coordsFromProps(latitude, longitude), [latitude, longitude]);

  useEffect(() => {
    if (!markerIcon?.iconUrl) {
      fixLeafletIcons();
    }
  }, [markerIcon?.iconUrl]);

  useEffect(() => {
    if (coordsFromProps(latitude, longitude)) return;
    const q = address.trim();
    if (!q) {
      setPosition(null);
      setError("Indica una dirección o coordenadas (latitud y longitud).");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPosition(null);
    void (async () => {
      try {
        const { lat, lon } = await geocodeAddress(q);
        if (!cancelled) setPosition([lat, lon]);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error al cargar el mapa");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [address, latitude, longitude]);

  if (fixed) {
    const popupText =
      address.trim() || `${fixed[0].toFixed(5)}, ${fixed[1].toFixed(5)}`;
    return (
      <LeafletMapView
        position={fixed}
        popupText={popupText}
        directionsAddress={address.trim() || undefined}
        className={className}
        markerIcon={markerIcon}
      />
    );
  }

  if (loading) {
    return (
      <div
        className={`flex min-h-[280px] w-full items-center justify-center rounded-xl bg-neutral-200/80 text-sm text-neutral-600 md:max-h-[min(70vh,32rem)] ${className}`}
        role="status"
        aria-busy="true"
      >
        Cargando mapa…
      </div>
    );
  }

  if (error || !position) {
    return (
      <div
        className={`flex min-h-[280px] w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-center text-sm text-neutral-600 md:max-h-[min(70vh,32rem)] ${className}`}
        role="alert"
      >
        {error ?? "Mapa no disponible"}
      </div>
    );
  }

  return (
    <LeafletMapView
      position={position}
      popupText={address.trim()}
      directionsAddress={address.trim() || undefined}
      className={className}
      markerIcon={markerIcon}
    />
  );
}
