import { DictionaryProvider } from "@/components/providers/dictionary-provider";
import { getDictionary, type Locale } from "./dictionaries";

/**
 * Wraps page content with a DictionaryProvider that supplies locale-specific dictionary data.
 *
 * @param children - The page or layout content to render within the provider.
 * @param params - A promise resolving to route parameters; must include `lang`, the locale code used to load the dictionary.
 * @returns A React element that renders `children` inside a DictionaryProvider with the resolved `locale` and `dictionary`.
 */
export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <DictionaryProvider locale={lang as Locale} dictionary={dictionary}>
      {children}
    </DictionaryProvider>
  );
}