
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MarkdownToCsvConverter } from '@/components/tools/MarkdownToCsvConverter';

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
