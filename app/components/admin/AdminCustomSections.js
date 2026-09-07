'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaFolderPlus, FaPlus, FaPuzzlePiece, FaTrash } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminCustomSections() {
  const [customSections, setCustomSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [sectionForm, setSectionForm] = useState({
    title: '',
    eyebrow: '',
    subtitle: '',
    slug: '',
  });

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({
    title: '',
    subtitle: '',
    date: '',
    description: '',
    link: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomSections();
  }, []);

  const loadCustomSections = () => {
    const data = getFromStorage(STORAGE_KEYS.CUSTOM_SECTIONS, DEFAULT_DATA.customSections);
    const list = Array.isArray(data) ? data : [];
    setCustomSections(list);
    if (list.length > 0 && !activeSectionId) {
      setActiveSectionId(list[0].id);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!sectionForm.title.trim()) {
      toast.error('Section Title is required');
      return;
    }

    const id = `custom_${Date.now()}`;
    const slug = (sectionForm.slug || sectionForm.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newSection = {
      id,
      slug: slug || id,
      title: sectionForm.title,
      eyebrow: sectionForm.eyebrow || 'Special',
      subtitle: sectionForm.subtitle || '',
      items: [],
      order: 10 + customSections.length,
      enabled: true,
    };

    const updated = [...customSections, newSection];
    setLoading(true);

    try {
      await saveContentSection('customSections', updated);

      // Also add to sectionsConfig so it appears on the landing page
      const currentConfig = getFromStorage(STORAGE_KEYS.SECTIONS_CONFIG, DEFAULT_DATA.sectionsConfig) || [];
      if (!currentConfig.some((s) => s.id === id)) {
        const updatedConfig = [
          ...currentConfig,
          { id, name: sectionForm.title, enabled: true, order: currentConfig.length + 1 },
        ];
        await saveContentSection('sectionsConfig', updatedConfig);
      }

      setCustomSections(updated);
      setActiveSectionId(id);
      setIsCreatingSection(false);
      setSectionForm({ title: '', eyebrow: '', subtitle: '', slug: '' });
      toast.success('Custom section created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to create custom section');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (!confirm('Are you sure you want to delete this entire custom section?')) return;

    const updated = customSections.filter((s) => s.id !== id);
    setCustomSections(updated);

    try {
      await saveContentSection('customSections', updated);
      const currentConfig = getFromStorage(STORAGE_KEYS.SECTIONS_CONFIG, DEFAULT_DATA.sectionsConfig) || [];
      const updatedConfig = currentConfig.filter((s) => s.id !== id);
      await saveContentSection('sectionsConfig', updatedConfig);

      toast.success('Custom section deleted');
      setActiveSectionId(updated[0]?.id || null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete section');
      loadCustomSections();
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.title.trim()) {
      toast.error('Item title is required');
      return;
    }

    const currentSec = customSections.find((s) => s.id === activeSectionId);
    if (!currentSec) return;

    let updatedItems;
    if (editingItemId) {
      updatedItems = (currentSec.items || []).map((item) =>
        item.id === editingItemId ? { ...item, ...itemForm } : item
      );
    } else {
      updatedItems = [
        ...(currentSec.items || []),
        { id: Date.now().toString(), ...itemForm },
      ];
    }

    const updatedSections = customSections.map((s) =>
      s.id === activeSectionId ? { ...s, items: updatedItems } : s
    );

    setLoading(true);
    try {
      await saveContentSection('customSections', updatedSections);
      setCustomSections(updatedSections);
      setIsAddingItem(false);
      setEditingItemId(null);
      setItemForm({ title: '', subtitle: '', date: '', description: '', link: '' });
      toast.success(editingItemId ? 'Item updated' : 'Item added');
    } catch (err) {
      toast.error(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const currentSec = customSections.find((s) => s.id === activeSectionId);
    if (!currentSec) return;

    const updatedItems = (currentSec.items || []).filter((i) => i.id !== itemId);
    const updatedSections = customSections.map((s) =>
      s.id === activeSectionId ? { ...s, items: updatedItems } : s
    );

    try {
      await saveContentSection('customSections', updatedSections);
      setCustomSections(updatedSections);
      toast.success('Item deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete item');
    }
  };

  const activeSection = customSections.find((s) => s.id === activeSectionId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaPuzzlePiece className="text-blue-400" /> Custom Sections
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create arbitrary custom sections (e.g. Certifications, Open Source, Awards) and add cards dynamically.
          </p>
        </div>

        {!isCreatingSection && (
          <button
            onClick={() => setIsCreatingSection(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <FaFolderPlus /> Create New Section
          </button>
        )}
      </div>

      {isCreatingSection && (
        <form onSubmit={handleCreateSection} className="bg-slate-800 p-5 rounded-lg border border-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-white">Create Custom Landing Page Section</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Section Title *</label>
              <input
                type="text"
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                placeholder="e.g. Certifications & Badges"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Eyebrow Badge</label>
              <input
                type="text"
                value={sectionForm.eyebrow}
                onChange={(e) => setSectionForm({ ...sectionForm, eyebrow: e.target.value })}
                placeholder="e.g. Credentials"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Subtitle / Summary</label>
            <input
              type="text"
              value={sectionForm.subtitle}
              onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
              placeholder="Verified professional credentials and specialized assessments."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg"
            >
              {loading ? 'Creating...' : 'Create Section'}
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingSection(false)}
              className="px-5 py-2 bg-slate-700 text-white text-sm rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {customSections.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center text-slate-400 text-sm">
          No custom sections created yet. Click &quot;Create New Section&quot; to build additional sections for your portfolio.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Section sidebar */}
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Custom Sections ({customSections.length})
            </h4>
            <div className="space-y-1">
              {customSections.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSectionId(s.id)}
                  className={`flex items-center justify-between p-2.5 rounded cursor-pointer text-sm font-semibold transition-colors ${
                    activeSectionId === s.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{s.title}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(s.id);
                    }}
                    className="text-xs text-slate-400 hover:text-red-300 p-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active section item management */}
          {activeSection && (
            <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{activeSection.title}</h3>
                  <p className="text-xs text-slate-400">
                    Eyebrow: {activeSection.eyebrow} | Anchor ID: #{activeSection.slug}
                  </p>
                </div>

                {!isAddingItem && !editingItemId && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingItem(true);
                      setItemForm({ title: '', subtitle: '', date: '', description: '', link: '' });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded"
                  >
                    <FaPlus /> Add Card Item
                  </button>
                )}
              </div>

              {(isAddingItem || editingItemId) && (
                <form onSubmit={handleSaveItem} className="p-4 bg-slate-900/60 rounded border border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-blue-400">
                    {editingItemId ? 'Edit Item' : 'New Card Item'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={itemForm.title}
                      onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                      placeholder="Title (e.g. AWS Certified Developer)"
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                      required
                    />
                    <input
                      type="text"
                      value={itemForm.subtitle}
                      onChange={(e) => setItemForm({ ...itemForm, subtitle: e.target.value })}
                      placeholder="Subtitle (e.g. Amazon Web Services)"
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={itemForm.date}
                      onChange={(e) => setItemForm({ ...itemForm, date: e.target.value })}
                      placeholder="Date (e.g. 2024)"
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                    />
                    <input
                      type="text"
                      value={itemForm.link}
                      onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
                      placeholder="Credential/External Link (https://...)"
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                    />
                  </div>

                  <textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    rows="2"
                    placeholder="Short description of this item..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-xs text-white resize-none"
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded"
                    >
                      {loading ? 'Saving...' : 'Save Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingItem(false);
                        setEditingItemId(null);
                      }}
                      className="px-4 py-1.5 bg-slate-700 text-white text-xs rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Items List */}
              <div className="space-y-3">
                {(activeSection.items || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No items in this section yet. Click &quot;Add Card Item&quot; to add cards.
                  </p>
                ) : (
                  (activeSection.items || []).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-900/40 rounded border border-slate-700 flex items-start justify-between gap-4"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        {item.subtitle && <p className="text-xs text-blue-400">{item.subtitle}</p>}
                        {item.description && (
                          <p className="text-xs text-slate-300 mt-1">{item.description}</p>
                        )}
                        {item.date && (
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                            {item.date}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(item.id);
                            setItemForm({
                              title: item.title || '',
                              subtitle: item.subtitle || '',
                              date: item.date || '',
                              description: item.description || '',
                              link: item.link || '',
                            });
                          }}
                          className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
