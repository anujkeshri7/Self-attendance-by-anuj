"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string) => void
}

export function AddSubjectModal({ isOpen, onClose, onAdd }: AddSubjectModalProps) {
  const [subjectName, setSubjectName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subjectName.trim()) {
      onAdd(subjectName.trim())
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
          <DialogTitle className="text-center text-xl font-semibold text-gray-800">Add Subject or Work</DialogTitle>
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
