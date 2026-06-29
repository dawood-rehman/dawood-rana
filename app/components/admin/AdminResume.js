'use client';

import { useState, useEffect } from 'react';
import { FaUpload, FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function AdminResume() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const meta = getFromStorage(STORAGE_KEYS.RESUME, null);
    if (meta && meta.url) setResumeUrl(meta.url);
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please choose a file to upload');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const res = await fetch('/api/upload-resume', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        const url = data.url || '/api/resume';
        saveToStorage(
          STORAGE_KEYS.RESUME,
          {
            url,
            name: data.name || file.name,
            contentType: data.contentType || file.type,
            size: data.size || file.size,
            uploadedAt: data.uploadedAt || Date.now(),
          },
          { sync: false }
        );
        setResumeUrl(url);
        toast.success('Resume uploaded successfully');
        setFile(null);
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Manage Resume</h2>

      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 sm:p-6 border border-slate-600">
        <p className="text-sm text-slate-300 mb-3">Upload a PDF or DOCX resume. In production it is saved through the resume API so visitors can download the latest CV reliably.</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white sm:w-auto"
          />
          <button onClick={handleUpload} disabled={uploading} className="min-h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors duration-150 hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            <FaUpload className="inline mr-2" /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {resumeUrl && (
            <a href={resumeUrl} download className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-slate-600 sm:ml-1">
              <FaDownload /> Download current
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
