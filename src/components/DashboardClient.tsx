"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { LinkData, DashboardStats } from "@/lib/types";
import AnalyticsCards from "@/components/AnalyticsCards";
import LinkCard from "@/components/LinkCard";
import { Plus, Search, Link2, Loader2, Database } from "lucide-react";

interface Props {
  isDemoMode: boolean;
}

export default function DashboardClient({ isDemoMode }: Props) {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "protected">("all");

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      if (data.success) {
        setLinks(data.data.links);
        setStats(data.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch links:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadData]);

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
        loadData();
      }
    } catch (err) {
      console.error("Failed to delete link:", err);
    }
  }

  async function handleToggle(id: string) {
    try {
      const res = await fetch(`/api/links/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) => prev.map((l) => (l.id === id ? data.data : l)));
      }
    } catch (err) {
      console.error("Failed to toggle link:", err);
    }
  }

  function isLinkExpired(link: LinkData) {
    return link.expiresAt ? new Date(link.expiresAt) < new Date() : false;
  }

  const filteredLinks = links.filter((link) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        link.slug.toLowerCase().includes(q) ||
        link.originalUrl.toLowerCase().includes(q) ||
        (link.title && link.title.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    switch (filter) {
      case "active":
        return link.isActive && !isLinkExpired(link);
      case "expired":
        return isLinkExpired(link);
      case "protected":
        return !!link.password;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Database className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-900">Demo Mode Active</p>
            <p className="text-sm text-amber-700 mt-1">
              Running with in-memory storage. Data will reset on page reload. Set{" "}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">
                DATABASE_URL
              </code>{" "}
              in your environment to enable persistent storage with PostgreSQL.
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and track your shortened links</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-5 h-5" />
          Create Link
        </Link>
      </div>

      {/* Analytics */}
      {stats && <AnalyticsCards stats={stats} />}

      {/* Search & Filters */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by slug, URL, or title..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "expired", "protected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Links List */}
      <div className="mt-6 space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {search || filter !== "all" ? "No matching links" : "No links yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {search || filter !== "all"
                ? "Try adjusting your search or filter"
                : "Create your first shortened link to get started"}
            </p>
            {!search && filter === "all" && (
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Your First Link
              </Link>
            )}
          </div>
        ) : (
          filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))
        )}
      </div>

      {/* Quick Stats Footer */}
      {links.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-400">
          Showing {filteredLinks.length} of {links.length} links
        </div>
      )}
    </div>
  );
}
