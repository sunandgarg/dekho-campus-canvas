import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load listing & detail pages for better initial load
const AllColleges = lazy(() => import("./pages/AllColleges"));
const AllCourses = lazy(() => import("./pages/AllCourses"));
const AllExams = lazy(() => import("./pages/AllExams"));
const CollegeDetail = lazy(() => import("./pages/CollegeDetail"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const ExamDetail = lazy(() => import("./pages/ExamDetail"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/colleges" element={<AllColleges />} />
            <Route path="/colleges/:slug" element={<CollegeDetail />} />
            <Route path="/courses" element={<AllCourses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/exams" element={<AllExams />} />
            <Route path="/exams/:slug" element={<ExamDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
