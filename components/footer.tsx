"use client"

import Link from "next/link"
import { Twitter, Instagram, Facebook } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "./languageSwitcher"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      className="py-24 px-6 lg:px-8 pb-32 md:pb-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1a1a1c 0%, #0d0d0e 100%)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 md:h-52 lg:h-64 xl:h-80 pointer-events-none overflow-hidden">
        {/* Blurred gradient transition */}
        <div
          className="absolute -top-16 sm:-top-20 md:-top-28 lg:-top-36 left-0 right-0 h-32 sm:h-40 md:h-52 lg:h-64"
          style={{
            background: "linear-gradient(180deg, var(--background) 0%, transparent 100%)",
            filter: "blur(24px)",
          }}
        />
        {/* Liquid wave SVG shapes - height scales with breakpoints */}
        <svg
          className="absolute -top-1 left-0 w-full h-20 sm:h-28 md:h-40 lg:h-52 xl:h-64 text-background"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,20 C150,40 350,25 550,35 C750,45 950,20 1200,35 L1200,0 L0,0 Z" opacity="0.3" />
          <path d="M0,10 C300,50 600,10 900,40 C1050,55 1150,35 1200,45 L1200,0 L0,0 Z" opacity="0.5" />
          <path d="M0,0 C200,40 400,15 600,35 C800,55 1000,20 1200,40 L1200,0 L0,0 Z" opacity="1" />
        </svg>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated fluid blobs */}
        <div className="absolute top-12 md:top-16 left-1/4 md:left-1/3 w-64 md:w-72 h-64 md:h-72 bg-gradient-to-br from-apple-blue/15 to-transparent rounded-full blur-3xl animate-blob-slow" />
        <div className="absolute top-20 md:top-24 right-1/4 md:right-1/3 w-56 md:w-64 h-56 md:h-64 bg-gradient-to-br from-apple-green/10 to-transparent rounded-full blur-3xl animate-blob-slow-delay-1" />
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 w-48 md:w-56 h-48 md:h-56 bg-gradient-to-br from-apple-yellow/10 to-transparent rounded-full blur-3xl animate-blob-slow-delay-2" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-gradient-to-tr from-accent/12 to-transparent rounded-full blur-3xl animate-blob-slow-delay-3" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center md:text-left pb-4 overflow-visible">
          <Link
            href="/"
            className="text-4xl md:text-5xl font-black text-white tracking-tight inline-block leading-normal py-2"
          >
            PartySpace
          </Link>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-md">{t.footer.tagline}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-12 border-y border-white/10">
          <nav className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-12">
            <Link
              href="#"
              className="text-lg font-medium text-gray-400 hover:text-apple-blue transition-colors duration-300"
            >
              {t.footer.about}
            </Link>
            <Link
              href="#"
              className="text-lg font-medium text-gray-400 hover:text-apple-blue transition-colors duration-300"
            >
              {t.footer.contact}
            </Link>
            <Link
              href="#"
              className="text-lg font-medium text-gray-400 hover:text-apple-blue transition-colors duration-300"
            >
              {t.footer.terms}
            </Link>
            <Link
              href="#"
              className="text-lg font-medium text-gray-400 hover:text-apple-blue transition-colors duration-300"
            >
              {t.footer.privacy}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-base text-gray-400 font-medium">Language:</span>
            <LanguageSwitcher variant="dark" />
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-base text-gray-500">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-500 hover:text-apple-blue transition-colors duration-300">
              <Twitter className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-apple-blue transition-colors duration-300">
              <Instagram className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-apple-blue transition-colors duration-300">
              <Facebook className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
