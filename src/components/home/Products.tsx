import type { StrapiProduct } from "../../lib/strapi";

import { ProductCard } from "./ProductCard";

type ProductsProps = {
  products: StrapiProduct[];
};

export default function Products({ products }: ProductsProps) {
  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black uppercase text-center text-black mb-12">
          Nuestros productos
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-neutral-600">No hay productos disponibles por ahora.</p>
        ) : (
          <ul className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {products.map((product) => (
              <ProductCard key={product.documentId ?? product.id} product={product} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
