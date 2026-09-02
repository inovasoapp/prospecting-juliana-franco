import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

export interface MegaMenuItem {
  id: string;
  label: string;
  href: string;
  title: string;
  description: string;
  image: string;
}

interface NavMegaMenuLinkProps {
  /** Texto do link trigger (ex: "Soluções") */
  label: string;
  /** Itens do menu — cada um vira um link à esquerda e um preview à direita */
  items: MegaMenuItem[];
  className?: string;
  href?: string;
  /**
   * "desktop" = comportamento atual (hover abre painel via portal).
   * "mobile"  = link normal que, ao ser clicado, desliza pra baixo mostrando as opções
   *             (sem navegar direto) + um link "Ver todas" ao final.
   */
  variant?: "desktop" | "mobile";
}

const CLOSE_DELAY = 150;
const PANEL_WIDTH = 640;
const PANEL_GAP = 16; // distância entre o nav e o painel
const VIEWPORT_MARGIN = 16; // margem mínima até a borda da tela

export default function NavMegaMenuLink({
  label,
  items,
  className = "",
  href = "#solucoes",
  variant = "desktop",
}: NavMegaMenuLinkProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);

  const triggerRef = useRef<HTMLLIElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = items.find((item) => item.id === activeId) ?? items[0];

  // Portal só pode ser criado no client
  useEffect(() => setMounted(true), []);

  const updateCoords = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const left = Math.min(
      Math.max(rect.left + rect.width / 2 - PANEL_WIDTH / 2, VIEWPORT_MARGIN),
      window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN,
    );

    setCoords({ top: rect.bottom + PANEL_GAP, left });
  };

  const openMenu = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    updateCoords();
    setOpen(true);
  };

  const scheduleClose = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  // Recalcula a posição enquanto o painel está aberto (scroll do nav, resize etc.)
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updateCoords, true);
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [open]);

  // ── Versão mobile: link normal, clique expande/recolhe (accordion) ──
  if (variant === "mobile") {
    return (
      <li className={className}>
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            setMobileOpen((v) => !v);
          }}
          aria-expanded={mobileOpen}
          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition-colors hover:bg-white/5 hover:text-purple-500"
        >
          {label}
          <motion.svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="shrink-0"
            animate={{ rotate: mobileOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              d="M1.5 3.5L5 7L8.5 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </a>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobile-accordion"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <ul className="ml-2 mt-1 space-y-0.5 border-l border-zinc-200 py-1 pl-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-white/5 hover:text-purple-500"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={href}
                    className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50"
                  >
                    Ver todas →
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  }

  // ── Versão desktop: hover abre painel via portal (inalterada) ──
  return (
    <li
      ref={triggerRef}
      className={`group flex flex-col items-center ${className}`}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={scheduleClose}
    >
      <a
        href={href}
        className="flex items-center gap-1 text-sm text-zinc-700 transition-colors hover:text-purple-500 cursor-pointer"
        aria-expanded={open}
      >
        {label}
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M1.5 3.5L5 7L8.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </a>
      <div
        className={`h-px bg-purple-500 transition-all duration-300 ease-in-out ${
          open ? "w-full" : "w-0"
        }`}
      />

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                style={{
                  position: "fixed",
                  top: coords.top,
                  left: coords.left,
                  width: PANEL_WIDTH,
                }}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="z-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 shadow-2xl backdrop-blur-md"
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
              >
                <div className="flex">
                  {/* Coluna esquerda — lista de links */}
                  <ul className="w-2/5 space-y-1 border-r border-zinc-100 p-3">
                    {items.map((item) => (
                      <li key={item.id} className="relative">
                        {activeId === item.id && (
                          <motion.div
                            layoutId="mega-menu-active"
                            className="absolute inset-0 rounded-xl bg-purple-50"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}
                        <a
                          href={item.href}
                          onMouseEnter={() => setActiveId(item.id)}
                          onFocus={() => setActiveId(item.id)}
                          className={`relative z-10 block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                            activeId === item.id
                              ? "font-medium text-purple-600"
                              : "text-zinc-600 hover:text-purple-500"
                          }`}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* Coluna direita — preview (imagem, título, descrição) */}
                  <div className="relative w-3/5 overflow-hidden p-4">
                    <AnimatePresence mode="wait">
                      {active && (
                        <motion.a
                          key={active.id}
                          href={active.href}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="block"
                        >
                          <div className="overflow-hidden rounded-xl">
                            <motion.img
                              src={active.image}
                              alt=""
                              className="h-36 w-full object-cover"
                              initial={{ scale: 1.06 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                            />
                          </div>
                          <h4 className="mt-3 text-lg font-semibold text-zinc-800">
                            {active.title}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            {active.description}
                          </p>
                        </motion.a>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </li>
  );
}
