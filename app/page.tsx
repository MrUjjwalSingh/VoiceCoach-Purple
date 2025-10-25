import Navbar from "./_components/layout/navbar"
import Footer from "./_components/layout/footer"
import LandingPage from "./_landing_page/landing-page"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={false} />
      <LandingPage />
      <Footer />
    </div>
  )
}
