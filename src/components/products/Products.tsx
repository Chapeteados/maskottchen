import { useEffect, useMemo, useState } from "react";

import { getProducts, type StrapiProduct } from "../../lib/strapi";
import { buildProductFilterOptions, productMatchesFilters } from "../../lib/productFilter";
import { productDetailPath } from "../../lib/productRoutes";
import { useAsyncResource } from "../../hooks/useAsyncResource";

import { ProductCard } from "../home/ProductCard";
import { ProductFilters } from "./ProductFilters";

export default function Products() {
  const { data, loading } = useAsyncResource(getProducts, []);
  const products: StrapiProduct[] = data ?? [];

  const { etapaOptions, tamañoOptions } = useMemo(
    () => buildProductFilterOptions(products),
    [products],
  );

  const [etapa, setEtapa] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [appliedEtapa, setAppliedEtapa] = useState("");
  const [appliedTamaño, setAppliedTamaño] = useState("");

  useEffect(() => {
    if (etapa !== "" && !etapaOptions.includes(etapa)) {
      setEtapa("");
    }
    if (tamaño !== "" && !tamañoOptions.includes(tamaño)) {
      setTamaño("");
    }
  }, [etapa, tamaño, etapaOptions, tamañoOptions]);

  useEffect(() => {
    if (appliedEtapa !== "" && !etapaOptions.includes(appliedEtapa)) {
      setAppliedEtapa("");
    }
    if (appliedTamaño !== "" && !tamañoOptions.includes(appliedTamaño)) {
      setAppliedTamaño("");
    }
  }, [appliedEtapa, appliedTamaño, etapaOptions, tamañoOptions]);

  const filtered = useMemo(
    () => products.filter((p) => productMatchesFilters(p, appliedEtapa, appliedTamaño)),
    [products, appliedEtapa, appliedTamaño],
  );

  const handleFilter = () => {
    setAppliedEtapa(etapa);
    setAppliedTamaño(tamaño);
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 md:px-8 md:py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src="/paw.webp"
          alt=""
          className="absolute -right-20 top-10 w-52 rotate-25 opacity-25 md:w-72"
        />
        <img
          src="/paw.webp"
          alt=""
          className="absolute -left-16 bottom-10 w-44 rotate-[-15deg] opacity-25 md:w-60"
        />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <ProductFilters
          etapa={etapa}
          tamaño={tamaño}
          etapaOptions={etapaOptions}
          tamañoOptions={tamañoOptions}
          onEtapaChange={setEtapa}
          onTamañoChange={setTamaño}
          onFilter={handleFilter}
          disabled={loading}
        />

        <div className="mt-10">
          {loading ? (
            <p className="text-center text-neutral-600" aria-busy="true">
              Cargando productos…
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-neutral-600">
              {products.length === 0
                ? "No hay productos disponibles por ahora."
                : "No hay productos que coincidan con los filtros."}
            </p>
          ) : (
            <ul className="grid items-stretch gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.documentId ?? product.id}
                  product={product}
                  ctaHref={productDetailPath(product.documentId)}
                  ctaLabel="Ver producto"
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>

  );
}
