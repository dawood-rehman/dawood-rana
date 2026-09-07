'use client';

import { useState, useEffect } from 'react';
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaPlus,
  FaTrash,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaEdit,
} from 'react-icons/fa';
import { getFromStorage, saveContentSection, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import toast from 'react-hot-toast';

const contactIcons = [
  { value: 'FaEnvelope', label: 'Email', icon: FaEnvelope },
  { value: 'FaPhone', label: 'Phone', icon: FaPhone },
  { value: 'FaWhatsapp', label: 'WhatsApp', icon: FaWhatsapp },
  { value: 'FaMapMarkerAlt', label: 'Location / Address', icon: FaMapMarkerAlt },
  { value: 'FaGlobe', label: 'Website / Other', icon: FaGlobe },
];

const socialIcons = [
  { value: 'FaGithub', label: 'GitHub', color: 'from-gray-700 via-gray-800 to-gray-900' },
  { value: 'FaLinkedin', label: 'LinkedIn', color: 'from-blue-700 to-blue-800' },
  { value: 'FaWhatsapp', label: 'WhatsApp', color: 'from-green-500 to-green-600' },
  { value: 'FaFacebook', label: 'Facebook', color: 'from-blue-600 to-blue-700' },
  { value: 'FaInstagram', label: 'Instagram', color: 'from-pink-500 via-purple-500 to-rose-500' },
  { value: 'FaTwitter', label: 'Twitter / X', color: 'from-slate-800 to-black' },
  { value: 'FaYoutube', label: 'YouTube', color: 'from-red-600 to-red-700' },
  { value: 'FaGlobe', label: 'Website / Portfolio', color: 'from-blue-600 to-blue-700' },
];

export default function AdminContactInfo() {
  const [contacts, setContacts] = useState([]);
  const [socials, setSocials] = useState([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState(null);
  const [loading, setLoading] = useState(false);
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
    icon: 'FaGithub',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const contactData = getFromStorage(STORAGE_KEYS.CONTACT_INFO, DEFAULT_DATA.contactInfo);
    const socialData = getFromStorage(STORAGE_KEYS.SOCIAL_LINKS, DEFAULT_DATA.socialLinks);
    setContacts(Array.isArray(contactData) ? contactData : []);
    setSocials(Array.isArray(socialData) ? socialData : []);
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.value.trim()) {
      toast.error('Label and Value are required');
      return;
    }

    let link = formData.link.trim();
    let icon = formData.icon;
    const labelLower = formData.label.toLowerCase();

    // Auto-detect link and icon if omitted
    if (!link) {
      if (labelLower.includes('email') || formData.value.includes('@')) {
        link = `mailto:${formData.value.trim()}`;
        if (!icon || icon === 'FaEnvelope') icon = 'FaEnvelope';
      } else if (
        labelLower.includes('phone') ||
        labelLower.includes('whatsapp') ||
        labelLower.includes('mobile') ||
        labelLower.includes('call')
      ) {
        link = `tel:${formData.value.trim().replace(/\s+/g, '')}`;
        if (!icon || icon === 'FaEnvelope') {
          icon = labelLower.includes('whatsapp') ? 'FaWhatsapp' : 'FaPhone';
        }
      } else if (labelLower.includes('location') || labelLower.includes('address')) {
        link = `https://maps.google.com/?q=${encodeURIComponent(formData.value.trim())}`;
        if (!icon || icon === 'FaEnvelope') icon = 'FaMapMarkerAlt';
      }
    }

    const payload = {
      ...formData,
      link,
      icon: icon || 'FaEnvelope',
    };

    setLoading(true);
    try {
      const updated = editingId
        ? contacts.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
        : [...contacts, { id: Date.now().toString(), ...payload, order: contacts.length + 1, enabled: true }];

      await saveContentSection('contactInfo', updated);
      setContacts(updated);
      toast.success(editingId ? 'Contact details updated' : 'Contact item added');
      resetContactForm();
    } catch (error) {
      toast.error(error.message || 'Failed to save contact info');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSocial = async (e) => {
    e.preventDefault();
    if (!socialFormData.name.trim() || !socialFormData.url.trim()) {
      toast.error('Name and URL are required');
      return;
    }

    let icon = socialFormData.icon;
    let color = socialFormData.color;
    const nameLower = socialFormData.name.toLowerCase();

    if (!icon || icon === 'FaGlobe') {
      const matched = socialIcons.find((s) => nameLower.includes(s.label.toLowerCase()));
      if (matched) {
        icon = matched.value;
        color = matched.color;
      }
    }

    const payload = {
      ...socialFormData,
      icon: icon || 'FaGlobe',
      color: color || 'from-blue-600 to-blue-700',
    };

    setLoading(true);
    try {
      const updated = editingId
        ? socials.map((s) => (s.id === editingId ? { ...s, ...payload } : s))
        : [...socials, { id: Date.now().toString(), ...payload, order: socials.length + 1, enabled: true }];

      await saveContentSection('socialLinks', updated);
      setSocials(updated);
      toast.success(editingId ? 'Social link updated' : 'Social link added');
      resetSocialForm();
    } catch (error) {
      toast.error(error.message || 'Failed to save social link');
    } finally {
      setLoading(false);
    }
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
      icon: 'FaGithub',
    });
    setIsAddingSocial(false);
    setEditingId(null);
    setEditType(null);
  };

  const handleDeleteContact = async (id) => {
    if (!confirm('Delete this contact info?')) return;
    const updated = contacts.filter((c) => c.id !== id);
    try {
      await saveContentSection('contactInfo', updated);
      setContacts(updated);
      toast.success('Contact deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete contact info');
    }
  };

  const handleDeleteSocial = async (id) => {
    if (!confirm('Delete this social link?')) return;
    const updated = socials.filter((s) => s.id !== id);
    try {
      await saveContentSection('socialLinks', updated);
      setSocials(updated);
      toast.success('Social link deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete social link');
    }
  };

  return (
    <div className="space-y-8">
      {/* Contact Info Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Contact Details</h2>
            <p className="text-xs text-slate-400 mt-1">
              Phone numbers, email addresses, and locations automatically synchronize with the contact cards and floating WhatsApp button.
            </p>
          </div>
          {!isAddingContact && (
            <button
              onClick={() => {
                resetContactForm();
                setIsAddingContact(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
            >
              <FaPlus /> Add Contact
            </button>
          )}
        </div>

        {isAddingContact && (
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
            <h3 className="text-base font-bold text-white mb-4">
              {editingId && editType === 'contact' ? 'Edit Contact Info' : 'New Contact Item'}
            </h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Label * (e.g. Phone, Email, Location)
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g. Phone / WhatsApp"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Display Value *
                  </label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="+92 314 4885177 or rd535328@gmail.com"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  >
                    {contactIcons.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Click URL / Link (leave blank to auto-generate mailto:, tel:, or Google Maps)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="e.g. tel:+923144885177 or mailto:..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold"
                >
                  {loading ? 'Saving...' : editingId && editType === 'contact' ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={resetContactForm}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-white text-sm sm:text-base">{contact.label}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(contact.id);
                        setEditType('contact');
                        setFormData(contact);
                        setIsAddingContact(true);
                      }}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs"
                      title="Edit contact"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs"
                      title="Delete contact"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-white font-semibold text-sm break-words">{contact.value}</p>
                {contact.link && (
                  <p className="text-[11px] text-blue-400 font-mono mt-1 truncate">{contact.link}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Section */}
      <div className="space-y-4 border-t border-slate-700 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Social Media Links</h2>
            <p className="text-xs text-slate-400 mt-1">
              Profiles display across the Contact section, the About profile panel, the Footer, and Google SEO Schema.
            </p>
          </div>
          {!isAddingSocial && (
            <button
              onClick={() => {
                resetSocialForm();
                setIsAddingSocial(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
            >
              <FaPlus /> Add Social Link
            </button>
          )}
        </div>

        {isAddingSocial && (
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
            <h3 className="text-base font-bold text-white mb-4">
              {editingId && editType === 'social' ? 'Edit Social Link' : 'New Social Link'}
            </h3>
            <form onSubmit={handleAddSocial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Platform Name * (e.g. GitHub, LinkedIn, WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={socialFormData.name}
                    onChange={(e) => setSocialFormData({ ...socialFormData, name: e.target.value })}
                    placeholder="e.g. GitHub"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Profile / Direct URL *
                  </label>
                  <input
                    type="text"
                    value={socialFormData.url}
                    onChange={(e) => setSocialFormData({ ...socialFormData, url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Platform Icon</label>
                  <select
                    value={socialFormData.icon}
                    onChange={(e) => {
                      const selected = socialIcons.find((s) => s.value === e.target.value);
                      setSocialFormData({
                        ...socialFormData,
                        icon: e.target.value,
                        color: selected ? selected.color : socialFormData.color,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  >
                    {socialIcons.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tagline / Description (e.g. View my code, Professional network)
                </label>
                <input
                  type="text"
                  value={socialFormData.description}
                  onChange={(e) => setSocialFormData({ ...socialFormData, description: e.target.value })}
                  placeholder="View my code"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold"
                >
                  {loading ? 'Saving...' : editingId && editType === 'social' ? 'Update Link' : 'Add Link'}
                </button>
                <button
                  type="button"
                  onClick={resetSocialForm}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socials.map((social) => (
            <div
              key={social.id}
              className={`bg-gradient-to-br ${social.color || 'from-slate-700 to-slate-900'} rounded-lg p-4 shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base">{social.name}</h3>
                  <div className="flex gap-1 bg-black/30 rounded p-1">
                    <button
                      onClick={() => {
                        setEditingId(social.id);
                        setEditType('social');
                        setSocialFormData(social);
                        setIsAddingSocial(true);
                      }}
                      className="p-1 hover:bg-white/20 text-white rounded text-xs"
                      title="Edit social link"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteSocial(social.id)}
                      className="p-1 hover:bg-red-500/50 text-red-200 rounded text-xs"
                      title="Delete social link"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-white/90 text-xs">{social.description}</p>
              </div>
              <p className="text-[11px] text-white/70 font-mono mt-3 truncate">{social.url}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
