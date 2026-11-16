import { getAudioContext } from "./audioManager";

// Synthesized Web Audio sound effects for instant, lightweight, zero-latency feedback
class SoundEffects {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private initCtx() {
    this.ctx = getAudioContext();
  }

  public toggleSound(enabled?: boolean) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    return this.soundEnabled;
  }

  public isEnabled() {
    return this.soundEnabled;
  }

  // Soft chime / pop on button click
  public playClick() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Crisp celebratory pair match chime (zero-latency synthesized E5 -> A5 -> C#6)
  public playMatch() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [659.25, 880, 1108.73]; // E5, A5, C#6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + idx * 0.055;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  // Balloon pop sound
  public playPop() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  // Celebratory fanfare / win sound
  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime + idx * 0.1;
      const duration = 0.35;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Candle blowing out wind sound + melody
  public playBlowCandles() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Breath / white noise puff
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.45);

    // Followed by celebratory chime
    setTimeout(() => {
      this.playFanfare();
    }, 400);
  }


  // Confetti burst - rapid sparkle tones with shimmer decay
  public playConfetti() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Layer 1: rapid ascending pings (confetti pop feel)
    const pings = [880, 1108.73, 1318.51, 1567.98, 1760, 2093]; // A5→C7
    pings.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + i * 0.055;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.04, t + 0.12);

      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.23);
    });

    // Layer 2: shimmer - high-freq noise burst
    const bufSize = Math.floor(this.ctx.sampleRate * 0.18);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const hpf = this.ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 5000;

    const shimmerGain = this.ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    noise.connect(hpf);
    hpf.connect(shimmerGain);
    shimmerGain.connect(this.ctx.destination);
    noise.start();
    noise.stop(this.ctx.currentTime + 0.19);
  }
}

export const sounds = new SoundEffects();
