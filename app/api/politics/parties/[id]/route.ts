import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/politics/parties/[id]
 * Получает детальную информацию о партии и её членах
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Получаем партию
    const { data: party, error: partyError } = await supabase
      .from("political_party")
      .select("*")
      .eq("uuid", id)
      .single();

    if (partyError || !party) {
      console.error("Failed to fetch party:", partyError);
      return NextResponse.json(
        { message: "Party not found." },
        { status: 404 }
      );
    }

    // Получаем членов партии
    const { data: membersRaw, error: membersError } = await supabase
      .from("political_party_member")
      .select(`
        *,
        politician!political_party_member_politician_uuid_fkey(
          *,
          dataset_gender!gender_uuid(name, uuid),
          dataset_province!province_uuid(name, uuid)
        ),
        political_party_position!position_uuid(name, uuid)
      `)
      .eq("political_party_uuid", id)
      .order("created_at", { ascending: false });

    // Переименовываем связанные таблицы
    const members = (membersRaw || []).map((member: any) => ({
      ...member,
      politician: member.politician ? {
        ...member.politician,
        gender: member.politician.dataset_gender,
        province: member.politician.dataset_province,
        dataset_gender: undefined,
        dataset_province: undefined,
      } : null,
      position: member.political_party_position ? {
        name: member.political_party_position.name,
        uuid: member.political_party_position.uuid,
      } : null,
      political_party_position: undefined,
    }));

    if (membersError) {
      console.error("Failed to fetch party members:", membersError);
    }

    return NextResponse.json({
      party,
      members: members || [],
    });
  } catch (error) {
    console.error("Unexpected error while fetching party:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching party." },
      { status: 500 }
    );
  }
}

