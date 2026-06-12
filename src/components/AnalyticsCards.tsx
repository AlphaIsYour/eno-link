"use client";

import { Link2, MousePointerClick, TrendingUp, Clock } from "lucide-react";
import { DashboardStats } from "@/lib/types";

interface Props {
  stats: DashboardStats;
}

export default function AnalyticsCards({ stats }: Props) {
  const cards = [
    {
      label: "Total Links",
      value: stats.totalLinks,
      icon: Link2,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Clicks",
      value: stats.totalClicks,
      icon: MousePointerClick,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Top Link Clicks",
      value: stats.topLinks[0]?.clicks || 0,
      icon: TrendingUp,
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      label: "Recent Activity",
      value: stats.recentLinks.length,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {card.value.toLocaleString()}
              </p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-xl`}>
              <card.icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
