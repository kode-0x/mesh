/**
 * In-Memory Session Store For The OpenRouter API Key.
 *
 * The Key Is Held In A Module-Scoped Closure And Is Never Written To Disk,
 * Environment Variables, or Any Persistent Storage. Cleanup Handlers Ensure
 * It Is Wiped From Memory When The Process Exits For Any Reason
*/

let _apiKey: string | null = null;

export function setApiKey(key: string): void {
  _apiKey = key;
}

export function getApiKey(): string | null {
  return _apiKey;
}

export function hasApiKey(): boolean {
  return _apiKey !== null;
}

function clearApiKey(): void {
  _apiKey = null;
}

process.on('exit', clearApiKey);
process.on('SIGINT', () => { clearApiKey(); process.exit(0); });
process.on('SIGTERM', () => { clearApiKey(); process.exit(0); });
process.on('uncaughtException', () => { clearApiKey(); process.exit(1); });
