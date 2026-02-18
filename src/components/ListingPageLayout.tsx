import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FixedCounsellingCTA } from "@/components/FixedCounsellingCTA";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";

interface ListingPageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  page?: string;
}

export function ListingPageLayout({ children, title, description, page }: ListingPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page={page} />
      <main className="container py-4 md:py-6">
        <header className="mb-6 md:mb-8">
          <h1 className="text-headline font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground max-w-2xl">{description}</p>
        </header>
        {children}
      </main>
      <Footer />
      <FixedCounsellingCTA />
    </div>
  );
}
