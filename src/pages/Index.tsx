import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { UniversalSearch } from "@/components/UniversalSearch";
import { TopRankedColleges } from "@/components/TopRankedColleges";
import { CategorySection } from "@/components/CategorySection";
import { CitySearch } from "@/components/CitySearch";
import { OnlineEducationSection } from "@/components/OnlineEducationSection";
import { NewsSection } from "@/components/NewsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ToolsSection } from "@/components/ToolsSection";
import { TrustedBySection } from "@/components/TrustedBySection";
import { UpcomingExams } from "@/components/UpcomingExams";
import { FAQSection } from "@/components/FAQSection";
import { StudyAbroadSection } from "@/components/StudyAbroadSection";
import { Footer } from "@/components/Footer";
import { AIChatFullScreen } from "@/components/AIChatFullScreen";
import { FloatingBot } from "@/components/FloatingBot";
import { AILeadForm } from "@/components/AILeadForm";
import { FixedCounsellingCTA } from "@/components/FixedCounsellingCTA";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [pendingChatMessage, setPendingChatMessage] = useState<string | undefined>();
  const [leadInfo, setLeadInfo] = useState<{ name: string; course: string; state: string; city: string } | undefined>();

  const handleOpenChat = useCallback((message?: string) => {
    setPendingChatMessage(message);
    setIsLeadFormOpen(true);
  }, []);

  const handleLeadSubmit = useCallback((data: { name: string; course: string; state: string; city: string }) => {
    setIsLeadFormOpen(false);
    setLeadInfo(data);
    setInitialChatMessage(pendingChatMessage);
    setIsChatOpen(true);
  }, [pendingChatMessage]);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    setInitialChatMessage(undefined);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection onOpenChat={handleOpenChat} />
        <UniversalSearch />
        <TopRankedColleges />
        <CategorySection />
        <CitySearch />
        <StudyAbroadSection />
        <OnlineEducationSection />
        <UpcomingExams />
        <ToolsSection />
        
        {/* Mid-page lead capture */}
        <section className="py-8 md:py-10">
          <div className="container max-w-4xl">
            <LeadCaptureForm
              variant="banner"
              title="🎯 Get Personalized College Recommendations"
              subtitle="Talk to our expert counselors — it's completely free!"
              source="homepage_mid"
            />
          </div>
        </section>

        <NewsSection />
        <FeaturesSection />
        <FAQSection page="homepage" title="Frequently Asked Questions" />
        <TrustedBySection />
      </main>
      <Footer />
      <AILeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} onSubmit={handleLeadSubmit} />
      <AIChatFullScreen isOpen={isChatOpen} onClose={handleCloseChat} initialMessage={initialChatMessage} leadData={leadInfo} />
      <FloatingBot />
      <FixedCounsellingCTA />
    </div>
  );
};

export default Index;
