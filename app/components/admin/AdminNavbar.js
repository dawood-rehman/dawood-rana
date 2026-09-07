'use client';

import { useState, useEffect } from 'react';
import { FaArrowDown, FaArrowUp, FaCompass, FaEdit, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminNavbar() {
  const [config, setConfig] = useState(DEFAULT_DATA.navbarConfig);
  const [navItems, setNavItems] = useState(DEFAULT_DATA.navbarConfig.navItems);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({ name: '', href: '', isExternal: false });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNavbar();
  }, []);

  const loadNavbar = () => {
    const data = getFromStorage(STORAGE_KEYS.NAVBAR_CONFIG, DEFAULT_DATA.navbarConfig);
    if (data) {
      setConfig({
        ...DEFAULT_DATA.navbarConfig,
        ...data,
        ctaButton: { ...DEFAULT_DATA.navbarConfig.ctaButton, ...(data.ctaButton || {}) },
      });
      setNavItems(data.navItems && data.navItems.length > 0 ? data.navItems : DEFAULT_DATA.navbarConfig.navItems);
    }
  };

  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const fullPayload = {
      ...config,
      navItems,
    };

    try {
      await saveContentSection('navbarConfig', fullPayload);
      toast.success('Header & Navigation saved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save navigation');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.href.trim()) {
      toast.error('Item name and link are required');
      return;
    }

    if (editingItemId) {
      setNavItems(
        navItems.map((item) =>
          item.id === editingItemId ? { ...item, ...itemForm } : item
        )
      );
      setEditingItemId(null);
    } else {
      setNavItems([
        ...navItems,
        {
          id: Date.now().toString(),
          ...itemForm,
          order: navItems.length + 1,
          enabled: true,
        },
      ]);
      setIsAddingItem(false);
    }

    setItemForm({ name: '', href: '', isExternal: false });
  };

  const handleMoveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= navItems.length) return;

    const list = [...navItems];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    setNavItems(list.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const handleDeleteItem = (id) => {
    setNavItems(navItems.filter((item) => item.id !== id));
  };

  const handleToggleItem = (id) => {
    setNavItems(
      navItems.map((item) =>
        item.id === id ? { ...item, enabled: item.enabled === false ? true : false } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FaCompass />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Header & Navigation</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Customize the logo badge initials, brand text, top navigation links, and optional CTA button.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Logo and CTA Settings */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-3">
            Logo & Brand Settings
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Logo Initials</label>
                <input
                  type="text"
                  maxLength={4}
                  value={config.logoInitials || ''}
                  onChange={(e) => setConfig({ ...config, logoInitials: e.target.value })}
                  placeholder="DR"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Logo Link Href</label>
                <input
                  type="text"
                  value={config.logoHref || ''}
                  onChange={(e) => setConfig({ ...config, logoHref: e.target.value })}
                  placeholder="#about"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Logo Brand Text</label>
              <input
                type="text"
                value={config.logoText || ''}
                onChange={(e) => setConfig({ ...config, logoText: e.target.value })}
                placeholder="Dawood Rehman"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
              />
            </div>
          </div>

          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-3 pt-3">
            Header CTA Button (Optional)
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.ctaButton?.enabled || false}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ctaButton: { ...config.ctaButton, enabled: e.target.checked },
                  })
                }
              />
              Show CTA button in navbar
            </label>

            {config.ctaButton?.enabled && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={config.ctaButton?.label || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ctaButton: { ...config.ctaButton, label: e.target.value },
                      })
                    }
                    placeholder="Hire Me"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={config.ctaButton?.href || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ctaButton: { ...config.ctaButton, href: e.target.value },
                      })
                    }
                    placeholder="#contact"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaSave /> {loading ? 'Saving...' : 'Save Navbar Settings'}
            </button>
          </div>
        </div>

        {/* Navigation Items List & CRUD */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Menu Navigation Links</h3>
            {!isAddingItem && !editingItemId && (
              <button
                type="button"
                onClick={() => {
                  setIsAddingItem(true);
                  setItemForm({ name: '', href: '', isExternal: false });
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded flex items-center gap-1"
              >
                <FaPlus /> Add Link
              </button>
            )}
          </div>

          {(isAddingItem || editingItemId) && (
            <form onSubmit={handleSaveItem} className="p-4 bg-slate-900/60 rounded-lg border border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-blue-400">
                {editingItemId ? 'Edit Link' : 'Add New Nav Link'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="Link Text (e.g. Services)"
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                  required
                />
                <input
                  type="text"
                  value={itemForm.href}
                  onChange={(e) => setItemForm({ ...itemForm, href: e.target.value })}
                  placeholder="Target (e.g. #services or https://...)"
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isExternal}
                    onChange={(e) => setItemForm({ ...itemForm, isExternal: e.target.checked })}
                  />
                  Opens in new tab (external)
                </label>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded"
                  >
                    Save Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingItem(false);
                      setEditingItemId(null);
                    }}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="divide-y divide-slate-700">
            {navItems.map((item, idx) => (
              <div
                key={item.id || item.name}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500 w-4">{idx + 1}.</span>
                  <div>
                    <span className={`font-bold ${item.enabled === false ? 'line-through text-slate-500' : 'text-white'}`}>
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">
                      {item.href}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <FaArrowUp className="text-[10px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 1)}
                    disabled={idx === navItems.length - 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <FaArrowDown className="text-[10px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      item.enabled !== false
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {item.enabled !== false ? 'Active' : 'Off'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItemId(item.id);
                      setItemForm({
                        name: item.name,
                        href: item.href,
                        isExternal: Boolean(item.isExternal),
                      });
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-2">
            Click &quot;Save Navbar Settings&quot; above to commit all navigation changes to the database.
          </p>
        </div>
      </div>
    </div>
  );
}
