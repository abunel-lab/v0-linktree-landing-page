import { ProfileHeader } from "@/components/profile-header"
import { SocialIcons } from "@/components/social-icons"
import { FeaturedCard } from "@/components/featured-card"
import { ContactForm } from "@/components/contact-form"

export default function LinkInBioPage() {
  return (
    <>
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />
      
      {/* Background gradient */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at top, oklch(0.18 0.03 250) 0%, oklch(0.12 0.02 250) 50%, oklch(0.08 0.015 250) 100%)"
        }}
        aria-hidden="true"
      />

      <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Social Icons */}
          <SocialIcons />

          {/* Featured Card */}
          <FeaturedCard />

          {/* Contact Form */}
          <ContactForm />

          {/* Footer */}
          <footer className="text-center pt-4 opacity-0 animate-fade-in delay-500">
            <p className="text-xs text-muted-foreground/60">
              Powered by passion
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
