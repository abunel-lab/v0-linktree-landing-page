import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLocation } from "wouter"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { SiteSettings } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [, setLocation] = useLocation()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLocation("/admin/login")
        return
      }

      setUserEmail(user.email || "")

      supabase
        .from("site_settings")
        .select("*")
        .single()
        .then(({ data }) => {
          if (data) setSettings(data as SiteSettings)
          setLoading(false)
        })
    })
  }, [setLocation])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No settings found.</p>
      </div>
    )
  }

  return <AdminDashboard initialSettings={settings} userEmail={userEmail} />
}
