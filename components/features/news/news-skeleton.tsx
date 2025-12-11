import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function HotNewsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <NewsCardSkeleton />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArchiveNewsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NewsScreenSkeleton() {
  return (
    <div className="space-y-8">
      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Hot news skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <HotNewsSkeleton />
      </div>

      {/* Archive news skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <ArchiveNewsListSkeleton />
      </div>
    </div>
  );
}

