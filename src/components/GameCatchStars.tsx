import React, { useState, useEffect, useRef } from "react"
import { triggerFireworks, triggerMatchSparkle } from "@/lib/confettiTriggers"
import { Sparkles, Trophy, RotateCcw, Timer, Award, CheckCircle2 } from "lucide-react"
import { sounds } from "@/lib/soundEffects"

interface CardItem {
  id: number
  icon: string
  label: string
  perk: string
  color: string
}

const CARDS_DATA: Omit<CardItem, "id">[] = [
  {
    icon: "👑",
    label: "Royalty",
    perk: "Undisputed boss of good taste & style",
    color: "from-amber-400 to-yellow-500",
  },
  {
    icon: "☕",
    label: "Chai Mood",
    perk: "A perfect cup, a perfect vibe, and instant comfort",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: "🏎️",
    label: "19th November",
    perk: "The day the whole world should celebrate your sparkle",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: "🏁",
    label: "F1 Fever",
    perk: "Weekend energy, race-day focus, and pure excitement",
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: "🚗",
    label: "Classic Vibes",
    perk: "Turning vintage elegance into a personality trait",
    color: "from-teal-400 to-emerald-500",
  },
  {
    icon: "✨",
    label: "Iconic Energy",
    perk: "Lighting up every room effortlessly",
    color: "from-violet-500 to-fuchsia-600",
  },
]

interface CardState extends CardItem {
  uniqueId: number
  isFlipped: boolean
  isMatched: boolean
}

