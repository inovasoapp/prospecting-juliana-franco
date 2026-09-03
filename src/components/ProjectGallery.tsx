import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

type GalleryImage = {
  src: string;
  alt: string;
};

type Props = {
  images: GalleryImage[];
  title: string;
};

export default function ProjectGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  /*
   * =========================================================
   * ESTADO DAS SETAS DO CARROSSEL
   * =========================================================
   */

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  const isModalOpen = modalIndex !== null;

  /*
   * =========================================================
   * THUMBNAIL CAROUSEL
   * =========================================================
   */

  const updateThumbnailArrows = () => {
    const container = thumbnailsRef.current;

    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    const tolerance = 2;

    setCanScrollLeft(container.scrollLeft > tolerance);

    setCanScrollRight(container.scrollLeft < maxScrollLeft - tolerance);
  };

  useEffect(() => {
    const container = thumbnailsRef.current;

    if (!container) return;

    updateThumbnailArrows();

    const handleScroll = () => {
      updateThumbnailArrows();
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(() => {
      updateThumbnailArrows();
    });

    resizeObserver.observe(container);

    window.addEventListener("resize", updateThumbnailArrows);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateThumbnailArrows);
    };
  }, [images.length]);

  /*
   * Move o carrossel das miniaturas.
   */
  const scrollThumbnails = (direction: "left" | "right") => {
    const container = thumbnailsRef.current;

    if (!container) return;

    const amount = Math.max(container.clientWidth * 0.75, 180);

    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  /*
   * =========================================================
   * MAIN IMAGE
   * =========================================================
   */

  const selectImage = (index: number) => {
    if (index === activeIndex) return;

    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  /*
   * Mantém a miniatura ativa visível.
   *
   * Não usamos scrollIntoView(), pois ele pode alterar
   * o scroll vertical da página inteira.
   */
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const container = thumbnailsRef.current;

    if (!container) return;

    const activeThumbnail = container.children[activeIndex] as
      | HTMLElement
      | undefined;

    if (!activeThumbnail) return;

    const containerRect = container.getBoundingClientRect();

    const thumbnailRect = activeThumbnail.getBoundingClientRect();

    const padding = 16;

    if (thumbnailRect.left < containerRect.left) {
      container.scrollBy({
        left: thumbnailRect.left - containerRect.left - padding,
        behavior: "smooth",
      });

      return;
    }

    if (thumbnailRect.right > containerRect.right) {
      container.scrollBy({
        left: thumbnailRect.right - containerRect.right + padding,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  /*
   * =========================================================
   * MODAL
   * =========================================================
   */

  const openModal = () => {
    setModalIndex(activeIndex);
  };

  const closeModal = () => {
    setModalIndex(null);
  };

  const next = () => {
    if (modalIndex === null) return;

    setDirection(1);

    setModalIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  };

  const previous = () => {
    if (modalIndex === null) return;

    setDirection(-1);

    setModalIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );
  };

  /*
   * =========================================================
   * KEYBOARD
   * =========================================================
   */

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          closeModal();
          break;

        case "ArrowRight":
          next();
          break;

        case "ArrowLeft":
          previous();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen, modalIndex]);

  /*
   * =========================================================
   * SWIPE MODAL
   * =========================================================
   */

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? 0;

    const distance = endX - touchStartX.current;

    touchStartX.current = null;

    if (Math.abs(distance) < 60) return;

    if (distance < 0) {
      next();
    } else {
      previous();
    }
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      {/* =====================================================
          MAIN GALLERY
      ====================================================== */}

      <div
        className="
          relative
          w-full
          min-w-0
          max-w-full
          overflow-hidden
        "
      >
        {/* =================================================
            MAIN IMAGE
        ================================================== */}

        <button
          type="button"
          onClick={openModal}
          className="
            group
            relative
            block
            w-full
            min-w-0
            max-w-full
            cursor-zoom-in
            overflow-hidden
            rounded-lg
            text-left
          "
          aria-label={`Ampliar imagem de ${title}`}
        >
          <div
            className="
              relative
              aspect-16/10
              w-full
              min-w-0
              max-w-full
              overflow-hidden
              rounded-lg
              bg-[#dedbd7]
            "
          >
            <img
              key={activeIndex}
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className={`
                block
                h-full
                w-full
                min-w-0
                max-w-full
                rounded-lg
                object-cover
                transition-transform
                duration-1200
                ease-[cubic-bezier(.22,1,.36,1)]
                group-hover:scale-[1.02]
                ${
                  direction === 1
                    ? "animate-[project-image-in-right_500ms_ease-out]"
                    : "animate-[project-image-in-left_500ms_ease-out]"
                }
              `}
            />

            {/* OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-brown/0
                transition-colors
                duration-500
                group-hover:bg-brown/10
              "
            />

            {/* EXPAND */}

            <div
              className="
                absolute
                bottom-4
                left-4
                flex
                items-center
                gap-2.5
                opacity-0
                transition-all
                duration-500
                sm:bottom-5
                sm:left-5
                sm:gap-3
                group-hover:opacity-100
              "
            >
              <span
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/40
                  bg-black/10
                  text-white
                  backdrop-blur-sm
                  sm:size-9
                "
              >
                <Expand size={14} strokeWidth={1.5} />
              </span>

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.2em]
                  text-white
                  sm:text-[9px]
                "
              >
                Ampliar
              </span>
            </div>

            {/* COUNTER */}

            <span
              className="
                absolute
                right-4
                top-4
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-white/70
                sm:right-5
                sm:top-5
                sm:text-[9px]
              "
            >
              {String(activeIndex + 1).padStart(2, "0")}
              {" / "}
              {String(images.length).padStart(2, "0")}
            </span>
          </div>
        </button>

        {/* =================================================
            THUMBNAILS
        ================================================== */}

        <div
          className="
            relative
            mt-3
            w-full
            min-w-0
            max-w-full
            overflow-hidden
            sm:mt-4
          "
        >
          {/* =================================================
              LEFT ARROW
          ================================================== */}

          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollThumbnails("left")}
              aria-label="Ver miniaturas anteriores"
              className="
                group
                absolute
                left-1.5
                top-1/2
                z-10
                flex
                size-7
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/60
                bg-background/90
                text-brown/70
                shadow-sm
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-primary/40
                hover:bg-background
                hover:text-primary
                sm:left-2
                sm:top-5
                sm:size-8
                sm:translate-y-0
              "
            >
              <ChevronLeft
                size={14}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-x-0.5
                  sm:size-3.75
                "
              />
            </button>
          )}

          {/* =================================================
              THUMBNAIL TRACK
          ================================================== */}

          <div
            ref={thumbnailsRef}
            className="
              flex
              w-full
              min-w-0
              max-w-full
              gap-1.5
              overflow-x-auto
              overflow-y-hidden
              scroll-smooth
              pb-1
              scrollbar-none
              overscroll-x-contain
              sm:gap-2
            "
          >
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => selectImage(index)}
                aria-label={`Exibir imagem ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`
                  group
                  relative
                  h-14.5
                  w-19
                  shrink-0
                  overflow-hidden
                  rounded-md
                  bg-[#dedbd7]
                  transition-all
                  duration-500
                  sm:h-18
                  sm:w-24
                  sm:rounded-lg
                  ${
                    index === activeIndex
                      ? "opacity-100"
                      : "opacity-45 hover:opacity-80"
                  }
                `}
              >
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="
                    block
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                {/* HOVER */}

                <span
                  className="
                    absolute
                    inset-0
                    bg-brown/0
                    transition-colors
                    duration-300
                    group-hover:bg-brown/5
                  "
                />

                {/* ACTIVE LINE */}

                <span
                  className={`
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-0.5
                    origin-center
                    bg-primary
                    transition-transform
                    duration-500
                    ${index === activeIndex ? "scale-x-100" : "scale-x-0"}
                  `}
                />
              </button>
            ))}
          </div>

          {/* =================================================
              RIGHT ARROW
          ================================================== */}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollThumbnails("right")}
              aria-label="Ver próximas miniaturas"
              className="
                group
                absolute
                right-1.5
                top-1/2
                z-10
                flex
                size-7
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/60
                bg-background/90
                text-brown/70
                shadow-sm
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-primary/40
                hover:bg-background
                hover:text-primary
                sm:right-2
                sm:top-5
                sm:size-8
                sm:translate-y-0
              "
            >
              <ChevronRight
                size={14}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  sm:size-3.75
                "
              />
            </button>
          )}

          {/* INFO */}

          <div
            className="
              mt-2.5
              flex
              items-center
              justify-between
              sm:mt-3
            "
          >
            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.2em]
                text-brown/30
                sm:text-[9px]
              "
            >
              Galeria
            </span>

            <span
              className="
                font-mono
                text-[8px]
                tracking-[0.15em]
                text-brown/30
                sm:text-[9px]
              "
            >
              {String(activeIndex + 1).padStart(2, "0")}
              {" / "}
              {String(images.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {isModalOpen && modalIndex !== null && (
        <div
          className="
            fixed
            inset-0
            z-100
            flex
            items-center
            justify-center
            bg-overlay/95
            backdrop-blur-sm
            p-3
            sm:p-8
          "
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria de ${title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* =================================================
              TOP
          ================================================== */}

          <div
            className="
              absolute
              left-4
              right-4
              top-4
              z-30
              flex
              items-center
              justify-between
              sm:left-8
              sm:right-8
              sm:top-8
            "
          >
            <div className="min-w-0 pr-4">
              <span
                className="
                  block
                  truncate
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-white/40
                  sm:text-[10px]
                "
              >
                {title}
              </span>

              <span
                className="
                  mt-1
                  block
                  text-[8px]
                  uppercase
                  tracking-[0.2em]
                  text-white/20
                  sm:text-[9px]
                "
              >
                Juliana Franco Arquitetura
              </span>
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-3
                sm:gap-5
              "
            >
              <span
                className="
                  font-mono
                  text-[9px]
                  tracking-[0.2em]
                  text-white/40
                  sm:text-[10px]
                "
              >
                {String(modalIndex + 1).padStart(2, "0")}
                {" / "}
                {String(images.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar galeria"
                className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  text-white/70
                  transition-all
                  duration-300
                  hover:border-white/40
                  hover:bg-white/5
                  hover:text-white
                  sm:size-10
                "
              >
                <X size={16} strokeWidth={1.5} className="sm:size-4.25" />
              </button>
            </div>
          </div>

          {/* =================================================
              IMAGE
          ================================================== */}

          <div
            key={modalIndex}
            className={`
              flex
              h-full
              w-full
              min-w-0
              max-w-full
              items-center
              justify-center
              px-8
              sm:px-20
              ${
                direction === 1
                  ? "animate-[project-modal-in-right_500ms_cubic-bezier(.22,1,.36,1)]"
                  : "animate-[project-modal-in-left_500ms_cubic-bezier(.22,1,.36,1)]"
              }
            `}
          >
            <img
              src={images[modalIndex].src}
              alt={images[modalIndex].alt}
              draggable={false}
              className="
                block
                max-h-[78vh]
                max-w-[calc(100vw-4rem)]
                select-none
                object-contain
                shadow-2xl
                sm:max-h-[82vh]
                sm:max-w-[90vw]
              "
            />
          </div>

          {/* =================================================
              PREVIOUS
          ================================================== */}

          <button
            type="button"
            onClick={previous}
            aria-label="Imagem anterior"
            className="
              group
              absolute
              left-2
              top-1/2
              flex
              size-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              text-white/60
              transition-all
              duration-300
              hover:border-white/30
              hover:bg-white/5
              hover:text-white
              sm:left-8
              sm:size-12
            "
          >
            <ChevronLeft
              size={17}
              strokeWidth={1.25}
              className="
                transition-transform
                duration-300
                group-hover:-translate-x-0.5
                sm:size-4.75
              "
            />
          </button>

          {/* =================================================
              NEXT
          ================================================== */}

          <button
            type="button"
            onClick={next}
            aria-label="Próxima imagem"
            className="group absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white sm:right-8 sm:size-12"
          >
            <ChevronRight
              size={17}
              strokeWidth={1.25}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-0.5
                sm:size-4.75
              "
            />
          </button>

          {/* =================================================
              BOTTOM
          ================================================== */}

          <div
            className="
              absolute
              bottom-4
              left-4
              right-4
              flex
              items-end
              justify-between
              sm:bottom-8
              sm:left-8
              sm:right-8
            "
          >
            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.2em]
                text-white/25
                sm:text-[9px]
              "
            >
              <span className="sm:hidden">Deslize para navegar</span>

              <span className="hidden sm:inline">← → navegar · ESC fechar</span>
            </span>

            {/* PROGRESS */}

            <div className="hidden items-center gap-1.5 sm:flex">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setDirection(index > modalIndex ? 1 : -1);

                    setModalIndex(index);
                  }}
                  aria-label={`Ir para imagem ${index + 1}`}
                  className={`
                    h-px
                    transition-all
                    duration-500
                    ${
                      index === modalIndex
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

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes project-image-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes project-image-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes project-modal-in-right {
          from {
            opacity: 0;
            transform: translateX(24px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes project-modal-in-left {
          from {
            opacity: 0;
            transform: translateX(-24px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .scrollbar-none {
          scrollbar-width: none;
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
