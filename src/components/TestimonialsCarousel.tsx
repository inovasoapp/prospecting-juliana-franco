import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  text: string;
};

type Props = {
  testimonials?: Testimonial[];
};

const defaultTestimonials: Testimonial[] = [
  {
    name: "Mariana Almeida",
    role: "Residência · São Paulo",
    text: "Desde o primeiro encontro sentimos que nosso projeto estava em boas mãos. Cada escolha foi pensada com muito cuidado e o resultado superou tudo o que imaginávamos.",
  },
  {
    name: "Ricardo Martins",
    role: "Apartamento · São Paulo",
    text: "A Juliana conseguiu traduzir exatamente aquilo que queríamos, mesmo quando nós mesmos ainda não sabíamos explicar. O projeto ficou elegante, acolhedor e muito funcional.",
  },
  {
    name: "Fernanda Costa",
    role: "Residência · Alphaville",
    text: "O acompanhamento durante todo o processo fez muita diferença. Tivemos segurança nas decisões e um resultado que realmente representa nossa família.",
  },
  {
    name: "Camila Ribeiro",
    role: "Apartamento · Higienópolis",
    text: "O olhar para os detalhes é impressionante. Cada ambiente tem personalidade, mas ao mesmo tempo existe uma harmonia incrível entre toda a casa.",
  },
  {
    name: "Eduardo Santos",
    role: "Residência · São Paulo",
    text: "Mais do que um projeto bonito, recebemos uma casa pensada para a nossa rotina. A funcionalidade foi tratada com o mesmo cuidado que a estética.",
  },
  {
    name: "Patrícia Oliveira",
    role: "Interiores · São Paulo",
    text: "Foi uma experiência muito tranquila. A equipe entendeu nossas referências e conseguiu transformar nossas ideias em algo muito mais sofisticado do que imaginávamos.",
  },
  {
    name: "Daniela Ferreira",
    role: "Apartamento · Vila Madalena",
    text: "A curadoria de materiais, iluminação e mobiliário fez toda a diferença. O apartamento ganhou uma identidade que antes não tinha.",
  },
  {
    name: "Marcelo Nogueira",
    role: "Residência · São Paulo",
    text: "O projeto conseguiu equilibrar arquitetura, conforto e personalidade. Hoje cada espaço da casa faz sentido para a nossa maneira de viver.",
  },
  {
    name: "Luciana Mendes",
    role: "Apartamento · Jardins",
    text: "Sempre tivemos muita confiança nas escolhas apresentadas. O resultado ficou sofisticado sem perder a sensação de acolhimento que queríamos.",
  },
  {
    name: "Rafael Carvalho",
    role: "Residência · Alphaville",
    text: "A atenção aos detalhes e o cuidado em todas as etapas tornaram o processo muito especial. É uma casa que realmente parece ter sido feita para nós.",
  },
  {
    name: "Isabela Rocha",
    role: "Interiores · São Paulo",
    text: "A proposta conseguiu unir referências que pareciam diferentes e transformá-las em um projeto extremamente coerente e elegante.",
  },
  {
    name: "Gustavo Martins",
    role: "Apartamento · Pinheiros",
    text: "O resultado ficou muito além do que esperávamos. Cada ambiente tem uma atmosfera própria, mas tudo conversa perfeitamente.",
  },
  {
    name: "Renata Souza",
    role: "Residência · São Paulo",
    text: "Sentimos que nossas necessidades foram realmente ouvidas. O projeto tem beleza, mas principalmente tem a nossa história em cada detalhe.",
  },
  {
    name: "André Lima",
    role: "Apartamento · Jardins",
    text: "Profissionalismo, sensibilidade e muito bom gosto. Foi uma parceria excelente do começo ao fim.",
  },
  {
    name: "Beatriz Martins",
    role: "Residência · São Paulo",
    text: "A casa ficou exatamente como sonhávamos, mas de uma maneira que nunca teríamos conseguido imaginar sozinhos.",
  },
  {
    name: "Thiago Almeida",
    role: "Interiores · São Paulo",
    text: "A experiência foi muito positiva. Tivemos acompanhamento próximo e muita clareza em cada etapa do projeto.",
  },
  {
    name: "Carolina Mendes",
    role: "Apartamento · Vila Clementino",
    text: "O cuidado com proporções, materiais e iluminação transformou completamente nosso apartamento. Ficou sofisticado e, ao mesmo tempo, muito nosso.",
  },
  {
    name: "Felipe Rocha",
    role: "Residência · São Paulo",
    text: "Um projeto pensado nos mínimos detalhes. O resultado é atemporal e continua fazendo sentido para nossa família todos os dias.",
  },
];

