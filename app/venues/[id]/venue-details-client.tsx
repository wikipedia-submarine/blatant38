"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Users, Zap, Wifi, UtensilsCrossed, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/languageSwitcher"

const AMENITIES_MAP = {
  wifi: { icon: Wifi, label: "WiFi" },
  kitchen: { icon: UtensilsCrossed, label: "Kitchen" },
  heating: { icon: Zap, label: "Heating" },
}

const REVIEWS = [
  { name: "Sarah M.", rating: 5, text: "magari adgilia dzaan! dzaan magaria", date: "2 weeks ago" },
  { name: "John D.", rating: 5, text: "magari adgilia dzaan! dzaan magaria", date: "1 month ago" },
  { name: "Emma T.", rating: 4, text: "magari adgilia dzaan! dzaan magaria", date: "2 months ago" },
  { name: "Michael R.", rating: 5, text: "magari adgilia dzaan! dzaan magaria", date: "3 months ago" },
  { name: "Lisa K.", rating: 5, text: "magari adgilia dzaan! dzaan magaria", date: "3 months ago" },
  { name: "James B.", rating: 4, text: "magari adgilia dzaan! dzaan magaria", date: "4 months ago" },
  { name: "Rachel G.", rating: 5, text: "magari adgilia dzaan! dzaan magaria", date: "4 months ago" },
  { name: "David L.", rating: 5, text: "magari adgilia dzaan! dzaan magaria", date: "5 months ago" },
]

interface Venue {
  id: number
  nameKey: "skylinePenthouse" | "gardenVilla" | "rooftopTerrace" | "loftStudio" | "seasideVilla" | "mountainRetreat"
  locationKey: "vakeTbilisi" | "saburtaloTbilisi" | "oldTownTbilisi" | "veraTbilisi" | "batumi" | "borjomi"
  price: number
  guests: number
  image: string
  images?: string[]
  description: string
  amenities: string[]
  premium?: boolean
}

interface Props {
  venue: Venue
}

const Wave = () => (
  <svg viewBox="0 0 1200 80" preserveAspectRatio="none" fill="currentColor">
    <path d="M0,20 C150,40 350,25 550,35 C750,45 950,20 1200,35 L1200,0 L0,0 Z" opacity="0.3" />
    <path d="M0,10 C300,50 600,10 900,40 C1050,55 1150,35 1200,45 L1200,0 L0,0 Z" opacity="0.5" />
    <path d="M0,0 C200,40 400,15 600,35 C800,55 1000,20 1200,40 L1200,0 L0,0 Z" opacity="1" />
  </svg>
)

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-apple-yellow text-apple-yellow" : "text-border"}`}
      />
    ))}
  </div>
)

const SaveButton = ({ isFavorite, showCheckmark, onClick }: {
  isFavorite: boolean
  showCheckmark: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="w-full py-3 px-6 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-border/40 hover:border-accent/40 text-foreground font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group/fav hover:text-accent h-11"
  >
    <div className="relative w-5 h-5">
      {isFavorite ? (
        <svg viewBox="0 0 24 24" className={`w-5 h-5 absolute ${showCheckmark ? 'animate-checkmark' : ''}`} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 214, 10, 0.6))' }}>
          <circle cx="12" cy="12" r="10" fill="none" stroke="#ffd60a" strokeWidth="2" opacity="0.3" />
          <path d="M 8 12 L 11 15 L 16 9" stroke="#ffd60a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10" className={showCheckmark ? 'animate-checkmark' : ''} />
        </svg>
      ) : (
        <Heart className="w-5 h-5 transition-all duration-300 group-hover/fav:text-accent" />
      )}
    </div>
    {isFavorite ? "Saved" : "Save for later"}
  </button>
)

