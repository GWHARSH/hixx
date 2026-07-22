import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import UploadsPreview from '../sections/UploadsPreview';
import PackagesPreview from '../sections/PackagesPreview';
import StatsCounter from '../components/StatsCounter';
import SkillsSection from '../sections/SkillsSection';
import WebsitesShowcase from '../sections/WebsitesShowcase';
import TestimonialsSection from '../sections/TestimonialsSection';
import FaqSection from '../sections/FaqSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <AboutSection />
      <SkillsSection />
      <WebsitesShowcase />
      <UploadsPreview />
      <PackagesPreview />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
