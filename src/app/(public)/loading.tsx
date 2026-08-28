import { Skeleton } from "~/components/ui/skeleton";
export default function Loading() { return <div className="mx-auto max-w-5xl space-y-6 px-5 py-8"><Skeleton className="h-5 w-32" /><Skeleton className="h-12 w-2/3" /><Skeleton className="h-5 w-full max-w-xl" /></div>; }
