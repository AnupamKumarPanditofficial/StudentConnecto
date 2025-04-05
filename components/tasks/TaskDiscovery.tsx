import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Task, TaskApplicant, TaskApplication } from '@/types/task';
import { mockTasks, getAllSkills, currentUser } from '@/data/mockTasks';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, FilterX, DollarSign, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TaskDiscovery = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const allSkills = getAllSkills();

  const applyFilters = () => {
    let filteredTasks = [...mockTasks];
    
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSkills.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        selectedSkills.some(skill => task.skills.includes(skill))
      );
    }
    
    filteredTasks = filteredTasks.filter(task => 
      task.amount >= priceRange[0] && task.amount <= priceRange[1]
    );
    
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.lastDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate >= selectedDate;
      });
    }
    
    setTasks(filteredTasks);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setPriceRange([0, 5000]);
    setDate(undefined);
    setTasks(mockTasks);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const applyForTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (task.applicants.length >= 5) {
      toast({
        title: "Application Limit Reached",
        description: "This task has reached its maximum number of applicants (5)",
        variant: "destructive"
      });
      return;
    }
    
    if (task.applicants.some(app => app.userId === currentUser.id)) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this task",
        variant: "destructive"
      });
      return;
    }
    
    const newApplicant: TaskApplicant = {
      id: `app${Date.now()}`,
      userId: currentUser.id,
      name: currentUser.name,
      appliedAt: new Date().toISOString(),
      status: "pending"
    };
    
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          applicants: [...t.applicants, newApplicant]
        };
      }
      return t;
    });
    
    setTasks(updatedTasks);
    
    const existingTasksStr = localStorage.getItem('tasks');
    let existingTasks = existingTasksStr ? JSON.parse(existingTasksStr) : mockTasks;
    
    existingTasks = existingTasks.map((t: Task) => {
      if (t.id === taskId) {
        return {
          ...t,
          applicants: [...t.applicants, newApplicant]
        };
      }
      return t;
    });
    
    localStorage.setItem('tasks', JSON.stringify(existingTasks));
    
    const taskApplication: TaskApplication = {
      taskId,
      userId: currentUser.id,
      task: task,
      appliedAt: new Date().toISOString(),
      status: "pending"
    };
    
    const existingApplicationsStr = localStorage.getItem('user_task_applications');
    const existingApplications = existingApplicationsStr 
      ? JSON.parse(existingApplicationsStr) 
      : [];
    
    existingApplications.push(taskApplication);
    localStorage.setItem('user_task_applications', JSON.stringify(existingApplications));
    
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully"
    });
  };

  useEffect(() => {
    const storedTasksStr = localStorage.getItem('tasks');
    if (storedTasksStr) {
      setTasks(JSON.parse(storedTasksStr));
    } else {
      setTasks(mockTasks);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedSkills, priceRange, date]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>
        </div>
        
        <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
          <FilterX className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Select skills you're interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Price Range</CardTitle>
            <CardDescription>Filter by payment amount (₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <Slider
              defaultValue={[0, 5000]}
              max={5000}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-6"
            />
            <div className="flex justify-between text-sm">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Last Date</CardTitle>
            <CardDescription>Filter by application last date</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or search term</p>
          </div>
        ) : (
          tasks.map(task => (
            <Card key={task.id} className="flex flex-col h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="line-clamp-1">{task.title}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ₹{task.amount}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {format(new Date(task.lastDate), 'MMM dd, yyyy')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{task.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <span>{task.applicants.length} of 5 applicants</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => applyForTask(task.id)}
                  disabled={
                    task.applicants.length >= 5 || 
                    task.applicants.some(app => app.userId === currentUser.id)
                  }
                >
                  {task.applicants.some(app => app.userId === currentUser.id) 
                    ? 'Applied' 
                    : task.applicants.length >= 5 
                      ? 'Applications Closed' 
                      : 'Apply Now'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskDiscovery;
