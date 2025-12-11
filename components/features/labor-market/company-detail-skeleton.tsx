import { Skeleton } from "@/components/ui/skeleton";

export function CompanyDetailSkeleton() {
  return (
    <div className="w-full space-y-8">
      {/* Back Button */}
      <Skeleton className="h-10 w-40" />

      {/* Company Header */}
      <div className="rounded-lg border bg-card p-8 space-y-6">
        <div className="flex items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </div>

      {/* Company Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>

      {/* Company Overview */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* Vacancies */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-32" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

