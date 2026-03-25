'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { MapPin, Users, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/languageSwitcher"

interface Venue {
  id: number
  nameKey: string
  locationKey: string
  price: number
  guests: number
  image: string
  images: string[]
  description: string
  amenities: string[]
  location: string
  premium?: boolean
}

interface Props {
  venuesData: Venue[]
}

export default function BrowseClient({ venuesData }: Props) {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [filtered, setFiltered] = useState(venuesData)

  useEffect(() => {
    const location = searchParams.get("location")
    const guests = searchParams.get("guests")

    let result = venuesData

    if (location) {
      result = result.filter((v) => v.location === location)
    }

    if (guests) {
      const minGuests = { "1-10": 1, "11-25": 11, "26-50": 26 }[guests] || 50
      result = result.filter((v) => v.guests >= minGuests)
    }

    setFiltered(result)
  }, [searchParams, venuesData])

  return (
    <div className="pt-56 sm:pt-64 md:pt-72 lg:pt-80 px-6 pb-12 relative">
      <div className="absolute top-20 sm:top-24 md:top-28 left-6 right-6 z-20 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/90 text-background hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold hover:bg-foreground backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
        <LanguageSwitcher variant="light" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Available Venues
          </h2>
          <p className="text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "venue" : "venues"} found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-6">
              No venues match your search criteria
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              Try different filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((venue) => (
              <Link key={venue.id} href={`/venues/${venue.id}`} className="group bg-card rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border/50 cursor-pointer max-w-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image src={venue.image} alt={t.venueData[venue.nameKey]} fill className="object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {t.venueData[venue.nameKey]}
                  </h3>

                  <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t.venueData[venue.locationKey]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Up to {venue.guests} guests
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold text-foreground">
                        ${venue.price}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium block">
                        /night
                      </span>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 px-6 rounded-2xl border border-border text-foreground font-semibold cursor-pointer transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-lg hover:scale-105">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
