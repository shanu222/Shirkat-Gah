import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Request Access' };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 cinematic-overlay-strong pointer-events-none" aria-hidden />
      <Card className="w-full max-w-md glass-card shadow-xl relative z-10">
        <CardHeader>
          <CardTitle>Request Platform Access</CardTitle>
          <CardDescription>
            New accounts are provisioned by your organization administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            To request access to the Shirkat Gah platform, contact your system administrator or email{' '}
            <a href="mailto:admin@shirkatgah.org" className="text-primary hover:underline">
              admin@shirkatgah.org
            </a>
            .
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <a href="mailto:admin@shirkatgah.org?subject=Platform%20Access%20Request">
                <Mail className="w-4 h-4 mr-2" />
                Email Administrator
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
