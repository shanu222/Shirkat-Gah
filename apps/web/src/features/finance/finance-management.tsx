'use client';

import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  FileText,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer, PageHeader } from '@/components/design-system/page-layout';
import { KpiCard, KpiGrid } from '@/components/design-system/kpi-card';
import { ChartCard, StatusBadge } from '@/components/design-system/data-display';
import { FadeIn } from '@/components/design-system/motion';
import { CHART_COLORS, CHART_GRID_PROPS, CHART_TOOLTIP_STYLE } from '@/lib/chart-theme';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function FinanceManagement() {
  const financialStats = [
    { label: 'Total Budget', value: 'PKR 45.2M', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { label: 'Utilized', value: 'PKR 35.3M', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
    { label: 'Remaining', value: 'PKR 9.9M', icon: PieChart, color: 'from-purple-500 to-pink-500' },
    { label: 'Pending Approvals', value: '12', icon: Clock, color: 'from-orange-500 to-amber-500' },
  ];

  const donorBudgets = [
    { donor: 'UN Women', allocated: 15000000, utilized: 12500000, utilization: 83 },
    { donor: 'DFID', allocated: 12000000, utilized: 9800000, utilization: 82 },
    { donor: 'USAID', allocated: 10000000, utilized: 7500000, utilization: 75 },
    { donor: 'EU Grant', allocated: 8200000, utilized: 5500000, utilization: 67 },
  ];

  const monthlyExpenses = [
    { month: 'Jan', amount: 6500000 },
    { month: 'Feb', amount: 7200000 },
    { month: 'Mar', amount: 6800000 },
    { month: 'Apr', amount: 7500000 },
    { month: 'May', amount: 7300000 },
  ];

  const expenseCategories = [
    { category: 'Salaries & Benefits', budget: 18000000, spent: 14500000, color: '#047857' },
    { category: 'Program Activities', budget: 15000000, spent: 12000000, color: '#0ea5e9' },
    { category: 'Operations', budget: 8000000, spent: 6200000, color: '#14b8a6' },
    { category: 'Travel & Logistics', budget: 4200000, spent: 2600000, color: '#f97316' },
  ];

  const recentTransactions = [
    { id: 1, description: 'Training Materials - Lahore', amount: 125000, status: 'approved', date: '2026-05-18', project: 'Project A' },
    { id: 2, description: 'Venue Rental - Karachi', amount: 85000, status: 'pending', date: '2026-05-17', project: 'Project B' },
    { id: 3, description: 'Travel Expenses - Team', amount: 45000, status: 'approved', date: '2026-05-16', project: 'Project C' },
    { id: 4, description: 'Publication Printing', amount: 95000, status: 'pending', date: '2026-05-15', project: 'Communications' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <StatusBadge status="success" icon={CheckCircle2}>Approved</StatusBadge>;
      case 'pending':
        return <StatusBadge status="warning" icon={Clock}>Pending</StatusBadge>;
      case 'rejected':
        return <StatusBadge status="error" icon={AlertCircle}>Rejected</StatusBadge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader
          title="Finance Management"
          description="Budget tracking, donor management, and financial reporting"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="shadow-sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Budget
              </Button>
            </>
          }
        />

        <KpiGrid className="mb-8">
          {financialStats.map((stat) => (
            <KpiCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} gradient={stat.color} trend="neutral" />
          ))}
        </KpiGrid>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full sm:w-auto h-auto flex flex-wrap gap-1 bg-muted/50 p-1">
            <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
            <TabsTrigger value="donors" className="rounded-md">Donor Budgets</TabsTrigger>
            <TabsTrigger value="expenses" className="rounded-md">Expenses</TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-md">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-0">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <ChartCard title="Monthly Expenditure" description="Spending trends over time">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyExpenses}>
                    <CartesianGrid {...CHART_GRID_PROPS} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(value) => [`PKR ${(value as number).toLocaleString()}`, 'Amount']} />
                    <Line type="monotone" dataKey="amount" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={{ r: 4 }} name="Amount" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <Card className="surface-elevated">
                  <CardHeader>
                    <CardTitle>Budget by Category</CardTitle>
                    <CardDescription>Allocated vs spent</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expenseCategories.map((cat, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{cat.category}</span>
                            <span className="text-sm text-muted-foreground">
                              PKR {(cat.spent / 1000000).toFixed(1)}M / {(cat.budget / 1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(cat.spent / cat.budget) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full"
                              style={{ backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="donors">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Donor-wise Budget Utilization</CardTitle>
                  <CardDescription>Track utilization by funding source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {donorBudgets.map((donor, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{donor.donor}</h4>
                            <p className="text-sm text-muted-foreground">
                              PKR {(donor.utilized / 1000000).toFixed(1)}M of {(donor.allocated / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {donor.utilization}%
                          </Badge>
                        </div>
                        <Progress value={donor.utilization} className="h-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>Breakdown of spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={expenseCategories}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value) => `PKR ${(value as number / 1000000).toFixed(1)}M`} />
                      <Bar dataKey="budget" name="Budget" fill="#cbd5e1" />
                      <Bar dataKey="spent" name="Spent">
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest financial activities requiring approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{transaction.description}</h4>
                          <div className="flex gap-3 text-sm text-muted-foreground">
                            <span>{transaction.project}</span>
                            <span>•</span>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-foreground">
                            PKR {transaction.amount.toLocaleString()}
                          </span>
                          {getStatusBadge(transaction.status)}
                          <Button variant="ghost" size="sm">Review</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </FadeIn>
    </PageContainer>
  );
}
