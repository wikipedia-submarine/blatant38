import { Suspense } from "react"
import { LanguageSwitcher } from "@/components/languageSwitcher"
import BrowseClient from "./BrowseClient"

const venuesData = [
  {
    id: 1,
    nameKey: "skylinePenthouse" as const,
    locationKey: "vakeTbilisi" as const,
    price: 450,
    guests: 30,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=100",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=100",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=100",
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1600&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=100",
    ],
    description: "Luxury penthouse with city views",
    amenities: ["wifi", "kitchen", "heating"],
    location: "Vake, Tbilisi",
    premium: true,
  },
  {
    id: 2,
    nameKey: "gardenVilla" as const,
    locationKey: "saburtaloTbilisi" as const,
    price: 680,
    guests: 50,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=100",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=100",
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1600&q=100",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=100",
    ],
    description: "Beautiful garden villa with spacious grounds",
    amenities: ["wifi", "kitchen"],
    location: "Saburtalo, Tbilisi",
    premium: true,
  },
  {
    id: 3,
    nameKey: "rooftopTerrace" as const,
    locationKey: "oldTownTbilisi" as const,
    price: 320,
    guests: 25,
    image: "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1600&q=100",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1600&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=100",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=100",
    ],
    description: "Charming rooftop terrace in historic old town",
    amenities: ["wifi", "heating"],
    location: "Old Town, Tbilisi",
    premium: false,
  },
  {
    id: 4,
    nameKey: "loftStudio" as const,
    locationKey: "veraTbilisi" as const,
    price: 280,
    guests: 20,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=100",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=100",
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1600&q=100",
    ],
    description: "Modern loft studio with contemporary design",
    amenities: ["wifi", "kitchen", "heating"],
    location: "Vera, Tbilisi",
    premium: false,
  },
  {
    id: 5,
    nameKey: "seasideVilla" as const,
    locationKey: "batumi" as const,
    price: 890,
    guests: 60,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=100",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=100",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=100",
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1600&q=100",
    ],
    description: "Luxurious seaside villa with beach access",
    amenities: ["wifi", "kitchen"],
    location: "Batumi",
    premium: true,
  },
  {
    id: 6,
    nameKey: "mountainRetreat" as const,
    locationKey: "borjomi" as const,
    price: 520,
    guests: 35,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=100",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=100",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=100",
    ],
    description: "Peaceful mountain retreat surrounded by nature",
    amenities: ["wifi", "heating"],
    location: "Borjomi",
    premium: false,
  },
]

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Wave decoration at top */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 md:h-52 lg:h-64 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-16 sm:-top-20 md:-top-28 lg:-top-36 left-0 right-0 h-32 sm:h-40 md:h-52 lg:h-64"
          style={{
            background: "linear-gradient(180deg, transparent 0%, var(--background) 100%)",
            filter: "blur(24px)",
          }}
        />
        <div className="absolute -top-1 left-0 w-full h-20 sm:h-28 md:h-40 lg:h-52 text-foreground/5">
          <svg
            className="absolute -bottom-1 left-0 w-full h-20 sm:h-28 md:h-40 lg:h-52"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,20 C150,40 350,25 550,35 C750,45 950,20 1200,35 L1200,0 L0,0 Z" opacity="0.3" />
            <path d="M0,10 C300,50 600,10 900,40 C1050,55 1150,35 1200,45 L1200,0 L0,0 Z" opacity="0.5" />
            <path d="M0,0 C200,40 400,15 600,35 C800,55 1000,20 1200,40 L1200,0 L0,0 Z" opacity="1" />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 md:w-[500px] h-96 md:h-[500px] bg-gradient-to-br from-apple-blue/20 md:from-apple-blue/15 via-apple-blue/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 md:w-96 h-80 md:h-96 bg-gradient-to-br from-apple-green/15 md:from-apple-green/10 via-apple-green/5 to-transparent rounded-full blur-3xl" />

        {/* Gray-to-white gradient frame on right side */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[600px] md:w-[900px] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.15) 100%)",
            filter: "blur(40px)",
          }}
        />
      </div>


      <Suspense fallback={<div className="pt-24 px-6">Loading venues...</div>}>
        <BrowseClient venuesData={venuesData} />
      </Suspense>
    </main>
  )
}
