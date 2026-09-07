'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getFromStorage, STORAGE_KEYS, DEFAULT_DATA } from '@/lib/storage';

function extractDigits(str = '') {
  return String(str).replace(/\D/g, '');
}

export default function WhatsAppButton({ initialPhone = '' }) {
  const [phone, setPhone] = useState(
    extractDigits(initialPhone) || '923144885177'
  );

  useEffect(() => {
    const updatePhone = () => {
      const contacts = getFromStorage(STORAGE_KEYS.CONTACT_INFO, DEFAULT_DATA.contactInfo);
      const phoneItem = contacts.find(
        (c) => c.label?.toLowerCase() === 'phone' || c.label?.toLowerCase() === 'whatsapp'
      );
      if (phoneItem?.value) {
        const digits = extractDigits(phoneItem.value);
        if (digits) setPhone(digits);
      }
    };

    updatePhone();
    window.addEventListener('contactUpdated', updatePhone);
    window.addEventListener('portfolioContentUpdated', updatePhone);
    return () => {
      window.removeEventListener('contactUpdated', updatePhone);
      window.removeEventListener('portfolioContentUpdated', updatePhone);
    };
  }, []);

  const message = encodeURIComponent('Hello Dawood! I would like to connect with you regarding your portfolio.');

  return (
    <motion.a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
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


