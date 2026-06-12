import { NextRequest, NextResponse } from "next/server";
import { isDatabaseConfigured, deleteLink, toggleLinkActive, getLinkById } from "@/lib/db";
import { getDemoStore } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    let link;
    if (isDatabaseConfigured()) {
      link = await getLinkById(id);
    } else {
      link = getDemoStore().getById(id);
    }

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: link });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch link" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    let success;
    if (isDatabaseConfigured()) {
      success = await deleteLink(id);
    } else {
      success = getDemoStore().delete(id);
    }

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete link" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    let link;
    if (isDatabaseConfigured()) {
      link = await toggleLinkActive(id);
    } else {
      link = getDemoStore().toggleActive(id);
    }

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: link });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update link" },
      { status: 500 }
    );
  }
}
