"use client"

import { Menu, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopNavigationProps {
  onMenuClick: () => void
  selectionMode?: boolean
  selectedCount?: number
  onExitSelection?: () => void
}

export function TopNavigation({
  onMenuClick,
  selectionMode = false,
  selectedCount = 0,
  onExitSelection,
}: TopNavigationProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={selectionMode ? onExitSelection : onMenuClick}
          className="text-gray-600 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="text-center">
          {selectionMode ? (
            <span className="text-lg font-semibold text-gray-800">{selectedCount} Selected</span>
          ) : (
            <h1 className="text-lg font-semibold text-blue-600">Self Attendance</h1>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
