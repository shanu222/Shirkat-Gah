import { useSession } from 'next-auth/react';

export function useApiToken() {
  const { data: session, status } = useSession();
  return {
    token: session?.accessToken,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
  };
}
