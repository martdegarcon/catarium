import { getDictionary, type Locale } from "../../../dictionaries";
import { NewsDetailScreen } from "../ui/news-detail-screen";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang);

  return <NewsDetailScreen locale={lang} dictionary={dictionary} newsId={parseInt(id, 10)} />;
}

