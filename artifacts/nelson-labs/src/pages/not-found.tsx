import { AlertCircle } from "lucide-react"
import { Link } from "wouter"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">404 — Not Found</h1>
        <p className="text-muted-foreground text-sm">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="inline-block text-accent hover:underline text-sm">
          Back to home
        </Link>
      </div>
    </div>
  )
}
