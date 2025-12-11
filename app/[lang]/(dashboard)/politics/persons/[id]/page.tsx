import { getDictionary, type Locale } from "../../../../dictionaries";
import { PoliticianDetailScreen } from "../../ui/politician-detail-screen";

export default async function PoliticianDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <PoliticianDetailScreen locale={lang as Locale} dictionary={dictionary} politicianId={id} />;
}

