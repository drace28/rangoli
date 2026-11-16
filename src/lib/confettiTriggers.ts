import confetti from "canvas-confetti"

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768

// Tracking references to prevent duplicate concurrent animation loops when buttons are tapped repeatedly
let activeFireworksTimer: ReturnType<typeof setInterval> | null = null
let activeCannonFrame: number | null = null
let activeStarTimeouts: ReturnType<typeof setTimeout>[] = []
let activeCustomShapeTimeout: ReturnType<typeof setTimeout> | null = null
let activeEmojiTimeout: ReturnType<typeof setTimeout> | null = null

// Cached shapes to prevent heavy SVG path parsing on every tap
let cachedShapes: any[] | null = null
const getCachedCustomShapes = () => {
  if (!cachedShapes) {
    const scalar = 2
    cachedShapes = [
      confetti.shapeFromPath({ path: "M0 10 L5 0 L10 10z" }),
      confetti.shapeFromPath({ path: "M0 0 L10 0 L10 10 L0 10 Z" }),
      confetti.shapeFromPath({ path: "M5 0 A5 5 0 1 0 5 10 A5 5 0 1 0 5 0 Z" }),
      confetti.shapeFromPath({ path: "M5 0 L10 10 L0 10 Z" }),
    ]
  }
  return cachedShapes
}

// Cached emoji shapes to avoid re-rendering off-screen canvas glyphs on every click
let cachedEmojiShapes: any[] | null = null
const getCachedEmojiShapes = () => {
  if (!cachedEmojiShapes) {
    const scalar = 2
    cachedEmojiShapes = [
      confetti.shapeFromText({ text: "🎂", scalar }),
      confetti.shapeFromText({ text: "✨", scalar }),
      confetti.shapeFromText({ text: "💖", scalar }),
      confetti.shapeFromText({ text: "👑", scalar }),
    ]
  }
  return cachedEmojiShapes
}

export const triggerConfettiBurst = (x = 0.5, y = 0.5) => {
  const mobile = isMobile()
  confetti({
    particleCount: mobile ? 35 : 65,
    spread: mobile ? 55 : 70,
    ticks: mobile ? 45 : 60,
    origin: { x, y },
    colors: ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#6366f1", "#f59e0b"],
    zIndex: 9999,
    disableForReducedMotion: true,
  })
}

// Lightweight micro-sparkle for card match without GPU stall or lag
export const triggerMatchSparkle = (x = 0.5, y = 0.5) => {
  const mobile = isMobile()
  confetti({
    particleCount: mobile ? 12 : 18,
    spread: 45,
    startVelocity: 16,
    ticks: 30,
    origin: { x, y },
    colors: ["#ec4899", "#a855f7", "#34d399", "#fbbf24"],
    zIndex: 9999,
    disableForReducedMotion: true,
  })
}

export const triggerFireworks = () => {
  // Cancel previous running fireworks loop if tapped again
  if (activeFireworksTimer) {
    clearInterval(activeFireworksTimer)
    activeFireworksTimer = null
  }

  const mobile = isMobile()
  const duration = mobile ? 2000 : 3200
  const stepInterval = mobile ? 280 : 240
  const animationEnd = Date.now() + duration
  const defaults = {
    startVelocity: mobile ? 24 : 30,
    spread: 360,
    ticks: mobile ? 40 : 55,
    zIndex: 9999,
    disableForReducedMotion: true,
  }

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min

  activeFireworksTimer = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      if (activeFireworksTimer) clearInterval(activeFireworksTimer)
      activeFireworksTimer = null
      return
    }

    const baseCount = mobile ? 22 : 36
    const particleCount = Math.max(10, Math.floor(baseCount * (timeLeft / duration)))

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.15, 0.45), y: Math.random() * 0.4 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.55, 0.85), y: Math.random() * 0.4 },
    })
  }, stepInterval)
}

