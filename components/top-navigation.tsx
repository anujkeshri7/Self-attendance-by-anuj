"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { ProfileModal } from "@/components/profile-modal"
import { SettingsModal } from "@/components/settings-modal"

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
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  return (
    <>
      <header className="bg-background border-b border-border px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={selectionMode ? onExitSelection : onMenuClick}
            className="text-muted-foreground hover:bg-muted"
          >
            {selectionMode ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="text-center">
            {selectionMode ? (
              <span className="text-lg font-semibold text-foreground">{selectedCount} Selected</span>
            ) : (
              <h1 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Self Tracker</h1>
            )}
          </div>

          <ProfileDropdown
            onProfileClick={() => setShowProfileModal(true)}
            onSettingsClick={() => setShowSettingsModal(true)}
          />
        </div>
      </header>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </>
  )
}
