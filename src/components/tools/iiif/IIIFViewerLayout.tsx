
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface IIIFViewerLayoutProps {
  manifestSection: ReactNode;
  databaseSection: ReactNode;
}

const IIIFViewerLayout = ({ manifestSection, databaseSection }: IIIFViewerLayoutProps) => {
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
              IIIF Viewer
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {manifestSection}
              </div>
              
              <div>
                {databaseSection}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default IIIFViewerLayout;
