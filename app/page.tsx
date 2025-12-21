"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TopNavigation } from "@/components/top-navigation"
import { HomeScreen } from "@/components/home-screen"
import { AddSubjectModal } from "@/components/add-subject-modal"
import { AddTemplateModal } from "@/components/add-template-modal"
import { CalendarView } from "@/components/calendar-view"
import { AttendanceModal } from "@/components/attendance-modal"
import { SummarySection } from "@/components/summary-section"
import { Sidebar } from "@/components/sidebar"
import { SelectionMode } from "@/components/selection-mode"
import { QuickSetupModal } from "@/components/quick-setup-modal"
import { SubjectsContainer } from "@/components/subjects-container"
import { AllSubjectsContainer } from "@/components/all-subjects-container"
import { RenameTemplateModal } from "@/components/rename-template-modal"
import { QuickAttendanceModal } from "@/components/quick-attendance-modal"
import { getDemoUser } from "@/lib/demo-auth"
import { useRouter } from "next/navigation"

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

type ViewMode = "home" | "subjects" | "all-subjects" | "attendance"

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("home")
  const [showQuickSetup, setShowQuickSetup] = useState(false)
  const [quickSetupTemplate, setQuickSetupTemplate] = useState<{ title: string; category: Subject["category"] } | null>(
    null,
  )
  const [showQuickAttendance, setShowQuickAttendance] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const user = getDemoUser()
    if (!user) {
      router.push("/auth/login")
    }
  }, [router])

  const handleCreateTemplate = (name: string, category: Subject["category"]) => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name,
      category,
      createdAt: new Date(),
    }
    setTemplates((prev) => [...prev, newTemplate])
    setSelectedTemplate(newTemplate)
    setShowAddTemplateModal(false)
    setViewMode("subjects")
  }

  const handleAddSubject = (name: string, category: Subject["category"] = "custom") => {
    let template = selectedTemplate

    if (!template) {
      const newTemplate: Template = {
        id: Date.now().toString(),
        name: category === "custom" ? "Untitled" : category.charAt(0).toUpperCase() + category.slice(1),
        category,
        createdAt: new Date(),
      }
      setTemplates((prev) => [...prev, newTemplate])
      template = newTemplate
      setSelectedTemplate(newTemplate)
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      category,
      templateId: template.id,
      createdAt: new Date(),
    }

    setSubjects((prev) => [...prev, newSubject])
    setSelectedSubject(newSubject)
    setShowAddModal(false)
    setViewMode("attendance")
  }

  const handleBulkAddSubjects = (subjectNames: string[], category: Subject["category"]) => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: category === "custom" ? "Untitled" : category.charAt(0).toUpperCase() + category.slice(1),
      category,
      createdAt: new Date(),
    }
    setTemplates((prev) => [...prev, newTemplate])
    setSelectedTemplate(newTemplate)

    const newSubjects = subjectNames.map((name) => ({
      id: `${Date.now()}-${Math.random()}`,
      name,
      category,
      templateId: newTemplate.id,
      createdAt: new Date(),
    }))

    setSubjects((prev) => [...prev, ...newSubjects])
    setShowQuickSetup(false)
    setViewMode("home")
  }

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject)
    setViewMode("attendance")
  }

  const handleTemplateSelectFromHome = (template: Template) => {
    setSelectedTemplate(template)
    setViewMode("subjects")
  }

  const handleTemplateSelectFromSidebar = (template: Template) => {
    setSelectedTemplate(template)
    setViewMode("subjects")
  }

  const handleViewAllSubjects = () => {
    setSelectedTemplate(null)
    setViewMode("all-subjects")
  }

  const handleDateClick = (date: string) => {
    if (selectedSubject) {
      setSelectedDate(date)
      setShowAttendanceModal(true)
    }
  }

  const handleAttendanceUpdate = (record: Omit<AttendanceRecord, "id">) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString(),
    }

    const filteredRecords = attendanceRecords.filter(
      (r) => !(r.subjectId === record.subjectId && r.date === record.date),
    )

    setAttendanceRecords([...filteredRecords, newRecord])
    setShowAttendanceModal(false)
  }

  const handleSubjectLongPress = (subjectId: string) => {
    setSelectionMode(true)
    setSelectedSubjects([subjectId])
  }

  const toggleSubjectSelection = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
    )
  }

  const handleDeleteSelected = () => {
    setSubjects((prev) => prev.filter((s) => !selectedSubjects.includes(s.id)))
    setAttendanceRecords((prev) => prev.filter((r) => !selectedSubjects.includes(r.subjectId)))
    setSelectionMode(false)
    setSelectedSubjects([])

    const remainingSubjects = subjects.filter((s) => !selectedSubjects.includes(s.id))
    const usedTemplateIds = new Set(remainingSubjects.map((s) => s.templateId))
    setTemplates((prev) => prev.filter((t) => usedTemplateIds.has(t.id)))

    if (selectedSubject && selectedSubjects.includes(selectedSubject.id)) {
      setSelectedSubject(null)
      setViewMode("all-subjects")
    }
  }

  const exitSelectionMode = () => {
    setSelectionMode(false)
    setSelectedSubjects([])
  }

  const handleRenameTemplate = (id: string, newName: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, name: newName } : t)))
    if (selectedTemplate?.id === id) {
      setSelectedTemplate((prev) => (prev ? { ...prev, name: newName } : null))
    }
    setShowRenameModal(false)
  }

  const getTemplateSubjects = () => {
    if (!selectedTemplate) return []
    return subjects.filter((s) => s.templateId === selectedTemplate.id)
  }

  const navigateBack = () => {
    if (viewMode === "attendance") {
      if (!selectedTemplate) {
        setViewMode("all-subjects")
      } else {
        setViewMode("subjects")
      }
      setSelectedSubject(null)
    } else if (viewMode === "subjects" || viewMode === "all-subjects") {
      setViewMode("home")
      setSelectedTemplate(null)
    }
  }

  const navigateToHome = () => {
    setViewMode("home")
    setSelectedTemplate(null)
    setSelectedSubject(null)
  }

  const handleQuickAttendance = () => {
    setShowQuickAttendance(true)
  }

  const handleSearchAttendance = () => {
    setViewMode("home")
    setSelectedTemplate(null)
    setSelectedSubject(null)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  const renderContent = () => {
    switch (viewMode) {
      case "home":
        return (
          <HomeScreen
            templates={templates}
            subjects={subjects}
            attendanceRecords={attendanceRecords}
            onTemplateSelect={handleTemplateSelectFromHome}
            onSubjectSelect={handleSubjectSelect}
            onAddTemplate={() => setShowAddTemplateModal(true)}
            onViewAllSubjects={handleViewAllSubjects}
            searchInputRef={searchInputRef}
          />
        )

      case "subjects":
        return (
          <div className="p-4 space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={navigateBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <SubjectsContainer
              template={selectedTemplate}
              subjects={getTemplateSubjects()}
              onSubjectSelect={handleSubjectSelect}
              onAddSubject={() => setShowAddModal(true)}
              onRenameTemplate={() => setShowRenameModal(true)}
              onSubjectLongPress={handleSubjectLongPress}
              selectionMode={selectionMode}
              selectedSubjects={selectedSubjects}
              toggleSubjectSelection={toggleSubjectSelection}
            />
          </div>
        )

      case "all-subjects":
        return (
          <div className="p-4 space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={navigateBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <AllSubjectsContainer
              subjects={subjects}
              templates={templates}
              onSubjectSelect={handleSubjectSelect}
              onAddSubject={() => setShowAddModal(true)}
              onSubjectLongPress={handleSubjectLongPress}
              selectionMode={selectionMode}
              selectedSubjects={selectedSubjects}
              toggleSubjectSelection={toggleSubjectSelection}
            />
          </div>
        )

      case "attendance":
        return selectedSubject ? (
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={navigateBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">{selectedSubject.name}</h2>
              </div>
              <Button onClick={() => setShowAddModal(true)} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>

            <CalendarView
              selectedSubject={selectedSubject}
              attendanceRecords={attendanceRecords}
              onDateClick={handleDateClick}
            />

            <SummarySection selectedSubject={selectedSubject} attendanceRecords={attendanceRecords} />
          </div>
        ) : null

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        subjects={subjects}
        templates={templates}
        selectedSubject={selectedSubject}
        selectedTemplate={selectedTemplate}
        onSubjectSelect={handleSubjectSelect}
        onTemplateSelect={handleTemplateSelectFromSidebar}
        onNavigateHome={navigateToHome}
        onQuickAttendance={handleQuickAttendance}
        onSearchAttendance={handleSearchAttendance}
      />

      <div className="flex flex-col min-h-screen">
        <TopNavigation
          onMenuClick={() => setSidebarOpen(true)}
          selectionMode={selectionMode}
          selectedCount={selectedSubjects.length}
          onExitSelection={exitSelectionMode}
        />

        {selectionMode && (
          <SelectionMode
            selectedCount={selectedSubjects.length}
            onDelete={handleDeleteSelected}
            onExit={exitSelectionMode}
          />
        )}

        <main className="flex-1">{renderContent()}</main>
      </div>

      <AddSubjectModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddSubject} />

      <AddTemplateModal
        isOpen={showAddTemplateModal}
        onClose={() => setShowAddTemplateModal(false)}
        onCreateTemplate={handleCreateTemplate}
      />

      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        date={selectedDate}
        subject={selectedSubject}
        existingRecord={attendanceRecords.find((r) => r.subjectId === selectedSubject?.id && r.date === selectedDate)}
        onSave={handleAttendanceUpdate}
      />

      <QuickSetupModal
        isOpen={showQuickSetup}
        onClose={() => setShowQuickSetup(false)}
        template={quickSetupTemplate}
        onAddSubjects={handleBulkAddSubjects}
      />

      <RenameTemplateModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        template={selectedTemplate}
        onRename={handleRenameTemplate}
      />

      <QuickAttendanceModal
        isOpen={showQuickAttendance}
        onClose={() => setShowQuickAttendance(false)}
        subjects={subjects}
        attendanceRecords={attendanceRecords}
      />
    </div>
  )
}
