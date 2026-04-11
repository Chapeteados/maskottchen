/**
 * Ruta de ficha de producto: una sola página estática que carga el producto en cliente.
 * URL: `/producto?id=<documentId>`
 */
export function productDetailPath(documentId: string): string {
  return `/producto?id=${encodeURIComponent(documentId)}`;
}
