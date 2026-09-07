'use client';

import { useEffect } from 'react';
import { initializeStorage } from '@/lib/storage';

export default function ClientStorageSync() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return null;
}
