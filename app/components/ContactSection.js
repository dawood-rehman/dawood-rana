'use client';

import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import CrystalEffect from './CrystalEffect';

const socialLinks = [
  {
    icon: FaFacebook,
    name: 'Facebook',
    url: 'https://www.facebook.com/itx.rajpootdawood',
    color: 'from-blue-600 to-blue-700',
    description: 'Connect with me',
  },
  {
    icon: FaInstagram,
    name: 'Instagram',
    url: 'https://www.instagram.com/_vibe_with_dawood?igsh=MW5lenhobzZxcHM4Zg==',
    color: 'from-pink-500 via-purple-500 to-rose-500',
    description: 'Follow my journey',
  },
  {
    icon: FaLinkedin,
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/dawood-rehman-b25230383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    color: 'from-blue-700 to-blue-800',
    description: 'Professional network',
  },
  {
    icon: FaGithub,
    name: 'GitHub',
    url: 'https://github.com/saabra926',
    color: 'from-gray-700 via-gray-800 to-gray-900',
    description: 'View my code',
  },
  {
    icon: FaWhatsapp,
    name: 'WhatsApp',
    url: 'https://wa.me/923144885177',
    color: 'from-green-500 to-green-600',
    description: 'Chat with me',
  },
];

const contactInfo = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'rd535328@gmail.com',
    link: 'mailto:rd535328@gmail.com',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FaPhone,
    label: 'Phone',
    value: '+92 314 4885177',
    link: 'tel:+923144885177',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Location',
    value: 'Faisalabad, Pakistan',
    link: '#',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
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
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Get In Touch
          </motion.h2>
          <CrystalEffect className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 max-w-3xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="block"
              >
                <CrystalEffect className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <info.icon className="text-white text-xl" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{info.label}</p>
                      <p className="text-lg font-semibold text-white dark:text-gray-200">{info.value}</p>
                    </div>
                  </div>
                </CrystalEffect>
              </motion.a>
            ))}
          </div>

          {/* Social Media Cards */}
          <div className="grid grid-cols-2 gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  rotate: [0, -5, 5, 0]
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${social.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500`}></div>
                
                <CrystalEffect className={`relative bg-gradient-to-br ${social.color} rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 text-white h-full flex flex-col items-center justify-center`}>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="mb-3"
                  >
                    <social.icon className="text-4xl" />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-1">{social.name}</h3>
                  <p className="text-xs opacity-90 text-center">{social.description}</p>
                  
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-white/30"
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
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <CrystalEffect className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-full">
            <div className="bg-gray-900 dark:bg-gray-800 rounded-full px-8 py-4">
              <p className="text-lg text-gray-200 dark:text-gray-300">
                Ready to start a project? Let's talk! 💬
              </p>
            </div>
          </CrystalEffect>
        </motion.div>
      </div>
    </section>
  );
}
