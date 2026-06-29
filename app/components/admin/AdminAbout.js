'use client';

import { FaIdCard } from 'react-icons/fa';
import AdminPersonalInfo from './AdminPersonalInfo';
import AdminProfilePicture from './AdminProfilePicture';
import AdminResume from './AdminResume';

export default function AdminAbout() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FaIdCard />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">About Section</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Manage the profile content visitors see first: name, role, bio, photo, and downloadable resume.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <AdminPersonalInfo />
        <div className="space-y-6">
          <AdminProfilePicture />
          <AdminResume />
        </div>
      </div>
    </div>
  );
}
