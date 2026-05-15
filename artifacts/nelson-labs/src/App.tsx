import { Switch, Route, Router as WouterRouter } from "wouter"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import HomePage from "@/pages/home"
import AdminPage from "@/pages/admin"
import AdminLoginPage from "@/pages/admin-login"
import NotFound from "@/pages/not-found"

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  )
}

export default App
