const REVEAL_SELECTOR = "[data-reveal]";

let observer: IntersectionObserver | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealElement(el: Element) {
  if (el.classList.contains("is-visible")) return;
  const node = el as HTMLElement;
  requestAnimationFrame(() => {
    void node.offsetHeight;
    node.classList.add("is-visible");
  });
}

function showAll(elements: NodeListOf<Element>) {
  for (const el of elements) {
    el.classList.add("is-visible");
  }
}

function createObserver() {
  return new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealElement(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
  );
}

function observeNewElements() {
  const elements = document.querySelectorAll(`${REVEAL_SELECTOR}:not(.is-visible)`);
  if (elements.length === 0) return;

  if (!observer) {
    observer = createObserver();
  }

  for (const el of elements) {
    const delay = el.getAttribute("data-reveal-delay");
    if (delay) {
      (el as HTMLElement).style.setProperty("--reveal-delay", `${delay}ms`);
    }
    observer.observe(el);
  }
}

function setupViewTimelineFallback() {
  if (CSS.supports("animation-timeline: view()")) return;

  document.querySelectorAll(".why-scroll-reveal").forEach((el, index) => {
    el.setAttribute("data-reveal", "fade-up");
    if (index > 0) {
      el.setAttribute("data-reveal-delay", String(index * 120));
    }
    el.classList.add("scroll-reveal");
  });
}

function boot() {
  setupViewTimelineFallback();
  document.documentElement.classList.add("scroll-reveal-enabled");

  const elements = document.querySelectorAll(REVEAL_SELECTOR);
  if (elements.length === 0) return;

  if (prefersReducedMotion()) {
    showAll(elements);
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(observeNewElements);
  });
}

let scanScheduled = false;

function scheduleScan() {
  if (scanScheduled) return;
  scanScheduled = true;
  requestAnimationFrame(() => {
    scanScheduled = false;
    observeNewElements();
  });
}

function start() {
  boot();
  const mutationObserver = new MutationObserver(scheduleScan);
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(start), { once: true });
} else {
  requestAnimationFrame(start);
}

document.addEventListener("astro:page-load", () => {
  document.documentElement.classList.add("scroll-reveal-enabled");
  observeNewElements();
});
