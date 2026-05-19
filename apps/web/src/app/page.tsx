import { AppShell } from '@/components/layout/app-shell';
import { HomePage } from '@/features/home/home-page';

export default function Home() {
  return (
    <AppShell>
      <HomePage />
    </AppShell>
  );
}
