# 🚀 Piano Portfolio — 10 Progetti Web per Recruiter
**Data:** 20/06/2026 | **Obiettivo:** Portfolio dimostrativo da sviluppatore junior → mercato

> Una roadmap pratica per coprire l'intero ecosistema dello sviluppo web:
> Front-end · Back-end · Database · WordPress · API · Real-time · Automazioni · DevOps

---

## 📋 Panoramica dei 10 Progetti

| # | Progetto | Ambito | Tecnologie chiave | Tempo |
|---|----------|--------|-------------------|-------|
| 01 | Landing Page Responsive | Front-end puro | HTML5, CSS3, JS, Grid/Flexbox | 5-7 gg |
| 02 | Portfolio Personale Dinamico | Front-end avanzato | React/Next.js, Framer Motion | 10-14 gg |
| 03 | Blog Full-Stack con Database | Full-stack + DB | Next.js, Prisma, PostgreSQL | 14-20 gg |
| 04 | Sito WordPress + E-commerce | CMS / WordPress | WP, WooCommerce, tema child | 10-15 gg |
| 05 | App Meteo con API Terze Parti | Consumo API | JS, REST, OpenWeather API | 5-7 gg |
| 06 | API REST Personalizzata | Back-end puro | Node.js, Express, JWT, Swagger | 12-16 gg |
| 07 | Dashboard Admin Full-Stack | Full-stack + auth | React, Express, DB, ruoli | 15-20 gg |
| 08 | Chat Real-time | Real-time | Socket.io, WebSocket, stanze | 10-14 gg |
| 09 | Bot & Automazione | Automazioni | Node/Python, cron, scraping | 8-12 gg |
| 10 | PWA Installabile + CI/CD | PWA / DevOps | Service Worker, GitHub Actions | 10-14 gg |

**Tempo totale stimato:** ~10-14 settimane (part-time, 15-20 ore/settimana)

---

## 📌 Progetto 01 — Landing Page Responsive

**Obiettivo:** Landing page monopagina moderna e completamente responsive per un prodotto fittizio (es. app produttività, corso online, marca caffè). Focus su front-end puro.

**Stack:** HTML5 semantico · CSS3 (Grid, Flexbox, variabili CSS) · JavaScript vanilla · Git · deploy su Netlify/Vercel

### Must-Have
- Layout responsive (mobile, tablet, desktop — min. 3 breakpoint)
- Sezioni: hero + CTA, feature grid, testimonianze, pricing, FAQ, footer
- Menu sticky con shadow allo scroll + hamburger mobile (JS vanilla)
- Animazioni on-scroll con IntersectionObserver (fade-in, slide-up)
- Form di contatto con validazione client-side
- Pulsante back-to-top dopo 400px scroll
- Lighthouse ≥ 90 in tutte e 4 le categorie

### Nice-to-Have
- Dark mode con toggle + persistenza localStorage
- Versione localizzata IT/EN
- Microinterazioni sui bottoni
- SEO: meta tag, Open Graph, structured data JSON-LD

### Step
1. Definisci prodotto fittizio, target, tono di voce; raccogli riferimenti visivi
2. Wireframe su Figma (mobile-first) di tutte le sezioni
3. HTML semantico + sistema design (colori, tipografia, spaziature in variabili CSS)
4. CSS mobile-first → media query per tablet e desktop
5. JS: hamburger, scroll animations, validazione form, back-to-top
6. Ottimizza (WebP, minify), audit Lighthouse, correggi warning
7. Deploy Netlify/Vercel con form funzionante (Netlify Forms o Formspree)
8. README con screenshot, GIF, link demo, feature list

### Consegne ✔
- Repo GitHub con commit history (Conventional Commits)
- Demo live pubblica
- README completo
- Lighthouse ≥ 90 in tutte le categorie

**Competenze:** HTML semantico, CSS moderno, JS vanilla, responsive design, accessibilità, performance, deploy statico

---

## 📌 Progetto 02 — Portfolio Personale Dinamico

**Obiettivo:** Sito portfolio personale con React/Next.js — contenitore di tutti gli altri 9 progetti.

**Stack:** React 18 o Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · react-icons · deploy su Vercel

