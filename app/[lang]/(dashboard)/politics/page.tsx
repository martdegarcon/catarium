import { Suspense } from "react";
import { getDictionary, type Locale } from "../../dictionaries";
import { PoliticsScreen } from "./ui/politics-screen";

export default async function PoliticsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <Suspense fallback={<div className="animate-pulse">Загрузка...</div>}>
      <PoliticsScreen locale={lang} dictionary={dictionary} />
    </Suspense>
  );
}