import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Index from './pages/Index';
import Resources from './pages/Resources';
import Research from './pages/Research';
import About from './pages/About';
import Glossary from './pages/Glossary';
import FairUsePolicy from './pages/FairUsePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quotes" element={<Index />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/about" element={<About />} />
          <Route path="/articles" element={<Research />} />
          <Route path="/research" element={<Research />} />
          <Route path="/fair-use" element={<FairUsePolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
