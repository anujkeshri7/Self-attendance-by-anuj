"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Subject, AttendanceRecord } from "@/types"

interface CalendarViewProps {
  selectedSubject: Subject
  attendanceRecords: AttendanceRecord[]
  onDateClick: (date: string) => void
}

export function CalendarView({ selectedSubject, attendanceRecords, onDateClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getAttendanceForDate = (date: string) => {
    return attendanceRecords.find((record) => record.subjectId === selectedSubject.id && record.date === date)
  }

  const getStatusColor = (record: AttendanceRecord) => {
    // Use custom color if provided
    if (record.color) {
      return record.color
    }

    // Default colors based on status
    switch (record.status) {
      case "present":
        return "#10b981" // green-500
      case "absent":
        return "#ef4444" // red-500
      case "half-day":
        return "#f59e0b" // amber-500
      case "overtime":
        return "#059669" // emerald-600
      case "leave":
        return "#3b82f6" // blue-500
      case "holiday":
        return "#8b5cf6" // violet-500
      case "weekly-off":
        return "#6b7280" // gray-500
      default:
        return "#f3f4f6" // gray-100
    }
  }

  const getStatusText = (record: AttendanceRecord) => {
    if (record.status === "overtime") return "OT"
    if (record.status === "leave" && record.leaveType) return record.leaveType
    return ""
  }

  const getTextColor = (backgroundColor: string) => {
    // Simple function to determine if text should be white or black based on background
    const hex = backgroundColor.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? "#000000" : "#ffffff"
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={previousMonth} className="hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="text-xl font-semibold text-gray-800">
            {monthNames[month]} {year}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-gray-100">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dateString = formatDate(year, month, day)
            const attendance = getAttendanceForDate(dateString)
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

            const backgroundColor = attendance ? getStatusColor(attendance) : "#f9fafb"
            const textColor = attendance ? getTextColor(backgroundColor) : "#374151"

            return (
              <button
                key={day}
                onClick={() => onDateClick(dateString)}
                className={`
                  relative p-2 text-sm rounded-lg transition-all hover:scale-105 hover:shadow-md
                  ${isToday ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                  ${!attendance ? "hover:bg-gray-100" : ""}
                `}
                style={{
                  backgroundColor,
                  color: textColor,
                }}
              >
                <div className="text-center">
                  <div className={attendance ? "font-semibold" : "font-medium"}>{day}</div>
                  {attendance && (
                    <div className="text-xs mt-1">
                      {getStatusText(attendance)}
                      {attendance.shift && (
                        <div className="text-xs opacity-75">{attendance.shift.charAt(0).toUpperCase()}</div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
