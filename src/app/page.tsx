import DashboardClient from "@/components/DashboardClient";

export default function DashboardPage() {
  const isDemoMode = !process.env.DATABASE_URL;

  return <DashboardClient isDemoMode={isDemoMode} />;
}
