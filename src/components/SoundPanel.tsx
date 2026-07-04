/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SoundPanel — floating study-sounds player.
 * Plays bundled high-quality seamless ambient loops (rain, fireplace,
 * forest breeze) through an HTMLAudio element with a volume slider.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, CloudRain, Flame, TreePine, VolumeX, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    id: 'rain',
    label: 'Gentle Rain',
    icon: CloudRain,
    src: new URL('../assets/audio/rain.mp3', import.meta.url).href,
    activeCls: 'bg-[#9BB8C9] border-[#9BB8C9] text-white',
  },
  {
    id: 'fire',
    label: 'Fireplace',
    icon: Flame,
    src: new URL('../assets/audio/fire.mp3', import.meta.url).href,
    activeCls: 'bg-[#E8946A] border-[#E8946A] text-white',
  },
  {
    id: 'forest',
    label: 'Forest Breeze',
    icon: TreePine,
    src: new URL('../assets/audio/forest.mp3', import.meta.url).href,
    activeCls: 'bg-[#8EAC50] border-[#8EAC50] text-white',
  },
] as const;

type TrackId = (typeof TRACKS)[number]['id'] | 'off';

export default function SoundPanel() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<TrackId>('off');
  const [volume, setVolume] = useState(0.65);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'none';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const select = (id: TrackId) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (id === 'off' || id === current) {
      audio.pause();
      setCurrent('off');
      return;
    }
    const track = TRACKS.find((t) => t.id === id)!;
    audio.src = track.src;
    audio.volume = volume;
    audio.play().catch((e) => console.warn('Audio play blocked:', e));
    setCurrent(id);
  };

  const playing = current !== 'off';

  return (
    <>
      {/* Floating button, sits left of the chat bubble */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-5 right-[5.5rem] z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${
          playing ? 'bg-[#8EAC50] text-white' : 'bg-white border border-[#FFDEC9] text-[#C9A886] hover:text-[#725442]'
        }`}
        title="Study sounds"
        id="sound-panel-button"
      >
        <Music className="w-6 h-6" />
        {playing && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FF9E7D] rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-24 right-[5.5rem] z-50 bg-[#FFFDF9] border border-[#FFDEC9] rounded-3xl shadow-2xl p-3.5 w-52"
          >
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#B99C86] font-bold px-1 mb-2">study sounds</p>

            <div className="space-y-1.5">
              {TRACKS.map((t) => {
                const Icon = t.icon;
                const active = current === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => select(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                      active ? t.activeCls : 'bg-[#FFF8F0] border-[#FFE4CF] text-[#A0836D] hover:bg-[#FFF2E6]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                    {active && (
                      <span className="ml-auto flex items-end gap-[2px] h-3">
                        {[0, 0.2, 0.4].map((d) => (
                          <motion.span
                            key={d}
                            className="w-[3px] bg-white/90 rounded-full"
                            animate={{ height: ['30%', '100%', '45%'] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                          />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => select('off')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                  !playing ? 'bg-[#C9B29B] border-[#C9B29B] text-white' : 'bg-[#FFF8F0] border-[#FFE4CF] text-[#A0836D] hover:bg-[#FFF2E6]'
                }`}
              >
                <VolumeX className="w-4 h-4" />
                Quiet
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 mt-3 px-1">
              <Volume2 className="w-3.5 h-3.5 text-[#C9A886] shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-[#FF9E7D]"
                id="ambient-volume"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
