import * as React from "react"
import { cn } from "@/lib/utils"

export interface BalloonsProps {
  type?: "default" | "text"
  text?: string
  fontSize?: number
  color?: string
  className?: string
  onLaunch?: () => void
}

export interface BalloonsRef {
  launchAnimation: () => void
}

/**
 * Responsive Happy Birthday text balloons launcher
 * Automatically adapts lines and font size to iPhone / mobile viewports
 * to prevent balloons from stretching off the screen edge.
 */
export const launchResponsiveHappyBirthdayBalloons = async () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 390

  try {
    const { textBalloons } = await import("balloons-js")

    if (width < 540) {
      // iPhone / Mobile: 3 staggered lines, sized dynamically for 375px - 430px screens
      const fontSize = Math.min(36, Math.max(26, Math.floor(width / 11)))
      textBalloons([
        {
          text: "HAPPY",
          fontSize: fontSize + 2,
          color: "#f43f5e",
        },
        {
          text: "BIRTHDAY",
          fontSize: fontSize,
          color: "#ec4899",
        },
        {
          text: "RANGOLI! 🎂",
          fontSize: fontSize + 1,
          color: "#a855f7",
        },
      ])
    } else if (width < 800) {
      // Small Tablet / Landscape Phone: 2 lines
      const fontSize = Math.min(48, Math.max(38, Math.floor(width / 16)))
      textBalloons([
        {
          text: "HAPPY BIRTHDAY",
          fontSize,
          color: "#ec4899",
        },
        {
          text: "RANGOLI! 🎂",
          fontSize: fontSize + 2,
          color: "#a855f7",
        },
      ])
    } else {
      // Desktop: 2 large centered lines
      textBalloons([
        {
          text: "HAPPY BIRTHDAY",
          fontSize: 62,
          color: "#ec4899",
        },
        {
          text: "RANGOLI! 🎂",
          fontSize: 64,
          color: "#a855f7",
        },
      ])
    }
  } catch (err) {
    console.warn("Happy Birthday balloons launch error:", err)
  }

  // Cleanup stray container element after animation finishes
  setTimeout(() => {
    const containers = document.querySelectorAll("text-balloons")
    containers.forEach((el) => {
      if (el.querySelectorAll("text-balloon").length === 0) {
        el.remove()
      }
    })
  }, 9000)
}

const Balloons = React.forwardRef<BalloonsRef, BalloonsProps>(
  ({ type = "default", text, fontSize = 120, color = "#000000", className, onLaunch }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    
    const launchAnimation = React.useCallback(async () => {
      try {
        if (type === "default") {
          const { balloons } = await import("balloons-js")
          balloons()
        } else if (type === "text") {
          const { textBalloons } = await import("balloons-js")
          if (text) {
            textBalloons([
              {
                text,
                fontSize,
                color,
              },
            ])
          } else {
            launchResponsiveHappyBirthdayBalloons()
          }
        }
      } catch (err) {
        console.warn("Balloons trigger error:", err)
      }
      
      if (onLaunch) {
        onLaunch()
      }
    }, [type, text, fontSize, color, onLaunch])

    // Export animation trigger method
    React.useImperativeHandle(ref, () => ({
      launchAnimation,
      ...(containerRef.current || {})
    }), [launchAnimation])

    return <div ref={containerRef} className={cn("balloons-container", className)} />
  }
)
Balloons.displayName = "Balloons"

export { Balloons }
export default Balloons
