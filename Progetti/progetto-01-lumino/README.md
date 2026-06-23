# Lumino — Landing Page

![Lumino landing page](assets/images/og-image.png)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Status](https://img.shields.io/badge/status-completo-brightgreen?style=flat)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

> **Progetto 01/10** del portfolio sviluppatore web — Front-end puro

**Lumino** è una landing page monopagina per un'app SaaS fittizia dedicata alla produttività profonda (Deep Work + Pomodoro evoluto). Il progetto dimostra padronanza di HTML semantico, CSS moderno e JavaScript vanilla, con focus su performance, accessibilità e responsive design.

🔗 **[Demo live](#)** · 🐛 **[Segnala un problema](#)**

---

## ✨ Feature

- **Design dark/light** con toggle e persistenza in `localStorage`
- **Fully responsive** — mobile 375px, tablet 768px, desktop 1280px+
- **Navbar sticky** con shadow allo scroll e menu hamburger JS vanilla
- **Animazioni on-scroll** tramite `IntersectionObserver` (fade-in, slide-up, stagger)
- **FAQ accordion** accessibile con `aria-expanded` e transizioni CSS Grid
- **Form di contatto** con validazione client-side e contatore caratteri
- **Back-to-top** animato con visibilità condizionale
- **Ripple effect** sui bottoni
- **SEO on-point** — meta tag, Open Graph, JSON-LD structured data
- **Lighthouse ≥ 90** in tutte le 4 categorie

---

## 🛠️ Stack Tecnologico

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| HTML5 | — | Struttura semantica |
| CSS3 | — | Grid, Flexbox, variabili CSS, animazioni |
| JavaScript | ES2022 | Vanilla, nessuna libreria |
| Google Fonts | — | Syne + Inter |
| Netlify | — | Deploy + Forms |

---

## 📁 Struttura del Progetto

```
progetto-01-lumino/
├── index.html              # Struttura HTML semantica
├── css/
│   ├── style.css           # Design system, layout, componenti
│   └── animations.css      # Keyframes e classi animate
├── js/
│   ├── main.js             # Navbar, hamburger, dark mode, ripple, FAQ
│   ├── scroll.js           # IntersectionObserver
│   └── form.js             # Validazione form
├── assets/
│   ├── images/             # Immagini ottimizzate (WebP)
│   └── icons/              # SVG icone
└── README.md
```

---

## 🚀 Run in locale

Non richiede nessun build tool. Basta aprire il file `index.html` in un browser moderno:

```bash
# Clona il repo
git clone https://github.com/[tuo-username]/progetto-01-lumino.git
cd progetto-01-lumino

# Apri con Live Server (VS Code) o:
npx serve .
# → http://localhost:3000
```

---

## 📊 Sezioni

| # | Sezione | Descrizione |
|---|---------|-------------|
| 1 | **Hero** | Headline + CTA + mockup app animato |
| 2 | **Features** | Grid 6 funzionalità con hover card |
| 3 | **How it Works** | Step 1-2-3 con connettori |
| 4 | **Testimonials** | 3 recensioni con avatar |
| 5 | **Pricing** | Free / Pro (featured) / Team |
| 6 | **FAQ** | Accordion con 6 domande |
| 7 | **Contact** | Form con validazione client-side |

---

## ♿ Accessibilità

- HTML semantico (header, main, footer, section, article, nav, blockquote)
- `aria-label`, `aria-expanded`, `aria-controls`, `aria-live` su tutti gli elementi interattivi
- Focus visibile e navigazione da tastiera completa
- Contrasto colori AA (WCAG 2.1)
- `prefers-reduced-motion` rispettato

---

## 🎨 Design System

Tutte le variabili CSS sono definite nel `:root` di `style.css`:

```css
--clr-accent:  #6c63ff;   /* Viola elettrico */
--clr-accent-2: #00e5ff;  /* Ciano */
--ff-heading:  'Syne', sans-serif;
--ff-body:     'Inter', sans-serif;
```

---

## 📚 What I Learned

- Implementare un **design system completo con CSS custom properties** (dark/light theme switch incluso)
- Usare **IntersectionObserver** per animazioni on-scroll performanti e accessibili
- Costruire un **form di validazione** client-side robusto senza librerie
- Applicare **CSS Grid** e **Flexbox** per layout complessi e responsive
- Gestire **accessibilità** in tutti i componenti interattivi (FAQ accordion, hamburger menu, form)
- Ottimizzare per **Lighthouse ≥ 90** in tutte le categorie

---

## 📄 Licenza

MIT © 2026
