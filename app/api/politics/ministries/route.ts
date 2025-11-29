import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/politics/ministries
 * Получает список всех министерств
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: ministries, error } = await supabase
      .from("ministry")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to fetch ministries:", error);
      return NextResponse.json(
        { message: "Failed to fetch ministries." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ministries: ministries || [] });
  } catch (error) {
    console.error("Unexpected error while fetching ministries:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching ministries." },
      { status: 500 }
    );
  }
}

