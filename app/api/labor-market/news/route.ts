import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/labor-market/news
 * Получает все новости рынка труда (200 одинаковых для всех)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ru";
    const validLocales = ["ru", "en", "zh"];
    const language = validLocales.includes(locale) ? locale : "ru";

    const supabase = await createClient();

    const { data: news, error } = await supabase
      .from("labor_market_news")
      .select("*")
      .eq("language", language)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch labor market news:", error);
      return NextResponse.json(
        { message: "Failed to fetch labor market news." },
        { status: 500 }
      );
    }

    return NextResponse.json({ news: news || [] });
  } catch (error) {
    console.error("Unexpected error while fetching labor market news:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching labor market news." },
      { status: 500 }
    );
  }
}

