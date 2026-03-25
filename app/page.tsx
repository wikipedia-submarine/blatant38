import { Header } from "@/components/header"
import { HeroSection } from "@/components/heroSection"
import { Footer } from "@/components/footer"
import { FeaturedVenues } from "@/components/featuredVenues"
import { Testimonials } from "@/components/testimonials"
import { HomeClient } from "@/components/homeClient"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <Header />
      <div className="h-4" />
      <HeroSection />
      <FeaturedVenues />
      <Testimonials />
      <Footer />
    </main>
  )
}
