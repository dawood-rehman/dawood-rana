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
        const url = data.url;
        saveToStorage(STORAGE_KEYS.RESUME, { url, name: file.name, uploadedAt: Date.now() });
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
        <p className="text-sm text-slate-300 mb-3">Upload a PDF or DOCX resume. Once uploaded, it will be available at <span className="text-cyan-400">/resume.pdf</span> for visitors to download.</p>

        <div className="flex gap-3 items-center">
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded">
            <FaUpload className="inline mr-2" /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {resumeUrl && (
            <a href={resumeUrl} download className="ml-2 px-3 py-2 bg-slate-700 text-white rounded inline-flex items-center gap-2">
              <FaDownload /> Download current
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
