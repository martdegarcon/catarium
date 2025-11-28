import { getDictionary, type Locale } from "../../dictionaries";
import { NewsScreen } from "./ui/news-screen";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <NewsScreen locale={lang} dictionary={dictionary} />;
}

