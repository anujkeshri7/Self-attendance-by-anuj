"use client"

import type React from "react"

import { useState } from "react"
import { GraduationCap, Briefcase, Dumbbell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Subject } from "@/app/page"

interface AddTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateTemplate: (name: string, category: Subject["category"]) => void
}

export function AddTemplateModal({ isOpen, onClose, onCreateTemplate }: AddTemplateModalProps) {
  const [templateName, setTemplateName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Subject["category"] | null>(null)

  const categories = [
    {
      id: "school" as const,
      icon: GraduationCap,
      title: "School/College",
      description: "Track class attendance",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "work" as const,
      icon: Briefcase,
      title: "Work",
      description: "Track work attendance",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "fitness" as const,
      icon: Dumbbell,
      title: "Fitness",
      description: "Track workout sessions",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      id: "custom" as const,
      icon: Plus,
      title: "Custom",
      description: "Create your own category",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (templateName.trim() && selectedCategory) {
      onCreateTemplate(templateName.trim(), selectedCategory)
      handleClose()
    }
  }

  const handleClose = () => {
    setTemplateName("")
    setSelectedCategory(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-800">Create New Template</DialogTitle>
          <p className="text-center text-gray-600">Choose a category and give your template a name</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Select Category</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    selectedCategory === category.id
                      ? `${category.borderColor} ${category.bgColor} ring-2 ring-offset-2 ring-blue-500`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedCategory === category.id ? category.bgColor : "bg-gray-100"
                      }`}
                    >
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{category.title}</h3>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Name Input */}
          <div className="space-y-2">
            <label htmlFor="template-name" className="text-sm font-medium text-gray-700">
              Template Name
            </label>
            <Input
              id="template-name"
              placeholder="e.g., Spring 2024, Morning Shift, Personal Training"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              autoFocus
            />
            <p className="text-xs text-gray-500">Give your template a descriptive name</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 text-gray-600 border-gray-200 hover:bg-gray-50 font-medium"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={!templateName.trim() || !selectedCategory}
            >
              Create Template
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
