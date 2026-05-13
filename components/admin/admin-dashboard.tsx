"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { SiteSettings } from "@/lib/types"
import {
  User,
  Link,
  FileText,
  LogOut,
  Save,
  Loader2,
  Check,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react"

interface AdminDashboardProps {
  initialSettings: SiteSettings
  userEmail: string
}

export function AdminDashboard({ initialSettings, userEmail }: AdminDashboardProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState<"profile" | "social" | "featured">("profile")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("site_settings")
      .update({
        display_name: settings.display_name,
        bio: settings.bio,
        profile_image_url: settings.profile_image_url,
        featured_title: settings.featured_title,
        featured_description: settings.featured_description,
        featured_url: settings.featured_url,
        featured_image_url: settings.featured_image_url,
        social_x: settings.social_x,
        social_youtube: settings.social_youtube,
        social_tiktok: settings.social_tiktok,
        social_website: settings.social_website,
        social_whatsapp: settings.social_whatsapp,
        social_telegram: settings.social_telegram,
        whatsapp_number: settings.whatsapp_number,
      })
      .eq("id", settings.id)

    setSaving(false)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value || null }))
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "social" as const, label: "Social Links", icon: Link },
    { id: "featured" as const, label: "Featured Card", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <User className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-accent text-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Display Name</label>
                  <input
                    type="text"
                    value={settings.display_name}
                    onChange={(e) => updateField("display_name", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="Your display name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Bio / Tagline</label>
                  <input
                    type="text"
                    value={settings.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="Your tagline"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.profile_image_url || ""}
                    onChange={(e) => updateField("profile_image_url", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a direct link to your profile image (JPG, PNG, WebP)
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    WhatsApp Number (for contact form)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_number || ""}
                    onChange={(e) => updateField("whatsapp_number", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="256709331135 (without + sign)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Country code + number without spaces or special characters
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Social Media Links</h2>
              <p className="text-muted-foreground text-sm">
                Add your social media URLs. Leave blank to hide a link.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">X (Twitter)</label>
                  <input
                    type="url"
                    value={settings.social_x || ""}
                    onChange={(e) => updateField("social_x", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="https://x.com/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">YouTube</label>
                  <input
                    type="url"
                    value={settings.social_youtube || ""}
                    onChange={(e) => updateField("social_youtube", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">TikTok</label>
                  <input
                    type="url"
                    value={settings.social_tiktok || ""}
                    onChange={(e) => updateField("social_tiktok", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="https://tiktok.com/@yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Website</label>
                  <input
                    type="url"
                    value={settings.social_website || ""}
                    onChange={(e) => updateField("social_website", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">WhatsApp</label>
                  <input
                    type="text"
                    value={settings.social_whatsapp || ""}
                    onChange={(e) => updateField("social_whatsapp", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="+256709331135"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Telegram</label>
                  <input
                    type="url"
                    value={settings.social_telegram || ""}
                    onChange={(e) => updateField("social_telegram", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="https://t.me/yourusername"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Featured Card Tab */}
          {activeTab === "featured" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Featured Card Settings</h2>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    type="text"
                    value={settings.featured_title}
                    onChange={(e) => updateField("featured_title", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="Your Product Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={settings.featured_description}
                    onChange={(e) => updateField("featured_description", e.target.value)}
                    rows={3}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                    placeholder="Describe your product or service..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Link URL</label>
                  <input
                    type="url"
                    value={settings.featured_url}
                    onChange={(e) => updateField("featured_url", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="https://yourproduct.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Background Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={settings.featured_image_url || ""}
                    onChange={(e) => updateField("featured_image_url", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="https://example.com/product-image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to use the default gradient background
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-secondary text-background font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
