/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// FocusState — the heart of the app  Declares the only four states a student can be in.
export type FocusState = 'focused' | 'distracted' | 'absent' | 'stretch';

export type PomodoroStatus = 'idle' | 'work' | 'break';

//UserSettings - Everything the user can configure.
export interface UserSettings {
  mascotName: string;
  userName?: string; // the student's own nickname — header becomes "Lynn's Study Buddy"
  modelUrl: string;
  speechEnabled: boolean;
  chimeEnabled?: boolean; // alert chime sounds (default OFF — enable in Settings)
  settingsVersion?: number; // bumped when defaults change, used for migration
  reminderFrequencyMinutes: number;
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  healthEnabled?: boolean; // health break guard on/off
  healthFocusMinutes?: number; // focused minutes before a break reminder (default 50)
  healthBreakMinutes?: number; // absent+stretch minutes that count as a real break (default 5)
}

export interface FocusSnapshot {
  timestamp: number; // ms timestamp
  state: FocusState;
}

// DailyStats — one record per day The shape of everything saved to localStorage, one object per calendar day.
export interface DailyStats {
  date: string; // YYYY-MM-DD
  totalFocusTime: number; // seconds
  totalDistractedTime: number; // seconds (Distracted class from model)
  totalAbsentTime: number; // seconds (Absent class from model)
  totalStretchTime: number; // seconds (simulator/manual stretch)
  distractionCount: number; // instances of switching to distracted
  pomodorosCompleted: number;
  longestStreakMinutes: number;
  snapshots: FocusSnapshot[];
  aiSummary?: string;
}

export interface SpeechBubble {
  text: string;
  timestamp: number;
}


