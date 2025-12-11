import { Suspense } from "react";
import { getDictionary, type Locale } from "../../dictionaries";
import { LaborMarketScreen } from "./ui/labor-market-screen";

/**
 * Render the labor market page for the requested locale.
 *
 * @param params - A promise that resolves to an object containing `lang`, the locale code used to load translations.
 * @returns A React element that renders the LaborMarketScreen for the provided locale wrapped in a Suspense boundary with a loading fallback.
 */
export default async function LaborMarketPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <Suspense fallback={<div className="animate-pulse">Загрузка...</div>}>
      <LaborMarketScreen locale={lang} dictionary={dictionary} />
    </Suspense>
  );
}