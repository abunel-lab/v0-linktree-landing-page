import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { SiteSettings } from "@/lib/types"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single()

  return <AdminDashboard initialSettings={settings as SiteSettings} userEmail={user.email || ""} />
}
