import { getDictionary, type Locale } from "../../../../dictionaries";
import { CompanyDetailScreen } from "../../ui/company-detail-screen";

/**
 * Renders the company detail page for a given language and company identifier.
 *
 * @param params - Promise that resolves to an object containing `lang` (locale code) and `id` (company identifier) used to load translations and select the company
 * @returns A JSX element displaying the company detail screen configured with the resolved locale, dictionary, and `companyId`
 */
export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <CompanyDetailScreen locale={lang as Locale} dictionary={dictionary} companyId={id} />;
}
