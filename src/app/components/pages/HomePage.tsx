import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Users,
  Target,
  BookOpen,
  MapPin,
  TrendingUp,
  Shield,
  Heart,
  Award,
  BarChart3,
  Database,
  GraduationCap,
  DollarSign,
  Globe,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export function HomePage() {
  const stats = [
    { label: 'Women Empowered', value: '150K+', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { label: 'Active Projects', value: '45+', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { label: 'Training Programs', value: '200+', icon: BookOpen, color: 'from-teal-500 to-cyan-500' },
    { label: 'Districts Covered', value: '80+', icon: MapPin, color: 'from-orange-500 to-amber-500' },
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Leadership Dashboard',
      description: 'Executive-level analytics with real-time insights into organizational impact, program metrics, and strategic indicators.',
      link: '/dashboard/leadership',
      badge: 'Analytics'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Centralized database system for projects, evidence repository, MoV tracking, and comprehensive data governance.',
      link: '/data',
      badge: 'Core System'
    },
    {
      icon: GraduationCap,
      title: 'Learning Management',
      description: 'Modern LMS platform with courses, certifications, organizational training, and impact-driven capacity building.',
      link: '/lms',
      badge: 'Education'
    },
    {
      icon: DollarSign,
      title: 'Finance Management',
      description: 'Donor-wise budget tracking, grant utilization, expense management, and audit-ready financial reporting.',
      link: '/finance',
      badge: 'Finance'
    },
    {
      icon: Globe,
      title: 'Public Dashboard',
      description: 'Interactive impact visualization for public stakeholders with success stories, geographic coverage, and SDG alignment.',
      link: '/dashboard/public',
      badge: 'Public'
    },
    {
      icon: Target,
      title: 'Project Dashboard',
      description: 'KPI tracking, milestone management, workplan timelines, and real-time project health monitoring.',
      link: '/dashboard/projects',
      badge: 'Projects'
    },
  ];

  const impactAreas = [
    { icon: Shield, label: 'SRHR Advocacy', count: '35 campaigns' },
    { icon: Heart, label: 'Women Empowerment', count: '150K+ beneficiaries' },
    { icon: Award, label: 'Governance', count: '25 policy impacts' },
    { icon: BookOpen, label: 'Research', count: '120+ publications' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Enterprise Digital Ecosystem
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Empowering Women,
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Transforming Communities
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              An integrated digital platform for advocacy, research, capacity building, and social development programs across Pakistan.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dashboard/leadership">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Explore Dashboard
                </Button>
              </Link>
              <Link to="/dashboard/public">
                <Button size="lg" variant="outline" className="border-2">
                  <Globe className="w-5 h-5 mr-2" />
                  Public Impact
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow border-2">
                    <CardContent className="pt-6">
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Platform Modules</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Integrated Digital Ecosystem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern, scalable, and professional tools designed for development sector excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={feature.link}>
                    <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/30 group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Our Impact</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Driving Change Across Pakistan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Working on women empowerment, SRHR, advocacy, governance, research, and capacity building.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">{area.label}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{area.count}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/dashboard/public">
              <Button size="lg" variant="outline" className="border-2">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Full Impact Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join us in creating sustainable impact through data-driven programs and advocacy.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
