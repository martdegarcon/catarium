import { DictionaryProvider } from "@/components/providers/dictionary-provider";
import { getDictionary, type Locale } from "./dictionaries";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <DictionaryProvider locale={lang} dictionary={dictionary}>
      {children}
    </DictionaryProvider>
  );
}
