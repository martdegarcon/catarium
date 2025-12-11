import { getDictionary, type Locale } from "../../../../dictionaries";
import { CompanyDetailScreen } from "../../ui/company-detail-screen";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <CompanyDetailScreen locale={lang as Locale} dictionary={dictionary} companyId={id} />;
}

