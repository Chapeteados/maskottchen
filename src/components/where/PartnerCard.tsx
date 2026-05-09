import type { Partner } from "../../lib/strapi.types";

type PartnerCardProps = {
  partner: Partner;
  selected?: boolean;
  onSelect?: () => void;
};

const PartnerCard = ({ partner, selected = false, onSelect }: PartnerCardProps) => {
  const { name, address, phone } = partner;
  const interactive = typeof onSelect === "function";

  const shell = (
    <>
      <div
        className={`flex max-w-lg flex-col items-center justify-center gap-2 rounded-t-2xl border px-4 py-2 ${
          selected ? "border-[#FFED00] ring-2 ring-[#FFED00]/60 ring-offset-2 ring-offset-transparent" : "border-[#FFED00]"
        }`}
      >
        <h2 className="text-center text-2xl font-bold uppercase text-[#D9B668]">{name}</h2>
        <p className="text-center text-base text-white">{address}</p>
      </div>
      <a
        href={`tel:${phone}`}
        onClick={(e) => e.stopPropagation()}
        className="block w-full max-w-lg rounded-b-2xl border border-[#FFED00] px-4 py-2 text-center font-bold uppercase text-white"
      >
        Llamar
      </a>
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="block w-full max-w-lg cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-[#FFED00] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-pressed={selected}
        aria-label={`Ver ${name} en el mapa`}
      >
        {shell}
      </button>
    );
  }

  return <div>{shell}</div>;
};

export default PartnerCard;
