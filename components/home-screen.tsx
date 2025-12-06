"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Calendar, BarChart3, Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface HomeScreenProps {
  templates: Template[]
  subjects: Subject[]
  attendanceRecords: AttendanceRecord[]
  onTemplateSelect: (template: Template) => void
  onSubjectSelect: (subject: Subject) => void
  onAddTemplate: () => void
  onViewAllSubjects: () => void
  searchInputRef?: React.RefObject<HTMLInputElement>
}

export function HomeScreen({
  templates,
  subjects,
  attendanceRecords,
  onTemplateSelect,
  onSubjectSelect,
  onAddTemplate,
  onViewAllSubjects,
  searchInputRef,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")

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

  const getTemplateStats = (template: Template) => {
    const templateSubjects = subjects.filter((s) => s.templateId === template.id)
    const templateAttendance = attendanceRecords.filter((r) => templateSubjects.some((s) => s.id === r.subjectId))

    const presentCount = templateAttendance.filter((r) => r.status === "present").length
    const totalCount = templateAttendance.length
    const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

    return {
      subjectCount: templateSubjects.length,
      attendancePercentage: percentage,
      totalRecords: totalCount,
    }
  }

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSubjects = subjects.filter((subject) => subject.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const recentSubjects = filteredSubjects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center space-y-3 py-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome to Your Attendance Tracker
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Track your subjects, work, or tasks with ease. Get insights into your attendance patterns and stay organized.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={searchInputRef}
            placeholder="Search templates or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg border-2 border-border focus:border-blue-500 rounded-lg bg-background text-foreground"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Templates</p>
              <p className="text-3xl font-bold text-foreground">{templates.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 cursor-pointer hover:shadow-md transition-shadow"
          onClick={onViewAllSubjects}
        >
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Subjects</p>
              <p className="text-3xl font-bold text-foreground">{subjects.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Records</p>
              <p className="text-3xl font-bold text-foreground">{attendanceRecords.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">My Templates</h2>
          <Button
            onClick={onAddTemplate}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-transparent"
          >
            <Plus className="w-4 h-4" />
            <span>Add Template</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map((template) => {
            const stats = getTemplateStats(template)
            return (
              <Card
                key={template.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-border bg-card"
                onClick={() => onTemplateSelect(template)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl">{getCategoryIcon(template.category)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{template.category}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subjects:</span>
                      <span className="font-semibold text-foreground">{stats.subjectCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Attendance:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {stats.attendancePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${stats.attendancePercentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Add Template Card */}
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-dashed border-2 border-muted-foreground/30 hover:border-blue-400"
            onClick={onAddTemplate}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
              <div className="p-4 bg-muted rounded-full hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                <Plus className="w-8 h-8 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Add New Template</h3>
                <p className="text-sm text-muted-foreground">Create a new attendance template</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {searchQuery && filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No templates found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Recent Subjects */}
      {recentSubjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Recent Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentSubjects.map((subject) => {
              const subjectAttendance = attendanceRecords.filter((r) => r.subjectId === subject.id)
              const presentCount = subjectAttendance.filter((r) => r.status === "present").length
              const totalCount = subjectAttendance.length
              const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

              return (
                <Card
                  key={subject.id}
                  className="cursor-pointer transition-all hover:shadow-md border-border bg-card"
                  onClick={() => onSubjectSelect(subject)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <h3 className="font-semibold text-foreground truncate">{subject.name}</h3>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Attendance:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {searchQuery && filteredSubjects.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No subjects found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
