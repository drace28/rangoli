# 🎂 Happy Birthday Rangoli!

An interactive birthday web app built with **React**, **TypeScript**, **Tailwind CSS**, and a celebratory UI designed to make **Rangoli's** special day feel extra magical.

Created to celebrate **Rangoli** on **19th November** with chai-inspired vibes, F1 excitement, classic car energy, confetti, balloon pops, birthday games, and a heartfelt wish designed just for her.

---

## 🚀 Features & Interactive Games

1. **🎂 Interactive Birthday Cake (`InteractiveCake.tsx`)**:
   - Multi-tier illustrated cake with 5 golden flickering candle flames.
   - Blow out candles with gentle wind puff sound effects.
   - Automatic triggers for full-screen fireworks, star showers, and celebratory message.
   - Option to re-light and make endless wishes!

2. **🎈 Pop The Birthday Balloons Mini-Game (`GameBalloonPop.tsx`)**:
   - Floating interactive balloons with 3D depth and shimmer.
   - Popping each balloon triggers pop sounds and bursts confetti at the exact click location.
   - Unveils 6 personalized, legally binding sibling vouchers & perks (Zero-Argument Immunity Pass, Boba Sponsoring Ticket, Full Tech Support Pass, Chore Exemption Card, Aux Cord Monopoly, Supreme Sibling Respect Trophy).

3. **🏆 Sibling Trivia & Bonding Challenge (`GameSiblingQuiz.tsx`)**:
   - 5 witty questions highlighting Varta Didi's wisdom, leadership, and sibling banter.
   - Dynamic scoring system with instant funny commentary on choices.
   - Victory trophy and celebratory fireworks upon completion.

4. **🎰 Didi's Birthday Treat Slot Machine (`GameSpinWheel.tsx`)**:
   - Reel spinner with authentic audio chimes.
   - Randomly lands on perks and demands that younger sibling owes Varta Didi today.
   - Keeps a log of claimed treats for Didi to claim!

5. **🎊 Confetti Celebration Studio (`ConfettiShowcase.tsx`)**:
   - Confetti triggers on every button across the website:
     - 🎆 Fireworks
     - 🎉 Side Cannons
     - ⭐ Gold Star Shower
     - 🔺 Geometric Shapes
     - 🦄🎂 Emoji Shower (Crowns, Cakes, Sparkles)
     - 🎯 Random Angle Bursts
   - Interactive hover & tap canvas.

6. **🎈 Balloons Integration (`balloons-js`)**:
   - Floating celebration balloons and custom text balloons reading *"HAPPY BIRTHDAY VARTA DIDI! 🎂"*.

7. **💌 Sincere Birthday Letter (`PersonalWishCard.tsx`)**:
   - Heartwarming letter written from younger sibling to Varta Didi for 13th October.
   - Interactive seal with love & confetti stamp.

8. **🔊 Zero-Latency Synthesized Web Audio (`soundEffects.ts`)**:
   - Built-in Web Audio API synthesizer for pops, click chimes, candle puffs, and celebratory fanfares without needing external mp3 files.
   - Sound toggle button included in the header.

---

## 🛠️ Project Structure & shadcn Architecture

```text
├── components/ui/         # Default shadcn UI components (also at src/components/ui/)
│   ├── button.tsx         # shadcn Button component with CVA & Radix Slot
│   ├── confetti.tsx       # Canvas Confetti & ConfettiButton
│   ├── balloons.tsx       # Balloons & textBalloons integration
│   └── toggle.tsx         # Radix UI Toggle component
├── src/
│   ├── components/        # Interactive games & birthday sections
│   │   ├── HeroSection.tsx
│   │   ├── InteractiveCake.tsx
│   │   ├── GameBalloonPop.tsx
│   │   ├── GameSiblingQuiz.tsx
│   │   ├── GameSpinWheel.tsx
│   │   ├── ConfettiShowcase.tsx
│   │   ├── PersonalWishCard.tsx
│   │   └── MemoriesGallery.tsx
│   ├── lib/
│   │   ├── utils.ts             # shadcn `cn` utility (clsx + tailwind-merge)
│   │   ├── soundEffects.ts      # Web Audio sound engine
│   │   └── confettiTriggers.ts  # Confetti helper animations
│   ├── types/
│   │   └── balloons-js.d.ts     # TypeScript definitions
│   ├── App.tsx                  # Main App with navigation & tabs
│   ├── main.tsx
│   └── index.css                # Tailwind directives & festive themes
├── tailwind.config.js     # Custom animations & shadcn theme tokens
└── vite.config.ts         # Path alias (@ -> ./src)
```

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:5173/](http://localhost:5173/) to view the celebration!
