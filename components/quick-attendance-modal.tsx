"use client"

import { X, Check, XIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Subject {
  id: string
  name: string
  category: "school" | "work" | "fitness" | "custom"
  createdAt: Date
  templateId: string
}

interface AttendanceRecord {
  id: string
  subjectId: string
  date: string
  status: "present" | "absent" | "half-day" | "overtime" | "leave" | "holiday" | "weekly-off"
  shift?: "morning" | "afternoon" | "night" | "general"
  leaveType?: "PL" | "CL" | "SL" | "LEAVE"
  overtimeHours?: number
  color?: string
}

interface QuickAttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  subjects: Subject[]
  attendanceRecords: AttendanceRecord[]
}

export function QuickAttendanceModal({ isOpen, onClose, subjects, attendanceRecords }: QuickAttendanceModalProps) {
  if (!isOpen) return null

  const today = new Date().toISOString().split("T")[0]
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const getTodayAttendance = (subjectId: string) => {
    return attendanceRecords.find((r) => r.subjectId === subjectId && r.date === today)
  }

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "present":
        return <Check className="w-4 h-4 text-green-600" />
      case "absent":
        return <XIcon className="w-4 h-4 text-red-600" />
      case "half-day":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <span className="w-4 h-4 text-gray-400">-</span>
    }
  }

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case "present":
        return "Present"
      case "absent":
        return "Absent"
      case "half-day":
        return "Half Day"
      case "overtime":
        return "Overtime"
      case "leave":
        return "Leave"
      case "holiday":
        return "Holiday"
      case "weekly-off":
        return "Weekly Off"
      default:
        return "Not Marked"
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "absent":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      case "half-day":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
      case "overtime":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "leave":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
      case "holiday":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
      case "weekly-off":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const markedCount = subjects.filter((s) => getTodayAttendance(s.id)).length
  const presentCount = subjects.filter((s) => getTodayAttendance(s.id)?.status === "present").length

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto">
        <div className="bg-background rounded-xl shadow-xl border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Today's Attendance</h2>
              <p className="text-xs text-muted-foreground">{todayFormatted}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted/50 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Marked:</span>
              <span className="font-medium text-foreground">
                {markedCount}/{subjects.length}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Present:</span>
              <span className="font-medium text-green-600">{presentCount}</span>
            </div>
          </div>

          {/* Subject List */}
          <div className="max-h-64 overflow-y-auto">
            {subjects.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No subjects added yet</div>
            ) : (
              subjects.map((subject) => {
                const attendance = getTodayAttendance(subject.id)
                return (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(attendance?.status)}
                      <span className="text-sm font-medium text-foreground">{subject.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(attendance?.status)}`}>
                      {getStatusText(attendance?.status)}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <Button onClick={onClose} className="w-full" size="sm">
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
