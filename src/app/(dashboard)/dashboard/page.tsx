import { Skeleton } from "~/components/ui/skeleton";
import { DashboardOverviewChart } from "~/components/dashboard-overview-chart";
export default function DashboardPage() { return <section className="space-y-6"><p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">Рабочее пространство</p><h1 className="text-4xl font-black">Dashboard</h1><div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div><DashboardOverviewChart /></section>; }
