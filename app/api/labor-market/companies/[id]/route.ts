import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/labor-market/companies/[id]
 * Получает детальную информацию о компании и её вакансиях
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

    // Получаем компанию
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (companyError || !company) {
      console.error("Failed to fetch company:", companyError);
      return NextResponse.json(
        { message: "Company not found." },
        { status: 404 }
      );
    }

    // Получаем вакансии компании
    const { data: vacancies, error: vacanciesError } = await supabase
      .from("vacancies")
      .select("*")
      .eq("company_id", id)
      .order("created_at", { ascending: false });

    if (vacanciesError) {
      console.error("Failed to fetch vacancies:", vacanciesError);
    }

    // Локализация
    const localizedCompany = {
      ...company,
      name: company[`name_${language}` as keyof typeof company] || company.name,
      description:
        company[`description_${language}` as keyof typeof company] ||
        company.description,
    };

    const localizedVacancies = (vacancies || []).map((vacancy) => ({
      ...vacancy,
      title:
        vacancy[`title_${language}` as keyof typeof vacancy] || vacancy.title,
      description:
        vacancy[`description_${language}` as keyof typeof vacancy] ||
        vacancy.description,
      location:
        vacancy[`location_${language}` as keyof typeof vacancy] ||
        vacancy.location,
    }));

    return NextResponse.json({
      company: localizedCompany,
      vacancies: localizedVacancies,
    });
  } catch (error) {
    console.error("Unexpected error while fetching company:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching company." },
      { status: 500 }
    );
  }
}

