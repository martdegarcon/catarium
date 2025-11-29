"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { LaborMarketTab } from "@/app/[lang]/(dashboard)/labor-market/model/types";
import type { Dictionary } from "@/types/dictionary";

type LaborMarketTabsProps = {
  tabs: LaborMarketTab[];
  selectedTab: LaborMarketTab;
  onTabChange: (tab: LaborMarketTab) => void;
  dictionary: Dictionary;
};

export function LaborMarketTabs({
  tabs,
  selectedTab,
  onTabChange,
  dictionary,
}: LaborMarketTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tab: LaborMarketTab) => {
    onTabChange(tab);
    
    // Обновляем URL с query параметром
    const url = tab === "home" 
      ? pathname 
      : `${pathname}?tab=${tab}`;
    router.push(url, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2 border-b pb-4">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={selectedTab === tab ? "default" : "ghost"}
          onClick={() => handleTabChange(tab)}
          className={selectedTab === tab ? "font-semibold" : ""}
        >
          {dictionary.pages.laborMarket.tabs[tab]}
        </Button>
      ))}
    </div>
  );
}
