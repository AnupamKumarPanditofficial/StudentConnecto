import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task, TaskApplicant, TaskApplication } from '@/types/task';
import { getMyCreatedTasks, getMyAppliedTasks } from '@/data/mockTasks';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { currentUser } from '@/data/mockTasks';

const MyTasks = () => {
  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [appliedTasks, setAppliedTasks] = useState<Task[]>([]);
  const [userApplications, setUserApplications] = useState<TaskApplication[]>([]);

  useEffect(() => {
    const storedTasksStr = localStorage.getItem('tasks');
    if (storedTasksStr) {
      const allTasks = JSON.parse(storedTasksStr);
      const myCreated = allTasks.filter((task: Task) => task.createdBy === currentUser.id);
      setCreatedTasks(myCreated);
    } else {
      setCreatedTasks(getMyCreatedTasks());
    }
    
    const applicationsStr = localStorage.getItem('user_task_applications');
    if (applicationsStr) {
      const applications = JSON.parse(applicationsStr);
      const userApps = applications.filter((app: TaskApplication) => app.userId === currentUser.id);
      setUserApplications(userApps);
      
      const tasksFromApplications = userApps.map((app: TaskApplication) => app.task);
      setAppliedTasks(tasksFromApplications);
    } else {
      setAppliedTasks(getMyAppliedTasks());
    }
  }, []);

  const updateApplicantStatus = (taskId: string, applicantId: string, status: 'accepted' | 'rejected') => {
    const updatedTasks = createdTasks.map(task => {
      if (task.id === taskId) {
        const updatedApplicants = task.applicants.map(applicant => {
          if (applicant.id === applicantId) {
            return { ...applicant, status };
          }
          return applicant;
        });
        return { ...task, applicants: updatedApplicants };
      }
      return task;
    });
    
    setCreatedTasks(updatedTasks);
    
    const storedTasksStr = localStorage.getItem('tasks');
    if (storedTasksStr) {
      let allTasks = JSON.parse(storedTasksStr);
      allTasks = allTasks.map((task: Task) => {
        if (task.id === taskId) {
          const updatedApplicants = task.applicants.map(applicant => {
            if (applicant.id === applicantId) {
              return { ...applicant, status };
            }
            return applicant;
          });
          return { ...task, applicants: updatedApplicants };
        }
        return task;
      });
      
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      
      const applicationsStr = localStorage.getItem('user_task_applications');
      if (applicationsStr) {
        const applications = JSON.parse(applicationsStr);
        const updatedApplications = applications.map((app: TaskApplication) => {
          if (app.taskId === taskId && app.userId === applicantId.split('app')[1]) {
            return { ...app, status };
          }
          return app;
        });
        
        localStorage.setItem('user_task_applications', JSON.stringify(updatedApplications));
      }
    }
    
    toast({
      title: `Applicant ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
      description: `You have ${status === 'accepted' ? 'accepted' : 'rejected'} the applicant for "${
        createdTasks.find(t => t.id === taskId)?.title
      }"`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-success-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="created">Tasks I Created</TabsTrigger>
          <TabsTrigger value="applied">Tasks I Applied For</TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="space-y-6">
          {createdTasks.length === 0 ? (
            <Card className="text-center p-6">
              <p className="text-muted-foreground">You haven't created any tasks yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => document.querySelector('[value="upload"]')?.dispatchEvent(new MouseEvent('click'))}
              >
                Create Your First Task
              </Button>
            </Card>
          ) : (
            <>
              {createdTasks.map(task => (
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{task.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ₹{task.amount}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Due: {format(new Date(task.lastDate), 'MMM dd, yyyy')}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{task.applicants.length} of 5 applicants</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {task.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Applicants</h3>
                      {task.applicants.length === 0 ? (
                        <p className="text-sm text-gray-500">No applications yet</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Applied On</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {task.applicants.map(applicant => (
                              <TableRow key={applicant.id}>
                                <TableCell className="font-medium">{applicant.name}</TableCell>
                                <TableCell>{format(new Date(applicant.appliedAt), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                                <TableCell className="text-right">
                                  {applicant.status === 'pending' && (
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-8 bg-success-50 text-success-700 border-success-200 hover:bg-success-100"
                                        onClick={() => updateApplicantStatus(task.id, applicant.id, 'accepted')}
                                      >
                                        Accept
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                        onClick={() => updateApplicantStatus(task.id, applicant.id, 'rejected')}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="applied" className="space-y-6">
          {appliedTasks.length === 0 ? (
            <Card className="text-center p-6">
              <p className="text-muted-foreground">You haven't applied to any tasks yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => document.querySelector('[value="discover"]')?.dispatchEvent(new MouseEvent('click'))}
              >
                Discover Tasks
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appliedTasks.map(task => {
                const myApplication = task.applicants.find(app => app.userId === currentUser.id);
                
                return (
                  <Card key={task.id} className="transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{task.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>₹{task.amount}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-4 w-4" />
                        <span>Due: {format(new Date(task.lastDate), 'MMM dd, yyyy')}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{task.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Application Status</h4>
                        {myApplication && getStatusBadge(myApplication.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          Applied on: {myApplication && format(new Date(myApplication.appliedAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        {myApplication?.status === 'accepted' ? 'Application Accepted' : 
                         myApplication?.status === 'rejected' ? 'Application Rejected' : 'Application Pending'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;
