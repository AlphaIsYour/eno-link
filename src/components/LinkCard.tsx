"use client";

import { LinkData } from "@/lib/types";
import { getBaseUrl, formatRelativeTime, isExpired, truncateUrl, cn, copyToClipboard as copyHelper } from "@/lib/utils";
import {
  Copy,
  ExternalLink,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Clock,
  MousePointerClick,
  QrCode,
  Check,
} from "lucide-react";
import { useState } from "react";
import QRCodeDisplay from "./QRCodeDisplay";

interface Props {
  link: LinkData;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function LinkCard({ link, onDelete, onToggle }: Props) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const shortUrl = `${getBaseUrl()}/${link.slug}`;
  const expired = isExpired(link.expiresAt);

  async function copyToClipboard() {
    try {
      const success = await copyHelper(shortUrl);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Gracefully ignore clipboard failures
    }
  }

  function handleDelete() {
    if (confirmDelete) {
      onDelete(link.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border transition-all",
        !link.isActive || expired
          ? "border-gray-200 opacity-60"
          : "border-gray-200 hover:shadow-md"
      )}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {link.title && (
                <h3 className="font-semibold text-gray-900 truncate">{link.title}</h3>
              )}
              {link.password && (
                <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
              {expired && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  Expired
                </span>
              )}
              {!link.isActive && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{truncateUrl(link.originalUrl, 60)}</p>
          </div>
        </div>

        {/* Short URL */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-3">
          <span className="text-sm font-mono text-blue-600 truncate flex-1">{shortUrl}</span>
          <button
            onClick={copyToClipboard}
            aria-label="Copy short link to clipboard"
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MousePointerClick className="w-4 h-4" />
            <span>{link.clicks} clicks</span>
          </div>
          {link.lastAccessed && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatRelativeTime(link.lastAccessed)}</span>
            </div>
          )}
          {link.expiresAt && !expired && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Expires {formatRelativeTime(link.expiresAt)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowQR(!showQR)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              showQR
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <QrCode className="w-4 h-4" />
            QR
          </button>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Visit
          </a>
          <button
            onClick={() => onToggle(link.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
          >
            {link.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {link.isActive ? "Disable" : "Enable"}
          </button>
          <button
            onClick={handleDelete}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ml-auto",
              confirmDelete
                ? "bg-red-600 text-white"
                : "text-red-600 hover:bg-red-50"
            )}
          >
            <Trash2 className="w-4 h-4" />
            {confirmDelete ? "Confirm" : "Delete"}
          </button>
        </div>
      </div>

      {/* QR Code Panel */}
      {showQR && (
        <div className="border-t border-gray-200 p-5 bg-gray-50">
          <QRCodeDisplay url={shortUrl} slug={link.slug} />
        </div>
      )}
    </div>
  );
}
