
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { FavoritesProvider } from './context/FavoritesContext';
import NavBar from './components/NavBar';
import { Footer } from './components/Footer';
import Index from './pages/Index';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import CMSDashboard from './pages/cms/CMSDashboard';
import AccountSettings from './pages/AccountSettings';
import PublicArticle from './pages/cms/PublicArticle';
import PublicArticlesList from './pages/cms/PublicArticlesList';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <FavoritesProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <NavBar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/cms" element={<CMSDashboard />} />
                
                {/* Public Articles Routes */}
                <Route path="/articles" element={<PublicArticlesList />} />
                <Route path="/articles/:slug" element={<PublicArticle />} />
              </Routes>
              <Footer />
            </div>
            <Toaster />
          </Router>
        </FavoritesProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
