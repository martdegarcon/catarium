import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/labor-market/vacancies
 * Получает список всех вакансий с информацией о компаниях
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ru";
    const validLocales = ["ru", "en", "zh"];
    const language = validLocales.includes(locale) ? locale : "ru";

    const supabase = await createClient();

    // Получаем вакансии с информацией о компаниях
    const { data: vacancies, error } = await supabase
      .from("vacancies")
      .select(
        `
        *,
        company:companies(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch vacancies:", error);
      return NextResponse.json(
        { message: "Failed to fetch vacancies." },
        { status: 500 }
      );
    }

    // Локализация вакансий и компаний
    const localizedVacancies = (vacancies || []).map((vacancy: any) => {
      const company = vacancy.company || {};
      return {
        ...vacancy,
        title:
          vacancy[`title_${language}` as keyof typeof vacancy] || vacancy.title,
        description:
          vacancy[`description_${language}` as keyof typeof vacancy] ||
          vacancy.description,
        location:
          vacancy[`location_${language}` as keyof typeof vacancy] ||
          vacancy.location,
        company: company
          ? {
              ...company,
              name:
                company[`name_${language}` as keyof typeof company] ||
                company.name,
              description:
                company[`description_${language}` as keyof typeof company] ||
                company.description,
            }
          : null,
      };
    });

    return NextResponse.json({ vacancies: localizedVacancies });
  } catch (error) {
    console.error("Unexpected error while fetching vacancies:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching vacancies." },
      { status: 500 }
    );
  }
}

