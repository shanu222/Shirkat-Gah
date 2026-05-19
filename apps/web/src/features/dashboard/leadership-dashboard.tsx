'use client';

import { useSession } from 'next-auth/react';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  MapPin,
  FileText,
  Award,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeadershipDashboard } from '@/hooks/use-dashboard';
import { PageContainer, PageHeader } from '@/components/design-system/page-layout';
import { KpiCard, KpiGrid } from '@/components/design-system/kpi-card';
import { AlertBanner, ChartCard, DashboardSkeleton } from '@/components/design-system/data-display';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/design-system/motion';
import { CHART_COLORS, CHART_PALETTE, CHART_GRID_PROPS, CHART_TOOLTIP_STYLE } from '@/lib/chart-theme';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export function LeadershipDashboard() {
  const { status } = useSession();
  const { data: apiData, isLoading, isError } = useLeadershipDashboard();

  const defaultKpis = [
    { label: 'Total Beneficiaries', value: '152,450', change: '+12.5%', trend: 'up' as const, icon: Users, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Active Projects', value: '45', change: '+3 new', trend: 'up' as const, icon: Target, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Budget Utilization', value: '78%', change: '+5%', trend: 'up' as const, icon: DollarSign, gradient: 'from-orange-500 to-amber-500' },
    { label: 'Geographic Reach', value: '82 Districts', change: '+8', trend: 'up' as const, icon: MapPin, gradient: 'from-violet-500 to-purple-500' },
  ];

  const kpis = apiData?.kpis
    ? [
        { label: 'Total Beneficiaries', value: apiData.kpis.totalBeneficiaries.toLocaleString(), change: '+12.5%', trend: 'up' as const, icon: Users, gradient: 'from-emerald-500 to-teal-500' },
        { label: 'Active Projects', value: String(apiData.kpis.activeProjects), change: `${apiData.kpis.totalProjects} total`, trend: 'up' as const, icon: Target, gradient: 'from-blue-500 to-cyan-500' },
        { label: 'Budget Utilization', value: `${apiData.kpis.budgetUtilization}%`, change: '+5%', trend: 'up' as const, icon: DollarSign, gradient: 'from-orange-500 to-amber-500' },
        { label: 'Geographic Reach', value: `${apiData.kpis.geographicReach} Districts`, change: '+8', trend: 'up' as const, icon: MapPin, gradient: 'from-violet-500 to-purple-500' },
      ]
    : defaultKpis;

  const monthlyData = apiData?.monthlyTrend ?? [
    { month: 'Jan', beneficiaries: 12000, programs: 38, budget: 65 },
    { month: 'Feb', beneficiaries: 13500, programs: 40, budget: 68 },
    { month: 'Mar', beneficiaries: 14200, programs: 42, budget: 72 },
    { month: 'Apr', beneficiaries: 15800, programs: 43, budget: 75 },
    { month: 'May', beneficiaries: 17100, programs: 45, budget: 78 },
  ];

  const programData = apiData?.programDistribution?.length
    ? apiData.programDistribution
    : [
        { name: 'SRHR Advocacy', value: 35, color: CHART_COLORS.primary },
        { name: 'Women Empowerment', value: 30, color: CHART_COLORS.secondary },
        { name: 'Governance', value: 20, color: CHART_COLORS.accent },
        { name: 'Research', value: 15, color: CHART_COLORS.warning },
      ];

  const provinceData = apiData?.provinceData?.length
    ? apiData.provinceData.map((p) => ({ province: p.province, projects: p.projects, reach: p.districts ?? p.reach ?? 0 }))
    : [
        { province: 'Punjab', projects: 18, reach: 35000 },
        { province: 'Sindh', projects: 12, reach: 28000 },
        { province: 'KPK', projects: 10, reach: 22000 },
        { province: 'Balochistan', projects: 5, reach: 15000 },
      ];

  const projectHealth = apiData?.projectHealth ?? [
    { name: 'On Track', value: 32, percentage: 71 },
    { name: 'At Risk', value: 8, percentage: 18 },
    { name: 'Delayed', value: 5, percentage: 11 },
  ];

  const recentActivity = apiData?.recentActivity?.length
    ? apiData.recentActivity.map((a) => ({
        title: `${a.action} — ${a.entity}`,
        description: a.user,
        time: new Date(a.time).toLocaleString(),
        icon: a.action === 'LOGIN' ? CheckCircle2 : FileText,
        color: 'text-emerald-500',
      }))
    : [
        { title: 'New project approved', description: 'Women Leadership Training - Lahore', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-500' },
        { title: 'Report submitted', description: 'Q1 Impact Assessment completed', time: '5 hours ago', icon: FileText, color: 'text-blue-500' },
        { title: 'Milestone achieved', description: 'Reached 150K beneficiaries', time: '1 day ago', icon: Award, color: 'text-orange-500' },
        { title: 'Alert', description: 'Budget review needed for 3 projects', time: '2 days ago', icon: AlertCircle, color: 'text-amber-500' },
      ];

  if (status === 'loading' || isLoading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FadeIn>
        {isError && (
          <AlertBanner variant="warning" className="mb-6">
            <Loader2 className="w-4 h-4 shrink-0 animate-spin mt-0.5" aria-hidden />
            <span>Live data unavailable — showing cached defaults. Ensure API is running.</span>
          </AlertBanner>
        )}

        <PageHeader
          title="Leadership Dashboard"
          description="Strategic overview of organizational impact and performance metrics"
          badge={
            <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
              <Activity className="w-3 h-3 mr-1" aria-hidden />
              Live
            </Badge>
          }
          actions={
            <Badge variant="outline" className="text-sm font-normal tabular-nums">
              <Clock className="w-4 h-4 mr-1.5" aria-hidden />
              Updated 5 min ago
            </Badge>
          }
        />

        <StaggerContainer className="space-y-6 sm:space-y-8">
          <StaggerItem>
            <KpiGrid>
              {kpis.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
              ))}
            </KpiGrid>
          </StaggerItem>

          <StaggerItem>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="w-full sm:w-auto h-auto flex flex-wrap gap-1 bg-muted/50 p-1">
                <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
                <TabsTrigger value="programs" className="rounded-md">Programs</TabsTrigger>
                <TabsTrigger value="geographic" className="rounded-md">Geographic</TabsTrigger>
                <TabsTrigger value="financial" className="rounded-md">Financial</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                  <ChartCard title="Growth Trends" description="Monthly beneficiary outreach and program growth">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <CartesianGrid {...CHART_GRID_PROPS} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip {...CHART_TOOLTIP_STYLE} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Area type="monotone" dataKey="beneficiaries" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.15} name="Beneficiaries" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Program Distribution" description="Active programs by thematic area">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={programData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {programData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color ?? CHART_PALETTE[index % CHART_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip {...CHART_TOOLTIP_STYLE} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                  <ChartCard
                    className="lg:col-span-2"
                    title="Project Health Status"
                    description="Current status of all active projects"
                    height={280}
                  >
                    <div className="space-y-5 pt-2">
                      {projectHealth.map((item) => (
                        <div key={item.name}>
                          <div className="flex items-center justify-between mb-2 gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                  item.name === 'On Track' ? 'bg-emerald-500' : item.name === 'At Risk' ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                aria-hidden
                              />
                              <span className="font-medium text-sm truncate">{item.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                              {item.value} projects ({item.percentage}%)
                            </span>
                          </div>
                          <Progress value={item.percentage} className="h-2" aria-label={`${item.name}: ${item.percentage}%`} />
                        </div>
                      ))}
                    </div>
                  </ChartCard>

                  <ChartCard title="Recent Activity" description="Latest platform updates" height={280}>
                    <ul className="space-y-4 pt-1" role="list">
                      {recentActivity.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <li key={index} className="flex gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-muted/80 flex items-center justify-center shrink-0 ${activity.color}`}>
                              <Icon className="w-4 h-4" aria-hidden />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{activity.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                              <p className="text-xs text-muted-foreground/80 mt-0.5">{activity.time}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </ChartCard>
                </div>
              </TabsContent>

              <TabsContent value="programs" className="mt-0">
                <ChartCard title="Program Performance" description="Comparison across thematic areas" height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={programData} barSize={32}>
                      <CartesianGrid {...CHART_GRID_PROPS} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip {...CHART_TOOLTIP_STYLE} />
                      <Bar dataKey="value" fill={CHART_COLORS.primary} name="Active Programs" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </TabsContent>

              <TabsContent value="geographic" className="mt-0">
                <ChartCard title="Provincial Distribution" description="Projects and beneficiary reach by province" height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={provinceData} barSize={28}>
                      <CartesianGrid {...CHART_GRID_PROPS} />
                      <XAxis dataKey="province" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip {...CHART_TOOLTIP_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar yAxisId="left" dataKey="projects" fill={CHART_COLORS.primary} name="Projects" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="reach" fill={CHART_COLORS.secondary} name="Beneficiaries" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </TabsContent>

              <TabsContent value="financial" className="mt-0">
                <ChartCard title="Budget Utilization Trend" description="Monthly budget utilization percentage" height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid {...CHART_GRID_PROPS} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip {...CHART_TOOLTIP_STYLE} />
                      <Line type="monotone" dataKey="budget" stroke={CHART_COLORS.warning} strokeWidth={2.5} dot={{ r: 4 }} name="Utilization %" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </TabsContent>
            </Tabs>
          </StaggerItem>
        </StaggerContainer>
      </FadeIn>
    </PageContainer>
  );
}
