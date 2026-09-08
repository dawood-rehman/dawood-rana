'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getFromStorage, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';
import { trackCustomEvent } from './AnalyticsTracker';

function extractDigits(str = '') {
  return String(str).replace(/\D/g, '');
}

export default function WhatsAppButton({ initialPhone = '', initialName = '' }) {
  const [phone, setPhone] = useState(
    extractDigits(initialPhone) || '923144885177'
  );
  const [name, setName] = useState(initialName || 'Dawood');

  useEffect(() => {
    const updatePhoneAndName = () => {
      const contacts = getFromStorage(STORAGE_KEYS.CONTACT_INFO, DEFAULT_DATA.contactInfo);
      const socials = getFromStorage(STORAGE_KEYS.SOCIAL_LINKS, DEFAULT_DATA.socialLinks);
      const personal = getFromStorage(STORAGE_KEYS.PERSONAL_INFO, DEFAULT_DATA.personalInfo);

      if (personal?.name) {
        setName(personal.name.split(' ')[0] || personal.name);
      }

      // Check contactInfo first
      const phoneItem = contacts?.find(
        (c) =>
          c.label?.toLowerCase().includes('phone') ||
          c.label?.toLowerCase().includes('whatsapp') ||
          c.label?.toLowerCase().includes('mobile')
      );

      // Check socialLinks for WhatsApp URL
      const waSocial = socials?.find(
        (s) => s.name?.toLowerCase().includes('whatsapp')
      );

      if (phoneItem?.value) {
        const digits = extractDigits(phoneItem.value);
        if (digits) setPhone(digits);
      } else if (waSocial?.url) {
        const digits = extractDigits(waSocial.url);
        if (digits) setPhone(digits);
      }
    };

    updatePhoneAndName();
    window.addEventListener('contactUpdated', updatePhoneAndName);
    window.addEventListener('socialsUpdated', updatePhoneAndName);
    window.addEventListener('personalInfoUpdated', updatePhoneAndName);
    window.addEventListener('portfolioContentUpdated', updatePhoneAndName);

    return () => {
      window.removeEventListener('contactUpdated', updatePhoneAndName);
      window.removeEventListener('socialsUpdated', updatePhoneAndName);
      window.removeEventListener('personalInfoUpdated', updatePhoneAndName);
      window.removeEventListener('portfolioContentUpdated', updatePhoneAndName);
    };
  }, []);

  const message = encodeURIComponent(`Hello ${name}! I would like to connect with you regarding your portfolio.`);

  if (!phone) return null;

  return (
    <motion.a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCustomEvent('whatsapp_click')}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 ring-1 ring-white/15 hover:-translate-y-0.5 hover:bg-emerald-700 focus-ring"
      aria-label="Contact on WhatsApp"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-xl" />
    </motion.a>
  );
}
