"use client";

import CreateLinkForm from "@/components/CreateLinkForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Link</h1>
        <p className="text-gray-500 mt-2">
          Shorten a URL, set a custom slug, and optionally add password protection or an expiration
          date.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <CreateLinkForm />
      </div>
    </div>
  );
}
