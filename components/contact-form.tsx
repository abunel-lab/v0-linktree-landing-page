"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export function ContactForm() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setName("")
    setMessage("")
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="w-full opacity-0 animate-fade-in-up delay-300">
      <div className="glass rounded-2xl p-6 md:p-8 space-y-5">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            {"Want a commission? Reach out!"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {"I'd love to hear from you"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs text-muted-foreground uppercase tracking-wide">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-xs text-muted-foreground uppercase tracking-wide">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || submitted}
            className="w-full py-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-base hover-glow-teal disabled:opacity-70 transition-all duration-300"
          >
            {submitted ? (
              "Message Sent!"
            ) : isSubmitting ? (
              "Sending..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                Send
                <Send className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
