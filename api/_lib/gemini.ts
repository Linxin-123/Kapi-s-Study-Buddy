/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared Gemini helpers for the Vercel serverless functions in /api.
 * (Local dev still uses server.ts via `npm run dev` — this file is only
 * used when deployed on Vercel.)
 */

import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY',
      httpOptions: { headers: { 'User-Agent': 'kapi-vercel' } },
    });
  }
  return aiClient;
}

export function hasApiKey(): boolean {
  const k = process.env.GEMINI_API_KEY;
  return !!k && k !== 'MY_GEMINI_API_KEY';
}

// Call Gemini with ONE automatic retry — the API occasionally returns
// transient 503 "high demand" errors that succeed moments later.
export async function generateWithRetry(params: any): Promise<any> {
  const ai = getAi();
  try {
    return await ai.models.generateContent(params);
  } catch (firstErr: any) {
    console.warn('Gemini call failed, retrying once...', firstErr?.message || firstErr);
    await new Promise((r) => setTimeout(r, 1200));
    return await ai.models.generateContent(params);
  }
}
