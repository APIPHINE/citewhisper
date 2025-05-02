
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import { SearchProvider } from "./context/SearchContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
              <Route path="/login" element={<Login />} />
              <Route path="/blog/why-sourcing-matters" element={<WhySourcingMatters />} />
              <Route path="/blog/evidence-and-open-mindedness" element={<EvidenceAndOpenMindedness />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SearchProvider>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
