"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Template {
  id: string
  name: string
  category: "school" | "work" | "fitness" | "custom"
  createdAt: Date
}

interface RenameTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: Template | null
  onRename: (id: string, newName: string) => void
}

export function RenameTemplateModal({ isOpen, onClose, template, onRename }: RenameTemplateModalProps) {
  const [templateName, setTemplateName] = useState("")

  useEffect(() => {
    if (template) {
      setTemplateName(template.name)
    }
  }, [template])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (template && templateName.trim()) {
      onRename(template.id, templateName.trim())
    }
  }

  const handleClose = () => {
    if (template) {
      setTemplateName(template.name)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-800">Rename Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 text-red-600 border-red-200 hover:bg-red-50 font-medium"
              onClick={handleClose}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
              disabled={!templateName.trim()}
            >
              SAVE
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
