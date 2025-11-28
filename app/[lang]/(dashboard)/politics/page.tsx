import { getDictionary } from "../../dictionaries";

export default async function PoliticsPage({
  params,
}: {
  params: Promise<{ lang: "ru" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{dict.pages.politics.title}</h1>
      <p className="text-muted-foreground">{dict.pages.politics.description}</p>
    </div>
  );
}