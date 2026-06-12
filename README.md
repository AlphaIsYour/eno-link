# EnoLink

A powerful, production-ready URL shortener and link utility platform built with modern web technologies.

## Overview

EnoLink lets you create short links with custom slugs, track clicks, generate QR codes, set expiration dates, and password-protect your links — all from a clean, trustworthy dashboard.

## Features

- **Short Links** — Generate short URLs with random or custom slugs
- **Custom Slugs** — Choose your own memorable link slugs
- **Random Slugs** — Auto-generated short slugs using nanoid
- **Expiration Dates** — Set links to expire automatically
- **Password Protection** — Require a password to access sensitive links
- **Click Tracking** — Count clicks and see last accessed time
- **QR Codes** — Auto-generated QR codes for every link (PNG & SVG export)
- **Dashboard** — Overview of all links with search and filters
- **Analytics Cards** — Total links, total clicks, top links, recent activity
- **Demo Mode** — Works without a database using in-memory storage
- **Responsive UI** — Clean design that works on all devices

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma 7 (adapter-based) |
| Database | PostgreSQL (via `@prisma/adapter-pg`) |
| QR Codes | qrcode.react |
| Short IDs | nanoid |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20.9+
- npm or yarn
- PostgreSQL (optional — demo mode works without it)

### Quick Start (Demo Mode)

```bash
# Clone the repository
git clone <your-repo-url>
cd enolink

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app runs in demo mode with in-memory storage.

### With PostgreSQL

1. **Create a `.env` file:**

```bash
cp .env.example .env
```

2. **Set your database URL:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/enolink"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Run database migrations:**

```bash
npx prisma migrate dev --name init
```

4. **Start the development server:**

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (with Turbopack) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Generate Prisma client |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── links/          # CRUD API for links
│   │   │   └── [id]/       # Individual link operations
│   │   └── [slug]/         # Resolve & redirect short links
│   ├── create/             # Create new link page
│   ├── link/[id]/          # Link detail page
│   ├── [slug]/             # Short link redirect page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard (server component)
├── components/
│   ├── AnalyticsCards.tsx   # Dashboard stats cards
│   ├── CreateLinkForm.tsx   # Link creation form
│   ├── DashboardClient.tsx  # Dashboard client component
│   ├── Footer.tsx           # Site footer
│   ├── Header.tsx           # Site header
│   ├── LinkCard.tsx         # Link list item card
│   └── QRCodeDisplay.tsx    # QR code with export
├── lib/
│   ├── db.ts               # Prisma database operations (adapter-based)
│   ├── store.ts            # In-memory demo store
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
prisma/
└── schema.prisma           # Database schema
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/links` | List all links with stats |
| `POST` | `/api/links` | Create a new short link |
| `GET` | `/api/links/:id` | Get link details |
| `PATCH` | `/api/links/:id` | Toggle link active status |
| `DELETE` | `/api/links/:id` | Delete a link |
| `GET` | `/api/:slug` | Resolve a short link |

### Create Link Request

```json
{
  "originalUrl": "https://example.com/long-url",
  "slug": "my-custom-slug",
  "title": "My Link",
  "password": "optional-password",
  "expiresAt": "2025-12-31T23:59:59.000Z"
}
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` — Your PostgreSQL connection string
   - `NEXT_PUBLIC_APP_URL` — Your deployed URL
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js. Ensure:
- Node.js 20.9+ is available
- `DATABASE_URL` is set for persistent storage
- Run `npx prisma migrate deploy` before starting

## Database Schema

```prisma
model Link {
  id           String    @id @default(cuid())
  slug         String    @unique
  originalUrl  String
  title        String?
  password     String?
  expiresAt    DateTime?
  clicks       Int       @default(0)
  lastAccessed DateTime?
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

## Roadmap

- [ ] User authentication (multi-user support)
- [ ] Link analytics with charts (clicks over time, referrers, geography)
- [ ] Bulk link import/export (CSV)
- [ ] API rate limiting
- [ ] Custom domains support
- [ ] Link bundles/collections
- [ ] Webhook notifications for click thresholds
- [ ] A/B testing for destination URLs
- [ ] Link-in-bio page generator

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.
