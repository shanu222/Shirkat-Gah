import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import {
  attemptBackendLogin,
  getAuthLoginUrls,
  isValidLoginResponse,
  logAuth,
  logAuthError,
} from './api-config';

if (!process.env.NEXTAUTH_SECRET) {
  logAuthError('NEXTAUTH_SECRET is not set — authentication will fail');
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
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          logAuthError('Missing email or password');
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        logAuth('Config', {
          BACKEND_URL: process.env.BACKEND_URL ?? '(not set)',
          NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? '(not set)',
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '(not set)',
        });

        for (const url of getAuthLoginUrls()) {
          logAuth('AUTH URL', url);

          const attempt = await attemptBackendLogin(url, email, password);

          logAuth('AUTH STATUS', attempt.status);
          logAuth('AUTH BODY', attempt.data ?? attempt.error ?? null);

          if (!attempt.ok) {
            logAuthError('AUTH FAILED', { url, status: attempt.status, body: attempt.data });
            continue;
          }

          const data = attempt.data;

          if (!isValidLoginResponse(data)) {
            logAuthError('INVALID AUTH RESPONSE', data);
            continue;
          }

          logAuth('Authorize success', { email: data.user.email, id: data.user.id });

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            roles: data.user.roles ?? [],
            permissions: data.user.permissions ?? [],
          };
        }

        logAuthError('All login URL attempts failed');
        return null;
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
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.roles = user.roles ?? [];
        token.permissions = user.permissions ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? '';
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.permissions = (token.permissions as string[]) ?? [];
      }
      session.accessToken = (token.accessToken as string) ?? '';
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
