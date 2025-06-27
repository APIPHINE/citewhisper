
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { FavoritesProvider } from './context/FavoritesContext';
import NavBar from './components/NavBar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Index from './pages/Index';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import CMSDashboard from './pages/cms/CMSDashboard';
import AccountSettings from './pages/AccountSettings';
import PublicArticle from './pages/cms/PublicArticle';
import PublicArticlesList from './pages/cms/PublicArticlesList';
import AddQuote from './pages/AddQuote';
import Resources from './pages/Resources';
import Favorites from './pages/Favorites';
import Tools from './pages/Tools';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
                <Route path="/" element={<Home />} />
                <Route path="/quotes" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/add-quote" element={<AddQuote />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/tools" element={<Tools />} />
                
                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/cms" element={<CMSDashboard />} />
                
                {/* Articles Routes (consolidating research content) */}
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
