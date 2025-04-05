
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, Edit, Trash2, Search, Filter, MoreVertical, 
  CheckCircle, XCircle, AlertCircle, Eye
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { mockTasks } from '@/data/mockTasks';

const AdminTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    amount: 0,
    lastDate: ''
  });
  
  const { toast } = useToast();
  
  // Load tasks on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
    }, 500);
  }, []);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle task creation/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === currentTask.id 
          ? { 
              ...task, 
              title: formData.title, 
              description: formData.description, 
              skills: formData.skills.split(',').map(s => s.trim()), 
              amount: Number(formData.amount),
              lastDate: formData.lastDate 
            } 
          : task
      );
      setTasks(updatedTasks);
      toast({
        title: "Task updated",
        description: `"${formData.title}" has been updated successfully.`
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: `task${Date.now()}`,
        title: formData.title,
        description: formData.description,
        skills: formData.skills.split(',').map(s => s.trim()),
        amount: Number(formData.amount),
        lastDate: formData.lastDate,
        createdBy: 'admin-1',
        createdAt: new Date().toISOString(),
        status: 'open',
        applicants: []
      };
      setTasks([newTask, ...tasks]);
      toast({
        title: "Task created",
        description: `"${formData.title}" has been created successfully.`
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setIsDialogOpen(false);
  };
  
  // Delete task
  const handleDelete = () => {
    if (currentTask) {
      setTasks(tasks.filter(task => task.id !== currentTask.id));
      toast({
        title: "Task deleted",
        description: `"${currentTask.title}" has been deleted successfully.`
      });
      setIsDeleteDialogOpen(false);
      setCurrentTask(null);
    }
  };
  
  // Edit task - open dialog with task data
  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      skills: task.skills.join(', '),
      amount: task.amount,
      lastDate: task.lastDate
    });
    setIsDialogOpen(true);
  };
  
  // View task details
  const handleView = (task: Task) => {
    setCurrentTask(task);
    setIsViewDialogOpen(true);
  };
  
  // Confirm delete dialog
  const openDeleteDialog = (task: Task) => {
    setCurrentTask(task);
    setIsDeleteDialogOpen(true);
  };
  
  // Reset form state
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      skills: '',
      amount: 0,
      lastDate: ''
    });
    setCurrentTask(null);
  };
  
  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Open</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-gray-500">Closed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <AdminLayout title="Tasks Management">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-admin-text">Tasks</h1>
            <p className="text-admin-muted">Manage and track all tasks in the system</p>
          </div>
          
          <Button onClick={openCreateDialog} className="bg-admin-primary hover:bg-admin-secondary transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        </div>
        
        {/* Search and filter section */}
        <Card className="neomorphic-light border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Tasks table */}
        <Card className="neomorphic-light border-none">
          <CardHeader className="pb-2">
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-admin-text">No tasks found</h3>
                <p className="mt-1 text-admin-muted">Try adjusting your search or add a new task.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {task.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {task.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{task.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>₹{task.amount}</TableCell>
                        <TableCell>{new Date(task.lastDate).toLocaleDateString()}</TableCell>
                        <TableCell>{task.applicants.length}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(task)} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(task)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(task)} 
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
      
      {/* Create/Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title"
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
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-32"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="e.g. React, JavaScript, Design"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min={0}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="lastDate">Last Date</Label>
                  <Input
                    id="lastDate"
                    name="lastDate"
                    type="date"
                    value={formData.lastDate}
                    onChange={handleInputChange}
                    required
                  />
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
                  {currentTask ? 'Update Task' : 'Create Task'}
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
                  This will permanently delete the task "{currentTask?.title}". This action cannot be undone.
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
                Delete Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* View Task Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {currentTask && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{currentTask.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(currentTask.status)}
                    <span className="text-sm text-gray-500">
                      Created: {new Date(currentTask.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1">{currentTask.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                    <p className="mt-1">₹{currentTask.amount}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Date</h4>
                    <p className="mt-1">{new Date(currentTask.lastDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Skills Required</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentTask.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Applicants ({currentTask.applicants.length})</h4>
                  {currentTask.applicants.length > 0 ? (
                    <div className="mt-2 border rounded-lg divide-y">
                      {currentTask.applicants.map((applicant, index) => (
                        <div key={index} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{applicant.name}</p>
                            <p className="text-xs text-gray-500">
                              Applied on: {new Date(applicant.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={
                            applicant.status === 'accepted' ? 'bg-green-500' : 
                            applicant.status === 'rejected' ? 'bg-red-500' : 
                            'bg-amber-500'
                          }>
                            {applicant.status === 'accepted' ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : applicant.status === 'rejected' ? (
                              <XCircle className="mr-1 h-3 w-3" />
                            ) : (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No applicants yet</p>
                  )}
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
                    handleEdit(currentTask);
                  }}
                  className="bg-admin-primary hover:bg-admin-secondary"
                >
                  Edit Task
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTasks;
