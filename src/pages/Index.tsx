import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { QuickLinksBar } from "@/components/QuickLinksBar";
import { TopRankedColleges } from "@/components/TopRankedColleges";
import { CategorySection } from "@/components/CategorySection";
import { CitySearch } from "@/components/CitySearch";
import { OnlineEducationSection } from "@/components/OnlineEducationSection";
import { StudyAbroadSection } from "@/components/StudyAbroadSection";
import { NewsSection } from "@/components/NewsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ToolsSection } from "@/components/ToolsSection";
import { TrustedBySection } from "@/components/TrustedBySection";
import { UpcomingExams } from "@/components/UpcomingExams";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { AIChatFullScreen } from "@/components/AIChatFullScreen";
import { FloatingBot } from "@/components/FloatingBot";
import { AILeadForm } from "@/components/AILeadForm";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { HeroBannerCarousel } from "@/components/HeroBannerCarousel";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { StickyRightSidebar } from "@/components/StickyRightSidebar";
import { HomeMobileBottomNav } from "@/components/HomeMobileBottomNav";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [pendingChatMessage, setPendingChatMessage] = useState<string | undefined>();
  const [leadInfo, setLeadInfo] = useState<{ name: string; course: string; state: string; city: string } | undefined>();

  const handleOpenChat = useCallback((message?: string) => {
    // Open chat first, lead form will be triggered on first message
    setInitialChatMessage(message);
    setIsChatOpen(true);
  }, []);

  const handleRequestLeadForm = useCallback(() => {
    setIsLeadFormOpen(true);
  }, []);

  const handleLeadSubmit = useCallback((data: { name: string; course: string; state: string; city: string }) => {
    setIsLeadFormOpen(false);
    setLeadInfo(data);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    setInitialChatMessage(undefined);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection onOpenChat={handleOpenChat} />
        <QuickLinksBar />
        <HeroBannerCarousel />

        {/* Main content with sticky right sidebar */}
        <div className="container flex gap-6">
          <div className="flex-1 min-w-0">
            <TopRankedColleges />
            <UpcomingExams />

            <section className="py-4">
              <DynamicAdBanner variant="leaderboard" position="mid-page" />
            </section>

            <CategorySection />

            <section className="py-6 md:py-8">
              <LeadCaptureForm
                variant="banner"
                title="🎯 Get Personalized College Recommendations"
                subtitle="Talk to our expert counselors — it's completely free!"
                source="homepage_mid"
              />
            </section>

            <CitySearch />
          </div>

          <StickyRightSidebar source="homepage_sticky" />
        </div>

        <OnlineEducationSection />
        <StudyAbroadSection />

        <div className="container">
          <ToolsSection />

          <section className="py-4">
            <DynamicAdBanner variant="horizontal" position="mid-page" />
          </section>

          <NewsSection />

          <section className="py-6">
            <LeadCaptureForm
              variant="inline"
              title="📞 Talk to an Expert Counselor — Free!"
              source="homepage_inline_2"
            />
          </section>

          <FeaturesSection />
          <FAQSection page="homepage" title="Frequently Asked Questions" />
          <TrustedBySection />
        </div>
      </main>
      <Footer />
      <AILeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} onSubmit={handleLeadSubmit} />
      <AIChatFullScreen
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        initialMessage={initialChatMessage}
        leadData={leadInfo}
        onRequestLeadForm={handleRequestLeadForm}
      />
      <FloatingBot />
      <HomeMobileBottomNav />
    </div>
  );
};

export default Index;
