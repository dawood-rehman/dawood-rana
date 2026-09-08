'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaPaperPlane,
  FaCheckCircle,
  FaWhatsapp,
  FaEnvelope,
} from 'react-icons/fa';
import { trackCustomEvent } from './AnalyticsTracker';
import { playModalSound } from '@/lib/soundManager';

export default function ContactModal({
  initialContactInfo = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    playModalSound(true);
    trackCustomEvent('contact_modal_open', { path: window.location.pathname });
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    playModalSound(false);
  }, []);

  // Listen for custom "open-contact-modal" events (only opens when clicked)
  useEffect(() => {
    const handleOpenEvent = () => openModal();

    window.addEventListener('open-contact-modal', handleOpenEvent);
    return () => {
      window.removeEventListener('open-contact-modal', handleOpenEvent);
    };
  }, [openModal]);

  // 3. Escape key listener to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    trackCustomEvent('contact_submit', {
      visitorName: formData.name.trim(),
      path: '/#quick-note-modal',
    });

    try {
      localStorage.setItem('analytics_visitor_name', formData.name.trim());
    } catch (_) {}

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    closeModal();
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 300);
  };

  const emailContact = initialContactInfo?.find(
    (c) => c.label?.toLowerCase() === 'email' || c.value?.includes('@')
  );
  const phoneContact = initialContactInfo?.find(
    (c) => c.label?.toLowerCase() === 'phone' || c.label?.toLowerCase() === 'whatsapp'
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-note-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 my-auto w-full max-w-2xl rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-slate-700/80 dark:bg-slate-900/95 sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close modal"
              className="focus-ring absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <FaTimes className="text-sm" />
            </button>

            {/* Header */}
            <div className="text-center pr-6 pl-6 mb-6">
              <h3
                id="quick-note-modal-title"
                className="text-2xl font-black text-slate-950 dark:text-white sm:text-3xl tracking-tight"
              >
                Send a Quick Note
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Leave your name and a brief note to connect directly.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <FaCheckCircle className="mx-auto text-5xl text-emerald-500 animate-pulse" />
                <p className="text-xl font-bold text-slate-950 dark:text-white">
                  Thank you, {formData.name}!
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Your note has been recorded. Looking forward to connecting with you soon!
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="btn-primary px-6 py-2.5 text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Hamza / Ali"
                      className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email or Phone
                    </label>
                    <input
                      type="text"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="e.g. name@email.com"
                      className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell me about your project, idea, or inquiry..."
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-white dark:placeholder-slate-500 resize-none"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors py-2"
                  >
                    Maybe later
                  </button>

                  <button
                    type="submit"
                    className="btn-primary focus-ring w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold shadow-lg"
                  >
                    <FaPaperPlane className="text-xs" /> Send Message
                  </button>
                </div>
              </form>
            )}

            {/* Direct Channel Fallbacks */}
            {(emailContact || phoneContact) && (
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span>Or reach out directly:</span>
                {emailContact && (
                  <a
                    href={emailContact.link || `mailto:${emailContact.value}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <FaEnvelope className="text-[11px]" /> {emailContact.value}
                  </a>
                )}
                {phoneContact && (
                  <a
                    href={phoneContact.link || `tel:${phoneContact.value}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    <FaWhatsapp className="text-[11px]" /> {phoneContact.value}
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
