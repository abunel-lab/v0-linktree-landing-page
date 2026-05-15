import type { SiteSettings } from "@/lib/types"
import { ImageField } from "@/components/admin/image-field"
import { User } from "lucide-react"

interface ProfileTabProps {
  settings: SiteSettings
  onChange: (field: string, value: string) => void
}

export function ProfileTab({ settings, onChange }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <User className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Profile</h2>
          <p className="text-xs text-muted-foreground">Your public identity</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Display Name</label>
          <input
            type="text"
            value={settings.display_name}
            onChange={(e) => onChange("display_name", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            placeholder="Your display name"
            autoComplete="off"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Bio / Tagline</label>
          <input
            type="text"
            value={settings.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            placeholder="Short tagline shown under your name"
            autoComplete="off"
          />
        </div>

        <ImageField
          label="Profile Photo"
          value={settings.profile_image_url}
          fieldKey="profile_image_url"
          placeholder="https://example.com/photo.jpg"
          hint="Paste a URL or tap the upload icon to choose from your gallery. Photo will be cropped square."
          aspect={1}
          onChange={onChange}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
          <input
            type="tel"
            value={settings.whatsapp_number || ""}
            onChange={(e) => onChange("whatsapp_number", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            placeholder="256709331135"
            inputMode="numeric"
          />
          <p className="text-xs text-muted-foreground">Country code + number, no spaces or + sign. Used for the contact form.</p>
        </div>
      </div>
    </div>
  )
}
