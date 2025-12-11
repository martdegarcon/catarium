import { Skeleton } from "@/components/ui/skeleton";

export function NewsDetailSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Back Button */}
      <Skeleton className="h-10 w-40" />

      {/* Hero Image */}
      <Skeleton className="h-96 w-full rounded-lg" />

      {/* Category and Date */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

