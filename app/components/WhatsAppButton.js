'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const whatsappNumber = '923144885177'; // Replace with actual WhatsApp number
  const message = encodeURIComponent('Hello! I would like to connect with you.');

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 ring-1 ring-white/15 hover:-translate-y-0.5 hover:bg-emerald-700"
      aria-label="Contact on WhatsApp"
    >
      <FaWhatsapp className="text-xl" />
    </motion.a>
  );
}

