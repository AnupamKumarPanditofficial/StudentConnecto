
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, Search, Edit, Trash2, MoreVertical, Play, 
  AlertCircle, Eye, Calendar, Tag, Video, Upload,
  Clock
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ShortVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  duration: string;
  uploadDate: string;
  views: number;
  likes: number;
  tags: string[];
  status: 'published' | 'draft';
}

const mockShorts: ShortVideo[] = [
  {
    id: 'sv1',
    title: 'Quick Math Tricks for Speed Calculations',
    description: 'Learn simple math tricks to perform calculations faster in your head.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    videoUrl: 'https://example.com/videos/math-tricks.mp4',
    category: 'Mathematics',
    duration: '2:45',
    uploadDate: '2023-08-10T15:30:00Z',
    views: 1245,
    likes: 342,
    tags: ['Mathematics', 'Speed Calculation', 'Mental Math'],
    status: 'published'
  },
  {
    id: 'sv2',
    title: 'Understanding Newton\'s Laws of Motion',
    description: 'A quick explanation of the three laws of motion with simple examples.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1648798771329-81feb891c192',
    videoUrl: 'https://example.com/videos/newton-laws.mp4',
    category: 'Physics',
    duration: '3:12',
    uploadDate: '2023-07-25T10:15:00Z',
    views: 932,
    likes: 217,
    tags: ['Physics', 'Newton Laws', 'Science'],
    status: 'published'
  },
  {
    id: 'sv3',
    title: 'English Grammar: Common Mistakes to Avoid',
    description: 'Top 5 grammar mistakes students make and how to avoid them.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8',
    videoUrl: 'https://example.com/videos/grammar-mistakes.mp4',
    category: 'English',
    duration: '4:05',
    uploadDate: '2023-08-05T14:20:00Z',
    views: 1543,
    likes: 428,
    tags: ['English', 'Grammar', 'Language'],
    status: 'published'
  },
  {
    id: 'sv4',
    title: 'Chemistry: Understanding Periodic Table',
    description: 'A quick guide to understanding the organization of the periodic table.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6',
    videoUrl: 'https://example.com/videos/periodic-table.mp4',
    category: 'Chemistry',
    duration: '3:50',
    uploadDate: '2023-07-15T09:45:00Z',
    views: 876,
    likes: 196,
    tags: ['Chemistry', 'Periodic Table', 'Science'],
    status: 'draft'
  }
];

const categories = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Other'
];

