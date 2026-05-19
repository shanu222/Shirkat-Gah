import { AppShell } from '@/components/layout/app-shell';
import { ProjectDashboard } from '@/features/dashboard/project-dashboard';

export const metadata = { title: 'Project Dashboard' };

export default function ProjectsPage() {
  return (
    <AppShell>
      <ProjectDashboard />
    </AppShell>
  );
}
