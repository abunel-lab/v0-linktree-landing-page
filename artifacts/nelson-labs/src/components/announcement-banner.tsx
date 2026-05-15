import { useState, useEffect } from "react"
import { X, Megaphone } from "lucide-react"

interface AnnouncementBannerProps {
  text: string
  active: boolean
}

const STORAGE_KEY = "announcement_dismissed"

export function AnnouncementBanner({ text, active }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === text
    setDismissed(wasDismissed)
    setReady(true)
  }, [text])

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, text)
    setDismissed(true)
  }

  if (!active || !text || dismissed || !ready) return null

  return (
    <div className="w-full animate-slide-down">
      <div
        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium"
        style={{
          background: "linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)",
          color: "var(--primary-foreground)",
        }}
      >
        <Megaphone className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-center text-sm font-semibold">{text}</span>
        <button
          onClick={dismiss}
          className="shrink-0 opacity-80 hover:opacity-100 transition-opacity p-0.5 rounded"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
