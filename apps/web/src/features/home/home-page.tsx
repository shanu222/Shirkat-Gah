'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  ChevronDown,
  Handshake,
  Megaphone,
  Scale,
  FileText,
  Download,
  Eye,
  X,
  ZoomIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CinematicAtmosphere,
  GlassCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
} from '@/components/design-system';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface CmsStat {
  label: string;
  value: string;
}

interface CmsHomepage {
  page?: { content?: { stats?: CmsStat[] } };
}

const defaultStats = [
  { label: 'Women Empowered', value: 150000, suffix: '+', icon: Users, color: 'from-fuchsia-500 to-pink-500' },
  { label: 'Active Projects', value: 45, suffix: '+', icon: Target, color: 'from-purple-500 to-violet-500' },
  { label: 'Training Programs', value: 200, suffix: '+', icon: BookOpen, color: 'from-pink-500 to-rose-500' },
  { label: 'Districts Covered', value: 80, suffix: '+', icon: MapPin, color: 'from-fuchsia-600 to-purple-500' },
];

const howWeWork = [
  {
    icon: Handshake,
    title: 'Community Partnership',
    description:
      'We work alongside women-led groups and grassroots networks to co-design programs rooted in lived experience.',
  },
  {
    icon: Megaphone,
    title: 'Advocacy & Voice',
    description:
      'Amplifying women\'s voices through campaigns, policy dialogue, and public awareness on rights and equality.',
  },
  {
    icon: Scale,
    title: 'Rights & Justice',
    description:
      'Legal literacy, SRHR advocacy, and support systems that help women claim dignity, safety, and autonomy.',
  },
  {
    icon: BookOpen,
    title: 'Research & Learning',
    description:
      'Evidence-based research, publications, and capacity building that inform practice and influence policy.',
  },
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

const galleryItems = [
  { id: 1, title: 'Community Art & Voice', position: 'center 30%' },
  { id: 2, title: 'Women\'s Collective', position: 'center 45%' },
  { id: 3, title: 'Grassroots Leadership', position: 'left center' },
  { id: 4, title: 'Training & Empowerment', position: 'right center' },
  { id: 5, title: 'Advocacy in Action', position: 'center 60%' },
  { id: 6, title: 'Solidarity & Strength', position: 'center 20%' },
];

const publications = [
  {
    title: 'Women\'s Rights in Pakistan: Policy Brief 2024',
    type: 'Policy Brief',
    year: '2024',
    pages: '48',
  },
  {
    title: 'SRHR Advocacy Toolkit',
    type: 'Toolkit',
    year: '2023',
    pages: '72',
  },
  {
    title: 'Grassroots Governance & Participation',
    type: 'Research Report',
    year: '2023',
    pages: '96',
  },
  {
    title: 'Economic Empowerment Pathways',
    type: 'Publication',
    year: '2022',
    pages: '64',
  },
];

export function HomePage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: cms, isLoading } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: async () => {
      try {
        return (await api.cms.homepage()) as CmsHomepage;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const stats =
    (cms?.page?.content as { stats?: { label: string; value: string }[] })?.stats?.map((s, i) => {
      const base = defaultStats[i] ?? defaultStats[0];
      const num = parseInt(s.value.replace(/\D/g, ''), 10) || base.value;
      return { ...base, label: s.label ?? base.label, value: num };
    }) ?? defaultStats;

  return (
    <div className="relative">
      {/* ─── Cinematic Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden parallax-bg">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/platform-background.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 cinematic-overlay-strong" aria-hidden />
        <CinematicAtmosphere />

        <div className="page-container relative z-10 py-24 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 glass-subtle text-fuchsia-200 border-fuchsia-400/30 gap-1.5 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Hamari Awaaz, Hamari Taqat
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-on-cinematic leading-[1.1] mb-6 text-balance">
              Empowering Women,{' '}
              <span className="gradient-hero-text">Transforming Communities</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-cinematic mb-10 max-w-2xl mx-auto leading-relaxed">
              A premium digital home for feminist advocacy, humanitarian impact, learning, and
              transparent governance — rooted in grassroots authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/public">
                <Button size="lg" variant="hero" className="w-full sm:w-auto gap-2 px-8">
                  Explore Our Impact
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#how-we-work">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 text-white border-white/30">
                  How We Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <a
          href="#impact-stats"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Scroll to content"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-scroll-hint" />
        </a>
      </section>

      <div className="section-divider mx-auto max-w-3xl my-4" />

      {/* ─── Impact Stats ───────────────────────────────────────────────────── */}
      <section id="impact-stats" className="py-16 sm:py-24 relative section-ambient section-scrim">
        <div className="page-container">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-on-cinematic mb-3">Our Impact at a Glance</h2>
            <p className="text-muted-cinematic max-w-xl mx-auto">
              Decades of feminist leadership, measurable change, and community-rooted action
            </p>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-2xl glass" />
                ))
              : stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <StaggerItem key={stat.label}>
                      <GlassCard variant="stat" interactive glow className="h-full">
                        <CardContent className="p-6 sm:p-7">
                          <div
                            className={cn(
                              'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5 stat-icon-glow',
                              stat.color,
                            )}
                          >
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <p className="text-2xl sm:text-4xl font-bold text-on-cinematic tabular-nums">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                          </p>
                          <p className="text-sm text-muted-cinematic mt-1">{stat.label}</p>
                        </CardContent>
                      </GlassCard>
                    </StaggerItem>
                  );
                })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── How We Work ────────────────────────────────────────────────────── */}
      <section id="how-we-work" className="py-16 sm:py-24 relative section-ambient">
        <div className="page-container">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-on-cinematic mb-3">How We Work</h2>
            <p className="text-muted-cinematic max-w-2xl mx-auto">
              Human-centered, participatory, and fiercely committed to women&apos;s rights
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
            {howWeWork.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <GlassCard variant="premium" interactive glow className="h-full">
                    <CardContent className="p-6 sm:p-7 flex flex-col h-full min-h-[220px]">
                      <div className="w-14 h-14 rounded-2xl gradient-feminist flex items-center justify-center mb-5 stat-icon-glow floating-gentle">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-on-cinematic mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-cinematic leading-relaxed flex-1">
                        {item.description}
                      </p>
                    </CardContent>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-3xl" />

      {/* ─── Platform Modules ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 section-ambient">
        <div className="page-container">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-on-cinematic mb-3">Integrated Platform</h2>
            <p className="text-muted-cinematic max-w-2xl mx-auto">
              One unified ecosystem connecting data, finance, learning, and public engagement
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={i * 0.05}>
                  <Link href={feature.link}>
                    <GlassCard interactive className="h-full group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center group-hover:bg-fuchsia-500/30 transition-colors">
                            <Icon className="w-6 h-6 text-fuchsia-300" />
                          </div>
                          <Badge variant="outline" className="border-white/25 text-fuchsia-200">
                            {feature.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mt-4 text-on-cinematic">{feature.title}</CardTitle>
                        <CardDescription className="text-base text-muted-cinematic leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <span className="text-fuchsia-300 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Access module <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </GlassCard>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Gallery ────────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-16 sm:py-24 section-ambient">
        <div className="page-container">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-on-cinematic mb-3">Moments of Solidarity</h2>
            <p className="text-muted-cinematic max-w-2xl mx-auto">
              Cinematic glimpses of our community, advocacy, and collective strength
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 auto-rows-[180px] sm:auto-rows-[220px]">
            {galleryItems.map((item, i) => (
              <ScrollReveal
                key={item.id}
                delay={i * 0.06}
                className={cn(
                  i === 0 && 'md:col-span-2 md:row-span-2 md:auto-rows-fr',
                  i === 3 && 'md:row-span-2',
                )}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={cn(
                    'group relative w-full h-full min-h-[180px] rounded-[24px] overflow-hidden glass-card glass-card-interactive border-0 p-0 text-left',
                    i === 0 && 'md:min-h-[460px]',
                  )}
                >
                  <Image
                    src="/platform-background.png"
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ objectPosition: item.position }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,4,20,0.92)] via-[rgba(12,4,20,0.35)] to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                    <p className="text-on-cinematic font-semibold text-sm sm:text-base">{item.title}</p>
                    <ZoomIn className="w-5 h-5 text-white/70 group-hover:text-white shrink-0" />
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl glass-modal p-0 overflow-hidden border-0">
          <DialogTitle className="sr-only">
            {lightboxIndex !== null ? galleryItems[lightboxIndex]?.title : 'Gallery'}
          </DialogTitle>
          {lightboxIndex !== null && (
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/platform-background.png"
                alt={galleryItems[lightboxIndex].title}
                fill
                className="object-cover"
                style={{ objectPosition: galleryItems[lightboxIndex].position }}
              />
              <div className="absolute inset-0 cinematic-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-on-cinematic text-xl font-bold">
                  {galleryItems[lightboxIndex].title}
                </p>
              </div>
              <Button
                variant="glass"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Publications ───────────────────────────────────────────────────── */}
      <section id="publications" className="py-16 sm:py-24 section-ambient section-scrim">
        <div className="page-container">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-on-cinematic mb-3">Publications & Research</h2>
            <p className="text-muted-cinematic max-w-2xl mx-auto">
              Evidence, policy briefs, and tools advancing feminist knowledge
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {publications.map((pub, i) => (
              <ScrollReveal key={pub.title} delay={i * 0.08}>
                <GlassCard variant="premium" interactive glow className="h-full">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex gap-4">
                      <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl gradient-feminist flex items-center justify-center shrink-0 stat-icon-glow">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Badge variant="outline" className="mb-2 border-fuchsia-400/30 text-fuchsia-200">
                          {pub.type} · {pub.year}
                        </Badge>
                        <h3 className="font-bold text-on-cinematic text-lg leading-snug mb-2">
                          {pub.title}
                        </h3>
                        <p className="text-sm text-muted-cinematic mb-4">{pub.pages} pages</p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="hero" className="gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </Button>
                          <Button size="sm" variant="glass" className="gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Impact Areas ───────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 pb-28 section-ambient">
        <div className="page-container">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-on-cinematic">Impact Areas</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Shield, label: 'SRHR Advocacy', count: '35 campaigns' },
              { icon: Heart, label: 'Women Empowerment', count: '150K+ beneficiaries' },
              { icon: Award, label: 'Governance', count: '25 policy impacts' },
              { icon: BookOpen, label: 'Research', count: '120+ publications' },
            ].map((area, i) => {
              const Icon = area.icon;
              return (
                <ScrollReveal key={area.label} delay={i * 0.06}>
                  <GlassCard interactive float className="text-center h-full">
                    <CardContent className="p-6">
                      <Icon className="w-9 h-9 text-fuchsia-300 mx-auto mb-3" />
                      <p className="font-semibold text-on-cinematic">{area.label}</p>
                      <p className="text-sm text-muted-cinematic mt-1">{area.count}</p>
                    </CardContent>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