const AdminShorts = () => {
  const [shorts, setShorts] = useState<ShortVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentShort, setCurrentShort] = useState<ShortVideo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    category: '',
    duration: '',
    tags: '',
    status: 'draft' as 'published' | 'draft'
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    setTimeout(() => {
      setShorts(mockShorts);
    }, 500);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentShort) {
      const updatedShorts = shorts.map(short => 
        short.id === currentShort.id 
          ? { 
              ...short, 
              title: formData.title, 
              description: formData.description, 
              thumbnailUrl: formData.thumbnailUrl, 
              videoUrl: formData.videoUrl,
              category: formData.category,
              duration: formData.duration,
              tags: formData.tags.split(',').map(t => t.trim()),
              status: formData.status
            } 
          : short
      );
      setShorts(updatedShorts);
      toast({
        title: "Short video updated",
        description: `"${formData.title}" has been updated successfully.`
      });
    } else {
      const newShort: ShortVideo = {
        id: `sv${Date.now()}`,
        title: formData.title,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl,
        videoUrl: formData.videoUrl,
        category: formData.category,
        duration: formData.duration,
        uploadDate: new Date().toISOString(),
        views: 0,
        likes: 0,
        tags: formData.tags.split(',').map(t => t.trim()),
        status: formData.status
      };
      setShorts([newShort, ...shorts]);
      toast({
        title: "Short video created",
        description: `"${formData.title}" has been created successfully.`
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };
  
  const handleDelete = () => {
    if (currentShort) {
      setShorts(shorts.filter(short => short.id !== currentShort.id));
      toast({
        title: "Short video deleted",
        description: `"${currentShort.title}" has been deleted successfully.`
      });
      setIsDeleteDialogOpen(false);
      setCurrentShort(null);
    }
  };
  
  const handleEdit = (short: ShortVideo) => {
    setCurrentShort(short);
    setFormData({
      title: short.title,
      description: short.description,
      thumbnailUrl: short.thumbnailUrl,
      videoUrl: short.videoUrl,
      category: short.category,
      duration: short.duration,
      tags: short.tags.join(', '),
      status: short.status
    });
    setIsDialogOpen(true);
  };
  
  const handleView = (short: ShortVideo) => {
    setCurrentShort(short);
    setIsViewDialogOpen(true);
  };
  
  const openDeleteDialog = (short: ShortVideo) => {
    setCurrentShort(short);
    setIsDeleteDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      category: '',
      duration: '',
      tags: '',
      status: 'draft'
    });
    setCurrentShort(null);
  };
  
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const toggleStatus = (short: ShortVideo) => {
    const newStatus = short.status === 'published' ? 'draft' as const : 'published' as const;
    const updatedShorts = shorts.map(s => 
      s.id === short.id ? { ...s, status: newStatus } : s
    );
    setShorts(updatedShorts);
    toast({
      title: `Short ${newStatus === 'published' ? 'published' : 'unpublished'}`,
      description: `"${short.title}" is now ${newStatus === 'published' ? 'visible' : 'hidden'} to users.`
    });
  };
  
  const filteredShorts = shorts.filter(short => 
    short.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    short.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    short.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    short.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const formatDuration = (duration: string) => {
    if (/^\d+:\d+$/.test(duration)) {
      return duration;
    }
    
    const seconds = parseInt(duration, 10);
    if (isNaN(seconds)) return duration;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <AdminLayout title="Shorts Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-admin-text">Short Videos</h1>
            <p className="text-admin-muted">Manage educational short videos</p>
          </div>
          
          <Button onClick={openCreateDialog} className="bg-admin-primary hover:bg-admin-secondary transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Add New Short
          </Button>
        </div>
        
        <Card className="neomorphic-light border-none">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search shorts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="neomorphic-light border-none">
          <CardHeader className="pb-2">
            <CardTitle>All Short Videos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredShorts.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-admin-text">No shorts found</h3>
                <p className="mt-1 text-admin-muted">Try adjusting your search or add a new short video.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShorts.map((short) => (
                      <TableRow key={short.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-12 w-20 rounded overflow-hidden flex-shrink-0 relative">
                              <img 
                                src={short.thumbnailUrl} 
                                alt={short.title} 
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="line-clamp-1 font-medium">{short.title}</p>
                              <p className="line-clamp-1 text-xs text-gray-500">{short.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{short.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span>{short.duration}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={short.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}>
                            {short.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3 text-gray-400" />
                              <span>{short.views} views</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                              <span>{short.likes} likes</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(short)} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(short)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleStatus(short)} 
                                className="cursor-pointer"
                              >
                                {short.status === 'published' ? (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(short)} 
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentShort ? 'Edit Short Video' : 'Create New Short Video'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter video title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter video description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-20"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    placeholder="Enter thumbnail URL"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    required
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" className="gap-1">
                    <Upload className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:inline-block">Upload</span>
                  </Button>
                </div>
                {formData.thumbnailUrl && (
                  <div className="mt-2 h-32 rounded overflow-hidden">
                    <img 
                      src={formData.thumbnailUrl} 
                      alt="Thumbnail preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    placeholder="Enter video URL"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    required
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" className="gap-1">
                    <Upload className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:inline-block">Upload</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  In a production environment, you would upload videos directly. For this demo, please provide a URL.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                    required
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-admin-primary/30"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (mm:ss)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g. 2:45"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g. Mathematics, Algebra, Equations"
                  value={formData.tags}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="draft"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={() => setFormData({ ...formData, status: 'draft' })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="draft" className="font-normal">Draft</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="published"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={() => setFormData({ ...formData, status: 'published' })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="published" className="font-normal">Published</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-admin-primary hover:bg-admin-secondary">
                  {currentShort ? 'Update Video' : 'Create Video'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h4 className="text-lg font-medium">Are you sure?</h4>
                <p className="text-sm text-gray-500">
                  This will permanently delete the short video "{currentShort?.title}". This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
              >
                Delete Video
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          {currentShort && (
            <div className="py-4">
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden bg-gray-900 aspect-video relative">
                  <img 
                    src={currentShort.thumbnailUrl} 
                    alt={currentShort.title} 
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      variant="outline" 
                      className="rounded-full w-16 h-16 p-0 bg-white/20 backdrop-blur-sm border-white/40"
                    >
                      <Play className="h-8 w-8 text-white" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm py-1 px-2 rounded">
                    {currentShort.duration}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold">{currentShort.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>{currentShort.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(currentShort.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{currentShort.views} views</span>
                    </div>
                    <Badge className={currentShort.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}>
                      {currentShort.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-700">{currentShort.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentShort.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(currentShort);
                  }}
                  className="bg-admin-primary hover:bg-admin-secondary"
                >
                  Edit Video
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminShorts;
