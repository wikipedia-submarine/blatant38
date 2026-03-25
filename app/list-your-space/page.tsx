"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, Wifi, UtensilsCrossed, Zap, Check, ChevronLeft, ChevronRight, X, Upload, Play, Trash2, MapPin } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/languageSwitcher"
import { ProtectedRoute } from "@/components/protectedRoute"

const AMENITIES = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { id: "heating", label: "Heating", icon: Zap },
]

const INITIAL_FORM = {
  spaceName: "",
  location: "",
  description: "",
  price: "",
  maxGuests: "",
  amenities: [] as string[],
  contact: "",
  latitude: 41.7151,
  longitude: 44.7671,
  images: [] as string[],
  videos: [] as string[],
}

interface FormData {
  spaceName: string
  location: string
  description: string
  price: string
  maxGuests: string
  amenities: string[]
  contact: string
  latitude: number
  longitude: number
  images: string[]
  videos: string[]
}

const FormSection = ({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) => (
  <div className={`p-7 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/50 border border-border/30 shadow-sm hover:shadow-md transition-all duration-500 space-y-6 animate-fade-up backdrop-blur-sm ${className}`}>
    <div className="space-y-1">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h2>
      {subtitle && <p className="text-base text-muted-foreground/80">{subtitle}</p>}
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
)

const InputField = ({ label, type = "text", ...props }: { label: string; type?: string; [key: string]: any }) => (
  <div className="space-y-2.5">
    <label className="block text-sm font-semibold text-foreground">{label}</label>
    <input
      type={type}
      {...props}
      className="w-full px-4 py-3.5 rounded-2xl border border-border/50 bg-white/80 dark:bg-slate-800/50 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 hover:border-border/80"
    />
  </div>
)

const TextareaField = ({ label, ...props }: { label: string; [key: string]: any }) => (
  <div className="space-y-2.5">
    <label className="block text-sm font-semibold text-foreground">{label}</label>
    <textarea
      {...props}
      rows={5}
      className="w-full px-4 py-3.5 rounded-2xl border border-border/50 bg-white/80 dark:bg-slate-800/50 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 hover:border-border/80 resize-none"
    />
  </div>
)

const VenueDetailsPreview = ({ formData, fileInputRef, isScrollPastHeader }: { formData: FormData; fileInputRef: React.RefObject<HTMLInputElement>; isScrollPastHeader: boolean }) => {
  const currentImage = formData.images[0]

  const containerClasses = isScrollPastHeader
    ? "sticky top-32 h-fit max-h-[calc(100vh-140px)]"
    : "h-fit"

  return (
    <div className={`${containerClasses} overflow-y-auto custom-scrollbar`}>
      <div className="overflow-hidden rounded-3xl border border-border/20 bg-white dark:bg-slate-900 shadow-lg">
        {/* Hero Image Section */}
        <div
          className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={formData.spaceName || "Venue"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/10 transition-all duration-300">
              <div className="text-center">
                <div className="p-4 rounded-full bg-accent/20 w-fit mx-auto mb-3 group-hover:bg-accent/30 transition-colors">
                  <Upload className="w-8 h-8 text-accent/60 group-hover:text-accent/80" />
                </div>
                <p className="text-base text-muted-foreground/60 font-medium group-hover:text-accent/70 transition-colors">Add photos to preview</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-7">
          {/* Title & Location */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4 line-clamp-2">
              {formData.spaceName || "Your Space Name"}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span className="text-base font-medium">{formData.location || "Location"}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="border-t border-border/20 pt-6">
            <h2 className="text-xl font-bold text-foreground mb-3">About this space</h2>
            <p className="text-base text-muted-foreground/80 line-clamp-4 leading-relaxed">
              {formData.description || "Add a description of your space to help guests understand what makes it special."}
            </p>
          </div>

          {/* Amenities Section */}
          {formData.amenities.length > 0 && (
            <div className="border-t border-border/20 pt-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {formData.amenities.map((amenity) => {
                  const amenityData = AMENITIES.find((a) => a.id === amenity)
                  const Icon = amenityData?.icon
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-border/20">
                      {Icon && <Icon className="w-5 h-5 text-accent" />}
                      <span className="text-base font-medium text-foreground">{amenityData?.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Booking Info */}
          <div className="border-t border-border/20 pt-6 bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-2xl">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-4xl font-bold text-foreground">
                ${formData.price || "0"}
              </span>
              <span className="text-muted-foreground text-base">/night</span>
            </div>
            <p className="text-sm text-muted-foreground mb-5 font-medium">Up to {formData.maxGuests || "0"} guests</p>
            <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white font-bold text-base cursor-pointer opacity-50 transition-all hover:scale-105">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Content() {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [imageIdx, setImageIdx] = useState(0)
  const [showVideoError, setShowVideoError] = useState(false)
  const [isScrollPastHeader, setIsScrollPastHeader] = useState(false)

  // Detect when user scrolls past the header
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom
        setIsScrollPastHeader(headerBottom < 0)
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const updateForm = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAmenity = (id: string) => {
    updateForm("amenities", formData.amenities.includes(id) ? formData.amenities.filter((a) => a !== id) : [...formData.amenities, id])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        updateForm("images", [...formData.images, result])
      }
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowVideoError(false)
    if (formData.images.length === 0) {
      setShowVideoError(true)
      return
    }

    if (!e.target.files) return
    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        updateForm("videos", [...formData.videos, result])
      }
      reader.readAsDataURL(file)
    })
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const removeImage = (i: number) => {
    updateForm("images", formData.images.filter((_, idx) => idx !== i))
    if (imageIdx >= formData.images.length - 1 && imageIdx > 0) setImageIdx(imageIdx - 1)
  }

  const removeVideo = (i: number) => {
    updateForm("videos", formData.videos.filter((_, idx) => idx !== i))
  }

  const changeImage = (d: -1 | 1) => {
    setImageIdx((idx) => (idx + d + formData.images.length) % formData.images.length)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert(t.listYourSpaceForm.successMessage)
    setFormData(INITIAL_FORM)
    setImageIdx(0)
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dUzKydaZ5yXMFw&q=${formData.latitude},${formData.longitude}`
  const currentImage = formData.images[imageIdx]

  return (
    <main className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 md:h-52 lg:h-64 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 sm:-top-20 md:-top-28 lg:-top-36 left-0 right-0 h-32 sm:h-40 md:h-52 lg:h-64" style={{ background: "linear-gradient(180deg, transparent 0%, var(--background) 100%)", filter: "blur(24px)" }} />
        <div className="absolute -top-1 left-0 w-full h-20 sm:h-28 md:h-40 lg:h-52 text-foreground/5">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,20 C150,40 350,25 550,35 C750,45 950,20 1200,35 L1200,0 L0,0 Z" opacity="0.3" />
            <path d="M0,10 C300,50 600,10 900,40 C1050,55 1150,35 1200,45 L1200,0 L0,0 Z" opacity="0.5" />
            <path d="M0,0 C200,40 400,15 600,35 C800,55 1000,20 1200,40 L1200,0 L0,0 Z" opacity="1" />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gradient-to-br from-apple-blue/15 via-apple-blue/5 to-transparent rounded-full blur-3xl animate-blob-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-gradient-to-tr from-apple-green/12 via-apple-green/3 to-transparent rounded-full blur-3xl animate-blob-slow-delay-1" />
        <div className="absolute -left-32 md:-left-48 top-1/3 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-apple-blue/10 to-transparent rounded-full blur-3xl animate-blob-slow opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10 pt-24 sm:pt-32 md:pt-40 lg:pt-48">
        <div className="sticky top-0 z-40 flex items-center justify-between mb-8 animate-fade-up py-4">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-foreground text-background hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold hover:bg-foreground/90">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <LanguageSwitcher variant="light" />
        </div>

        <div ref={headerRef} className="mb-12 animate-fade-up pt-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight text-balance">
            {t.listYourSpaceForm.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground/80 max-w-3xl leading-relaxed">
            {t.listYourSpaceForm.subtitle}
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <form onSubmit={handleSubmit} className="space-y-10 relative lg:col-span-2">
          <FormSection title={t.listYourSpaceForm.basicInfo}>
            <div className="space-y-6">
              <InputField label={t.listYourSpaceForm.spaceName} placeholder={t.listYourSpaceForm.spaceNamePlaceholder} value={formData.spaceName} onChange={(e) => updateForm("spaceName", e.target.value)} required />
              <InputField label={t.listYourSpaceForm.location} placeholder={t.listYourSpaceForm.locationPlaceholder} value={formData.location} onChange={(e) => updateForm("location", e.target.value)} required />
              <TextareaField label={t.listYourSpaceForm.description} placeholder={t.listYourSpaceForm.descriptionPlaceholder} value={formData.description} onChange={(e) => updateForm("description", e.target.value)} required />
            </div>
          </FormSection>

          <FormSection title={t.listYourSpaceForm.photos} subtitle={t.listYourSpaceForm.photosSubtitle}>
            {currentImage && (
              <div className="space-y-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted border border-border/30 shadow-sm hover:shadow-lg transition-all duration-500 group/image">
                  <img src={currentImage} alt={`Space image ${imageIdx + 1}`} className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700" />
                  <button type="button" onClick={() => removeImage(imageIdx)} className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm">
                    <X className="w-5 h-5" />
                  </button>
                  {formData.images.length > 1 && (
                    <>
                      <button type="button" onClick={() => changeImage(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm cursor-pointer">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button type="button" onClick={() => changeImage(1)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm cursor-pointer">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground/70 font-medium">
                    {imageIdx + 1} of {formData.images.length} photos
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {formData.images.map((img, i) => (
                      <button key={i} type="button" onClick={() => setImageIdx(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${imageIdx === i ? "border-accent shadow-sm ring-2 ring-accent/30" : "border-border/40 opacity-60 hover:opacity-100"}`}>
                        <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-5 px-6 rounded-2xl border-2 border-dashed border-border/50 hover:border-accent hover:bg-accent/5 transition-all duration-300 flex items-center justify-center gap-3 text-muted-foreground/70 hover:text-accent group/upload">
              <Upload className="w-6 h-6 group-hover/upload:scale-110 group-hover/upload:-translate-y-1 transition-all" />
              <span className="font-semibold text-sm">{t.listYourSpaceForm.uploadPhotos}</span>
            </button>

            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />

            {formData.images.length > 0 && (
              <p className="text-sm text-muted-foreground font-medium">
                {formData.images.length} {formData.images.length === 1 ? "photo" : "photos"} uploaded
              </p>
            )}
          </FormSection>

          <FormSection title={t.listYourSpaceForm.videos} subtitle={t.listYourSpaceForm.videosSubtitle}>
            {showVideoError && (
              <div className="p-4 rounded-lg bg-apple-red/10 border border-apple-red/30 flex items-start gap-3">
                <span className="text-apple-red font-semibold">Upload photos first</span>
              </div>
            )}

            {formData.videos.length > 0 && (
              <div className="space-y-3">
                {formData.videos.map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/30 border border-border/40 hover:border-accent/50 hover:shadow-sm transition-all duration-300 group/video">
                    <div className="p-2 rounded-lg bg-accent/10 group-hover/video:bg-accent/15 transition-colors">
                      <Play className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground flex-1">Video {i + 1}</span>
                    <button type="button" onClick={() => removeVideo(i)} className="p-2 rounded-lg hover:bg-apple-red/15 text-apple-red hover:scale-110 transition-all duration-300 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={() => (formData.images.length > 0 ? videoInputRef.current?.click() : setShowVideoError(true))} disabled={formData.images.length === 0} className={`w-full py-5 px-6 rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-3 font-semibold group/upload ${formData.images.length === 0 ? "border-border/30 text-muted-foreground/40 cursor-not-allowed opacity-50" : "border-border/50 hover:border-accent hover:bg-accent/5 text-muted-foreground/70 hover:text-accent"}`}>
              <Upload className="w-6 h-6 group-hover/upload:scale-110 group-hover/upload:-translate-y-1 transition-all" />
              <span className="text-sm">{t.listYourSpaceForm.uploadVideos}</span>
            </button>

            <input ref={videoInputRef} type="file" multiple accept="video/*" onChange={handleVideoUpload} disabled={formData.images.length === 0} className="hidden" />
          </FormSection>

          <FormSection title={t.listYourSpaceForm.pricingCapacity}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label={t.listYourSpaceForm.pricePerNight} placeholder={t.listYourSpaceForm.pricePerNightPlaceholder} type="number" min="0" value={formData.price} onChange={(e) => updateForm("price", e.target.value)} required />
              <InputField label={t.listYourSpaceForm.maxGuests} placeholder={t.listYourSpaceForm.maxGuestsPlaceholder} type="number" min="1" value={formData.maxGuests} onChange={(e) => updateForm("maxGuests", e.target.value)} required />
            </div>
          </FormSection>

          <FormSection title={t.listYourSpaceForm.locationMap} subtitle={t.listYourSpaceForm.locationMapSubtitle}>
            <div className="w-full h-96 rounded-3xl border border-border/30 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
              <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={mapUrl} />
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/30 border border-border/30">
              <p className="text-sm text-muted-foreground/80 font-medium">
                <span className="font-semibold text-foreground">{t.listYourSpaceForm.coordinates}:</span> {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            </div>
          </FormSection>

          <FormSection title={t.listYourSpaceForm.amenities} subtitle={t.listYourSpaceForm.amenitiesSubtitle}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity.id)
                const Icon = amenity.icon
                return (
                  <button key={amenity.id} type="button" onClick={() => toggleAmenity(amenity.id)} className={`p-6 rounded-2xl border-2 transition-all duration-300 group/amenity ${isSelected ? "border-accent bg-gradient-to-br from-accent/15 to-accent/5 text-accent shadow-sm" : "border-border/40 bg-white/50 dark:bg-slate-800/30 hover:bg-accent/5 text-muted-foreground hover:border-accent/60 hover:text-foreground"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl transition-all duration-300 ${isSelected ? "bg-accent/20 group-hover/amenity:scale-110" : "bg-accent/10 group-hover/amenity:bg-accent/15 group-hover/amenity:scale-110"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm">{amenity.label}</span>
                      {isSelected && <Check className="w-5 h-5 ml-auto text-accent" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </FormSection>

          <FormSection title={t.listYourSpaceForm.contact}>
            <InputField label={t.listYourSpaceForm.emailOrPhone} placeholder={t.listYourSpaceForm.emailOrPhonePlaceholder} value={formData.contact} onChange={(e) => updateForm("contact", e.target.value)} required />
          </FormSection>

          <div className="flex flex-col sm:flex-row gap-4 pt-12 pb-12 animate-fade-up">
            <button type="submit" className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-accent to-blue-600 text-white font-bold text-base cursor-pointer hover:shadow-lg hover:shadow-accent/30 hover:scale-105 transition-all duration-300 shadow-md">
              {t.listYourSpaceForm.submitButton}
            </button>
            <button type="button" onClick={() => setFormData(INITIAL_FORM)} className="py-4 px-8 rounded-2xl border-2 border-border text-foreground font-semibold cursor-pointer hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 group/clear">
              {t.listYourSpaceForm.clearButton}
            </button>
          </div>
        </form>

          <div className="hidden lg:flex lg:flex-col lg:col-span-1 gap-0">
            <p className="text-sm font-semibold text-muted-foreground/70 uppercase tracking-widest sticky top-24 z-20 pb-3">Venue Preview</p>
            <VenueDetailsPreview formData={formData} fileInputRef={fileInputRef} isScrollPastHeader={isScrollPastHeader} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ListYourSpacePage() {
  return (
    <ProtectedRoute requireAdmin={false}>
      <Content />
    </ProtectedRoute>
  )
}
