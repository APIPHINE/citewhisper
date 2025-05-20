
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MarkdownToCsvConverter } from '@/components/tools/MarkdownToCsvConverter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Tools = () => {
  return (
    <>
      <div className="min-h-screen pb-20 pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Tools
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>Markdown to CSV Converter</CardTitle>
                  <CardDescription>Convert markdown tables to CSV format for data manipulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link to="#md-to-csv">Open Tool</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>IIIF Viewer</CardTitle>
                  <CardDescription>View and manage IIIF manifests with Mirador integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link to="/tools/iiif-viewer">Open Tool</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="md-to-csv" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="md-to-csv">Markdown to CSV</TabsTrigger>
              </TabsList>
              
              <TabsContent value="md-to-csv">
                <MarkdownToCsvConverter />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Tools;
