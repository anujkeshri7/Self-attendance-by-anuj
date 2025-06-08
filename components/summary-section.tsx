"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

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

interface SummarySectionProps {
  selectedSubject: Subject
  attendanceRecords: AttendanceRecord[]
}

export function SummarySection({ selectedSubject, attendanceRecords }: SummarySectionProps) {
  const [viewMode, setViewMode] = useState<"this-month" | "all-months" | "custom">("this-month")

  const getFilteredRecords = () => {
    const subjectRecords = attendanceRecords.filter((r) => r.subjectId === selectedSubject.id)

    if (viewMode === "this-month") {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return subjectRecords.filter((r) => {
        const recordDate = new Date(r.date)
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
      })
    }

    return subjectRecords
  }

  const filteredRecords = getFilteredRecords()

  const stats = {
    present: filteredRecords.filter((r) => r.status === "present").length,
    absent: filteredRecords.filter((r) => r.status === "absent").length,
    halfDays: filteredRecords.filter((r) => r.status === "half-day").length,
    overtime: filteredRecords
      .filter((r) => r.status === "overtime")
      .reduce((total, r) => total + (r.overtimeHours || 0), 0),
    leave: filteredRecords.filter((r) => r.status === "leave").length,
    total: filteredRecords.length,
  }

  const attendancePercentage =
    stats.total > 0 ? Math.round(((stats.present + stats.halfDays * 0.5) / stats.total) * 100) : 0

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-40 border-2 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="all-months">All Months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Present:</span>
              <span className="font-semibold text-green-600 text-lg">{stats.present}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Absent:</span>
              <span className="font-semibold text-red-600 text-lg">{stats.absent || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Half Days:</span>
              <span className="font-semibold text-orange-600 text-lg">{stats.halfDays}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">OT:</span>
              <span className="font-semibold text-green-700 text-lg">{stats.overtime}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Leave:</span>
              <span className="font-semibold text-blue-600 text-lg">{stats.leave}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Days:</span>
              <span className="font-semibold text-gray-800 text-lg">{stats.total}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Attendance %</span>
            <span className="text-2xl font-bold text-blue-600">{attendancePercentage}%</span>
          </div>
          <Progress value={attendancePercentage} className="h-3" />
        </div>
      </CardContent>
    </Card>
  )
}
