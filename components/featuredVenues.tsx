"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, ChevronLeft, ChevronRight, Search, Star } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { ScrollReveal } from "./scrollReveal"
import { useScrollScale } from "@/hooks/useScrollScale"
import DrawArrows from "./DrawArrows"
import "./featured-venues.css"

type VenueCategory = "all" | "apartments" | "villas" | "rooftops" | "studios"

interface Venue {
  id: number
  nameKey: string
  locationKey: string
  price: number
  guests: number
  image: string
  images: string[]
  rating: number
  reviews: number
  category: Exclude<VenueCategory, "all">
  isPopular?: boolean
}

const venues: Venue[] = [
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
    rating: 4.8,
    reviews: 142,
    category: "rooftops",
    isPopular: true,
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
    rating: 4.9,
    reviews: 189,
    category: "villas",
    isPopular: true,
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
    rating: 4.6,
    reviews: 98,
    category: "studios",
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
    rating: 4.7,
    reviews: 156,
    category: "villas",
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
    rating: 4.5,
    reviews: 67,
    category: "apartments",
  },
]

const categories: { value: VenueCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "apartments", label: "Apartments" },
  { value: "villas", label: "Villas" },
  { value: "rooftops", label: "Rooftops" },
  { value: "studios", label: "Studios" },
]

