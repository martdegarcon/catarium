import { Skeleton } from "@/components/ui/skeleton";

/**
 * Render a skeleton placeholder for the politician detail view.
 *
 * Renders skeleton elements that mirror the politician detail layout: a back button, header with avatar and title lines, a responsive personal info grid of six cards, an education section with two entries, and a political parties section with two entries.
 *
 * @returns A JSX element containing skeleton placeholders for the politician detail page layout
 */
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

/**
 * Renders a skeleton placeholder UI for a political party detail view.
 *
 * The layout includes a back-button skeleton, a header block with title and action skeletons,
 * a three-column info grid of card skeletons, and a party members section with a responsive
 * grid of member cards (each showing an avatar and two text-line skeletons).
 *
 * @returns A JSX element containing skeleton placeholders for the party detail screen
 */
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