### Must-Have
- Architettura a componenti riutilizzabili (Button, Card, Section, ProjectCard, Navbar, Footer)
- Sezioni: hero/intro, about, skills (con icone), progetti (con filtri), contatti
- Routing multi-pagina (Home, Progetti, Progetto singolo, Contatti)
- Card progetti: immagine, titolo, descrizione, tech badge, link GitHub + demo
- Pagina dettaglio progetto dinamica (`/progetti/[id]`) con Markdown rendering
- Animazioni di transizione tra pagine con Framer Motion
- Form contatto con validazione e invio email (EmailJS o API route serverless)
- Design responsive e accessibile

### Nice-to-Have
- Dark/light mode con preferenza di sistema
- Internazionalizzazione IT/EN (next-i18next)
- Blog integrato con MDX
- CV scaricabile PDF generato dinamicamente
- Integrazione GitHub API per repo e statistiche live

### Step
1. Raccogli contenuti: bio, foto, lista progetti, skills, contatti; definisci branding
2. Setup Next.js + TypeScript + Tailwind + Framer Motion
3. Componenti base e layout (Navbar, Footer, grid)
4. Sezioni home con animazioni
5. Sistema progetti: data file (JSON/MDX), card list, pagina dinamica
6. Form contatto con API route serverless o servizio esterno
7. Dark mode, animazioni pagina, SEO e Open Graph
8. Deploy Vercel + dominio personalizzato (opzionale)

### Consegne ✔
- Portfolio live su Vercel
- Repo con struttura professionale (components, pages, lib, data)
- Almeno 6 progetti popolati (anche WIP con badge)
- README con filosofia design, struttura tecnica, screenshot

**Competenze:** React/Next.js, TypeScript, component architecture, Tailwind, routing, animazioni, SEO, deploy

---

## 📌 Progetto 03 — Blog Full-Stack con Database

**Obiettivo:** Blog completo con back-end, database, autenticazione admin e pannello gestione articoli. Dimostra padronanza del flusso full-stack.

**Stack:** Next.js (App Router) · Prisma ORM · PostgreSQL (Neon/Supabase) · NextAuth.js · Tailwind · MDX

### Must-Have
- Schema DB: User, Post, Category, Tag, Comment (relazioni 1:N e N:M)
- Autenticazione admin con NextAuth (credenziali email+password, ruolo admin)
- Pannello admin protetto: CRUD completo su post
- Editor Markdown + anteprima live (react-markdown)
- Frontend pubblico: lista articoli paginata, pagina articolo singolo, filtri categoria/tag
- Sistema commenti (moderazione admin)
- SSG per le pagine articolo (performance e SEO)
- Slug URL SEO-friendly, meta tag dinamici, sitemap.xml

### Nice-to-Have
- Ricerca full-text negli articoli
- Bozze con programmazione data di pubblicazione
- Upload immagini (Cloudinary/S3)
- Newsletter con iscrizione email
- Contatore visualizzazioni per articolo

### Step
1. Schema database (diagramma ER) e modello dati
2. Setup Next.js + Prisma + PostgreSQL (Neon o Supabase gratuito)
3. Schema Prisma, migration, seed con dati di esempio
4. Autenticazione NextAuth (provider credenziali, ruolo admin)
5. API routes CRUD post (GET, POST, PUT, DELETE)
6. Pannello admin protetto
7. Frontend pubblico (home blog, lista paginata, articolo singolo SSG)
8. Commenti, categorie/tag, SEO (sitemap, RSS), deploy

### Consegne ✔
- App live con DB funzionante + pannello admin (credenziali demo nel README)
- Diagramma ER incluso nel repo
- Almeno 5 articoli di esempio pubblicati
- README con architettura, schema DB, credenziali demo, istruzioni setup

**Competenze:** Full-stack, ORM Prisma, DB relazionale, autenticazione, CRUD, SSG/SSR, SEO, architettura

---

## 📌 Progetto 04 — Sito WordPress + E-commerce (WooCommerce)

**Obiettivo:** Sito aziendale completo con e-commerce in WordPress. Dimostra padronanza del CMS più diffuso.

**Stack:** WordPress · WooCommerce · tema child custom · Advanced Custom Fields · Yoast SEO · hosting (Hostinger/SiteGround)

