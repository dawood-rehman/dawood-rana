import { getPortfolioContent } from '@/lib/serverContent';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import PassionSection from './components/PassionSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import ClientStorageSync from './components/ClientStorageSync';

export const revalidate = 60; // ISR: revalidate cache every 60 seconds

export default async function Home() {
  const content = await getPortfolioContent();
  const phoneContact = content.contactInfo?.find(
    (c) => c.label?.toLowerCase() === 'phone' || c.label?.toLowerCase() === 'whatsapp'
  );

  return (
    <main className="relative overflow-x-hidden">
      <ClientStorageSync />
      <Navbar />
      <AboutSection
        initialPersonalInfo={content.personalInfo}
        initialProfilePicture={content.profilePicture}
        initialResumeUrl={content.resume?.url || ''}
      />
      <PassionSection initialPassions={content.passions} />
      <ProjectsSection initialProjects={content.projects} />
      <EducationSection initialEducation={content.education} />
      <SkillsSection initialSkills={content.skills} />
      <ContactSection
        initialContactInfo={content.contactInfo}
        initialSocialLinks={content.socialLinks}
      />
      <Footer />
      <ScrollToTop />
      <WhatsAppButton initialPhone={phoneContact?.value || ''} />
    </main>
  );
}
