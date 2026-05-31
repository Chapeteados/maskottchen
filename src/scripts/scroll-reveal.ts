const REVEAL_SELECTOR = "[data-reveal]";

let observer: IntersectionObserver | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function showAll(elements: NodeListOf<Element>) {
  for (const el of elements) {
    el.classList.add("is-visible");
  }
}

function initScrollReveal() {
  observer?.disconnect();
  observer = null;

  const elements = document.querySelectorAll(REVEAL_SELECTOR);
  if (elements.length === 0) return;

  if (prefersReducedMotion()) {
    showAll(elements);
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  for (const el of elements) {
    if (el.classList.contains("is-visible")) continue;
    const delay = el.getAttribute("data-reveal-delay");
    if (delay) {
      (el as HTMLElement).style.setProperty("--reveal-delay", `${delay}ms`);
    }
    observer.observe(el);
  }
}

initScrollReveal();
document.addEventListener("astro:page-load", initScrollReveal);
