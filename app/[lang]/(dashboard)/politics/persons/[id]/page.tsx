import { getDictionary, type Locale } from "../../../../dictionaries";
import { PoliticianDetailScreen } from "../../ui/politician-detail-screen";

export default async function PoliticianDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang);

  return <PoliticianDetailScreen locale={lang} dictionary={dictionary} politicianId={id} />;
}

