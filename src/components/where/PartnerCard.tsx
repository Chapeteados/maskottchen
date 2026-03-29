import type { Partner } from "../../lib/strapi.types";

const PartnerCard = ({ partner }: { partner: Partner }) => {
  const { name, address, phone } = partner;
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-2 border border-[#FFED00] rounded-t-2xl px-4 py-2 max-w-lg">
        <h2 className="text-2xl font-bold text-[#D9B668] text-center uppercase">{name}</h2>
        <p className="text-base text-white text-center">{address}</p>
      </div>
      <div className="border border-[#FFED00] rounded-b-2xl max-w-lg w-full px-4 py-2 text-center font-bold uppercase text-white">
        Llamar
      </div>
    </div>
  );
};

export default PartnerCard;
