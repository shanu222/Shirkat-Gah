'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';

export interface LeadershipDashboardData {
  kpis: {
    totalBeneficiaries: number;
    activeProjects: number;
    totalProjects: number;
    budgetUtilization: number;
    totalBudget: number;
    geographicReach: number;
  };
  monthlyTrend: Array<{ month: string; beneficiaries: number; programs: number; budget: number }>;
  programDistribution: Array<{ name: string; value: number; color: string }>;
  provinceData: Array<{ province: string; projects: number; districts?: number; reach?: number }>;
  projectHealth: Array<{ name: string; value: number; percentage: number }>;
  recentActivity: Array<{ id: string; action: string; entity: string; user: string; time: string }>;
}

export function useLeadershipDashboard() {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: ['dashboard', 'leadership', session?.accessToken],
    queryFn: () => api.dashboard.leadership(session!.accessToken) as Promise<LeadershipDashboardData>,
    enabled: status === 'authenticated' && !!session?.accessToken,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
}

export function usePublicDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'public'],
    queryFn: () => api.dashboard.public(),
    staleTime: 5 * 60_000,
  });
}
