import { A as AstroError, p as InvalidComponentArgs, q as FontFamilyNotFound, u as unescapeHTML, h as addAttribute, r as renderTemplate } from './entrypoint_DpI6LXiv.mjs';
import 'piccolore';
import 'clsx';

function validateArgs(args) {
  if (args.length !== 3) return false;
  if (!args[0] || typeof args[0] !== "object") return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = (...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb(...args);
  };
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
  return cb;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}

const componentDataByCssVariable = new Map([["--font-maven-pro",{"preloads":[{"style":"normal","subset":"latin","type":"woff2","url":"/_astro/fonts/907c93f02c58a280.woff2","weight":"400"}],"css":"@font-face{font-family:\"Maven Pro-3413716a183e08a4\";src:url(\"/_astro/fonts/907c93f02c58a280.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:400;font-style:normal;}@font-face{font-family:\"Maven Pro-3413716a183e08a4\";src:url(\"/_astro/fonts/907c93f02c58a280.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:500;font-style:normal;}@font-face{font-family:\"Maven Pro-3413716a183e08a4\";src:url(\"/_astro/fonts/907c93f02c58a280.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:600;font-style:normal;}@font-face{font-family:\"Maven Pro-3413716a183e08a4\";src:url(\"/_astro/fonts/907c93f02c58a280.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:700;font-style:normal;}@font-face{font-family:\"Maven Pro-3413716a183e08a4\";src:url(\"/_astro/fonts/907c93f02c58a280.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:800;font-style:normal;}@font-face{font-family:\"Maven Pro-3413716a183e08a4\";src:url(\"/_astro/fonts/907c93f02c58a280.woff2\") format(\"woff2\");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:900;font-style:normal;}@font-face{font-family:\"Maven Pro-3413716a183e08a4 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:400;font-style:normal;size-adjust:103.6337%;ascent-override:93.1164%;descent-override:20.2637%;line-gap-override:0%;}@font-face{font-family:\"Maven Pro-3413716a183e08a4 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:500;font-style:normal;size-adjust:103.6337%;ascent-override:93.1164%;descent-override:20.2637%;line-gap-override:0%;}@font-face{font-family:\"Maven Pro-3413716a183e08a4 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:600;font-style:normal;size-adjust:103.6337%;ascent-override:93.1164%;descent-override:20.2637%;line-gap-override:0%;}@font-face{font-family:\"Maven Pro-3413716a183e08a4 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:700;font-style:normal;size-adjust:103.6337%;ascent-override:93.1164%;descent-override:20.2637%;line-gap-override:0%;}@font-face{font-family:\"Maven Pro-3413716a183e08a4 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:800;font-style:normal;size-adjust:103.6337%;ascent-override:93.1164%;descent-override:20.2637%;line-gap-override:0%;}@font-face{font-family:\"Maven Pro-3413716a183e08a4 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:900;font-style:normal;size-adjust:103.6337%;ascent-override:93.1164%;descent-override:20.2637%;line-gap-override:0%;}:root{--font-maven-pro:\"Maven Pro-3413716a183e08a4\",\"Maven Pro-3413716a183e08a4 fallback: Arial\",sans-serif;}"}],["--font-icons",{"preloads":[{"style":"normal","type":"woff2","url":"/_astro/fonts/e6767f7e5fa23eb1.woff2","weight":"100 700"}],"css":"@font-face{font-family:\"Material Symbols Outlined-182d419295e93b09\";src:url(\"/_astro/fonts/e6767f7e5fa23eb1.woff2\") format(\"woff2\");font-display:swap;font-weight:100 700;font-style:normal;}@font-face{font-family:\"Material Symbols Outlined-182d419295e93b09 fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:100 700;font-style:normal;size-adjust:224.3154%;ascent-override:49.0381%;descent-override:4.458%;line-gap-override:0%;}:root{--font-icons:\"Material Symbols Outlined-182d419295e93b09\",\"Material Symbols Outlined-182d419295e93b09 fallback: Arial\",sans-serif;}"}]]);

function filterPreloads(data, preload) {
  if (!preload) {
    return null;
  }
  if (preload === true) {
    return data;
  }
  return data.filter(
    ({ weight, style, subset }) => preload.some((p) => {
      if (p.weight !== void 0 && weight !== void 0 && !checkWeight(p.weight.toString(), weight)) {
        return false;
      }
      if (p.style !== void 0 && p.style !== style) {
        return false;
      }
      if (p.subset !== void 0 && p.subset !== subset) {
        return false;
      }
      return true;
    })
  );
}
function checkWeight(input, target) {
  const trimmedInput = input.trim();
  if (trimmedInput.includes(" ")) {
    return trimmedInput === target;
  }
  if (target.includes(" ")) {
    const [a, b] = target.split(" ");
    const parsedInput = Number.parseInt(input);
    return parsedInput >= Number.parseInt(a) && parsedInput <= Number.parseInt(b);
  }
  return input === target;
}

const $$Font = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Font;
  const { cssVariable, preload = false } = Astro2.props;
  const data = componentDataByCssVariable.get(cssVariable);
  if (!data) {
    throw new AstroError({
      ...FontFamilyNotFound,
      message: FontFamilyNotFound.message(cssVariable)
    });
  }
  const filteredPreloadData = filterPreloads(data.preloads, preload);
  return renderTemplate`<style>${unescapeHTML(data.css)}</style>${filteredPreloadData?.map(({ url, type }) => renderTemplate`<link rel="preload"${addAttribute(url, "href")} as="font"${addAttribute(`font/${type}`, "type")} crossorigin>`)}`;
}, "/Users/manu/workspace/maskottchen/node_modules/.pnpm/astro@6.0.5_@vercel+functions@3.4.3_jiti@2.6.1_lightningcss@1.31.1_rollup@4.59.0_typescript@5.9.3/node_modules/astro/components/Font.astro", void 0);

export { $$Font as $, createComponent as c };
