'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const PakistanMap = dynamic(
  () => import('@/components/maps/pakistan-map').then((m) => m.PakistanMap),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[400px] rounded-xl" />,
  },
);

export { PakistanMap };
