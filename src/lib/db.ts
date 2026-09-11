import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { LinkData, CreateLinkInput, DashboardStats } from "./types";
import { generateSlug } from "./utils";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toLinkData(link: any): LinkData {
  return {
    id: link.id as string,
    slug: link.slug as string,
    originalUrl: link.originalUrl as string,
    title: link.title as string | null,
    password: link.password as string | null,
    expiresAt: link.expiresAt?.toISOString() || null,
    clicks: link.clicks as number,
    lastAccessed: link.lastAccessed?.toISOString() || null,
    isActive: link.isActive as boolean,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getAllLinks(): Promise<LinkData[]> {
  const prisma = getPrisma();
  if (!prisma) return [];
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return links.map(toLinkData);
}

export async function getLinkBySlug(slug: string): Promise<LinkData | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  const link = await prisma.link.findUnique({ where: { slug } });
  return link ? toLinkData(link) : null;
}

export async function getLinkById(id: string): Promise<LinkData | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  const link = await prisma.link.findUnique({ where: { id } });
  return link ? toLinkData(link) : null;
}

export async function createLink(input: CreateLinkInput): Promise<LinkData> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database not configured");

  if (input.expiresAt) {
    const expiry = new Date(input.expiresAt);
    if (isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) {
      throw new Error("Expiration date must be in the future");
    }
  }

  const slug = input.slug || generateSlug();

  const link = await prisma.link.create({
    data: {
      slug,
      originalUrl: input.originalUrl,
      title: input.title || null,
      password: input.password || null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    },
  });

  return toLinkData(link);
}

export async function recordClick(slug: string): Promise<LinkData | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const link = await prisma.link.update({
    where: { slug },
    data: {
      clicks: { increment: 1 },
      lastAccessed: new Date(),
    },
  });

  return toLinkData(link);
}

export async function deleteLink(id: string): Promise<boolean> {
  const prisma = getPrisma();
  if (!prisma) return false;

  try {
    await prisma.link.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function toggleLinkActive(id: string): Promise<LinkData | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const existing = await prisma.link.findUnique({ where: { id } });
  if (!existing) return null;

  const link = await prisma.link.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  return toLinkData(link);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const prisma = getPrisma();
  if (!prisma) {
    return { totalLinks: 0, totalClicks: 0, topLinks: [], recentLinks: [] };
  }

  const [totalLinks, totalClicks, topLinks, recentLinks] = await Promise.all([
    prisma.link.count(),
    prisma.link.aggregate({ _sum: { clicks: true } }),
    prisma.link.findMany({
      orderBy: { clicks: "desc" },
      take: 5,
    }),
    prisma.link.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalLinks,
    totalClicks: totalClicks._sum.clicks || 0,
    topLinks: topLinks.map(toLinkData),
    recentLinks: recentLinks.map(toLinkData),
  };
}

export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}
