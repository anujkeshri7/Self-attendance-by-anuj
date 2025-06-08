"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

interface AllSubjectsContainerProps {
  subjects: Subject[]
  templates: Template[]
  onSubjectSelect: (subject: Subject) => void
  onAddSubject: () => void
  onSubjectLongPress: (subjectId: string) => void
  selectionMode: boolean
  selectedSubjects: string[]
  toggleSubjectSelection: (subjectId: string) => void
}

export function AllSubjectsContainer({
  subjects,
  templates,
  onSubjectSelect,
  onAddSubject,
  onSubjectLongPress,
  selectionMode,
  selectedSubjects,
  toggleSubjectSelection,
}: AllSubjectsContainerProps) {
  const getTemplateName = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    return template ? template.name : "Unknown Template"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "school":
        return "🎓"
      case "work":
        return "💼"
      case "fitness":
        return "💪"
      default:
        return "📝"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📁</span>
          <h2 className="text-2xl font-semibold text-gray-800">All Subjects</h2>
        </div>
        <Button onClick={onAddSubject} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No subjects yet</p>
          <Button onClick={onAddSubject} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add your first subject
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectionMode
                  ? selectedSubjects.includes(subject.id)
                    ? "ring-2 ring-red-500 bg-red-50"
                    : "hover:border-gray-300"
                  : "hover:border-blue-300"
              }`}
              onClick={() => {
                if (selectionMode) {
                  toggleSubjectSelection(subject.id)
                } else {
                  onSubjectSelect(subject)
                }
              }}
              onTouchStart={() => {
                if (!selectionMode) {
                  const timer = setTimeout(() => onSubjectLongPress(subject.id), 500)
                  const cleanup = () => clearTimeout(timer)
                  document.addEventListener("touchend", cleanup, { once: true })
                  document.addEventListener("touchmove", cleanup, { once: true })
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(subject.category)}</span>
                      <h3 className="font-medium text-gray-800">{subject.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500">Template: {getTemplateName(subject.templateId)}</p>
                    <p className="text-xs text-gray-400">{new Date(subject.createdAt).toLocaleDateString()}</p>
                  </div>
                  {selectionMode && selectedSubjects.includes(subject.id) && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
