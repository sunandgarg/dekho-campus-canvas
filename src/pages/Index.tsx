import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedColleges } from "@/components/FeaturedColleges";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { AICounselor } from "@/components/AICounselor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <CategorySection />
        <FeaturedColleges />
        <FeaturesSection />
      </main>
      
      <Footer />
      
      {/* AI Counselor Floating Chat */}
      <AICounselor />
    </div>
  );
};

export default Index;
