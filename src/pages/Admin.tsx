
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import QuoteSubmissionsManager from '@/components/admin/QuoteSubmissionsManager';
import CMSDashboard from '@/pages/cms/CMSDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin = () => {
  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        <Tabs defaultValue="cms" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cms">Blog & Content</TabsTrigger>
            <TabsTrigger value="dashboard">Admin Dashboard</TabsTrigger>
            <TabsTrigger value="submissions">Quote Submissions</TabsTrigger>
            <TabsTrigger value="research">Research & Articles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cms">
            <CMSDashboard />
          </TabsContent>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="submissions">
            <QuoteSubmissionsManager />
          </TabsContent>
          
          <TabsContent value="research">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Research & Articles Management</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <a href="/research" className="block text-sm text-blue-600 hover:underline">
                      View Research Page
                    </a>
                    <a href="/admin/cms/articles/new" className="block text-sm text-blue-600 hover:underline">
                      Create New Article
                    </a>
                    <a href="/admin/cms/articles" className="block text-sm text-blue-600 hover:underline">
                      Manage All Articles
                    </a>
                  </div>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Research Page Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Edit the Research page content directly from the page itself using the floating edit button.
                  </p>
                  <a href="/research" className="inline-block text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">
                    Go to Research Page
                  </a>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Content Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Published Articles:</span>
                      <span className="font-medium">Loading...</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Draft Articles:</span>
                      <span className="font-medium">Loading...</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Page Views:</span>
                      <span className="font-medium">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
