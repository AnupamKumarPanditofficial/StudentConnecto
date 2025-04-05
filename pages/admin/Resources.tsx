
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Plus, Search, Filter, Edit, Trash2, MoreVertical, 
  File, FileText, Image as ImageIcon, AlertCircle, Download
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Define Resource Type
interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'pdf' | 'image' | 'doc' | 'video';
  url: string;
  createdAt: string;
  downloads: number;
}

// Mock data for resources
const mockResources: Resource[] = [
  {
    id: 'res1',
    title: 'Chemistry Cheat Sheet',
    description: 'A comprehensive cheat sheet covering all important chemistry formulas and concepts.',
    category: 'Science',
    type: 'pdf',
    url: 'https://example.com/chemistry-cheat-sheet.pdf',
    createdAt: '2023-08-15T10:30:00Z',
    downloads: 324
  },
  {
    id: 'res2',
    title: 'Mathematics Formula Guide',
    description: 'Complete guide to all mathematics formulas for high school students.',
    category: 'Mathematics',
    type: 'pdf',
    url: 'https://example.com/math-formulas.pdf',
    createdAt: '2023-07-22T14:45:00Z',
    downloads: 512
  },
  {
    id: 'res3',
    title: 'Physics Lab Experiment Instructions',
    description: 'Step-by-step instructions for common physics lab experiments.',
    category: 'Science',
    type: 'doc',
    url: 'https://example.com/physics-lab.docx',
    createdAt: '2023-08-05T09:15:00Z',
    downloads: 187
  },
  {
    id: 'res4',
    title: 'English Grammar Rules Infographic',
    description: 'Visual infographic explaining key English grammar rules and exceptions.',
    category: 'Languages',
    type: 'image',
    url: 'https://example.com/grammar-infographic.jpg',
    createdAt: '2023-07-30T16:20:00Z',
    downloads: 423
  },
  {
    id: 'res5',
    title: 'History Timeline Poster',
    description: 'Comprehensive timeline of major world history events from ancient to modern times.',
    category: 'Social Studies',
    type: 'image',
    url: 'https://example.com/history-timeline.jpg',
    createdAt: '2023-08-10T11:10:00Z',
    downloads: 256
  }
];

// Resource categories
const categories = [
  'Mathematics',
  'Science',
  'Social Studies',
  'Languages',
  'Computer Science',
  'Arts',
  'Physical Education',
  'Other'
];

const AdminResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    url: ''
  });
  
  const { toast } = useToast();
  
  // Load resources on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResources(mockResources);
    }, 500);
  }, []);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select input change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle resource creation/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentResource) {
      // Update existing resource
      const updatedResources = resources.map(resource => 
        resource.id === currentResource.id 
          ? { 
              ...resource, 
              title: formData.title, 
              description: formData.description, 
              category: formData.category, 
              type: formData.type as any,
              url: formData.url 
            } 
          : resource
      );
      setResources(updatedResources);
      toast({
        title: "Resource updated",
        description: `"${formData.title}" has been updated successfully.`
      });
    } else {
      // Create new resource
      const newResource: Resource = {
        id: `res${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type as any,
        url: formData.url,
        createdAt: new Date().toISOString(),
        downloads: 0
      };
      setResources([newResource, ...resources]);
      toast({
        title: "Resource created",
        description: `"${formData.title}" has been created successfully.`
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setIsDialogOpen(false);
  };
  
  // Delete resource
  const handleDelete = () => {
    if (currentResource) {
      setResources(resources.filter(resource => resource.id !== currentResource.id));
      toast({
        title: "Resource deleted",
        description: `"${currentResource.title}" has been deleted successfully.`
      });
      setIsDeleteDialogOpen(false);
      setCurrentResource(null);
    }
  };
  
  // Edit resource - open dialog with resource data
  const handleEdit = (resource: Resource) => {
    setCurrentResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      type: resource.type,
      url: resource.url
    });
    setIsDialogOpen(true);
  };
  
  // Confirm delete dialog
  const openDeleteDialog = (resource: Resource) => {
    setCurrentResource(resource);
    setIsDeleteDialogOpen(true);
  };
  
  // Reset form state
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      type: '',
      url: ''
    });
    setCurrentResource(null);
  };
  
  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  // Filter resources
  const filteredResources = resources.filter(resource => {
    // Filter by search term
    const matchesSearchTerm = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    
    return matchesSearchTerm && matchesCategory;
  });
  
  // Type icon and color mapping
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case 'video':
        return <File className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <AdminLayout title="Resources Management">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-admin-text">Resources</h1>
            <p className="text-admin-muted">Manage educational resources for students</p>
          </div>
          
          <Button onClick={openCreateDialog} className="bg-admin-primary hover:bg-admin-secondary transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Add New Resource
          </Button>
        </div>
        
        {/* Search and filter section */}
        <Card className="neomorphic-light border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Resources table */}
        <Card className="neomorphic-light border-none">
          <CardHeader className="pb-2">
            <CardTitle>All Resources</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredResources.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-admin-text">No resources found</h3>
                <p className="mt-1 text-admin-muted">Try adjusting your search filters or add a new resource.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(resource.type)}
                            <span>{resource.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{resource.category}</Badge>
                        </TableCell>
                        <TableCell className="uppercase text-xs">{resource.type}</TableCell>
                        <TableCell>{new Date(resource.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3 text-gray-400" />
                            {resource.downloads}
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
                              <DropdownMenuItem onClick={() => handleEdit(resource)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(resource)} 
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
      
      {/* Create/Edit Resource Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentResource ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
            <DialogDescription>
              {currentResource ? 'Update the resource details below' : 'Fill in the details to create a new resource'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Resource Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter resource title"
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
                  placeholder="Enter resource description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-24"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Resource Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="doc">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="url">Resource URL</Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="Enter resource URL"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  In a production environment, you would upload files directly. For this demo, please provide a URL.
                </p>
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
                  {currentResource ? 'Update Resource' : 'Create Resource'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The resource will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h4 className="text-lg font-medium">Are you sure?</h4>
                <p className="text-sm text-gray-500">
                  This will permanently delete the resource "{currentResource?.title}". This action cannot be undone.
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
                Delete Resource
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminResources;
