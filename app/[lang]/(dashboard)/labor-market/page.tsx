import { Suspense } from "react";
import { getDictionary, type Locale } from "../../dictionaries";
import { LaborMarketScreen } from "./ui/labor-market-screen";

export default async function LaborMarketPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <Suspense fallback={<div className="animate-pulse">Загрузка...</div>}>
      <LaborMarketScreen locale={lang} dictionary={dictionary} />
    </Suspense>
  );
}
