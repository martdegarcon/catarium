import { getDictionary, type Locale } from "../../../dictionaries";
import { NewsDetailScreen } from "../ui/news-detail-screen";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <NewsDetailScreen locale={lang as Locale} dictionary={dictionary} newsId={parseInt(id, 10)} />;
}

