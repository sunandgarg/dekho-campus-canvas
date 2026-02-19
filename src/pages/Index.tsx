import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { QuickLinksBar } from "@/components/QuickLinksBar";
import { TopRankedColleges } from "@/components/TopRankedColleges";
import { CategorySection } from "@/components/CategorySection";
import { CitySearch } from "@/components/CitySearch";
import { OnlineEducationSection } from "@/components/OnlineEducationSection";

import { FeaturesSection } from "@/components/FeaturesSection";
import { TrustedBySection } from "@/components/TrustedBySection";
import { UpcomingExams } from "@/components/UpcomingExams";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { HomeCategoryCards } from "@/components/HomeCategoryCards";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load below-the-fold sections
const TrendingPrograms = lazy(() => import("@/components/TrendingPrograms").then(m => ({ default: m.TrendingPrograms })));
const ToolsSection = lazy(() => import("@/components/ToolsSection").then(m => ({ default: m.ToolsSection })));
const NewsSection = lazy(() => import("@/components/NewsSection").then(m => ({ default: m.NewsSection })));

function SectionFallback() {
  return <div className="py-8"><Skeleton className="h-48 w-full rounded-2xl" /></div>;
}
import { AIChatFullScreen } from "@/components/AIChatFullScreen";
import { AILeadForm } from "@/components/AILeadForm";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { HeroBannerCarousel } from "@/components/HeroBannerCarousel";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { PeriodicLeadPopup } from "@/components/PeriodicLeadPopup";

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
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection onOpenChat={handleOpenChat} />
        <QuickLinksBar />
        <HeroBannerCarousel />

        {/* Main content - full width sections */}
        <div className="container">
          <HomeCategoryCards />
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

        <OnlineEducationSection />

        <div className="container">
          <Suspense fallback={<SectionFallback />}><TrendingPrograms /></Suspense>
          <Suspense fallback={<SectionFallback />}><ToolsSection /></Suspense>

          <section className="py-4">
            <DynamicAdBanner variant="horizontal" position="mid-page" />
          </section>

          <Suspense fallback={<SectionFallback />}><NewsSection /></Suspense>

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
      <PeriodicLeadPopup />
    </div>
  );
};

export default Index;