const AmenityCard = ({ amenity, index }: { amenity: string; index: number }) => {
  const data = AMENITIES_MAP[amenity as keyof typeof AMENITIES_MAP]
  if (!data) return null

  const Icon = typeof data.icon === "string" ? null : data.icon

  return (
    <div key={amenity} className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-border/30 hover:border-accent/40 transition-all duration-300 group/amenity cursor-default hover:shadow-md" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="p-3 rounded-full bg-accent/10 group-hover/amenity:bg-accent/20 group-hover/amenity:scale-110 transition-all duration-300">
        {Icon ? <Icon className="w-6 h-6 text-accent" /> : <span className="text-2xl">{data.icon}</span>}
      </div>
      <span className="text-foreground font-semibold text-sm text-center group-hover/amenity:text-accent transition-colors duration-300">{data.label}</span>
    </div>
  )
}

const ReviewCard = ({ review }: { review: typeof REVIEWS[0] }) => (
  <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-border/30 hover:border-accent/40 transition-all duration-300 min-h-[160px] flex flex-col justify-between">
    <div>
      <div className="flex items-start justify-between mb-3">
        <div className="font-semibold text-foreground">{review.name}</div>
        <span className="text-xs text-muted-foreground">{review.date}</span>
      </div>
      <StarRating rating={review.rating} />
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed italic">&quot;{review.text}&quot;</p>
  </div>
)

