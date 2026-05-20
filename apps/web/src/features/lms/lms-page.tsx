'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap,
  PlayCircle,
  BookOpen,
  Award,
  Users,
  Clock,
  Star,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LMSPage() {
  const stats = [
    { label: 'Total Courses', value: '85', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
    { label: 'Active Learners', value: '3,240', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Certificates Issued', value: '1,890', icon: Award, color: 'from-purple-500 to-pink-500' },
    { label: 'Organizations', value: '45', icon: TrendingUp, color: 'from-orange-500 to-amber-500' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Women Leadership & Empowerment',
      description: 'Comprehensive training on leadership skills, community organizing, and advocacy',
      category: 'Leadership',
      level: 'Intermediate',
      duration: '8 weeks',
      enrolled: 450,
      rating: 4.8,
      progress: 65,
      isFree: true,
      instructor: 'Dr. Ayesha Khan',
    },
    {
      id: 2,
      title: 'SRHR Fundamentals',
      description: 'Sexual and Reproductive Health Rights awareness and advocacy training',
      category: 'Health',
      level: 'Beginner',
      duration: '4 weeks',
      enrolled: 620,
      rating: 4.9,
      progress: 0,
      isFree: true,
      instructor: 'Dr. Fatima Malik',
    },
    {
      id: 3,
      title: 'Governance & Policy Advocacy',
      description: 'Learn policy analysis, advocacy strategies, and governance frameworks',
      category: 'Governance',
      level: 'Advanced',
      duration: '12 weeks',
      enrolled: 280,
      rating: 4.7,
      progress: 40,
      isFree: false,
      instructor: 'Prof. Sarah Ahmed',
    },
    {
      id: 4,
      title: 'Research Methods for Development',
      description: 'Practical research methodologies and data collection techniques',
      category: 'Research',
      level: 'Intermediate',
      duration: '6 weeks',
      enrolled: 340,
      rating: 4.6,
      progress: 0,
      isFree: false,
      instructor: 'Dr. Zainab Hassan',
    },
  ];

  const learningPath = [
    { module: 'Introduction to Leadership', completed: true },
    { module: 'Community Organizing', completed: true },
    { module: 'Advocacy Strategies', completed: true },
    { module: 'Public Speaking', completed: false },
    { module: 'Final Assessment', completed: false },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Learning Management System</h1>
              <p className="text-muted-foreground">Access courses, training programs, and certifications</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <GraduationCap className="w-4 h-4 mr-2" />
              My Learning
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
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
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Tabs defaultValue="browse" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="browse">Browse Courses</TabsTrigger>
              <TabsTrigger value="enrolled">My Courses</TabsTrigger>
              <TabsTrigger value="organizations">For Organizations</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <Card className="border-2 mb-6">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search courses..." className="pl-9" />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow border-2">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">{course.category}</Badge>
                          {course.isFree ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Free</Badge>
                          ) : (
                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Premium</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.enrolled} enrolled
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            {course.rating}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          <strong>Instructor:</strong> {course.instructor}
                        </p>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Enroll Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enrolled">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-2">
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses.filter(c => c.progress > 0).map((course) => (
                      <div key={course.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-foreground mb-1">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">{course.instructor}</p>
                          </div>
                          <Badge>{course.progress}% complete</Badge>
                        </div>
                        <Progress value={course.progress} className="mb-3" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Learning Path</CardTitle>
                    <CardDescription>Your progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {learningPath.map((module, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            module.completed ? 'bg-emerald-500' : 'bg-muted'
                          }`}>
                            {module.completed && <Award className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${module.completed ? 'font-medium' : 'text-muted-foreground'}`}>
                              {module.module}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="organizations">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Organizational Training Programs</CardTitle>
                  <CardDescription>Bulk licenses and custom training for your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Bulk Licenses</h3>
                      <p className="text-sm text-muted-foreground">Purchase seats for your entire team</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Custom Courses</h3>
                      <p className="text-sm text-muted-foreground">Tailored training for your needs</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Analytics</h3>
                      <p className="text-sm text-muted-foreground">Track team progress and completion</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Contact for Organizational Access
                    </Button>
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
