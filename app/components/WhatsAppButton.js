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
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed right-6 bottom-6 md:right-auto md:left-6 z-50 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center w-14 h-14"
      aria-label="Contact on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </motion.a>
  );
}

