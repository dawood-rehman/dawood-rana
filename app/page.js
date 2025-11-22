'use client';

import AboutSection from './components/AboutSection';
import PassionSection from './components/PassionSection';
import ProjectsSection from './components/ProjectsSection';
import CompletedProjectsSection from './components/CompletedProjectsSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import ThemeToggle from './components/ThemeToggle';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import DigitalClock from './components/DigitalClock';
import AIAssistant from './components/AIAssistant';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <ThemeToggle />
      <AboutSection />
      <PassionSection />
      <ProjectsSection />
      <CompletedProjectsSection />
      <EducationSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
      <DigitalClock />
      <AIAssistant />
    </main>
  );
}
