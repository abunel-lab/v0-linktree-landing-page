import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLocation } from "wouter"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { SiteSettings, SocialLink, Product } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [, setLocation] = useLocation()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLocation("/admin/login")
        return
      }

      setUserEmail(user.email || "")

      const [settingsRes, socialRes, productsRes] = await Promise.allSettled([
        supabase.from("site_settings").select("*").single(),
        supabase.from("social_links").select("*").order("position"),
        supabase.from("products").select("*").order("position"),
      ])

      if (settingsRes.status === "fulfilled" && settingsRes.value.data)
        setSettings(settingsRes.value.data as SiteSettings)
      if (socialRes.status === "fulfilled" && socialRes.value.data)
        setSocialLinks(socialRes.value.data as SocialLink[])
      if (productsRes.status === "fulfilled" && productsRes.value.data)
        setProducts(productsRes.value.data as Product[])

      setLoading(false)
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

  return (
    <AdminDashboard
      initialSettings={settings}
      initialSocialLinks={socialLinks}
      initialProducts={products}
      userEmail={userEmail}
    />
  )
}
