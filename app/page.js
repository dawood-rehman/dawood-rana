'use client';

import { useEffect } from 'react';
import { initializeStorage } from '@/lib/storage';
import AboutSection from './components/AboutSection';
import PassionSection from './components/PassionSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  useEffect(() => {
    // Initialize storage on first load
    initializeStorage();
  }, []);

  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <AboutSection />
      <PassionSection />
      <ProjectsSection />
      <EducationSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </main>
  );
}
