'use client';

import { useState, useRef, useEffect } from 'react';
import { FaUndo, FaRedo, FaSun, FaImage, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getFromStorage, saveContentSection, STORAGE_KEYS } from '@/lib/storage';

export default function AdminProfilePicture() {
  const [profileImage, setProfileImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSettings, setEditSettings] = useState({
    rotation: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    offsetX: 0,
    offsetY: 0,
  });
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load profile picture from storage
  useEffect(() => {
    const savedImage = getFromStorage(STORAGE_KEYS.PROFILE_PICTURE, '');
    if (savedImage) {
      setProfileImage(savedImage);
      setPreviewImage(savedImage);
    }
  }, []);

  // Drag handlers
  const handleMouseDown = () => {
    if (!previewContainerRef.current || !imageRef.current) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !previewContainerRef.current || !imageRef.current) return;

    const container = previewContainerRef.current;
    const rect = container.getBoundingClientRect();

    const moveX = e.clientX - rect.left - rect.width / 2;
    const moveY = e.clientY - rect.top - rect.height / 2;

    const maxOffset = 50;
    const newOffsetX = Math.max(-maxOffset, Math.min(maxOffset, moveX / 2));
    const newOffsetY = Math.max(-maxOffset, Math.min(maxOffset, moveY / 2));

    setEditSettings((prev) => ({
      ...prev,
      offsetX: Math.round(newOffsetX),
      offsetY: Math.round(newOffsetY),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result;
      setPreviewImage(imageData);
      setEditSettings({ rotation: 0, brightness: 100, contrast: 100, saturation: 100, offsetX: 0, offsetY: 0 });
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  // Apply filters, resize, and save via authenticated API
  const applyAndSave = async () => {
    if (!previewImage) return;

    setLoading(true);
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img) {
      setLoading(false);
      return;
    }

    // Clamp dimensions to maximum 512x512 to prevent QuotaExceededError and database bloat
    const maxDimension = 512;
    const naturalWidth = img.naturalWidth || img.width || 400;
    const naturalHeight = img.naturalHeight || img.height || 400;
    const scaleFactor = Math.min(maxDimension / naturalWidth, maxDimension / naturalHeight, 1);

    canvas.width = Math.round(naturalWidth * scaleFactor);
    canvas.height = Math.round(naturalHeight * scaleFactor);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setLoading(false);
      return;
    }

    const filters = [];
    if (editSettings.brightness !== 100) {
      filters.push(`brightness(${editSettings.brightness}%)`);
    }
    if (editSettings.contrast !== 100) {
      filters.push(`contrast(${editSettings.contrast}%)`);
    }
    if (editSettings.saturation !== 100) {
      filters.push(`saturate(${editSettings.saturation}%)`);
    }

    if (filters.length > 0) {
      ctx.filter = filters.join(' ');
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.translate(centerX, centerY);

    if (editSettings.rotation !== 0) {
      ctx.rotate((editSettings.rotation * Math.PI) / 180);
    }

    const previewScale = canvas.width / 160;
    ctx.translate(editSettings.offsetX * previewScale, editSettings.offsetY * previewScale);

    ctx.translate(-centerX, -centerY);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Export optimized JPEG at 0.85 quality
    const editedImage = canvas.toDataURL('image/jpeg', 0.85);

    try {
      await saveContentSection('profilePicture', editedImage);
      setProfileImage(editedImage);
      setIsEditing(false);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save profile picture');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPreviewImage(profileImage);
    setEditSettings({ rotation: 0, brightness: 100, contrast: 100, saturation: 100, offsetX: 0, offsetY: 0 });
  };

  const resetSettings = () => {
    setEditSettings({ rotation: 0, brightness: 100, contrast: 100, saturation: 100, offsetX: 0, offsetY: 0 });
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6 transition-all duration-200">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
        <FaImage className="text-purple-400" /> Profile Picture
      </h3>

      {!isEditing ? (
        <div className="space-y-4">
          {profileImage && (
            <div className="flex justify-center mb-4">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-purple-500/50 shadow-lg">
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-11 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:from-purple-700 hover:to-blue-700"
          >
            Choose Picture
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center rounded-lg bg-slate-900/60 p-4">
            <div
              ref={previewContainerRef}
              className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-purple-500/30 select-none"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <img
                ref={imageRef}
                src={previewImage}
                alt="Crop and filter preview"
                className="absolute h-48 w-48 object-cover"
                style={{
                  transform: `translate(calc(-50% + ${editSettings.offsetX}px), calc(-50% + ${editSettings.offsetY}px)) rotate(${editSettings.rotation}deg)`,
                  filter: `brightness(${editSettings.brightness}%) contrast(${editSettings.contrast}%) saturate(${editSettings.saturation}%)`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  left: '50%',
                  top: '50%',
                }}
              />
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Rotation: {editSettings.rotation}°
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditSettings((prev) => ({
                    ...prev,
                    rotation: (prev.rotation - 90 + 360) % 360,
                  }))
                }
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600"
              >
                <FaUndo /> Left
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditSettings((prev) => ({
                    ...prev,
                    rotation: (prev.rotation + 90) % 360,
                  }))
                }
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600"
              >
                Right <FaRedo />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="filter-brightness" className="mb-2 block text-sm font-semibold text-slate-300">
              <FaSun className="mr-2 inline" />
              Brightness: {editSettings.brightness}%
            </label>
            <input
              id="filter-brightness"
              type="range"
              min="0"
              max="200"
              value={editSettings.brightness}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  brightness: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label htmlFor="filter-contrast" className="mb-2 block text-sm font-semibold text-slate-300">
              Contrast: {editSettings.contrast}%
            </label>
            <input
              id="filter-contrast"
              type="range"
              min="0"
              max="200"
              value={editSettings.contrast}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  contrast: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label htmlFor="filter-saturation" className="mb-2 block text-sm font-semibold text-slate-300">
              Saturation: {editSettings.saturation}%
            </label>
            <input
              id="filter-saturation"
              type="range"
              min="0"
              max="200"
              value={editSettings.saturation}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  saturation: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label htmlFor="filter-offset-y" className="mb-2 block text-sm font-semibold text-slate-300">
              Vertical Position: {editSettings.offsetY}px
            </label>
            <input
              id="filter-offset-y"
              type="range"
              min="-50"
              max="50"
              value={editSettings.offsetY}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  offsetY: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label htmlFor="filter-offset-x" className="mb-2 block text-sm font-semibold text-slate-300">
              Horizontal Position: {editSettings.offsetX}px
            </label>
            <input
              id="filter-offset-x"
              type="range"
              min="-50"
              max="50"
              value={editSettings.offsetX}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  offsetX: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-cyan-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={resetSettings}
              className="flex-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="button"
              onClick={applyAndSave}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-medium text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
            >
              <FaCheck /> {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

