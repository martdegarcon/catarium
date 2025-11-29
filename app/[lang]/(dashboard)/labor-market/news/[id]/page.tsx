import { getDictionary, type Locale } from "../../../../dictionaries";
import { LaborMarketNewsDetailScreen } from "../../ui/labor-market-news-detail-screen";

export default async function LaborMarketNewsDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang);

  return <LaborMarketNewsDetailScreen locale={lang} dictionary={dictionary} newsId={id} />;
}

