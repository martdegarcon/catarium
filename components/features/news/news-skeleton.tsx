import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders a skeleton placeholder card representing a news item.
 *
 * @returns A JSX element containing styled skeleton blocks that mimic a news card layout: large image area, title and metadata lines, and action/meta rows.
 */
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

/**
 * Render a two-column skeleton layout showing a prominent news card alongside three compact placeholder items.
 *
 * @returns A JSX element containing the hot-news skeleton: one NewsCardSkeleton and a vertical stack of three small placeholder cards.
 */
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

/**
 * Render a responsive grid of six news card skeletons.
 *
 * @returns A grid container holding six `NewsCardSkeleton` items with gaps between them; layout uses two columns at `md` breakpoint and three columns at `lg`.
 */
export function ArchiveNewsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Render the skeleton placeholder for the News screen, including tab placeholders, a hot-news section, and an archive grid.
 *
 * @returns The News screen's JSX skeleton layout displayed while real content is loading.
 */
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
