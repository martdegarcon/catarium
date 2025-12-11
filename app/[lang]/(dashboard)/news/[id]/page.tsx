import { getDictionary, type Locale } from "../../../dictionaries";
import { NewsDetailScreen } from "../ui/news-detail-screen";

/**
 * Render the news detail page for a resolved route language and news identifier.
 *
 * @param params - A promise that resolves to an object containing `lang` (language code) and `id` (news id as a string)
 * @returns A React element that displays the NewsDetailScreen for the resolved `lang` (as `Locale`) and `id` (parsed to a number)
 */
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <NewsDetailScreen locale={lang as Locale} dictionary={dictionary} newsId={parseInt(id, 10)} />;
}
