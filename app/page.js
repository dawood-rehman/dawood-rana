'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { initializeStorage } from '@/lib/storage';
import AboutSection from './components/AboutSection';
import Navbar from './components/Navbar';
import SectionLoader from './components/SectionLoader';

const PassionSection = dynamic(() => import('./components/PassionSection'), {
  loading: () => <SectionLoader label="Loading focus section" />,
});
const ProjectsSection = dynamic(() => import('./components/ProjectsSection'), {
  loading: () => <SectionLoader label="Loading projects" />,
});
const EducationSection = dynamic(() => import('./components/EducationSection'), {
  loading: () => <SectionLoader label="Loading education" />,
});
const SkillsSection = dynamic(() => import('./components/SkillsSection'), {
  loading: () => <SectionLoader label="Loading skills" />,
});
const ContactSection = dynamic(() => import('./components/ContactSection'), {
  loading: () => <SectionLoader label="Loading contact" />,
});
const Footer = dynamic(() => import('./components/Footer'));
const ScrollToTop = dynamic(() => import('./components/ScrollToTop'), { ssr: false });
const WhatsAppButton = dynamic(() => import('./components/WhatsAppButton'), { ssr: false });

export default function Home() {
  useEffect(() => {
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
