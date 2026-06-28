import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      name: 'Youssef El Jihad',
      email: 'admin@blog.dev',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Web Development', slug: 'web-development', description: 'Articoli su HTML, CSS, JavaScript e sviluppo web moderno' } }),
    prisma.category.create({ data: { name: 'TypeScript', slug: 'typescript', description: 'Guide e tutorial su TypeScript' } }),
    prisma.category.create({ data: { name: 'React & Next.js', slug: 'react-nextjs', description: 'Framework React, Next.js e il loro ecosistema' } }),
    prisma.category.create({ data: { name: 'Backend', slug: 'backend', description: 'Node.js, Express, API, database e architettura server' } }),
    prisma.category.create({ data: { name: 'DevOps & Tools', slug: 'devops-tools', description: 'CI/CD, Docker, Git, strumenti di sviluppo' } }),
  ])
  console.log('✅ Categories created:', categories.length)

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'JavaScript', slug: 'javascript' } }),
    prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.create({ data: { name: 'React', slug: 'react' } }),
    prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs' } }),
    prisma.tag.create({ data: { name: 'CSS', slug: 'css' } }),
    prisma.tag.create({ data: { name: 'Node.js', slug: 'nodejs' } }),
    prisma.tag.create({ data: { name: 'Prisma', slug: 'prisma' } }),
    prisma.tag.create({ data: { name: 'PostgreSQL', slug: 'postgresql' } }),
    prisma.tag.create({ data: { name: 'Tutorial', slug: 'tutorial' } }),
    prisma.tag.create({ data: { name: 'Performance', slug: 'performance' } }),
  ])
  console.log('✅ Tags created:', tags.length)

  // Create posts
  const posts = [
    {
      title: 'Come ho costruito il mio Portfolio con Next.js 14',
      slug: 'come-ho-costruito-portfolio-nextjs-14',
      excerpt: 'Il processo di creazione del mio portfolio personale usando Next.js 14 App Router, TypeScript e Framer Motion.',
      content: `## Introduzione

Dopo mesi di studio, ho deciso di costruire il mio **portfolio personale** per raccogliere tutti i miei progetti in un unico posto. Ho scelto **Next.js 14** con App Router perché offre il miglior equilibrio tra performance, SEO e developer experience.

## Stack Tecnologico

- **Next.js 14** — App Router per routing file-based
- **TypeScript** — Type safety su tutto il codebase
- **Tailwind CSS** — Styling utility-first
- **Framer Motion** — Animazioni fluide e micro-interazioni

## Architettura

Ho strutturato il progetto in modo modulare:

\`\`\`
app/
├── [lang]/           # i18n (IT/EN)
│   ├── page.tsx      # Homepage
│   ├── layout.tsx    # Root layout
│   └── (routes)/
│       ├── progetti/
│       └── contatti/
components/
├── sections/         # Hero, About, Skills...
├── layout/           # Navbar, Footer
└── ui/               # Card, Button, AnimatedSection
\`\`\`

## Lezioni Apprese

1. **App Router vs Pages Router**: L'App Router è più potente ma richiede un cambio di mentalità
2. **Server vs Client Components**: Capire quando usare \`'use client'\` è fondamentale
3. **Internazionalizzazione**: Ho implementato i18n con dizionari statici e routing basato su \`[lang]\`

## Risultato

Il portfolio è live su Vercel con un design dark theme, animazioni smooth e supporto bilingue IT/EN. Ogni progetto ha la sua pagina dettaglio con rendering Markdown.

> Il codice è open source su [GitHub](https://github.com/Youssy-chan/Personal-Projects).`,
      categoryId: categories[2].id, // React & Next.js
      tagIds: [tags[2].id, tags[3].id, tags[1].id], // React, Next.js, TypeScript
      published: true,
      publishedAt: new Date('2026-06-21'),
      views: 127,
    },
    {
      title: 'Guida Completa a Prisma ORM con PostgreSQL',
      slug: 'guida-completa-prisma-orm-postgresql',
      excerpt: 'Tutto quello che devi sapere per usare Prisma come ORM nel tuo progetto Node.js/Next.js con PostgreSQL.',
      content: `## Cos'è Prisma?

**Prisma** è un ORM (Object-Relational Mapping) moderno per Node.js e TypeScript. A differenza di altri ORM, Prisma adotta un approccio schema-first: definisci il tuo modello dati in un file \`.prisma\` e Prisma genera automaticamente un client type-safe.

## Setup Iniziale

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

Questo crea:
- \`prisma/schema.prisma\` — il tuo schema
- \`.env\` — variabili d'ambiente con \`DATABASE_URL\`

## Definire lo Schema

\`\`\`prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  published Boolean  @default(false)
}
\`\`\`

## Operazioni CRUD

### Create
\`\`\`typescript
const user = await prisma.user.create({
  data: {
    email: 'mario@example.com',
    name: 'Mario Rossi',
  },
})
\`\`\`

### Read con relazioni
\`\`\`typescript
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
})
\`\`\`

## Prisma + Neon PostgreSQL

Neon offre PostgreSQL serverless gratuito, perfetto per progetti Next.js su Vercel:

1. Crea un progetto su [neon.tech](https://neon.tech)
2. Copia la connection string nel \`.env\`
3. Esegui \`npx prisma db push\` per sincronizzare lo schema

## Conclusioni

Prisma rende il lavoro con i database un piacere. Il type safety automatico elimina un'intera classe di bug e la developer experience è eccellente.`,
      categoryId: categories[3].id, // Backend
      tagIds: [tags[6].id, tags[7].id, tags[5].id, tags[8].id], // Prisma, PostgreSQL, Node.js, Tutorial
      published: true,
      publishedAt: new Date('2026-06-22'),
      views: 89,
    },
    {
      title: 'CSS Moderno: Grid, Flexbox e Custom Properties',
      slug: 'css-moderno-grid-flexbox-custom-properties',
      excerpt: 'Una guida pratica alle funzionalità CSS moderne che ogni sviluppatore web dovrebbe conoscere.',
      content: `## Il CSS è cambiato

Il CSS del 2026 non ha nulla a che vedere con quello di 10 anni fa. Con **Grid**, **Flexbox** e le **Custom Properties**, possiamo costruire layout complessi senza hack o framework CSS.

## CSS Grid

Grid è il sistema di layout bidimensionale nativo:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

Questo crea una griglia responsive automatica — niente media query necessarie!

## Flexbox

Flexbox è perfetto per layout monodimensionali:

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## Custom Properties (Variabili CSS)

Le variabili CSS rendono il codice DRY e facilitano il theming:

\`\`\`css
:root {
  --color-primary: #6366f1;
  --color-bg: #0f172a;
  --radius: 0.75rem;
  --font-display: 'Inter', sans-serif;
}

.card {
  background: var(--color-bg);
  border-radius: var(--radius);
  font-family: var(--font-display);
}

/* Dark mode con un singolo override */
[data-theme="light"] {
  --color-bg: #ffffff;
}
\`\`\`

## Conclusione

Non hai bisogno di un framework CSS per costruire layout belli e responsive. Grid + Flexbox + Custom Properties coprono il 95% dei casi d'uso.`,
      categoryId: categories[0].id, // Web Development
      tagIds: [tags[4].id, tags[0].id, tags[8].id], // CSS, JavaScript, Tutorial
      published: true,
      publishedAt: new Date('2026-06-18'),
      views: 203,
    },
    {
      title: 'TypeScript: Tipi Avanzati che Dovresti Conoscere',
      slug: 'typescript-tipi-avanzati',
      excerpt: 'Utility types, generics, conditional types e pattern avanzati per scrivere TypeScript migliore.',
      content: `## Oltre i Tipi Base

Se usi TypeScript, probabilmente conosci \`string\`, \`number\`, \`boolean\` e le interfacce base. Ma TypeScript offre molto di più.

## Utility Types

### Partial\<T\> e Required\<T\>
\`\`\`typescript
interface User {
  name: string
  email: string
  age: number
}

// Tutti i campi opzionali
type UpdateUser = Partial<User>

// Tutti i campi obbligatori
type StrictUser = Required<User>
\`\`\`

### Pick\<T, K\> e Omit\<T, K\>
\`\`\`typescript
type UserPreview = Pick<User, 'name' | 'email'>
type UserWithoutAge = Omit<User, 'age'>
\`\`\`

## Generics

I generics rendono il codice riutilizzabile e type-safe:

\`\`\`typescript
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json() as T
}

const user = await fetchData<User>('/api/user/1')
// user è tipizzato come User!
\`\`\`

## Discriminated Unions

Pattern potente per gestire diversi "stati":

\`\`\`typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' }

function handleResult(result: Result<User>) {
  switch (result.status) {
    case 'success':
      console.log(result.data.name) // TypeScript sa che data esiste
      break
    case 'error':
      console.error(result.error) // TypeScript sa che error esiste
      break
  }
}
\`\`\`

## Conclusione

I tipi avanzati di TypeScript non sono solo "nice to have" — eliminano bug, migliorano l'autocompletamento e rendono il refactoring sicuro.`,
      categoryId: categories[1].id, // TypeScript
      tagIds: [tags[1].id, tags[0].id, tags[8].id], // TypeScript, JavaScript, Tutorial
      published: true,
      publishedAt: new Date('2026-06-15'),
      views: 156,
    },
    {
      title: 'Deploy Automatico con GitHub Actions e Vercel',
      slug: 'deploy-automatico-github-actions-vercel',
      excerpt: 'Come configurare una pipeline CI/CD con GitHub Actions per il deploy automatico su Vercel.',
      content: `## Perché CI/CD?

Il deploy manuale è noioso e soggetto a errori. Con una pipeline CI/CD, ogni push su \`main\` esegue automaticamente:
1. **Lint** — controlla la qualità del codice
2. **Test** — esegue i test automatizzati
3. **Build** — compila il progetto
4. **Deploy** — pubblica su Vercel

## GitHub Actions

Crea \`.github/workflows/ci.yml\`:

\`\`\`yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
\`\`\`

## Vercel Integration

Vercel si integra nativamente con GitHub:

1. Connetti il repo su vercel.com
2. Configura il **Root Directory** (es. \`Progetti/progetto-03-blog\`)
3. Aggiungi le variabili d'ambiente (\`DATABASE_URL\`, \`NEXTAUTH_SECRET\`)
4. Ogni push su \`main\` triggera un deploy automatico

## Conclusione

Con 20 minuti di setup hai una pipeline CI/CD professionale. Ogni modifica viene testata e deployata automaticamente — come nei team di sviluppo reali.`,
      categoryId: categories[4].id, // DevOps & Tools
      tagIds: [tags[3].id, tags[8].id], // Next.js, Tutorial
      published: true,
      publishedAt: new Date('2026-06-25'),
      views: 67,
    },
    {
      title: 'Server Components vs Client Components in Next.js',
      slug: 'server-components-vs-client-components-nextjs',
      excerpt: 'Capire quando usare Server Components e quando Client Components in Next.js App Router.',
      content: `## Il Nuovo Paradigma

Con Next.js App Router, tutti i componenti sono **Server Components** di default. Questo è un cambio radicale rispetto al Pages Router.

## Server Components

Vantaggi:
- **Zero JavaScript al client** — rendering solo sul server
- **Accesso diretto al DB** — puoi usare Prisma direttamente
- **Migliore performance** — meno JS da scaricare

\`\`\`tsx
// Questo è un Server Component (default)
import { prisma } from '@/lib/prisma'

export default async function PostList() {
  const posts = await prisma.post.findMany({
    where: { published: true },
  })

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

## Client Components

Necessari quando usi:
- \`useState\`, \`useEffect\`, hooks
- Event handlers (\`onClick\`, \`onChange\`)
- Browser API (\`window\`, \`localStorage\`)

\`\`\`tsx
'use client'

import { useState } from 'react'

export function LikeButton() {
  const [likes, setLikes] = useState(0)
  return (
    <button onClick={() => setLikes(l => l + 1)}>
      ❤️ {likes}
    </button>
  )
}
\`\`\`

## La Regola d'Oro

> **Usa Server Components di default. Aggiungi \`'use client'\` solo quando necessario.**

Questo garantisce le migliori performance possibili.`,
      categoryId: categories[2].id, // React & Next.js
      tagIds: [tags[2].id, tags[3].id, tags[9].id], // React, Next.js, Performance
      published: true,
      publishedAt: new Date('2026-06-27'),
      views: 45,
    },
  ]

  for (const postData of posts) {
    const { tagIds, ...data } = postData
    await prisma.post.create({
      data: {
        ...data,
        authorId: admin.id,
        tags: { connect: tagIds.map(id => ({ id })) },
      },
    })
  }
  console.log('✅ Posts created:', posts.length)

  // Create some comments
  const allPosts = await prisma.post.findMany()
  const sampleComments = [
    { content: 'Ottimo articolo! Mi ha aiutato molto a capire il concetto.', authorName: 'Marco R.', authorEmail: 'marco@example.com', approved: true },
    { content: 'Spiegazione chiarissima, grazie per i code snippets!', authorName: 'Laura B.', authorEmail: 'laura@example.com', approved: true },
    { content: 'Potresti approfondire la parte sui generics?', authorName: 'Alessio T.', authorEmail: 'alessio@example.com', approved: true },
    { content: 'Ho seguito il tutorial e funziona tutto perfettamente 🎉', authorName: 'Sara M.', authorEmail: 'sara@example.com', approved: false },
  ]

  for (let i = 0; i < sampleComments.length; i++) {
    await prisma.comment.create({
      data: {
        ...sampleComments[i],
        postId: allPosts[i % allPosts.length].id,
      },
    })
  }
  console.log('✅ Comments created:', sampleComments.length)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
