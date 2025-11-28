"use client";

import { useContext } from "react";
import { DictionaryContext } from "@/components/providers/dictionary-provider";

export function useDictionary() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error(
      "useDictionary must be used within a DictionaryProvider context",
    );
  }

  return context;
}

