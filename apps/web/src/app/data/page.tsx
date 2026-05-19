import { AppShell } from '@/components/layout/app-shell';
import { DataManagement } from '@/features/data/data-management';

export const metadata = { title: 'Data Management' };

export default function DataPage() {
  return (
    <AppShell variant="dashboard" title="Data Management">
      <DataManagement />
    </AppShell>
  );
}