export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
}: Props) {
  /*
   * =========================================================
   * ESTADO
   * =========================================================
   */

  const [desktopPage, setDesktopPage] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const totalDesktopPages = Math.ceil(testimonials.length / 3);
  const totalMobileItems = testimonials.length;

  /*
   * =========================================================
   * NAVEGAÇÃO
   * =========================================================
   */

  const goToDesktopPage = (page: number) => {
    const nextPage = Math.max(0, Math.min(page, totalDesktopPages - 1));
    setDesktopPage(nextPage);
  };

  const desktopPrevious = () => {
    goToDesktopPage(desktopPage - 1);
  };

  const desktopNext = () => {
    goToDesktopPage(desktopPage + 1);
  };

  const goToMobileIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, totalMobileItems - 1));
    setMobileIndex(nextIndex);
  };

  const mobilePrevious = () => {
    goToMobileIndex(mobileIndex - 1);
  };

  const mobileNext = () => {
    goToMobileIndex(mobileIndex + 1);
  };

  /*
   * =========================================================
   * SWIPE - MOBILE
   * =========================================================
   */

  const mobileTouchStartX = useRef<number | null>(null);
  const mobileTouchStartY = useRef<number | null>(null);

  const handleMobileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    mobileTouchStartX.current = touch.clientX;
    mobileTouchStartY.current = touch.clientY;
  };

  const handleMobileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (
      mobileTouchStartX.current === null ||
      mobileTouchStartY.current === null
    ) {
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) return;

    const distanceX = touch.clientX - mobileTouchStartX.current;
    const distanceY = touch.clientY - mobileTouchStartY.current;

    mobileTouchStartX.current = null;
    mobileTouchStartY.current = null;

    if (Math.abs(distanceX) < Math.abs(distanceY) || Math.abs(distanceX) < 40) {
      return;
    }

    if (distanceX < 0) {
      mobileNext();
    } else {
      mobilePrevious();
    }
  };

  /*
   * =========================================================
   * SWIPE - DESKTOP
   * =========================================================
   */

  const desktopTouchStartX = useRef<number | null>(null);
  const desktopTouchStartY = useRef<number | null>(null);

  const handleDesktopTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    desktopTouchStartX.current = touch.clientX;
    desktopTouchStartY.current = touch.clientY;
  };

  const handleDesktopTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (
      desktopTouchStartX.current === null ||
      desktopTouchStartY.current === null
    ) {
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) return;

    const distanceX = touch.clientX - desktopTouchStartX.current;
    const distanceY = touch.clientY - desktopTouchStartY.current;

    desktopTouchStartX.current = null;
    desktopTouchStartY.current = null;

    if (Math.abs(distanceX) < Math.abs(distanceY) || Math.abs(distanceX) < 50) {
      return;
    }

    if (distanceX < 0) {
      desktopNext();
    } else {
      desktopPrevious();
    }
  };

  /*
   * =========================================================
   * CARD HELPER
   * =========================================================
   */

  const TestimonialCard = ({
    testimonial,
    displayIndex,
  }: {
    testimonial: Testimonial;
    displayIndex: number;
  }) => (
    <article
      className="
        group
        relative
        flex
        h-full
        min-h-82.5
        flex-col
        justify-between
        rounded-lg
        border
        border-brown/10
        bg-white/30
        p-7
        transition-colors
        duration-500
        hover:border-primary/20
        hover:bg-white/50
        sm:p-8
        lg:min-h-87.5
      "
    >
      {/* TOP */}
      <div>
        <div className="flex items-start justify-between">
          <Quote size={22} strokeWidth={1} className="text-primary/55" />

          <span
            className="
              font-mono
              text-[9px]
              tracking-[0.2em]
              text-brown/20
            "
          >
            {String(displayIndex + 1).padStart(2, "0")}
          </span>
        </div>

        <p
          className="
            mt-8
            text-[15px]
            font-light
            leading-7
            text-brown/65
          "
        >
          “{testimonial.text}”
        </p>
      </div>

      {/* BOTTOM */}
      <div className="mt-10">
        <div
          className="
            mb-5
            h-px
            w-8
            bg-primary/60
          "
        />

        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-title
          "
        >
          {testimonial.name}
        </p>

        <p
          className="
            mt-2
            text-[9px]
            uppercase
            tracking-[0.15em]
            text-brown/30
          "
        >
          {testimonial.role}
        </p>
      </div>
    </article>
  );

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="w-full" aria-label="Depoimentos de clientes">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-12 flex items-end justify-between gap-8 lg:mb-16">
        <div>
          <span
            className="
              block
              text-[9px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-primary
            "
          >
            Depoimentos
          </span>

          <div className="mt-5 flex items-center gap-4">
            <span className="h-px w-10 bg-primary" />

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-brown/35
              "
            >
              Experiências reais
            </span>
          </div>

          <h2 className="mt-7 max-w-2xl text-2xl font-light leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Histórias que continuam
            <span className="italic"> depois do projeto.</span>
          </h2>
        </div>

        {/* ===================================================
            DESKTOP CONTROLS
        ==================================================== */}

        <div className="hidden items-center gap-3 sm:flex">
          <button
            type="button"
            onClick={desktopPrevious}
            disabled={desktopPage === 0}
            aria-label="Depoimentos anteriores"
            className="
              flex size-11
              items-center justify-center
              rounded-full
              bg-primary/10
              border border-brown/10
              text-brown/60
              transition-all duration-300
              hover:border-primary/40
              hover:text-primary
              disabled:pointer-events-none
              disabled:opacity-25
            "
          >
            <ChevronLeft size={17} strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={desktopNext}
            disabled={desktopPage === totalDesktopPages - 1}
            aria-label="Próximos depoimentos"
            className="
              flex size-11
              items-center justify-center
              rounded-full
              bg-primary/10
              border border-brown/10
              text-brown/60
              transition-all duration-300
              hover:border-primary/40
              hover:text-primary
              disabled:pointer-events-none
              disabled:opacity-25
            "
          >
            <ChevronRight size={17} strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {/* =====================================================
          CAROUSEL VIEWPORT - MOBILE (1 POR VEZ)
      ====================================================== */}

      <div
        className="
          relative
          overflow-hidden
          touch-pan-y
          select-none
          sm:hidden
        "
        onTouchStart={handleMobileTouchStart}
        onTouchEnd={handleMobileTouchEnd}
      >
        <div
          className="
            flex
            transition-transform
            duration-700
            ease-[cubic-bezier(.22,1,.36,1)]
          "
          style={{
            transform: `translateX(-${mobileIndex * 100}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full shrink-0">
              <TestimonialCard testimonial={testimonial} displayIndex={index} />
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          CAROUSEL VIEWPORT - DESKTOP (3 POR VEZ)
      ====================================================== */}

      <div
        className="
          relative
          hidden
          overflow-hidden
          touch-pan-y
          select-none
          sm:block
        "
        onTouchStart={handleDesktopTouchStart}
        onTouchEnd={handleDesktopTouchEnd}
      >
        <div
          className="
            flex
            transition-transform
            duration-700
            ease-[cubic-bezier(.22,1,.36,1)]
          "
          style={{
            transform: `translateX(-${desktopPage * 100}%)`,
          }}
        >
          {Array.from({
            length: totalDesktopPages,
          }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="
                grid
                w-full
                shrink-0
                grid-cols-1
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {testimonials
                .slice(pageIndex * 3, pageIndex * 3 + 3)
                .map((testimonial, index) => (
                  <TestimonialCard
                    key={`${testimonial.name}-${pageIndex}-${index}`}
                    testimonial={testimonial}
                    displayIndex={pageIndex * 3 + index}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          BOTTOM NAVIGATION
      ====================================================== */}

      <div
        className="
          mt-9
          flex
          items-center
          justify-between
          border-t
          border-brown/10
          pt-6
        "
      >
        {/* ===================================================
            MOBILE ARROWS
        ==================================================== */}

        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={mobilePrevious}
            disabled={mobileIndex === 0}
            aria-label="Depoimento anterior"
            className="
              flex size-9
              items-center justify-center
              rounded-full
              bg-primary/10
              border border-brown/10
              text-brown/55
              transition-all duration-300
              disabled:pointer-events-none
              disabled:opacity-20
            "
          >
            <ChevronLeft size={15} strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={mobileNext}
            disabled={mobileIndex === totalMobileItems - 1}
            aria-label="Próximo depoimento"
            className="
              flex size-9
              items-center justify-center
              rounded-full
              bg-primary/10
              border border-brown/10
              text-brown/55
              transition-all duration-300
              disabled:pointer-events-none
              disabled:opacity-20
            "
          >
            <ChevronRight size={15} strokeWidth={1.25} />
          </button>
        </div>

        {/* ===================================================
            MOBILE INDICATOR
        ==================================================== */}

        <div className="mx-auto flex items-center gap-4 sm:hidden">
          <span
            className="
              font-mono
              text-[9px]
              tracking-[0.2em]
              text-primary
            "
          >
            {String(mobileIndex + 1).padStart(2, "0")}
          </span>

          <div className="relative h-px w-20 bg-brown/15">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${((mobileIndex + 1) / totalMobileItems) * 100}%`,
              }}
            />
          </div>

          <span
            className="
              font-mono
              text-[9px]
              tracking-[0.2em]
              text-brown/25
            "
          >
            {String(totalMobileItems).padStart(2, "0")}
          </span>
        </div>

        {/* ===================================================
            DESKTOP INDICATOR
        ==================================================== */}

        <div className="hidden items-center gap-4 sm:flex">
          <span
            className="
              font-mono
              text-[9px]
              tracking-[0.2em]
              text-primary
            "
          >
            {String(desktopPage + 1).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-1.5">
            {Array.from({
              length: totalDesktopPages,
            }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToDesktopPage(index)}
                aria-label={`Ir para grupo ${index + 1}`}
                aria-current={desktopPage === index ? "true" : undefined}
                className="
                  group
                  flex
                  h-4
                  items-center
                "
              >
                <span
                  className={`
                    block
                    h-px
                    transition-all duration-500
                    ${
                      desktopPage === index
                        ? "w-8 bg-primary"
                        : "w-3 bg-brown/15 group-hover:bg-brown/40"
                    }
                  `}
                />
              </button>
            ))}
          </div>

          <span
            className="
              font-mono
              text-[9px]
              tracking-[0.2em]
              text-brown/25
            "
          >
            {String(totalDesktopPages).padStart(2, "0")}
          </span>
        </div>

        {/* ===================================================
            HINT
        ==================================================== */}

        <span
          className="
            hidden
            text-[8px]
            uppercase
            tracking-[0.2em]
            text-brown/25
            sm:block
          "
        >
          {testimonials.length} experiências
        </span>

        <span
          className="
            text-[8px]
            uppercase
            tracking-[0.18em]
            text-brown/25
            sm:hidden
          "
        >
          Arraste
        </span>
      </div>
    </section>
  );
}