### Must-Have
- WordPress in locale (Local by Flywheel) e poi in produzione
- Tema child custom (CSS e template personalizzati)
- Pagine: Home, Chi siamo, Servizi, Blog, Contatti
- WooCommerce con ≥10 prodotti, categorie, attributi
- Carrello, checkout, spedizioni, pagamento (Stripe in sandbox)
- Custom post type e custom fields con ACF
- Form di contatto (Contact Form 7 o WPForms) con anti-spam
- SEO (Yoast/RankMath) e performance (caching, ottimizzazione immagini)

### Step
1. Architettura informativa e wireframe
2. WordPress in locale con Local by Flywheel; tema parent + child
3. Pagine istituzionali, template header/footer/home
4. WooCommerce: prodotti, categorie, spedizioni, pagamento
5. Custom post type + ACF
6. SEO, performance, sicurezza (Wordfence)
7. Migrazione in produzione (Duplicator o All-in-One WP Migration), dominio + SSL
8. README: temi/plugin usati, credenziali demo, workflow

### Consegne ✔
- Sito WP live con e-commerce (checkout test/sandbox)
- Repo Git con tema child + dump DB (senza dati sensibili)
- Account admin demo (ruolo editor) con credenziali nel README
- README con stack plugin, config chiave, link live

**Competenze:** WordPress, WooCommerce, theming PHP, ACF, plugin management, e-commerce, SEO, hosting

---

## 📌 Progetto 05 — App Meteo con API Terze Parti

**Obiettivo:** App meteo che consuma API REST pubblica (OpenWeatherMap). Dimostra integrazione servizi esterni, gestione stati, presentazione dati.

**Stack:** HTML/CSS/JS vanilla o React · Fetch API / Axios · OpenWeatherMap API · localStorage · deploy statico

### Must-Have
- Ricerca città per nome con autocomplete (geocoding API)
- Meteo corrente: temperatura, umidità, vento, condizione, icona
- Previsioni 5 giorni / 3 ore con grafico temperature
- Geolocalizzazione: "usa la mia posizione" (Geolocation API)
- Gestione stati: loading (skeleton), errore (retry), vuoto (placeholder)
- Cronologia ricerche in localStorage (ultime 5 città)
- Toggle °C/°F con persistenza
- Design responsive con animazioni meteo CSS (pioggia, sole, nuvole)

### Nice-to-Have
- Mappa interattiva con Leaflet
- Notifiche push per variazioni meteo importanti
- Tema dinamico in base alle condizioni
- Confronto meteo tra due città side-by-side

### Step
1. Registrazione OpenWeatherMap, API key, studio documentazione
2. Mockup UI: search bar, card meteo, lista previsioni, toggle unità
3. Logica fetch con gestione errori e stati di caricamento
4. Sistema ricerca con autocomplete
5. Geolocalizzazione, cronologia, toggle unità con localStorage
6. Grafico temperature (Chart.js o Canvas custom)
7. Animazioni meteo CSS e tema dinamico
8. Deploy, performance, README con API usate

