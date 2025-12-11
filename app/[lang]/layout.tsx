import { DictionaryProvider } from "@/components/providers/dictionary-provider";
import { getDictionary, type Locale } from "./dictionaries";

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
