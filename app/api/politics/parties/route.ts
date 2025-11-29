import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/politics/parties
 * Получает список всех политических партий
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: parties, error } = await supabase
      .from("political_party")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to fetch parties:", error);
      return NextResponse.json(
        { message: "Failed to fetch parties." },
        { status: 500 }
      );
    }

    return NextResponse.json({ parties: parties || [] });
  } catch (error) {
    console.error("Unexpected error while fetching parties:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching parties." },
      { status: 500 }
    );
  }
}

