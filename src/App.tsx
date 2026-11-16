import { lazy, Suspense, useRef, useState, useEffect } from "react"
import { HeroSection } from "@/components/HeroSection"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Balloons, BalloonsRef, launchResponsiveHappyBirthdayBalloons } from "@/components/ui/balloons"
import { triggerConfettiBurst, triggerFireworks, triggerSideCannons } from "@/lib/confettiTriggers"
import { Sparkles, Cake, Gift, Heart, ArrowUp, PartyPopper } from "lucide-react"
import confettiSfx from "@/assets/confetti.mp3"
import wowSfx from "@/assets/random wow.mp3"
import { sounds } from "./lib/soundEffects"
import { playAudio, unlockAudio } from "./lib/audioManager"

// Lazy load below-the-fold sections for lightning-fast initial Safari paint
const InteractiveCake = lazy(() => import("@/components/InteractiveCake"))
const GameBalloonPop = lazy(() => import("@/components/GameBalloonPop"))
const GameCatchStars = lazy(() => import("@/components/GameCatchStars"))
const GameSpinWheel = lazy(() => import("@/components/GameSpinWheel"))
const ConfettiShowcase = lazy(() => import("@/components/ConfettiShowcase"))

// Elegant glass placeholder while lazy chunk loads
function SectionSkeleton({ label }: { label: string }) {
  return (
    <div className="rounded-3xl p-8 glass-panel animate-pulse flex flex-col items-center justify-center min-h-[260px] text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-pink-200/50 flex items-center justify-center text-xl">
        ✨
      </div>
      <div className="h-4 w-44 bg-pink-200/60 rounded-full" />
      <div className="h-3 w-32 bg-pink-100/80 rounded-full" />
      <span className="text-xs text-pink-400 font-semibold mt-1">Loading {label}...</span>
    </div>
  )
}

