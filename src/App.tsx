
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import NavBar from "./components/NavBar";
import { Footer } from "./components/Footer";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Index = lazy(() => import("./pages/Index"));
const AddQuote = lazy(() => import("./pages/AddQuote"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Tools = lazy(() => import("./pages/Tools"));
const IIIFViewer = lazy(() => import("./pages/tools/IIIFViewer"));
const FairUsePolicy = lazy(() => import("./pages/FairUsePolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Research = lazy(() => import("./pages/Research"));
const Resources = lazy(() => import("./pages/Resources"));
const WhySourcingMatters = lazy(() => import("./pages/blog/WhySourcingMatters"));
const EvidenceAndOpenMindedness = lazy(() => import("./pages/blog/EvidenceAndOpenMindedness"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));

// CMS Pages
const CMSDashboard = lazy(() => import("./pages/cms/CMSDashboard"));
const ArticleEditor = lazy(() => import("./pages/cms/ArticleEditor"));
const PageEditor = lazy(() => import("./pages/cms/PageEditor"));
const MediaManager = lazy(() => import("./pages/cms/MediaManager"));
const ArticlesList = lazy(() => import("./pages/cms/ArticlesList"));
const PublicArticle = lazy(() => import("./pages/cms/PublicArticle"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SearchProvider>
          <FavoritesProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <NavBar />
                <main className="flex-1">
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/quotes" element={<Index />} />
                      <Route path="/add-quote" element={<AddQuote />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/tools" element={<Tools />} />
                      <Route path="/tools/iiif-viewer" element={<IIIFViewer />} />
                      <Route path="/research" element={<Research />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/fair-use" element={<FairUsePolicy />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/blog/why-sourcing-matters" element={<WhySourcingMatters />} />
                      <Route path="/blog/evidence-and-open-mindedness" element={<EvidenceAndOpenMindedness />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/email-verification" element={<EmailVerification />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<Admin />} />
                      
                      {/* CMS Routes */}
                      <Route path="/admin/cms" element={<CMSDashboard />} />
                      <Route path="/admin/cms/articles/new" element={<ArticleEditor />} />
                      <Route path="/admin/cms/articles/:slug/edit" element={<ArticleEditor />} />
                      <Route path="/admin/cms/pages/new" element={<PageEditor />} />
                      <Route path="/admin/cms/pages/:slug/edit" element={<PageEditor />} />
                      <Route path="/admin/cms/media" element={<MediaManager />} />
                      
                      {/* Public CMS Routes */}
                      <Route path="/articles" element={<ArticlesList />} />
                      <Route path="/articles/:slug" element={<PublicArticle />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </FavoritesProvider>
        </SearchProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
