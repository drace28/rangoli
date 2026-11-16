import notificationSfx from "@/assets/notification-sound.mp3"

// Cache for HTMLAudioElement instances
const audioCache = new Map<string, HTMLAudioElement>()

let audioCtx: AudioContext | null = null
let notificationBuffer: AudioBuffer | null = null
let notificationArrayBufferPromise: Promise<ArrayBuffer | null> | null = null
let htmlNotificationAudio: HTMLAudioElement | null = null

// Immediately fetch the 16 kB notification MP3 into memory on script load
if (typeof window !== "undefined") {
  notificationArrayBufferPromise = fetch(notificationSfx)
    .then(res => res.arrayBuffer())
    .catch(err => {
      console.warn("Notification sound fetch note:", err)
      return null
    })
}

// Single unified Web Audio context getter
export const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

// Decodes the preloaded notification sound into an AudioBuffer
const decodeNotificationBuffer = async (ctx: AudioContext) => {
  if (notificationBuffer) return notificationBuffer
  try {
    const arrayBuf = notificationArrayBufferPromise ? await notificationArrayBufferPromise : null
    if (arrayBuf && !notificationBuffer) {
      // slice(0) avoids detaching the buffer
      notificationBuffer = await ctx.decodeAudioData(arrayBuf.slice(0))
    }
  } catch (err) {
    console.warn("Web Audio buffer decode note:", err)
  }
  return notificationBuffer
}

// Global unlock invoked on user touch/click to unlock WebKit audio engine
export const unlockAudio = () => {
  if (typeof window === "undefined") return
  const ctx = getAudioContext()
  if (ctx) {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {})
    }
    // Play 1-sample silent buffer to unlock the iOS Safari hardware audio pipeline
    try {
      const silentBuffer = ctx.createBuffer(1, 1, 22050)
      const source = ctx.createBufferSource()
      source.buffer = silentBuffer
      source.connect(ctx.destination)
      source.start(0)
    } catch (_) {}

    decodeNotificationBuffer(ctx)
  }

  // Also prime HTML5 Audio element
  if (!htmlNotificationAudio) {
    try {
      htmlNotificationAudio = new Audio(notificationSfx)
      htmlNotificationAudio.preload = "auto"
      htmlNotificationAudio.volume = 1.0
      htmlNotificationAudio.play().then(() => {
        if (htmlNotificationAudio) {
          htmlNotificationAudio.pause()
          htmlNotificationAudio.currentTime = 0
        }
      }).catch(() => {})
    } catch (_) {}
  }
}

// Backward compatibility alias
export const unlockAndPreloadNotification = unlockAudio

// Guaranteed synthesized double chime fallback (Apple iMessage style)
const playSynthesizedChime = (ctx: AudioContext, volume = 0.9) => {
  try {
    const t = ctx.currentTime
    // First ping: 880 Hz (A5)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(880, t)
    gain1.gain.setValueAtTime(volume * 0.35, t)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(t)
    osc1.stop(t + 0.13)

    // Second ping: 1318.5 Hz (E6)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(1318.51, t + 0.08)
    gain2.gain.setValueAtTime(volume * 0.45, t + 0.08)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.32)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(t + 0.08)
    osc2.stop(t + 0.33)
  } catch (_) {}
}

// Guaranteed audible notification chime for chat messages across all mobile browsers
export const playNotificationSound = (urlOrVolume?: string | number, maybeVolume = 1.0) => {
  if (typeof window === "undefined") return

  const volume = typeof urlOrVolume === "number" ? urlOrVolume : maybeVolume
  const ctx = getAudioContext()

  // Ensure audio context is running
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {})
  }

  // 1. Primary Method: Web Audio buffer source (decoded notification-sound.mp3)
  if (ctx && notificationBuffer) {
    try {
      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      source.buffer = notificationBuffer
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start(0)
      return
    } catch (_) {}
  }

  // 2. Secondary Method: Primed HTMLAudioElement
  if (htmlNotificationAudio) {
    try {
      htmlNotificationAudio.currentTime = 0
      htmlNotificationAudio.volume = volume
      htmlNotificationAudio.play().catch(() => {
        // If HTML5 audio is blocked by Safari, synthesize chime
        if (ctx) playSynthesizedChime(ctx, volume)
      })
      return
    } catch (_) {}
  }

  // 3. Fallback Method: Standard playAudio
  if (typeof urlOrVolume === "string") {
    playAudio(urlOrVolume, volume)
  }

  // 4. Guaranteed Fail-safe Method: Web Audio synthesized chime
  if (ctx) {
    playSynthesizedChime(ctx, volume)
  }
}

export const playAudio = (url: string, volume = 0.85) => {
  if (typeof window === "undefined") return
  try {
    let audio = audioCache.get(url)
    if (!audio) {
      audio = new Audio(url)
      audio.preload = "none"
      audioCache.set(url, audio)
    }
    audio.volume = volume
    audio.currentTime = 0
    audio.play().catch(() => {})
  } catch (_) {}
}

export const getAudio = (url: string, volume = 0.85): HTMLAudioElement | null => {
  if (typeof window === "undefined") return null
  try {
    let audio = audioCache.get(url)
    if (!audio) {
      audio = new Audio(url)
      audio.preload = "none"
      audioCache.set(url, audio)
    }
    audio.volume = volume
    return audio
  } catch (_) {
    return null
  }
}
