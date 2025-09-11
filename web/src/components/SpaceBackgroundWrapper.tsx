'use client';

import dynamic from 'next/dynamic';

// Import SpaceBackground with no SSR to prevent hydration issues
const SpaceBackground = dynamic(() => import('./SpaceBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-0" />
});

export default function SpaceBackgroundWrapper() {
  return <SpaceBackground />;
}
