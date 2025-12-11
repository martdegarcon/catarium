import { Skeleton } from "@/components/ui/skeleton";

export function PoliticianCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export function PoliticianCardCompactSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            <tr className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </td>
              <td className="p-4"><Skeleton className="h-4 w-24" /></td>
              <td className="p-4"><Skeleton className="h-4 w-20" /></td>
              <td className="p-4"><Skeleton className="h-4 w-28" /></td>
              <td className="p-4"><Skeleton className="h-4 w-24" /></td>
              <td className="p-4"><Skeleton className="h-4 w-16" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PartyCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function HomeTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Statistics Bento Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>

      {/* Top Politicians Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <PoliticianCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Active Parties Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <PartyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PoliticiansTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Politicians Table */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PoliticianCardCompactSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PartiesTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search */}
      <Skeleton className="h-10 w-full max-w-sm" />

      {/* Parties Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PartyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PoliticalStructureTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      {/* Sections */}
      {[1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

