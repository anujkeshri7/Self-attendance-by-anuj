"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface TemplateSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCustom: (name: string) => void
}

export function TemplateSelectionModal({ isOpen, onClose, onAddCustom }: TemplateSelectionModalProps) {
  const [subjectName, setSubjectName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subjectName.trim()) {
      onAddCustom(subjectName.trim())
      setSubjectName("")
    }
  }

  const handleClose = () => {
    setSubjectName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-700">Add Subject or Work</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="E.g. Math, Job Name, Company Name, etc."
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
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
              disabled={!subjectName.trim()}
            >
              ADD
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
