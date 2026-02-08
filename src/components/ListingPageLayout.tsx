import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { AdBanner } from "@/components/AdBanner";

interface ListingPageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function ListingPageLayout({ children, title, description }: ListingPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdBanner variant="leaderboard" />
      <main className="container py-4 md:py-6">
        <header className="mb-6 md:mb-8">
          <h1 className="text-headline font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground max-w-2xl">{description}</p>
        </header>
        {children}
      </main>
      <Footer />
      <FloatingBot />
    </div>
  );
}
