import { useEffect, useState } from "react";
import { getProduct } from "../../lib/strapi";
import type { StrapiProduct } from "../../lib/strapi.types";
import ProductDetailContent from "./ProductDetailContent";

function readIdFromUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("id") ?? "";
}

const loadingClass =
  "flex min-h-[40vh] w-full items-center justify-center text-base text-neutral-600";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<StrapiProduct | null | "loading">("loading");

  useEffect(() => {
    const documentId = readIdFromUrl();
    if (!documentId) {
      setProduct(null);
      return;
    }
    let cancelled = false;
    void getProduct(documentId).then((data) => {
      if (!cancelled) setProduct(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (product === "loading") {
    return (
      <div className={loadingClass} role="status" aria-busy="true">
        Cargando producto…
      </div>
    );
  }

  if (!product) {
    return (
      <div className={loadingClass} role="alert">
        Producto no encontrado.{" "}
        <a href="/productos" className="ml-1 underline hover:text-black">
          Ver todos los productos
        </a>
      </div>
    );
  }

  const mapImage = (img: { url: string; alternativeText: string | null; width: number; height: number }) => ({
    url: img.url,
    alternativeText: img.alternativeText,
    width: img.width,
    height: img.height,
  });

  const gallery = (product.gallery ?? []).map(mapImage);
  const infoImages = (product.info ?? []).map(mapImage);
  const presentations = (product.presentations ?? []).map((p) => ({
    documentId: p.documentId,
    name: p.name,
  }));

  return (
    <ProductDetailContent
      name={product.name}
      description={product.description ?? ""}
      presentations={presentations}
      gallery={gallery}
      infoImages={infoImages}
    />
  );
}
