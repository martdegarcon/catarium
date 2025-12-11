import { getDictionary, type Locale } from "../../dictionaries";
import { NewsScreen } from "./ui/news-screen";

/**
 * Render the news page for a requested language.
 *
 * @param params - A promise that resolves to an object containing `lang`, the language tag to use for localization
 * @returns The NewsScreen React element configured with the requested `locale` and its `dictionary`
 */
export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <NewsScreen locale={lang} dictionary={dictionary} />;
}
