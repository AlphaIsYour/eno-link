import { NextRequest, NextResponse } from "next/server";
import { isDatabaseConfigured, getLinkBySlug, recordClick } from "@/lib/db";
import { getDemoStore } from "@/lib/store";
import { isExpired } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    let link;
    if (isDatabaseConfigured()) {
      link = await getLinkBySlug(slug);
      if (link) {
        await recordClick(slug);
      }
    } else {
      const store = getDemoStore();
      link = store.getBySlug(slug);
      if (link) {
        store.recordClick(slug);
      }
    }

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    if (!link.isActive) {
      return NextResponse.json(
        { success: false, error: "This link has been deactivated" },
        { status: 410 }
      );
    }

    if (isExpired(link.expiresAt)) {
      return NextResponse.json(
        { success: false, error: "This link has expired" },
        { status: 410 }
      );
    }

    // If password protected, don't redirect - let client handle it
    if (link.password) {
      const password = request.nextUrl.searchParams.get("password");
      if (password !== link.password) {
        return NextResponse.json(
          {
            success: false,
            error: "Password required",
            requiresPassword: true,
            data: { slug: link.slug, title: link.title },
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error("GET /api/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resolve link" },
      { status: 500 }
    );
  }
}
