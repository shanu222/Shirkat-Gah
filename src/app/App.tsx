import { BrowserRouter, Routes, Route } from 'react-router';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/pages/HomePage';
import { ProjectDashboard } from './components/pages/ProjectDashboard';
import { LeadershipDashboard } from './components/pages/LeadershipDashboard';
import { PublicDashboard } from './components/pages/PublicDashboard';
import { DataManagement } from './components/pages/DataManagement';
import { LMSPage } from './components/pages/LMSPage';
import { FinanceManagement } from './components/pages/FinanceManagement';
import { Reports } from './components/pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/projects" element={<ProjectDashboard />} />
          <Route path="/dashboard/leadership" element={<LeadershipDashboard />} />
          <Route path="/dashboard/public" element={<PublicDashboard />} />
          <Route path="/data" element={<DataManagement />} />
          <Route path="/lms" element={<LMSPage />} />
          <Route path="/finance" element={<FinanceManagement />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
