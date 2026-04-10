import { useEffect, useMemo, useState } from "react";
import { getPartners } from "../../lib/strapi";
import type { Partner } from "../../lib/strapi.types";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { partnerToMapTarget } from "../../lib/osmMapTarget";
import { MAP_MARKER_ICON_SIZE, MAP_MARKER_ICON_URL } from "../../lib/constants";
import type { MapMarkerIconConfig } from "../maps/OsmAddressMap";

import DynamicOsmMap from "../maps/DynamicOsmMap";
import PartnerCard from "./PartnerCard";

const mapPlaceholderClass =
  "flex min-h-[280px] w-full items-center justify-center rounded-xl border border-neutral-200/40 bg-neutral-900/20 px-4 text-center text-sm text-white md:max-h-[min(70vh,32rem)]";

export default function WherePartnersMap() {
  const { data, loading } = useAsyncResource(getPartners, []);
  const partners: Partner[] = data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const markerIcon = useMemo((): MapMarkerIconConfig | undefined => {
    if (!MAP_MARKER_ICON_URL?.trim()) return undefined;
    const cfg: MapMarkerIconConfig = { iconUrl: MAP_MARKER_ICON_URL.trim() };
    if (MAP_MARKER_ICON_SIZE) {
      cfg.iconSize = MAP_MARKER_ICON_SIZE;
    }
    return cfg;
  }, []);

  console.log(selectedId);

  useEffect(() => {
    if (partners.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId((prev) => {
      if (prev && partners.some((p) => p.documentId === prev)) return prev;
      const firstMappable = partners.find((p) => partnerToMapTarget(p) != null);
      return (firstMappable ?? partners[0]).documentId;
    });
  }, [partners]);

  const selected = partners.find((p) => p.documentId === selectedId) ?? null;
  const mapTarget = selected ? partnerToMapTarget(selected) : null;

  return (
    <div className="flex w-full flex-col gap-8 md:col-span-2 md:grid md:grid-cols-[2fr_1fr] md:items-start md:gap-6 lg:gap-8">
      <div className="w-full min-w-0">
        {loading ? (
          <div className={mapPlaceholderClass} role="status" aria-busy="true">
            Cargando mapa…
          </div>
        ) : partners.length === 0 ? (
          <div className={mapPlaceholderClass} role="status">
            Cuando haya distribuidores en la lista, aquí verás su ubicación en el mapa.
          </div>
        ) : mapTarget ? (
          <DynamicOsmMap
            key={selectedId ?? "map"}
            target={mapTarget}
            markerIcon={markerIcon}
          />
        ) : (
          <div className={mapPlaceholderClass} role="status">
            Este distribuidor no tiene dirección ni coordenadas para el mapa. Elige otro en la
            lista.
          </div>
        )}
      </div>
      <div className="flex min-h-0 min-w-0 w-full justify-center md:justify-start">
        <div className="flex min-h-0 max-h-[40vh] w-full flex-col items-center gap-4 overflow-y-auto overscroll-y-contain md:max-h-[min(45vh,36rem)] md:min-w-0 md:flex-1">
          {!loading && partners.length === 0 ? (
            <p className="text-center text-sm text-white" role="status">
              No hay partners por el momento.
            </p>
          ) : (
            partners.map((partner) => (
              <PartnerCard
                key={partner.documentId}
                partner={partner}
                selected={partner.documentId === selectedId}
                onSelect={() => setSelectedId(partner.documentId)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
