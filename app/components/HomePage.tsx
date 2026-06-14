"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiGmail, SiGooglecalendar, SiSlack, SiNotion, SiZoom,
  SiGithub, SiDropbox, SiTrello, SiGooglemeet, SiGoogledrive,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [
  { Icon: SiGmail,          bg: ["#ff5252","#c62828"], glow: "rgba(234,67,53,0.4)",   label: "Gmail"    },
  { Icon: SiGooglecalendar, bg: ["#42a5f5","#1565c0"], glow: "rgba(66,133,244,0.4)",  label: "Calendar" },
  { Icon: SiSlack,          bg: ["#ab47bc","#4a148c"], glow: "rgba(155,89,182,0.4)",  label: "Slack"    },
  { Icon: SiNotion,         bg: ["#2c3e50","#0f172a"], glow: "rgba(255,255,255,0.15)",label: "Notion"   },
  { Icon: SiZoom,           bg: ["#29b6f6","#0288d1"], glow: "rgba(45,140,255,0.4)",  label: "Zoom"     },
  { Icon: SiGithub,         bg: ["#475569","#1e293b"], glow: "rgba(255,255,255,0.1)", label: "GitHub"   },
  { Icon: SiDropbox,        bg: ["#3b82f6","#1d4ed8"], glow: "rgba(43,127,255,0.4)",  label: "Dropbox"  },
  { Icon: SiTrello,         bg: ["#0288d1","#01579b"], glow: "rgba(2,136,209,0.4)",   label: "Trello"   },
  { Icon: SiGooglemeet,     bg: ["#26a69a","#00695c"], glow: "rgba(38,166,154,0.4)",  label: "Meet"     },
  { Icon: SiGoogledrive,    bg: ["#66bb6a","#2e7d32"], glow: "rgba(52,168,83,0.4)",   label: "Drive"    },
];

const SCATTERED_POS = [
  { x: -38, y: -24 }, { x: -18, y: -34 }, { x:   6, y: -36 },
  { x:  28, y: -28 }, { x:  38, y: -12 }, { x: -42, y:  -2 },
  { x: -38, y:  20 }, { x:  40, y:   8 }, { x:  36, y:  28 },
  { x:  -8, y:  32 },
];

const ORBIT_ANGLE = ICONS.map((_, i) => (i / ICONS.length) * Math.PI * 2);
const ORBIT_R = 145;

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

let _audioCtx: AudioContext | null = null;
function getAudio(): AudioContext {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return _audioCtx;
}

