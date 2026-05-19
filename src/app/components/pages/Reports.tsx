import { motion } from 'motion/react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  Target,
  FileSpreadsheet,
  FileImage
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function Reports() {
  const reportCategories = [
    { label: 'Impact Reports', count: 45, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: 'Financial Reports', count: 32, icon: DollarSign, color: 'from-blue-500 to-cyan-500' },
    { label: 'Project Reports', count: 28, icon: Target, color: 'from-purple-500 to-pink-500' },
    { label: 'Analytics', count: 18, icon: BarChart3, color: 'from-orange-500 to-amber-500' },
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Q1 2026 Impact Assessment Report',
      type: 'Impact',
      date: '2026-04-30',
      size: '2.4 MB',
      format: 'PDF',
      downloads: 45,
      status: 'published'
    },
    {
      id: 2,
      title: 'Annual Financial Report 2025',
      type: 'Financial',
      date: '2026-01-15',
      size: '3.8 MB',
      format: 'PDF',
      downloads: 128,
      status: 'published'
    },
    {
      id: 3,
      title: 'Women Leadership Program - Mid-term Review',
      type: 'Project',
      date: '2026-05-10',
      size: '1.9 MB',
      format: 'PDF',
      downloads: 22,
      status: 'published'
    },
    {
      id: 4,
      title: 'SRHR Campaign Analytics Dashboard',
      type: 'Analytics',
      date: '2026-05-18',
      size: '4.2 MB',
      format: 'XLSX',
      downloads: 8,
      status: 'draft'
    },
    {
      id: 5,
      title: 'Provincial Coverage Analysis',
      type: 'Analytics',
      date: '2026-05-05',
      size: '1.5 MB',
      format: 'PDF',
      downloads: 35,
      status: 'published'
    },
  ];

  const reportTemplates = [
    { name: 'Donor Report Template', icon: FileText, description: 'Standard donor reporting format' },
    { name: 'Project Report Template', icon: Target, description: 'Project progress and KPI tracking' },
    { name: 'Financial Summary Template', icon: DollarSign, description: 'Budget and expenditure summary' },
    { name: 'Impact Assessment Template', icon: TrendingUp, description: 'Outcome and impact evaluation' },
  ];

  const scheduledReports = [
    { title: 'Monthly Financial Summary', frequency: 'Monthly', nextDue: '2026-06-01' },
    { title: 'Quarterly Impact Report', frequency: 'Quarterly', nextDue: '2026-07-15' },
    { title: 'Donor Progress Report', frequency: 'Bi-annual', nextDue: '2026-12-31' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Published</Badge>;
      case 'draft':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
      case 'PNG':
      case 'JPG':
        return <FileImage className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4" />;
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">Generate, manage, and export organizational reports</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-2 cursor-pointer">
                    <CardContent className="pt-6">
                      <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">{category.count}</div>
                      <div className="text-sm text-muted-foreground">{category.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Tabs defaultValue="recent" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="recent">Recent Reports</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="recent">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Reports</CardTitle>
                      <CardDescription>Browse and download organizational reports</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            {getFormatIcon(report.format)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground mb-1 truncate">{report.title}</h4>
                            <div className="flex gap-3 text-sm text-muted-foreground">
                              <span>{new Date(report.date).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{report.size}</span>
                              <span>•</span>
                              <span>{report.downloads} downloads</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{report.type}</Badge>
                          {getStatusBadge(report.status)}
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <div className="grid md:grid-cols-2 gap-6">
                {reportTemplates.map((template, index) => {
                  const Icon = template.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow border-2">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription>{template.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button className="flex-1 bg-primary hover:bg-primary/90">
                              Use Template
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="scheduled">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Automatically generated reports on a recurring schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scheduledReports.map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {report.frequency} • Next due: {new Date(report.nextDue).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download Latest
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Quick Generate</CardTitle>
                <CardDescription>Create common reports instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Monthly Analytics Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financial Status Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Beneficiary Impact Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <PieChart className="w-4 h-4 mr-2" />
                  Program Distribution Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Choose your preferred export format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2 text-red-500" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" />
                  Export as Excel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  Export as Word
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Export as CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
