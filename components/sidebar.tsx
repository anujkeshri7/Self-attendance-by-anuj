"use client"

import { useState } from "react"
import { X, Home, Zap, Search, Save, MenuIcon, Settings, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SettingsModal } from "@/components/settings-modal"

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
  onQuickAttendance: () => void
  onSearchAttendance: () => void
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
  onQuickAttendance,
  onSearchAttendance,
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false)

  if (!isOpen) return null

  const handleBackupRestore = () => {
    const data = {
      subjects: JSON.parse(localStorage.getItem("subjects") || "[]"),
      templates: JSON.parse(localStorage.getItem("templates") || "[]"),
      attendance: JSON.parse(localStorage.getItem("attendance") || "[]"),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `self-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    onClose()
  }

  const handleSendFeedback = () => {
    window.open("mailto:feedback@selftracker.app?subject=Self Tracker Feedback", "_blank")
    onClose()
  }

  const menuItems = [
    {
      icon: Home,
      label: "Self Attendance",
      active: true,
      action: () => {
        onNavigateHome()
        onClose()
      },
    },
    {
      icon: Zap,
      label: "Quick Attendance",
      action: () => {
        onQuickAttendance()
        onClose()
      },
    },
    {
      icon: Search,
      label: "Search Attendance",
      action: () => {
        onSearchAttendance()
        onClose()
      },
    },
    { icon: Save, label: "Backup / Restore", action: handleBackupRestore },
    { icon: MenuIcon, label: "Menu", action: onClose },
    { icon: Settings, label: "Settings", action: () => setShowSettings(true) },
    { icon: Mail, label: "Send Feedback", action: handleSendFeedback },
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
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-72 bg-background shadow-xl z-50 border-r border-border">
        <div className="p-3 border-b border-border bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-3 space-y-1">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className={`w-full justify-start h-9 ${
                item.active ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-muted"
              }`}
              onClick={item.action}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>

        {templates.length > 0 && (
          <>
            <div className="px-3 py-1.5 border-t border-border">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Templates</h3>
            </div>
            <div className="p-3 space-y-1.5">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    onTemplateSelect(template)
                    onClose()
                  }}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center mr-2 text-sm">
                        {getCategoryIcon(template.category)}
                      </div>
                      <span className="font-medium text-sm text-foreground">{template.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {subjects.length > 0 && (
          <>
            <div className="px-3 py-1.5 border-t border-border">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent Subjects</h3>
            </div>
            <div className="p-3 space-y-1.5">
              {subjects
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((subject) => (
                  <Card
                    key={subject.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSubject?.id === subject.id
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      onSubjectSelect(subject)
                      onClose()
                    }}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        <span className="font-medium text-sm text-foreground">{subject.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </>
        )}
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}
