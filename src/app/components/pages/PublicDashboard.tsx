import { motion } from 'motion/react';
import { Users, Target, MapPin, Award, BookOpen, Heart, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function PublicDashboard() {
  const impactStats = [
    { label: 'Women Empowered', value: '152,450', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { label: 'Communities Reached', value: '82', icon: MapPin, color: 'from-blue-500 to-cyan-500' },
    { label: 'Training Programs', value: '200+', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Policy Impacts', value: '25', icon: Award, color: 'from-orange-500 to-amber-500' },
  ];

  const sdgData = [
    { name: 'Gender Equality', value: 35, color: '#047857' },
    { name: 'Good Health', value: 25, color: '#0ea5e9' },
    { name: 'Quality Education', value: 20, color: '#14b8a6' },
    { name: 'Peace & Justice', value: 20, color: '#f97316' },
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
      description: 'Influenced 5 provincial policies on women\'s rights',
      impact: '3 policies enacted',
      image: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Public Impact Portal</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Our Impact Across Pakistan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforming lives through women empowerment, advocacy, and sustainable development programs
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow border-2">
                    <CardContent className="pt-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Geographic Reach</CardTitle>
                <CardDescription>Beneficiaries by province</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={provinceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="province" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="beneficiaries" fill="#047857" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>SDG Alignment</CardTitle>
                <CardDescription>Program distribution by Sustainable Development Goals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sdgData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sdgData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Success Stories</h2>
              <p className="text-muted-foreground">Real impact from our programs across Pakistan</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story, index) => {
                const Icon = story.image;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow border-2">
                      <CardHeader>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-center text-lg">{story.title}</CardTitle>
                        <CardDescription className="text-center">{story.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {story.impact}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Thematic Areas</CardTitle>
              <CardDescription>Our core focus areas for sustainable impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'SRHR Advocacy', progress: 85 },
                  { name: 'Women Empowerment', progress: 92 },
                  { name: 'Governance', progress: 78 },
                  { name: 'Research & Capacity', progress: 88 },
                ].map((area, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{area.name}</span>
                      <span className="text-sm text-muted-foreground">{area.progress}%</span>
                    </div>
                    <Progress value={area.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
