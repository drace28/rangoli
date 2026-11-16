import React, { useState } from "react"
import { triggerConfettiBurst, triggerFireworks } from "@/lib/confettiTriggers"
import { Gift, Sparkles, RefreshCw, Trophy, Heart } from "lucide-react"
import balloonSfx from "@/assets/balloon.mp3"
import { playAudio } from "@/lib/audioManager"

interface SiblingPerk {
  id: number
  color: string
  borderColor: string
  bgGlow: string
  title: string
  description: string
  popped: boolean
}

const INITIAL_BALLOONS: SiblingPerk[] = [
  {
    id: 1,
    color: "from-pink-500 to-rose-600",
    borderColor: "border-pink-300",
    bgGlow: "rgba(244,63,94,0.3)",
    title: "Chai & Chemistry Pass ☕",
    description: "A chai date with you, zero rush, and just enough spark to make every moment feel warmer.",
    popped: false,
  },
  {
    id: 2,
    color: "from-amber-400 to-orange-500",
    borderColor: "border-amber-200",
    bgGlow: "rgba(245,158,11,0.3)",
    title: "Book Nook Crush 📚",
    description: "A cozy reading date, a new favorite book, and a little time to fall for your smile all over again.",
    popped: false,
  },
  {
    id: 3,
    color: "from-purple-500 to-indigo-600",
    borderColor: "border-purple-300",
    bgGlow: "rgba(168,85,247,0.3)",
    title: "F1 Sweetheart VIP 🎟️",
    description: "Race-day energy, your favorite snacks, and just the right amount of flirting to make every lap unforgettable.",
    popped: false,
  },
  {
    id: 4,
    color: "from-emerald-400 to-teal-600",
    borderColor: "border-emerald-200",
    bgGlow: "rgba(16,185,129,0.3)",
    title: "Foodie Freedom Pass 🍽️",
    description: "A treat-worthy food plan with all the things you love, including non-veg food even if I pretend not to like it.",
    popped: false,
  },
  {
    id: 5,
    color: "from-cyan-400 to-blue-600",
    borderColor: "border-cyan-200",
    bgGlow: "rgba(6,182,212,0.3)",
    title: "Classic Car Dream Card 🚗",
    description: "A vintage-car fantasy with you, all charm and aesthetics, and a little extra spark in the air.",
    popped: false,
  },
  {
    id: 6,
    color: "from-fuchsia-500 to-pink-600",
    borderColor: "border-fuchsia-300",
    bgGlow: "rgba(217,70,239,0.3)",
    title: "Rangoli Royalty Trophy 👑",
    description: "Official confirmation: you are the prettiest part of the room, and somehow the best part of my day too.",
    popped: false,
  },
]

export const GameBalloonPop: React.FC = () => {
  const [balloons, setBalloons] = useState<SiblingPerk[]>(INITIAL_BALLOONS)

  const poppedCount = balloons.filter((b) => b.popped).length
  const allPopped = poppedCount === balloons.length

  const handlePop = (id: number, event: React.MouseEvent) => {
    playAudio(balloonSfx, 0.85)

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight
    triggerConfettiBurst(x, y)

    const updated = balloons.map((b) => (b.id === id ? { ...b, popped: true } : b))
    setBalloons(updated)

    if (updated.filter((b) => b.popped).length === balloons.length) {
      setTimeout(() => {
        triggerFireworks()
      }, 300)
    }
  }

  const handleReset = () => {
    setBalloons(INITIAL_BALLOONS)
    triggerConfettiBurst(0.5, 0.5)
  }

  return (
    <div className="relative rounded-3xl p-4 sm:p-6 md:p-10 glass-panel space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-pink-500" />
            Interactive Mini-Game 1
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
            Pop The Birthday Balloons 🎈
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Pop every balloon to unlock genuine perks & vouchers reserved just for You!
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-pink-50 border border-pink-200 text-xs sm:text-sm font-bold flex items-center gap-2 text-pink-800 shadow-xs">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>
              Popped: <strong className="text-pink-600">{poppedCount}</strong> / {balloons.length}
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-pink-50 text-slate-600 hover:text-slate-900 border border-pink-200 transition-colors shadow-xs active:scale-95 touch-manipulation select-none cursor-pointer"
            title="Reset Balloons"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Balloons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 pt-2">
        {balloons.map((balloon, idx) => (
          <div
            key={balloon.id}
            className="relative min-h-[170px] sm:min-h-[190px] rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center p-3 sm:p-5 overflow-hidden group"
            style={{
              animationDelay: `${idx * 0.15}s`,
            }}
          >
            {!balloon.popped ? (
              // Unpopped Floating Balloon Button
              <button
                onClick={(e) => handlePop(balloon.id, e)}
                className={`w-full h-full min-h-[170px] sm:min-h-[180px] rounded-2xl bg-gradient-to-br ${balloon.color} p-5 sm:p-6 flex flex-col items-center justify-between cursor-pointer border-2 ${balloon.borderColor} shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative animate-float will-change-transform touch-manipulation select-none`}
                style={{
                  boxShadow: `0 12px 25px -5px ${balloon.bgGlow}`,
                }}
              >
                {/* Balloon shine highlight */}
                <div className="absolute top-3 left-4 w-6 h-10 bg-white/40 rounded-full blur-[1px] rotate-[-25deg] pointer-events-none" />

                <div className="text-4xl filter drop-shadow-md">🎈</div>

                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-white/90 font-bold block">
                    Balloon #{balloon.id}
                  </span>
                  <p className="text-white font-extrabold text-base md:text-lg drop-shadow-sm">
                    Tap to Pop!
                  </p>
                </div>

                <div className="w-2.5 h-2.5 bg-white/80 rounded-full mx-auto -mb-2 shadow-sm" />
              </button>
            ) : (
              // Popped Content / Perk Reveal
              <div className="w-full h-full min-h-[180px] rounded-2xl bg-white/95 border-2 border-emerald-400/80 p-5 flex flex-col justify-between text-left animate-fade-in shadow-md relative">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Unlocked Perk
                  </span>
                  <span className="text-xs text-slate-400 font-mono">19 Nov</span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                    {balloon.title}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    {balloon.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Authorized for: <strong className="text-pink-700">Rangoli</strong></span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {allPopped && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-amber-100 border border-pink-300 text-center space-y-2 animate-bounce shadow-sm">
          <h4 className="text-xl font-extrabold text-pink-900">
            🎉 All Perks Unlocked for You! 🎉
          </h4>
          <p className="text-slate-700 text-sm max-w-lg mx-auto font-medium">
            Screenshot this page! All these birthday perks are officially redeemable from today, 19th November, with a whole lot of sparkle attached.
          </p>
        </div>
      )}
    </div>
  )
}
export default GameBalloonPop
