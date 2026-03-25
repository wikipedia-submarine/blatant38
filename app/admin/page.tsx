"use client"

import { useAuth } from "@/lib/auth-context"
import { useAdminView } from "@/lib/admin-context"
import Link from "next/link"
import { ArrowLeft, Users, Building2, BarChart3, Settings } from "lucide-react"

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const { isAdminView } = useAdminView()

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">You don't have permission to access the admin panel.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform, users, and venues</p>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to App</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AdminCard
            title="Total Users"
            value="2"
            description="Active users"
            icon={<Users className="w-8 h-8" />}
            color="bg-blue-500"
          />
          <AdminCard
            title="Total Venues"
            value="5"
            description="Listed venues"
            icon={<Building2 className="w-8 h-8" />}
            color="bg-green-500"
          />
          <AdminCard
            title="Total Bookings"
            value="0"
            description="This month"
            icon={<BarChart3 className="w-8 h-8" />}
            color="bg-purple-500"
          />
          <AdminCard
            title="Admin Users"
            value="1"
            description="Platform admins"
            icon={<Settings className="w-8 h-8" />}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Users</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <p className="font-semibold text-foreground">jVy9P9PaBMhZNCiOU89BoclQmqf1</p>
                <p className="text-sm text-muted-foreground mt-1">Admin User</p>
                <span className="inline-block mt-2 px-3 py-1 bg-red-500/20 text-red-700 text-xs font-semibold rounded-full">Admin</span>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <p className="font-semibold text-foreground">Z7spj3PqYzV9Bvh75wLQ3HSDKEU2</p>
                <p className="text-sm text-muted-foreground mt-1">Regular User</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-700 text-xs font-semibold rounded-full">User</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors font-semibold">
                Manage Users
              </button>
              <button className="w-full px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-semibold text-foreground">
                View Venues
              </button>
              <button className="w-full px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-semibold text-foreground">
                View Bookings
              </button>
              <button className="w-full px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-semibold text-foreground">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AdminCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  color: string
}

function AdminCard({ title, value, description, icon, color }: AdminCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
