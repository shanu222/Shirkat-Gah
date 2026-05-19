import { AppShell } from '@/components/layout/app-shell';
import { LMSPage } from '@/features/lms/lms-page';

export const metadata = { title: 'Learning Management' };

export default function LmsPage() {
  return (
    <AppShell>
      <LMSPage />
    </AppShell>
  );
}
