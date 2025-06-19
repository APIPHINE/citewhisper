
import { ArrowRight, BookOpen, Users, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Footer } from '@/components/Footer';

const Home = () => {
  return (
    <>
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
              src="/lovable-uploads/4bbe1b42-32de-49b9-b5a2-e8cb69d01488.png" 
              alt="CiteQuotes Logo" 
              className="w-[128px] h-[128px] object-contain" 
            />
          </motion.div>

          {/* Mission Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">CiteQuotes</h1>
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-xl font-medium mb-4">
                Our mission is to quote history accurately.
              </p>
              <p className="text-lg text-muted-foreground">
                At CiteQuotes, we believe that honesty, reputation, and evidence matter in the elusive pursuit of truth. 
                If that matters to you — this site is for you.
              </p>
            </div>
          </motion.div>

          {/* Development Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="bg-secondary/30 border-dashed">
              <CardContent className="pt-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to CiteQuotes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  CiteQuotes is in active development. We're currently refining how quotes are sourced, verified, and contextualized. 
                  The quote library is intentionally minimal while we finalize our system. We welcome your feedback and suggestions.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Get Involved</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-3">Register</h3>
                  <p className="text-muted-foreground mb-4">
                    Join our community of truth-seekers and quote enthusiasts.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-3">Follow the Project</h3>
                  <p className="text-muted-foreground mb-4">
                    Stay updated on our research, investigations, and new features.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/research">View Research</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <PlusCircle className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-3">Suggest a Quote</h3>
                  <p className="text-muted-foreground mb-4">
                    Help us build the library with verified quotes or corrections.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/add-quote">Add Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Section Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Explore CiteQuotes</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Button asChild size="lg" className="group flex-1">
                <Link to="/quotes">
                  Explore All Quotes
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group flex-1">
                <Link to="/research">
                  Quote Research & Investigations
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Home;
