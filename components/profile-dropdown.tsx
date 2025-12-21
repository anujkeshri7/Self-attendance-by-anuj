"use client"

import { useState, useRef, useEffect } from "react"
import { User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDemoUser, demoSignOut } from "@/lib/demo-auth"
import { useRouter } from "next/navigation"

interface ProfileDropdownProps {
  onProfileClick: () => void
  onSettingsClick: () => void
}

export function ProfileDropdown({ onProfileClick, onSettingsClick }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const demoUser = getDemoUser()
    if (demoUser) {
      setUser({
        email: demoUser.email,
        name: demoUser.name,
      })
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    demoSignOut()
    router.push("/auth/login")
  }

  const getInitials = () => {
    if (user?.name) {
      return user.name.slice(0, 2).toUpperCase()
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U"
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="profile-avatar w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-90 p-0"
      >
        <span className="text-xs font-semibold">{getInitials()}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[10rem] sm:w-48 bg-background rounded-lg shadow-lg border border-border py-2 z-50">
          {/* User info */}
          <div className="px-3 py-2 border-b border-border">
            <p className="font-medium text-foreground text-sm truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>

          {/* Menu items */}
          <button
            onClick={() => {
              onProfileClick()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <User className="w-4 h-4" />
            My Profile
          </button>

          <button
            onClick={() => {
              onSettingsClick()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
