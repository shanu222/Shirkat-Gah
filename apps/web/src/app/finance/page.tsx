import { AppShell } from '@/components/layout/app-shell';
import { FinanceManagement } from '@/features/finance/finance-management';

export const metadata = { title: 'Finance Management' };

export default function FinancePage() {
  return (
    <AppShell variant="dashboard" title="Finance">
      <FinanceManagement />
    </AppShell>
  );
}
