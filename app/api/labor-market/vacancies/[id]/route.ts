import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/labor-market/vacancies/[id]
 * Получает детальную информацию о вакансии с информацией о компании
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ru";
    const validLocales = ["ru", "en", "zh"];
    const language = validLocales.includes(locale) ? locale : "ru";

    const supabase = await createClient();

    // Получаем вакансию с информацией о компании
    const { data: vacancy, error } = await supabase
      .from("vacancies")
      .select(
        `
        *,
        company:companies(*)
      `
      )
      .eq("id", id)
      .single();

    if (error || !vacancy) {
      console.error("Failed to fetch vacancy:", error);
      return NextResponse.json(
        { message: "Vacancy not found." },
        { status: 404 }
      );
    }

    // Локализация
    const company = (vacancy as any).company || {};
    const localizedVacancy = {
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

    return NextResponse.json({ vacancy: localizedVacancy });
  } catch (error) {
    console.error("Unexpected error while fetching vacancy:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching vacancy." },
      { status: 500 }
    );
  }
}