export function FeaturedVenues() {
  const { t } = useLanguage()
  const { ref: headingRef, scale } = useScrollScale({ minScale: 0.95, maxScale: 1.05 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [desktopIndex, setDesktopIndex] = useState(0)
  const desktopSliderRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<VenueCategory>("all")
  const [visibleCardIds, setVisibleCardIds] = useState<Set<number>>(new Set())
  const [isFiltering, setIsFiltering] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 })
  const filterContainerRef = useRef<HTMLDivElement>(null)
  const cardsPerView = 3 // Show 3 cards at a time on desktop

  const filteredVenues = activeCategory === "all" ? venues : venues.filter(v => v.category === activeCategory)

  const handleCategoryChange = (category: VenueCategory) => {
    setIsFiltering(true)
    setActiveCategory(category)
    setDesktopIndex(0)
    setCurrentIndex(0)
    setTimeout(() => setIsFiltering(false), 600)
  }

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.getAttribute("data-venue-id") || "0")
          setVisibleCardIds((prev) => new Set([...prev, id]))
        }
      })
    }, observerOptions)

    const cardElements = document.querySelectorAll("[data-venue-id]")
    cardElements.forEach((el) => observer.observe(el))

    return () => {
      cardElements.forEach((el) => observer.unobserve(el))
    }
  }, [filteredVenues])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (filterContainerRef.current) {
      const activeButton = filterContainerRef.current.querySelector('[data-active="true"]') as HTMLElement
      if (activeButton) {
        const { offsetWidth, offsetLeft } = activeButton
        setIndicatorStyle({ width: offsetWidth, left: offsetLeft })
      }
    }
  }, [activeCategory])

  const handleScroll = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.scrollWidth / venues.length
      const newIndex = Math.round(sliderRef.current.scrollLeft / cardWidth)
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    }
  }

  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.scrollWidth / venues.length
      sliderRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  const scrollDesktopToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, venues.length - cardsPerView))
    setDesktopIndex(clampedIndex)
    if (desktopSliderRef.current) {
      const cardWidth = desktopSliderRef.current.scrollWidth / venues.length
      desktopSliderRef.current.scrollTo({
        left: cardWidth * clampedIndex,
        behavior: "smooth",
      })
    }
  }

  const handleDesktopScroll = () => {
    if (desktopSliderRef.current) {
      const cardWidth = desktopSliderRef.current.scrollWidth / venues.length
      const newIndex = Math.round(desktopSliderRef.current.scrollLeft / cardWidth)
      if (newIndex !== desktopIndex) {
        setDesktopIndex(newIndex)
      }
    }
  }

  const canScrollLeft = desktopIndex > 0
  const canScrollRight = desktopIndex < venues.length - cardsPerView

  return (
    <section
      id="venues"
      className="py-32 px-6 lg:px-8 pt-24 md:pt-40 pb-20 md:pb-32 relative z-[1] section-soft-blue overflow-visible"
    >

      <div className="max-w-7xl mx-auto relative overflow-visible">
        <ScrollReveal animation="up" className="relative z-30">
          <div className="text-center mb-32 md:mb-40 relative w-fit mx-auto">
            <div className="title-underline relative">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground text-balance relative z-10" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", letterSpacing: "-0.02em" }}>
                {t.venues.title}
              </h2>
            </div>
            <DrawArrows />
          </div>
        </ScrollReveal>

        <ScrollReveal animation="up" className="relative z-20">
          <div className="flex flex-wrap gap-3 justify-center items-center mb-12 md:mb-16 relative z-20 bg-white rounded-2xl px-6 py-4 w-fit mx-auto">
            <div ref={filterContainerRef} className="filter-buttons-container relative flex flex-wrap gap-3 justify-center items-center">
              <div
                className="filter-indicator absolute top-0 h-full rounded-lg bg-[#4a5f7f] pointer-events-none"
                style={{
                  width: `${indicatorStyle.width}px`,
                  left: `${indicatorStyle.left}px`,
                  zIndex: 0,
                  transition: "width 350ms cubic-bezier(0.4, 0, 0.2, 1), left 350ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              />
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  data-active={activeCategory === cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ease-out cursor-pointer relative z-10 ${
                    activeCategory === cat.value
                      ? "text-white shadow-md hover:shadow-lg hover:scale-105"
                      : "text-foreground bg-transparent hover:bg-foreground/5 hover:scale-105 hover:shadow-sm"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="hidden md:block w-px h-8 bg-border/30 mx-1" />
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#4a5f7f] text-white font-semibold text-base rounded-lg shadow-md hover:bg-[#3a4f6f] hover:shadow-lg transition-all duration-300 ease-out cursor-pointer hover:scale-105"
            >
              <Search className="w-5 h-5" />
              {t.venues.browseAll || "Browse All Venues"}
            </Link>
          </div>
        </ScrollReveal>

        {isMobile ? (
          <ScrollReveal animation="up" className="relative z-20">
            <div className="relative py-8 md:py-12 px-4 md:px-6 bg-gradient-to-b from-secondary/65 to-secondary/45 rounded-3xl border border-border/40 mx-auto backdrop-blur-sm overflow-visible">
              <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto px-4 pt-4 pb-6 scroll-smooth"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                  overflowY: "visible",
                }}
              >
                {filteredVenues.map((venue, index) => {
                  const isVisible = visibleCardIds.has(venue.id)
                  return (
                    <div
                      key={venue.id}
                      data-venue-id={venue.id}
                      className={`flex-shrink-0 w-[86vw] max-w-[360px] group relative select-none transition-all duration-500 ease-out ${
                        isFiltering ? "opacity-0 scale-95" : "opacity-100 scale-100"
                      } ${isVisible ? "animate-card-entrance" : "opacity-0"}`}
                      style={{
                        animationDelay: isVisible && !isFiltering ? `${index * 80}ms` : undefined,
                      }}
                    >
                      <div className="absolute -inset-6 bg-gradient-to-br from-apple-blue/10 via-apple-yellow/5 to-apple-green/10 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="relative bg-card rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border border-border/50">
                        <div className="relative aspect-[5/4] overflow-hidden bg-muted rounded-[28px]">
                          <Image
                            src={venue.image || "/placeholder.svg"}
                            alt={t.venueData[venue.nameKey]}
                            fill
                            className="object-cover pointer-events-none group-hover:scale-110 transition-transform duration-700 rounded-[28px]"
                            draggable={false}
                            loading="lazy"
                            sizes="85vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </div>

                        <div className="p-7">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-foreground flex-1">{t.venueData[venue.nameKey]}</h3>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold text-foreground">{venue.rating}</span>
                            <span className="text-sm text-muted-foreground">({venue.reviews})</span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium">{t.venueData[venue.locationKey]}</span>
                          </div>

                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {t.venues.upToGuests.replace("{count}", venue.guests.toString())}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-lg font-bold text-foreground">${venue.price}</span>
                              <span className="text-sm text-muted-foreground font-medium">{t.venues.perNight}</span>
                            </div>
                          </div>

                          <Link
                            href={`/venues/${venue.id}`}
                            className="w-full mt-6 py-3 px-6 rounded-2xl border border-border text-foreground font-semibold cursor-pointer transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-md hover:scale-[1.02] block text-center"
                          >
                            {t.venues.viewDetails}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="flex gap-2">
                  {venues.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        index === currentIndex ? "bg-foreground w-6" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal animation="up" className="relative z-20">
            <div className="relative py-8 md:py-10 bg-gradient-to-b from-secondary/65 to-secondary/45 rounded-3xl border border-border/40 overflow-visible" style={{ maxWidth: "1400px", width: "calc(100vw - 32px)", margin: "0 auto" }}>
              <div className="relative px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => scrollDesktopToIndex(desktopIndex - 1)}
                  disabled={!canScrollLeft}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 p-5 rounded-full bg-[#4a5f7f] text-white hover:bg-[#3a4f6f] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer hover:scale-[1.15]"
                  style={{ boxShadow: "0 4px 16px rgba(74, 95, 127, 0.3)", zIndex: 100 }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <div className="relative flex justify-center overflow-hidden" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                  <div
                    ref={desktopSliderRef}
                    onScroll={handleDesktopScroll}
                    className="flex gap-4 overflow-x-auto py-6 scroll-smooth"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      scrollSnapType: "x mandatory",
                      overflowY: "visible",
                      width: "100%",
                    }}
                  >
                  {filteredVenues.map((venue, index) => {
                    const isVisible = visibleCardIds.has(venue.id)
                    return (
                      <div
                        key={venue.id}
                        data-venue-id={venue.id}
                        className={`flex-shrink-0 group relative transition-all duration-500 ease-out ${
                          isFiltering ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        } ${isVisible ? "animate-venue-card-enter" : "opacity-0"}`}
                        style={{
                          flex: "0 0 calc(100% / 3 - 10.67px)",
                          paddingRight: "16px",
                          scrollSnapAlign: "start",
                          animationDelay: isVisible && !isFiltering ? `${index * 80}ms` : undefined,
                        }}
                      >
                        <div className="absolute -inset-6 bg-gradient-to-br from-apple-blue/10 via-apple-yellow/5 to-apple-green/10 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="venues-slider-card relative bg-card rounded-[28px] overflow-visible shadow-sm hover:shadow-xl border border-border/50" style={{ willChange: "transform" }}>
                        <div className="relative aspect-[5/4] overflow-hidden bg-muted rounded-[28px]">
                          <Image
                            src={venue.image || "/placeholder.svg"}
                            alt={t.venueData[venue.nameKey]}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-[28px]"
                            loading="lazy"
                            sizes="(min-width: 768px) 33vw, 85vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </div>

                        <div className="p-7">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xl font-bold text-foreground flex-1">{t.venueData[venue.nameKey]}</h3>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold text-foreground">{venue.rating}</span>
                            <span className="text-sm text-muted-foreground">({venue.reviews})</span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-3 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium">{t.venueData[venue.locationKey]}</span>
                          </div>

                          <div className="flex items-center justify-between mt-7">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {t.venues.upToGuests.replace("{count}", venue.guests.toString())}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-xl font-bold text-foreground">${venue.price}</span>
                              <span className="text-sm text-muted-foreground font-medium">{t.venues.perNight}</span>
                            </div>
                          </div>

                          <Link
                            href={`/venues/${venue.id}`}
                            className="w-full mt-7 py-3.5 px-6 rounded-2xl border border-border text-foreground font-semibold cursor-pointer transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-md hover:scale-[1.02] block text-center"
                          >
                            {t.venues.viewDetails}
                          </Link>
                        </div>
                        </div>
                      </div>
                    )
                  })}
                  </div>
                </div>

                <button
                  onClick={() => scrollDesktopToIndex(desktopIndex + 1)}
                  disabled={!canScrollRight}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 p-5 rounded-full bg-[#4a5f7f] text-white hover:bg-[#3a4f6f] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer hover:scale-[1.15]"
                  style={{ boxShadow: "0 4px 16px rgba(74, 95, 127, 0.3)", zIndex: 100 }}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                  <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: Math.max(0, filteredVenues.length - cardsPerView + 1) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollDesktopToIndex(index)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        index === desktopIndex ? "bg-foreground w-6" : "bg-muted-foreground/30 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
