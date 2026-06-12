"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";

export default function SlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [status, setStatus] = useState<"loading" | "password" | "error" | "expired">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [linkTitle, setLinkTitle] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveLink() {
      try {
        const res = await fetch(`/api/${slug}`);
        const data = await res.json();

        if (cancelled) return;

        if (data.success && data.data) {
          window.location.href = data.data.originalUrl;
        } else if (data.requiresPassword) {
          setStatus("password");
          setLinkTitle(data.data?.title || null);
        } else if (res.status === 410) {
          setStatus("expired");
          setError(data.error);
        } else {
          setStatus("error");
          setError(data.error || "Link not found");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setError("Failed to resolve link");
        }
      }
    }

    resolveLink();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/${slug}?password=${encodeURIComponent(password)}`);
      const data = await res.json();

      if (data.success && data.data) {
        window.location.href = data.data.originalUrl;
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Failed to verify password");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Resolving link...</h2>
            <p className="text-gray-500 mt-2">Please wait while we redirect you</p>
          </>
        )}

        {status === "password" && (
          <>
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {linkTitle || "Protected Link"}
            </h2>
            <p className="text-gray-500 mt-2 mb-6">This link requires a password to access</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Access Link
              </button>
            </form>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Link Not Found</h2>
            <p className="text-gray-500 mt-2 mb-6">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === "expired" && (
          <>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Link Expired</h2>
            <p className="text-gray-500 mt-2 mb-6">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
