import { Skeleton } from "@/components/ui/skeleton";

export function PoliticianDetailSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Back Button */}
      <Skeleton className="h-10 w-40" />

      {/* Politician Header */}
      <div className="rounded-lg border bg-card p-8 space-y-6">
        <div className="flex items-start gap-6">
          <Skeleton className="h-32 w-32 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </div>

      {/* Personal Info Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <Skeleton className="h-7 w-32" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Political Parties Section */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PartyDetailSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Back Button */}
      <Skeleton className="h-10 w-40" />

      {/* Party Header */}
      <div className="rounded-lg border bg-card p-8 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-12 w-32" />
        </div>
      </div>

      {/* Party Info */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>

      {/* Party Members */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <Skeleton className="h-7 w-40" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

