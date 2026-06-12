"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LinkData } from "@/lib/types";
import { getBaseUrl, formatDate, isExpired } from "@/lib/utils";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  MousePointerClick,
  Clock,
  Lock,
  Calendar,
  Globe,
  Hash,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function LinkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchLink() {
      try {
        const res = await fetch(`/api/links/${id}`);
        const data = await res.json();
        if (!cancelled) {
          if (data.success) {
            setLink(data.data);
          } else {
            setError(data.error || "Link not found");
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load link");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLink();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Link Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const shortUrl = `${getBaseUrl()}/${link.slug}`;
  const expired = isExpired(link.expiresAt);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {link.title || link.slug}
          </h1>
          {link.password && <Lock className="w-5 h-5 text-amber-500" />}
          {expired && (
            <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
              Expired
            </span>
          )}
          {!link.isActive && (
            <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
              Inactive
            </span>
          )}
        </div>
        <p className="text-gray-500">Created {formatDate(link.createdAt)}</p>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Short URL */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Short URL</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono text-blue-600 flex-1">{shortUrl}</span>
            <button
              onClick={() => copyToClipboard(shortUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Visit
            </a>
          </div>
        </div>

        {/* Original URL */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Destination</span>
          </div>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:text-blue-600 transition-colors break-all"
          >
            {link.originalUrl}
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
          <div className="p-5 text-center">
            <MousePointerClick className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{link.clicks}</p>
            <p className="text-xs text-gray-500">Total Clicks</p>
          </div>
          <div className="p-5 text-center">
            <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">
              {link.lastAccessed ? formatDate(link.lastAccessed) : "Never"}
            </p>
            <p className="text-xs text-gray-500">Last Accessed</p>
          </div>
          <div className="p-5 text-center">
            <Calendar className="w-5 h-5 text-violet-500 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">
              {link.expiresAt ? formatDate(link.expiresAt) : "Never"}
            </p>
            <p className="text-xs text-gray-500">Expires</p>
          </div>
          <div className="p-5 text-center">
            <Lock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">
              {link.password ? "Yes" : "No"}
            </p>
            <p className="text-xs text-gray-500">Protected</p>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h2>
        <div className="flex justify-center">
          <QRCodeDisplay url={shortUrl} slug={link.slug} size={250} />
        </div>
      </div>
    </div>
  );
}
