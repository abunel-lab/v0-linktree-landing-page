import { ArrowRight, Sparkles } from "lucide-react"
import { trackClick } from "@/lib/analytics"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const delay = index === 0 ? "delay-200" : index === 1 ? "delay-300" : "delay-[400ms]"

  return (
    <div className={`w-full opacity-0 animate-fade-in-up ${delay}`}>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(`product_${product.id}`)}
        className="group relative block w-full overflow-hidden rounded-2xl hover-glow"
      >
        <div className="absolute inset-0">
          <img
            src={product.image_url || "/images/product-hero.jpg"}
            alt={product.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative p-6 md:p-8 min-h-[260px] flex flex-col justify-end">
          <div className="glass rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-xs uppercase tracking-widest text-secondary font-semibold">
                Featured
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {product.title}
            </h2>

            {product.description && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-primary font-medium pt-1 text-sm">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}
