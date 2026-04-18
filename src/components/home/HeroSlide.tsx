import { useEffect, useRef } from "react";
import type { HomeHeroSlide } from "../../lib/strapi.types";
import { getYoutubeEmbedUrlFromInput } from "../../lib/youtube";

const buttonClass =
  "inline-flex items-center justify-center rounded-md md:rounded-lg bg-[#FBDF00] px-8 py-2 text-sm md:text-base font-semibold text-black shadow-md hover:shadow-lg hover:bg-yellow-300 transition";

type HeroSlideProps = {
  slide: HomeHeroSlide;
  isActive: boolean;
  arcId: string;
};

export function HeroSlide({ slide, isActive, arcId }: HeroSlideProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { image, youtubeUrl, title, description, buttonLabel, buttonHref } = slide;

  const youtubeEmbedSrc = youtubeUrl ? getYoutubeEmbedUrlFromInput(youtubeUrl) : null;
  const hasYoutube = Boolean(youtubeEmbedSrc);
  const iframeSrc = isActive && youtubeEmbedSrc ? youtubeEmbedSrc : "about:blank";

  const hasTitleOrDescription = Boolean(title?.trim() || description?.trim());

  useEffect(() => {
    if (!isActive || !hasYoutube || !iframeRef.current) return;

    const post = (payload: { event: string; func: string; args: unknown[] }) => {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify(payload), "*");
    };

    const onMessage = (event: MessageEvent) => {
      if (!iframeRef.current?.src || !String(event.origin).includes("youtube")) return;
      let data = event.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { return; }
      }
      if (data?.event === "onStateChange" && data?.info === 0) {
        post({ event: "command", func: "seekTo", args: [0, true] });
        post({ event: "command", func: "playVideo", args: [] });
      }
    };

    window.addEventListener("message", onMessage);
    post({ event: "command", func: "addEventListener", args: ["onStateChange"] });

    return () => window.removeEventListener("message", onMessage);
  }, [hasYoutube, isActive, iframeSrc]);

  return (
    <div
      className={`relative h-full w-full flex items-center justify-start ${
        !hasYoutube ? "bg-cover bg-center" : ""
      }`}
      style={!hasYoutube && image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {hasYoutube && youtubeEmbedSrc ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <iframe
            ref={iframeRef}
            className="youtube-iframe absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
            src={iframeSrc}
            title="Video de YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : null}

      {!hasTitleOrDescription ? (
        buttonLabel &&
        buttonHref && (
          <a
            href={buttonHref}
            className={`${buttonClass} z-10 absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-32`}
          >
            {buttonLabel}
          </a>
        )
      ) : (
        <div className="relative z-10 ml-4 md:ml-16 px-4 md:px-6 py-6 md:py-8 rounded-lg max-w-2xl text-center flex flex-col items-center justify-center gap-4">
          {title ? <h2 className="text-3xl md:text-5xl font-black text-white">{title}</h2> : null}
          {description ? (
            <svg viewBox="0 0 450 150" className="block w-72 h-28 md:w-96 md:h-36">
              <defs>
                <path id={arcId} d="M 40 200 Q 225 60 410 200" />
              </defs>
              <text className="fill-white text-[72px] md:text-[96px] font-black">
                <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
                  {description}
                </textPath>
              </text>
            </svg>
          ) : null}
          {buttonLabel && buttonHref ? (
            <div className="flex justify-center mt-8">
              <a href={buttonHref} className={buttonClass}>
                {buttonLabel}
              </a>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
