import { AppShell } from '@/components/layout/app-shell';
import { LeadershipDashboard } from '@/features/dashboard/leadership-dashboard';

export const metadata = { title: 'Leadership Dashboard' };

export default function LeadershipPage() {
  return (
    <AppShell>
      <LeadershipDashboard />
    </AppShell>
  );
}
