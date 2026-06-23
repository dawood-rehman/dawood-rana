'use client';

import { useState, useRef, useEffect } from 'react';
import { FaUndo, FaRedo, FaSun, FaImage, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
    const savedImage = localStorage.getItem('cms_profilePicture');
    if (savedImage) {
      setProfileImage(savedImage);
      setPreviewImage(savedImage);
    }
  }, []);

  // Drag handlers
  const handleMouseDown = (e) => {
    if (!previewContainerRef.current || !imageRef.current) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !previewContainerRef.current || !imageRef.current) return;

    const container = previewContainerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate movement
    const moveX = e.clientX - rect.left - (rect.width / 2);
    const moveY = e.clientY - rect.top - (rect.height / 2);
    
    // Limit movement to keep image visible on all sides
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

  // Add event listeners
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

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result;
      setPreviewImage(imageData);
      setEditSettings({ rotation: 0, brightness: 100, contrast: 100, saturation: 100, offsetX: 0, offsetY: 0 });
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  // Apply filters and save
  const applyAndSave = () => {
    if (!previewImage) return;

    setLoading(true);
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img) {
      setLoading(false);
      return;
    }

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setLoading(false);
      return;
    }

    // Apply filters first
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

    // Calculate center and apply transformations
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.translate(centerX, centerY);
    
    // Apply rotation
    if (editSettings.rotation !== 0) {
      ctx.rotate((editSettings.rotation * Math.PI) / 180);
    }
    
    // Apply offset (scale to image size)
    const scale = canvas.width / 160; // 160px is approximate screen size, scale to canvas
    ctx.translate(editSettings.offsetX * scale, editSettings.offsetY * scale);
    
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(img, 0, 0);

    // Convert canvas to data URL and save
    const editedImage = canvas.toDataURL('image/jpeg', 0.95);
    localStorage.setItem('cms_profilePicture', editedImage);
    setProfileImage(editedImage);
    setIsEditing(false);
    setLoading(false);
    toast.success('Profile picture updated!');
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
    <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 dark:border-slate-700/50">
      <h3 className="text-xl sm:text-2xl font-bold mb-6 text-white dark:text-slate-100 flex items-center gap-2">
        <FaImage className="text-purple-400" /> Profile Picture
      </h3>

      {!isEditing ? (
        <div className="space-y-4">
          {/* Current Profile Picture Preview */}
          {profileImage && (
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-lg">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-150"
          >
            Choose Picture
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview with Filters */}
          <div className="bg-slate-900/50 rounded-lg p-4 flex justify-center">
            <div
              ref={previewContainerRef}
              className="relative w-40 h-40 rounded-full border-4 border-purple-500/30 cursor-move select-none flex items-center justify-center overflow-hidden"
              onMouseDown={handleMouseDown}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            >
              <img
                ref={imageRef}
                src={previewImage}
                alt="Preview"
                className="absolute w-48 h-48 object-cover"
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

          {/* Canvas for processing (hidden) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Rotation Controls */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300 mb-2">
              Rotation: {editSettings.rotation}°
            </label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setEditSettings((prev) => ({
                    ...prev,
                    rotation: (prev.rotation - 90 + 360) % 360,
                  }))
                }
                className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1"
              >
                <FaUndo /> Left
              </button>
              <button
                onClick={() =>
                  setEditSettings((prev) => ({
                    ...prev,
                    rotation: (prev.rotation + 90) % 360,
                  }))
                }
                className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1"
              >
                Right <FaRedo />
              </button>
            </div>
          </div>

          {/* Brightness Slider */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300 mb-2">
              <FaSun className="inline mr-2" />
              Brightness: {editSettings.brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={editSettings.brightness}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  brightness: parseInt(e.target.value),
                }))
              }
              className="w-full accent-purple-500"
            />
          </div>

          {/* Contrast Slider */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300 mb-2">
              Contrast: {editSettings.contrast}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={editSettings.contrast}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  contrast: parseInt(e.target.value),
                }))
              }
              className="w-full accent-purple-500"
            />
          </div>

          {/* Saturation Slider */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300 mb-2">
              Saturation: {editSettings.saturation}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={editSettings.saturation}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  saturation: parseInt(e.target.value),
                }))
              }
              className="w-full accent-purple-500"
            />
          </div>

          {/* Vertical Position (Y Offset) */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300 mb-2">
              Vertical Position: {editSettings.offsetY}px (↑ ↓)
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={editSettings.offsetY}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  offsetY: parseInt(e.target.value),
                }))
              }
              className="w-full accent-blue-500"
            />
          </div>

          {/* Horizontal Position (X Offset) */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300 mb-2">
              Horizontal Position: {editSettings.offsetX}px (← →)
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={editSettings.offsetX}
              onChange={(e) =>
                setEditSettings((prev) => ({
                  ...prev,
                  offsetX: parseInt(e.target.value),
                }))
              }
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={resetSettings}
              className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm"
            >
              Reset
            </button>
            <button
              onClick={cancelEdit}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={applyAndSave}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <FaCheck /> {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
