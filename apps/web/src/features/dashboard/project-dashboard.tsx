'use client';

import { motion } from 'framer-motion';
import {
  Target,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Users,
  DollarSign,
  MapPin,
  TrendingUp,
  Clock,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PageContainer, PageHeader } from '@/components/design-system/page-layout';
import { FadeIn } from '@/components/design-system/motion';

export function ProjectDashboard() {
  const projects = [
    {
      id: 1,
      name: 'Women Leadership Training Program',
      status: 'on-track',
      progress: 75,
      budget: 85,
      beneficiaries: 1250,
      location: 'Lahore, Punjab',
      deadline: '2026-08-30',
      kpis: [
        { label: 'Training Sessions', target: 40, achieved: 32 },
        { label: 'Participants', target: 1500, achieved: 1250 },
        { label: 'Certifications', target: 1200, achieved: 980 },
      ]
    },
    {
      id: 2,
      name: 'SRHR Advocacy Campaign',
      status: 'at-risk',
      progress: 55,
      budget: 72,
      beneficiaries: 8500,
      location: 'Karachi, Sindh',
      deadline: '2026-07-15',
      kpis: [
        { label: 'Awareness Events', target: 25, achieved: 15 },
        { label: 'Reach', target: 10000, achieved: 8500 },
        { label: 'Policy Briefs', target: 5, achieved: 3 },
      ]
    },
    {
      id: 3,
      name: 'Rural Governance Strengthening',
      status: 'on-track',
      progress: 82,
      budget: 90,
      beneficiaries: 3200,
      location: 'Multan, Punjab',
      deadline: '2026-06-20',
      kpis: [
        { label: 'Communities Trained', target: 50, achieved: 45 },
        { label: 'Local Leaders', target: 150, achieved: 135 },
        { label: 'Governance Plans', target: 40, achieved: 38 },
      ]
    },
  ];

  const milestones = [
    { title: 'Project Initiation', status: 'completed', date: '2025-12-01' },
    { title: 'Baseline Assessment', status: 'completed', date: '2026-01-15' },
    { title: 'Mid-term Review', status: 'in-progress', date: '2026-05-30' },
    { title: 'Final Evaluation', status: 'upcoming', date: '2026-08-15' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-emerald-500';
      case 'at-risk':
        return 'bg-amber-500';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">On Track</Badge>;
      case 'at-risk':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">At Risk</Badge>;
      case 'delayed':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Delayed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader
          title="Project Dashboard"
          description="Monitor and track project performance, KPIs, and milestones"
          actions={
            <Button size="sm" className="shadow-sm">
              <Target className="w-4 h-4 mr-2" />
              New Project
            </Button>
          }
        />

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="surface-interactive">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          {getStatusBadge(project.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {project.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(project.deadline).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {project.beneficiaries.toLocaleString()} beneficiaries
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="kpis">KPIs</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Project Progress</span>
                              <span className="text-sm text-muted-foreground">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-3" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Budget Utilization</span>
                              <span className="text-sm text-muted-foreground">{project.budget}%</span>
                            </div>
                            <Progress value={project.budget} className="h-3" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="w-4 h-4 text-primary" />
                                <span className="text-xs text-muted-foreground">Overall Status</span>
                              </div>
                              <p className="text-lg font-semibold">{project.status === 'on-track' ? 'On Track' : 'At Risk'}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="w-4 h-4 text-secondary" />
                                <span className="text-xs text-muted-foreground">Beneficiaries</span>
                              </div>
                              <p className="text-lg font-semibold">{project.beneficiaries.toLocaleString()}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-accent" />
                                <span className="text-xs text-muted-foreground">Budget Used</span>
                              </div>
                              <p className="text-lg font-semibold">{project.budget}%</p>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="kpis" className="mt-4">
                        <div className="space-y-4">
                          {project.kpis.map((kpi, kpiIndex) => (
                            <div key={kpiIndex}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{kpi.label}</span>
                                <span className="text-sm text-muted-foreground">
                                  {kpi.achieved} / {kpi.target}
                                </span>
                              </div>
                              <Progress value={(kpi.achieved / kpi.target) * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="timeline" className="mt-4">
                        <div className="space-y-3">
                          {milestones.map((milestone, mIndex) => (
                            <div key={mIndex} className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                milestone.status === 'completed' ? 'bg-emerald-500' :
                                milestone.status === 'in-progress' ? 'bg-blue-500' :
                                'bg-gray-300'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{milestone.title}</p>
                                <p className="text-xs text-muted-foreground">{new Date(milestone.date).toLocaleDateString()}</p>
                              </div>
                              {milestone.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {milestone.status === 'in-progress' && <Clock className="w-4 h-4 text-blue-500" />}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
      </FadeIn>
    </PageContainer>
  );
}
