import { LinkData, CreateLinkInput, DashboardStats } from "./types";
import { generateSlug } from "./utils";

// In-memory store for demo mode (no database required)
class DemoStore {
  private links: Map<string, LinkData> = new Map();

  constructor() {
    // Seed with some demo data
    this.seedData();
  }

  private seedData() {
    const demoLinks: Omit<LinkData, "id" | "createdAt" | "updatedAt">[] = [
      {
        slug: "github",
        originalUrl: "https://github.com",
        title: "GitHub",
        password: null,
        expiresAt: null,
        clicks: 142,
        lastAccessed: new Date(Date.now() - 3600000).toISOString(),
        isActive: true,
      },
      {
        slug: "docs",
        originalUrl: "https://docs.google.com",
        title: "Google Docs",
        password: null,
        expiresAt: null,
        clicks: 89,
        lastAccessed: new Date(Date.now() - 7200000).toISOString(),
        isActive: true,
      },
      {
        slug: "figma",
        originalUrl: "https://figma.com",
        title: "Figma Design",
        password: null,
        expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
        clicks: 56,
        lastAccessed: new Date(Date.now() - 86400000).toISOString(),
        isActive: true,
      },
      {
        slug: "meeting",
        originalUrl: "https://zoom.us/j/123456789",
        title: "Team Meeting Room",
        password: "secret",
        expiresAt: null,
        clicks: 34,
        lastAccessed: new Date(Date.now() - 172800000).toISOString(),
        isActive: true,
      },
      {
        slug: "portfolio",
        originalUrl: "https://mysite.com/portfolio",
        title: "My Portfolio",
        password: null,
        expiresAt: null,
        clicks: 210,
        lastAccessed: new Date(Date.now() - 43200000).toISOString(),
        isActive: true,
      },
      {
        slug: "promo",
        originalUrl: "https://store.example.com/summer-sale",
        title: "Summer Sale Promo",
        password: null,
        expiresAt: new Date(Date.now() - 86400000).toISOString(),
        clicks: 78,
        lastAccessed: new Date(Date.now() - 172800000).toISOString(),
        isActive: true,
      },
    ];

    demoLinks.forEach((link) => {
      const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
      const now = new Date().toISOString();
      this.links.set(id, { ...link, id, createdAt: now, updatedAt: now });
    });
  }

  getAll(): LinkData[] {
    return Array.from(this.links.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getBySlug(slug: string): LinkData | null {
    for (const link of this.links.values()) {
      if (link.slug === slug) return link;
    }
    return null;
  }

  getById(id: string): LinkData | null {
    return this.links.get(id) || null;
  }

  create(input: CreateLinkInput): LinkData {
    const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    const slug = input.slug || generateSlug();
    const now = new Date().toISOString();

    // Check slug uniqueness
    if (this.getBySlug(slug)) {
      throw new Error("Slug already exists");
    }

    if (input.expiresAt) {
      const expiry = new Date(input.expiresAt);
      if (isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) {
        throw new Error("Expiration date must be in the future");
      }
    }

    const link: LinkData = {
      id,
      slug,
      originalUrl: input.originalUrl,
      title: input.title || null,
      password: input.password || null,
      expiresAt: input.expiresAt || null,
      clicks: 0,
      lastAccessed: null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.links.set(id, link);
    return link;
  }

  recordClick(slug: string): LinkData | null {
    const link = this.getBySlug(slug);
    if (!link) return null;

    link.clicks += 1;
    link.lastAccessed = new Date().toISOString();
    link.updatedAt = new Date().toISOString();
    this.links.set(link.id, link);
    return link;
  }

  delete(id: string): boolean {
    return this.links.delete(id);
  }

  toggleActive(id: string): LinkData | null {
    const link = this.links.get(id);
    if (!link) return null;

    link.isActive = !link.isActive;
    link.updatedAt = new Date().toISOString();
    this.links.set(id, link);
    return link;
  }

  getStats(): DashboardStats {
    const all = this.getAll();
    const totalLinks = all.length;
    const totalClicks = all.reduce((sum, l) => sum + l.clicks, 0);

    const topLinks = [...all].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    const recentLinks = all.slice(0, 5);

    return { totalLinks, totalClicks, topLinks, recentLinks };
  }
}

// Singleton for demo mode
let store: DemoStore | null = null;

export function getDemoStore(): DemoStore {
  if (!store) {
    store = new DemoStore();
  }
  return store;
}
