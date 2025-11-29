/**
 * API Route для получения детальной информации о новости
 * 
 * GET /api/news/[id]?locale=ru
 * 
 * Возвращает полную информацию о новости по ID
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const newsId = parseInt(id, 10);

    if (isNaN(newsId)) {
      return NextResponse.json({ message: "Invalid news ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ru";
    const validLocales = ["ru", "en", "zh"];
    const language = validLocales.includes(locale) ? locale : "ru";

    const supabase = await createClient();

    // Получаем новость по ID и языку
    const { data: news, error: newsError } = await supabase
      .from("news")
      .select("id, language, title, content, tags, category, image_url, published_at, reading_time, author")
      .eq("id", newsId)
      .eq("language", language)
      .single();

    if (newsError || !news) {
      console.error("Failed to fetch news:", newsError);
      return NextResponse.json(
        { message: "News not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
    
  } catch (error) {
    console.error("Unexpected news detail fetch error:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching news detail." },
      { status: 500 }
    );
  }
}

