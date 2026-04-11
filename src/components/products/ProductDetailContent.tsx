import { useEffect, useState } from "react";

const ctaClass =
  "inline-flex w-full max-w-md items-center justify-center rounded-lg bg-[#FBDF00] px-8 py-3 text-base font-semibold text-black shadow-md transition hover:bg-yellow-300 hover:shadow-lg md:text-lg";

export type ProductDetailContentProps = {
  name: string;
  description: string;
  presentations: Array<{ documentId: string; name: string }>;
  gallery: Array<{
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
  }>;
  dondeComprarHref?: string;
};

export default function ProductDetailContent({
  name,
  description,
  presentations,
  gallery,
  dondeComprarHref = "/donde-comprar",
}: ProductDetailContentProps) {
  const [mainIndex, setMainIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (gallery.length <= 1 || paused) return;
    const id = setInterval(() => {
      setMainIndex((i) => (i + 1) % gallery.length);
    }, 2000);
    return () => clearInterval(id);
  }, [gallery.length, paused]);

  const main = gallery[mainIndex];

  return (
    <div className="space-y-12 md:space-y-16">
      <header className="text-center">
        <h1 className="text-3xl font-black uppercase leading-tight tracking-tight text-black md:text-4xl lg:text-5xl">
          {name}
        </h1>
      </header>

      <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
        <div className="flex flex-col gap-4">
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm md:min-h-[360px] md:p-10">
            {main ? (
              <img
                src={main.url}
                alt={main.alternativeText ?? name}
                className="max-h-[min(55vh,420px)] w-full object-contain"
                width={main.width}
                height={main.height}
              />
            ) : (
              <span className="text-sm text-neutral-400">Sin imagen</span>
            )}
          </div>

          {gallery.length > 1 ? (
            <ul className="flex flex-wrap justify-center gap-3 md:justify-start">
              {gallery.map((img, i) => (
                <li key={`${img.url}-${i}`}>
                  <button
                    type="button"
                    onClick={() => { setMainIndex(i); setPaused(true); }}
                    className={`rounded-xl border-2 bg-white p-2 transition hover:opacity-95 ${
                      i === mainIndex
                        ? "border-[#FBDF00] ring-2 ring-[#FBDF00]/50"
                        : "border-neutral-200 hover:border-[#FBDF00]/60"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alternativeText ?? `${name} — miniatura ${i + 1}`}
                      className="h-20 w-20 object-contain md:h-24 md:w-24"
                      width={img.width}
                      height={img.height}
                      loading="lazy"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 text-black">
          {description ? (
            <p className="text-base leading-relaxed text-neutral-800 md:text-lg">{description}</p>
          ) : null}

          {presentations.length > 0 ? (
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-black">
                Presentaciones:
              </p>
              <div className="flex flex-wrap gap-3">
                {presentations.map((p) => (
                  <span
                    key={p.documentId}
                    className="rounded-lg border-2 border-[#FBDF00] bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-black md:text-base"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pt-2">
            <a href={dondeComprarHref} className={ctaClass}>
              DÓNDE COMPRAR
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
