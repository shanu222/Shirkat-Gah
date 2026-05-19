import { AppShell } from '@/components/layout/app-shell';
import { PublicDashboard } from '@/features/dashboard/public-dashboard';

export const metadata = { title: 'Public Impact Dashboard' };

// ISR: revalidate public dashboard every 5 minutes on Vercel Edge
export const revalidate = 300;

export default function PublicDashboardPage() {
  return (
    <AppShell variant="dashboard" title="Public Impact">
      <PublicDashboard />
    </AppShell>
  );
}
