import { getDictionary, type Locale } from "../../../../dictionaries";
import { LaborMarketNewsDetailScreen } from "../../ui/labor-market-news-detail-screen";

/**
 * Render the labor market news detail page for a given locale and news id.
 *
 * @param params - A promise resolving to route parameters; `lang` is a locale identifier string and `id` is the news item id.
 * @returns A React element that renders LaborMarketNewsDetailScreen for the specified locale and news id.
 */
export default async function LaborMarketNewsDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <LaborMarketNewsDetailScreen locale={lang as Locale} dictionary={dictionary} newsId={id} />;
}
