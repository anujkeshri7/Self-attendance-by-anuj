"use client"

import React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import type { Subject } from "@/app/page"

interface QuickSetupModalProps {
  isOpen: boolean
  onClose: () => void
  template: {
    title: string
    category: Subject["category"]
  } | null
  onAddSubjects: (subjects: string[], category: Subject["category"]) => void
}

const templateSubjects = {
  school: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"],
  work: ["Office Attendance", "Team Meetings", "Project Work", "Client Calls", "Training Sessions"],
  fitness: ["Gym Workout", "Morning Run", "Yoga Session", "Swimming", "Cycling"],
  custom: [],
}

export function QuickSetupModal({ isOpen, onClose, template, onAddSubjects }: QuickSetupModalProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  // Initialize selected subjects when modal opens
  React.useEffect(() => {
    if (template && template.category !== "custom") {
      setSelectedSubjects(templateSubjects[template.category] || [])
    }
  }, [template])

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  const handleAddAll = () => {
    if (template) {
      onAddSubjects(selectedSubjects, template.category)
      setSelectedSubjects([])
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedSubjects([])
    onClose()
  }

  if (!template) return null

  const subjects = templateSubjects[template.category] || []

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-700">Quick Setup</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          <p className="text-gray-600 text-left">We'll add common subjects for {template.title}</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {subjects.map((subject) => (
            <div
              key={subject}
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleSubjectToggle(subject)}
            >
              <Checkbox
                id={subject}
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={() => handleSubjectToggle(subject)}
                className="w-5 h-5 border-2 border-blue-500 text-blue-600 data-[state=checked]:bg-blue-600"
              />
              <label htmlFor={subject} className="text-gray-700 font-medium cursor-pointer flex-1">
                {subject}
              </label>
            </div>
          ))}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            variant="destructive"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-6"
            onClick={handleClose}
          >
            CANCEL
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-6"
            onClick={handleAddAll}
            disabled={selectedSubjects.length === 0}
          >
            ADD ALL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
