import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/politics/politicians
 * Получает список всех политиков
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: politicians, error } = await supabase
      .from("politician")
      .select(`
        *,
        gender:dataset_gender!gender_uuid(*),
        province:dataset_province!province_uuid(*)
      `)
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to fetch politicians:", error);
      return NextResponse.json(
        { message: "Failed to fetch politicians." },
        { status: 500 }
      );
    }

    // Загружаем партии для каждого политика отдельно
    // Показываем все партии, не только активные
    const politiciansWithRelations = await Promise.all(
      (politicians || []).map(async (p: any) => {
        const { data: partyMembers, error: partyError } = await supabase
          .from("political_party_member")
          .select(`
            *,
            political_party:political_party(*),
            position:political_party_position(*)
          `)
          .eq("politician_uuid", p.uuid)
          .order("created_at", { ascending: false });

        // Логируем если есть ошибка или политик без партий
        if (partyError) {
          console.error(`Error loading parties for politician ${p.uuid}:`, partyError);
        }
        if (!partyMembers || partyMembers.length === 0) {
          console.warn(`Politician ${p.name} (${p.uuid}) has no party memberships`);
        }

        return {
          ...p,
          parties: partyMembers || [],
        };
      })
    );

    return NextResponse.json({ politicians: politiciansWithRelations });
  } catch (error) {
    console.error("Unexpected error while fetching politicians:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching politicians." },
      { status: 500 }
    );
  }
}

