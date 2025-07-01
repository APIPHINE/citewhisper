
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import QuoteSubmissionsManager from '@/components/admin/QuoteSubmissionsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin = () => {
  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Admin Dashboard</TabsTrigger>
            <TabsTrigger value="submissions">Quote Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="submissions">
            <QuoteSubmissionsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
