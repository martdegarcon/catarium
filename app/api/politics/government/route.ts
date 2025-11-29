import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/politics/government
 * Получает текущий состав правительства (активные члены)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: governmentRaw, error } = await supabase
      .from("government")
      .select(`
        *,
        politician!government_politician_uuid_fkey(
          *,
          dataset_gender!gender_uuid(name, uuid),
          dataset_province!province_uuid(name, uuid)
        ),
        government_position!government_position_uuid_fkey(name, uuid)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch government:", error);
      return NextResponse.json(
        { message: "Failed to fetch government." },
        { status: 500 }
      );
    }

    // Переименовываем связанные таблицы
    const government = (governmentRaw || []).map((member: any) => ({
      ...member,
      politician: member.politician ? {
        ...member.politician,
        gender: member.politician.dataset_gender,
        province: member.politician.dataset_province,
        dataset_gender: undefined,
        dataset_province: undefined,
      } : null,
      position: member.government_position ? {
        name: member.government_position.name,
        uuid: member.government_position.uuid,
      } : null,
      government_position: undefined,
    }));

    return NextResponse.json({ government });
  } catch (error) {
    console.error("Unexpected error while fetching government:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching government." },
      { status: 500 }
    );
  }
}

