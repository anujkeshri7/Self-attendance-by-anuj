import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Handle cookie errors
        }
      },
    },
  })
}

export interface Template {
  id: string
  user_id: string
  name: string
  category: string
  created_at: string
}

export interface Subject {
  id: string
  user_id: string
  template_id: string
  name: string
  category: string
  created_at: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  subject_id: string
  date: string
  status: string
  shift?: string
  leave_type?: string
  overtime_hours?: number
  color?: string
  created_at: string
}
