"use client"

import { Trash2, Edit, Archive, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SelectionModeProps {
  selectedCount: number
  onDelete: () => void
  onExit: () => void
}

export function SelectionMode({ selectedCount, onDelete, onExit }: SelectionModeProps) {
  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-sm text-red-700 font-medium">
          {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
        </span>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
            <Users className="w-4 h-4 mr-1" />
            Group
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
          <Button size="sm" variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50">
            <Edit className="w-4 h-4 mr-1" />
            Rename
          </Button>
          <Button size="sm" variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50">
            <Archive className="w-4 h-4 mr-1" />
            Archive
          </Button>
        </div>
      </div>
    </div>
  )
}
