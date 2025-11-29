"use client";

import { Button } from "@/components/ui/button";
import type { TabCategory } from "./utils";
import type { Dictionary } from "@/types/dictionary";

type NewsTabsProps = {
  tabs: TabCategory[];
  selectedTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
  dictionary: Dictionary;
};

export function NewsTabs({ tabs, selectedTab, onTabChange, dictionary }: NewsTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b pb-4">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={selectedTab === tab ? "default" : "ghost"}
          onClick={() => onTabChange(tab)}
          className={selectedTab === tab ? "font-semibold" : ""}
        >
          {dictionary.pages.news.tabs[tab]}
        </Button>
      ))}
    </div>
  );
}

