import { AppShell } from '@/components/layout/app-shell';
import { Reports } from '@/features/reports/reports-page';

export const metadata = { title: 'Reports' };

export default function ReportsPage() {
  return (
    <AppShell>
      <Reports />
    </AppShell>
  );
}
