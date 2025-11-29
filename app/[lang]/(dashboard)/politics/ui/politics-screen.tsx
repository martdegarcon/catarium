"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import type { PoliticsTab } from "../model/types";
import { PoliticsTabs } from "@/components/features/politics/politics-tabs";
import { PoliticiansTab } from "./politicians-tab";
import { HomeTab } from "./home-tab";
import { PartiesTab } from "./parties-tab";
import { PoliticalStructureTab } from "./political-structure-tab";

type PoliticsScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const TABS: PoliticsTab[] = ["home", "persons", "parties", "political-structure"];

export function PoliticsScreen({
  locale,
  dictionary,
}: PoliticsScreenProps) {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as PoliticsTab | null;
  
  const [selectedTab, setSelectedTab] = useState<PoliticsTab>(
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
        <h1 className="text-3xl font-bold">{dictionary.pages.politics.title}</h1>
      </div>

      <PoliticsTabs
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
        {selectedTab === "persons" && (
          <PoliticiansTab locale={locale} dictionary={dictionary} />
        )}
        {selectedTab === "parties" && (
          <PartiesTab locale={locale} dictionary={dictionary} />
        )}
        {selectedTab === "political-structure" && (
          <PoliticalStructureTab locale={locale} dictionary={dictionary} />
        )}
      </div>
    </div>
  );
}

