"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Subject, AttendanceRecord } from "@/app/page"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
  subject: Subject | null
  existingRecord?: AttendanceRecord
  onSave: (record: Omit<AttendanceRecord, "id">) => void
}

export function AttendanceModal({ isOpen, onClose, date, subject, existingRecord, onSave }: AttendanceModalProps) {
  const [status, setStatus] = useState<AttendanceRecord["status"]>(existingRecord?.status || "present")
  const [shift, setShift] = useState<AttendanceRecord["shift"]>(existingRecord?.shift)
  const [leaveType, setLeaveType] = useState<AttendanceRecord["leaveType"]>(existingRecord?.leaveType)
  const [overtimeHours, setOvertimeHours] = useState(existingRecord?.overtimeHours?.toString() || "")
  const [customColor, setCustomColor] = useState(existingRecord?.color || "")
  const [showMoreOptions, setShowMoreOptions] = useState(false)

  const handleSave = () => {
    if (!subject) return

    const record: Omit<AttendanceRecord, "id"> = {
      subjectId: subject.id,
      date,
      status,
      shift,
      leaveType: status === "leave" ? leaveType : undefined,
      overtimeHours: status === "overtime" ? Number(overtimeHours) || 0 : undefined,
      color: customColor || undefined,
    }

    onSave(record)
    handleClose()
  }

  const handleClose = () => {
    setStatus("present")
    setShift(undefined)
    setLeaveType(undefined)
    setOvertimeHours("")
    setCustomColor("")
    setShowMoreOptions(false)
    onClose()
  }

  const mainAttendanceOptions = [
    { value: "present", label: "✅ Present", color: "bg-green-500" },
    { value: "absent", label: "❌ Absent", color: "bg-red-500" },
    { value: "half-day", label: "⏳ Half Day", color: "bg-orange-300" },
  ]

  const moreAttendanceOptions = [
    { value: "overtime", label: "⏱ Overtime (OT)", color: "bg-green-600" },
    { value: "leave", label: "📄 Leave", color: "bg-blue-500" },
    { value: "holiday", label: "📅 Holiday", color: "bg-purple-500" },
    { value: "weekly-off", label: "🛌 Weekly Off", color: "bg-gray-500" },
  ]

  const shiftOptions = [
    { value: "morning", label: "M - Morning" },
    { value: "afternoon", label: "A - Afternoon" },
    { value: "night", label: "N - Night" },
    { value: "general", label: "G - General" },
  ]

  const leaveTypes = [
    { value: "PL", label: "PL - Privileged Leave" },
    { value: "CL", label: "CL - Casual Leave" },
    { value: "SL", label: "SL - Sick Leave" },
    { value: "LEAVE", label: "LEAVE - Other leave" },
  ]

  const isMoreOptionSelected = moreAttendanceOptions.some((option) => option.value === status)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Attendance for {new Date(date).toLocaleDateString()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Attendance Status</Label>
            <div className="grid grid-cols-1 gap-2">
              {/* Main attendance options */}
              {mainAttendanceOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={status === option.value ? "default" : "outline"}
                  className={`justify-start ${status === option.value ? option.color + " text-white" : ""}`}
                  onClick={() => setStatus(option.value as AttendanceRecord["status"])}
                >
                  {option.label}
                </Button>
              ))}

              {/* More options dropdown button */}
              <Button
                variant="outline"
                className={`justify-between ${isMoreOptionSelected ? "border-blue-500 bg-blue-50" : ""}`}
                onClick={() => setShowMoreOptions(!showMoreOptions)}
              >
                <span>More Options</span>
                {showMoreOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {/* More attendance options */}
              {showMoreOptions && (
                <div className="pl-4 space-y-2 border-l-2 border-blue-200">
                  {moreAttendanceOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={status === option.value ? "default" : "outline"}
                      className={`justify-start ${status === option.value ? option.color + " text-white" : ""}`}
                      onClick={() => setStatus(option.value as AttendanceRecord["status"])}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {status === "overtime" && (
            <div>
              <Label htmlFor="overtime-hours" className="text-sm font-medium">
                Overtime Hours
              </Label>
              <Input
                id="overtime-hours"
                type="number"
                placeholder="Enter hours"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
              />
            </div>
          )}

          {status === "leave" && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Leave Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {leaveTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={leaveType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLeaveType(type.value as AttendanceRecord["leaveType"])}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium mb-2 block text-gray-500">Shift Options (Optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {shiftOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={shift === option.value ? "secondary" : "outline"}
                  size="sm"
                  onClick={() =>
                    setShift(shift === option.value ? undefined : (option.value as AttendanceRecord["shift"]))
                  }
                >
                  {option.label}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShift(undefined)}
                className="col-span-2 text-red-600"
              >
                ❌ Clear Shift
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="custom-color" className="text-sm font-medium mb-2 block">
              🎨 Custom Color (Optional)
            </Label>
            <div className="flex items-center space-x-3">
              <Input
                id="custom-color"
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-10 rounded-lg border-2"
              />
              <span className="text-sm text-gray-600">Choose a custom color for this date</span>
            </div>
            {customColor && (
              <div
                className="mt-2 p-2 rounded-lg text-center text-white font-medium"
                style={{ backgroundColor: customColor }}
              >
                Preview Color
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="destructive" className="flex-1" onClick={handleClose}>
              CANCEL
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSave}>
              SAVE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
