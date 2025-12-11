import { getDictionary, type Locale } from "../dictionaries";
import { Orbit, Newspaper, Briefcase, Landmark } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="space-y-8">

      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {dict.pages.home.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {dict.pages.home.subtitle}
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {dict.pages.home.description}
        </p>
      </div>

      {/* About Section */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-2xl font-semibold">
          {dict.pages.home.sections.about.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {dict.pages.home.sections.about.text}
        </p>
      </div>

      {/* Features Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {dict.pages.home.sections.features.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Catarium */}
          <div className="rounded-lg border bg-card p-6 space-y-2 hover:bg-accent/50 transition-colors">
            <Orbit className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">{dict.navigation.catarium}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.pages.home.sections.features.catarium}
            </p>
          </div>

          {/* News */}
          <div className="rounded-lg border bg-card p-6 space-y-2 hover:bg-accent/50 transition-colors">
            <Newspaper className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">{dict.navigation.news}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.pages.home.sections.features.news}
            </p>
          </div>

          {/* Work */}
          <div className="rounded-lg border bg-card p-6 space-y-2 hover:bg-accent/50 transition-colors">
            <Briefcase className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">{dict.navigation.work}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.pages.home.sections.features.work}
            </p>
          </div>

          {/* Politics */}
          <div className="rounded-lg border bg-card p-6 space-y-2 hover:bg-accent/50 transition-colors">
            <Landmark className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">{dict.navigation.politics}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.pages.home.sections.features.politics}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
