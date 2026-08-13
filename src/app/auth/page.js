'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center text-sm text-neutral-500">
      Redirecting to Login...
    </div>
  );
}
