import { getDictionary, type Locale } from "../../../../dictionaries";
import { PartyDetailScreen } from "../../ui/party-detail-screen";

export default async function PartyDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang);

  return <PartyDetailScreen locale={lang} dictionary={dictionary} partyId={id} />;
}

