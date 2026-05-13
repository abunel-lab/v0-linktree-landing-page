"use client"

import Image from "next/image"

export function ProfileHeader() {
  return (
    <div className="flex flex-col items-center gap-4 opacity-0 animate-fade-in-up">
      {/* Profile Picture */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-75 blur-sm" />
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/50">
          <Image
            src="/images/profile.jpg"
            alt="Profile picture"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Username with decorative stars */}
      <div className="flex items-center gap-2">
        <span className="text-secondary text-xl">&#10022;</span>
        <h1 className="text-3xl md:text-4xl font-black tracking-wider text-primary uppercase">
          Nelson_Labs
        </h1>
        <span className="text-secondary text-xl">&#10022;</span>
      </div>

      {/* Bio */}
      <p className="text-muted-foreground text-center text-lg max-w-xs">
        Building the future of trading
      </p>
    </div>
  )
}
