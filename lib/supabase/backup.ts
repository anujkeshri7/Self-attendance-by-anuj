import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)

export interface BackupData {
  subjects: any[]
  templates: any[]
  attendance: any[]
}

export async function syncDataToSupabase(userId: string, data: BackupData) {
  try {
    // Sync templates
    for (const template of data.templates) {
      await supabase.from("templates").upsert({ ...template, user_id: userId }, { onConflict: "id" })
    }

    // Sync subjects
    for (const subject of data.subjects) {
      await supabase.from("subjects").upsert({ ...subject, user_id: userId }, { onConflict: "id" })
    }

    // Sync attendance records
    for (const record of data.attendance) {
      await supabase.from("attendance_records").upsert({ ...record, user_id: userId }, { onConflict: "id" })
    }

    return { success: true }
  } catch (error) {
    console.error("Backup error:", error)
    return { success: false, error }
  }
}

export async function loadDataFromSupabase(userId: string): Promise<BackupData | null> {
  try {
    const [templatesRes, subjectsRes, attendanceRes] = await Promise.all([
      supabase.from("templates").select("*").eq("user_id", userId),
      supabase.from("subjects").select("*").eq("user_id", userId),
      supabase.from("attendance_records").select("*").eq("user_id", userId),
    ])

    if (templatesRes.error || subjectsRes.error || attendanceRes.error) {
      throw new Error("Failed to load data from Supabase")
    }

    return {
      templates: templatesRes.data || [],
      subjects: subjectsRes.data || [],
      attendance: attendanceRes.data || [],
    }
  } catch (error) {
    console.error("Load backup error:", error)
    return null
  }
}
