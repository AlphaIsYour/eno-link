"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, Copy, Check } from "lucide-react";
import { useState, useRef } from "react";
import { copyToClipboard } from "@/lib/utils";

interface Props {
  url: string;
  slug: string;
  size?: number;
}

export default function QRCodeDisplay({ url, slug, size = 200 }: Props) {
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  function downloadSVG() {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${slug}-qr.svg`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  }

  function downloadPNG() {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = size * 2;
      canvas.height = size * 2;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${slug}-qr.png`;
      a.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }

  async function copyUrl() {
    try {
      const success = await copyToClipboard(url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Gracefully ignore clipboard failures
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={svgRef} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#1e293b"
        />
      </div>

      <div className="flex gap-2 w-full">
        <button
          onClick={downloadPNG}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          PNG
        </button>
        <button
          onClick={downloadSVG}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          SVG
        </button>
        <button
          onClick={copyUrl}
          aria-label="Copy short link to clipboard"
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
