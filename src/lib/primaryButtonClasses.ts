/**
 * Estilos del botón primario (amarillo), compartidos entre `Button.astro` y controles `<button>` en React.
 */

const core =
  "inline-flex items-center justify-center bg-[#FBDF00] font-semibold text-black shadow-md transition hover:bg-yellow-300 hover:shadow-lg";

/** Variante enlace (`Button.astro`). */
export const primaryButtonLinkClass = `${core} rounded-md md:rounded-lg px-8 py-2 text-sm md:text-base`;

/** Variante envío de formulario (ancho completo, estados disabled/focus). */
export const primaryButtonSubmitClass = `${core} w-full rounded-md px-4 py-3 font-sans text-base focus:outline-none focus:ring-2 focus:ring-[#FBDF00]/60 disabled:cursor-not-allowed disabled:opacity-60`;
