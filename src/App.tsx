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
import UserProfile from './pages/UserProfile';
import Admin from './pages/Admin';
import CMSDashboard from './pages/cms/CMSDashboard';
import ArticleEditor from './pages/cms/ArticleEditor';
import NewArticle from './pages/cms/NewArticle';
import ArticlesList from './pages/cms/ArticlesList';
import PageEditor from './pages/cms/PageEditor';
import MediaManager from './pages/cms/MediaManager';
import AccountSettings from './pages/AccountSettings';
import PublicArticle from './pages/cms/PublicArticle';
import PublicArticlesList from './pages/cms/PublicArticlesList';
import AddQuote from './pages/AddQuote';
import Resources from './pages/Resources';
import Research from './pages/Research';
import Favorites from './pages/Favorites';
import Tools from './pages/Tools';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import { Toaster } from "@/components/ui/toaster"
import { SecurityAuditLogger } from '@/components/auth/SecurityAuditLogger';
import { AdminRoute } from '@/components/auth/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <FavoritesProvider>
          <SecurityAuditLogger />
          <Router>
            <div className="min-h-screen bg-white">
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quotes" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/add-quote" element={<AddQuote />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/research" element={<Research />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/about" element={<About />} />
                
                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/change-password" element={<ChangePassword />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path="/admin/cms" element={<AdminRoute><CMSDashboard /></AdminRoute>} />
                <Route path="/admin/cms/articles" element={<AdminRoute><ArticlesList /></AdminRoute>} />
                <Route path="/admin/cms/articles/new" element={<AdminRoute requireSuperAdmin><NewArticle /></AdminRoute>} />
                <Route path="/admin/cms/articles/:id/edit" element={<AdminRoute requireSuperAdmin><ArticleEditor /></AdminRoute>} />
                <Route path="/admin/cms/pages/new" element={<AdminRoute requireSuperAdmin><PageEditor /></AdminRoute>} />
                <Route path="/admin/cms/pages/:id/edit" element={<AdminRoute requireSuperAdmin><PageEditor /></AdminRoute>} />
                <Route path="/admin/cms/media" element={<AdminRoute><MediaManager /></AdminRoute>} />
                
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
