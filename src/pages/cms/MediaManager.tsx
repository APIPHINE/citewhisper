
import React from 'react';
import { motion } from 'framer-motion';
import { MediaLibrary } from '@/components/cms/MediaLibrary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRoles } from '@/hooks/useUserRoles';

const MediaManager = () => {
  const { canManageRoles } = useUserRoles();

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Media Manager</h1>
            <p className="text-muted-foreground">
              Manage your media files and approve user submissions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaLibrary 
                allowUpload={true} 
                allowApproval={canManageRoles()} 
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MediaManager;
