
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image, File, Search, Filter, Check, X } from 'lucide-react';
import { fetchMedia, updateMediaApproval } from '@/services/cmsService';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import type { CMSMedia } from '@/types/cms';

interface MediaLibraryProps {
  onSelectMedia?: (media: CMSMedia) => void;
  allowUpload?: boolean;
  allowApproval?: boolean;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelectMedia,
  allowUpload = true,
  allowApproval = false
}) => {
  const [media, setMedia] = useState<CMSMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    alt_text: '',
    caption: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { canManageRoles } = useUserRoles();

  useEffect(() => {
    loadMedia();
  }, [filterStatus]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const statusFilter = filterStatus === 'all' ? undefined : filterStatus;
      const mediaData = await fetchMedia(statusFilter);
      setMedia(mediaData);
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: "Error",
        description: "Failed to load media library",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !user) return;

    try {
      // In a real implementation, you would upload to Supabase Storage
      // For now, we'll simulate the upload
      toast({
        title: "Upload Started",
        description: "Media upload functionality would be implemented here",
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload media",
        variant: "destructive"
      });
    }
  };

  const handleApproval = async (mediaId: string, status: 'approved' | 'rejected') => {
    if (!user || !canManageRoles()) return;

    try {
      await updateMediaApproval(mediaId, status, user.id);
      await loadMedia();
      toast({
        title: "Success",
        description: `Media ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating media approval:', error);
      toast({
        title: "Error",
        description: "Failed to update media approval",
        variant: "destructive"
      });
    }
  };

  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.caption?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        {allowUpload && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload size={16} />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <Label htmlFor="alt-text">Alt Text</Label>
                  <Input
                    id="alt-text"
                    value={uploadMetadata.alt_text}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="Describe the image for accessibility"
                  />
                </div>
                <div>
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    value={uploadMetadata.caption}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Optional caption for the media"
                  />
                </div>
                <Button onClick={handleUpload} disabled={!uploadFile}>
                  Upload
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-8">Loading media...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div key={item.id} className="border rounded-lg p-3 space-y-2">
              <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                {item.media_type === 'image' ? (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <Image size={32} className="text-gray-400" />
                  </div>
                ) : (
                  <File size={32} className="text-gray-400" />
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium truncate">{item.original_filename}</h4>
                  <Badge className={getStatusColor(item.approval_status)}>
                    {item.approval_status}
                  </Badge>
                </div>
                
                {item.alt_text && (
                  <p className="text-xs text-gray-500 truncate">{item.alt_text}</p>
                )}
                
                <p className="text-xs text-gray-400">
                  {(item.file_size / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="flex gap-1">
                {onSelectMedia && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectMedia(item)}
                    className="flex-1"
                  >
                    Select
                  </Button>
                )}
                
                {allowApproval && item.approval_status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(item.id, 'approved')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(item.id, 'rejected')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={14} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredMedia.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No media found matching your criteria
        </div>
      )}
    </div>
  );
};
