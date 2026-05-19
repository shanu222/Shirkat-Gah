/**
 * Server-side login URL resolution and fetch for NextAuth authorize().
 */

const trimSlash = (url: string) => url.replace(/\/+$/, '');

/** Normalize BACKEND_URL — prevent /api/v1 duplication from misconfiguration */
export function getBackendBaseUrl(): string {
  let base = trimSlash(
    process.env.BACKEND_URL ||
      process.env.API_BACKEND_URL ||
      'http://localhost:4000',
  );

  if (base.endsWith('/api/v1')) {
    base = base.slice(0, -'/api/v1'.length);
  } else if (base.endsWith('/api')) {
    base = base.slice(0, -'/api'.length);
  }

  return base;
}

/** Direct EC2 login URL: ${BACKEND_URL}/api/v1/auth/login */
export function getDirectAuthLoginUrl(): string {
  return `${getBackendBaseUrl()}/api/v1/auth/login`;
}

/** Same-origin proxy login URL for Vercel fallback */
export function getProxyAuthLoginUrl(): string | null {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api/backend';
  if (!apiBase.startsWith('/')) {
    return null;
  }

  const appUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (!appUrl) {
    return null;
  }

  return `${trimSlash(appUrl)}${trimSlash(apiBase)}/api/v1/auth/login`;
}

/** Ordered unique login URLs to attempt */
export function getAuthLoginUrls(): string[] {
  const urls = [getDirectAuthLoginUrl(), getProxyAuthLoginUrl()].filter(
    (url): url is string => Boolean(url),
  );
  return [...new Set(urls)];
}

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

/** Always log auth diagnostics (required for Vercel production debugging) */
export function logAuth(message: string, detail?: unknown): void {
  if (detail !== undefined) {
    console.log(`[NextAuth] ${message}`, detail);
  } else {
    console.log(`[NextAuth] ${message}`);
  }
}

export function logAuthError(message: string, detail?: unknown): void {
  if (detail !== undefined) {
    console.error(`[NextAuth] ${message}`, detail);
  } else {
    console.error(`[NextAuth] ${message}`);
  }
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
      logAuthError('AUTH JSON parse failed', { url, status: response.status });
      data = null;
    }

    return {
      url,
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logAuthError('AUTH FETCH ERROR', { url, message });
    return {
      url,
      ok: false,
      status: 0,
      data: null,
      error: message,
    };
  }
}

export function isValidLoginResponse(data: BackendLoginResponse | null): data is BackendLoginResponse {
  return Boolean(data?.accessToken && data?.user?.id && data?.user?.email);
}
