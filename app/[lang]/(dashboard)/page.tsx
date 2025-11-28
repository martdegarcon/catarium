import { getDictionary } from "../dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: "ru" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{dict.pages.home.title}</h1>
      <p className="text-muted-foreground">{dict.pages.home.description}</p>

      <div className="rounded-md bg-muted/40 p-4">
        <strong className="block text-sm font-semibold">
          {dict.pages.home.debugTitle}
        </strong>
        <p className="text-sm">
          {dict.pages.home.currentLanguage}: {lang}
        </p>
        <p className="text-sm">
          {dict.pages.home.dictionaryTitle}: {dict.pages.home.title}
        </p>
      </div>
    </div>
  );
}
