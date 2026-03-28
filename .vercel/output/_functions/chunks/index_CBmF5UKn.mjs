import { c as createComponent, $ as $$Font } from './Font_C-7fbIWZ.mjs';
import 'piccolore';
import { k as createRenderInstruction, m as maybeRenderHead, h as addAttribute, r as renderTemplate, l as renderComponent, n as renderHead, o as renderSlot } from './entrypoint_DpI6LXiv.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import 'clsx';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

function extractYoutubeId(input) {
  const s = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return null;
}
function getYoutubeEmbedUrlFromInput(input) {
  const id = extractYoutubeId(input);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    controls: "0",
    modestbranding: "1",
    rel: "0",
    loop: "1",
    playlist: id
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

const buttonClass$1 = "inline-flex items-center justify-center rounded-md md:rounded-lg bg-[#FBDF00] px-8 py-2 text-sm md:text-base font-semibold text-black shadow-md hover:shadow-lg hover:bg-yellow-300 transition";
function HeroSlide({ slide, isActive, arcId }) {
  const { image, youtubeUrl, title, description, buttonLabel, buttonHref } = slide;
  const youtubeEmbedSrc = youtubeUrl ? getYoutubeEmbedUrlFromInput(youtubeUrl) : null;
  const hasYoutube = Boolean(youtubeEmbedSrc);
  const iframeSrc = isActive && youtubeEmbedSrc ? youtubeEmbedSrc : "about:blank";
  const hasTitleOrDescription = Boolean(title?.trim() || description?.trim());
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative h-full w-full flex items-center justify-start ${!hasYoutube ? "bg-cover bg-center" : ""}`,
      style: !hasYoutube && image ? { backgroundImage: `url(${image})` } : void 0,
      children: [
        hasYoutube && youtubeEmbedSrc ? /* @__PURE__ */ jsx(
          "iframe",
          {
            className: "youtube-iframe pointer-events-none absolute inset-0 h-full w-full border-0",
            src: iframeSrc,
            title: "Video de YouTube",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowFullScreen: true
          }
        ) : null,
        !hasTitleOrDescription ? buttonLabel && buttonHref && /* @__PURE__ */ jsx(
          "a",
          {
            href: buttonHref,
            className: `${buttonClass$1} z-10 absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-32`,
            children: buttonLabel
          }
        ) : /* @__PURE__ */ jsxs("div", { className: "relative z-10 ml-4 md:ml-16 px-4 md:px-6 py-6 md:py-8 rounded-lg max-w-2xl text-center flex flex-col items-center justify-center gap-4", children: [
          title ? /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-black text-white", children: title }) : null,
          description ? /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 450 150", className: "block w-72 h-28 md:w-96 md:h-36", children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("path", { id: arcId, d: "M 40 200 Q 225 60 410 200" }) }),
            /* @__PURE__ */ jsx("text", { className: "fill-white text-[72px] md:text-[96px] font-black", children: /* @__PURE__ */ jsx("textPath", { href: `#${arcId}`, startOffset: "50%", textAnchor: "middle", children: description }) })
          ] }) : null,
          buttonLabel && buttonHref ? /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-8", children: /* @__PURE__ */ jsx("a", { href: buttonHref, className: buttonClass$1, children: buttonLabel }) }) : null
        ] })
      ]
    }
  );
}

const DEFAULT_DURATION_MS = 1e4;
function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  useEffect(() => {
    if (total === 0) {
      return;
    }
    const raw = slides[current]?.durationMs;
    const ms = raw != null && Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_DURATION_MS;
    const id = window.setTimeout(() => {
      setCurrent((c) => (c + 1) % total);
    }, ms);
    return () => {
      window.clearTimeout(id);
    };
  }, [current, slides, total]);
  if (total === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("section", { className: "relative h-[100dvh] md:h-[100vh] overflow-hidden", id: "hero-slider", children: /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full", children: [
    slides.map((slide, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `slider-slide absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100" : "opacity-0"}`,
        style: {
          pointerEvents: index === current ? "auto" : "none"
        },
        children: /* @__PURE__ */ jsx(
          HeroSlide,
          {
            slide,
            isActive: index === current,
            arcId: `hero-description-arc-${index}`
          }
        )
      },
      index
    )),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-x-0 bottom-8 flex items-center justify-center gap-3",
        "aria-label": "Controles del slider",
        children: slides.map((_, index) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: `slider-dot h-4 w-4 rounded-full border border-white/70 transition cursor-pointer ${index === current ? "bg-[#FBDF00]" : "bg-white/40 hover:bg-white"}`,
            "aria-label": `Ir al slide ${index + 1}`,
            onClick: () => setCurrent(index)
          },
          index
        ))
      }
    )
  ] }) });
}

