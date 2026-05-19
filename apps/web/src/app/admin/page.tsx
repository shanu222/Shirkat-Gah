'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Activity, Settings } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface AdminOverview {
  stats?: { totalUsers?: number; activeUsers?: number; totalRoles?: number };
  roles?: Array<{ id: string; name: string; slug: string; userCount: number }>;
  recentAuditLogs?: Array<{
    id: string;
    action: string;
    entity: string;
    createdAt: string;
    user?: { email: string };
  }>;
  settings?: Array<{ key: string; value: unknown; category: string }>;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => api.admin.overview(token!) as Promise<AdminOverview>,
    enabled: !!token,
  });

  if (!session) {
    return (
      <AppShell variant="dashboard" title="Admin">
        <div className="max-w-lg mx-auto py-20 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in with admin credentials.</p>
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell variant="dashboard" title="Admin">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">Platform administration and user management</p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-primary mb-3" />
                  <p className="text-3xl font-bold">{data?.stats?.totalUsers ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Activity className="w-8 h-8 text-emerald-500 mb-3" />
                  <p className="text-3xl font-bold">{data?.stats?.activeUsers ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Shield className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="text-3xl font-bold">{data?.stats?.totalRoles ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Roles</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="roles">
              <TabsList>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="roles" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Role Management</CardTitle>
                    <CardDescription>System roles and user assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data?.roles?.map((role) => (
                        <div key={role.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <p className="text-sm text-muted-foreground">{role.slug}</p>
                          </div>
                          <Badge variant="secondary">{role.userCount} users</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="audit" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Audit Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data?.recentAuditLogs?.map((log) => (
                        <div key={log.id} className="flex justify-between text-sm p-2 border-b border-border last:border-0">
                          <span>
                            <Badge variant="outline" className="mr-2">{log.action}</Badge>
                            {log.entity}
                          </span>
                          <span className="text-muted-foreground">{log.user?.email ?? 'System'}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data?.settings?.map((s) => (
                        <div key={s.key} className="flex justify-between p-3 rounded-lg bg-muted/50">
                          <span className="font-medium">{s.key}</span>
                          <Badge variant="outline">{s.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppShell>
  );
}
