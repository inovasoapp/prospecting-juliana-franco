import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

type CTAButtonSize = "base" | "sm";
type CTAButtonRadius = "full" | "md";

interface CTAButtonMorphProps {
  /** Cor de fundo do botão e do painel expandido. Aceita qualquer cor CSS válida. */
  buttonBgColor?: string;

  bgColor?: string;
  /** Cor do texto do título (botão + cabeçalho expandido). */
  titleColor?: string;
  /** Texto sempre visível, no botão e no cabeçalho do painel expandido. */
  title: string;
  /** Conteúdo exibido apenas quando expandido (tela cheia). */
  children?: ReactNode;
  /** Classes extras opcionais para o botão fechado (ex: margens, largura). */
  className?: string;
  /** Tamanho do botão fechado. "base" = tamanho atual, "sm" = fonte/padding menores. */
  size?: CTAButtonSize;
  radius?: CTAButtonRadius;
}

const SIZE_STYLES: Record<CTAButtonSize, string> = {
  base: "px-6 py-2 text-lg",
  sm: "px-4 py-2 text-sm",
};

const RADIUS_STYLES: Record<CTAButtonRadius, string> = {
  full: "rounded-full",
  md: "rounded-md",
};

export default function CTAButtonMorph({
  buttonBgColor = "#a855f7", // purple-500
  bgColor = "#a855f7", // purple-500
  titleColor = "#ffffff",
  title,
  children,
  className = "",
  size = "base",
  radius = "md",
}: CTAButtonMorphProps) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const uid = useId();
  const morphId = `cta-morph-${uid}`;
  const titleId = `cta-morph-title-${uid}`;

  // Portal só pode ser criado no client
  useEffect(() => setMounted(true), []);

  // Esc fecha o painel (o morph encolhe de volta pro botão) + trava o scroll da página
  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = original;
    };
  }, [expanded]);

  return (
    <>
      {/* Botão — some do fluxo assim que expande, o layoutId cuida do morph */}
      <AnimatePresence>
        {!expanded && (
          <motion.button
            key="button"
            layoutId={morphId}
            onClick={() => setExpanded(true)}
            style={{ backgroundColor: buttonBgColor }}
            className={`w-full ${RADIUS_STYLES[radius]} transition-[filter] duration-300 hover:brightness-90 lg:w-auto ${SIZE_STYLES[size]} ${className}`}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <motion.span
              layoutId={titleId}
              style={{ color: titleColor }}
              className="block"
            >
              {title}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Painel em tela cheia — renderizado via portal pra ficar acima de tudo */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {expanded && (
              <motion.div
                key="panel"
                layoutId={morphId}
                style={{ backgroundColor: bgColor }}
                className="fixed inset-0 z-100 flex flex-col overflow-y-auto"
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <div className="flex items-center justify-between px-6 py-5 sm:px-10">
                  {/* <motion.span
                    layoutId={titleId}
                    style={{ color: titleColor }}
                    className="text-xl font-semibold sm:text-2xl"
                  >
                    {title}
                  </motion.span> */}

                  <button
                    type="button"
                    aria-label="Fechar"
                    onClick={() => setExpanded(false)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 ml-auto"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <line
                        x1="2"
                        y1="2"
                        x2="16"
                        y2="16"
                        stroke={titleColor}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <line
                        x1="16"
                        y1="2"
                        x2="2"
                        y2="16"
                        stroke={titleColor}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                  className="flex-1 px-6 pb-10 sm:px-10"
                >
                  {children}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
