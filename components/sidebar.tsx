"use client"

import { X, Home, Zap, Search, Save, MenuIcon, Settings, Mail } from "lucide-react"
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

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  subjects: Subject[]
  templates: Template[]
  selectedSubject: Subject | null
  selectedTemplate: Template | null
  onSubjectSelect: (subject: Subject) => void
  onTemplateSelect: (template: Template) => void
  onNavigateHome: () => void
}

export function Sidebar({
  isOpen,
  onClose,
  subjects,
  templates,
  selectedSubject,
  selectedTemplate,
  onSubjectSelect,
  onTemplateSelect,
  onNavigateHome,
}: SidebarProps) {
  if (!isOpen) return null

  const menuItems = [
    { icon: Home, label: "Self Attendance", active: true, action: onNavigateHome },
    { icon: Zap, label: "Quick Attendance" },
    { icon: Search, label: "Search Attendance" },
    { icon: Save, label: "Backup / Restore" },
    { icon: MenuIcon, label: "Menu" },
    { icon: Settings, label: "Settings" },
    { icon: Mail, label: "Send Feedback" },
  ]

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
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start ${
                item.active ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                if (item.action) {
                  item.action()
                  onClose()
                }
              }}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>

        {templates.length > 0 && (
          <>
            <div className="px-4 py-2 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Your Templates</h3>
            </div>
            <div className="p-4 space-y-2">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    onTemplateSelect(template)
                    onClose()
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center mr-3 text-lg">
                        {getCategoryIcon(template.category)}
                      </div>
                      <span className="font-medium">{template.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {subjects.length > 0 && (
          <>
            <div className="px-4 py-2 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Recent Subjects</h3>
            </div>
            <div className="p-4 space-y-2">
              {subjects
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((subject) => (
                  <Card
                    key={subject.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSubject?.id === subject.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onSubjectSelect(subject)
                      onClose()
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
