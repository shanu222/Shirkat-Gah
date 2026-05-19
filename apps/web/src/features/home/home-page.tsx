'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Target,
  BookOpen,
  MapPin,
  BarChart3,
  Database,
  GraduationCap,
  DollarSign,
  Globe,
  Sparkles,
  Shield,
  Heart,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';

interface CmsStat {
  label: string;
  value: string;
}

interface CmsHomepage {
  page?: { content?: { stats?: CmsStat[] } };
}

const defaultStats = [
  { label: 'Women Empowered', value: '150K+', icon: Users, color: 'from-emerald-500 to-teal-500' },
  { label: 'Active Projects', value: '45+', icon: Target, color: 'from-blue-500 to-cyan-500' },
  { label: 'Training Programs', value: '200+', icon: BookOpen, color: 'from-teal-500 to-cyan-500' },
  { label: 'Districts Covered', value: '80+', icon: MapPin, color: 'from-orange-500 to-amber-500' },
];

const features = [
  {
    icon: BarChart3,
    title: 'Leadership Dashboard',
    description: 'Executive-level analytics with real-time insights into organizational impact.',
    link: '/dashboard/leadership',
    badge: 'Analytics',
  },
  {
    icon: Database,
    title: 'Data Management',
    description: 'Centralized database for projects, evidence repository, and MoV tracking.',
    link: '/data',
    badge: 'Core System',
  },
  {
    icon: GraduationCap,
    title: 'Learning Management',
    description: 'Modern LMS with courses, certifications, and capacity building.',
    link: '/lms',
    badge: 'Education',
  },
  {
    icon: DollarSign,
    title: 'Finance Management',
    description: 'Donor-wise budget tracking, grant utilization, and audit-ready reporting.',
    link: '/finance',
    badge: 'Finance',
  },
  {
    icon: Globe,
    title: 'Public Dashboard',
    description: 'Interactive impact visualization with SDG alignment and success stories.',
    link: '/dashboard/public',
    badge: 'Public',
  },
  {
    icon: Target,
    title: 'Project Dashboard',
    description: 'KPI tracking, milestone management, and real-time project health.',
    link: '/dashboard/projects',
    badge: 'Projects',
  },
];

export function HomePage() {
  const { data: cms, isLoading } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: () => api.cms.homepage() as Promise<CmsHomepage>,
  });

  const stats =
    (cms?.page?.content as { stats?: typeof defaultStats })?.stats?.map((s, i) => ({
      ...defaultStats[i],
      ...s,
      icon: defaultStats[i]?.icon ?? Users,
      color: defaultStats[i]?.color ?? 'from-emerald-500 to-teal-500',
    })) ?? defaultStats;

  return (
    <div className="gradient-hero">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-sky-100/40 dark:from-emerald-900/20 dark:to-sky-900/20" />
        <div className="page-container py-16 sm:py-24 lg:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 gap-1">
              <Sparkles className="w-3 h-3" />
              Enterprise Digital Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6">
              Empowering Women,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Transforming Communities
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Integrated platform for impact measurement, learning management, financial governance,
              and public transparency — built for international development standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/leadership">
                <Button size="lg" className="w-full sm:w-auto gap-2 gradient-emerald shadow-lg">
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard/public">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Public Impact
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))
              : stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Integrated Platform Modules</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              One unified ecosystem connecting data, finance, learning, and public engagement
            </p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={feature.link}>
                    <Card className="h-full surface-interactive cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <Badge variant="outline">{feature.badge}</Badge>
                        </div>
                        <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Access module <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="page-container">
          <h2 className="text-3xl font-bold text-center mb-12">Impact Areas</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Shield, label: 'SRHR Advocacy', count: '35 campaigns' },
              { icon: Heart, label: 'Women Empowerment', count: '150K+ beneficiaries' },
              { icon: Award, label: 'Governance', count: '25 policy impacts' },
              { icon: BookOpen, label: 'Research', count: '120+ publications' },
            ].map((area) => {
              const Icon = area.icon;
              return (
                <Card key={area.label} className="text-center glass">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="font-semibold">{area.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{area.count}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
