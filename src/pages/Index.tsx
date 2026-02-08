import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { UniversalSearch } from "@/components/UniversalSearch";
import { StatsSection } from "@/components/StatsSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedColleges } from "@/components/FeaturedColleges";
import { NewsSection } from "@/components/NewsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ToolsSection } from "@/components/ToolsSection";
import { TrustedBySection } from "@/components/TrustedBySection";
import { Footer } from "@/components/Footer";
import { AIChatFullScreen } from "@/components/AIChatFullScreen";
import { FloatingBot } from "@/components/FloatingBot";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>();

  const handleOpenChat = useCallback((message?: string) => {
    setInitialChatMessage(message);
    setIsChatOpen(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    setInitialChatMessage(undefined);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <HeroSection onOpenChat={handleOpenChat} />
        <UniversalSearch />
        <StatsSection />
        <CategorySection />
        <FeaturedColleges />
        <NewsSection />
        <ToolsSection />
        <FeaturesSection />
        <TrustedBySection />
      </main>

      <Footer />

      <AIChatFullScreen
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        initialMessage={initialChatMessage}
      />

      <FloatingBot />
    </div>
  );
};

export default Index;
