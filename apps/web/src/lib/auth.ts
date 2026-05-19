import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getServerApiV1Url, logAuthDebug } from './api-config';

/** Backend login response shape from NestJS POST /api/v1/auth/login */
interface BackendLoginResponse {
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

function parseLoginResponse(body: string): BackendLoginResponse | null {
  try {
    const data = JSON.parse(body) as BackendLoginResponse;
    if (!data?.accessToken || !data?.user?.id || !data?.user?.email) {
      logAuthDebug('Invalid login response shape:', body.slice(0, 300));
      return null;
    }
    return data;
  } catch {
    logAuthDebug('Failed to parse login JSON:', body.slice(0, 300));
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logAuthDebug('Missing email or password');
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;
        const loginUrl = getServerApiV1Url('/auth/login');

        logAuthDebug('Login URL:', loginUrl);
        logAuthDebug('BACKEND_URL:', process.env.BACKEND_URL ?? '(not set)');
        logAuthDebug('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ?? '(not set)');

        try {
          const res = await fetch(loginUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({ email, password }),
            cache: 'no-store',
          });

          const body = await res.text();
          logAuthDebug('Response status:', res.status);
          logAuthDebug('Response body:', body.slice(0, 500));

          if (!res.ok) {
            return null;
          }

          const data = parseLoginResponse(body);
          if (!data) {
            return null;
          }

          const user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            roles: data.user.roles ?? [],
            permissions: data.user.permissions ?? [],
          };

          logAuthDebug('Authorize success for:', user.email);
          return user;
        } catch (error) {
          logAuthDebug('Login fetch error:', error instanceof Error ? error.message : error);
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.roles = user.roles ?? [];
        token.permissions = user.permissions ?? [];
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = (token.accessToken as string) ?? '';
      session.user.id = (token.id as string) ?? '';
      session.user.roles = (token.roles as string[]) ?? [];
      session.user.permissions = (token.permissions as string[]) ?? [];
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.AUTH_DEBUG === 'true',
};
