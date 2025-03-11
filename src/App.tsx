
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import { SearchProvider } from "./context/SearchContext";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FavoritesProvider>
        <SearchProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SearchProvider>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
