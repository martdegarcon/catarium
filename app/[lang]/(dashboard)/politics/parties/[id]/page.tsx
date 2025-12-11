import { getDictionary, type Locale } from "../../../../dictionaries";
import { PartyDetailScreen } from "../../ui/party-detail-screen";

/**
 * Render the party detail screen for the specified language and party identifier.
 *
 * @param params - Promise resolving to an object with `lang` (language code) and `id` (party identifier)
 * @returns A React element that renders the party detail screen configured for the specified locale and party id
 */
export default async function PartyDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <PartyDetailScreen locale={lang as Locale} dictionary={dictionary} partyId={id} />;
}