export function App() {
  const balloonsRef = useRef<BalloonsRef | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "games" | "cake" | "confetti">("all")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isPageReady, setIsPageReady] = useState(false)

  // Track initial page readiness (window load event or safety timer)
  useEffect(() => {
    if (document.readyState === "complete") {
      setIsPageReady(true)
    } else {
      const handleLoad = () => setIsPageReady(true)
      window.addEventListener("load", handleLoad)
      const timer = setTimeout(() => setIsPageReady(true), 1400)
      return () => {
        window.removeEventListener("load", handleLoad)
        clearTimeout(timer)
      }
    }
  }, [])

  // Proactively unlock Web Audio hardware pipeline on first user tap/touch anywhere
  useEffect(() => {
    const handleFirstTouch = () => {
      unlockAudio()
      window.removeEventListener("touchstart", handleFirstTouch)
      window.removeEventListener("pointerdown", handleFirstTouch)
      window.removeEventListener("click", handleFirstTouch)
    }
    window.addEventListener("touchstart", handleFirstTouch, { passive: true })
    window.addEventListener("pointerdown", handleFirstTouch, { passive: true })
    window.addEventListener("click", handleFirstTouch, { passive: true })
    return () => {
      window.removeEventListener("touchstart", handleFirstTouch)
      window.removeEventListener("pointerdown", handleFirstTouch)
      window.removeEventListener("click", handleFirstTouch)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track active section automatically on scroll
  useEffect(() => {
    const sectionIds = ["cake-section", "games-section", "confetti-section"]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "cake-section") setActiveTab("cake")
            else if (entry.target.id === "games-section") setActiveTab("games")
            else if (entry.target.id === "confetti-section") setActiveTab("confetti")
          }
        })
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Preload below-the-fold chunks only on user scroll or after initial interaction
  useEffect(() => {
    let preloaded = false
    const handlePreload = () => {
      if (preloaded) return
      preloaded = true
      import("@/components/InteractiveCake")
      import("@/components/GameBalloonPop")
      import("@/components/GameCatchStars")
      import("@/components/GameSpinWheel")
      import("@/components/ConfettiShowcase")
    }

    const onScroll = () => {
      if (window.scrollY > 80) {
        handlePreload()
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleToggleSound = () => {
    const newState = sounds.toggleSound()
    setSoundEnabled(newState)
    triggerConfettiBurst(0.9, 0.1)
  }

  const handleLaunchBalloons = () => {
    playAudio(confettiSfx, 0.85)
    triggerFireworks()
    try {
      if (balloonsRef.current) {
        balloonsRef.current.launchAnimation()
      }
    } catch (e) {
      console.warn("Balloons trigger:", e)
    }
  }

  const handleLaunchTextBalloons = () => {
    playAudio(wowSfx, 0.85)
    triggerSideCannons()
    try {
      launchResponsiveHappyBirthdayBalloons()
    } catch (e) {
      console.warn("Text balloons error:", e)
    }
  }

  const handleLaunchConfetti = (e: React.MouseEvent) => {
    playAudio(confettiSfx, 0.85)
    const rect = e.currentTarget.getBoundingClientRect()
    triggerConfettiBurst(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    )
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -75
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    triggerConfettiBurst(0.5, 0.9)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-[#fff5f8] text-[#2e1a24] relative selection:bg-pink-400 selection:text-white pb-20">
      {/* Dedicated Loading Screen in matching luxury baby pink UI */}
      <LoadingScreen isReady={isPageReady} />

      {/* Background ambient lighting - baby pink whitish aura */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-pink-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 right-10 w-96 h-96 bg-purple-200/35 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-rose-200/40 rounded-full blur-[120px]" />
      </div>

      {/* Balloons Component Mount Point */}
      <Balloons ref={balloonsRef} type="default" />

      {/* Hero Section */}
      <HeroSection
        onLaunchBalloons={handleLaunchBalloons}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Sticky Navigation / Tab Filter Bar */}
      <div className="sticky top-[max(0.5rem,env(safe-area-inset-top,0.5rem))] z-40 px-2 sm:px-4 max-w-4xl mx-auto my-3 sm:my-6">
        <div className="p-1.5 sm:p-2 rounded-2xl glass-panel-glow border border-pink-200/90 shadow-lg flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 px-0.5 scrollbar-none scroll-touch flex-1 min-w-0 touch-pan-x">
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                triggerConfettiBurst(
                  (rect.left + rect.width / 2) / window.innerWidth,
                  (rect.top + rect.height / 2) / window.innerHeight
                )
                setActiveTab("all")
                scrollToSection("cake-section")
              }}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 touch-manipulation select-none ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950 hover:bg-pink-100/70"
              }`}
            >
              All ✨
            </button>

            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                triggerConfettiBurst(
                  (rect.left + rect.width / 2) / window.innerWidth,
                  (rect.top + rect.height / 2) / window.innerHeight
                )
                setActiveTab("cake")
                scrollToSection("cake-section")
              }}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 sm:gap-1.5 active:scale-95 touch-manipulation select-none ${
                activeTab === "cake"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950 hover:bg-pink-100/70"
              }`}
            >
              <Cake className="w-3.5 h-3.5 text-pink-500" />
              Cake 🎂
            </button>

            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                triggerConfettiBurst(
                  (rect.left + rect.width / 2) / window.innerWidth,
                  (rect.top + rect.height / 2) / window.innerHeight
                )
                setActiveTab("games")
                scrollToSection("games-section")
              }}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 sm:gap-1.5 active:scale-95 touch-manipulation select-none ${
                activeTab === "games"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950 hover:bg-pink-100/70"
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-purple-600" />
              Games 🎮
            </button>

            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                triggerConfettiBurst(
                  (rect.left + rect.width / 2) / window.innerWidth,
                  (rect.top + rect.height / 2) / window.innerHeight
                )
                setActiveTab("confetti")
                scrollToSection("confetti-section")
              }}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 sm:gap-1.5 active:scale-95 touch-manipulation select-none ${
                activeTab === "confetti"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-950 hover:bg-pink-100/70"
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-500" />
              Confetti 🎊
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1 border-l border-pink-200/60">
            <button
              onClick={handleLaunchConfetti}
              className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-300 font-extrabold shadow-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1 touch-manipulation select-none"
            >
              🎉 <span className="hidden xs:inline sm:inline">Pop</span>
            </button>

            <button
              onClick={handleLaunchTextBalloons}
              className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300 font-extrabold flex items-center gap-1 cursor-pointer transition-colors shadow-xs active:scale-95 touch-manipulation select-none"
              title="Launch text balloons"
            >
              🎈 <span className="hidden xs:inline sm:inline">Balloons</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections - Always rendered for 100% reliable load and smooth scrolling */}
      <main className="max-w-5xl mx-auto px-4 space-y-12 md:space-y-16 relative z-10 pt-4">
        {/* Interactive Cake Section */}
        <section id="cake-section" className="scroll-mt-24">
          <Suspense fallback={<SectionSkeleton label="Cake" />}>
            <InteractiveCake onBalloonsRequest={handleLaunchBalloons} />
          </Suspense>
        </section>

        {/* Interactive Games Suite */}
        <section id="games-section" className="space-y-10 scroll-mt-24">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              Birthday Fun Arena
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">
              Interactive Birthday Games 🎮
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto font-medium">
              Play, pop, match, and spin! Every interaction gives you perks, vouchers, and confetti!
            </p>
          </div>

          {/* Game 1: Balloon Pop */}
          <Suspense fallback={<SectionSkeleton label="Balloons" />}>
            <GameBalloonPop />
          </Suspense>

          {/* Game 2: Memory Match */}
          <Suspense fallback={<SectionSkeleton label="Memory Cards" />}>
            <GameCatchStars />
          </Suspense>

          {/* Game 3: Treat Slot Machine */}
          <Suspense fallback={<SectionSkeleton label="Treat Reel" />}>
            <GameSpinWheel />
          </Suspense>
        </section>

        {/* Confetti Showcase */}
        <section id="confetti-section" className="scroll-mt-24">
          <Suspense fallback={<SectionSkeleton label="Confetti Studio" />}>
            <ConfettiShowcase />
          </Suspense>
        </section>


        {/* Grand Finale Banner */}
        <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-pink-100/90 via-rose-100/80 to-purple-100/90 border-2 border-pink-300 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="text-5xl md:text-6xl animate-bounce">🎂✨👑</div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900">
              Here's to You, Rangoli!
            </h3>
            <p className="text-pink-700 text-base md:text-lg font-handwriting font-bold">
              "The girl with the perfect chai energy, the F1 passion, and the kind of smile that makes everything feel lighter."
            </p>
            <p className="text-slate-600 text-xs md:text-sm pt-2 font-medium">
              May your year be filled with beautiful moments, dream drives, and everything you love.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleLaunchBalloons}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-extrabold text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer touch-manipulation select-none"
            >
              Grand Birthday Blast! 🎉🎈
            </button>
          </div>
        </section>
      </main>

      {/* Floating Scroll to Top button with safe-area spacing */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[max(1.25rem,calc(env(safe-area-inset-bottom,1.25rem)+0.5rem))] right-[max(1rem,calc(env(safe-area-inset-right,1rem)+0.5rem))] z-50 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer border border-pink-200 group touch-manipulation select-none"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Footer with safe area padding */}
      <footer className="mt-16 sm:mt-20 border-t border-pink-200/80 pt-8 pb-[max(2rem,env(safe-area-inset-bottom,2rem))] text-center text-xs text-slate-600 space-y-2 px-4">
        <p className="flex items-center justify-center gap-1.5 text-slate-700 font-medium">
          <span>For the girl who makes every day feel brighter</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>with chai, speed, and a little extra sparkle for <strong className="text-pink-700">Rangoli</strong></span>
        </p>
        <p className="text-slate-500">
          Rangoli's Birthday Special Edition • 19th November Celebration
        </p>
      </footer>
    </div>
  )
}
export default App
