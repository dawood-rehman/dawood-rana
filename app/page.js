import { getPortfolioContent } from '@/lib/serverContent';
import AnnouncementBanner from './components/AnnouncementBanner';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import PassionSection from './components/PassionSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ServicesSection from './components/ServicesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CustomSection from './components/CustomSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import ClientStorageSync from './components/ClientStorageSync';
import InteractiveCanvas from './components/InteractiveCanvas';
import SoundEngine from './components/SoundEngine';

export const revalidate = 60; // ISR: revalidate cache every 60 seconds

export default async function Home() {
  const content = await getPortfolioContent();
  const phoneContact = content.contactInfo?.find(
    (c) => c.label?.toLowerCase() === 'phone' || c.label?.toLowerCase() === 'whatsapp'
  );

  const sectionsConfig = (content.sectionsConfig || []).slice().sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const renderSection = (sec) => {
    if (sec.enabled === false) return null;

    switch (sec.id) {
      case 'about':
        return (
          <AboutSection
            key="about"
            initialPersonalInfo={content.personalInfo}
            initialProfilePicture={content.profilePicture}
            initialResumeUrl={content.resume?.url || ''}
            initialSocialLinks={content.socialLinks}
          />
        );
      case 'passion':
        return (
          <PassionSection
            key="passion"
            initialPassions={content.passions}
            initialHeadings={content.sectionHeadings?.passion}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            key="projects"
            initialProjects={content.projects}
            initialHeadings={content.sectionHeadings?.projects}
          />
        );
      case 'education':
        return (
          <EducationSection
            key="education"
            initialEducation={content.education}
            initialHeadings={content.sectionHeadings?.education}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            key="skills"
            initialSkills={content.skills}
            initialHeadings={content.sectionHeadings?.skills}
          />
        );
      case 'experiences':
        return (
          <ExperienceSection
            key="experiences"
            initialExperiences={content.experiences}
            initialHeadings={content.sectionHeadings?.experiences}
          />
        );
      case 'services':
        return (
          <ServicesSection
            key="services"
            initialServices={content.services}
            initialHeadings={content.sectionHeadings?.services}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsSection
            key="testimonials"
            initialTestimonials={content.testimonials}
            initialHeadings={content.sectionHeadings?.testimonials}
          />
        );
      case 'contact':
        return (
          <ContactSection
            key="contact"
            initialContactInfo={content.contactInfo}
            initialSocialLinks={content.socialLinks}
            initialHeadings={content.sectionHeadings?.contact}
          />
        );
      default:
        // Check if custom section
        const customSec = (content.customSections || []).find((cs) => cs.id === sec.id);
        if (customSec && customSec.enabled !== false) {
          return <CustomSection key={customSec.id} section={customSec} />;
        }
        return null;
    }
  };

  return (
    <main className="relative overflow-x-hidden">
      <InteractiveCanvas initialConfig={content.particleConfig} />
      <SoundEngine initialConfig={content.soundConfig} />
      <ClientStorageSync />
      <AnnouncementBanner initialBanners={content.banners} />
      <Navbar
        initialNavbarConfig={content.navbarConfig}
        initialPersonalInfo={content.personalInfo}
      />
      {sectionsConfig.map(renderSection)}
      <Footer
        initialFooterConfig={content.footerConfig}
        initialSocialLinks={content.socialLinks}
        initialPersonalInfo={content.personalInfo}
      />
      <ScrollToTop />
      <WhatsAppButton
        initialPhone={phoneContact?.value || ''}
        initialName={content.personalInfo?.name || ''}
      />
    </main>
  );
}
