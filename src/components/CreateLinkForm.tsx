"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateLinkInput } from "@/lib/types";
import { isValidUrl, isValidSlug, isReservedSlug, toLocalDateTimeString } from "@/lib/utils";
import {
  Link2,
  Globe,
  Hash,
  Lock,
  Clock,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";

const EXPIRATION_PRESETS = [
  { label: "+1 Hour", ms: 60 * 60 * 1000 },
  { label: "+24 Hours", ms: 24 * 60 * 60 * 1000 },
  { label: "+7 Days", ms: 7 * 24 * 60 * 60 * 1000 },
  { label: "+30 Days", ms: 30 * 24 * 60 * 60 * 1000 },
];

export default function CreateLinkForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [form, setForm] = useState<CreateLinkInput>({
    originalUrl: "",
    slug: "",
    title: "",
    password: "",
    expiresAt: "",
  });

  function updateField(key: keyof CreateLinkInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function applyPreset(durationMs: number | null) {
    if (durationMs === null) {
      updateField("expiresAt", "");
      return;
    }
    const targetDate = new Date(Date.now() + durationMs);
    updateField("expiresAt", toLocalDateTimeString(targetDate));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.originalUrl) {
      setError("Please enter a URL");
      return;
    }

    let url = form.originalUrl.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
      url = "https://" + url;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid HTTP or HTTPS URL (e.g. https://example.com)");
      return;
    }

    if (form.slug && !isValidSlug(form.slug)) {
      setError("Slug must be 2-50 characters: letters, numbers, hyphens, underscores");
      return;
    }

    if (form.slug && isReservedSlug(form.slug)) {
      setError(`The slug '${form.slug}' is reserved for system use`);
      return;
    }

    if (form.expiresAt) {
      const expiry = new Date(form.expiresAt);
      if (isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) {
        setError("Expiration date must be in the future");
        return;
      }
    }

    setLoading(true);
    try {
      const payload: CreateLinkInput = {
        originalUrl: url,
        ...(form.slug && { slug: form.slug }),
        ...(form.title && { title: form.title }),
        ...(form.password && { password: form.password }),
        ...(form.expiresAt && { expiresAt: new Date(form.expiresAt).toISOString() }),
      };

      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to create link");
        return;
      }

      router.push("/");
    } catch {
      setError("Failed to create link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination URL <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={form.originalUrl}
            onChange={(e) => updateField("originalUrl", e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            autoFocus
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link Title <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="My awesome link"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Custom Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Slug <span className="text-gray-400 font-normal">(optional, or auto-generated)</span>
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="my-custom-slug"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
          />
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
        />
        Advanced options
      </button>

      {showAdvanced && (
        <div className="space-y-6 pt-2">
          {/* Password Protection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Protection <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Enter a password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Visitors will need to enter this password to access the link
            </p>
          </div>

          {/* Expiration Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Expiration Date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              {form.expiresAt && (
                <button
                  type="button"
                  onClick={() => applyPreset(null)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="datetime-local"
                value={form.expiresAt}
                min={toLocalDateTimeString()}
                onChange={(e) => updateField("expiresAt", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-xs text-gray-500 mr-1">Presets:</span>
              {EXPIRATION_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset.ms)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => applyPreset(null)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              The link will stop working after this date
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : (
          "Shorten Link"
        )}
      </button>
    </form>
  );
}
