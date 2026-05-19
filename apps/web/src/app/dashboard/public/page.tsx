import { AppShell } from '@/components/layout/app-shell';
import { PublicDashboard } from '@/features/dashboard/public-dashboard';

export const metadata = { title: 'Public Impact Dashboard' };

export default function PublicDashboardPage() {
  return (
    <AppShell>
      <PublicDashboard />
    </AppShell>
  );
}
