import Navbar from "../_components/layout/navbar"
import Footer from "../_components/layout/footer"
import Dashboard from "../_dashboard/dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={true} />
      <Dashboard />
      <Footer />
    </div>
  )
}