export const triggerSideCannons = () => {
  // Cancel previous running cannon frame if tapped again
  if (activeCannonFrame) {
    cancelAnimationFrame(activeCannonFrame)
    activeCannonFrame = null
  }

  const mobile = isMobile()
  const duration = mobile ? 1400 : 2000
  const throttleMs = mobile ? 60 : 45
  const end = Date.now() + duration
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1", "#ec4899"]
  let lastTime = 0

  const frame = (time: number) => {
    if (Date.now() > end) {
      activeCannonFrame = null
      return
    }

    if (time - lastTime > throttleMs) {
      lastTime = time
      const count = mobile ? 2 : 4
      const ticks = mobile ? 42 : 55

      confetti({
        particleCount: count,
        angle: 60,
        spread: 50,
        startVelocity: mobile ? 45 : 60,
        ticks,
        origin: { x: 0, y: 0.65 },
        colors,
        zIndex: 9999,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: count,
        angle: 120,
        spread: 50,
        startVelocity: mobile ? 45 : 60,
        ticks,
        origin: { x: 1, y: 0.65 },
        colors,
        zIndex: 9999,
        disableForReducedMotion: true,
      })
    }

    activeCannonFrame = requestAnimationFrame(frame)
  }

  activeCannonFrame = requestAnimationFrame(frame)
}

export const triggerStars = () => {
  // Clear previous star timeouts
  activeStarTimeouts.forEach(clearTimeout)
  activeStarTimeouts = []

  const mobile = isMobile()
  const defaults = {
    spread: 360,
    ticks: mobile ? 38 : 48,
    gravity: 0,
    decay: 0.94,
    startVelocity: mobile ? 22 : 28,
    colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
    zIndex: 9999,
    disableForReducedMotion: true,
  }

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: mobile ? 16 : 28,
      scalar: 1.15,
      shapes: ["star"],
    })

    confetti({
      ...defaults,
      particleCount: mobile ? 8 : 14,
      scalar: 0.7,
      shapes: ["circle"],
    })
  }

  shoot()
  activeStarTimeouts.push(setTimeout(shoot, 110))
  if (!mobile) {
    activeStarTimeouts.push(setTimeout(shoot, 210))
  }
}

export const triggerCustomShapes = () => {
  if (activeCustomShapeTimeout) {
    clearTimeout(activeCustomShapeTimeout)
    activeCustomShapeTimeout = null
  }

  const mobile = isMobile()
  const shapes = getCachedCustomShapes()
  const defaults = {
    spread: 360,
    ticks: mobile ? 40 : 52,
    gravity: 0.1,
    decay: 0.95,
    startVelocity: mobile ? 18 : 22,
    shapes,
    scalar: 1.8,
    zIndex: 9999,
    disableForReducedMotion: true,
  }

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: mobile ? 16 : 24,
    })

    confetti({
      ...defaults,
      particleCount: mobile ? 8 : 14,
      scalar: 0.8,
      shapes: ["circle"],
    })
  }

  shoot()
  if (!mobile) {
    activeCustomShapeTimeout = setTimeout(shoot, 120)
  }
}

