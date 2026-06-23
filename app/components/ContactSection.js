'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import CrystalEffect from './CrystalEffect';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function ContactSection() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const socials = getFromStorage(STORAGE_KEYS.SOCIAL_LINKS, []);
      const contacts = getFromStorage(STORAGE_KEYS.CONTACT_INFO, []);
      setSocialLinks(socials);
      setContactInfo(contacts);
    };

    loadData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contactUpdated', handleStorageChange);
    window.addEventListener('socialsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contactUpdated', handleStorageChange);
      window.removeEventListener('socialsUpdated', handleStorageChange);
    };
  }, []);

  const getIcon = (iconName) => {
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
    return icons[iconName] || FaEnvelope;
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(219,39,119,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.2),transparent_50%)]"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v2h2v2h-2v2h2v2h-2v2h2v2H0v-2h20v-2H0v-2h20v-2H0v-2h20zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Get In Touch
          </motion.h2>
          <CrystalEffect className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 dark:text-gray-300 max-w-3xl mx-auto px-2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Let's connect and build something amazing together!
            </motion.p>
          </CrystalEffect>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10 md:mb-12">
          {/* Contact Information Cards */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.id || index}
                href={info.link || '#'}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, x: 8, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
                className="block"
              >
                <CrystalEffect className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-lg sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.div
                      className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}
                    >
                      {getIcon(info.icon)({ className: "text-white text-sm sm:text-base md:text-lg" })}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-0.5 truncate">{info.label}</p>
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-white dark:text-gray-200 truncate">{info.value}</p>
                    </div>
                  </div>
                </CrystalEffect>
              </motion.a>
            ))}
          </div>

          {/* Social Media Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.id || index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  duration: 0.35
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -8,
                  rotate: [0, -5, 5, 0],
                  transition: { type: 'spring', stiffness: 300, damping: 25 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${social.color} rounded-lg sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500`}></div>
                
                <CrystalEffect className={`relative bg-gradient-to-br ${social.color} rounded-lg sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white h-full flex flex-col items-center justify-center`}>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}
                    className="mb-2 sm:mb-3"
                  >
                    {getIcon(social.icon)({ className: "text-2xl sm:text-3xl md:text-4xl" })}
                  </motion.div>
                  <h3 className="text-xs sm:text-sm md:text-lg font-bold mb-0.5 sm:mb-1 text-center line-clamp-1">{social.name}</h3>
                  <p className="text-[10px] sm:text-xs opacity-90 text-center line-clamp-2 leading-tight">{social.description}</p>
                  
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 rounded-lg sm:rounded-2xl border border-white/30"
                    animate={{
                      borderColor: [
                        'rgba(255,255,255,0.3)',
                        'rgba(255,255,255,0.6)',
                        'rgba(255,255,255,0.3)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </CrystalEffect>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35, delay: 0.3 }}
          className="text-center px-4"
        >
          <CrystalEffect className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-full hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gray-900 dark:bg-gray-800 rounded-full px-6 sm:px-8 py-3 sm:py-4">
              <p className="text-sm sm:text-base md:text-lg text-gray-200 dark:text-gray-300 font-semibold">
                Ready to start a project? Let's talk! 💬
              </p>
            </div>
          </CrystalEffect>
        </motion.div>
      </div>
    </section>
  );
}
