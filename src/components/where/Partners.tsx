import { getPartners } from "../../lib/strapi";
import type { Partner } from "../../lib/strapi.types";
import { useAsyncResource } from "../../hooks/useAsyncResource";

import PartnerCard from "./PartnerCard";

const Partners = () => {
  const { data, loading } = useAsyncResource(getPartners, []);
  const partners: Partner[] = data ?? [];

  return (
    <div className="flex min-h-0 max-h-[40vh] w-full flex-col items-center gap-4 overflow-y-auto overscroll-y-contain md:max-h-[min(45vh,36rem)] md:w-1/4 md:min-w-0 md:flex-1">
      {!loading && partners.length === 0 ? (
        <p className="text-center text-sm text-white" role="status">
          No hay partners por el momento.
        </p>
      ) : (
        partners.map((partner) => <PartnerCard key={partner.documentId} partner={partner} />)
      )}
    </div>
  );
};

export default Partners;
