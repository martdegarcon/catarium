import { getDictionary, type Locale } from "../../../../dictionaries";
import { LaborMarketNewsDetailScreen } from "../../ui/labor-market-news-detail-screen";

export default async function LaborMarketNewsDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <LaborMarketNewsDetailScreen locale={lang as Locale} dictionary={dictionary} newsId={id} />;
}

