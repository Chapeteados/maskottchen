import type { StrapiProduct } from "../../lib/strapi";

const buttonClass =
  "inline-flex items-center justify-center rounded-md md:rounded-lg bg-[#FBDF00] px-8 py-2 text-sm md:text-base font-semibold text-black shadow-md hover:shadow-lg hover:bg-yellow-300 transition";

type ProductCardProps = {
  product: StrapiProduct;
  ctaHref?: string;
};

export function ProductCard({ product, ctaHref = "/donde-comprar" }: ProductCardProps) {
  const imageUrl = product.gallery?.[0]?.url ?? null;
  const firstImage = product.gallery?.[0];

  return (
    <li className="flex flex-col h-full rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <div className="w-full shrink-0 bg-white flex items-center justify-center min-h-[220px] md:min-h-[260px] p-6 md:p-8">
        {imageUrl && firstImage ? (
          <img
            src={imageUrl}
            alt={firstImage.alternativeText ?? product.name}
            className="max-h-[220px] md:max-h-[280px] w-full object-contain"
            loading="lazy"
            width={firstImage.width}
            height={firstImage.height}
          />
        ) : (
          <div className="w-full h-48 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 items-center text-center px-6 pb-8 pt-2 gap-2 min-h-0">
        <h3 className="text-2xl md:text-3xl font-black uppercase text-black leading-tight tracking-tight">
          {product.name}
        </h3>
        <div className="mt-auto w-full flex justify-center pt-4">
          <a href={ctaHref} className={buttonClass}>
            DÓNDE COMPRAR
          </a>
        </div>
      </div>
    </li>
  );
}
