const selectClass =
  "min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide shadow-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/30 disabled:cursor-not-allowed disabled:opacity-60 md:min-w-[11rem]";

const buttonClass =
  "inline-flex shrink-0 items-center justify-center rounded-md bg-[#FBDF00] px-7 py-2.5 text-sm font-bold uppercase tracking-wide text-black shadow-md transition hover:bg-yellow-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 disabled:cursor-not-allowed disabled:opacity-60";

type ProductFiltersProps = {
  etapa: string;
  tamaño: string;
  etapaOptions: string[];
  tamañoOptions: string[];
  onEtapaChange: (value: string) => void;
  onTamañoChange: (value: string) => void;
  onFilter: () => void;
  disabled?: boolean;
};

export function ProductFilters({
  etapa,
  tamaño,
  etapaOptions,
  tamañoOptions,
  onEtapaChange,
  onTamañoChange,
  onFilter,
  disabled = false,
}: ProductFiltersProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-3 md:gap-x-4">
      <span className="w-full shrink-0 text-center text-sm font-bold uppercase tracking-wide text-black sm:w-auto sm:text-left">
        Filtrar por:
      </span>
      <div className="flex w-full min-w-0 flex-1 flex-wrap items-center justify-center gap-3 sm:flex-nowrap md:gap-4">
        <label className="sr-only" htmlFor="filter-etapa">
          Etapa
        </label>
        <select
          id="filter-etapa"
          value={etapa}
          disabled={disabled}
          onChange={(ev) => onEtapaChange(ev.target.value)}
          className={`${selectClass} ${etapa === "" ? "text-neutral-400" : "text-neutral-800"}`}
        >
          <option value="">ETAPA</option>
          {etapaOptions.map((opt) => (
            <option key={`etapa-${opt}`} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="filter-tamaño">
          Tamaño
        </label>
        <select
          id="filter-tamaño"
          value={tamaño}
          disabled={disabled}
          onChange={(ev) => onTamañoChange(ev.target.value)}
          className={`${selectClass} ${tamaño === "" ? "text-neutral-400" : "text-neutral-800"}`}
        >
          <option value="">TAMAÑO</option>
          {tamañoOptions.map((opt) => (
            <option key={`tam-${opt}`} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button type="button" className={buttonClass} disabled={disabled} onClick={onFilter}>
          Filtrar
        </button>
      </div>
    </div>
  );
}
