import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/politics/politicians/[id]
 * Получает детальную информацию о политике со всеми связями
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Получаем политика с основными данными
    const { data: politician, error: politicianError } = await supabase
      .from("politician")
      .select(`
        *,
        dataset_gender!gender_uuid(*),
        dataset_province!province_uuid(*)
      `)
      .eq("uuid", id)
      .single();
    
    // Переименовываем связанные таблицы
    const politicianWithRelations = politician ? {
      ...politician,
      gender: politician.dataset_gender,
      province: politician.dataset_province,
      dataset_gender: undefined,
      dataset_province: undefined,
    } : null;

    if (politicianError || !politicianWithRelations) {
      console.error("Failed to fetch politician:", politicianError);
      return NextResponse.json(
        { message: "Politician not found." },
        { status: 404 }
      );
    }

    // Получаем членство в партиях
    const { data: partyMembers, error: partyError } = await supabase
      .from("political_party_member")
      .select(`
        *,
        political_party:political_party(*),
        position:political_party_position(*)
      `)
      .eq("politician_uuid", id)
      .order("created_at", { ascending: false });

    if (partyError) {
      console.error("Failed to fetch party members:", partyError);
    }

    // Получаем членство в министерствах
    const { data: ministryMembers, error: ministryError } = await supabase
      .from("ministry_member")
      .select(`
        *,
        ministry:ministry(*),
        position:ministry_position(*)
      `)
      .eq("politician_uuid", id)
      .order("created_at", { ascending: false });

    if (ministryError) {
      console.error("Failed to fetch ministry members:", ministryError);
    }

    // Получаем участие в правительстве
    const { data: government, error: governmentError } = await supabase
      .from("government")
      .select(`
        *,
        position:government_position(*)
      `)
      .eq("politician_uuid", id)
      .order("created_at", { ascending: false });

    if (governmentError) {
      console.error("Failed to fetch government:", governmentError);
    }

    // Получаем образование
    const { data: education, error: educationError } = await supabase
      .from("politician_education")
      .select(`
        *,
        university:dataset_university(*)
      `)
      .eq("politician_uuid", id)
      .order("sequence_number", { ascending: true });

    if (educationError) {
      console.error("Failed to fetch education:", educationError);
    }

    return NextResponse.json({
      politician: {
        ...politicianWithRelations,
        parties: partyMembers || [],
        ministries: ministryMembers || [],
        government: government || [],
        education: education || [],
      },
    });
  } catch (error) {
    console.error("Unexpected error while fetching politician:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching politician." },
      { status: 500 }
    );
  }
}

