import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/politics/ministries/[id]
 * Получает детальную информацию о министерстве и его членах
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Получаем министерство
    const { data: ministry, error: ministryError } = await supabase
      .from("ministry")
      .select("*")
      .eq("uuid", id)
      .single();

    if (ministryError || !ministry) {
      console.error("Failed to fetch ministry:", ministryError);
      return NextResponse.json(
        { message: "Ministry not found." },
        { status: 404 }
      );
    }

    // Получаем членов министерства
    const { data: members, error: membersError } = await supabase
      .from("ministry_member")
      .select(`
        *,
        politician:politician(*,
          gender:dataset_gender(*),
          province:dataset_province(*)
        ),
        position:ministry_position(*)
      `)
      .eq("ministry_uuid", id)
      .order("created_at", { ascending: false });

    if (membersError) {
      console.error("Failed to fetch ministry members:", membersError);
    }

    return NextResponse.json({
      ministry,
      members: members || [],
    });
  } catch (error) {
    console.error("Unexpected error while fetching ministry:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching ministry." },
      { status: 500 }
    );
  }
}

