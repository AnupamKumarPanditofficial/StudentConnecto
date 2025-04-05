
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
  Plus, Search, Edit, Trash2, MoreVertical, 
  Eye, AlertCircle, Calendar, Heart, MessageCircle, Clock
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Define Blog Type
interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  tags: string[];
  likes: number;
  comments: number;
  status: 'published' | 'draft';
}

// Mock blogs data
const mockBlogs: Blog[] = [
  {
    id: 'b1',
    title: 'How to Ace Your Math Exams: Effective Study Techniques',
    summary: 'Discover the most effective techniques to prepare for and excel in mathematics examinations at all levels.',
    content: `
      <p>Mathematics can be a challenging subject for many students, but with the right approach, anyone can improve their performance in math exams.</p>
      
      <h2>1. Understand Concepts, Don't Just Memorize</h2>
      <p>The key to success in mathematics is understanding the underlying concepts rather than memorizing formulas. When you understand why a formula works, you can apply it to a variety of problems.</p>
      
      <h2>2. Practice Regularly</h2>
      <p>Mathematics requires consistent practice. Set aside time each day to solve problems, even if it's just for 30 minutes.</p>
      
      <h2>3. Start with Basic Problems</h2>
      <p>Before attempting complex problems, make sure you're comfortable with the basics. Build a strong foundation before moving on to more advanced topics.</p>
      
      <h2>4. Review Mistakes</h2>
      <p>When you make mistakes, don't just move on. Take time to understand where you went wrong and how to correct it.</p>
      
      <h2>5. Use Multiple Resources</h2>
      <p>Don't rely on a single textbook. Use online resources, video tutorials, and practice papers to get different perspectives on the same topic.</p>
    `,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    author: 'Dr. Sarah Johnson',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
    date: 'May 15, 2023',
    readTime: '8 min read',
    tags: ['Mathematics', 'Study Tips', 'Exams'],
    likes: 342,
    comments: 28,
    status: 'published'
  },
  {
    id: 'b2',
    title: 'The Science of Effective Note-Taking: Boost Your Learning Retention',
    summary: 'Learn scientifically-proven techniques to take better notes and significantly improve your ability to retain information.',
    content: `
      <p>Note-taking is an essential skill for students, but many don\'t realize there\'s a science behind effective note-taking strategies.</p>
      
      <h2>The Cornell Method</h2>
      <p>Developed at Cornell University, this system divides your page into three sections: a narrow left column for cues, a wide right column for notes, and a bottom section for summaries.</p>
      
      <h2>Mind Mapping</h2>
      <p>This visual technique helps connect ideas and concepts. Start with a central idea and branch out with related points, creating a web of information.</p>
      
      <h2>The Outline Method</h2>
      <p>This traditional approach uses headings, subheadings, and bullet points to organize information hierarchically.</p>
      
      <h2>Digital vs. Handwritten Notes</h2>
      <p>Research suggests that handwriting notes leads to better conceptual understanding, while digital notes are better for capturing information quickly.</p>
      
      <h2>Review and Revise</h2>
      <p>No matter which method you choose, regular review of your notes is crucial for long-term retention.</p>
    `,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    author: 'Prof. Michael Chen',
    authorAvatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
    date: 'June 3, 2023',
    readTime: '6 min read',
    tags: ['Study Skills', 'Note-Taking', 'Learning'],
    likes: 215,
    comments: 41,
    status: 'published'
  },
  {
    id: 'b3',
    title: 'Preparing for Competitive Exams: A Comprehensive Guide',
    summary: 'A step-by-step approach to preparing for competitive examinations like JEE, NEET, UPSC, and more.',
    content: `
      <p>Competitive exams require a different approach compared to regular academic assessments. This guide provides a roadmap for effective preparation.</p>
      
      <h2>Understand the Exam Pattern</h2>
      <p>Before you begin preparation, thoroughly understand the exam pattern, syllabus, marking scheme, and time constraints.</p>
      
      <h2>Create a Study Schedule</h2>
      <p>Develop a realistic timetable that balances all subjects and topics based on your strengths and weaknesses.</p>
      
      <h2>Quality Study Material</h2>
      <p>Choose standard textbooks and reliable study materials. Avoid studying from too many sources as it can lead to confusion.</p>
      
      <h2>Regular Mock Tests</h2>
      <p>Take mock tests under exam-like conditions to build stamina and improve time management skills.</p>
      
      <h2>Revision Strategy</h2>
      <p>Allocate sufficient time for revision. Create concise notes for quick review during the final phase of preparation.</p>
      
      <h2>Physical and Mental Well-being</h2>
      <p>Don\'t neglect your health. Regular exercise, proper nutrition, and adequate sleep are essential for optimal cognitive function.</p>
    `,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    author: 'Rajesh Verma',
    authorAvatar: 'https://ui-avatars.com/api/?name=Rajesh+Verma&background=random',
    date: 'July 12, 2023',
    readTime: '10 min read',
    tags: ['Competitive Exams', 'JEE', 'NEET', 'UPSC'],
    likes: 478,
    comments: 52,
    status: 'published'
  },
  {
    id: 'b4',
    title: 'Effective Time Management for Students: Balancing Studies and Life',
    summary: 'Learn proven strategies to manage your time efficiently and balance academic responsibilities with personal life.',
    content: `
      <p>For students, effective time management is the key to academic success while maintaining a healthy work-life balance.</p>
      
      <h2>Time Tracking</h2>
      <p>Begin by tracking how you spend your time for a week. This will give you insight into where your time goes and help identify wasted periods.</p>
      
      <h2>Prioritization</h2>
      <p>Use methods like the Eisenhower Matrix to categorize tasks by urgency and importance. Focus on the important but not urgent quadrant.</p>
      
      <h2>Chunking</h2>
      <p>Break down large tasks into smaller, manageable chunks. This makes daunting assignments less intimidating and easier to accomplish.</p>
      
      <h2>The Pomodoro Technique</h2>
      <p>Work in focused 25-minute intervals followed by 5-minute breaks. After four cycles, take a longer break of 15-30 minutes.</p>
      
      <h2>Digital Detox</h2>
      <p>Schedule periods of time where you disconnect from digital distractions. Use apps that block social media during study sessions.</p>
      
      <h2>Regular Review</h2>
      <p>Weekly review your schedule and adjust as needed. Celebrate successes and learn from challenges.</p>
    `,
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe',
    author: 'Emma Williams',
    authorAvatar: 'https://ui-avatars.com/api/?name=Emma+Williams&background=random',
    date: 'August 2, 2023',
    readTime: '7 min read',
    tags: ['Time Management', 'Student Life', 'Productivity'],
    likes: 319,
    comments: 37,
    status: 'draft'
  }
];

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: '',
    tags: '',
    status: 'draft' as 'published' | 'draft'
  });
  
  const { toast } = useToast();
  
  // Load blogs on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogs(mockBlogs);
    }, 500);
  }, []);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle blog creation/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentBlog) {
      // Update existing blog
      const updatedBlogs = blogs.map(blog => 
        blog.id === currentBlog.id 
          ? { 
              ...blog, 
              title: formData.title, 
              summary: formData.summary, 
              content: formData.content, 
              image: formData.image,
              tags: formData.tags.split(',').map(t => t.trim()),
              status: formData.status
            } 
          : blog
      );
      setBlogs(updatedBlogs);
      toast({
        title: "Blog updated",
        description: `"${formData.title}" has been updated successfully.`
      });
    } else {
      // Create new blog
      const newBlog: Blog = {
        id: `b${Date.now()}`,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        image: formData.image,
        author: 'Admin User',
        authorAvatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: '5 min read',
        tags: formData.tags.split(',').map(t => t.trim()),
        likes: 0,
        comments: 0,
        status: formData.status
      };
      setBlogs([newBlog, ...blogs]);
      toast({
        title: "Blog created",
        description: `"${formData.title}" has been created successfully.`
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };
  
  // Delete blog
  const handleDelete = () => {
    if (currentBlog) {
      setBlogs(blogs.filter(blog => blog.id !== currentBlog.id));
      toast({
        title: "Blog deleted",
        description: `"${currentBlog.title}" has been deleted successfully.`
      });
      setIsDeleteDialogOpen(false);
      setCurrentBlog(null);
    }
  };
  
  // Edit blog - open dialog with blog data
  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      image: blog.image,
      tags: blog.tags.join(', '),
      status: blog.status
    });
    setIsDialogOpen(true);
  };
  
  // View blog details
  const handleView = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsViewDialogOpen(true);
  };
  
  // Confirm delete dialog
  const openDeleteDialog = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsDeleteDialogOpen(true);
  };
  
  // Reset form state
  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      image: '',
      tags: '',
      status: 'draft'
    });
    setCurrentBlog(null);
  };
  
  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  // Toggle blog status
  const toggleStatus = (blog: Blog) => {
    const newStatus = blog.status === 'published' ? 'draft' as const : 'published' as const;
    const updatedBlogs = blogs.map(b => 
      b.id === blog.id ? { ...b, status: newStatus } : b
    );
    setBlogs(updatedBlogs);
    toast({
      title: `Blog ${newStatus === 'published' ? 'published' : 'unpublished'}`,
      description: `"${blog.title}" is now ${newStatus === 'published' ? 'visible' : 'hidden'} to users.`
    });
  };
  
  // Filter blogs by search term
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <AdminLayout title="Blog Management">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-admin-text">Blogs</h1>
            <p className="text-admin-muted">Manage blog posts and articles</p>
          </div>
          
          <Button onClick={openCreateDialog} className="bg-admin-primary hover:bg-admin-secondary transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Create New Blog
          </Button>
        </div>
        
        {/* Search section */}
        <Card className="neomorphic-light border-none">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search blogs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Blogs table */}
        <Card className="neomorphic-light border-none">
          <CardHeader className="pb-2">
            <CardTitle>All Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-admin-text">No blogs found</h3>
                <p className="mt-1 text-admin-muted">Try adjusting your search or add a new blog post.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={blog.image} 
                                alt={blog.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="line-clamp-1 font-medium">{blog.title}</p>
                              <p className="line-clamp-1 text-xs text-gray-500">{blog.summary}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{blog.author}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{blog.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{blog.readTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={blog.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}>
                            {blog.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-500" />
                              <span>{blog.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 text-blue-500" />
                              <span>{blog.comments}</span>
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
                              <DropdownMenuItem onClick={() => handleView(blog)} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(blog)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleStatus(blog)} 
                                className="cursor-pointer"
                              >
                                {blog.status === 'published' ? (
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
                                onClick={() => openDeleteDialog(blog)} 
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
      
      {/* Create/Edit Blog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Blog Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Enter a brief summary of the blog post"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  className="min-h-16"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Content (HTML supported)</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter blog content with HTML markup"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  className="min-h-64 font-mono text-sm"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Featured Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  placeholder="Enter image URL"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  In a production environment, you would upload images directly. For this demo, please provide a URL.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g. Mathematics, Study Tips, Exams"
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
                  {currentBlog ? 'Update Blog' : 'Create Blog'}
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
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h4 className="text-lg font-medium">Are you sure?</h4>
                <p className="text-sm text-gray-500">
                  This will permanently delete the blog post "{currentBlog?.title}". This action cannot be undone.
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
                Delete Blog
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View Blog Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Preview</DialogTitle>
          </DialogHeader>
          {currentBlog && (
            <div className="py-4">
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden h-64 w-full">
                  <img 
                    src={currentBlog.image} 
                    alt={currentBlog.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold">{currentBlog.title}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img 
                          src={currentBlog.authorAvatar} 
                          alt={currentBlog.author} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{currentBlog.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{currentBlog.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{currentBlog.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {currentBlog.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-700 italic">{currentBlog.summary}</p>
                </div>
                
                <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: currentBlog.content }}></div>
                
                <div className="flex items-center gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>{currentBlog.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <span>{currentBlog.comments} comments</span>
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
                    handleEdit(currentBlog);
                  }}
                  className="bg-admin-primary hover:bg-admin-secondary"
                >
                  Edit Blog
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBlogs;
