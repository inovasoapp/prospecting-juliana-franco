# 🚀 Boilerplate para Landing Pages de Alta Performance

Este é um kit inicial (boilerplate) ultra otimizado para a criação de Landing Pages de alta conversão, focado em performance máxima, design moderno e animações fluidas de nível internacional.

Desenvolvido utilizando as versões mais recentes do ecossistema front-end.

## 🛠️ Tecnologias Inclusas

- **Astro v7+** – Arquitetura de ilhas para carregamento instantâneo.
- **React 19** – Para componentes interativos complexos.
- **Tailwind CSS v4** – Estilização moderna via compilador Vite ultra-rápido.
- **Lenis Scroll** – Scroll suave nativo e performático.
- **GSAP & ScrollTrigger** – Animações complexas baseadas na rolagem da página.
- **Motion (Framer Motion v12)** – Animações de interface e micro-interações leves.

## 📦 Como Usar este Boilerplate

Você pode iniciar um novo projeto utilizando este repositório como base de duas maneiras:

### Opção 1: Usando a CLI do Astro (Recomendado)

Execute o comando abaixo substituindo `minha-nova-lp` pelo nome do seu projeto:

```sh
pnpm create astro@latest minha-nova-lp -- --template inovasoapp/boilerplate-lp
```

### Opção 2: Clone Direto

Se preferir, clone o repositório manualmente e instale as dependências:

```sh
git clone https://github.com
cd boilerplate-lp
pnpm install
```

## 🚀 Estrutura do Projeto

Dentro do seu projeto Astro, você encontrará as seguintes pastas e arquivos essenciais:

```text
/
├── public/              # Arquivos estáticos (imagens, favicons, etc.)
│   └── specialist.webp  # Imagem de exemplo usada na Hero Section
├── src/
│   ├── layouts/         # Layouts globais (onde o Lenis e GSAP são inicializados)
│   │   └── Layout.astro
│   ├── styles/          # Estilos globais do projeto
│   │   └── global.css   # Inicialização do Tailwind CSS v4 (@import "tailwindcss")
│   └── pages/           # Rotas do projeto
│       └── index.astro  # Página principal com exemplos práticos de animação
├── package.json
└── astro.config.mjs     # Configuração do Astro integrado com React e Tailwind v4
```

## 🧞 Commands

Todos os comandos devem ser executados a partir da raiz do projeto, utilizando o terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

---

Criado e mantido por [Inovasoapp](https://github.com). Sinta-se à vontade para clonar, abrir issues ou contribuir!
