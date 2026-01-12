function getEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const AI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4-turbo-preview';

export const AI_MAX_TOKENS_INITIAL = getEnvInt('OPENAI_MAX_TOKENS_INITIAL', 2000);
export const AI_MAX_TOKENS_FOLLOWUP = getEnvInt('OPENAI_MAX_TOKENS_FOLLOWUP', 1500);
export const AI_MAX_TOKENS_QUESTIONS = getEnvInt('OPENAI_MAX_TOKENS_QUESTIONS', 500);

export const AI_RATE_LIMIT_PER_MINUTE = getEnvInt('AI_RATE_LIMIT_PER_MINUTE', 10);
export const AI_RATE_LIMIT_PER_DAY = getEnvInt('AI_RATE_LIMIT_PER_DAY', 200);

export const AI_MAX_ASSETS = getEnvInt('AI_MAX_ASSETS', 200);
export const AI_MAX_BODY_CHARS = getEnvInt('AI_MAX_BODY_CHARS', 20000);
export const AI_MAX_MACRO_CHARS = getEnvInt('AI_MAX_MACRO_CHARS', 5000);
export const AI_MAX_QUESTION_CHARS = getEnvInt('AI_MAX_QUESTION_CHARS', 500);
