import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/politics/statistics
 * Получает статистику по политикам, партиям, министерствам и правительству
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Общее количество политиков
    const { count: totalPoliticians } = await supabase
      .from("politician")
      .select("*", { count: "exact", head: true });

    // Количество политиков по партиям
    const { data: partyStats } = await supabase
      .from("political_party_member")
      .select(`
        political_party_uuid,
        political_party!political_party_member_political_party_uuid_fkey(name, uuid)
      `)
      .eq("is_active", true);

    // Подсчитываем количество членов по партиям
    const partyCounts: Record<string, { name: string; count: number; uuid: string }> = {};
    
    if (partyStats) {
      partyStats.forEach((member: any) => {
        if (member.political_party) {
          const partyId = member.political_party.uuid;
          if (!partyCounts[partyId]) {
            partyCounts[partyId] = {
              name: member.political_party.name,
              count: 0,
              uuid: partyId,
            };
          }
          partyCounts[partyId].count++;
        }
      });
    }

    // Количество политиков по полу
    const { data: genderStats } = await supabase
      .from("politician")
      .select(`
        gender_uuid,
        dataset_gender!gender_uuid(name, uuid)
      `);

    const genderCounts: Record<string, { name: string; count: number }> = {};
    
    if (genderStats) {
      genderStats.forEach((politician: any) => {
        if (politician.dataset_gender) {
          const genderName = politician.dataset_gender.name;
          if (!genderCounts[genderName]) {
            genderCounts[genderName] = { name: genderName, count: 0 };
          }
          genderCounts[genderName].count++;
        }
      });
    }

    // Количество активных партий
    const { count: activeParties } = await supabase
      .from("political_party")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // Количество министерств
    const { count: totalMinistries } = await supabase
      .from("ministry")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // Количество членов правительства
    const { count: governmentMembers } = await supabase
      .from("government")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // Топ политиков (первые 3-5)
    const { data: topPoliticiansRaw } = await supabase
      .from("politician")
      .select(`
        uuid,
        name,
        avatar_path,
        dataset_gender!gender_uuid(name)
      `)
      .limit(5)
      .order("created_at", { ascending: false });

    // Переименовываем связанные таблицы
    const topPoliticians = (topPoliticiansRaw || []).map((p: any) => ({
      uuid: p.uuid,
      name: p.name,
      avatar_path: p.avatar_path,
      gender: p.dataset_gender?.name || null,
    }));

    return NextResponse.json({
      statistics: {
        totalPoliticians: totalPoliticians || 0,
        activeParties: activeParties || 0,
        totalMinistries: totalMinistries || 0,
        governmentMembers: governmentMembers || 0,
        partyCounts: Object.values(partyCounts).sort((a, b) => b.count - a.count),
        genderCounts: Object.values(genderCounts),
        topPoliticians,
      },
    });
  } catch (error) {
    console.error("Unexpected error while fetching statistics:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching statistics." },
      { status: 500 }
    );
  }
}

