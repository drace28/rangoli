import React, { useRef } from "react"
import {
  triggerFireworks,
  triggerSideCannons,
  triggerStars,
  triggerCustomShapes,
  triggerEmoji,
  triggerRandom,
  triggerConfettiBurst,
} from "@/lib/confettiTriggers"
import { Confetti, ConfettiRef } from "@/components/ui/confetti"
import { PartyPopper, Sparkles, Wand2, Star, Shapes, Smile } from "lucide-react"
import fireworksSfx from "@/assets/fireworks.mp3"
import canonSfx from "@/assets/canon.mp3"
import starsSfx from "@/assets/stars.mp3"
import wowSfx from "@/assets/random wow.mp3"
import { playAudio } from "@/lib/audioManager"

export const ConfettiShowcase: React.FC = () => {
  const canvasConfettiRef = useRef<ConfettiRef>(null)

  return (
    <div className="relative rounded-3xl p-4 sm:p-6 md:p-10 glass-panel space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <PartyPopper className="w-3.5 h-3.5 text-pink-500" />
            Confetti Celebration Studio
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
            Confetti Fireworks for Rangoli 🎊
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Every button triggers a little celebration for the girl who makes everything feel brighter.
          </p>
        </div>
      </div>

      {/* Interactive hover canvas demo */}
      <div className="relative flex h-[140px] sm:h-[180px] md:h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-pink-300 bg-gradient-to-br from-pink-100/60 via-white to-purple-100/50 shadow-inner select-none touch-manipulation">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-center text-5xl md:text-8xl font-black leading-none text-transparent filter drop-shadow-[0_2px_10px_rgba(244,114,182,0.3)]">
          Rangoli
        </span>
        <p className="pointer-events-none text-xs md:text-sm text-pink-700 mt-2 font-semibold">
          Hover or tap anywhere in this box to shower confetti!
        </p>

        <Confetti
          ref={canvasConfettiRef}
          className="absolute left-0 top-0 z-0 size-full cursor-pointer"
          manualstart
          onMouseEnter={() => {
            canvasConfettiRef.current?.fire({
              particleCount: 25,
              spread: 60,
              ticks: 40,
              colors: ["#ec4899", "#f43f5e", "#a855f7", "#eab308"],
            })
          }}
          onClick={(e) => {
            playAudio(wowSfx, 0.85)
            const rect = e.currentTarget.getBoundingClientRect()
            canvasConfettiRef.current?.fire({
              particleCount: typeof window !== "undefined" && window.innerWidth < 768 ? 20 : 35,
              spread: 60,
              ticks: 40,
              origin: {
                x: (e.clientX - rect.left) / rect.width,
                y: (e.clientY - rect.top) / rect.height,
              },
              colors: ["#ec4899", "#f43f5e", "#a855f7", "#eab308"],
            })
          }}
        />
      </div>

      {/* Button Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <button
          onClick={() => {
            playAudio(fireworksSfx, 0.85)
            triggerFireworks()
          }}
          className="p-3.5 sm:p-4 rounded-xl bg-white/95 border border-pink-200 hover:border-pink-400 hover:bg-pink-50/80 transition-all flex flex-col items-center gap-1.5 sm:gap-2 text-center group cursor-pointer shadow-xs active:scale-95 touch-manipulation select-none"
        >
          <Sparkles className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800">Fireworks 🎆</span>
        </button>

        <button
          onClick={() => {
            playAudio(canonSfx, 0.85)
            triggerSideCannons()
          }}
          className="p-3.5 sm:p-4 rounded-xl bg-white/95 border border-pink-200 hover:border-purple-400 hover:bg-purple-50/80 transition-all flex flex-col items-center gap-1.5 sm:gap-2 text-center group cursor-pointer shadow-xs active:scale-95 touch-manipulation select-none"
        >
          <PartyPopper className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800">Cannons 🎉</span>
        </button>

        <button
          onClick={() => {
            playAudio(starsSfx, 0.85)
            triggerStars()
          }}
          className="p-3.5 sm:p-4 rounded-xl bg-white/95 border border-pink-200 hover:border-yellow-400 hover:bg-amber-50/80 transition-all flex flex-col items-center gap-1.5 sm:gap-2 text-center group cursor-pointer shadow-xs active:scale-95 touch-manipulation select-none"
        >
          <Star className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800">Gold Stars ⭐</span>
        </button>

        <button
          onClick={() => {
            playAudio(wowSfx, 0.85)
            triggerCustomShapes()
          }}
          className="p-3.5 sm:p-4 rounded-xl bg-white/95 border border-pink-200 hover:border-cyan-400 hover:bg-cyan-50/80 transition-all flex flex-col items-center gap-1.5 sm:gap-2 text-center group cursor-pointer shadow-xs active:scale-95 touch-manipulation select-none"
        >
          <Shapes className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800">Shapes 🔺</span>
        </button>

        <button
          onClick={(e) => {
            playAudio(wowSfx, 0.85)
            const rect = e.currentTarget.getBoundingClientRect()
            triggerEmoji(
              (rect.left + rect.width / 2) / window.innerWidth,
              (rect.top + rect.height / 2) / window.innerHeight
            )
          }}
          className="p-3.5 sm:p-4 rounded-xl bg-white/95 border border-pink-200 hover:border-rose-400 hover:bg-rose-50/80 transition-all flex flex-col items-center gap-1.5 sm:gap-2 text-center group cursor-pointer shadow-xs active:scale-95 touch-manipulation select-none"
        >
          <Smile className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800">Emojis 🦄🎂</span>
        </button>

        <button
          onClick={(e) => {
            playAudio(wowSfx, 0.85)
            const rect = e.currentTarget.getBoundingClientRect()
            triggerRandom(
              (rect.left + rect.width / 2) / window.innerWidth,
              (rect.top + rect.height / 2) / window.innerHeight
            )
          }}
          className="p-3.5 sm:p-4 rounded-xl bg-white/95 border border-pink-200 hover:border-emerald-400 hover:bg-emerald-50/80 transition-all flex flex-col items-center gap-1.5 sm:gap-2 text-center group cursor-pointer shadow-xs active:scale-95 touch-manipulation select-none"
        >
          <Wand2 className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800">Random 🎯</span>
        </button>
      </div>
    </div>
  )
}
export default ConfettiShowcase
