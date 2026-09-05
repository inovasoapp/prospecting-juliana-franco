import { useEffect, useState } from "react";
import { Expand, X, ArrowLeft, ArrowRight } from "lucide-react";

type GalleryImage = {
  src: string;
  alt: string;
};

type Props = {
  images: GalleryImage[];
};

export default function OfficeGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const isOpen = activeIndex !== null;

  const open = (index: number) => {
    setActiveIndex(index);
    setDirection(1);
  };

  const close = () => {
    setActiveIndex(null);
  };

  const goNext = () => {
    if (activeIndex === null || isAnimating) return;

    setDirection(1);
    setIsAnimating(true);

    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  };

  const goPrevious = () => {
    if (activeIndex === null || isAnimating) return;

    setDirection(-1);
    setIsAnimating(true);

    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  };

  /*
   * Keyboard
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrevious();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, activeIndex, isAnimating]);

  /*
   * Swipe
   */
  const handleTouchStart = (event: React.TouchEvent) => {
    const startX = event.touches[0].clientX;

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      const distance = endX - startX;

      if (Math.abs(distance) > 60) {
        if (distance < 0) {
          goNext();
        } else {
          goPrevious();
        }
      }

      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchend", handleTouchEnd);
  };

  /*
   * Gallery item
   */
  const GalleryItem = ({
    index,
    className,
  }: {
    index: number;
    className: string;
  }) => (
    <button
      type="button"
      onClick={() => open(index)}
      aria-label={`Abrir imagem ${index + 1} de ${images.length}`}
      className={`group relative w-full overflow-hidden text-left ${className}`}
    >
      <img
        src={images[index].src}
        alt={images[index].alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035] rounded-lg"
      />

      {/* subtle overlay */}
      <div className="absolute inset-0 bg-brown/0 transition-colors duration-500 group-hover:bg-brown/20" />

      {/* index */}
      <span
        className="
          absolute left-5 top-5
          text-[9px] font-medium
          tracking-[0.25em]
          text-white/0
          transition-all duration-500
          group-hover:text-white/90
        "
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* expand */}
      <span
        className="
          absolute bottom-5 right-5
          flex size-10 items-center justify-center
          rounded-full
          border border-white/30
          bg-black/10
          text-white
          opacity-0
          backdrop-blur-sm
          transition-all duration-500
          group-hover:opacity-100
        "
      >
        <Expand size={14} strokeWidth={1.5} />
      </span>
    </button>
  );

  return (
    <>
      {/* =====================================================
          GALLERY
      ====================================================== */}

      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        {/* ROW 1 / 2 — IMAGE 01 */}
        <GalleryItem
          index={0}
          className="
            col-span-12
            aspect-4/3
            sm:col-span-5
            sm:row-span-2
            sm:aspect-auto
            sm:min-h-105
          "
        />

        {/* IMAGE 02 */}
        <GalleryItem
          index={1}
          className="
            col-span-12
            aspect-16/8
            sm:col-span-7
            sm:aspect-auto
            sm:min-h-51.25
          "
        />

        {/* IMAGE 03 */}
        <GalleryItem
          index={2}
          className="
            col-span-12
            aspect-16/8
            sm:col-span-7
            sm:aspect-auto
            sm:min-h-51.25
          "
        />

        {/* ROW 3 */}

        {/* IMAGE 04 */}
        <GalleryItem
          index={3}
          className="
            col-span-12
            aspect-4/3
            sm:col-span-4
            sm:aspect-auto
            sm:min-h-75
          "
        />

        {/* IMAGE 05 */}
        <GalleryItem
          index={4}
          className="
            col-span-12
            aspect-video
            sm:col-span-8
            sm:aspect-auto
            sm:min-h-75
          "
        />

        {/* ROW 4 */}

        {/* IMAGE 06 */}
        <GalleryItem
          index={5}
          className="
            col-span-12
            aspect-video
            sm:col-span-7
            sm:aspect-auto
            sm:min-h-70
          "
        />

        {/* IMAGE 07 */}
        <GalleryItem
          index={6}
          className="
            col-span-12
            aspect-4/3
            sm:col-span-5
            sm:aspect-auto
            sm:min-h-70
          "
        />
      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {isOpen && activeIndex !== null && (
        <div
          className="
            fixed inset-0 z-100
            flex items-center justify-center
            bg-overlay/95
            backdrop-blur-sm
            p-4
            sm:p-8
          "
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de imagens do escritório"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              close();
            }
          }}
        >
          {/* TOP BAR */}
          <div
            className="
              absolute left-5 right-5 top-5 z-30
              flex items-center justify-between
              sm:left-8 sm:right-8 sm:top-8
            "
          >
            <div>
              <span
                className="
                  block text-[10px]
                  uppercase tracking-[0.3em]
                  text-white/40
                "
              >
                Juliana Franco
              </span>

              <span
                className="
                  mt-1 block text-[9px]
                  uppercase tracking-[0.2em]
                  text-white/20
                "
              >
                Escritório
              </span>
            </div>

            <div className="flex items-center gap-5">
              <span
                className="
                  font-mono text-[10px]
                  tracking-[0.2em]
                  text-white/40
                "
              >
                {String(activeIndex + 1).padStart(2, "0")}
                {" / "}
                {String(images.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={close}
                aria-label="Fechar galeria"
                className="
                  flex size-10 items-center justify-center
                  rounded-full
                  border border-white/15
                  text-white/70
                  transition-all duration-300
                  hover:border-white/40
                  hover:bg-white/5
                  hover:text-white
                "
              >
                <X size={17} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* IMAGE AREA */}
          <div
            className="
              relative flex h-full w-full
              items-center justify-center
              touch-none
              select-none
            "
            onTouchStart={handleTouchStart}
          >
            <img
              key={activeIndex}
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              draggable={false}
              className={`
                max-h-[82vh]
                max-w-[90vw]
                object-contain
                shadow-2xl
                ${
                  direction === 1
                    ? "animate-[gallery-next_450ms_cubic-bezier(.22,1,.36,1)]"
                    : "animate-[gallery-prev_450ms_cubic-bezier(.22,1,.36,1)]"
                }
              `}
            />
          </div>

          {/* LEFT */}
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Imagem anterior"
            className="
              group absolute left-3 top-1/2
              flex size-12 -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-white/10
              text-white/60
              transition-all duration-300
              hover:border-white/30
              hover:bg-white/5
              hover:text-white
              sm:left-8
            "
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </button>

          {/* RIGHT */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima imagem"
            className="
              group absolute right-3 top-1/2
              flex size-12 -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-white/10
              text-white/60
              transition-all duration-300
              hover:border-white/30
              hover:bg-white/5
              hover:text-white
              sm:right-8
            "
          >
            <ArrowRight
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>

          {/* BOTTOM */}
          <div
            className="
              absolute bottom-5 left-5 right-5
              flex items-end justify-between
              sm:bottom-8 sm:left-8 sm:right-8
            "
          >
            <span
              className="
                text-[9px]
                uppercase tracking-[0.2em]
                text-white/25
              "
            >
              <span className="sm:hidden">Deslize para navegar</span>

              <span className="hidden sm:inline">← → navegar · ESC fechar</span>
            </span>

            {/* progress */}
            <div className="hidden items-center gap-1.5 sm:flex">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);

                    setActiveIndex(index);
                  }}
                  aria-label={`Ir para imagem ${index + 1}`}
                  className={`
                    h-px transition-all duration-500
                    ${
                      index === activeIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-white/20 hover:bg-white/50"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes gallery-next {
            from {
              opacity: 0;
              transform: translateX(35px) scale(.985);
            }

            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }

          @keyframes gallery-prev {
            from {
              opacity: 0;
              transform: translateX(-35px) scale(.985);
            }

            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
}
