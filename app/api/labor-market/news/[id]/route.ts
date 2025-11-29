import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/labor-market/news/[id]
 * Получает одну новость рынка труда по ID
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

    const { data: news, error } = await supabase
      .from("labor_market_news")
      .select("*")
      .eq("id", id)
      .eq("language", language)
      .single();

    if (error || !news) {
      console.error("Failed to fetch labor market news:", error);
      return NextResponse.json(
        { message: "News not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Unexpected error while fetching labor market news:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching labor market news." },
      { status: 500 }
    );
  }
}

