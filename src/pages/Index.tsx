import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { StatsSection } from "@/components/StatsSection";
import { FeaturedColleges } from "@/components/FeaturedColleges";
import { CompareSection } from "@/components/CompareSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <CategorySection />
        <FeaturedColleges />
        <CompareSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
