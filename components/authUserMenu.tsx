"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, User } from "lucide-react"
import { ProfileModal } from "@/components/profileModal"
import { AdminSettingsModal } from "@/components/adminSettingsModal"

interface AuthUserMenuProps {
  variant?: "mobile" | "desktop"
}

export function AuthUserMenu({ variant = "desktop" }: AuthUserMenuProps) {
  const { user, userProfile, logout, isAdmin } = useAuth()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!user) return null

  const displayName = userProfile?.displayName || user.email?.split("@")[0] || "User"
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const handleOpenProfile = () => {
    setIsProfileModalOpen(true)
    setIsDropdownOpen(false)
  }

  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true)
    setIsDropdownOpen(false)
  }

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group transition-all duration-300 hover:scale-110 cursor-pointer hover:cursor-pointer">
            <Avatar className="h-12 w-12 cursor-pointer hover:shadow-lg transition-all duration-300 group-hover:ring-2 group-hover:ring-accent/50">
              <AvatarImage src={userProfile?.photoURL || undefined} alt={displayName} />
              <AvatarFallback className="bg-accent text-white font-bold text-base hover:bg-accent/90 transition-colors duration-300">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" sideOffset={8} className="w-64 mt-4">
          <DropdownMenuLabel className="flex flex-col gap-2 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userProfile?.photoURL || undefined} alt={displayName} />
                <AvatarFallback className="bg-accent text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-bold text-foreground truncate">{displayName}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenProfile} className="flex items-center gap-3 cursor-pointer py-2">
            <User className="w-4 h-4" />
            <span className="text-sm">My Profile</span>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={handleOpenSettings} className="flex items-center gap-3 cursor-pointer py-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            variant="destructive"
            className="flex items-center gap-3 cursor-pointer py-2 font-medium group"
          >
            <LogOut className="w-4 h-4 group-hover:text-white transition-colors" />
            <span className="text-sm">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <AdminSettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  )
}
