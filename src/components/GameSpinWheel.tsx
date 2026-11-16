import React, { useState } from "react"
import { triggerConfettiBurst, triggerFireworks } from "@/lib/confettiTriggers"
import { Sparkles, Dices, Check, Gift } from "lucide-react"
import slotSfx from "@/assets/slot.mp3"
import { playAudio } from "@/lib/audioManager"

interface DemandItem {
  icon: string
  title: string
  tagline: string
  clause: string
}

const DEMANDS: DemandItem[] = [
  {
    icon: "🧋",
    title: "Drinks on my Tab",
    tagline: "What you see is what you get, enjoy the treat.",
    clause: "Redeemable anytime this week. No complaints permitted!",
  },
  {
    icon: "🍕",
    title: "Dinner/ Snacks / Treat Sponsoring",
    tagline: "You pick the restaurant, I pay the bill. (No bargaining)",
    clause: "Includes desserts and appetizers with a little budget questioning.",
  },
  {
    icon: "🛋️",
    title: "Total VIP & Remote Control Boss",
    tagline: "You have absolute dictatorship over what is watched.",
    clause: "Even if it's a 10-hour marathon of your comfort shows.",
  },
  {
    icon: "🧹",
    title: "24-Hour Immunity Pass",
    tagline: "You lift zero fingers; I handles everything.",
    clause: "Dishes, cleaning, fetching water, making ppts, all on me or maid aunty :)",
  },
  {
    icon: "🤫",
    title: "Peace Pact",
    tagline: "Zero stress, zero drama, and maximum beautiful energy for Rangoli.",
    clause: "Valid for 48 hours straight. Peace and quiet guaranteed.",
  },
  {
    icon: "🎁",
    title: "Wildcard Birthday Wish Ticket",
    tagline: "You can ask for one very special birthday favor on the spot!",
    clause: "Golden ticket of the 19th November birthday edition. Valid once :)",
  },
]

export const GameSpinWheel: React.FC = () => {
  const [spinning, setSpinning] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [history, setHistory] = useState<DemandItem[]>([])
  const spinIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
    }
  }, [])

  const handleSpin = (e: React.MouseEvent) => {
    if (spinning) return

    playAudio(slotSfx, 0.85)

    const rect = e.currentTarget.getBoundingClientRect()
    triggerConfettiBurst(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    )

    setSpinning(true)
    setSelectedIdx(null)

    let spinCount = 0
    const totalSpins = 20 + Math.floor(Math.random() * 8)
    spinIntervalRef.current = setInterval(() => {
      spinCount++
      const randomI = Math.floor(Math.random() * DEMANDS.length)
      setSelectedIdx(randomI)

      if (spinCount >= totalSpins) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
        setSpinning(false)
        const finalIdx = Math.floor(Math.random() * DEMANDS.length)
        setSelectedIdx(finalIdx)
        const chosen = DEMANDS[finalIdx]
        setHistory((prev) => [chosen, ...prev.slice(0, 4)])

        // Celebrate
        setTimeout(() => {
          triggerFireworks()
        }, 100)
      }
    }, 90)
  }

  return (
    <div className="relative rounded-3xl p-4 sm:p-6 md:p-10 glass-panel space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Dices className="w-3.5 h-3.5 text-amber-600" />
            Interactive Mini-Game 3
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
            Your Birthday Treat Slot Machine 🎰
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Spin the reel to see what birthday treat I owe you!
          </p>
        </div>

        <button
          onClick={handleSpin}
          disabled={spinning}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-slate-950 font-extrabold text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer touch-manipulation select-none"
        >
          <Sparkles className="w-5 h-5 text-slate-950 animate-spin" />
          {spinning ? "Spinning Reel..." : "Spin! 🎲"}
        </button>
      </div>

      {/* Main Reel Display */}
      <div className="relative p-5 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-br from-pink-50/90 via-white to-amber-50/70 border-2 border-amber-300 text-center overflow-hidden shadow-md">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-6xl md:text-7xl filter drop-shadow-md animate-bounce">
            {selectedIdx !== null ? DEMANDS[selectedIdx].icon : "🎁"}
          </div>

          <div>
            <h4 className="text-xl md:text-2xl font-black text-slate-900 min-h-[32px]">
              {selectedIdx !== null
                ? DEMANDS[selectedIdx].title
                : "Press 'Spin' above to start"}
            </h4>
            <p className="text-slate-600 text-sm mt-1 font-medium">
              {selectedIdx !== null
                ? DEMANDS[selectedIdx].tagline
                : "100% celebratory and legally adorable for 19th Nov!"}
            </p>
          </div>

          {selectedIdx !== null && !spinning && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2.5 animate-fade-in shadow-xs">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Contract:</strong> {DEMANDS[selectedIdx].clause}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Won Vouchers History */}
      {history.length > 0 && (
        <div className="space-y-3 pt-2">
          <h5 className="text-xs uppercase tracking-wider font-bold text-slate-500 flex items-center gap-2">
            <Gift className="w-3.5 h-3.5 text-pink-500" />
            Claimed Treat History (Show this for redeeming!)
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white/90 border border-pink-200 flex items-center gap-3 text-xs shadow-xs"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 truncate">{item.title}</p>
                  <p className="text-pink-600 text-[11px] truncate font-medium">19 Nov Approved</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default GameSpinWheel
