import { notFound } from "next/navigation"
import { getTranslation } from "@/lib/i18n"
import { VenueDetailsClient } from "./venue-details-client"

const venuesData = [
  {
    id: 1,
    nameKey: "skylinePenthouse" as const,
    locationKey: "vakeTbilisi" as const,
    price: 450,
    guests: 30,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=100",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=100",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=100",
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1200&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=100",
    ],
    description: "Modern penthouse with stunning city views",
    amenities: ["wifi", "kitchen", "heating"],
    premium: true,
  },
  {
    id: 2,
    nameKey: "gardenVilla" as const,
    locationKey: "saburtaloTbilisi" as const,
    price: 680,
    guests: 50,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=100",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=100",
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1200&q=100",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=100",
    ],
    description: "Spacious villa with beautiful garden",
    amenities: ["wifi", "kitchen", "heating"],
    premium: true,
  },
  {
    id: 3,
    nameKey: "rooftopTerrace" as const,
    locationKey: "oldTownTbilisi" as const,
    price: 320,
    guests: 25,
    image: "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1200&q=100",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1200&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=100",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=100",
    ],
    description: "Charming rooftop with panoramic views",
    amenities: ["wifi", "kitchen", "heating"],
    premium: false,
  },
  {
    id: 4,
    nameKey: "loftStudio" as const,
    locationKey: "veraTbilisi" as const,
    price: 280,
    guests: 20,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=100",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=100",
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1200&q=100",
    ],
    description: "Contemporary loft space with industrial design",
    amenities: ["wifi", "kitchen", "heating"],
    premium: false,
  },
  {
    id: 5,
    nameKey: "seasideVilla" as const,
    locationKey: "batumi" as const,
    price: 890,
    guests: 60,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=100",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=100",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=100",
      "https://images.unsplash.com/photo-1600607687939-ce6161a56a0c?w=1200&q=100",
    ],
    description: "Luxury seaside villa with private beach access",
    amenities: ["wifi", "kitchen", "heating"],
    premium: true,
  },
  {
    id: 6,
    nameKey: "mountainRetreat" as const,
    locationKey: "borjomi" as const,
    price: 520,
    guests: 35,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=100",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=100",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=100",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=100",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=100",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=100",
    ],
    description: "Peaceful mountain retreat surrounded by nature",
    amenities: ["wifi", "kitchen", "heating"],
    premium: false,
  },
]

export function generateStaticParams() {
  return venuesData.map((venue) => ({
    id: String(venue.id),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const venue = venuesData.find((v) => v.id === parseInt(id))

  if (!venue) {
    return { title: "Venue Not Found" }
  }

  const t = getTranslation("en")
  return {
    title: `${t.venueData[venue.nameKey]} - PartySpace`,
    description: venue.description,
  }
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const venueId = parseInt(id)
  const venue = venuesData.find((v) => v.id === venueId)

  if (!venue) {
    notFound()
  }

  return <VenueDetailsClient venue={venue} />
}
