/**
 * API URL resolution for browser vs server contexts.
 *
 * Browser (HTTPS Vercel):  NEXT_PUBLIC_API_URL=/api/backend  → same-origin proxy
 * Server (NextAuth/SSR):   BACKEND_URL=http://EC2_IP:3001   → direct HTTP (no mixed content)
 */

const trimSlash = (url: string) => url.replace(/\/$/, '');

/** Public API base used by client-side fetch (relative proxy path in production). */
export function getApiBaseUrl(): string {
  return trimSlash(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
}

/**
 * Direct backend URL for server-side calls only (NextAuth, SSR).
 * Never prefix with NEXT_PUBLIC_ — must not be exposed to the browser.
 */
export function getBackendUrl(): string {
  return trimSlash(
    process.env.BACKEND_URL ||
      process.env.API_BACKEND_URL ||
      'http://localhost:4000',
  );
}

/** Build a versioned API URL: /api/v1/... */
export function getApiV1Url(endpoint: string, options?: { serverSide?: boolean }): string {
  const base = options?.serverSide ? getBackendUrl() : getApiBaseUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}/api/v1${path}`;
}

/** True when the public API URL is the Vercel proxy path (production without domain). */
export function isProxiedApi(): boolean {
  return getApiBaseUrl().startsWith('/');
}
