/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CompanionMascot — Kapi & Luna with REAL expression changes.
 * Five hand-illustrated sprites (consistent characters) crossfade per state,
 * each with its own idle motion and floating props. The character is alive.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FocusState, PomodoroStatus } from '../types';

const SPRITES: Record<FocusState, string> = {
  focused: new URL('../assets/sprites/focused.png', import.meta.url).href,
  phone: new URL('../assets/sprites/phone.png', import.meta.url).href,
  away: new URL('../assets/sprites/away.png', import.meta.url).href,
  tired: new URL('../assets/sprites/tired.png', import.meta.url).href,
  stretch: new URL('../assets/sprites/stretch.png', import.meta.url).href,
};

interface CompanionMascotProps {
  state: FocusState;
  status: PomodoroStatus;
  mascotName: string;
  speechBubble: string | null;
}

// Per-state idle motion
const stateMotion: Record<FocusState, { animate: any; transition: any }> = {
  focused: {
    animate: { y: [0, -7, 0], rotate: [0, 0.8, 0, -0.8, 0] },
    transition: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
  },
  phone: {
    animate: { rotate: [4, 6, 4], x: 10, y: [0, -5, 0] },
    transition: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' },
  },
  away: {
    animate: { y: [3, 8, 3], scale: [1, 1.015, 1] },
    transition: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' },
  },
  tired: {
    animate: { y: [4, 9, 4], rotate: -1.5 },
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
  stretch: {
    animate: { y: [0, -16, 0], scale: [1, 1.05, 1], rotate: [0, 1.5, 0, -1.5, 0] },
    transition: { duration: 0.95, repeat: Infinity, ease: 'easeOut' },
  },
};

const CAPTIONS: Record<FocusState, (name: string) => string> = {
  focused: (n) => `Deep focus — ${n} and Luna are reading beside you`,
  phone: () => `Hmm? A notification? Let's check it later`,
  away: (n) => `${n} and Luna are napping while they wait for you`,
  tired: () => `Here, have an orange — let's rest our eyes a moment`,
  stretch: () => `Great stretch!! You're doing amazing`,
};

export default function CompanionMascot({
  state,
  status,
  mascotName,
  speechBubble,
}: CompanionMascotProps) {
  const expression: FocusState = state || 'focused';
  const m = stateMotion[expression];

  return (
    <div className="relative flex flex-col items-center justify-end p-6 pb-5 bg-white/60 border border-[#FFDEC9] backdrop-blur-md rounded-3xl shadow-md w-full mx-auto h-[520px] overflow-hidden">
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {speechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute top-4 left-5 right-5 bg-[#FFFDF9]/95 backdrop-blur-sm border border-[#FFE0CC] px-4 py-2.5 rounded-2xl text-[#725442] text-xs font-bold shadow-sm z-20"
            id="kapi-speech-bubble"
          >
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#FFFDF9] border-r border-b border-[#FFE0CC] rotate-45" />
            <p className="text-center leading-relaxed font-sans">{speechBubble}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot stage */}
      <div className="relative w-full flex-1 flex items-end justify-center min-h-0">
        {/* Warm glow */}
        <div className="absolute inset-x-8 top-10 bottom-6 bg-[#FFE3C4] rounded-full filter blur-3xl opacity-60 -z-10 animate-pulse" />
        {/* Ground shadow */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-6 bg-[#C79E77]/35 rounded-full blur-md" />

        {/* Sprite with crossfade between expressions */}
        <AnimatePresence mode="popLayout">
          <motion.img
            key={expression}
            src={SPRITES[expression]}
            alt={`${mascotName} — ${expression}`}
            draggable={false}
            className="relative max-h-[340px] w-auto object-contain select-none drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            exit={{ opacity: 0, scale: 0.98, y: -6, transition: { duration: 0.25 } }}
            animate={{ opacity: 1, ...m.animate }}
            transition={{ opacity: { duration: 0.35 }, ...m.transition }}
          />
        </AnimatePresence>

        {/* ============ STATE PROPS ============ */}

        {expression === 'phone' && (
          <motion.div
            className="absolute top-8 right-[18%] text-5xl font-black text-[#FF8FA3] drop-shadow z-10"
            animate={{ y: [0, -12, 0], rotate: [0, 10, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            !
          </motion.div>
        )}

        {expression === 'away' && (
          <div className="absolute top-10 right-[20%] z-10">
            {[
              { size: 'text-xl', delay: 0, x: 0 },
              { size: 'text-3xl', delay: 0.9, x: 18 },
              { size: 'text-4xl', delay: 1.8, x: 38 },
            ].map((z, i) => (
              <motion.span
                key={i}
                className={`absolute font-black text-[#A98868] drop-shadow-sm ${z.size}`}
                style={{ right: -z.x }}
                animate={{ opacity: [0, 1, 0], y: [12, -42], x: [0, 12] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: z.delay }}
              >
                Z
              </motion.span>
            ))}
          </div>
        )}

        {expression === 'tired' && (
          <motion.div
            className="absolute top-12 left-[16%] text-2xl z-10"
            animate={{ y: [0, 8, 0], opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            💧
          </motion.div>
        )}

        {expression === 'stretch' && (
          <>
            {[
              { icon: '✨', cls: 'top-6 left-[12%] text-4xl', dur: 1.0, delay: 0 },
              { icon: '⭐', cls: 'top-16 right-[10%] text-3xl', dur: 1.3, delay: 0.2 },
              { icon: '💛', cls: 'bottom-24 left-[8%] text-3xl', dur: 1.15, delay: 0.4 },
              { icon: '✨', cls: 'bottom-16 right-[14%] text-3xl', dur: 1.25, delay: 0.1 },
            ].map((s, i) => (
              <motion.div
                key={i}
                className={`absolute ${s.cls} drop-shadow-sm z-10`}
                animate={{ scale: [0.6, 1.4, 0.6], rotate: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
              >
                {s.icon}
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Status caption */}
      <div className="mt-3 text-center relative z-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#B99C86] font-bold">
          {expression}
        </p>
        <h3 className="text-sm font-extrabold text-[#725442] mt-0.5" id="mascot-status-text">
          {CAPTIONS[expression](mascotName)}
        </h3>
      </div>
    </div>
  );
}
