'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminContactInfo() {
  const [contacts, setContacts] = useState([]);
  const [socials, setSocials] = useState([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    link: '',
    icon: 'FaEnvelope',
  });
  const [socialFormData, setSocialFormData] = useState({
    name: '',
    url: '',
    color: 'from-blue-600 to-blue-700',
    description: '',
    icon: 'FaFacebook',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const contactData = getFromStorage(STORAGE_KEYS.CONTACT_INFO, []);
    const socialData = getFromStorage(STORAGE_KEYS.SOCIAL_LINKS, []);
    setContacts(contactData);
    setSocials(socialData);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!formData.label || !formData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      const updated = contacts.map((c) => (c.id === editingId ? { ...c, ...formData } : c));
      setContacts(updated);
      saveToStorage(STORAGE_KEYS.CONTACT_INFO, updated);
      toast.success('Contact info updated');
    } else {
      const updated = [...contacts, { id: Date.now().toString(), ...formData }];
      setContacts(updated);
      saveToStorage(STORAGE_KEYS.CONTACT_INFO, updated);
      toast.success('Contact info added');
    }
    resetContactForm();
  };

  const handleAddSocial = (e) => {
    e.preventDefault();
    if (!socialFormData.name || !socialFormData.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      const updated = socials.map((s) => (s.id === editingId ? { ...s, ...socialFormData } : s));
      setSocials(updated);
      saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, updated);
      toast.success('Social link updated');
    } else {
      const updated = [...socials, { id: Date.now().toString(), ...socialFormData }];
      setSocials(updated);
      saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, updated);
      toast.success('Social link added');
    }
    resetSocialForm();
  };

  const resetContactForm = () => {
    setFormData({ label: '', value: '', link: '', icon: 'FaEnvelope' });
    setIsAddingContact(false);
    setEditingId(null);
    setEditType(null);
  };

  const resetSocialForm = () => {
    setSocialFormData({
      name: '',
      url: '',
      color: 'from-blue-600 to-blue-700',
      description: '',
      icon: 'FaFacebook',
    });
    setIsAddingSocial(false);
    setEditingId(null);
    setEditType(null);
  };

  const handleDeleteContact = (id) => {
    if (confirm('Delete this contact info?')) {
      const updated = contacts.filter((c) => c.id !== id);
      setContacts(updated);
      saveToStorage(STORAGE_KEYS.CONTACT_INFO, updated);
      toast.success('Deleted');
    }
  };

  const handleDeleteSocial = (id) => {
    if (confirm('Delete this social link?')) {
      const updated = socials.filter((s) => s.id !== id);
      setSocials(updated);
      saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, updated);
      toast.success('Deleted');
    }
  };

  return (
    <div className="space-y-8">
      {/* Contact Info Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Contact Information</h2>
          {!isAddingContact && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => setIsAddingContact(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <FaPlus /> Add Contact
            </motion.button>
          )}
        </div>

        {isAddingContact && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700"
          >
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Label *</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Value *</label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Link</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  {editingId && editType === 'contact' ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetContactForm}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
              className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-sm sm:text-base">{contact.label}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingId(contact.id);
                      setEditType('contact');
                      setFormData(contact);
                      setIsAddingContact(true);
                    }}
                    className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm"
                    title="Edit contact"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm"
                    title="Delete contact"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">{contact.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Social Links Section */}
      <div className="space-y-4 border-t border-gray-700 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Social Media Links</h2>
          {!isAddingSocial && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => setIsAddingSocial(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <FaPlus /> Add Social Link
            </motion.button>
          )}
        </div>

        {isAddingSocial && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700"
          >
            <form onSubmit={handleAddSocial} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    value={socialFormData.name}
                    onChange={(e) => setSocialFormData({ ...socialFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">URL *</label>
                  <input
                    type="text"
                    value={socialFormData.url}
                    onChange={(e) => setSocialFormData({ ...socialFormData, url: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={socialFormData.description}
                  onChange={(e) => setSocialFormData({ ...socialFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  {editingId && editType === 'social' ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetSocialForm}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socials.map((social, index) => (
            <motion.div
              key={social.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
              className={`bg-gradient-to-br ${social.color} rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-sm sm:text-base">{social.name}</h3>
                <div className="flex gap-1 bg-black/30 rounded p-1">
                  <button
                    onClick={() => {
                      setEditingId(social.id);
                      setEditType('social');
                      setSocialFormData(social);
                      setIsAddingSocial(true);
                    }}
                    className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm"
                    title="Edit social link"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteSocial(social.id)}
                    className="p-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm"
                    title="Delete social link"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              <p className="text-white/90 text-xs sm:text-sm">{social.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
