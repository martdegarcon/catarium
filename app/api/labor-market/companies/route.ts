import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/labor-market/companies
 * Получает список всех компаний
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ru";
    const validLocales = ["ru", "en", "zh"];
    const language = validLocales.includes(locale) ? locale : "ru";

    const supabase = await createClient();

    const { data: companies, error } = await supabase
      .from("companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to fetch companies:", error);
      return NextResponse.json(
        { message: "Failed to fetch companies." },
        { status: 500 }
      );
    }

    // Локализация названий компаний
    const localizedCompanies = (companies || []).map((company) => ({
      ...company,
      name:
        company[`name_${language}` as keyof typeof company] || company.name,
      description:
        company[`description_${language}` as keyof typeof company] ||
        company.description,
    }));

    return NextResponse.json({ companies: localizedCompanies });
  } catch (error) {
    console.error("Unexpected error while fetching companies:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching companies." },
      { status: 500 }
    );
  }
}

