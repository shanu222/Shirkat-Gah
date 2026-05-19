'use client';

import { motion } from 'framer-motion';
import {
  Database,
  Upload,
  Download,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer, PageHeader } from '@/components/design-system/page-layout';
import { KpiCard, KpiGrid } from '@/components/design-system/kpi-card';
import { FadeIn } from '@/components/design-system/motion';

export function DataManagement() {
  const dataCategories = [
    { label: 'Quantitative Data', count: 3450, icon: BarChart3, color: 'from-emerald-500 to-teal-500' },
    { label: 'Qualitative Data', count: 1240, icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Evidence Files', count: 890, icon: ImageIcon, color: 'from-purple-500 to-pink-500' },
    { label: 'Financial Records', count: 567, icon: Database, color: 'from-orange-500 to-amber-500' },
  ];

  const recentEntries = [
    { id: 1, title: 'Women Leadership Training - Lahore District', type: 'Quantitative', status: 'approved', date: '2026-05-18', project: 'Project A' },
    { id: 2, title: 'Community Interview Transcript - Multan', type: 'Qualitative', status: 'pending', date: '2026-05-17', project: 'Project B' },
    { id: 3, title: 'SRHR Campaign Impact Photos', type: 'Evidence', status: 'approved', date: '2026-05-16', project: 'Project C' },
    { id: 4, title: 'Q1 Budget Utilization Report', type: 'Financial', status: 'approved', date: '2026-05-15', project: 'Finance' },
    { id: 5, title: 'Baseline Survey Data - KPK Region', type: 'Quantitative', status: 'pending', date: '2026-05-14', project: 'Project D' },
  ];

  const indicators = [
    { name: 'Women Trained', target: 5000, achieved: 3850, unit: 'persons' },
    { name: 'Awareness Sessions', target: 200, achieved: 165, unit: 'sessions' },
    { name: 'Policy Briefs', target: 15, achieved: 12, unit: 'documents' },
    { name: 'Communities Engaged', target: 100, achieved: 82, unit: 'communities' },
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
    <PageContainer>
      <FadeIn>
        <PageHeader
          title="Data Management"
          description="Centralized repository for project data, evidence, and indicators"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </>
          }
        />

        <KpiGrid className="mb-8">
          {dataCategories.map((category) => (
            <KpiCard
              key={category.label}
              label={category.label}
              value={String(category.count)}
              icon={category.icon}
              gradient={category.color}
              trend="neutral"
            />
          ))}
        </KpiGrid>

          <Tabs defaultValue="recent" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="recent">Recent Entries</TabsTrigger>
              <TabsTrigger value="indicators">Indicators</TabsTrigger>
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
            </TabsList>

            <TabsContent value="recent">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Data Entries</CardTitle>
                      <CardDescription>Latest submissions across all projects</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search entries..." className="pl-9 w-64" />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{entry.title}</h4>
                          <div className="flex gap-3 text-sm text-muted-foreground">
                            <span>{entry.project}</span>
                            <span>•</span>
                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{entry.type}</Badge>
                          {getStatusBadge(entry.status)}
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="indicators">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>Track progress against organizational targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {indicators.map((indicator, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">{indicator.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {indicator.achieved.toLocaleString()} / {indicator.target.toLocaleString()} {indicator.unit}
                            </p>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {Math.round((indicator.achieved / indicator.target) * 100)}%
                          </Badge>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(indicator.achieved / indicator.target) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-primary to-accent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Upload Data</CardTitle>
                  <CardDescription>Submit quantitative data, qualitative records, or evidence files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Drag & Drop Files</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse from your computer
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported: Excel, CSV, PDF, Images (max 50MB)
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mt-6">
                    <Button variant="outline" className="h-24 flex-col">
                      <BarChart3 className="w-6 h-6 mb-2" />
                      <span className="text-sm">Quantitative Data</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col">
                      <FileText className="w-6 h-6 mb-2" />
                      <span className="text-sm">Qualitative Data</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col">
                      <ImageIcon className="w-6 h-6 mb-2" aria-hidden="true" />
                      <span className="text-sm">Evidence Files</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </FadeIn>
    </PageContainer>
  );
}
