"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { LanguageSwitcher } from "./languageSwitcher"
import { MobileBottomNav, DesktopNavbar } from "./mobileBottomNav"
import { AuthUserMenu } from "./authUserMenu"

export function Header() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOverDarkSection, setIsOverDarkSection] = useState(false)
  const { t } = useLanguage()
  const { user, loading, logout, isAdmin } = useAuth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const howItWorksSection = document.getElementById("how-it-works")
      if (howItWorksSection) {
        const rect = howItWorksSection.getBoundingClientRect()
        const headerBottom = 64
        setIsOverDarkSection(rect.top < headerBottom && rect.bottom > 0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile])

  const textColor = isOverDarkSection ? "#ffffff" : undefined
  const bgStyle = isOverDarkSection
    ? {
        background: "rgba(30, 30, 35, 0.85)",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        boxShadow: "0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0.5px 0 rgba(255, 255, 255, 0.15)",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
        transition: "all 0.4s ease",
      }
    : {
        background: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        boxShadow: "0 1px 0 rgba(0, 0, 0, 0.03), inset 0 0.5px 0 rgba(255, 255, 255, 0.4)",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "all 0.4s ease",
      }

  return (
    <>
      {isMobile && (
        <header className="fixed z-10 top-0 left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-full pointer-events-auto" style={bgStyle}>
            <div
              className="flex items-center justify-between px-4 h-16 gap-3"
              style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", width: "100%" }}
            >
              <Link
                href="/"
                className="font-extrabold tracking-tight text-base sm:text-xl flex-shrink-0"
                style={{ color: textColor, transition: "color 0.4s ease" }}
              >
                PartySpace
              </Link>

              <div className={`flex items-center flex-shrink-0`} style={{ gap: !loading && user ? "-8px" : "12px", width: !loading && user ? "140px" : "160px" }}>
                <LanguageSwitcher variant="navbar" />
                <div style={{ width: "120px", display: "flex", alignItems: "center", justifyContent: "flex-end", height: "48px" }}>
                  {!loading ? (
                    user ? (
                      <>
                        <div className="hidden sm:flex flex-col items-end min-w-0 flex-1 pr-2">
                          <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: textColor }}>
                            {user.displayName || user.email?.split("@")[0]}
                          </p>
                          {isAdmin && (
                            <p className="text-xs text-accent font-medium">Admin</p>
                          )}
                        </div>
                        <AuthUserMenu variant="mobile" />
                      </>
                    ) : (
                      <Link
                        href="/sign-in"
                        className="font-bold rounded-full hover:opacity-90 whitespace-nowrap transition-all duration-300 cursor-pointer inline-flex items-center justify-center"
                        style={{
                          backgroundColor: isOverDarkSection ? "#ffffff" : "var(--foreground)",
                          color: isOverDarkSection ? "#111111" : "var(--background)",
                          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15)",
                          transition: "all 0.4s ease",
                          paddingLeft: "24px",
                          paddingRight: "24px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          height: "48px",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                        }}
                      >
                        {t.header.signIn}
                      </Link>
                    )
                  ) : (
                    <div style={{ width: "160px", height: "48px" }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <MobileBottomNav />

      <DesktopNavbar user={user} loading={loading} logout={logout} isAdmin={isAdmin} />
    </>
  )
}
