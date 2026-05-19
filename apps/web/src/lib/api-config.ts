/**
 * Centralized API URL resolution — single source of truth.
 *
 * Production (Vercel):
 *   Browser:  /api/backend/auth/login  → rewrite → EC2 /api/v1/auth/login
 *   Server:   BACKEND_URL/api/v1/auth/login (NextAuth direct)
 *
 * Local dev:
 *   Browser + Server: http://localhost:4000/api/v1/auth/login
 */

const trimSlash = (url: string) => url.replace(/\/+$/, '');

/** Normalize endpoint to /auth/login format */
function normalizeEndpoint(endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Strip accidental /api/v1 prefix if caller passed full path
  if (path.startsWith('/api/v1/')) {
    return path.slice('/api/v1'.length);
  }
  if (path.startsWith('/api/v1')) {
    return path.slice('/api/v1'.length) || '/';
  }
  return path;
}

/** Public API base — /api/backend (proxy) or http://localhost:4000 (direct) */
export function getApiBaseUrl(): string {
  return trimSlash(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
}

/** Direct backend base URL (server-only, never NEXT_PUBLIC_) */
export function getBackendBaseUrl(): string {
  let base = trimSlash(
    process.env.BACKEND_URL ||
      process.env.API_BACKEND_URL ||
      'http://localhost:4000',
  );

  // Prevent double /api/v1 when env is misconfigured
  if (base.endsWith('/api/v1')) {
    base = base.slice(0, -'/api/v1'.length);
  } else if (base.endsWith('/api')) {
    base = base.slice(0, -'/api'.length);
  }

  return base;
}

/** True when browser uses same-origin Vercel proxy */
export function isProxiedApi(): boolean {
  return getApiBaseUrl().startsWith('/');
}

/**
 * Client-side API URL (browser fetch, React Query).
 *
 * Proxy mode:  /api/backend/auth/login  (rewrite adds /api/v1)
 * Direct mode: http://localhost:4000/api/v1/auth/login
 */
export function getClientApiUrl(endpoint: string): string {
  const path = normalizeEndpoint(endpoint);
  const base = getApiBaseUrl();

  if (base.startsWith('/')) {
    // path is /auth/login → /api/backend/auth/login
    return `${base}${path}`;
  }

  return `${base}/api/v1${path}`;
}

/**
 * Direct server-side API URL (NextAuth, SSR).
 * Always: ${BACKEND_URL}/api/v1/auth/login
 */
export function getDirectServerApiUrl(endpoint: string): string {
  const path = normalizeEndpoint(endpoint);
  return `${getBackendBaseUrl()}/api/v1${path}`;
}

/**
 * Proxy URL via deployment origin (NextAuth fallback on Vercel).
 * https://app.vercel.app/api/backend/auth/login
 */
export function getProxyServerApiUrl(endpoint: string): string | null {
  if (!isProxiedApi()) {
    return null;
  }

  const path = normalizeEndpoint(endpoint);
  const appUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (!appUrl) {
    return null;
  }

  return `${trimSlash(appUrl)}${getApiBaseUrl()}${path}`;
}

/** Ordered unique URLs for server-side auth retries */
export function getServerApiUrls(endpoint: string): string[] {
  const urls = [
    getDirectServerApiUrl(endpoint),
    getProxyServerApiUrl(endpoint),
  ].filter((url): url is string => Boolean(url));

  return [...new Set(urls)];
}

/** @deprecated Use getClientApiUrl — kept for backward compatibility */
export function getApiV1Url(endpoint: string, options?: { serverSide?: boolean }): string {
  if (options?.serverSide) {
    return getDirectServerApiUrl(endpoint);
  }
  return getClientApiUrl(endpoint);
}

/** @deprecated Use getDirectServerApiUrl */
export function getBackendUrl(): string {
  return getBackendBaseUrl();
}

/** @deprecated Use getDirectServerApiUrl */
export function getServerApiV1Url(endpoint: string): string {
  return getDirectServerApiUrl(endpoint);
}

// ─── Auth logging (production-safe: errors always, debug when AUTH_DEBUG=true) ─

export function logAuth(message: string, detail?: unknown): void {
  if (process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
    if (detail !== undefined) {
      console.log(`[Auth] ${message}`, detail);
    } else {
      console.log(`[Auth] ${message}`);
    }
  }
}

export function logAuthError(message: string, detail?: unknown): void {
  if (detail !== undefined) {
    console.error(`[Auth] ${message}`, detail);
  } else {
    console.error(`[Auth] ${message}`);
  }
}

// ─── Login response types & validation ───────────────────────────────────────

export interface BackendLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
  user: {
    id: string;
    email: string;
    roles?: string[];
    permissions?: string[];
  };
}

export interface AuthLoginAttempt {
  url: string;
  ok: boolean;
  status: number;
  data: BackendLoginResponse | null;
  error?: string;
}

export async function attemptBackendLogin(
  url: string,
  email: string,
  password: string,
): Promise<AuthLoginAttempt> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    let data: BackendLoginResponse | null = null;

    try {
      data = (await response.json()) as BackendLoginResponse;
    } catch {
      logAuthError('JSON parse failed', { url, status: response.status });
    }

    return { url, ok: response.ok, status: response.status, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logAuthError('Fetch error', { url, message });
    return { url, ok: false, status: 0, data: null, error: message };
  }
}

export function isValidLoginResponse(
  data: BackendLoginResponse | null,
): data is BackendLoginResponse {
  return Boolean(data?.accessToken && data?.user?.id && data?.user?.email);
}

export function getAuthLoginUrls(): string[] {
  return getServerApiUrls('/auth/login');
}