export const GameCatchStars: React.FC = () => {
  const [cards, setCards] = useState<CardState[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [lastMatchedPerk, setLastMatchedPerk] = useState<{ title: string; perk: string; icon: string } | null>(null)
  const [hasWon, setHasWon] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isCheckingRef = useRef(false)

  // Initialize and shuffle deck
  const initGame = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    isCheckingRef.current = false
    const deck: CardState[] = []
    let counter = 0

    CARDS_DATA.forEach((card, idx) => {
      // 2 cards per pair
      deck.push({
        ...card,
        id: idx,
        uniqueId: counter++,
        isFlipped: false,
        isMatched: false,
      })
      deck.push({
        ...card,
        id: idx,
        uniqueId: counter++,
        isFlipped: false,
        isMatched: false,
      })
    })

    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }

    setCards(deck)
    setFlippedIndices([])
    setMoves(0)
    setMatchedPairs(0)
    setSeconds(0)
    setTimerActive(false)
    setLastMatchedPerk(null)
    setHasWon(false)
  }

  useEffect(() => {
    initGame()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (timerActive && !hasWon) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerActive, hasWon])

  // Handle Card Click with zero-latency flip and buttery-smooth match resolution
  const handleCardClick = (index: number) => {
    if (
      isCheckingRef.current ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length >= 2
    ) {
      return
    }

    // Start timer on first move
    if (!timerActive) {
      setTimerActive(true)
    }

    // Zero-latency synthesized soft tactile click
    sounds.playClick()

    // Flip the tapped card immediately for 0ms touch latency
    const newCards = [...cards]
    newCards[index].isFlipped = true
    setCards(newCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      isCheckingRef.current = true
      setMoves((m) => m + 1)
      const [firstIdx, secondIdx] = newFlipped
      const firstCard = newCards[firstIdx]
      const secondCard = newCards[secondIdx]

      // Wait 260ms for second card's 3D flip animation to finish rendering cleanly
      setTimeout(() => {
        if (firstCard.id === secondCard.id) {
          // MATCH FOUND!
          sounds.playMatch()
          triggerMatchSparkle(0.5, 0.45)

          setCards((prev) => {
            const updated = [...prev]
            if (updated[firstIdx]) updated[firstIdx].isMatched = true
            if (updated[secondIdx]) updated[secondIdx].isMatched = true
            return updated
          })
          setFlippedIndices([])
          isCheckingRef.current = false

          setMatchedPairs((prev) => {
            const next = prev + 1
            if (next === CARDS_DATA.length) {
              // GAME WON!
              setHasWon(true)
              setTimerActive(false)
              setTimeout(() => {
                sounds.playFanfare()
                triggerFireworks()
              }, 300)
            }
            return next
          })

          setLastMatchedPerk({
            title: firstCard.label,
            perk: firstCard.perk,
            icon: firstCard.icon,
          })
        } else {
          // NO MATCH -> flip back after a brief pause
          setTimeout(() => {
            setCards((prev) => {
              const reverted = [...prev]
              if (reverted[firstIdx] && !reverted[firstIdx].isMatched) reverted[firstIdx].isFlipped = false
              if (reverted[secondIdx] && !reverted[secondIdx].isMatched) reverted[secondIdx].isFlipped = false
              return reverted
            })
            setFlippedIndices([])
            isCheckingRef.current = false
          }, 650)
        }
      }, 260)
    }
  }

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Calculate rating based on moves
  const getRating = () => {
    if (moves <= 8) return "⭐⭐⭐ Genius!"
    if (moves <= 14) return "⭐⭐ Mastermind!"
    return "⭐ Great Job!"
  }

  return (
    <div className="relative rounded-3xl p-4 sm:p-6 md:p-10 glass-panel space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Interactive Mini-Game 2
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
            Memory Match 🎴
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Test your sharpness! Flip and pair up matching icons to reveal your traits.
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-pink-50 border border-pink-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 text-pink-800 shadow-xs">
            <Timer className="w-4 h-4 text-pink-500" />
            <span>{formatTime(seconds)}</span>
          </div>

          <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 text-purple-800 shadow-xs">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{moves} Moves</span>
          </div>

          <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 text-emerald-800 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{matchedPairs} / {CARDS_DATA.length}</span>
          </div>

          <button
            onClick={initGame}
            className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-pink-50 text-slate-600 hover:text-slate-900 border border-pink-200 transition-colors shadow-xs cursor-pointer active:scale-95 touch-manipulation select-none"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trait Status Slot - Fixed min-height eliminates all layout shift so card grid never moves */}
      <div className="min-h-[50px] sm:min-h-[54px] flex items-center">
        {lastMatchedPerk && !hasWon ? (
          <div className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border border-pink-200 flex items-center gap-2.5 sm:gap-3 animate-fade-in shadow-xs">
            <span className="text-xl sm:text-2xl shrink-0">{lastMatchedPerk.icon}</span>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-bold text-pink-800 uppercase tracking-wider block">
                Trait Unlocked: {lastMatchedPerk.title}
              </span>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium truncate">
                {lastMatchedPerk.perk}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full px-3.5 sm:px-4 py-2 rounded-2xl bg-white/40 border border-pink-100/60 flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Flip any 2 cards to discover Rangoli's signature sparkle ✨</span>
            <span className="text-[11px] text-pink-400 font-semibold hidden sm:inline">6 pairs total</span>
          </div>
        )}
      </div>

      {/* Card Grid (4 cols on tablet/desktop, 3 on mobile) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-2xl mx-auto pt-1">
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched

          return (
            <button
              type="button"
              key={card.uniqueId}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || isCheckingRef.current}
              aria-label={`Card: ${card.label}`}
              className={`aspect-square w-full rounded-2xl cursor-pointer select-none perspective-1000 touch-manipulation p-0 bg-transparent border-0 text-left outline-none ${
                !card.isMatched && !isCheckingRef.current && "active:scale-95"
              }`}
            >
              <div
                className="relative w-full h-full rounded-2xl shadow-sm preserve-3d will-change-transform"
                style={{
                  transition: "transform 260ms cubic-bezier(0.4, 0, 0.2, 1)",
                  WebkitTransition: "-webkit-transform 260ms cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
                  WebkitTransform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Back of Card (Hidden Face) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 border-2 border-white flex flex-col items-center justify-center text-white shadow-md select-none"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-base sm:text-lg font-bold">
                    ✨
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-1 text-white/90">
                    Rangoli
                  </span>
                </div>

                {/* Front of Card (Revealed Face) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-2xl bg-white border-2 flex flex-col items-center justify-center p-1.5 sm:p-2 shadow-md transition-colors select-none ${
                    card.isMatched
                      ? "border-emerald-400 bg-emerald-50/70 ring-2 ring-emerald-300/60"
                      : "border-pink-300"
                  }`}
                  style={{
                    transform: "rotateY(180deg)",
                    WebkitTransform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <span className="text-2xl sm:text-4xl">
                    {card.icon}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-slate-800 text-center mt-1 truncate max-w-full px-1">
                    {card.label}
                  </span>
                  {card.isMatched && (
                    <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 uppercase tracking-tight mt-0.5">
                      ✓ Matched
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Victory Celebration Card */}
      {hasWon && (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-pink-100 via-rose-100 to-purple-100 border-2 border-pink-300 text-center space-y-4 animate-fade-in shadow-xl max-w-xl mx-auto">
          <div className="text-5xl animate-bounce">🏆🎉✨</div>
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-slate-900">
              Perfection! You Won!
            </h4>
            <p className="text-pink-700 font-bold text-sm">
              Solved in {moves} moves • Finished in {formatTime(seconds)}
            </p>
            <p className="text-xs text-slate-600 font-medium pt-1">
              Performance Rank: <strong className="text-purple-700">{getRating()}</strong>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={initGame}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={() => {
                sounds.playFanfare()
                triggerFireworks()
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-pink-50 text-pink-700 font-bold text-sm border border-pink-200 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-500" />
              More Fireworks!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameCatchStars
