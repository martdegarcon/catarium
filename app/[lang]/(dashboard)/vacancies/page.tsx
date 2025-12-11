import { getDictionary } from "../../dictionaries";

export default async function VacanciesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const vacancies = dict.pages.vacancies.items;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{dict.pages.vacancies.title}</h1>
      <div className="space-y-4">
        {vacancies.map((vacancy) => (
          <div
            key={vacancy.id}
            className="rounded-lg border-l-4 border-primary bg-card p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="mb-2 text-xl font-semibold">{vacancy.title}</h2>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>
                  {vacancy.company} • {vacancy.location}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
                {vacancy.salary}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
