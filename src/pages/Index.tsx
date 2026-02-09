import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { UniversalSearch } from "@/components/UniversalSearch";
import { CitySearch } from "@/components/CitySearch";
import { CategorySection } from "@/components/CategorySection";
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
        <CitySearch />
        <CategorySection />
        <UpcomingExams />
        <ToolsSection />
        <NewsSection />
        <FeaturesSection />
        <FAQSection page="homepage" title="Frequently Asked Questions" />
        <TrustedBySection />
      </main>
      <Footer />
      <AILeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} onSubmit={handleLeadSubmit} />
      <AIChatFullScreen isOpen={isChatOpen} onClose={handleCloseChat} initialMessage={initialChatMessage} leadData={leadInfo} />
      <FloatingBot />
    </div>
  );
};

export default Index;
