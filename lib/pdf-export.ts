export async function exportToPDF(data: {
  exportDate: string
  subjects: any[]
  templates: any[]
  attendance: any[]
}) {
  const { jsPDF } = await import("jspdf")
  const html2canvas = await import("html2canvas").then((m) => m.default)

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Title
  pdf.setFontSize(24)
  pdf.text("Self Tracker - Attendance Report", 20, yPosition)
  yPosition += 15

  // Export date
  pdf.setFontSize(10)
  pdf.setTextColor(128, 128, 128)
  pdf.text(`Export Date: ${new Date(data.exportDate).toLocaleDateString()}`, 20, yPosition)
  yPosition += 10

  // Reset text color
  pdf.setTextColor(0, 0, 0)

  // Templates Section
  if (data.templates.length > 0) {
    pdf.setFontSize(14)
    pdf.setFont(undefined, "bold")
    pdf.text("Templates", 20, yPosition)
    yPosition += 8

    pdf.setFontSize(10)
    pdf.setFont(undefined, "normal")
    data.templates.forEach((template) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.text(`• ${template.name} (${template.category})`, 25, yPosition)
      yPosition += 6
    })
    yPosition += 5
  }

  // Subjects Section
  if (data.subjects.length > 0) {
    if (yPosition > pageHeight - 30) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(14)
    pdf.setFont(undefined, "bold")
    pdf.text("Subjects", 20, yPosition)
    yPosition += 8

    pdf.setFontSize(10)
    pdf.setFont(undefined, "normal")
    data.subjects.forEach((subject) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }
      pdf.text(`• ${subject.name} (${subject.category})`, 25, yPosition)
      yPosition += 6
    })
    yPosition += 5
  }

  // Attendance Records Section
  if (data.attendance.length > 0) {
    if (yPosition > pageHeight - 30) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(14)
    pdf.setFont(undefined, "bold")
    pdf.text("Attendance Records", 20, yPosition)
    yPosition += 8

    pdf.setFontSize(9)
    pdf.setFont(undefined, "normal")

    // Group by subject
    const grouped: { [key: string]: any[] } = {}
    data.attendance.forEach((record) => {
      if (!grouped[record.subjectId]) grouped[record.subjectId] = []
      grouped[record.subjectId].push(record)
    })

    Object.entries(grouped).forEach(([subjectId, records]) => {
      const subject = data.subjects.find((s) => s.id === subjectId)
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.setFont(undefined, "bold")
      pdf.text(`${subject?.name || "Unknown Subject"}`, 25, yPosition)
      yPosition += 6

      pdf.setFont(undefined, "normal")
      records.slice(0, 10).forEach((record) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
        }
        const dateObj = new Date(record.date)
        const formattedDate = dateObj.toLocaleDateString()
        pdf.text(`  ${formattedDate}: ${record.status}${record.shift ? ` (${record.shift})` : ""}`, 30, yPosition)
        yPosition += 5
      })

      if (records.length > 10) {
        pdf.text(`  ... and ${records.length - 10} more records`, 30, yPosition)
        yPosition += 5
      }
      yPosition += 3
    })
  }

  // Summary
  if (yPosition > pageHeight - 40) {
    pdf.addPage()
    yPosition = 20
  }

  pdf.setFontSize(12)
  pdf.setFont(undefined, "bold")
  pdf.text("Summary", 20, yPosition)
  yPosition += 8

  pdf.setFontSize(10)
  pdf.setFont(undefined, "normal")
  pdf.text(`Total Templates: ${data.templates.length}`, 25, yPosition)
  yPosition += 6
  pdf.text(`Total Subjects: ${data.subjects.length}`, 25, yPosition)
  yPosition += 6
  pdf.text(`Total Records: ${data.attendance.length}`, 25, yPosition)

  // Save the PDF
  pdf.save(`self-tracker-export-${new Date().toISOString().split("T")[0]}.pdf`)
}
