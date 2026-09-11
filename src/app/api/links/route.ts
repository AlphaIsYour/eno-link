import { NextRequest, NextResponse } from "next/server";
import { CreateLinkInput } from "@/lib/types";
import { isValidUrl, isValidSlug } from "@/lib/utils";
import { isDatabaseConfigured, getAllLinks, createLink, getDashboardStats } from "@/lib/db";
import { getDemoStore } from "@/lib/store";

export async function GET() {
  try {
    if (isDatabaseConfigured()) {
      const [links, stats] = await Promise.all([
        getAllLinks(),
        getDashboardStats(),
      ]);
      return NextResponse.json({ success: true, data: { links, stats } });
    } else {
      const store = getDemoStore();
      return NextResponse.json({
        success: true,
        data: { links: store.getAll(), stats: store.getStats() },
      });
    }
  } catch (error) {
    console.error("GET /api/links error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLinkInput = await request.json();

    // Validate URL
    if (!body.originalUrl || !isValidUrl(body.originalUrl)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid URL provided. URL must use http:// or https:// with a valid host",
        },
        { status: 400 }
      );
    }

    // Validate slug if provided
    if (body.slug && !isValidSlug(body.slug)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid slug. Use 2-50 characters: letters, numbers, hyphens, underscores",
        },
        { status: 400 }
      );
    }

    let link;
    if (isDatabaseConfigured()) {
      try {
        link = await createLink(body);
      } catch (e: unknown) {
        const err = e as { code?: string };
        if (err.code === "P2002") {
          return NextResponse.json(
            { success: false, error: "This slug is already taken" },
            { status: 409 }
          );
        }
        throw e;
      }
    } else {
      const store = getDemoStore();
      try {
        link = store.create(body);
      } catch (e: unknown) {
        const err = e as Error;
        return NextResponse.json(
          { success: false, error: err.message || "Failed to create link" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ success: true, data: link }, { status: 201 });
  } catch (error) {
    console.error("POST /api/links error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create link" },
      { status: 500 }
    );
  }
}