### Consegne ✔
- App live con API key funzionante (variabili d'ambiente, NON committare la chiave)
- Repo con codice pulito, commenti, struttura organizzata
- README con API utilizzate, endpoint, gestione errori, screenshot, link demo
- Gestione casistica: città non trovata, errore rete, rate limit

**Competenze:** Consumo API REST, fetch/async-await, gestione stati UI, localStorage, Geolocation, security (API key), data visualization

---

## 📌 Progetto 06 — API REST Personalizzata con Documentazione

**Obiettivo:** API REST completa con Node.js/Express, JWT, validazione, test e Swagger UI. Gestisce una risorsa a scelta (es. libreria libri, task manager, catalogo ricette).

**Stack:** Node.js · Express · PostgreSQL (o SQLite per dev) · Prisma · JWT · Joi/Zod · Swagger/OpenAPI · Jest · Supertest

### Must-Have
- Endpoint REST completi (GET, POST, PUT, DELETE, PATCH) con routing pulito
- Auth: registrazione, login, JWT, middleware protezione rotte
- Autorizzazione basata su ruoli (admin/user)
- Validazione input con Joi o Zod e messaggi errore leggibili
- Gestione errori centralizzata con codici HTTP corretti
- Paginazione, filtro, ordinamento su endpoint lista (query params)
- Swagger UI interattiva su `/docs`
- Test automatizzati (unit + integration) con Jest + Supertest, copertura ≥70%

### Nice-to-Have
- Rate limiting (express-rate-limit)
- Logging strutturato (Winston o Pino)
- Upload file con multer
- Dockerizzazione con docker-compose
- CI con GitHub Actions

### Step
1. Progetta modello dati e endpoint (tabella: metodo, percorso, auth, descrizione)
2. Setup Node.js + Express + Prisma + DB; schema e migration
3. Autenticazione (bcrypt, JWT, middleware)
4. CRUD risorsa con validazione, paginazione, filtri
5. Gestione errori centralizzata + middleware logging
6. Documentazione OpenAPI + Swagger UI
7. Test Jest + Supertest per ogni endpoint
8. Dockerizzazione (opzionale), deploy Render/Railway/Fly.io

### Consegne ✔
- API live con base URL pubblico
- Repo con struttura professionale (routes, controllers, middleware, services, tests)
- Swagger UI pubblica con esempi per ogni endpoint
- README con setup locale, variabili ambiente, esempi curl, link demo, copertura test
- Collection Postman nel repo (.json esportabile)

**Competenze:** Back-end, REST API design, JWT, autorizzazione, validazione, testing, Swagger, Docker, CI

---

## 📌 Progetto 07 — Dashboard Admin Full-Stack

**Obiettivo:** Dashboard di amministrazione completa (admin panel) con autenticazione, ruoli, tabelle interattive, grafici, esportazione. Progetto "business-grade".

**Stack:** React + Vite · Recharts/Chart.js · TanStack Table · Express API (Progetto 6 riutilizzabile) · PostgreSQL · Tailwind · shadcn/ui

### Must-Have
- Login con JWT + protezione rotte client-side
- Ruoli: admin (tutto), manager (lettura+scrittura), viewer (solo lettura)
- Dashboard home con KPI card e grafici (line, bar, pie) da dati reali
- Tabella dati avanzata: ordinamento, filtro, paginazione, selezione multipla, azioni bulk
- CRUD completo su ≥2 entità (es. utenti, ordini) con form modali
- Esportazione CSV/Excel dei dati filtrati
- Sistema notifiche in-app (toast) per azioni CRUD
- Layout responsive: sidebar collassabile + topbar con profilo utente

### Nice-to-Have
- Tema dark/light con persistenza
- Filtri salvabili e "viste personalizzate"
- Attività recenti (audit log) con timeline
- Ricerca globale con shortcut (Cmd+K)
- Autenticazione 2FA opzionale

### Step
1. Modello dati e ruoli; wireframe Figma delle schermate
2. Setup front-end (React + Vite + Tailwind + shadcn/ui) collegato all'API Progetto 6
3. Autenticazione: login, refresh token, protezione rotte, sessione
4. Layout: sidebar, topbar, routing protetto con React Router
5. Dashboard home con KPI e grafici (Recharts)
6. Tabella dati avanzata (TanStack Table) con CRUD e form modali
7. Esportazione CSV, notifiche toast, filtri avanzati
8. Gestione ruoli e permessi nell'UI

### Consegne ✔
- Dashboard live con 3 account demo (admin/manager/viewer)
- Repo front-end e back-end separati (o monorepo)
- README con architettura, ruoli, screenshot, link demo
- Seed DB con dati di esempio realistici (≥50 record per entità)

**Competenze:** Full-stack avanzato, RBAC, dashboard design, data table complesse, data visualization, state management, sicurezza

---

## 📌 Progetto 08 — Chat Real-time (WebSocket)

**Obiettivo:** App chat in tempo reale con stanze multiple, presenza utenti, notifiche e storico messaggi.

**Stack:** Node.js · Socket.io · Express · PostgreSQL/MongoDB · React · Tailwind · JWT

### Must-Have
- Autenticazione utente (registrazione, login, JWT)
- Stanze di chat multiple con creazione/join/leave
- Messaggi real-time con Socket.io (emissione, ricezione, broadcast)
- Indicatore presenza: lista utenti online per stanza, "sta scrivendo..."
- Storico messaggi dal DB al join della stanza
- Notifiche sonore/visive per nuovi messaggi
- Supporto emoji e Markdown base
- UI responsive: sidebar stanze, area messaggi, input con Enter per inviare

### Nice-to-Have
- Messaggi privati 1-a-1 (DM)
- Upload e anteprima immagini
- Reazioni ai messaggi (emoji reactions)
- Ricerca nello storico messaggi
- Notifiche push browser (Web Push API)

### Step
1. Architettura: eventi Socket.io, schema DB (User, Room, Message), flusso auth
2. Setup Express + Socket.io + DB; autenticazione JWT
3. Eventi Socket.io: join_room, leave_room, send_message, receive_message, typing
4. Salva messaggi nel DB, carica storico al join
5. Front-end React: login, lista stanze, area chat, input
6. Collega Socket.io client, gestisci eventi, messaggi real-time
7. Presenza utenti, "sta scrivendo", notifiche
8. Deploy back-end Render/Railway, front-end Vercel, testa in multi-tab

### Consegne ✔
- Chat live con almeno 2 stanze predefinite ("Generale", "Tech")
- Repo con codice ben organizzato + README sull'architettura real-time
- Account demo per testare (almeno 2 utenti)
- GIF/video nel README che mostra la chat su due browser

**Competenze:** WebSocket, Socket.io, real-time, eventi bidirezionali, presenza, state synchronization

---

## 📌 Progetto 09 — Bot & Automazione (Telegram/Discord + Scraping + Cron)

**Obiettivo:** Sistema di automazione con bot (Telegram o Discord), web scraping e task pianificati (cron). Esempio: bot che ogni mattina invia un digest con notizie rilevanti estratte da siti selezionati.

**Stack:** Node.js (o Python) · node-cron / APScheduler · Puppeteer/Playwright (o BeautifulSoup) · Telegram Bot API / Discord.js · SQLite o JSON · deploy su Render/Railway

### Must-Have
- Bot Telegram o Discord con comandi interattivi (/notizie, /cerca, /stop)
- Web scraping di almeno 2 fonti con parsing HTML
- Task pianificati (cron) per scraping a orari definiti
- Sistema digest: aggregazione contenuti, formattazione, invio automatico
- Filtro deduplica (hash del titolo)
- Iscrizione/disiscrizione al digest (chat_id salvato)
- Gestione errori: notifica admin se scraping fallisce
- Logging attività con timestamp

### Nice-to-Have
- Riepilogo settimanale con statistiche
- Integrazione AI per riassunto automatico (LLM API)
- Dashboard web per configurare fonti e orari
- Supporto multi-lingua

### Step
1. Scegli caso d'uso (notizie tech, crypto, eventi locali)
2. Crea bot su Telegram (BotFather) o Discord, ottieni token
3. Implementa comandi base (start, help, subscribe, unsubscribe)
4. Sviluppa scraper delle fonti (CSS selector, paginazione, deduplica)
5. Configura task cron per scraping e invio
6. Salva iscritti in DB/JSON, implementa digest formattato
7. Logging, gestione errori, notifiche admin
8. Deploy su piattaforma long-running (Render, Railway, VPS)

### Consegne ✔
- Bot live e funzionante: link Telegram o invito Discord
- Repo con codice, `.env.example`, istruzioni setup
- Documentazione comandi con esempi di output
- Log di esempio (screenshot) degli ultimi 7 giorni

**Competenze:** Automazione, web scraping, bot, task scheduling, integrazione API terze parti, processi long-running, deploy backend persistente

---

## 📌 Progetto 10 — PWA Installabile + Pipeline CI/CD

**Obiettivo:** Trasformare un'app esistente (o crearne una nuova) in una PWA installabile, con notifiche push, funzionamento offline e pipeline CI/CD automatica. Progetto che chiude il cerchio.

**Stack:** React/Vite · Workbox (service worker) · Web Push API · Vite PWA plugin · Vitest · GitHub Actions · deploy su Vercel/Netlify

### Must-Have
- App con CRUD salvata in IndexedDB (todo, note, lista spesa)
- Service Worker con Workbox: cache app shell, strategie cache (stale-while-revalidate)
- `manifest.json` con icone, nome, tema, orientamento; app installabile da browser
- Funzionamento offline completo
- Notifiche push web (Web Push API) con VAPID, iscrizione utente
- Background Sync per azioni fatte offline
- Pipeline GitHub Actions: lint → test → build automatici
- Deploy automatico su Vercel/Netlify al merge su main

### Nice-to-Have
- Staging + produzione (strategia di release)
- Test E2E con Playwright nella pipeline
- Analisi bundle size automatica (bundlewatch)
- Generazione APK con PWABuilder

### Step
1. App base (todo/note) con React + Vite, stato Zustand o Context, IndexedDB
2. vite-plugin-pwa, manifest e service worker con Workbox
3. Strategie di cache (app shell, runtime caching per API)
4. Test offline (DevTools → Application → Service Workers)
5. Web Push: chiavi VAPID, iscrizione utente, notifica da API route
6. Background Sync per modifiche fatte offline
7. Pipeline GitHub Actions: lint → test → build → deploy
8. Deploy automatico Vercel/Netlify (token in GitHub Secrets)

### Consegne ✔
- PWA live installabile su desktop e mobile (Chrome e Safari)
- Pipeline GitHub Actions verde (badge nel README)
- README: come installare PWA, testare offline, iscriversi alle push, architettura CI/CD
- Screenshot flusso CI/CD e PWA installata su dispositivo

**Competenze:** PWA, service worker, offline-first, IndexedDB, Web Push, Background Sync, testing, CI/CD, GitHub Actions, deploy automation

---

## 🎯 Strategia di Presentazione ai Recruiter

### Per ogni repository GitHub
| Elemento | Dettaglio |
|----------|-----------|
| **README** | Titolo, badge (tech, license, status), screenshot/GIF, descrizione, feature, installazione, link demo |
| **Visual** | Screenshot HQ o GIF animata in cima al README (sopra il fold) |
| **Pitch** | Cosa fa il progetto e quale problema risolve — 2-3 righe |
| **Learning** | Sezione "What I learned" che mostra crescita |
| **Demo** | Link alla demo live sempre in evidenza |

### Sul Portfolio e CV
- Seleziona i **3 progetti migliori** e descrivili in dettaglio (problema, soluzione, tech, risultato)
- Usa il formato **CAR** (Challenge-Action-Result) sul CV
- Quantifica: "ridotto il tempo di caricamento del 40%", "copertura test 85%", "Lighthouse 95+"
- Link diretti a GitHub e demo live — i recruiter devono **cliccare**, non cercare

### Ordine consigliato di esecuzione
- Segui l'ordine **1 → 10** (progettato per crescere in complessità)
- Il **Progetto 2** (portfolio) va aggiornato dopo ogni nuovo progetto completato
- Il **Progetto 6** (API REST) può essere riutilizzato come back-end del **Progetto 7** (dashboard)

> **Buon lavoro.** La costanza conta più della perfezione. Meglio 10 progetti finiti al 90% che 3 perfetti al 100%. La completezza del portfolio dimostra disciplina — ciò che i recruiter cercano.

---

## 🤖 Analisi: Dove integrare strumenti MCP (es. Google Stitch)

### Cos'è Google Stitch
Google Stitch è un tool MCP (Model Context Protocol) di Google che permette di generare UI/componenti tramite AI direttamente in fase di sviluppo, accelerando la prototipazione di interfacce.

### Progetti più adatti all'integrazione MCP

| Progetto | Opportunità MCP/Stitch |
|----------|------------------------|
| **02 - Portfolio** | Generare componenti React (ProjectCard, Hero, Navbar) velocemente con Stitch |
| **05 - App Meteo** | UI dei card meteo e animazioni CSS generate con assistenza AI |
| **07 - Dashboard** | Il progetto più adatto: Stitch può generare dashboard layout, KPI cards, tabelle — enorme risparmio di tempo |
| **08 - Chat** | UI della chat (bubble messaggi, sidebar stanze) generabile con Stitch |
| **10 - PWA** | Componenti UI di base (todo list, notifiche) come punto di partenza |

### 🎯 Raccomandazione
**Inizia dal Progetto 01** (Landing Page) — è il più semplice e adatto per prendere confidenza con gli strumenti. Poi considera di usare Google Stitch sul **Progetto 02** (Portfolio) o direttamente sul **Progetto 07** (Dashboard) dove l'accelerazione UI è più impattante.
