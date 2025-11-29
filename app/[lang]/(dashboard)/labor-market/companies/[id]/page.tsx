import { getDictionary, type Locale } from "../../../../dictionaries";
import { CompanyDetailScreen } from "../../ui/company-detail-screen";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang);

  return <CompanyDetailScreen locale={lang} dictionary={dictionary} companyId={id} />;
}

