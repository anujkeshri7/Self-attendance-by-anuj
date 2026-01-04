import jsPDF from "jspdf"

interface Subject {
  id: string
  name: string
  category: "school" | "work" | "fitness" | "custom"
  createdAt: Date
  templateId: string
}

interface Template {
  id: string
  name: string
  category: "school" | "work" | "fitness" | "custom"
  createdAt: Date
}

interface AttendanceRecord {
  id: string
  subjectId: string
  date: string
  status: "present" | "absent" | "half-day" | "overtime" | "leave" | "holiday" | "weekly-off"
  shift?: string
  leaveType?: string
  overtimeHours?: number
  color?: string
}

export function generateBackupReport(
  templates: Template[],
  subjects: Subject[],
  attendanceRecords: AttendanceRecord[] = [],
) {
  const doc = new jsPDF()
  let yPosition = 20

  // Title
  doc.setFontSize(24)
  doc.setTextColor(0, 102, 204)
  doc.text("Your Self Attendance App Report", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" })
  yPosition += 15

  // Date generated
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  const dateGenerated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  doc.text(`Generated on: ${dateGenerated}`, doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" })
  yPosition += 12

  // Process each template
  templates.forEach((template) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    // Template heading
    doc.setFontSize(16)
    doc.setTextColor(0, 51, 102)
    doc.text(template.name, 20, yPosition)
    yPosition += 10

    // Get subjects for this template
    const templateSubjects = subjects.filter((s) => s.templateId === template.id)

    if (templateSubjects.length === 0) {
      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text("No subjects added yet", 25, yPosition)
      yPosition += 8
      return
    }

    // Process each subject
    templateSubjects.forEach((subject) => {
      if (yPosition > 280) {
        doc.addPage()
        yPosition = 20
      }

      // Subject name
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`• ${subject.name}`, 25, yPosition)
      yPosition += 7

      // Get attendance for this subject
      const subjectAttendance = attendanceRecords.filter((r) => r.subjectId === subject.id)

      if (subjectAttendance.length === 0) {
        doc.setFontSize(9)
        doc.setTextColor(150, 150, 150)
        doc.text("No attendance records", 30, yPosition)
        yPosition += 6
      } else {
        // Calculate statistics
        const presentCount = subjectAttendance.filter((r) => r.status === "present").length
        const absentCount = subjectAttendance.filter((r) => r.status === "absent").length
        const otherCount = subjectAttendance.length - presentCount - absentCount

        const presentPercentage = Math.round((presentCount / subjectAttendance.length) * 100)
        const absentPercentage = Math.round((absentCount / subjectAttendance.length) * 100)

        // Display statistics
        doc.setFontSize(9)
        doc.setTextColor(0, 0, 0)

        // Total records
        doc.text(`Total Records: ${subjectAttendance.length}`, 30, yPosition)
        yPosition += 5

        // Present
        doc.setTextColor(0, 128, 0)
        doc.text(`✓ Present: ${presentCount} (${presentPercentage}%)`, 30, yPosition)
        yPosition += 5

        // Absent
        doc.setTextColor(204, 0, 0)
        doc.text(`✗ Absent: ${absentCount} (${absentPercentage}%)`, 30, yPosition)
        yPosition += 5

        // Other statuses
        if (otherCount > 0) {
          doc.setTextColor(102, 102, 102)
          doc.text(`Other: ${otherCount}`, 30, yPosition)
          yPosition += 5
        }
      }

      yPosition += 4
    })

    yPosition += 8
  })

  // Add summary at the end
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setTextColor(0, 51, 102)
  doc.text("Summary", 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`Total Templates: ${templates.length}`, 25, yPosition)
  yPosition += 6
  doc.text(`Total Subjects: ${subjects.length}`, 25, yPosition)
  yPosition += 6
  doc.text(`Total Attendance Records: ${attendanceRecords.length}`, 25, yPosition)

  // Download PDF
  const filename = `Self-Attendance-Report-${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(filename)
}
