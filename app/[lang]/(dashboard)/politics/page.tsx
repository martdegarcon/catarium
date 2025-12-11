import { Suspense } from "react";
import { getDictionary, type Locale } from "../../dictionaries";
import { PoliticsScreen } from "./ui/politics-screen";

/**
 * Renders the politics page for the requested language.
 *
 * @param params - Promise that resolves to an object with a `lang` string representing the locale code to render
 * @returns A React element that renders the politics screen for the specified locale wrapped in a Suspense fallback
 */
export default async function PoliticsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <Suspense fallback={<div className="animate-pulse">Загрузка...</div>}>
      <PoliticsScreen locale={lang} dictionary={dictionary} />
    </Suspense>
  );
}