export function VenueDetailsClient({ venue }: Props) {
  const { t } = useLanguage()
  const images = venue.images || [venue.image]

  const [imageIdx, setImageIdx] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [reviewIdx, setReviewIdx] = useState(0)

  const currentImage = images[imageIdx]
  const review = REVIEWS[reviewIdx]
  const canScrollLeft = reviewIdx > 0
  const canScrollRight = reviewIdx < REVIEWS.length - 1

  const handleSave = () => {
    setIsFavorite(!isFavorite)
    if (!isFavorite) {
      setShowCheckmark(true)
      setTimeout(() => setShowCheckmark(false), 600)
    }
  }

  const changeImage = (direction: -1 | 1) => {
    setImageIdx((idx) => (idx + direction + images.length) % images.length)
  }

  const changeReview = (direction: -1 | 1) => {
    setReviewIdx((idx) => Math.max(0, Math.min(REVIEWS.length - 1, idx + direction)))
  }

  return (
    <main className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 md:h-52 lg:h-64 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 sm:-top-20 md:-top-28 lg:-top-36 left-0 right-0 h-32 sm:h-40 md:h-52 lg:h-64" style={{ background: "linear-gradient(180deg, transparent 0%, var(--background) 100%)", filter: "blur(24px)" }} />
        <div className="absolute -top-1 left-0 w-full h-20 sm:h-28 md:h-40 lg:h-52 text-foreground/5">
          <Wave />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 md:w-[500px] h-96 md:h-[500px] bg-gradient-to-br from-apple-blue/20 md:from-apple-blue/15 via-apple-blue/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 md:w-96 h-80 md:h-96 bg-gradient-to-br from-apple-green/15 md:from-apple-green/10 via-apple-green/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-br from-apple-yellow/10 to-transparent rounded-full blur-3xl" />
      </div>


      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-24 relative">
          <div className="absolute top-20 sm:top-24 md:top-28 left-6 right-6 z-20 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/90 text-background hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold hover:bg-foreground backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5" />
              Back to venues
            </Link>
            <LanguageSwitcher variant="light" />
          </div>

        <div className="lg:col-span-2">
          <div className="space-y-8">
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-border/20 shadow-md hover:shadow-lg transition-all duration-500 animate-fade-up">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image src={currentImage} alt={t.venueData[venue.nameKey]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>

              <button onClick={() => changeImage(-1)} className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/25 hover:bg-white/40 text-white transition-all duration-300 z-10 items-center justify-center backdrop-blur-sm border border-white/40 hover:scale-110 cursor-pointer flex">
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button onClick={() => changeImage(1)} className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/25 hover:bg-white/40 text-white transition-all duration-300 z-10 items-center justify-center backdrop-blur-sm border border-white/40 hover:scale-110 cursor-pointer flex">
                <ChevronRight className="w-7 h-7" />
              </button>

              <button onClick={() => changeImage(-1)} className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white/25 hover:bg-white/40 text-white transition-all duration-300 z-10 items-center justify-center backdrop-blur-sm border border-white/40 hover:scale-110 cursor-pointer hover:cursor-pointer">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button onClick={() => changeImage(1)} className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white/25 hover:bg-white/40 text-white transition-all duration-300 z-10 items-center justify-center backdrop-blur-sm border border-white/40 hover:scale-110 cursor-pointer hover:cursor-pointer">
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-4 animate-fade-up">
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">{t.venueData[venue.nameKey]}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300 group cursor-default">
                  <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-lg font-medium">{t.venueData[venue.locationKey]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={5} />
                  <span className="text-sm font-semibold text-foreground">4.9</span>
                  <span className="text-sm text-muted-foreground">(128 reviews)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border/20 shadow-sm hover:shadow-md transition-all duration-500 space-y-3 animate-fade-up">
              <h2 className="text-xl font-bold text-foreground">About this space</h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{venue.description}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border/20 shadow-sm hover:shadow-md transition-all duration-500 space-y-4 animate-fade-up">
              <h2 className="text-xl font-bold text-foreground">Amenities</h2>
              <div className="grid grid-cols-3 gap-3">
                {venue.amenities.map((amenity, i) => <AmenityCard key={amenity} amenity={amenity} index={i} />)}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border/20 shadow-sm hover:shadow-md transition-all duration-500 space-y-4 animate-fade-up">
              <h2 className="text-xl font-bold text-foreground">Location</h2>
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-2xl border border-border/30 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 transition-all duration-300">
                    <MapPin className="w-10 h-10 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Location Map</h3>
                    <p className="text-muted-foreground transition-colors duration-300">Google Maps integration coming soon</p>
                  </div>
                  <p className="text-sm font-medium text-accent">{t.venueData[venue.locationKey]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:col-span-1 sticky top-24 h-fit">
          <div className="w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border/20 shadow-md hover:shadow-lg transition-all duration-500 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest">Instant booking</p>
              <h3 className="text-2xl font-extrabold text-foreground">Ready to book?</h3>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-accent/20 hover:border-accent/40 space-y-3 transition-all duration-300">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground">${venue.price}</span>
                <span className="text-muted-foreground font-semibold">/night</span>
              </div>
              <p className="text-sm text-muted-foreground">Average price per night</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-border/40 hover:border-accent/40 flex items-center gap-3 transition-all duration-300">
              <div className="p-2 rounded-full bg-accent/10">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <span className="text-foreground font-medium">Up to {venue.guests} guests</span>
            </div>

            <SaveButton isFavorite={isFavorite} showCheckmark={showCheckmark} onClick={handleSave} />

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <button className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-accent to-blue-600 text-white font-bold text-lg cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-lg">
              Book Now
            </button>

            <p className="text-xs text-muted-foreground text-center">You won't be charged yet</p>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Guest Reviews</h3>
                <span className="text-xs text-muted-foreground font-semibold">{reviewIdx + 1} of {REVIEWS.length}</span>
              </div>

              <div className="relative">
                <ReviewCard review={review} />

                <button onClick={() => changeReview(-1)} disabled={!canScrollLeft} className="absolute -left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-accent/10 hover:bg-accent/20 disabled:opacity-30 disabled:cursor-not-allowed text-accent transition-all duration-300 hover:scale-110">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => changeReview(1)} disabled={!canScrollRight} className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-accent/10 hover:bg-accent/20 disabled:opacity-30 disabled:cursor-not-allowed text-accent transition-all duration-300 hover:scale-110">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center gap-1.5">
                {REVIEWS.map((_, i) => (
                  <button key={i} onClick={() => setReviewIdx(i)} className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === reviewIdx ? 'bg-accent w-6' : 'bg-border/50 w-2 hover:bg-border'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-xl border-t border-border/20 shadow-2xl">
        <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white font-bold text-base cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-lg">
          Book Now - ${venue.price}/night
        </button>
      </div>

    </main>
  )
}
