"use client";

import { Link2, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Link2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span>EnoLink</span>
            <span className="text-gray-300">|</span>
            <span>Fast & reliable link shortening</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>using Next.js & Prisma</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
