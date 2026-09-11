# Contributing to EnoLink

First off, thank you for considering contributing to EnoLink! 🎉 Open source projects thrive because of contributors like you. Whether you're fixing a typo in the documentation, reporting a bug, or building a brand new feature, your help is warmly welcomed.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat fellow contributors with respect, kindness, and empathy.

---

## Contributor Ladder

We welcome contributors of all experience levels and maintain a progressive ladder to help you grow with the project:

- 🟢 **Tier 1: First-Time Contributor (Beginner)**  
  Start here! Pick issues tagged with `good first issue` or `documentation`. Perfect for getting familiar with the repo, improving accessibility, adding unit tests, or fixing small edge cases.
- 🟡 **Tier 2: Code Contributor (Intermediate)**  
  Tackle enhancements tagged with `help wanted`, write API route tests, build UI components, or implement form validation improvements.
- 🟠 **Tier 3: Feature Contributor (Advanced)**  
  Help build core roadmap features like multi-user authentication, time-series analytics, CSV bulk export, or webhook notifications.
- 🟣 **Tier 4: Triager & Reviewer**  
  Active, long-term contributors who help triage issues, review pull requests, and shape the future architecture of EnoLink.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v20.9.0 or higher
- [npm](https://www.npmjs.com/) v10+ (or yarn / pnpm)
- [Git](https://git-scm.com/)

### 1. Fork & Clone

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/06-eno-link.git
cd 06-eno-link

# 2. Add upstream remote to stay up-to-date
git remote add upstream https://github.com/AlphaIsYour/youralpha-06-eno-link.git
```

### 2. Install Dependencies

```bash
npm install
```

> **Note:** EnoLink runs a `postinstall` script that automatically generates the Prisma Client.

### 3. Run in Demo Mode (Zero Configuration)

You **do not need a database** to start contributing! If `DATABASE_URL` is omitted, EnoLink automatically runs in **Demo Mode** using an in-memory store pre-populated with mock data.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. (Optional) Run with PostgreSQL

If you are working on database models or migrations:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your PostgreSQL connection string in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/enolink"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch from `master` with a descriptive name:

```bash
git checkout master
git pull upstream master
git checkout -b fix/sanitize-url-protocol
# or
git checkout -b feat/expiration-quick-presets
```

### 2. Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) to keep the commit history clean and readable:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes only
- `test:` Adding or updating tests
- `refactor:` Code changes that neither fix a bug nor add a feature
- `style:` Changes that do not affect code logic (formatting, missing semi-colons, etc.)
- `chore:` Maintenance tasks, dependency updates, tooling configuration

**Examples:**
```bash
git commit -m "fix(security): sanitize URL protocol to disallow javascript schemes"
git commit -m "feat(ui): add quick preset buttons for link expiration"
```

### 3. Verification Checklist

Before pushing your branch, please verify that your changes pass all checks:

```bash
# 1. Lint your code
npm run lint

# 2. Type check
npx tsc --noEmit

# 3. Test production build
npm run build
```

---

## Submitting a Pull Request (PR)

1. Push your branch to your fork:
   ```bash
   git push origin <your-branch-name>
   ```
2. Open a Pull Request against the `master` branch on the main repository.
3. Fill out the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
4. Link the relevant issue (e.g., `Closes #12`).
5. Maintainers will review your PR, provide constructive feedback, and merge once CI checks pass.

---

## Need Help?

- Have a question or idea? Open a GitHub Discussion or submit an issue with the `question` label.
- Stuck on a bug? Share details in your issue or draft PR — we are happy to guide you!
