import { Skeleton } from "@/components/ui/skeleton";

export function CompanyCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-md" />
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

export function VacancyCardSkeleton() {
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
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export function HomeTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3">
        {/* Большая новость */}
        <div className="col-span-1 md:col-span-2 row-span-2 rounded-2xl border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Маленькие новости */}
        {[1, 2].map((i) => (
          <div key={i} className="col-span-1 md:col-span-2 lg:col-span-1 row-span-1 rounded-2xl border bg-card p-4 space-y-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}

        {/* Статистика компаний */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-2xl border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>

        {/* Вакансии */}
        {[1, 2].map((i) => (
          <div key={i} className="col-span-1 row-span-1 rounded-2xl border bg-card p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      {/* Секции */}
      {[1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              section === 1 ? <CompanyCardSkeleton key={i} /> : <VacancyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompaniesTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function VacanciesTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Vacancies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <VacancyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

