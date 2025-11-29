"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { PoliticsTab } from "@/app/[lang]/(dashboard)/politics/model/types";
import type { Dictionary } from "@/types/dictionary";

type PoliticsTabsProps = {
  tabs: PoliticsTab[];
  selectedTab: PoliticsTab;
  onTabChange: (tab: PoliticsTab) => void;
  dictionary: Dictionary;
};

export function PoliticsTabs({
  tabs,
  selectedTab,
  onTabChange,
  dictionary,
}: PoliticsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (tab: PoliticsTab) => {
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
          {dictionary.pages.politics.tabs[tab]}
        </Button>
      ))}
    </div>
  );
}

