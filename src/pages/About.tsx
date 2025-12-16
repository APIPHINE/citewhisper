
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Mail, Shield, Quote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="page-padding">
        <div className="page-max-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Quote className="w-16 h-16 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                About CiteQuotes
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Empowering knowledge through verified quotes and reliable sources. 
                We believe that every quote deserves proper attribution and context.
              </p>
            </div>

            {/* Mission Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  CiteQuotes was founded with a simple yet powerful mission: to create a reliable, 
                  searchable database of quotes with proper attribution and verification. In an age 
                  of misinformation, we believe that accuracy and source verification are paramount.
                </p>
                <p>
                  Our platform serves researchers, students, writers, and anyone who values 
                  intellectual integrity. Every quote in our database is carefully verified 
                  and linked to its original source, ensuring that knowledge is preserved 
                  and shared responsibly.
                </p>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    Verified Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Every quote is meticulously verified against original sources. 
                    We maintain high standards for accuracy and provide complete 
                    bibliographic information for each entry.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    Community Driven
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our community of researchers, academics, and quote enthusiasts 
                    contributes to the database while maintaining our strict 
                    verification standards.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Values Section */}
            <Card>
              <CardHeader>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Accuracy</h3>
                    <p className="text-sm text-muted-foreground">
                      We prioritize factual correctness and proper attribution above all else.
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Accessibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Knowledge should be available to everyone, regardless of background or resources.
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Integrity</h3>
                    <p className="text-sm text-muted-foreground">
                      We maintain the highest ethical standards in our curation and verification processes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Have questions, suggestions, or want to contribute to our database? 
                  We'd love to hear from you.
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> contact@example.com</p>
                  <p><strong>Support:</strong> support@example.com</p>
                  <p><strong>Contributions:</strong> contribute@example.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-8 border-t">
              <p className="text-muted-foreground">
                Built with passion for knowledge and respect for intellectual property.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
