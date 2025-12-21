"use client"

import { useState, useEffect } from "react"
import { X, Moon, Sun, Bell, Trash2, Download, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { exportToPDF } from "@/lib/pdf-export"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoBackup] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }, [darkMode])

  const handleExportData = async () => {
    try {
      const data = {
        exportDate: new Date().toISOString(),
        subjects: JSON.parse(localStorage.getItem("subjects") || "[]"),
        templates: JSON.parse(localStorage.getItem("templates") || "[]"),
        attendance: JSON.parse(localStorage.getItem("attendance") || "[]"),
      }
      await exportToPDF(data)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export PDF")
    }
  }

  const handleDeleteAllData = () => {
    if (confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  if (!isOpen) return null

  const settingsSections = [
    {
      title: "Appearance",
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: "Dark Mode",
          description: "Switch to dark theme",
          action: <Switch checked={darkMode} onCheckedChange={setDarkMode} />,
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Get reminders for attendance",
          action: <Switch checked={notifications} onCheckedChange={setNotifications} />,
        },
      ],
    },
    {
      title: "Data & Privacy",
      items: [
        {
          icon: Download,
          label: "Export Data",
          description: "Download all your attendance data",
          action: <ChevronRight className="w-4 h-4 text-muted-foreground" />,
          onClick: handleExportData,
        },
      ],
    },
    {
      title: "Danger Zone",
      items: [
        {
          icon: Trash2,
          label: "Delete All Data",
          description: "Permanently delete all your data",
          action: <ChevronRight className="w-4 h-4 text-red-400" />,
          onClick: handleDeleteAllData,
          danger: true,
        },
      ],
    },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm bg-background border border-border rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div>
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="py-1">
              <h3 className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <div>
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors ${
                      item.onClick ? "cursor-pointer" : "cursor-default"
                    }`}
                    disabled={!item.onClick && !item.action}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          item.danger ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"
                        }`}
                      >
                        <item.icon
                          className={`w-4 h-4 ${item.danger ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div className="text-left">
                        <p
                          className={`text-sm font-medium ${item.danger ? "text-red-600 dark:text-red-400" : "text-foreground"}`}
                        >
                          {item.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {item.action}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* App Info */}
          <div className="p-3 border-t border-border">
            <div className="text-center text-[10px] text-muted-foreground">
              <p>Self Tracker v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
