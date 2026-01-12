import { NextRequest } from 'next/server';
import { MacroViews, Portfolio } from '@/types/portfolio';
import {
  AI_MAX_ASSETS,
  AI_MAX_BODY_CHARS,
  AI_MAX_MACRO_CHARS,
  AI_RATE_LIMIT_PER_DAY,
  AI_RATE_LIMIT_PER_MINUTE,
} from './ai-config';

type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; message: string };

const rateLimitStore = new Map<string, RateLimitState>();

function checkLimit(key: string, max: number, windowMs: number): RateLimitState & { allowed: boolean } {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    const nextState = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(key, nextState);
    return { ...nextState, allowed: true };
  }

  if (existing.count >= max) {
    return { ...existing, allowed: false };
  }

  const nextState = { count: existing.count + 1, resetAt: existing.resetAt };
  rateLimitStore.set(key, nextState);
  return { ...nextState, allowed: true };
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export function enforceRateLimit(ip: string, scope: string): RateLimitResult {
  const minuteLimit = checkLimit(`${scope}:minute:${ip}`, AI_RATE_LIMIT_PER_MINUTE, 60_000);
  if (!minuteLimit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((minuteLimit.resetAt - Date.now()) / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
      message: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
    };
  }

  const dayLimit = checkLimit(`${scope}:day:${ip}`, AI_RATE_LIMIT_PER_DAY, 86_400_000);
  if (!dayLimit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((dayLimit.resetAt - Date.now()) / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
      message: `Daily usage limit reached. Try again in ${retryAfterSeconds} seconds.`,
    };
  }

  return { allowed: true };
}

export function isBodyTooLarge(body: unknown): boolean {
  try {
    return JSON.stringify(body).length > AI_MAX_BODY_CHARS;
  } catch {
    return true;
  }
}

export function validatePortfolioInputs(
  portfolio: Portfolio | undefined,
  macroViews: MacroViews | undefined
): string | null {
  if (!portfolio || !macroViews) {
    return 'Portfolio and macro views are required.';
  }

  if (!Array.isArray(portfolio.assets) || portfolio.assets.length === 0) {
    return 'Portfolio assets are required.';
  }

  if (portfolio.assets.length > AI_MAX_ASSETS) {
    return `Portfolio exceeds the maximum of ${AI_MAX_ASSETS} assets.`;
  }

  const macroText = Object.values(macroViews)
    .map((value) => (typeof value === 'string' ? value : ''))
    .join('');

  if (macroText.length > AI_MAX_MACRO_CHARS) {
    return `Macro views exceed ${AI_MAX_MACRO_CHARS} characters.`;
  }

  return null;
}
