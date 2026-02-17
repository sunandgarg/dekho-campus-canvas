import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const AllColleges = lazy(() => import("./pages/AllColleges"));
const AllCourses = lazy(() => import("./pages/AllCourses"));
const AllExams = lazy(() => import("./pages/AllExams"));
const AllArticles = lazy(() => import("./pages/AllArticles"));
const CollegeDetail = lazy(() => import("./pages/CollegeDetail"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const ExamDetail = lazy(() => import("./pages/ExamDetail"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminAds = lazy(() => import("./pages/AdminAds"));
const AdminFeatured = lazy(() => import("./pages/AdminFeatured"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminColleges = lazy(() => import("./pages/AdminColleges"));
const AdminCourses = lazy(() => import("./pages/AdminCourses"));
const AdminExams = lazy(() => import("./pages/AdminExams"));
const AdminArticles = lazy(() => import("./pages/AdminArticles"));
const AdminDocs = lazy(() => import("./pages/AdminDocs"));
const AdminBanners = lazy(() => import("./pages/AdminBanners"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const AllTools = lazy(() => import("./pages/AllTools"));
const AdminPartners = lazy(() => import("./pages/AdminPartners"));
const AdminAIProviders = lazy(() => import("./pages/AdminAIProviders"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/colleges" element={<AllColleges />} />
              <Route path="/colleges/:slug" element={<CollegeDetail />} />
              <Route path="/colleges/:slug/:tab" element={<CollegeDetail />} />
              <Route path="/courses" element={<AllCourses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/courses/:slug/:tab" element={<CourseDetail />} />
              <Route path="/exams" element={<AllExams />} />
              <Route path="/exams/:slug" element={<ExamDetail />} />
              <Route path="/exams/:slug/:tab" element={<ExamDetail />} />
              <Route path="/articles" element={<AllArticles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              {/* Admin routes - open to everyone */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/colleges" element={<AdminColleges />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/exams" element={<AdminExams />} />
              <Route path="/admin/ads" element={<AdminAds />} />
              <Route path="/admin/featured" element={<AdminFeatured />} />
              <Route path="/admin/leads" element={<AdminLeads />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/docs" element={<AdminDocs />} />
              <Route path="/admin/banners" element={<AdminBanners />} />
              <Route path="/admin/partners" element={<AdminPartners />} />
              <Route path="/admin/ai-providers" element={<AdminAIProviders />} />
              <Route path="/tools" element={<AllTools />} />
              <Route path="/tools/:slug" element={<ToolPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
