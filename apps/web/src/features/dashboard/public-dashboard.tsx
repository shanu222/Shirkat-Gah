'use client';

import { Users, MapPin, Award, BookOpen, Heart, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageContainer, PageHeader } from '@/components/design-system/page-layout';
import { KpiCard, KpiGrid } from '@/components/design-system/kpi-card';
import { ChartCard } from '@/components/design-system/data-display';
import { FadeIn } from '@/components/design-system/motion';
import { CHART_COLORS, CHART_GRID_PROPS, CHART_TOOLTIP_STYLE } from '@/lib/chart-theme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function PublicDashboard() {
  const impactStats = [
    { label: 'Women Empowered', value: '152,450', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { label: 'Communities Reached', value: '82', icon: MapPin, color: 'from-blue-500 to-cyan-500' },
    { label: 'Training Programs', value: '200+', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Policy Impacts', value: '25', icon: Award, color: 'from-orange-500 to-amber-500' },
  ];

  const sdgData = [
    { name: 'Gender Equality', value: 35, color: CHART_COLORS.primary },
    { name: 'Good Health', value: 25, color: CHART_COLORS.secondary },
    { name: 'Quality Education', value: 20, color: CHART_COLORS.accent },
    { name: 'Peace & Justice', value: 20, color: CHART_COLORS.warning },
  ];

  const provinceData = [
    { province: 'Punjab', beneficiaries: 55000 },
    { province: 'Sindh', beneficiaries: 42000 },
    { province: 'KPK', beneficiaries: 35000 },
    { province: 'Balochistan', beneficiaries: 20450 },
  ];

  const successStories = [
    {
      title: 'Empowering Rural Women Leaders',
      description: 'Training 1,500 women in leadership and governance across 25 districts',
      impact: '95% completion rate',
      image: Shield,
    },
    {
      title: 'SRHR Awareness Campaign',
      description: 'Reaching 50,000 women with critical health information',
      impact: '80% knowledge increase',
      image: Heart,
    },
    {
      title: 'Policy Advocacy Success',
      description: "Influenced 5 provincial policies on women's rights",
      impact: '3 policies enacted',
      image: Award,
    },
  ];

  return (
    <PageContainer>
      <FadeIn>
        <PageHeader
          title="Our Impact Across Pakistan"
          description="Transforming lives through women empowerment, advocacy, and sustainable development programs"
          badge={
            <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">Public Impact Portal</Badge>
          }
        />

        <KpiGrid className="mb-10">
          {impactStats.map((stat) => (
            <KpiCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} gradient={stat.color} trend="neutral" />
          ))}
        </KpiGrid>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-10">
          <ChartCard title="Geographic Reach" description="Beneficiaries by province">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={provinceData} barSize={36}>
                <CartesianGrid {...CHART_GRID_PROPS} />
                <XAxis dataKey="province" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Bar dataKey="beneficiaries" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="SDG Alignment" description="Program distribution by Sustainable Development Goals">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sdgData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sdgData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <section className="mb-10">
          <PageHeader
            title="Success Stories"
            description="Real impact from our programs across Pakistan"
            className="mb-6 text-center [&_h1]:text-2xl [&>div]:items-center [&>div>div]:items-center"
          />
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {successStories.map((story, index) => {
              const Icon = story.image;
              return (
                <motion.div
                  key={story.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <Card className="h-full surface-interactive text-center">
                    <CardHeader>
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl gradient-emerald flex items-center justify-center shadow-md">
                        <Icon className="w-7 h-7 text-white" aria-hidden />
                      </div>
                      <CardTitle className="text-lg">{story.title}</CardTitle>
                      <CardDescription>{story.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                        <TrendingUp className="w-3 h-3 mr-1" aria-hidden />
                        {story.impact}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <Card className="surface-elevated bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10 border-emerald-500/10">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Thematic Areas</CardTitle>
            <CardDescription>Our core focus areas for sustainable impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'SRHR Advocacy', progress: 85 },
                { name: 'Women Empowerment', progress: 92 },
                { name: 'Governance', progress: 78 },
                { name: 'Research & Capacity', progress: 88 },
              ].map((area) => (
                <div key={area.name}>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-medium text-sm truncate">{area.name}</span>
                    <span className="text-sm text-muted-foreground tabular-nums shrink-0">{area.progress}%</span>
                  </div>
                  <Progress value={area.progress} className="h-2" aria-label={`${area.name} progress`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </PageContainer>
  );
}
