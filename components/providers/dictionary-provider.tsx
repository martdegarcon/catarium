"use client";

import { createContext } from "react";
import type { ReactNode } from "react";
import type { Dictionary } from "@/types/dictionary";
import type { Locale } from "@/app/[lang]/dictionaries";

type DictionaryContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

export const DictionaryContext = createContext<DictionaryContextValue | null>(
  null,
);

export function DictionaryProvider({
  children,
  locale,
  dictionary,
}: {
  children: ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <DictionaryContext.Provider value={{ locale, dictionary }}>
      {children}
    </DictionaryContext.Provider>
  );
}

