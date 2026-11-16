import React, { useEffect, useState } from "react"
import { Sparkles, Heart } from "lucide-react"

interface LoadingScreenProps {
  isReady: boolean
  onComplete?: () => void
}

const LOADING_STEPS = [
  "Baking the birthday cake... 🎂",
  "Inflating birthday balloons... 🎈",
  "Packing chai, F1, and classic car vibes... 🚗",
  "Sprinkling magical confetti... ✨",
  "Your birthday wish is ready! 🌸",
]

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isReady, onComplete }) => {
  const [progress, setProgress] = useState(15)
  const [stepIndex, setStepIndex] = useState(0)
  const [shouldRender, setShouldRender] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Progress simulation that accelerates when isReady becomes true
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Jump faster if page is actually ready
        const increment = isReady ? 12 : Math.floor(Math.random() * 8) + 4
        const next = Math.min(prev + increment, isReady ? 100 : 88)
        return next
      })
    }, 120)

    return () => clearInterval(interval)
  }, [isReady])

  // Update step label based on progress
  useEffect(() => {
    const nextIndex = Math.min(
      Math.floor((progress / 100) * LOADING_STEPS.length),
      LOADING_STEPS.length - 1
    )
    setStepIndex(nextIndex)

    if (progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true)
      }, 350)

      const unmountTimer = setTimeout(() => {
        setShouldRender(false)
        if (onComplete) onComplete()
      }, 1000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(unmountTimer)
      }
    }
  }, [progress, onComplete])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#fff5f8] flex flex-col items-center justify-center p-4 transition-all duration-700 select-none touch-manipulation ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Ambient background glows matching theme */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pink-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Center card */}
      <div className="relative z-10 w-full max-w-sm p-6 sm:p-8 rounded-3xl glass-panel-glow text-center space-y-5 border border-pink-200/90 shadow-2xl">
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-200/60 via-rose-100 to-purple-200/50 flex items-center justify-center text-4xl sm:text-5xl animate-bounce shadow-md">
            🎂
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Heading & Requested Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-[11px] font-extrabold uppercase tracking-wider">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
            19th November Birthday Special
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Rangoli's Birthday Wish is Loading
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
            A little patience please... Preparing all the surprises for you! 🌸
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-2 pt-2">
          <div className="w-full h-3 bg-pink-100/90 rounded-full overflow-hidden p-0.5 border border-pink-200/70 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-pink-700 font-bold px-1">
            <span className="truncate max-w-[200px] text-left">
              {LOADING_STEPS[stepIndex]}
            </span>
            <span className="font-mono text-purple-700 shrink-0">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
