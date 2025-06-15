
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import { SearchProvider } from "./context/SearchContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import AddQuote from "./pages/AddQuote";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import WhySourcingMatters from "./pages/blog/WhySourcingMatters";
import EvidenceAndOpenMindedness from "./pages/blog/EvidenceAndOpenMindedness";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FairUsePolicy from "./pages/FairUsePolicy";
import Tools from "./pages/Tools";
import IIIFViewer from "./pages/tools/IIIFViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FavoritesProvider>
          <SearchProvider>
            <Toaster />
            <BrowserRouter>
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quotes" element={<Index />} />
                <Route path="/add-quote" element={<AddQuote />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/iiif-viewer" element={<IIIFViewer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/blog/why-sourcing-matters" element={<WhySourcingMatters />} />
                <Route path="/blog/evidence-and-open-mindedness" element={<EvidenceAndOpenMindedness />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/fair-use-policy" element={<FairUsePolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SearchProvider>
        </FavoritesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
