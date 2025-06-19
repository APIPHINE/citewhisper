
import { motion } from 'framer-motion';
import { ExternalLink, Shield, BookOpen, Search, Users, FileText, Zap, Database, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Resources = () => {
  const verificationSites = [
    {
      name: "Quote Investigator",
      url: "https://quoteinvestigator.com",
      description: "The premier site for tracking down the origins of quotations. Garson O'Toole's meticulous research has debunked countless misattributions and revealed the true sources behind famous quotes.",
      category: "Quote Verification",
      icon: Search,
      featured: true
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

  const academicResources = [
    {
      name: "Wikiquote",
      url: "https://en.wikiquote.org",
      description: "A collaborative project to build a free collection of quotations with proper attribution and sourcing. Part of the Wikimedia Foundation family.",
      category: "Quote Database",
      icon: Database
    },
    {
      name: "Oxford Dictionary of Quotations",
      url: "https://www.oxfordreference.com/view/10.1093/acref/9780199237173.001.0001/acref-9780199237173",
      description: "The authoritative reference work for quotations, featuring verified attributions and detailed source information.",
      category: "Academic Reference",
      icon: BookOpen
    },
    {
      name: "Bartlett's Familiar Quotations",
      url: "https://www.bartleby.com/100/",
      description: "A classic collection of passages, phrases, and proverbs traced to their sources in ancient and modern literature.",
      category: "Classic Reference",
      icon: FileText
    }
  ];

  const technicalTools = [
    {
      name: "IIIF (International Image Interoperability Framework)",
      url: "https://iiif.io",
      description: "Standards for presenting and annotating digital manuscripts and historical documents online.",
      category: "Digital Humanities",
      icon: Globe
    },
    {
      name: "Zotero",
      url: "https://www.zotero.org",
      description: "Free reference management software for collecting, organizing, and citing research sources.",
      category: "Citation Management",
      icon: Zap
    },
    {
      name: "Google Scholar",
      url: "https://scholar.google.com",
      description: "Academic search engine for scholarly literature across disciplines and sources.",
      category: "Academic Search",
      icon: Search
    }
  ];

  const researchMethods = [
    {
      title: "Primary Source Verification",
      description: "Always seek the earliest reliable source for any quotation.",
      details: "Look for contemporary accounts, official records, or direct documentation from the time period."
    },
    {
      title: "Cross-Reference Multiple Sources",
      description: "Verify quotations across multiple independent sources.",
      details: "Be wary of quotes that appear only in quote collections without original source citations."
    },
    {
      title: "Check for Anachronisms",
      description: "Ensure the language and concepts match the historical period.",
      details: "Modern phrases or concepts attributed to historical figures are often misattributions."
    },
    {
      title: "Trace Quote Evolution",
      description: "Track how quotes change over time through various retellings.",
      details: "Popular quotes often evolve, with the 'telephone game' effect changing meaning or wording."
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
            Resources for Quote Verification
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Essential tools, databases, and methodologies for accurate quote research and verification.
          </p>
        </motion.div>

        {/* Tabbed Resource Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="verification" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="verification">Verification Sites</TabsTrigger>
              <TabsTrigger value="academic">Academic Resources</TabsTrigger>
              <TabsTrigger value="tools">Technical Tools</TabsTrigger>
              <TabsTrigger value="methods">Research Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="verification" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {verificationSites.map((site, index) => (
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
            </TabsContent>

            <TabsContent value="academic" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {academicResources.map((resource, index) => (
                  <motion.div
                    key={resource.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <resource.icon className="h-5 w-5 text-accent" />
                          <Badge variant="outline">{resource.category}</Badge>
                        </div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {resource.name}
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {resource.description}
                        </p>
                        <Button asChild variant="outline" className="w-full">
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            Access Resource
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {technicalTools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <tool.icon className="h-5 w-5 text-accent" />
                          <Badge variant="outline">{tool.category}</Badge>
                        </div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {tool.name}
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {tool.description}
                        </p>
                        <Button asChild variant="outline" className="w-full">
                          <a 
                            href={tool.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            Visit {tool.name}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="methods" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {researchMethods.map((method, index) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-xl">{method.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium mb-3">{method.description}</p>
                        <p className="text-muted-foreground">{method.details}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-4">Contribute to Our Resources</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Know of other valuable resources for quote verification and research? 
                Help us build the most comprehensive collection of verification tools.
              </p>
              <Button asChild variant="outline">
                <a href="mailto:resources@citequotes.com">
                  Suggest a Resource
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
