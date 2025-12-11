import { getDictionary, type Locale } from "../../../../dictionaries";
import { PartyDetailScreen } from "../../ui/party-detail-screen";

export default async function PartyDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <PartyDetailScreen locale={lang as Locale} dictionary={dictionary} partyId={id} />;
}

