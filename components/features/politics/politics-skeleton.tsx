import { Skeleton } from "@/components/ui/skeleton";

/**
 * Render a skeleton placeholder for a politician card.
 *
 * @returns The politician card skeleton markup used as a loading placeholder.
 */
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

/**
 * Render a compact table-row skeleton for a politician, with an avatar, name, and five placeholder fields.
 *
 * @returns A compact table-row skeleton element containing an avatar circle, a name line, and five field placeholders
 */
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

/**
 * Render a skeleton placeholder that mimics the visual layout of a party card.
 *
 * The skeleton includes a title area, subtitle, three body lines of varying widths,
 * and two horizontal action placeholders to match the final card structure.
 *
 * @returns A JSX element representing the party card skeleton
 */
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

/**
 * Renders the skeleton layout for the Home tab, including statistics, top politicians, and active parties sections.
 *
 * The returned element contains a four-card statistics grid, a "Top Politicians" section with three politician card skeletons, and an "Active Parties" section with three party card skeletons to mirror the final UI while data loads.
 *
 * @returns The JSX element representing the home tab skeleton UI.
 */
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

/**
 * Skeleton UI for the Politicians tab displayed while politician data is loading.
 *
 * Renders placeholder filter controls and a vertical list of compact politician-row skeletons.
 *
 * @returns A JSX element containing four filter skeletons and six compact politician card skeletons.
 */
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

/**
 * Render a skeleton layout for the Parties tab during loading.
 *
 * @returns A JSX element containing a search input skeleton and a responsive grid of six party card skeletons
 */
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

/**
 * Render skeleton placeholders for the Political Structure tab layout.
 *
 * @returns The JSX element for the political structure tab loading state, containing three statistic cards and two sections each with four placeholder cards.
 */
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
