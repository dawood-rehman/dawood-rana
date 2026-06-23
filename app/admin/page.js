'use client';

import { useEffect } from 'react';
import { initializeStorage } from '@/lib/storage';
import AdminDashboard from '@/app/components/AdminDashboard';

export default function AdminPage() {
  useEffect(() => {
    // Initialize storage on first load
    initializeStorage();
  }, []);

  return <AdminDashboard />;
}
