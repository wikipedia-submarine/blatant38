"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LanguageSwitcher } from "@/components/languageSwitcher"
import { Mail, Lock, User } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, name)
      setTimeout(() => {
        router.push("/")
      }, 300)
    } catch (err: any) {
      setError(err.message || "Failed to create account")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
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

      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-gradient-to-br from-apple-blue/20 via-apple-blue/8 to-transparent rounded-full blur-3xl animate-blob-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-gradient-to-tr from-apple-green/15 via-apple-green/5 to-transparent rounded-full blur-3xl animate-blob-slow-delay-1" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
              <LanguageSwitcher variant="light" />
              <Link href="/" className="inline-block">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">PartySpace</h1>
              </Link>
            </div>
            <h2 className="text-4xl font-extrabold text-foreground">Create Account</h2>
            <p className="text-center text-muted-foreground">Join PartySpace today</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-3">
              <label htmlFor="name" className="block text-foreground font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40 transition-all duration-300"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="block text-foreground font-semibold">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40 transition-all duration-300"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="block text-foreground font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40 transition-all duration-300"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="confirmPassword" className="block text-foreground font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/60 bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent/40 transition-all duration-300"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-apple-red/10 border border-apple-red/30 flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-apple-red/20 flex-shrink-0 mt-0.5">
                  <span className="w-4 h-4 text-apple-red">!</span>
                </div>
                <p className="text-sm font-medium text-apple-red">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Already have an account?</span>
              </div>
            </div>

            <Link
              href="/sign-in"
              className="w-full py-3 px-6 rounded-xl border-2 border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 text-foreground font-semibold cursor-pointer transition-all duration-300 block text-center"
            >
              Sign In
            </Link>
          </div>

          <Link
            href="/"
            className="w-full py-3 px-6 rounded-xl border-2 border-border text-foreground font-semibold cursor-pointer hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
