import { getDictionary, type Locale } from "../../dictionaries";
import CatariumLanding from "./ui/catarium-landing";

/**
 * Render the Catarium landing page using localized dictionary data.
 *
 * @param params - A promise resolving to an object with a `lang` code used to select the localization dictionary.
 * @returns The JSX element for the Catarium landing page populated with the locale-specific dictionary.
 */
export default async function CatariumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <CatariumLanding dict={dict.pages.catarium} />;
}
