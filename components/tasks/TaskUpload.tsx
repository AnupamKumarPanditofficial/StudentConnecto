
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getAllSkills, mockTasks, currentUser } from '@/data/mockTasks';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description cannot exceed 1000 characters'),
  skills: z.string().min(1, 'Please select at least one skill'),
  amount: z.coerce.number().min(100, 'Minimum amount is ₹100').max(10000, 'Maximum amount is ₹10,000'),
  lastDate: z.date({
    required_error: "Please select a date",
  }).refine((date) => date > new Date(), {
    message: "Last date must be in the future",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskUploadProps {
  onTaskCreated: () => void;
}

const TaskUpload = ({ onTaskCreated }: TaskUploadProps) => {
  const allSkills = getAllSkills();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      skills: '',
      amount: 500,
      lastDate: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    // In a real application, we would send this to an API
    const newTask = {
      id: `task${Date.now()}`,
      title: values.title,
      description: values.description,
      skills: values.skills.split(',').map(s => s.trim()),
      amount: values.amount,
      lastDate: format(values.lastDate, 'yyyy-MM-dd'),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      status: 'open' as const,
      applicants: [],
    };
    
    // Add to mock tasks (in a real app, this would be an API call)
    mockTasks.push(newTask);
    
    // Notify parent component
    onTaskCreated();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Task</CardTitle>
        <CardDescription>
          Fill out the form below to create a new task. Tasks can have up to 5 applicants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Design a Website Homepage" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title that describes the task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed information about the task requirements, deliverables, etc." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description of the task, including what you expect from applicants
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Skills</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input placeholder="e.g., Web Development, Design, Writing" {...field} />
                      <div className="text-sm text-muted-foreground mt-2">
                        Popular skills:
                        <div className="flex flex-wrap gap-1 mt-1">
                          {allSkills.map(skill => (
                            <Button
                              key={skill}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                const currentSkills = field.value.split(',').map(s => s.trim()).filter(Boolean);
                                if (!currentSkills.includes(skill)) {
                                  const newValue = [...currentSkills, skill].join(', ');
                                  field.onChange(newValue);
                                }
                              }}
                            >
                              {skill}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of skills required for this task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The amount you're willing to pay for this task (₹100 - ₹10,000)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Last Date to Apply</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The deadline for applicants to apply for your task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-education-600 hover:bg-education-700"
            >
              Create Task
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TaskUpload;
