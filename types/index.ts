export interface Subject {
  id: string
  name: string
  category: "school" | "work" | "fitness" | "custom"
  createdAt: Date
  templateId: string
}

export interface Template {
  id: string
  name: string
  category: "school" | "work" | "fitness" | "custom"
  createdAt: Date
}

export interface AttendanceRecord {
  id: string
  subjectId: string
  date: string
  status: "present" | "absent" | "half-day" | "overtime" | "leave" | "holiday" | "weekly-off"
  shift?: "morning" | "afternoon" | "night" | "general"
  leaveType?: "PL" | "CL" | "SL" | "LEAVE"
  overtimeHours?: number
  color?: string
}
