import { getDictionary, type Locale } from "../../dictionaries";
import { NewsScreen } from "./ui/news-screen";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <NewsScreen locale={lang} dictionary={dictionary} />;
}

