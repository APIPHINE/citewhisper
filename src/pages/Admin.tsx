
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import QuoteSubmissionsManager from '@/components/admin/QuoteSubmissionsManager';
import CMSDashboard from '@/pages/cms/CMSDashboard';
import { SuperAdminBulkActions } from '@/components/admin/SuperAdminBulkActions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Database, Shield } from 'lucide-react';

const Admin = () => {
  const { userRole } = useUserRoles();
  const isSuperAdmin = userRole === 'super_admin';

  // Mock data for demonstration
  const mockQuotes = [
    { id: '1', type: 'quote', title: 'Quote about wisdom', status: 'pending', author: 'Aristotle', createdAt: '2024-01-15' },
    { id: '2', type: 'quote', title: 'Quote about courage', status: 'approved', author: 'Winston Churchill', createdAt: '2024-01-14' }
  ];

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const handleBulkAction = async (action: string, items: string[]) => {
    console.log('Executing bulk action:', action, 'on items:', items);
    // Implement actual bulk action logic here
  };

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        {/* Super Admin Header */}
        {isSuperAdmin && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Super Admin Panel</h1>
                <p className="text-muted-foreground">Advanced administrative controls and bulk operations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Quick Actions</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-sm font-medium">DB Operations</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Security Events</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-warning" />
                    <div>
                      <p className="text-sm font-medium">Super Admin</p>
                      <Badge variant="outline" className="text-xs">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <Tabs defaultValue="cms" className="w-full">
          <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="cms">Blog & Content</TabsTrigger>
            <TabsTrigger value="dashboard">Admin Dashboard</TabsTrigger>
            <TabsTrigger value="submissions">Quote Submissions</TabsTrigger>
            <TabsTrigger value="research">Research & Articles</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="super-admin">Super Admin</TabsTrigger>}
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

          {/* Super Admin Tab */}
          {isSuperAdmin && (
            <TabsContent value="super-admin">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Crown className="text-primary" />
                    Super Admin Tools
                  </h2>
                </div>
                
                {/* Bulk Actions Component */}
                <SuperAdminBulkActions
                  items={mockQuotes}
                  selectedItems={selectedItems}
                  onSelectionChange={setSelectedItems}
                  onBulkAction={handleBulkAction}
                  contentType="quotes"
                />

                {/* Advanced Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Analytics</CardTitle>
                    <CardDescription>Advanced metrics and performance data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary">99.8%</div>
                        <div className="text-sm text-muted-foreground">System Uptime</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-success">2.3s</div>
                        <div className="text-sm text-muted-foreground">Avg Response Time</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary">15.2k</div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Monitoring */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security Monitoring</CardTitle>
                    <CardDescription>Real-time security events and alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-success" />
                          <div>
                            <p className="font-medium">System Secure</p>
                            <p className="text-sm text-muted-foreground">No security issues detected</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-success">All Clear</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Database Performance</p>
                            <p className="text-sm text-muted-foreground">Optimal query performance</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-primary">Optimal</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
