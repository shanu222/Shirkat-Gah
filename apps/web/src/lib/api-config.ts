/**
 * API URL resolution for browser vs server contexts.
 *
 * Browser (HTTPS Vercel):  NEXT_PUBLIC_API_URL=/api/backend  → same-origin proxy
 * Server (NextAuth/SSR):   BACKEND_URL=http://EC2_IP:4000   → direct HTTP (no mixed content)
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

function buildV1Path(endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `/api/v1${path}`;
}

/** Build a versioned API URL for browser or explicit server-side base. */
export function getApiV1Url(endpoint: string, options?: { serverSide?: boolean }): string {
  const base = options?.serverSide ? getBackendUrl() : getApiBaseUrl();
  const v1Path = buildV1Path(endpoint);

  // Relative proxy base (e.g. /api/backend) — browser same-origin only
  if (!options?.serverSide && base.startsWith('/')) {
    return `${base}${v1Path}`;
  }

  return `${base}${v1Path}`;
}

/**
 * Server-side API URL for NextAuth and SSR on Vercel.
 *
 * Priority:
 * 1. BACKEND_URL direct (recommended for production)
 * 2. NEXTAUTH_URL + /api/backend proxy (fallback when BACKEND_URL unset)
 * 3. localhost:4000 (local dev)
 */
export function getServerApiV1Url(endpoint: string): string {
  const v1Path = buildV1Path(endpoint);
  const backendUrl = process.env.BACKEND_URL || process.env.API_BACKEND_URL;

  if (backendUrl) {
    return `${trimSlash(backendUrl)}${v1Path}`;
  }

  const apiBase = getApiBaseUrl();
  if (apiBase.startsWith('/')) {
    const appUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

    if (appUrl) {
      return `${trimSlash(appUrl)}${apiBase}${v1Path}`;
    }
  }

  return `${getBackendUrl()}${v1Path}`;
}

/** True when the public API URL is the Vercel proxy path (production without domain). */
export function isProxiedApi(): boolean {
  return getApiBaseUrl().startsWith('/');
}

export function isAuthDebugEnabled(): boolean {
  return process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production';
}

export function logAuthDebug(...args: unknown[]): void {
  if (isAuthDebugEnabled()) {
    console.log('[NextAuth]', ...args);
  }
}
