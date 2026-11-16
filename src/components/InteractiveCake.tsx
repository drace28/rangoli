import React, { useState } from "react"
import { triggerFireworks, triggerStars } from "@/lib/confettiTriggers"
import { Sparkles, Flame, RotateCcw, PartyPopper } from "lucide-react"
import confettiSfx from "@/assets/confetti.mp3"
import { playAudio } from "@/lib/audioManager"

interface InteractiveCakeProps {
  onBalloonsRequest?: () => void
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({ onBalloonsRequest }) => {
  const [candlesLit, setCandlesLit] = useState(true)
  const [wishMade, setWishMade] = useState(false)
  const [wishCount, setWishCount] = useState(0)

  const handleBlowCandles = () => {
    if (!candlesLit) return
    playAudio(confettiSfx, 0.85)
    setCandlesLit(false)
    setWishMade(true)
    setWishCount((prev) => prev + 1)

    // Trigger full fireworks & stars
    setTimeout(() => {
      triggerFireworks()
      if (onBalloonsRequest) {
        onBalloonsRequest()
      }
    }, 300)
    setTimeout(() => {
      triggerStars()
    }, 1200)
  }

  const handleRelight = () => {
    triggerStars()
    setCandlesLit(true)
    setWishMade(false)
  }

  return (
    <div className="relative rounded-3xl p-5 sm:p-8 md:p-12 glass-panel-glow text-center overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold tracking-wider uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
          Your Birthday Cake
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
          Make a Wish! 🎂
        </h2>

        <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
          {candlesLit
            ? "Close your eyes, make the biggest wish for this year, and blow out the candles!"
            : "✨ Your wish is officially locked into the universe! Happy Birthday, Rangoli!"}
        </p>

        {/* Cake Visual representation */}
        <div className="relative py-6 sm:py-8 flex flex-col items-center justify-center">
          {/* Candle Flames & Stems */}
          <div className="flex gap-2.5 sm:gap-4 md:gap-7 items-end mb-1 z-20">
            {[0, 1, 2, 3, 4].map((candleIndex) => (
              <div key={candleIndex} className="flex flex-col items-center group">
                {/* Flame */}
                <div
                  className={`transition-all duration-500 flex flex-col items-center ${
                    candlesLit
                      ? "opacity-100 scale-100 animate-pulse"
                      : "opacity-0 scale-50 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="w-3.5 sm:w-4 h-5 sm:h-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full blur-[1px] shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-wiggle will-change-transform" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full -mt-2 blur-[0.5px]" />
                </div>

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-slate-700" />

                {/* Candle Stick */}
                <div className="w-3 sm:w-3.5 md:w-4 h-10 sm:h-12 md:h-14 rounded-t-sm bg-gradient-to-b from-pink-300 via-rose-400 to-pink-500 border border-pink-200/60 shadow-md flex flex-col justify-evenly items-center">
                  <div className="w-full h-1 bg-white/50" />
                  <div className="w-full h-1 bg-white/50" />
                  <div className="w-full h-1 bg-white/50" />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Tier 1 (Top Layer) */}
          <div className="relative w-36 sm:w-44 md:w-56 h-12 sm:h-14 md:h-16 rounded-t-2xl bg-gradient-to-b from-rose-400 via-pink-500 to-pink-600 shadow-lg border-t-2 border-pink-200/80 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-3 flex justify-around">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 bg-pink-100 rounded-full -mt-2 shadow-inner" />
              ))}
            </div>
            <span className="text-white font-handwriting text-xl sm:text-2xl md:text-3xl font-bold tracking-wide drop-shadow-md">
              Rangoli
            </span>
          </div>

          {/* Cake Tier 2 (Middle Layer) */}
          <div className="relative w-52 sm:w-60 md:w-72 h-14 sm:h-16 md:h-20 rounded-t-2xl bg-gradient-to-b from-purple-400 via-purple-500 to-indigo-600 shadow-xl border-t-2 border-purple-200/60 flex items-center justify-center overflow-hidden -mt-1">
            <div className="absolute inset-x-0 top-0 h-3 flex justify-around">
              {[...Array(13)].map((_, i) => (
                <div key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 bg-purple-100 rounded-full -mt-2 shadow-inner" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-200 font-extrabold text-xs sm:text-sm md:text-base tracking-widest uppercase bg-purple-900/60 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-300/40">
                Happy Birthday!🌟
              </span>
            </div>
          </div>

          {/* Cake Tier 3 (Bottom Layer) */}
          <div className="relative w-[240px] sm:w-72 md:w-96 h-16 sm:h-18 md:h-24 rounded-t-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 shadow-2xl border-t-2 border-amber-100 flex items-center justify-center overflow-hidden -mt-1">
            <div className="absolute inset-x-0 top-0 h-3.5 flex justify-around">
              {[...Array(17)].map((_, i) => (
                <div key={i} className="w-4 sm:w-5 h-4 sm:h-5 bg-amber-50 rounded-full -mt-2 shadow-inner" />
              ))}
            </div>
          </div>

          {/* Golden Platter Base */}
          <div className="w-[270px] sm:w-80 md:w-[420px] h-3.5 sm:h-4 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-500 rounded-full shadow-[0_10px_25px_rgba(245,158,11,0.25)] border border-amber-200" />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {candlesLit ? (
            <button
              onClick={handleBlowCandles}
              className="w-full sm:w-auto relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-extrabold text-base sm:text-lg shadow-[0_10px_25px_rgba(236,72,153,0.4)] hover:shadow-[0_12px_35px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group touch-manipulation select-none"
            >
              <Flame className="w-5 h-5 text-yellow-300 animate-bounce group-hover:rotate-12 transition-transform" />
              Blow the Candles! 💨
            </button>
          ) : (
            <div className="space-y-4 animate-fade-in w-full">
              <div className="p-4 rounded-2xl bg-pink-100/90 border border-pink-300 text-pink-900 shadow-sm max-w-md mx-auto">
                <p className="font-bold text-base sm:text-lg flex items-center justify-center gap-2">
                  <PartyPopper className="w-5 h-5 text-pink-600" />
                  Wishes Made: {wishCount} ✨
                </p>
                <p className="text-xs text-pink-700/90 mt-1 font-medium">
                  You can re-light the candles as many times as you like!
                </p>
              </div>

              <button
                onClick={handleRelight}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-pink-50 text-slate-800 font-semibold border border-pink-200 hover:border-pink-400 shadow-md transition-all duration-200 flex items-center justify-center gap-2 mx-auto cursor-pointer active:scale-95 touch-manipulation select-none"
              >
                <RotateCcw className="w-4 h-4 text-pink-600" />
                Light the Candles Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default InteractiveCake
