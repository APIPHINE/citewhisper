import { ArrowRight, BookOpen, Search, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <img 
            src="/og-image.png" 
            alt="CiteQuotes Logo" 
            className="w-48 h-48 object-contain" 
          />
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4 bg-secondary/80 text-foreground px-4 py-2 rounded-full text-sm">
            <Shield size={16} className="mr-2" /> Reliable Quotations
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">CiteQuotes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find, verify, and share accurate quotations with proper attribution. 
            Because words matter, and so does who said them.
          </p>
          <Link to="/quotes">
            <Button size="lg" className="group">
              Find the perfect quote
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Did you know?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-secondary/30">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Misattributed Quotes</h3>
                <p className="text-muted-foreground">
                  Research suggests that over 65% of popular quotations online are misattributed 
                  or significantly altered from their original form.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/30">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Digital Distortion</h3>
                <p className="text-muted-foreground">
                  In the age of social media, quotations can transform and lose attribution 
                  within just 48 hours of becoming popular.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/30">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3">Citation Impact</h3>
                <p className="text-muted-foreground">
                  Properly cited quotes increase content credibility by 83% according to 
                  reader trust studies.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Articles Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Learn More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden hover:shadow-md transition-shadow group">
              <CardContent className="p-6">
                <BookOpen className="h-10 w-10 mb-4 text-accent" />
                <h3 className="text-xl font-semibold mb-2">Why Sourcing Matters</h3>
                <p className="text-muted-foreground mb-4">
                  Explore how proper attribution strengthens arguments, honors intellectual property, 
                  and builds a foundation for meaningful discourse.
                </p>
                <Link 
                  to="/blog/why-sourcing-matters"
                  className="inline-flex items-center text-accent hover:underline"
                >
                  Read article <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover:shadow-md transition-shadow group">
              <CardContent className="p-6">
                <Search className="h-10 w-10 mb-4 text-accent" />
                <h3 className="text-xl font-semibold mb-2">Balancing Evidence and Open-mindedness</h3>
                <p className="text-muted-foreground mb-4">
                  Learn about the delicate balance between evidence-based reasoning and maintaining 
                  an open mind to new possibilities and interpretations.
                </p>
                <Link 
                  to="/blog/evidence-and-open-mindedness"
                  className="inline-flex items-center text-accent hover:underline"
                >
                  Read article <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
