import { getDictionary } from "../../dictionaries";

export default async function CatariumPage({
  params,
}: {
  params: Promise<{ lang: "ru" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{dict.pages.catarium.title}</h1>
      <p className="text-muted-foreground">{dict.pages.catarium.description}</p>
    </div>
  );
}

