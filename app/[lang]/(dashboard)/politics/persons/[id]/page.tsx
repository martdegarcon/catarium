import { getDictionary, type Locale } from "../../../../dictionaries";
import { PoliticianDetailScreen } from "../../ui/politician-detail-screen";

/**
 * Render the politician detail page for a given locale and politician id.
 *
 * @param params - A promise that resolves to route parameters: `lang` is the locale string and `id` is the politician identifier.
 * @returns A React element that renders the politician detail screen for the given locale and politician id.
 */
export default async function PoliticianDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <PoliticianDetailScreen locale={lang as Locale} dictionary={dictionary} politicianId={id} />;
}
