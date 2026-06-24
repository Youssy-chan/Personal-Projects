import { Locale } from './dictionary'

export type ProjectStatus = 'completato' | 'wip' | 'pianificato'
export type ProjectCategory = 'front-end' | 'full-stack' | 'backend' | 'devops' | 'cms'

export interface Project {
  id: string
  number: string
  title: string
  shortDesc: string
  description: string
  category: ProjectCategory
  status: ProjectStatus
  tech: string[]
  githubUrl?: string
  demoUrl?: string
  imageGradient: string
  highlights: string[]
}

const projectsData = [
  {
    id: 'landing-page-lumino',
    number: '01',
    category: 'front-end' as ProjectCategory,
    status: 'completato' as ProjectStatus,
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Grid/Flexbox'],
    demoUrl: 'https://lumino.netlify.app',
    imageGradient: 'from-violet-900/60 to-indigo-900/60',
    translations: {
      it: {
        title: 'Landing Page Responsive — Lumino',
        shortDesc: 'Landing page monopagina per una SaaS di produttività profonda, costruita con HTML/CSS/JS puro.',
        description: `## Overview\nLanding page completa per **Lumino**, un'app SaaS fittizia per la produttività profonda (Deep Work + Pomodoro).\n\n## Cosa ho costruito\n- Layout **responsive** con 3 breakpoint (375px, 768px, 1280px)\n- **Dark mode** con toggle e persistenza in \`localStorage\`\n- Animazioni **on-scroll** con \`IntersectionObserver\`\n- **Menu hamburger** JS vanilla, accessibile con \`aria-expanded\`\n- **Form di contatto** con validazione client-side e contatore caratteri\n- Pulsante back-to-top con visibilità condizionale\n- **Lighthouse ≥ 90** in tutte le 4 categorie\n\n## Sfide tecniche\nLa sfida principale è stata implementare un **design system completo con CSS custom properties** senza alcuna libreria o framework, mantenendo alta accessibilità e performance Lighthouse.\n\n## Stack\nHTML5 semantico · CSS3 Grid/Flexbox · JavaScript vanilla ES2022 · Netlify`,
        highlights: [
          'Dark mode con toggle e persistenza localStorage',
          'Lighthouse ≥ 90 in tutte le 4 categorie',
          'Zero dipendenze — JS vanilla puro',
        ],
      },
      en: {
        title: 'Responsive Landing Page — Lumino',
        shortDesc: 'Single-page landing page for a deep productivity SaaS, built with pure HTML/CSS/JS.',
        description: `## Overview\nComplete landing page for **Lumino**, a fictional SaaS app for deep productivity (Deep Work + Pomodoro).\n\n## What I built\n- **Responsive** layout with 3 breakpoints (375px, 768px, 1280px)\n- **Dark mode** with toggle and \`localStorage\` persistence\n- **On-scroll** animations using \`IntersectionObserver\`\n- Vanilla JS **Hamburger menu**, accessible with \`aria-expanded\`\n- **Contact form** with client-side validation and character counter\n- Back-to-top button with conditional visibility\n- **Lighthouse ≥ 90** across all 4 categories\n\n## Technical challenges\nThe main challenge was implementing a **complete design system with custom CSS properties** without any library or framework, while maintaining high accessibility and Lighthouse performance.\n\n## Stack\nSemantic HTML5 · CSS3 Grid/Flexbox · Vanilla JavaScript ES2022 · Netlify`,
        highlights: [
          'Dark mode with toggle and localStorage persistence',
          'Lighthouse ≥ 90 in all 4 categories',
          'Zero dependencies — pure vanilla JS',
        ],
      }
    }
  },
  {
    id: 'portfolio-personale',
    number: '02',
    category: 'front-end' as ProjectCategory,
    status: 'wip' as ProjectStatus,
    tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    imageGradient: 'from-indigo-900/60 to-purple-900/60',
    translations: {
      it: {
        title: 'Portfolio Personale Dinamico',
        shortDesc: 'Sito portfolio con Next.js 14, TypeScript e Framer Motion. Routing dinamico, dark mode e API route per il form contatti.',
        description: `## Overview\nQuesto sito che stai guardando! Costruito con **Next.js 14 App Router**, TypeScript e Tailwind CSS.\n\n## Funzionalità principali\n- **App Router** con routing multi-pagina: Home, Progetti, Dettaglio Progetto, Contatti\n- **Framer Motion** per animazioni di pagina e micro-interazioni\n- **Pagine dettaglio** dinamiche \`/progetti/[id]\` con Markdown rendering\n- **API Route serverless** per il form contatti con Resend\n- Dark/light mode con \`next-themes\`\n- SEO ottimizzato con metadata API di Next.js\n\n## Design System\nGenerato con **Google Stitch MCP** — design system "Lumina Tech Portfolio" con palette Indigo/Violet, Glassmorphism e font Geist + Inter.`,
        highlights: [
          'Generato con Google Stitch MCP per UI/UX',
          'API route serverless per invio email',
          'Routing dinamico /progetti/[id] con Markdown',
        ],
      },
      en: {
        title: 'Dynamic Personal Portfolio',
        shortDesc: 'Portfolio website with Next.js 14, TypeScript, and Framer Motion. Dynamic routing, dark mode, and API route for contact form.',
        description: `## Overview\nThe very website you are looking at! Built with **Next.js 14 App Router**, TypeScript, and Tailwind CSS.\n\n## Key Features\n- **App Router** with multi-page routing: Home, Projects, Project Detail, Contact\n- **Framer Motion** for page animations and micro-interactions\n- Dynamic **detail pages** \`/progetti/[id]\` with Markdown rendering\n- **Serverless API Route** for contact form using Resend\n- Dark/light mode using \`next-themes\`\n- SEO optimized with Next.js metadata API\n\n## Design System\nGenerated with **Google Stitch MCP** — "Lumina Tech Portfolio" design system featuring an Indigo/Violet palette, Glassmorphism, and Geist + Inter fonts.`,
        highlights: [
          'Generated with Google Stitch MCP for UI/UX',
          'Serverless API route for email delivery',
          'Dynamic routing /progetti/[id] with Markdown',
        ],
      }
    }
  },
  {
    id: 'blog-fullstack',
    number: '03',
    category: 'full-stack' as ProjectCategory,
    status: 'pianificato' as ProjectStatus,
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'NextAuth'],
    imageGradient: 'from-emerald-900/60 to-teal-900/60',
    translations: {
      it: {
        title: 'Blog Full-Stack con Database',
        shortDesc: 'Blog completo con pannello admin, autenticazione NextAuth, Prisma ORM e PostgreSQL.',
        description: `## Overview\nBlog full-stack con back-end, database e autenticazione admin.\n\n## Stack\nNext.js App Router · Prisma ORM · PostgreSQL (Neon) · NextAuth.js · Tailwind · MDX`,
        highlights: [
          'Schema DB: User, Post, Category, Tag, Comment',
          'Pannello admin con CRUD completo',
          'SSG per le pagine articolo (Lighthouse-ready)',
        ],
      },
      en: {
        title: 'Full-Stack Blog with Database',
        shortDesc: 'Complete blog with admin panel, NextAuth authentication, Prisma ORM, and PostgreSQL.',
        description: `## Overview\nFull-stack blog with back-end, database, and admin authentication.\n\n## Stack\nNext.js App Router · Prisma ORM · PostgreSQL (Neon) · NextAuth.js · Tailwind · MDX`,
        highlights: [
          'DB Schema: User, Post, Category, Tag, Comment',
          'Admin panel with full CRUD operations',
          'SSG for article pages (Lighthouse-ready)',
        ],
      }
    }
  },
  {
    id: 'wordpress-ecommerce',
    number: '04',
    category: 'cms' as ProjectCategory,
    status: 'pianificato' as ProjectStatus,
    tech: ['WordPress', 'WooCommerce', 'PHP', 'ACF'],
    imageGradient: 'from-blue-900/60 to-cyan-900/60',
    translations: {
      it: {
        title: 'Sito WordPress + E-commerce',
        shortDesc: 'Sito aziendale completo con WooCommerce, tema child custom, ACF e Stripe in sandbox.',
        description: `## Overview\nSito WordPress completo con e-commerce.\n\n## Stack\nWordPress · WooCommerce · tema child custom · ACF · Yoast SEO`,
        highlights: [
          'Tema child custom con template PHP',
          '≥10 prodotti, checkout Stripe sandbox',
          'SEO Yoast + cache + immagini WebP',
        ],
      },
      en: {
        title: 'WordPress + E-commerce Site',
        shortDesc: 'Complete business website with WooCommerce, custom child theme, ACF, and Stripe sandbox.',
        description: `## Overview\nComplete WordPress website with e-commerce functionality.\n\n## Stack\nWordPress · WooCommerce · custom child theme · ACF · Yoast SEO`,
        highlights: [
          'Custom child theme with PHP templates',
          '≥10 products, Stripe sandbox checkout',
          'Yoast SEO + caching + WebP images',
        ],
      }
    }
  },
  {
    id: 'app-meteo',
    number: '05',
    category: 'front-end' as ProjectCategory,
    status: 'pianificato' as ProjectStatus,
    tech: ['React', 'OpenWeatherMap API', 'Chart.js', 'CSS Animations'],
    imageGradient: 'from-sky-900/60 to-blue-900/60',
    translations: {
      it: {
        title: 'App Meteo con API Terze Parti',
        shortDesc: 'App meteo con OpenWeatherMap API, geolocalizzazione, previsioni 5 giorni e animazioni CSS.',
        description: `## Overview\nApp meteo che consuma l'API REST di OpenWeatherMap.\n\n## Stack\nReact · Fetch API · OpenWeatherMap · localStorage · Chart.js`,
        highlights: [
          'Geolocalizzazione + ricerca città con autocomplete',
          'Previsioni 5 giorni con grafico temperature',
          'Animazioni CSS dinamiche (pioggia, sole, nuvole)',
        ],
      },
      en: {
        title: 'Weather App with Third-Party API',
        shortDesc: 'Weather app using OpenWeatherMap API, geolocation, 5-day forecast, and CSS animations.',
        description: `## Overview\nWeather app consuming the OpenWeatherMap REST API.\n\n## Stack\nReact · Fetch API · OpenWeatherMap · localStorage · Chart.js`,
        highlights: [
          'Geolocation + city search with autocomplete',
          '5-day forecast with temperature charts',
          'Dynamic CSS animations (rain, sun, clouds)',
        ],
      }
    }
  },
  {
    id: 'api-rest',
    number: '06',
    category: 'backend' as ProjectCategory,
    status: 'pianificato' as ProjectStatus,
    tech: ['Node.js', 'Express', 'JWT', 'Swagger', 'Jest'],
    imageGradient: 'from-orange-900/60 to-red-900/60',
    translations: {
      it: {
        title: 'API REST Personalizzata',
        shortDesc: 'API REST con Node.js/Express, JWT, Swagger UI, test Jest/Supertest e copertura ≥70%.',
        description: `## Overview\nAPI REST completa per un catalogo di ricette, con autenticazione JWT e documentazione Swagger.\n\n## Stack\nNode.js · Express · Prisma · PostgreSQL · JWT · Zod · Swagger · Jest`,
        highlights: [
          'CRUD completo con paginazione e filtri',
          'Swagger UI su /docs con esempi live',
          'Test coverage ≥70% con Jest + Supertest',
        ],
      },
      en: {
        title: 'Custom REST API',
        shortDesc: 'REST API built with Node.js/Express, JWT, Swagger UI, Jest/Supertest testing with ≥70% coverage.',
        description: `## Overview\nComplete REST API for a recipe catalog, featuring JWT authentication and Swagger documentation.\n\n## Stack\nNode.js · Express · Prisma · PostgreSQL · JWT · Zod · Swagger · Jest`,
        highlights: [
          'Full CRUD with pagination and filtering',
          'Swagger UI on /docs with live examples',
          'Test coverage ≥70% using Jest + Supertest',
        ],
      }
    }
  },
  {
    id: 'dashboard-admin',
    number: '07',
    category: 'full-stack' as ProjectCategory,
    status: 'pianificato' as ProjectStatus,
    tech: ['React', 'Vite', 'shadcn/ui', 'Recharts', 'TanStack Table'],
    imageGradient: 'from-rose-900/60 to-pink-900/60',
    translations: {
      it: {
        title: 'Dashboard Admin Full-Stack',
        shortDesc: 'Admin panel con auth JWT, ruoli RBAC, TanStack Table, Recharts e esportazione CSV.',
        description: `## Overview\nDashboard di amministrazione business-grade.\n\n## Stack\nReact + Vite · shadcn/ui · TanStack Table · Recharts · Express API (Progetto 06)`,
        highlights: [
          '3 ruoli: admin, manager, viewer (RBAC)',
          'KPI cards + grafici da dati reali',
          'Esportazione CSV/Excel + ricerca globale Cmd+K',
        ],
      },
      en: {
        title: 'Full-Stack Admin Dashboard',
        shortDesc: 'Admin panel featuring JWT auth, RBAC roles, TanStack Table, Recharts, and CSV export.',
        description: `## Overview\nBusiness-grade administration dashboard.\n\n## Stack\nReact + Vite · shadcn/ui · TanStack Table · Recharts · Express API (Project 06)`,
        highlights: [
          '3 roles: admin, manager, viewer (RBAC)',
          'KPI cards + charts populated with real data',
          'CSV/Excel export + Cmd+K global search',
        ],
      }
    }
  },
  {
    id: 'chat-realtime',
    number: '08',
    category: 'full-stack' as ProjectCategory,
    status: 'pianificato' as ProjectStatus,
    tech: ['Socket.io', 'Node.js', 'React', 'PostgreSQL'],
    imageGradient: 'from-purple-900/60 to-violet-900/60',
    translations: {
      it: {
        title: 'Chat Real-time (WebSocket)',
        shortDesc: 'App chat con Socket.io, stanze multiple, presenza utenti e storico messaggi persistito su DB.',
        description: `## Overview\nApp di chat real-time con Socket.io.\n\n## Stack\nNode.js · Socket.io · Express · PostgreSQL · React · Tailwind · JWT`,
        highlights: [
          'Stanze multiple con join/leave in real-time',
          'Indicatore presenza + "sta scrivendo..."',
          'Storico messaggi persistito su PostgreSQL',
        ],
      },
      en: {
        title: 'Real-time Chat (WebSocket)',
        shortDesc: 'Chat app with Socket.io, multiple rooms, user presence, and message history persisted in DB.',
        description: `## Overview\nReal-time chat application using Socket.io.\n\n## Stack\nNode.js · Socket.io · Express · PostgreSQL · React · Tailwind · JWT`,
        highlights: [
          'Multiple rooms with real-time join/leave',
          'Presence indicators + "is typing..." feature',
          'Message history persisted in PostgreSQL',
        ],
      }
    }
  },
  {
    id: 'bot-automazione',
    number: '09',
    category: 'backend' as ProjectCategory,
    status: 'pianificato' as ProjectStatus,
    tech: ['Node.js', 'Telegram Bot API', 'Puppeteer', 'node-cron'],
    imageGradient: 'from-amber-900/60 to-yellow-900/60',
    translations: {
      it: {
        title: 'Bot & Automazione',
        shortDesc: 'Bot Telegram con web scraping, task cron e digest automatico delle notizie tech.',
        description: `## Overview\nSistema di automazione con bot Telegram, web scraping e task pianificati.\n\n## Stack\nNode.js · node-cron · Puppeteer · Telegram Bot API · SQLite`,
        highlights: [
          'Digest automatico ogni mattina alle 8:00',
          'Scraping da 2+ fonti con deduplica hash',
          'Comandi interattivi: /notizie, /cerca, /stop',
        ],
      },
      en: {
        title: 'Bot & Automation',
        shortDesc: 'Telegram bot with web scraping, cron tasks, and an automated tech news digest.',
        description: `## Overview\nAutomation system featuring a Telegram bot, web scraping, and scheduled tasks.\n\n## Stack\nNode.js · node-cron · Puppeteer · Telegram Bot API · SQLite`,
        highlights: [
          'Automated daily digest every morning at 8:00 AM',
          'Web scraping from 2+ sources with hash deduplication',
          'Interactive commands: /news, /search, /stop',
        ],
      }
    }
  },
  {
    id: 'pwa-cicd',
    number: '10',
    category: 'devops' as ProjectCategory,
    status: 'pianificato' as ProjectStatus,
    tech: ['React', 'Vite', 'Workbox', 'GitHub Actions', 'PWA'],
    imageGradient: 'from-teal-900/60 to-green-900/60',
    translations: {
      it: {
        title: 'PWA Installabile + CI/CD',
        shortDesc: 'Progressive Web App installabile con Service Worker, notifiche push e pipeline GitHub Actions.',
        description: `## Overview\nTodo app trasformata in PWA installabile con pipeline CI/CD automatica.\n\n## Stack\nReact/Vite · Workbox · Web Push API · Vitest · GitHub Actions · Netlify`,
        highlights: [
          'Funzionamento offline completo con IndexedDB',
          'Notifiche push con VAPID + Background Sync',
          'Pipeline GitHub Actions: lint → test → build → deploy',
        ],
      },
      en: {
        title: 'Installable PWA + CI/CD',
        shortDesc: 'Installable Progressive Web App with Service Workers, push notifications, and a GitHub Actions pipeline.',
        description: `## Overview\nTodo app transformed into an installable PWA with an automated CI/CD pipeline.\n\n## Stack\nReact/Vite · Workbox · Web Push API · Vitest · GitHub Actions · Netlify`,
        highlights: [
          'Full offline functionality via IndexedDB',
          'Push notifications using VAPID + Background Sync',
          'GitHub Actions pipeline: lint → test → build → deploy',
        ],
      }
    }
  }
]

export function getProjects(lang: Locale = 'it'): Project[] {
  return projectsData.map(p => ({
    id: p.id,
    number: p.number,
    category: p.category,
    status: p.status,
    tech: p.tech,
    ...('demoUrl' in p ? { demoUrl: p.demoUrl } : {}),
    ...('githubUrl' in p ? { githubUrl: p.githubUrl } : {}),
    imageGradient: p.imageGradient,
    ...p.translations[lang]
  }))
}

export function getProjectById(id: string, lang: Locale = 'it'): Project | undefined {
  const projects = getProjects(lang)
  return projects.find((p) => p.id === id)
}

export function getProjectsByCategory(category: ProjectCategory | 'tutti' | 'all', lang: Locale = 'it'): Project[] {
  const projects = getProjects(lang)
  if (category === 'tutti' || category === 'all') return projects
  return projects.filter((p) => p.category === category)
}
