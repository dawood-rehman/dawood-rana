'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhone,
  FaWhatsapp,
  FaCheckCircle,
} from 'react-icons/fa';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { fadeUp, smoothTransition, staggerContainer, viewportOnce } from './motionPresets';
import { getStableGradient } from './themePalette';
import { trackCustomEvent } from './AnalyticsTracker';

const icons = {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
};

export default function ContactSection({
  initialContactInfo = DEFAULT_DATA.contactInfo,
  initialSocialLinks = DEFAULT_DATA.socialLinks,
  initialHeadings = DEFAULT_DATA.sectionHeadings.contact,
}) {
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);
  const [contactInfo, setContactInfo] = useState(initialContactInfo);
  const [headings, setHeadings] = useState({
    ...DEFAULT_DATA.sectionHeadings.contact,
    ...initialHeadings,
  });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    trackCustomEvent('contact_submit', {
      visitorName: formData.name.trim(),
      path: '/#contact',
    });

    try {
      localStorage.setItem('analytics_visitor_name', formData.name.trim());
    } catch (_) {}

    setSubmitted(true);
  };

  useEffect(() => {
    const loadData = () => {
      const storedSocials = getFromStorage(STORAGE_KEYS.SOCIAL_LINKS, null);
      const storedContacts = getFromStorage(STORAGE_KEYS.CONTACT_INFO, null);
      const storedHeadings = getFromStorage(STORAGE_KEYS.SECTION_HEADINGS, null);

      if (storedSocials) setSocialLinks(storedSocials);
      if (storedContacts) setContactInfo(storedContacts);
      if (storedHeadings?.contact) {
        setHeadings((prev) => ({ ...prev, ...storedHeadings.contact }));
      }
    };

    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('contactUpdated', loadData);
    window.addEventListener('socialsUpdated', loadData);
    window.addEventListener('sectionHeadingsUpdated', loadData);
    window.addEventListener('portfolioContentUpdated', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('contactUpdated', loadData);
      window.removeEventListener('socialsUpdated', loadData);
      window.removeEventListener('sectionHeadingsUpdated', loadData);
      window.removeEventListener('portfolioContentUpdated', loadData);
    };
  }, []);

  const visibleContact = contactInfo.filter((c) => c.enabled !== false);
  const visibleSocials = socialLinks.filter((s) => s.enabled !== false);

  return (
    <section id="contact" className="section-frame">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} transition={smoothTransition} className="mx-auto mb-5 eyebrow">
            {headings.eyebrow || 'Contact'}
          </motion.div>
          <motion.h2 variants={fadeUp} transition={smoothTransition} className="section-title">
            {headings.title || "Let's Build Something Clean"}
          </motion.h2>
          <motion.p variants={fadeUp} transition={smoothTransition} className="section-copy mt-5">
            {headings.subtitle ||
              'Reach out for portfolio work, web applications, dashboards, or collaboration.'}
          </motion.p>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-4"
          >
            {visibleContact.map((info) => {
              const Icon = icons[info.icon] || FaEnvelope;

              return (
                <motion.a
                  key={info.id || info.label}
                  href={info.link || '#'}
                  variants={fadeUp}
                  transition={smoothTransition}
                  className="quiet-card elevated-card focus-ring flex items-center gap-4 p-5 hover:-translate-y-1"
                >
                  <span className="icon-tile h-12 w-12 flex-shrink-0">
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {info.label}
                    </span>
                    <span className="mt-1 block break-words text-sm font-bold leading-6 text-slate-950 dark:text-white sm:text-base">
                      {info.value}
                    </span>
                  </span>
                </motion.a>
              );
            })}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="glass-panel elevated-card p-5 sm:p-6"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                  {headings.socialTitle || 'Social Profiles'}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {headings.socialSubtitle || 'Professional links and direct channels.'}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visibleSocials.map((social, index) => {
                const Icon = icons[social.icon] || FaGithub;
                const accentGradient = getStableGradient(social.name, index);

                return (
                  <motion.a
                    key={social.id || social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeUp}
                    transition={smoothTransition}
                    className="focus-ring rounded-lg border border-slate-200 bg-white/70 p-4 hover:-translate-y-1 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${accentGradient} text-white shadow-sm`}
                      >
                        <Icon />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold text-slate-950 dark:text-white">{social.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                          {social.description}
                        </span>
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick Message Form */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={smoothTransition}
          className="mt-8 glass-panel elevated-card p-6 sm:p-8"
        >
          <div className="max-w-xl mx-auto text-center mb-6">
            <h3 className="text-2xl font-black text-slate-950 dark:text-white">
              Send a Quick Note
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Leave your name and a brief note to connect directly.
            </p>
          </div>

          {submitted ? (
            <div className="max-w-md mx-auto py-6 text-center space-y-2">
              <FaCheckCircle className="mx-auto text-4xl text-emerald-500" />
              <p className="text-lg font-bold text-slate-950 dark:text-white">
                Thank you, {formData.name}!
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your note has been recorded. Looking forward to connecting!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="max-w-xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full rounded-lg border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="e.g. name@email.com"
                    className="w-full rounded-lg border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell me about your project, idea, or inquiry..."
                  className="w-full rounded-lg border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder-slate-500 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary focus-ring gap-2 px-6 py-2.5 text-sm"
                >
                  <FaPaperPlane className="text-xs" /> Send Message
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
