import React, { useState, useEffect, useRef } from "react"
import {
  triggerFireworks,
  triggerSideCannons,
  triggerConfettiBurst,
  triggerStars,
} from "@/lib/confettiTriggers"
import { Volume2, VolumeX, Heart, Signal, Wifi, Battery } from "lucide-react"
import notificationSfx from "@/assets/notification-sound.mp3"
import confettiSfx from "@/assets/confetti.mp3"
import { playAudio, getAudio, playNotificationSound, unlockAudio } from "@/lib/audioManager"
import { sounds } from "@/lib/soundEffects"

interface HeroSectionProps {
  onLaunchBalloons: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

interface Scene {
  type: "bubble-sent" | "bubble-received" | "system" | "typing" | "signature"
  content: string
  delay: number
  typewriter?: boolean
}

// "Didi" receives messages - her sibling sends them.
// "sent" = right-side pink bubble (from sibling / us)
// "received" = left-side grey bubble (would be Didi reading, but here used for narration from Didi's POV)
// "system" = centered celebration text
const SCENES: Scene[] = [
  { type: "system",        content: "💬 19th November",                                               delay: 400  },
  { type: "bubble-sent",  content: "Hey Rangoli 👋",                                                  delay: 700  },
  { type: "bubble-sent",  content: "So... it's 19th November.",                                     delay: 1100 },
  { type: "bubble-sent",  content: "Which means...",                                                delay: 1100 },
  { type: "bubble-sent",  content: "🎂 It's your birthday!",                                         delay: 800  },
  { type: "bubble-sent",  content: "And honestly, I couldn't just send a plain message for someone like you.", delay: 1400 },
  { type: "bubble-sent",  content: "You make chai taste better, race weekends more exciting, and every ordinary day feel more interesting.", delay: 1500 },
  { type: "bubble-sent",  content: "From your love for F1 and Carlos Sainz to your fascination with classic cars, you have a vibe that is effortlessly cool.", delay: 1700 },
  { type: "bubble-received", content: "😄✨",                                                       delay: 1100 },
  { type: "bubble-sent",  content: "And the best part? You do it with this warm, beautiful energy that stays with people.", delay: 1500 },
  { type: "bubble-sent",  content: "So today, I hope your day is as lovely as your smile and as memorable as the best lap on a perfect track.", delay: 1700 },
  { type: "bubble-sent",  content: "May this year bring you endless chai breaks, dream drives, all your goals, and all the happiness you deserve.", delay: 1700 },
  { type: "signature",    content: "Happy Birthday, Rangoli. Wishing you a year full of joy, sparkle, and beautiful memories.", delay: 1400 },
]

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchBalloons,
  soundEnabled,
  onToggleSound,
}) => {
  const [visibleScenes, setVisibleScenes] = useState<number[]>([])
  const [typewriterText, setTypewriterText] = useState("")
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [allDone, setAllDone] = useState(false)
  const [started, setStarted] = useState(false)
  const [showTypingDots, setShowTypingDots] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  // Ref so setTimeout closures always read the live soundEnabled value
  const soundEnabledRef = useRef(soundEnabled)
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // Keep ref in sync whenever the toggle changes
  useEffect(() => {
    soundEnabledRef.current = soundEnabled
  }, [soundEnabled])

  // Instant auto-scroll to bottom when new messages appear or typing starts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleScenes, showTypingDots])

  const activeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isCancelledRef = useRef(false)

  // Cleanup pending timer on unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true
      if (activeTimerRef.current) clearTimeout(activeTimerRef.current)
    }
  }, [])

  const skipStory = () => {
    isCancelledRef.current = true
    if (activeTimerRef.current) clearTimeout(activeTimerRef.current)
    setVisibleScenes(SCENES.map((_, i) => i))
    setShowTypingDots(false)
    setAllDone(true)
    if (soundEnabledRef.current) {
      sounds.playConfetti()
    }
    triggerFireworks()
    onLaunchBalloons()
    setTimeout(() => {
      triggerStars()
    }, 600)
  }

  // Strictly sequential scene execution to prevent timers bunching up or skipping animations
  const runScene = (idx: number) => {
    if (isCancelledRef.current) return
    if (idx >= SCENES.length) {
      setAllDone(true)
      return
    }

    const scene = SCENES[idx]

    if (scene.type === "bubble-sent" || scene.type === "bubble-received") {
      setShowTypingDots(true)
      const typingDuration = 350

      activeTimerRef.current = setTimeout(() => {
        if (isCancelledRef.current) return
        setShowTypingDots(false)
        setVisibleScenes(prev => [...prev, idx])

        // Audible notification sound on message appearance
        if (soundEnabledRef.current) {
          playNotificationSound(1.0)
        }

        // Wait scene.delay before starting next message
        activeTimerRef.current = setTimeout(() => {
          runScene(idx + 1)
        }, scene.delay)
      }, typingDuration)
    } else if (scene.type === "signature") {
      setVisibleScenes(prev => [...prev, idx])
      setAllDone(true)
      if (soundEnabledRef.current) {
        sounds.playFanfare()
      }
      setTimeout(() => {
        triggerFireworks()
        onLaunchBalloons()
      }, 400)
      setTimeout(() => {
        triggerStars()
      }, 1200)
    } else {
      // System message
      setVisibleScenes(prev => [...prev, idx])
      activeTimerRef.current = setTimeout(() => {
        runScene(idx + 1)
      }, scene.delay)
    }
  }

  const startStory = () => {
    if (started) return
    setStarted(true)
    isCancelledRef.current = false

    // Unlock and decode notification audio on user touch gesture
    unlockAudio()

    // Immediate audible feedback
    if (soundEnabledRef.current) {
      playNotificationSound(1.0)
    }
    triggerConfettiBurst(0.5, 0.5)

    // Execute first scene sequentially
    runScene(0)
  }

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
      {/* Page ambient glow - scoped overflow to prevent touch scroll lock in mobile Safari */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 via-rose-50/40 to-purple-100/50" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-pink-300/20 via-rose-200/15 to-purple-200/15 blur-[100px] rounded-full" />
      </div>

      {/* Sound toggle - floating pill outside phone with safe area padding */}
      <button
        onClick={() => {
          unlockAudio()
          onToggleSound()
        }}
        onTouchStart={() => unlockAudio()}
        className="absolute top-[max(1rem,env(safe-area-inset-top,1rem))] right-[max(1rem,env(safe-area-inset-right,1rem))] z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-pink-200 hover:bg-pink-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-sm backdrop-blur-md active:scale-95 touch-manipulation select-none"
      >
        {soundEnabled ? (
          <><Volume2 className="w-3.5 h-3.5 text-pink-500" /><span className="hidden sm:inline">Chimes On</span></>
        ) : (
          <><VolumeX className="w-3.5 h-3.5 text-slate-400" /><span className="hidden sm:inline">Muted</span></>
        )}
      </button>

      {/* ── Phone Frame ── */}
      <div className="relative z-10 w-full max-w-[390px] mx-auto px-1 sm:px-0">
        {/* Phone shell */}
        <div
          className="relative rounded-[2.4rem] sm:rounded-[3rem] overflow-hidden shadow-2xl sm:shadow-[0_40px_80px_-10px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.6)]"
          style={{
            background: "linear-gradient(145deg, #e8e8ed 0%, #d1d1d6 40%, #c7c7cc 100%)",
          }}
        >
          {/* Phone outer bezel padding */}
          <div className="p-2 sm:px-[12px] sm:pt-[12px] sm:pb-[16px]">

            {/* Inner screen */}
            <div
              className="rounded-[2rem] sm:rounded-[2.4rem] overflow-hidden flex flex-col h-[74dvh] min-h-[500px] max-h-[660px]"
              style={{
                background: "#f2f2f7",
              }}
            >
              {/* Status Bar */}
              <div className="flex items-center justify-between px-6 pt-3 pb-1 flex-shrink-0 bg-[#f2f2f7]">
                <span className="text-[11px] font-semibold text-slate-800">{timeStr}</span>
                <div className="flex items-center gap-1 text-slate-800">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* iMessage Header */}
              <div className="flex flex-col items-center py-2.5 sm:py-3 px-4 flex-shrink-0 bg-[#f2f2f7] border-b border-black/5 text-slate-100">
                {/* Avatar */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-xl sm:text-2xl shadow-md mb-1">
                  R
                </div>
                <p className="text-[13px] font-semibold text-slate-900">Rangoli</p>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-slate-500">Happy Birthday! 🌸</p>
                  {started && !allDone && (
                    <button
                      onClick={skipStory}
                      className="text-[10px] font-bold text-pink-600 bg-pink-100 hover:bg-pink-200 px-2 py-0.5 rounded-full cursor-pointer active:scale-95 transition-all touch-manipulation select-none"
                    >
                      Read All ⚡
                    </button>
                  )}
                </div>
              </div>

              {/* ── Messages Area ── */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-3 sm:px-3.5 py-4 space-y-1.5 scroll-touch scrollbar-none"
                style={{ background: "#f2f2f7" }}
              >
                {/* Start CTA */}
                {!started && (
                  <div className="flex flex-col items-center justify-center h-full gap-5 py-8">
                    <div className="text-5xl animate-bounce drop-shadow-lg">🎂</div>
                    <button
                      type="button"
                      onClick={() => {
                        unlockAudio()
                        startStory()
                      }}
                      onTouchStart={() => {
                        unlockAudio()
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault()
                        unlockAudio()
                        startStory()
                      }}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-extrabold text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer touch-manipulation select-none"
                    >
                      Open your wish ✨
                    </button>
                    <p className="text-[11px] text-slate-400 animate-pulse">tap to read</p>
                  </div>
                )}

                {/* Messages */}
                {started && SCENES.map((scene, idx) => {
                  if (!visibleScenes.includes(idx)) return null
                  const isTypewriter = scene.typewriter

                  if (scene.type === "system") {
                    return (
                      <div key={idx} className="animate-[fadeSlideIn_0.4s_ease-out_forwards] flex justify-center my-3">
                        <span className="text-[11px] font-semibold text-slate-500 bg-black/6 px-3 py-1 rounded-full">
                          {scene.content}
                        </span>
                      </div>
                    )
                  }

                  if (scene.type === "bubble-sent") {
                    return (
                      <div key={idx} className="animate-[fadeSlideIn_0.35s_ease-out_forwards] flex justify-end">
                        <div
                          className="max-w-[75%] px-3.5 py-2.5 rounded-[18px] rounded-br-[4px] text-white text-[14px] leading-snug font-medium shadow-sm"
                          style={{
                            background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
                          }}
                        >
                          {isTypewriter ? (
                            <>
                              {typewriterText}
                              {!typewriterDone && (
                                <span className="inline-block w-0.5 h-3.5 bg-white/80 ml-0.5 animate-pulse align-middle rounded-full" />
                              )}
                            </>
                          ) : scene.content}
                        </div>
                      </div>
                    )
                  }

                  if (scene.type === "bubble-received") {
                    return (
                      <div key={idx} className="animate-[fadeSlideIn_0.35s_ease-out_forwards] flex justify-start">
                        <div className="max-w-[75%] px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] bg-white text-slate-800 text-[14px] leading-snug font-medium shadow-sm border border-black/5">
                          {scene.content}
                        </div>
                      </div>
                    )
                  }

                  if (scene.type === "signature") {
                    return (
                      <div key={idx} className="animate-[fadeSlideIn_0.6s_ease-out_forwards] flex flex-col items-center gap-3 py-5">
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
                        <p
                          className="font-handwriting text-xl text-pink-600 font-bold text-center px-2"
                          style={{ fontFamily: "'Dancing Script', 'Pacifico', cursive" }}
                        >
                          {scene.content}
                        </p>
                        <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <button
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect()
                              if (soundEnabledRef.current) {
                                playAudio(confettiSfx, 0.85)
                              }
                              triggerConfettiBurst(
                                (rect.left + rect.width / 2) / window.innerWidth,
                                (rect.top + rect.height / 2) / window.innerHeight
                              )
                              triggerFireworks()
                            }}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer touch-manipulation select-none"
                          >
                            Celebrate! 🎉
                          </button>
                          <button
                            onClick={() => {
                              if (soundEnabledRef.current) {
                                playAudio(confettiSfx, 0.85)
                              }
                              triggerSideCannons()
                              onLaunchBalloons()
                            }}
                            className="px-4 py-2 rounded-full bg-white border border-pink-300 text-slate-700 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm touch-manipulation select-none"
                          >
                            Balloons! 🎈
                          </button>
                        </div>
                      </div>
                    )
                  }

                  return null
                })}

                {/* Typing indicator dots */}
                {showTypingDots && started && (
                  <div className="flex justify-end animate-[fadeSlideIn_0.2s_ease-out_forwards]">
                    <div
                      className="px-4 py-3 rounded-[18px] rounded-br-[4px] flex gap-1 items-center"
                      style={{ background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)" }}
                    >
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* iMessage input bar */}
              <div className="flex-shrink-0 bg-[#f2f2f7] border-t border-black/8 px-3 py-2">
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-black/5">
                  <span className="text-[13px] text-slate-400 flex-1 select-none">iMessage</span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">↑</span>
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center py-2 bg-[#f2f2f7]">
                <div className="w-24 h-1 bg-slate-800/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Side buttons (volume) */}
        <div className="absolute left-[-3px] top-[80px] w-[4px] h-8 bg-gradient-to-b from-[#c8c8ce] to-[#b8b8be] rounded-l-sm shadow-inner" />
        <div className="absolute left-[-3px] top-[120px] w-[4px] h-8 bg-gradient-to-b from-[#c8c8ce] to-[#b8b8be] rounded-l-sm shadow-inner" />
        {/* Power button */}
        <div className="absolute right-[-3px] top-[100px] w-[4px] h-12 bg-gradient-to-b from-[#c8c8ce] to-[#b8b8be] rounded-r-sm shadow-inner" />
      </div>

      {/* Floating decorative emojis outside the phone */}
      {allDone && (
        <>
          <div className="fixed top-12 left-4 text-3xl animate-float opacity-70 pointer-events-none select-none">🎈</div>
          <div className="fixed top-16 right-6 text-3xl animate-float opacity-70 pointer-events-none select-none" style={{ animationDelay: "1.2s" }}>✨</div>
          <div className="fixed bottom-20 left-6 text-2xl animate-float opacity-60 pointer-events-none select-none" style={{ animationDelay: "2s" }}>🌸</div>
          <div className="fixed bottom-16 right-8 text-3xl animate-float opacity-70 pointer-events-none select-none" style={{ animationDelay: "0.6s" }}>🎂</div>
        </>
      )}
    </section>
  )
}
export default HeroSection