const buttonClass = "inline-flex items-center justify-center rounded-md md:rounded-lg bg-[#FBDF00] px-8 py-2 text-sm md:text-base font-semibold text-black shadow-md hover:shadow-lg hover:bg-yellow-300 transition";
function ProductCard({ product, ctaHref = "/donde-comprar" }) {
  const imageUrl = product.gallery?.[0]?.url ?? null;
  const firstImage = product.gallery?.[0];
  return /* @__PURE__ */ jsxs("li", { className: "flex flex-col h-full rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full shrink-0 bg-white flex items-center justify-center min-h-[220px] md:min-h-[260px] p-6 md:p-8", children: imageUrl && firstImage ? /* @__PURE__ */ jsx(
      "img",
      {
        src: imageUrl,
        alt: firstImage.alternativeText ?? product.name,
        className: "max-h-[220px] md:max-h-[280px] w-full object-contain",
        loading: "lazy",
        width: firstImage.width,
        height: firstImage.height
      }
    ) : /* @__PURE__ */ jsx("div", { className: "w-full h-48 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-sm", children: "Sin imagen" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1 items-center text-center px-6 pb-8 pt-2 gap-2 min-h-0", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-black uppercase text-black leading-tight tracking-tight", children: product.name }),
      /* @__PURE__ */ jsx("div", { className: "mt-auto w-full flex justify-center pt-4", children: /* @__PURE__ */ jsx("a", { href: ctaHref, className: buttonClass, children: "DÓNDE COMPRAR" }) })
    ] })
  ] });
}

function Products({ products }) {
  return /* @__PURE__ */ jsx("section", { className: "bg-white py-16 md:py-24 px-4 md:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black uppercase text-center text-black mb-12", children: "Nuestros productos" }),
    products.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-neutral-600", children: "No hay productos disponibles por ahora." }) : /* @__PURE__ */ jsx("ul", { className: "grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 items-stretch", children: products.map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product.documentId ?? product.id)) })
  ] }) });
}

const $$Attribute = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Attribute;
  const { image, title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-col items-center justify-center gap-2 max-w-24 text-center"> <img${addAttribute(image, "src")}${addAttribute(title, "alt")}> <h3 class="text-md font-bold">${title}</h3> </div>`;
}, "/Users/manu/workspace/maskottchen/src/components/home/Attribute.astro", void 0);

const $$Attributes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="bg-[#FFEB00] w-full py-8 flex flex-wrap justify-center items-center md:items-start gap-16"> ${renderComponent($$result, "Attribute", $$Attribute, { "image": "/nutricion.png", "title": "Nutrición Balanceada" })} ${renderComponent($$result, "Attribute", $$Attribute, { "image": "/palatabilidad.png", "title": "Alta palatabilidad" })} ${renderComponent($$result, "Attribute", $$Attribute, { "image": "/calidad.png", "title": "Calidad a precio justo" })} ${renderComponent($$result, "Attribute", $$Attribute, { "image": "/mexico.png", "title": "Hecho en México" })} </div>`;
}, "/Users/manu/workspace/maskottchen/src/components/home/Attributes.astro", void 0);

const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Button;
  const {
    href,
    label,
    className = ""
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(`inline-flex items-center justify-center rounded-md md:rounded-lg bg-[#FBDF00] px-8 py-2 text-sm md:text-base font-semibold text-black shadow-md hover:shadow-lg hover:bg-yellow-300 transition ${className}`, "class")}> ${label} </a>`;
}, "/Users/manu/workspace/maskottchen/src/components/Button.astro", void 0);

const $$Why = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="relative flex flex-col md:flex-row items-center justify-center gap-16 p-16"> <img src="/why.png" alt="Why" class="w-full h-full object-cover max-w-full md:max-w-1/2"> <div class="relative flex flex-col items-center justify-center gap-8"> <img src="/paw.webp" alt="" class="hidden lg:block absolute -top-16 -left-6 w-20 h-20 object-contain" aria-hidden="true"> <img src="/paw.webp" alt="" class="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-12 w-20 h-20 object-contain" aria-hidden="true"> <img src="/paw.webp" alt="" class="hidden lg:block absolute -bottom-12 left-8 w-20 h-20 object-contain" aria-hidden="true"> <img src="/paw.webp" alt="" class="hidden lg:block absolute -bottom-2 -right-4 w-20 h-20 object-contain" aria-hidden="true"> <h2 class="text-5xl md:text-6xl font-bold uppercase leading-[30px] md:leading-[45px]">
¿Por qué <br> <span class="text-4xl md:text-5xl block">&nbsp;&nbsp;Maskottchen?</span> </h2> <p class="text-base md:text-lg text-center font-bold">
Tu perro merece lo mejor. <br> En Maskottchen combinamos amor, nutrición y calidad. Ellos confían
      en tí, y tú, ¡puedes confíar en nosotros!
</p> ${renderComponent($$result, "Button", $$Button, { "label": "Conoce más", "href": "/" })} </div> </div>`;
}, "/Users/manu/workspace/maskottchen/src/components/home/Why.astro", void 0);

const $$NavLinks = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$NavLinks;
  const { itemClass = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li><a${addAttribute(itemClass, "class")} href="/">Inicio</a></li> <li><a${addAttribute(itemClass, "class")} href="/products">Productos</a></li> <li><a${addAttribute(itemClass, "class")} href="/about-us">Sobre Maskottchen</a></li> <li><a${addAttribute(itemClass, "class")} href="/contact">¿Donde Comprar?</a></li> <li><a${addAttribute(itemClass, "class")} href="/contact">Contacto</a></li>`;
}, "/Users/manu/workspace/maskottchen/src/components/NavLinks.astro", void 0);

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="bg-[#D9D9D910] w-full shadow-sm md:px-16 px-2 py-2 flex md:flex-row flex-col items-center justify-between fixed top-0 left-0 z-10"> <div class="flex gap-4 items-center justify-between"> <img src="/logo.webp" alt="Maskottchen Logo" class="w-20 h-20"> <button class="md:hidden" id="menu-toggle" type="button" aria-label="Abrir menú"> <span id="menu-icon" class="material-symbols-outlined">menu</span> </button> </div> <ul class="flex items-center gap-4 md:flex hidden"> ${renderComponent($$result, "NavLinks", $$NavLinks, { "itemClass": "font-bold" })} </ul> <ul id="mobile-menu" class="flex flex-col gap-4 hidden md:hidden absolute left-0 top-full w-full bg-[#D9D9D980] p-4"> ${renderComponent($$result, "NavLinks", $$NavLinks, { "itemClass": "font-bold text-white" })} </ul> </div> ${renderScript($$result, "/Users/manu/workspace/maskottchen/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/manu/workspace/maskottchen/src/components/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="h-full w-full bg-cover bg-center flex items-center justify-start py-8"${addAttribute(`background-image: url('/footer.webp');`, "style")}> <div class="mx-auto px-4 flex items-center justify-center gap-16"> <img src="/footer_logo.webp" alt="Maskottchen Logo" class="w-20 h-20"> <div class="flex flex-col items-center gap-8"> <ul class="flex items-center gap-4"> ${renderComponent($$result, "NavLinks", $$NavLinks, { "itemClass": "text-white" })} </ul> <div class="flex items-center gap-16"> <ul class="flex items-center gap-4"> <li><a href="/" class="text-white">Terminos y Condiciones</a></li> <li><a href="/" class="text-white">Aviso de Privacidad</a></li> </ul> <ul class="flex items-center gap-4"> <li> <a${addAttribute("#", "href")} target="_blank" rel="noopener noreferrer" class="inline-flex text-white hover:opacity-80 transition" aria-label="Facebook"> <img src="/icons/facebook.svg" alt="" width="28" height="28" class="w-7 h-7 object-contain brightness-0 invert"> </a> </li> <li> <a${addAttribute("#", "href")} target="_blank" rel="noopener noreferrer" class="inline-flex text-white hover:opacity-80 transition" aria-label="Instagram"> <img src="/icons/instagram.svg" alt="" width="28" height="28" class="w-7 h-7 object-contain brightness-0 invert"> </a> </li> </ul> </div> </div> </div> </div>`;
}, "/Users/manu/workspace/maskottchen/src/components/Footer.astro", void 0);

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Maskottchen ${title ? `- ${title}` : ""}</title>${renderComponent($$result, "Font", $$Font, { "cssVariable": "--font-maven-pro", "preload": true })}${renderComponent($$result, "Font", $$Font, { "cssVariable": "--font-icons", "preload": true })}${renderHead()}</head> <body class="font-sans"> ${renderComponent($$result, "Navbar", $$Navbar, {})} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/Users/manu/workspace/maskottchen/src/layouts/Layout.astro", void 0);

const JSON_HEADERS = { Accept: "application/json" };
function getStrapiBaseUrl() {
  const prod = "https://maskottchen-be-production.up.railway.app";
  return prod;
}
const DEFAULT_SLIDE_DURATION_MS = 1e4;
const SLIDES_QUERY = "sort[0]=order:asc&pagination[pageSize]=50";
const HOME_PRODUCTS_LIMIT = 3;
const HOME_PRODUCTS_QUERY = "populate[0]=presentations&populate[1]=gallery&pagination[limit]=3&sort[0]=createdAt:desc";
function normalizeSlide(row) {
  const youtubeUrl = row.youtubeUrl?.trim() || void 0;
  const image = row.imageUrl?.trim() || void 0;
  if (!youtubeUrl && !image) {
    return null;
  }
  const durationMs = row.durationMs != null && Number.isFinite(row.durationMs) && row.durationMs > 0 ? row.durationMs : DEFAULT_SLIDE_DURATION_MS;
  return {
    image,
    youtubeUrl,
    title: row.title?.trim() || void 0,
    description: row.description?.trim() || void 0,
    buttonLabel: row.buttonLabel?.trim() || void 0,
    buttonHref: row.buttonHref?.trim() || void 0,
    durationMs
  };
}
async function getSlides() {
  const base = getStrapiBaseUrl();
  const url = `${base}/api/slides?${SLIDES_QUERY}`;
  const res = await fetch(url, { headers: JSON_HEADERS, cache: "no-store" });
  if (!res.ok) {
    console.error(`[strapi] getSlides failed: ${res.status} ${res.statusText}`);
    return [];
  }
  const json = await res.json();
  const raw = Array.isArray(json.data) ? json.data : [];
  const out = [];
  for (const row of raw) {
    const n = normalizeSlide(row);
    if (n) out.push(n);
  }
  return out;
}
async function getHomeProducts() {
  const base = getStrapiBaseUrl();
  const url = `${base}/api/products?${HOME_PRODUCTS_QUERY}`;
  const res = await fetch(url, { headers: JSON_HEADERS, cache: "no-store" });
  if (!res.ok) {
    console.error(`[strapi] getHomeProducts failed: ${res.status} ${res.statusText}`);
    return [];
  }
  const json = await res.json();
  const raw = Array.isArray(json.data) ? json.data : [];
  return raw.slice(0, HOME_PRODUCTS_LIMIT);
}

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const slides = await getSlides();
  const products = await getHomeProducts();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroSlider", HeroSlider, { "slides": slides, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/manu/workspace/maskottchen/src/components/home/HeroSlider.tsx", "client:component-export": "default" })} ${renderComponent($$result2, "Attributes", $$Attributes, {})} ${renderComponent($$result2, "Why", $$Why, {})} ${renderComponent($$result2, "Products", Products, { "products": products, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/manu/workspace/maskottchen/src/components/home/Products.tsx", "client:component-export": "default" })} ` })}`;
}, "/Users/manu/workspace/maskottchen/src/pages/index.astro", void 0);

const $$file = "/Users/manu/workspace/maskottchen/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
