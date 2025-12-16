
import { motion } from 'framer-motion';
import { ExternalLink, Shield, BookOpen, Search, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Friends = () => {
  const friendSites = [
    {
      name: "Quote Investigator",
      url: "https://quoteinvestigator.com",
      description: "The premier site for tracking down the origins of quotations. Garson O'Toole's meticulous research has debunked countless misattributions and revealed the true sources behind famous quotes.",
      category: "Quote Verification",
      icon: Search,
      featured: true
    },
    {
      name: "Wikiquote",
      url: "https://en.wikiquote.org",
      description: "A collaborative project to build a free collection of quotations with proper attribution and sourcing. Part of the Wikimedia Foundation family.",
      category: "Quote Database",
      icon: BookOpen
    },
    {
      name: "Snopes",
      url: "https://www.snopes.com",
      description: "The definitive fact-checking resource. Their quote section investigates viral quotations and their true origins, helping combat misinformation.",
      category: "Fact Checking",
      icon: Shield
    },
    {
      name: "International Churchill Society",
      url: "https://winstonchurchill.org",
      description: "The authoritative source for Churchill quotations, with extensive documentation of what he did and didn't say. A model for quote verification.",
      category: "Historical Figures",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Friends of CiteQuotes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover other sites and organizations that share our commitment to accuracy, 
            evidence-based research, and the pursuit of truth in quotations.
          </p>
        </motion.div>

        {/* Mission Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-secondary/30">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Our Shared Mission</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These organizations and websites align with our core values of accuracy, transparency, 
                and evidence-based research. They represent the gold standard in quote verification 
                and historical documentation.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Friend Sites Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {friendSites.map((site, index) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className={`h-full hover:shadow-md transition-shadow ${site.featured ? 'ring-2 ring-accent' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <site.icon className="h-5 w-5 text-accent" />
                        <Badge variant="outline">{site.category}</Badge>
                      </div>
                      {site.featured && (
                        <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {site.name}
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {site.description}
                    </p>
                    <Button asChild className="w-full">
                      <a 
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Visit {site.name}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-4">Know a Site We Should Feature?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                If you know of other organizations or websites that share our commitment to quote accuracy 
                and evidence-based research, we'd love to hear about them.
              </p>
              <Button asChild variant="outline">
                <a href="mailto:suggestions@example.com">
                  Suggest a Friend Site
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Friends;
