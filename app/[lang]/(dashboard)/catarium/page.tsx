import { getDictionary, type Locale } from "../../dictionaries";
import CatariumLanding from "./ui/catarium-landing";

export default async function CatariumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <CatariumLanding dict={dict.pages.catarium} />;
}

