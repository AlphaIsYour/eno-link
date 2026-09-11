# EnoLink

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=for-the-badge&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)

**A modern, production-ready URL shortener and link utility platform designed for speed, privacy, and simplicity.**

[Quick Start](#-quick-start) • [Architecture](#-architecture--dual-mode) • [Roadmap](#-roadmap) • [Contributing](#-contributing) • [Support](#-support)

</div>

---

## ⚡ Overview

**EnoLink** is an open-source link management engine and URL shortener built with Next.js 16 (App Router). It allows you to create fast short links with custom or auto-generated slugs, generate instant QR codes (with PNG/SVG export), set password protection, schedule automatic expiration, and inspect real-time click metrics through a sleek dashboard.

Best of all: **EnoLink runs out-of-the-box in Demo Mode without requiring any database setup.**

---

## ✨ Features

- 🔗 **Short URLs** — Instant short link generation with random slugs via `nanoid` or user-defined custom slugs.
- 🔒 **Password Protection** — Gate sensitive destination links behind secure passcodes.
- ⏳ **Expiration Schedules** — Automatically expire temporary links with HTTP `410 Gone` resolution.
- 📱 **QR Code Engine** — Auto-generated responsive QR codes with one-click PNG & SVG download.
- 📊 **Real-Time Click Tracking** — Track total hits and last accessed timestamps.
- 🎛️ **Modern Dashboard** — Search, filter (active/expired/protected), toggle link status, and copy links instantly.
- 🚀 **Zero-Config Demo Mode** — Develop and test locally with zero database setup using an in-memory fallback store.
- 🗄️ **Production-Ready PostgreSQL** — Seamless adapter-based Prisma ORM integration for persistent production workloads.

---

## 🏗️ Architecture & Dual-Mode

EnoLink is engineered to be developer-friendly by supporting two operation modes:

```
                  ┌────────────────────────┐
                  │  Client HTTP Requests  │
                  └───────────┬────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ Next.js 16 APIs  │
                     └────────┬─────────┘
                              │
               DATABASE_URL configured?
                             / \
                       YES  /   \  NO
                           /     \
                          ▼       ▼
       ┌────────────────────┐   ┌───────────────────────┐
       │   PostgreSQL DB    │   │ In-Memory Demo Store  │
       │ (Prisma 7 Adapter) │   │     (Zero-Config)     │
       └────────────────────┘   └───────────────────────┘
```

1. **Demo Mode (Default):** If `DATABASE_URL` is omitted, EnoLink automatically loads an in-memory store populated with mock data. Perfect for rapid UI development and testing.
2. **Database Mode (Persistent):** When `DATABASE_URL` is provided, EnoLink uses Prisma 7 with `@prisma/adapter-pg` to query your PostgreSQL database.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.9+
- npm, yarn, or pnpm

### 1. ⚡ Quick Start (Demo Mode — No Database Required)

```bash
# 1. Clone the repository
git clone https://github.com/AlphaIsYour/youralpha-06-eno-link.git
cd youralpha-06-eno-link

# 2. Install dependencies (Prisma client generates automatically)
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard with pre-seeded demo links!

---

### 2. 🗄️ With PostgreSQL (Production Mode)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your PostgreSQL connection:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/enolink"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. Run Prisma database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the app:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```
06-eno-link/
├── .github/
│   ├── workflows/ci.yml       # GitHub Actions automated lint & build
│   ├── ISSUE_TEMPLATE/        # Bug, feature, and docs issue templates
│   ├── PULL_REQUEST_TEMPLATE  # Contributor checklist
│   └── ISSUES.md              # Curated backlog of open issues
├── prisma/
│   └── schema.prisma          # PostgreSQL data model
├── src/
│   ├── app/
│   │   ├── api/               # REST API endpoints
│   │   ├── create/            # Create link page
│   │   ├── link/[id]/         # Link details & QR export page
│   │   ├── [slug]/            # Public short link resolver & redirector
│   │   └── page.tsx           # Dashboard page
│   ├── components/            # Reusable UI components
│   └── lib/                   # Database, in-memory store, and utils
├── CONTRIBUTING.md            # Contributor guide & developer workflow
├── CODE_OF_CONDUCT.md         # Community code of conduct
└── SECURITY.md                # Vulnerability disclosure policy
```

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts dev server with Turbopack at `localhost:3000` |
| `npm run build` | Builds production Next.js bundle |
| `npm start` | Starts production server |
| `npm run lint` | Runs ESLint analysis |
| `npx prisma studio` | Launches Prisma GUI to browse database records |
| `npx prisma migrate dev` | Runs migrations against local PostgreSQL |

---

## 🗺️ Roadmap

We maintain a transparent roadmap reflecting the real direction of EnoLink:

### ✅ Completed
- [x] Next.js 16 App Router foundation with React 19 and Tailwind CSS v4
- [x] Zero-config in-memory Demo Store with seed links
- [x] Custom slug & random slug generation via `nanoid`
- [x] Password protection and expiration date enforcement
- [x] QR code generator with PNG and SVG exports
- [x] Prisma 7 PostgreSQL adapter integration

### 🔄 In Progress / Help Wanted (Immediate)
- [ ] **[#1] Security:** Enforce HTTP/HTTPS URL protocol sanitization (`good first issue`)
- [ ] **[#2] Routing:** Block reserved system slugs (`create`, `api`, `_next`) (`good first issue`)
- [ ] **[#3] Accessibility:** Add mobile menu `aria-labels` and safe clipboard copy fallback (`good first issue`)
- [ ] **[#4] Testing:** Setup Vitest test runner with unit tests for utils and store
- [ ] **[#5] UI/UX:** Quick expiration presets (1h, 24h, 7d, 30d) and past date validation

### 📌 Planned
- [ ] **[#6] UTM Campaign Builder:** Interactive modal to append UTM marketing tags
- [ ] **[#7] Bulk Export:** Export links and stats to CSV and JSON formats
- [ ] **[#8] Visual Analytics:** Interactive 7-day and 30-day click trends chart

### 🔮 Future Ideas
- [ ] User authentication & multi-tenant team workspaces
- [ ] Custom domain support for branded short links
- [ ] Webhook alerts when click milestones are reached
- [ ] Link-in-bio personal page generator

*(For full issue specifications, visit [.github/ISSUES.md](.github/ISSUES.md) or the repository Issues tab!)*

---

## 🤝 Contributing

We love contributions! Whether you're fixing a typo, improving documentation, or adding a major feature, check out our [Contributing Guide](CONTRIBUTING.md).

Looking for an easy place to start? Browse issues labeled [`good first issue`](https://github.com/AlphaIsYour/youralpha-06-eno-link/labels/good%20first%20issue).

```
🟢 First-Time Contributor (Docs, a11y, unit tests)
   └── 🟡 Code Contributor (API routes, form validation, presets)
         └── 🟠 Feature Contributor (Analytics, UTM builder, export)
               └── 🟣 Core Reviewer (PR reviews & architecture)
```

---

## 👥 Contributors

A big thank you to everyone who helps make EnoLink better!

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
*Be the first to contribute! Check out [CONTRIBUTING.md](CONTRIBUTING.md) to get started.*
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## ☕ Support

If EnoLink helps you shorten, manage, or share links, consider supporting its continuous maintenance:

<a href="https://buymeacoffee.com/enoalph" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="42" width="150" />
</a>

*Your support helps fund ongoing maintenance, hosting, and open-source development.*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
