"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import type { LaborMarketTab } from "../model/types";
import { LaborMarketTabs } from "@/components/features/labor-market/labor-market-tabs";
import { CompaniesTab } from "./companies-tab";
import { NewsTab } from "./news-tab";
import { VacanciesTab } from "./vacancies-tab";
import { HomeTab } from "./home-tab";

type LaborMarketScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const TABS: LaborMarketTab[] = ["home", "news", "companies", "vacancies"];

export function LaborMarketScreen({
  locale,
  dictionary,
}: LaborMarketScreenProps) {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as LaborMarketTab | null;
  
  const [selectedTab, setSelectedTab] = useState<LaborMarketTab>(
    (tabFromUrl && TABS.includes(tabFromUrl)) ? tabFromUrl : "home"
  );

  // Обновляем выбранную вкладку при изменении URL параметров
  useEffect(() => {
    if (tabFromUrl && TABS.includes(tabFromUrl)) {
      setSelectedTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{dictionary.pages.laborMarket.title}</h1>
      </div>

      <LaborMarketTabs
        tabs={TABS}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        dictionary={dictionary}
      />

      {/* Контент для каждой вкладки */}
      <div>
        {selectedTab === "home" && (
          <HomeTab locale={locale} dictionary={dictionary} />
        )}
        {selectedTab === "news" && (
          <NewsTab locale={locale} dictionary={dictionary} />
        )}
        {selectedTab === "companies" && (
          <CompaniesTab locale={locale} dictionary={dictionary} />
        )}
        {selectedTab === "vacancies" && (
          <VacanciesTab locale={locale} dictionary={dictionary} />
        )}
      </div>
    </div>
  );
}
