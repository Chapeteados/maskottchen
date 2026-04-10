import { lazy, Suspense } from "react";
import type { OsmMapTarget } from "../../lib/osmMapTarget";
import type { MapMarkerIconConfig } from "./OsmAddressMap";

const OsmAddressMap = lazy(() => import("./OsmAddressMap"));

export type { OsmMapTarget } from "../../lib/osmMapTarget";
export { buildOsmMapTarget } from "../../lib/osmMapTarget";
export type { MapMarkerIconConfig } from "./OsmAddressMap";

type DynamicOsmMapProps = {
  target: OsmMapTarget;
  className?: string;
  markerIcon?: MapMarkerIconConfig;
};

const fallbackClass =
  "flex min-h-[280px] w-full items-center justify-center rounded-xl bg-neutral-200/80 text-sm text-neutral-600 md:max-h-[min(70vh,32rem)]";

/**
 * Mapa OSM: `target` define si el pin viene de coordenadas o de una dirección (Nominatim).
 * Carga Leaflet solo en el cliente vía `lazy` para no ejecutarlo en el SSR de Astro.
 */
export default function DynamicOsmMap({
  target,
  className = "",
  markerIcon,
}: DynamicOsmMapProps) {
  return (
    <Suspense
      fallback={
        <div className={`${fallbackClass} ${className}`} role="status" aria-busy="true">
          Cargando mapa…
        </div>
      }
    >
      {target.kind === "coordinates" ? (
        <OsmAddressMap
          latitude={target.latitude}
          longitude={target.longitude}
          address={target.popupLabel ?? ""}
          className={className}
          markerIcon={markerIcon}
        />
      ) : (
        <OsmAddressMap address={target.address} className={className} markerIcon={markerIcon} />
      )}
    </Suspense>
  );
}