export const triggerEmoji = (originX = 0.5, originY = 0.6) => {
  if (typeof document === "undefined") return

  const emojis = ["🎂", "✨", "💖", "👑", "🎉", "🦄", "🌟", "🍰", "🎈", "🌸"]
  const mobile = isMobile()
  const count = mobile ? 12 : 20
  const container = document.body

  const startX = originX * window.innerWidth
  const startY = originY * window.innerHeight

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span")
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)]
    el.style.position = "fixed"
    el.style.left = `${startX}px`
    el.style.top = `${startY}px`
    el.style.zIndex = "99999"
    el.style.pointerEvents = "none"
    el.style.userSelect = "none"
    el.style.fontSize = mobile ? "24px" : "32px"
    el.style.willChange = "transform, opacity"
    el.style.transform = "translate3d(-50%, -50%, 0)"

    container.appendChild(el)

    const angle = Math.random() * Math.PI + Math.PI // upward hemisphere
    const distance = (mobile ? 140 : 220) * (0.6 + Math.random() * 0.8)
    const endX = Math.cos(angle) * distance
    const endY = Math.sin(angle) * distance + (mobile ? 60 : 100)
    const rot = (Math.random() - 0.5) * 360

    const anim = el.animate(
      [
        {
          transform: "translate3d(-50%, -50%, 0) scale(0.4) rotate(0deg)",
          opacity: 1,
        },
        {
          transform: `translate3d(calc(-50% + ${endX * 0.5}px), calc(-50% + ${endY * 0.4}px), 0) scale(1.25) rotate(${rot * 0.5}deg)`,
          opacity: 1,
          offset: 0.5,
        },
        {
          transform: `translate3d(calc(-50% + ${endX}px), calc(-50% + ${endY + (mobile ? 50 : 80)}px), 0) scale(0.9) rotate(${rot}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: mobile ? 1000 : 1250,
        easing: "cubic-bezier(0.2, 0.8, 0.4, 1)",
        fill: "forwards",
      }
    )

    anim.onfinish = () => {
      el.remove()
    }
  }
}

let lastRandomTap = 0

export const triggerRandom = (originX = 0.5, originY = 0.6) => {
  const now = Date.now()
  const mobile = isMobile()

  // If user is spamming the button rapidly, reset stale particles to prevent canvas choking
  if (now - lastRandomTap < 260) {
    try {
      confetti.reset()
    } catch (_) {}
  }
  lastRandomTap = now

  const presets = [
    // Preset 1: Gold & Pink Star Explosion
    () => {
      confetti({
        particleCount: mobile ? 22 : 40,
        spread: 360,
        startVelocity: mobile ? 22 : 30,
        ticks: mobile ? 36 : 48,
        origin: { x: originX, y: originY },
        shapes: ["star"],
        colors: ["#FFE400", "#FF69B4", "#FF1493", "#FFD700"],
        zIndex: 9999,
        disableForReducedMotion: true,
      })
    },
    // Preset 2: Double Inward Fountains
    () => {
      confetti({
        particleCount: mobile ? 14 : 24,
        angle: 60,
        spread: 55,
        startVelocity: mobile ? 26 : 36,
        ticks: mobile ? 38 : 50,
        origin: { x: Math.max(0.1, originX - 0.2), y: originY },
        colors: ["#a855f7", "#ec4899", "#3b82f6"],
        zIndex: 9999,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: mobile ? 14 : 24,
        angle: 120,
        spread: 55,
        startVelocity: mobile ? 26 : 36,
        ticks: mobile ? 38 : 50,
        origin: { x: Math.min(0.9, originX + 0.2), y: originY },
        colors: ["#a855f7", "#ec4899", "#3b82f6"],
        zIndex: 9999,
        disableForReducedMotion: true,
      })
    },
    // Preset 3: Cyber Party Pop
    () => {
      confetti({
        particleCount: mobile ? 24 : 42,
        spread: 80,
        startVelocity: mobile ? 24 : 32,
        ticks: mobile ? 36 : 48,
        origin: { x: originX, y: originY },
        colors: ["#06b6d4", "#f43f5e", "#10b981", "#fbbf24"],
        shapes: ["circle", "square"],
        zIndex: 9999,
        disableForReducedMotion: true,
      })
    },
    // Preset 4: Upward Geyser
    () => {
      confetti({
        particleCount: mobile ? 22 : 38,
        angle: 90,
        spread: 60,
        startVelocity: mobile ? 28 : 38,
        ticks: mobile ? 40 : 52,
        origin: { x: originX, y: Math.min(0.85, originY + 0.1) },
        colors: ["#ec4899", "#f43f5e", "#d946ef", "#a855f7"],
        shapes: ["star", "circle"],
        zIndex: 9999,
        disableForReducedMotion: true,
      })
    },
  ]

  const randomPreset = presets[Math.floor(Math.random() * presets.length)]
  randomPreset()
}
