"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateLinkInput } from "@/lib/types";
import { isValidUrl, isValidSlug } from "@/lib/utils";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.originalUrl) {
      setError("Please enter a URL");
      return;
    }

    let url = form.originalUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    if (form.slug && !isValidSlug(form.slug)) {
      setError("Slug must be 2-50 characters: letters, numbers, hyphens, underscores");
      return;
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => updateField("expiresAt", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
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
