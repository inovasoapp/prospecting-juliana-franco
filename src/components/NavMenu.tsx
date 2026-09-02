import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import CTAButtonMorph from "./CTAButtonMorph";
import NavMegaMenuLink from "./NavMegaMenuLink.tsx";

const SOLUCOES_ITEMS = [
  {
    id: "gestao-financeira",
    label: "Gestão Financeira",
    href: "#solucoes/gestao-financeira",
    title: "Gestão Financeira Inteligente",
    description:
      "Controle total do seu fluxo de caixa com automações e relatórios em tempo real.",
    image: "https://picsum.photos/seed/gestao-financeira/480/280",
  },
  {
    id: "investimentos",
    label: "Investimentos Automatizados",
    href: "#solucoes/investimentos",
    title: "Invista no Piloto Automático",
    description:
      "Estratégias personalizadas que rebalanceiam sua carteira sem você precisar mexer em nada.",
    image: "https://picsum.photos/seed/investimentos/480/280",
  },
  {
    id: "consultoria",
    label: "Consultoria 1:1",
    href: "#solucoes/consultoria",
    title: "Consultoria Especializada",
    description:
      "Sessões individuais com especialistas pra montar seu plano de independência financeira.",
    image: "https://picsum.photos/seed/consultoria/480/280",
  },
];

// Links internos — ajuste os hrefs se os ids das suas <section> forem diferentes
const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Problemas", href: "#problemas" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Sobre", href: "#sobre" },
  { label: "FAQ", href: "#faq" },
];

// A partir de quantos pixels de scroll o nav "encolhe"
const SCROLL_THRESHOLD = 24;

export default function NavMenu() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 md:px-6"
      animate={{ paddingTop: scrolled ? 12 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
    >
      <motion.nav
        className="flex w-full items-center justify-between overflow-hidden backdrop-blur-md"
        animate={{
          maxWidth: scrolled ? 720 : 1400,
          borderRadius: scrolled ? 9999 : 0,
          paddingInline: scrolled ? 20 : 24,
          paddingBlock: scrolled ? 10 : 20,
          borderColor: scrolled
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0)",
          boxShadow: scrolled
            ? "0 8px 30px rgba(0,0,0,0.35)"
            : "0 0px 0px rgba(0,0,0,0)",
        }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        {/* Logo */}
        <a
          href="#home"
          className="shrink-0 text-base font-semibold tracking-tight text-zinc-800"
        >
          <img src="/logo.webp" alt="" className="w-24 lg:w-32" />
        </a>

        {/* Links — desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            if (link.label === "Soluções") {
              return (
                <NavMegaMenuLink
                  key={link.href}
                  href={link.href}
                  label="Soluções"
                  items={SOLUCOES_ITEMS}
                />
              );
            }
            return (
              <li key={link.href} className="group flex flex-col items-center">
                <a
                  href={link.href}
                  className="text-sm text-zinc-700 transition-colors hover:text-purple-500"
                >
                  {link.label}
                </a>
                <div className="w-0 h-px bg-purple-500 transition-all duration-300 ease-in-out group-hover:w-full" />
              </li>
            );
          })}
        </ul>

        {/* CTA — desktop */}
        {/* <motion.a
          href="#contato"
          className="hidden shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-90 md:block"
          animate={{
            backgroundColor: scrolled
              ? "oklch(62.7% 0.265 303.9)"
              : "rgba(0,0,0,0)",
            color: scrolled ? "oklch(100% 0 0)" : "oklch(22.2% 0.007 303.6)",
          }}
        >
          Começar
        </motion.a> */}

        <CTAButtonMorph
          size="sm"
          buttonBgColor={scrolled ? "oklch(62.7% 0.265 303.9)" : "transparent"}
          bgColor="#a855f7"
          title="Começar"
          titleColor={scrolled ? "oklch(100% 0 0)" : "oklch(22.2% 0.007 303.6)"}
          radius="full"
          className="hidden md:block"
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="max-w-lg w-full">
              <p className="text-sm text-white/90">
                Preencha seu e-mail abaixo e receba o material gratuito.
              </p>
              <input
                type="email"
                placeholder="seu@email.com"
                className="mt-3 w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/50 outline-none"
              />
              <button className="mt-3 w-full rounded-lg bg-white py-2 text-sm font-medium text-purple-700">
                Enviar
              </button>
            </div>
          </div>
        </CTAButtonMorph>

        {/* Botão hamburguer — mobile */}
        <button
          type="button"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.g
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                >
                  <line
                    x1="4"
                    y1="4"
                    x2="16"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="16"
                    y1="4"
                    x2="4"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </motion.g>
              ) : (
                <motion.g
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <line
                    x1="3"
                    y1="6"
                    x2="17"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="10"
                    x2="17"
                    y2="10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="14"
                    x2="17"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </button>
      </motion.nav>

      {/* Painel — mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-4 right-4 top-full mt-2 rounded-2xl border border-white/10 bg-zinc-50/75 p-4 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {LINKS.map((link) => {
                if (link.label === "Soluções") {
                  return (
                    <NavMegaMenuLink
                      key={link.href}
                      variant="mobile"
                      href={link.href}
                      label="Soluções"
                      items={SOLUCOES_ITEMS}
                    />
                  );
                }
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={handleLinkClick}
                      className="block rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition-colors hover:bg-white/5 hover:text-purple-500"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <CTAButtonMorph
              size="sm"
              buttonBgColor="#a855f7"
              bgColor="#a855f7"
              title="Começar"
              titleColor="#ffffff"
              radius="full"
              className="py-2.5 mt-2"
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="max-w-lg w-full">
                  <p className="text-sm text-white/90">
                    Preencha seu e-mail abaixo e receba o material gratuito.
                  </p>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="mt-3 w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/50 outline-none"
                  />
                  <button className="mt-3 w-full rounded-lg bg-white py-2 text-sm font-medium text-purple-700">
                    Enviar
                  </button>
                </div>
              </div>
            </CTAButtonMorph>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