function playWhoosh() {
  try {
    const ctx = getAudio();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.setValueAtTime(300, ctx.currentTime);
    filt.frequency.linearRampToValueAtTime(2200, ctx.currentTime + 0.5);
    filt.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    src.connect(filt);
    filt.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (e) {}
}

function playPowerUp() {
  try {
    const ctx = getAudio();
    const notes: [number, number][] = [
      [261.6, 0], [329.6, 0.08], [392, 0.16], [523.2, 0.28], [659.2, 0.4],
    ];
    notes.forEach(([freq, t]) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime + t);
      g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.5);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.5);
    });
  } catch (e) {}
}

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fireworkContainerRef = useRef<HTMLDivElement>(null);
  const [, setMounted] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setMounted(true);
  }, []);

  const iconRands = useMemo(() =>
    ICONS.map((_, i) => ({
      rotOffset: (seededRand(i * 3)     - 0.5) * 30,
      scaleBase:  seededRand(i * 3 + 1) * 0.2,
      floatY:     12 + (i % 3) * 4,
      floatRot:   4  + (i % 2) * 2,
      floatDur:   2.6 + i * 0.15,
    })), []
  );

  const createFireworkBlast = () => {
    const container = fireworkContainerRef.current;
    if (!container) return;

    const colors = ["#ff7b00", "#ff4500", "#ffaa00", "#00f5ff", "#ff007f", "#ffffff"];
    const w = container.clientWidth;
    const h = container.clientHeight;

    for (let f = 0; f < 5; f++) {
      const delay = f * 0.22;
      const startX = gsap.utils.random(w * 0.25, w * 0.75);
      const targetX = startX + gsap.utils.random(-80, 80);
      const targetY = gsap.utils.random(h * 0.25, h * 0.45);
      const burstColor = gsap.utils.random(colors);

      const rocket = document.createElement("div");
      rocket.className = "absolute w-[2px] h-4 rounded-full pointer-events-none";
      rocket.style.backgroundColor = burstColor;
      rocket.style.boxShadow = `0 0 12px ${burstColor}, 0 0 2px #fff`;
      container.appendChild(rocket);

      gsap.fromTo(rocket,
        { x: startX, y: h, scaleY: 1.6 },
        {
          x: targetX,
          y: targetY,
          scaleY: 1,
          duration: 0.75,
          delay: delay,
          ease: "power2.out",
          onComplete: () => {
            rocket.remove();

            const particleCount = 28;
            for (let i = 0; i < particleCount; i++) {
              const particle = document.createElement("div");
              particle.className = "absolute w-1.5 h-1.5 rounded-full pointer-events-none";
              particle.style.backgroundColor = burstColor;
              particle.style.boxShadow = `0 0 10px ${burstColor}, 0 0 2px #fff`;
              container.appendChild(particle);

              const angle = (i / particleCount) * Math.PI * 2;
              const velocity = gsap.utils.random(60, 130);
              const driftX = Math.cos(angle) * velocity;
              const driftY = Math.sin(angle) * velocity;

              gsap.fromTo(particle,
                { x: targetX, y: targetY, scale: 1, opacity: 1 },
                {
                  x: targetX + driftX,
                  y: targetY + driftY + 30,
                  scale: 0,
                  opacity: 0,
                  duration: gsap.utils.random(0.9, 1.4),
                  ease: "power3.out",
                  onComplete: () => particle.remove()
                }
              );
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const VW = window.innerWidth;
    const VH = window.innerHeight;
    const isMobile = "ontouchstart" in window || VW < 768;

    const ctx = gsap.context(() => {
      const tiles     = gsap.utils.toArray<HTMLElement>(".anim-icon");
      const powerBox  = section.querySelector<HTMLElement>(".power-box")!;
      const tagline   = section.querySelector<HTMLElement>(".tagline")!;
      const scrollCue = section.querySelector<HTMLElement>(".scroll-cue")!;
      const tapBtn    = section.querySelector<HTMLElement>(".tap-btn")!;

      if (isMobile) {
        if (scrollCue) scrollCue.style.setProperty("display", "none", "important");
        if (tapBtn) tapBtn.style.setProperty("display", "flex", "important");
      }

      tiles.forEach((tile, i) => {
        const p = SCATTERED_POS[i];
        gsap.set(tile, {
          x: (p.x / 100) * VW,
          y: (p.y / 100) * VH,
          rotation: iconRands[i].rotOffset,
          scale: 0.9 + iconRands[i].scaleBase,
          opacity: 1,
          transformPerspective: 800,
        });
      });
      gsap.set(powerBox, { scale: 0, opacity: 0, rotation: -15 });
      gsap.set(tagline,  { opacity: 0, y: 30 });

      const floatTweens = tiles.map((tile, i) =>
        gsap.to(tile, {
          y: `+=${iconRands[i].floatY}`,
          rotation: `+=${iconRands[i].floatRot}`,
          duration: iconRands[i].floatDur,
          ease: "sine.inOut", yoyo: true, repeat: -1,
        })
      );

      let mouseX = VW / 2, mouseY = VH / 2;
      let scatterPhase = true;

      const onMouseMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      };
      section.addEventListener("mousemove", onMouseMove);

      let rafId: number;
      const magneticRAF = () => {
        if (scatterPhase) {
          tiles.forEach((tile, i) => {
            const p = SCATTERED_POS[i];
            const bx = VW / 2 + (p.x / 100) * VW;
            const by = VH / 2 + (p.y / 100) * VH;
            const dx = mouseX - bx;
            const dy = mouseY - by;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const R = 220;
            if (dist < R) {
              const strength = (1 - dist / R) * 18;
              const curX = gsap.getProperty(tile, "x") as number;
              const curY = gsap.getProperty(tile, "y") as number;
              gsap.to(tile, {
                x: curX + (dx / dist) * strength * 0.3,
                y: curY + (dy / dist) * strength * 0.3,
                duration: 0.15, overwrite: "auto",
              });
            }
          });
        }
        rafId = requestAnimationFrame(magneticRAF);
      };
      rafId = requestAnimationFrame(magneticRAF);

      const labelledSet = new Set<string>();
      const popLabel = (tile: HTMLElement, label: string) => {
        if (labelledSet.has(label)) return;
        labelledSet.add(label);
        const lbl = document.createElement("span");
        lbl.style.cssText = `
          position:absolute; left:50%; top:-10px;
          white-space:nowrap; font-size:10px; font-weight:800;
          letter-spacing:.08em; color:#ffd0a0;
          text-shadow:0 0 8px rgba(255,120,0,0.5);
          pointer-events:none;
          animation:labelPop .9s ease-out forwards;
          transform-origin:bottom center;
        `;
        lbl.textContent = label;
        tile.appendChild(lbl);
        setTimeout(() => lbl.remove(), 950);
      };

      let currentPhase = -1;
      let whooshPlayed = false;
      let powerPlayed  = false;

      const runPhase = (p: number) => {
        if (p <= 0.35) {
          if (currentPhase !== 1) {
            currentPhase = 1;
            scatterPhase = false;
            floatTweens.forEach(t => t.pause());
          }
          const t = p / 0.35;
          const ease = gsap.parseEase("power2.inOut")(t);

          tiles.forEach((tile, i) => {
            const sc = SCATTERED_POS[i];
            const angle = ORBIT_ANGLE[i];
            const orbitX = Math.cos(angle) * ORBIT_R;
            const orbitY = Math.sin(angle) * ORBIT_R;
            const sx = (sc.x / 100) * VW;
            const sy = (sc.y / 100) * VH;
            gsap.set(tile, {
              x: sx + (orbitX - sx) * ease,
              y: sy + (orbitY - sy) * ease,
              rotation: (1 - ease) * (i % 2 === 0 ? 12 : -12),
              scale: 0.9 + ease * 0.15,
              opacity: 1,
            });
            if (ease > 0.85) popLabel(tile, ICONS[i].label);
          });
        }

        if (p > 0.35 && p <= 0.62) {
          if (currentPhase !== 2) {
            currentPhase = 2;
            if (!whooshPlayed) { whooshPlayed = true; playWhoosh(); }
          }
          const t = (p - 0.35) / 0.27;
          const spinDeg = t * 540;
          tiles.forEach((tile, i) => {
            const angle = ORBIT_ANGLE[i] + (spinDeg * Math.PI) / 180;
            gsap.set(tile, {
              x: Math.cos(angle) * ORBIT_R,
              y: Math.sin(angle) * ORBIT_R,
              rotation: (spinDeg + i * 36) % 360,
              scale: 1.05, opacity: 1,
            });
          });
        }

        if (p > 0.62 && p <= 0.80) {
          if (currentPhase !== 3) {
            currentPhase = 3;
            gsap.to(powerBox, { scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: "back.out(1.5)" });
          }
          const t = (p - 0.62) / 0.18;
          const ease = gsap.parseEase("power3.in")(t);
          tiles.forEach((tile, i) => {
            const baseAngle = ORBIT_ANGLE[i] + (540 * Math.PI) / 180;
            const orbitX = Math.cos(baseAngle) * ORBIT_R;
            const orbitY = Math.sin(baseAngle) * ORBIT_R;
            gsap.set(tile, {
              x: orbitX * (1 - ease),
              y: orbitY * (1 - ease),
              scale: 1.05 - ease * 0.9,
              opacity: 1 - ease * 0.9,
              rotation: ease * 360,
            });
          });
          const pulse = Math.sin(ease * Math.PI * 4) * 0.08;
          gsap.set(powerBox, { scale: 1 + pulse, rotation: ease * 12 });
        }

        if (p > 0.80) {
          if (currentPhase !== 4) {
            currentPhase = 4;
            tiles.forEach(tile => gsap.set(tile, { opacity: 0, scale: 0 }));
            gsap.to(powerBox, {
              scale: 1.15, rotation: 0,
              boxShadow: "0 15px 60px rgba(255,115,0,0.5), 0 0 140px rgba(255,180,0,0.25)",
              duration: 0.3, ease: "power2.out",
            });
            gsap.to(tagline, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.15 });

            createFireworkBlast();
            if (!powerPlayed) { powerPlayed = true; playPowerUp(); }
          }
        }
      };

      if (!isMobile) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=3500",
          scrub: 1.4,
          pin: true,
          onUpdate(self) { runPhase(self.progress); },
        });
      }

      if (isMobile) {
        const tapTrigger = section.querySelector<HTMLElement>(".tap-trigger");
        tapTrigger?.addEventListener("click", () => {
          if (tapBtn) tapBtn.style.setProperty("display", "none", "important");
          gsap.to({ val: 0 }, {
            val: 1,
            duration: 4.5,
            ease: "power1.inOut",
            onUpdate: function () { runPhase((this as any).targets()[0].val); },
          });
        });
      }

      return () => {
        section.removeEventListener("mousemove", onMouseMove);
        cancelAnimationFrame(rafId);
      };

    }, section);

    return () => ctx.revert();
  }, [iconRands]);

  return (
    <>
      <div
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#030712]"
      >
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.012)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.012)_1px,_transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,_black_40%,_transparent_90%)]" />

        <div className="absolute w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none z-0" />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160%] aspect-[2.5/1] rounded-[100%] bg-[radial-gradient(ellipse_at_bottom,_rgba(251,146,60,0.18)_0%,_rgba(251,146,60,0.04)_45%,_transparent_70%)] pointer-events-none z-10 filter blur-sm border-t border-orange-500/10" />

        <div ref={fireworkContainerRef} className="absolute inset-0 z-15 pointer-events-none w-full h-full" />

        <div className="power-box absolute z-20 w-[112px] h-[112px] rounded-[28px] bg-gradient-to-br from-[#ffbe1a] via-[#ff7300] to-[#e61700] flex flex-col items-center justify-center gap-1 border border-white/20 shadow-[0_15px_45px_rgba(249,115,22,0.3)]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" stroke="rgba(255,255,255,.25)" strokeWidth=".5"/>
          </svg>
          <span className="text-[9px] font-black tracking-widest uppercase text-white/90">
            Superpower
          </span>
        </div>

        <div className="tagline absolute bottom-[22%] left-1/2 -translate-x-1/2 text-center z-25 whitespace-nowrap">
          <p className="text-2xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] m-0">
            Everything. One place. Super-powerful.
          </p>
          <p className="text-sm font-medium text-slate-400 mt-2 tracking-wide">
            All your tools, working flawlessly as one.
          </p>
        </div>

        {ICONS.map(({ Icon, bg, glow, label }, i) => (
          <div
            key={i}
            className="anim-icon absolute w-[66px] h-[66px] rounded-[20px] flex items-center justify-center z-10 will-change-transform border border-white/10 cursor-default"
            style={{
              background: `linear-gradient(135deg, ${bg[0]}, ${bg[1]})`,
              boxShadow: `0 14px 35px ${glow}, inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.15)`,
            }}
          >
            <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <Icon size={28} color="#fff" title={label} />
          </div>
        ))}

        <div className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 opacity-60">
          <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-slate-400 font-mono">
            Scroll to see the magic
          </span>
          <div className="w-5 h-8 border-[1.5px] border-slate-600 rounded-full flex justify-center pt-1">
            <div className="w-[3px] h-1.5 bg-slate-400 rounded-full animate-[scrollDot_1.8s_ease-in-out_infinite]" />
          </div>
        </div>

        <div className="tap-btn absolute bottom-8 left-1/2 -translate-x-1/2 hidden flex-col items-center gap-[10px] z-30">
          <button
            className="tap-trigger bg-white/5 hover:bg-white/10 active:scale-95 border border-white/20 text-white text-[11px] font-bold tracking-widest uppercase px-6 py-2.5 rounded-full transition-transform cursor-pointer animate-[tapPulse_2s_ease-in-out_infinite]"
          >
            Tap to see the magic
          </button>
        </div>
      </div>
    </>
  );
}
