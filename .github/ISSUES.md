# EnoLink Curated Issue Backlog

This document contains **8 pre-scoped, high-value open-source issues** designed for global contributors across the Contributor Ladder.

Maintainers can copy-paste these into GitHub Issues or use the provided [GitHub CLI (`gh`)](#github-cli-one-liners) commands to publish them instantly.

---

## Issue #1: `fix(security): sanitize URL protocols to prevent XSS via javascript: and data: URIs`

- **Difficulty:** 🟢 Beginner (Good First Issue)
- **Labels:** `good first issue`, `bug`, `security`
- **Component:** [`src/lib/utils.ts`](file:///c:/laragon/www/projects/06-eno-link/src/lib/utils.ts), [`src/app/api/links/route.ts`](file:///c:/laragon/www/projects/06-eno-link/src/app/api/links/route.ts)

### Problem
`isValidUrl()` currently only runs `new URL(url)`. In JavaScript, `new URL("javascript:alert(1)")` and `new URL("data:text/html,...")` are syntactically valid URLs.

### Why It Matters
When a user accesses a short link redirecting to a `javascript:` scheme, the browser executes the script in the context of the domain, opening up an XSS and phishing vulnerability.

### Current Behavior
`isValidUrl("javascript:alert(1)")` evaluates to `true`, allowing malicious links to be created.

### Expected Behavior
Only URLs starting with `http:` or `https:` protocols should be deemed valid. Any other scheme (`javascript:`, `data:`, `file:`, `ftp:`) must be rejected with HTTP 400.

### Possible Approach
Update `isValidUrl` in `src/lib/utils.ts`:
```ts
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
```

### Acceptance Criteria
- [ ] `http://example.com` and `https://sub.domain.org/path?q=1` pass validation.
- [ ] `javascript:alert(document.cookie)` fails validation.
- [ ] `data:text/html;base64,...` fails validation.
- [ ] API endpoint `POST /api/links` rejects non-http(s) URLs with a clear message: `"URL must use http:// or https://"`.

---

## Issue #2: `fix(routing): reject reserved slugs to prevent collisions with Next.js internal routes`

- **Difficulty:** 🟢 Beginner (Good First Issue)
- **Labels:** `good first issue`, `bug`, `routing`
- **Component:** [`src/lib/utils.ts`](file:///c:/laragon/www/projects/06-eno-link/src/lib/utils.ts), [`src/components/CreateLinkForm.tsx`](file:///c:/laragon/www/projects/06-eno-link/src/components/CreateLinkForm.tsx)

### Problem
Users can register custom slugs that collide with system routes (e.g. `/create`, `/link`, `/api`, `/_next`, `/favicon.ico`, `/robots.txt`).

### Why It Matters
When someone visits `http://localhost:3000/create`, Next.js routes to the Link Creation form rather than redirecting the short link. This makes the created slug permanently broken for redirection and can cause route resolution conflicts.

### Current Behavior
Creating a link with custom slug `create` returns HTTP 201 Created.

### Expected Behavior
A centralized list of `RESERVED_SLUGS` is checked. Attempting to create a link with any reserved slug returns HTTP 400 with: `"The slug '{slug}' is reserved for system use"`.

### Suggested Reserved Slugs
```ts
export const RESERVED_SLUGS = new Set([
  "api",
  "create",
  "link",
  "dashboard",
  "admin",
  "login",
  "register",
  "auth",
  "settings",
  "public",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);
```

### Acceptance Criteria
- [ ] Form and API validate against `RESERVED_SLUGS`.
- [ ] Submitting a reserved slug displays an inline error message in `CreateLinkForm`.
- [ ] Unit test or validation test covers case-insensitive slug checking (e.g. `Create` or `API` are also blocked).

---

## Issue #3: `fix(a11y): improve screen reader navigation & add safe fallback for clipboard copy`

- **Difficulty:** 🟢 Beginner (Good First Issue)
- **Labels:** `good first issue`, `a11y`, `ux`
- **Component:** [`src/components/Header.tsx`](file:///c:/laragon/www/projects/06-eno-link/src/components/Header.tsx), [`src/components/LinkCard.tsx`](file:///c:/laragon/www/projects/06-eno-link/src/components/LinkCard.tsx)

### Problem
1. The mobile menu toggle button in `Header.tsx` lacks `aria-label` and `aria-expanded` attributes.
2. `navigator.clipboard.writeText()` throws an unhandled rejection if used on insecure origins (`http://` on local IP) or in browsers where permissions are denied.

### Why It Matters
Screen reader users cannot identify the mobile navigation toggle. In addition, developers or users accessing the dashboard over a LAN IP cannot copy links because the button fails silently.

### Expected Behavior
- Accessible icon buttons with explicit labels for assistive technology.
- A resilient copy utility (`copyToClipboard`) that falls back to `document.execCommand("copy")` or shows an alert/toast if clipboard write fails.

### Acceptance Criteria
- [ ] Mobile hamburger button has `aria-label="Toggle navigation menu"` and `aria-expanded={mobileMenuOpen}`.
- [ ] Copy button includes `aria-label="Copy short link to clipboard"`.
- [ ] Copy helper includes try/catch error handling so UI never hangs in an unhandled promise rejection.

---

## Issue #4: `test(core): setup Vitest test suite with unit tests for utility functions & DemoStore`

- **Difficulty:** 🟡 Intermediate
- **Labels:** `testing`, `developer-experience`
- **Component:** `package.json`, `vitest.config.ts`, `src/__tests__/`

### Problem
The project currently has 0 automated tests. Contributors cannot verify if their PR breaks slug generation, URL validation, expiration checks, or the in-memory store.

### Why It Matters
Automated tests give outside contributors the confidence to submit changes without fear of breaking existing functionality.

### Expected Behavior
- Running `npm test` runs all unit tests via Vitest in milliseconds.
- Test coverage for:
  - `isValidUrl()` (valid http/https vs invalid schemes)
  - `isValidSlug()` (allowed characters, length bounds, reserved slugs)
  - `isExpired()` (past vs future dates, null handling)
  - `truncateUrl()` (short vs long URLs)
  - `DemoStore` (create, getBySlug, recordClick, toggleActive, delete)

### Acceptance Criteria
- [ ] Vitest configured with TypeScript support.
- [ ] `npm test` script added to `package.json`.
- [ ] All unit tests pass cleanly.
- [ ] CI workflow executes `npm test`.

---

## Issue #5: `feat(ui): add quick expiration presets (1h, 24h, 7d, 30d) and prevent past dates`

- **Difficulty:** 🟡 Intermediate
- **Labels:** `enhancement`, `ui/ux`
- **Component:** [`src/components/CreateLinkForm.tsx`](file:///c:/laragon/www/projects/06-eno-link/src/components/CreateLinkForm.tsx), [`src/app/api/links/route.ts`](file:///c:/laragon/www/projects/06-eno-link/src/app/api/links/route.ts)

### Problem
Setting link expiration requires manually clicking through an HTML `<input type="datetime-local">`. Additionally, users can pick a date in the past, creating an immediately expired link.

### Expected Behavior
1. The date picker's `min` attribute is set to `new Date().toISOString().slice(0, 16)` to disable selecting past dates.
2. Provide one-click preset buttons:
   - `+1 Hour`
   - `+24 Hours`
   - `+7 Days`
   - `+30 Days`
   - `Clear`
3. Backend rejects timestamps where `new Date(expiresAt) <= new Date()`.

### Acceptance Criteria
- [ ] Clicking a preset button automatically calculates the timestamp and updates the form input.
- [ ] Cannot select or submit a timestamp in the past.
- [ ] Responsive design on both mobile and desktop screens.

---

## Issue #6: `feat(links): add UTM Campaign Builder modal with live URL preview`

- **Difficulty:** 🟡 Intermediate
- **Labels:** `enhancement`, `feature`
- **Component:** [`src/components/CreateLinkForm.tsx`](file:///c:/laragon/www/projects/06-eno-link/src/components/CreateLinkForm.tsx), new component `UTMBuilderModal.tsx`

### Problem
Marketers and creators frequently use URL shorteners to track marketing campaigns, but currently have to manually construct query parameters like `?utm_source=twitter&utm_medium=social&utm_campaign=launch`.

### Expected Behavior
Add a "UTM Builder" toggle/modal inside the Create Link form:
- Fields for:
  - `utm_source` (e.g. `newsletter`, `google`, `twitter`)
  - `utm_medium` (e.g. `cpc`, `email`, `social`)
  - `utm_campaign` (e.g. `summer_sale`, `product_launch`)
  - `utm_term` (optional keyword)
  - `utm_content` (optional ad variation)
- Live preview showing the resulting URL as the user types.
- An "Apply to URL" button that automatically appends the parameters to the Destination URL input.

### Acceptance Criteria
- [ ] Clean, accessible UI consistent with existing Tailwind styles.
- [ ] Correctly handles URLs that already contain query strings (`?` vs `&`).
- [ ] Encodes parameters safely using `URLSearchParams`.

---

## Issue #7: `feat(export): bulk export links & analytics to CSV and JSON`

- **Difficulty:** 🟡 Intermediate / 🔴 Advanced
- **Labels:** `enhancement`, `help wanted`
- **Component:** [`src/components/DashboardClient.tsx`](file:///c:/laragon/www/projects/06-eno-link/src/components/DashboardClient.tsx), [`src/app/api/links/export/route.ts`](file:///c:/laragon/www/projects/06-eno-link/src/app/api)

### Problem
Users cannot back up their links, analyze data offline, or migrate links out of EnoLink.

### Expected Behavior
Add an **"Export"** dropdown button on the Dashboard next to "Create Link":
- Options: **Export as CSV** and **Export as JSON**.
- Export contains: `id`, `slug`, `shortUrl`, `originalUrl`, `title`, `clicks`, `isActive`, `isExpired`, `createdAt`, `lastAccessed`.
- Passwords must **NEVER** be exported.
- Proper CSV sanitization to prevent CSV Formula Injection (`=`, `+`, `-`, `@`).

### Acceptance Criteria
- [ ] Clicking export triggers browser download of `.csv` or `.json` file.
- [ ] Works in both Demo Mode and Database Mode.
- [ ] Excludes sensitive password hashes or plain passwords.

---

## Issue #8: `feat(analytics): add interactive click history chart (Last 7 / 30 Days)`

- **Difficulty:** 🔴 Advanced
- **Labels:** `enhancement`, `visualization`, `help wanted`
- **Component:** `src/app/link/[id]/page.tsx`, `prisma/schema.prisma`

### Problem
The link detail page only displays a static counter of total clicks (`link.clicks`) and `lastAccessed`. There is no visual representation of click volume trends over time.

### Expected Behavior
1. Extend analytics tracking (e.g. lightweight click event model or hourly/daily aggregation).
2. Display a responsive SVG/Canvas chart (e.g. using clean SVG path or a lightweight chart library) on `src/app/link/[id]/page.tsx`.
3. Filter options: "Last 7 Days" vs "Last 30 Days".

### Acceptance Criteria
- [ ] Displays daily click trend for the selected link.
- [ ] Gracefully falls back to mock trend data in Demo Mode.
- [ ] Mobile responsive and accessible.

---

## GitHub CLI One-Liners

Maintainers can publish all 8 issues directly to GitHub using the GitHub CLI (`gh`):

```bash
# Issue 1
gh issue create --title "fix(security): sanitize URL protocols to prevent XSS via javascript: and data: URIs" --label "good first issue,bug,security" --body "See .github/ISSUES.md #1"

# Issue 2
gh issue create --title "fix(routing): reject reserved slugs to prevent collisions with Next.js internal routes" --label "good first issue,bug,routing" --body "See .github/ISSUES.md #2"

# Issue 3
gh issue create --title "fix(a11y): improve screen reader navigation & add safe fallback for clipboard copy" --label "good first issue,a11y,ux" --body "See .github/ISSUES.md #3"

# Issue 4
gh issue create --title "test(core): setup Vitest test suite with unit tests for utility functions & DemoStore" --label "testing,developer-experience" --body "See .github/ISSUES.md #4"

# Issue 5
gh issue create --title "feat(ui): add quick expiration presets (1h, 24h, 7d, 30d) and prevent past dates" --label "enhancement,ui/ux" --body "See .github/ISSUES.md #5"

# Issue 6
gh issue create --title "feat(links): add UTM Campaign Builder modal with live URL preview" --label "enhancement,feature" --body "See .github/ISSUES.md #6"

# Issue 7
gh issue create --title "feat(export): bulk export links & analytics to CSV and JSON" --label "enhancement,help wanted" --body "See .github/ISSUES.md #7"

# Issue 8
gh issue create --title "feat(analytics): add interactive click history chart (Last 7 / 30 Days)" --label "enhancement,visualization,help wanted" --body "See .github/ISSUES.md #8"
```
