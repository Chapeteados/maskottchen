import { useEffect, useState } from "react";

import type { HomeHeroSlide } from "../../lib/strapi.types";

import { HeroSlide } from "./HeroSlide";

const DEFAULT_DURATION_MS = 10_000;

type HeroSliderProps = {
  slides: HomeHeroSlide[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
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

  return (
    <section className="relative h-[100dvh] md:h-[100vh] overflow-hidden" id="hero-slider">
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slider-slide absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{
              pointerEvents: index === current ? "auto" : "none",
            }}
          >
            <HeroSlide
              slide={slide}
              isActive={index === current}
              arcId={`hero-description-arc-${index}`}
            />
          </div>
        ))}

        <div
          className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-3"
          aria-label="Controles del slider"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`slider-dot h-4 w-4 rounded-full border border-white/70 transition cursor-pointer ${
                index === current ? "bg-[#FBDF00]" : "bg-white/40 hover:bg-white"
              }`}
              aria-label={`Ir al slide ${index + 1}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
