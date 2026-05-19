import { motion } from 'motion/react';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  FileText,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Finance Management</h1>
              <p className="text-muted-foreground">Budget tracking, donor management, and financial reporting</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Upload className="w-4 h-4 mr-2" />
                Upload Budget
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {financialStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-2">
                    <CardContent className="pt-6">
                      <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="donors">Donor Budgets</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Monthly Expenditure</CardTitle>
                    <CardDescription>Spending trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyExpenses}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `PKR ${(value as number).toLocaleString()}`} />
                        <Line type="monotone" dataKey="amount" stroke="#047857" strokeWidth={3} name="Amount" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-2">
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
        </motion.div>
      </div>
    </div>
  );
}
