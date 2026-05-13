"use client"

import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export function FeaturedCard() {
  return (
    <div className="w-full opacity-0 animate-fade-in-up delay-200">
      <a
        href="#"
        className="group relative block w-full overflow-hidden rounded-2xl hover-glow-teal"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/product-hero.jpg"
            alt="Product showcase"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Glassmorphism Content Overlay */}
        <div className="relative p-6 md:p-8 min-h-[280px] flex flex-col justify-end">
          <div className="glass rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-xs uppercase tracking-widest text-secondary font-semibold">
                Featured Launch
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Next-Gen Trading Platform
            </h2>
            
            <p className="text-muted-foreground text-sm md:text-base">
              Automated strategies powered by AI. Join thousands of traders maximizing their potential.
            </p>
            
            <div className="flex items-center gap-2 text-primary font-medium pt-2">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}
