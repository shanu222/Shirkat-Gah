'use client';

import { motion } from 'framer-motion';
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
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeadershipDashboard } from '@/hooks/use-dashboard';
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
  Area
} from 'recharts';

export function LeadershipDashboard() {
  const { status } = useSession();
  const { data: apiData, isLoading, isError } = useLeadershipDashboard();

  const defaultKpis = [
    { label: 'Total Beneficiaries', value: '152,450', change: '+12.5%', trend: 'up', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { label: 'Active Projects', value: '45', change: '+3 new', trend: 'up', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { label: 'Budget Utilization', value: '78%', change: '+5%', trend: 'up', icon: DollarSign, color: 'from-orange-500 to-amber-500' },
    { label: 'Geographic Reach', value: '82 Districts', change: '+8', trend: 'up', icon: MapPin, color: 'from-purple-500 to-pink-500' },
  ];

  const kpis = apiData?.kpis
    ? [
        { label: 'Total Beneficiaries', value: apiData.kpis.totalBeneficiaries.toLocaleString(), change: '+12.5%', trend: 'up', icon: Users, color: 'from-emerald-500 to-teal-500' },
        { label: 'Active Projects', value: String(apiData.kpis.activeProjects), change: `${apiData.kpis.totalProjects} total`, trend: 'up', icon: Target, color: 'from-blue-500 to-cyan-500' },
        { label: 'Budget Utilization', value: `${apiData.kpis.budgetUtilization}%`, change: '+5%', trend: 'up', icon: DollarSign, color: 'from-orange-500 to-amber-500' },
        { label: 'Geographic Reach', value: `${apiData.kpis.geographicReach} Districts`, change: '+8', trend: 'up', icon: MapPin, color: 'from-purple-500 to-pink-500' },
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
    { name: 'SRHR Advocacy', value: 35, color: '#047857' },
    { name: 'Women Empowerment', value: 30, color: '#0ea5e9' },
    { name: 'Governance', value: 20, color: '#14b8a6' },
    { name: 'Research', value: 15, color: '#f97316' },
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
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {isError && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <Loader2 className="w-4 h-4" />
            Live data unavailable — showing cached defaults. Ensure API is running.
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">Leadership Dashboard</h1>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <p className="text-muted-foreground">Strategic overview of organizational impact and performance</p>
            </div>
            <Badge variant="outline" className="text-sm">
              <Clock className="w-4 h-4 mr-1" />
              Updated 5 min ago
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-semibold">
                          {kpi.change}
                          <TrendingUp className="w-3 h-3 ml-1 inline" />
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">{kpi.value}</div>
                      <div className="text-sm text-muted-foreground">{kpi.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="geographic">Geographic</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Growth Trends</CardTitle>
                    <CardDescription>Monthly beneficiary outreach and program growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="beneficiaries" stroke="#047857" fill="#047857" fillOpacity={0.2} name="Beneficiaries" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Program Distribution</CardTitle>
                    <CardDescription>Active programs by thematic area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={programData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {programData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-2">
                  <CardHeader>
                    <CardTitle>Project Health Status</CardTitle>
                    <CardDescription>Current status of all active projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projectHealth.map((status, index) => (
                      <div key={status.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              status.name === 'On Track' ? 'bg-emerald-500' :
                              status.name === 'At Risk' ? 'bg-amber-500' :
                              'bg-red-500'
                            }`} />
                            <span className="font-medium">{status.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{status.value} projects ({status.percentage}%)</span>
                        </div>
                        <Progress value={status.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div key={index} className="flex gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="programs">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Program Performance</CardTitle>
                  <CardDescription>Comparison across thematic areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={programData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#047857" name="Active Programs" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geographic">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Provincial Distribution</CardTitle>
                  <CardDescription>Projects and beneficiary reach by province</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={provinceData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="province" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="projects" fill="#047857" name="Projects" />
                      <Bar yAxisId="right" dataKey="reach" fill="#0ea5e9" name="Beneficiaries" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Budget Utilization Trend</CardTitle>
                  <CardDescription>Monthly budget utilization percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="budget" stroke="#f97316" strokeWidth={3} name="Utilization %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
