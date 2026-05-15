import type { SocialLink } from "@/lib/types"
import { getPlatformIcon } from "@/lib/platforms"
import { trackClick } from "@/lib/analytics"

interface SocialIconsProps {
  links: SocialLink[]
}

export function SocialIcons({ links }: SocialIconsProps) {
  const active = links.filter((l) => l.active).sort((a, b) => a.position - b.position)
  if (active.length === 0) return null

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap opacity-0 animate-fade-in-up delay-100">
      {active.map((link) => {
        const Icon = getPlatformIcon(link.platform)
        const href =
          link.platform === "whatsapp"
            ? `https://wa.me/${link.url.replace(/[^0-9]/g, "")}`
            : link.url

        return (
          <a
            key={link.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(link.platform)}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
            aria-label={link.label}
            title={link.label}
          >
            <Icon className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}
