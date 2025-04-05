
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import TaskDiscovery from '@/components/tasks/TaskDiscovery';
import TaskUpload from '@/components/tasks/TaskUpload';
import MyTasks from '@/components/tasks/MyTasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, ListChecks } from 'lucide-react';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Zone</h1>
          <p className="text-lg text-gray-600">
            Find, apply, track, and upload tasks based on your skills
          </p>
        </div>
        
        <Tabs defaultValue="discover" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Discover Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Upload Task</span>
            </TabsTrigger>
            <TabsTrigger value="mytasks" className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              <span>My Tasks</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="mt-6">
            <TaskDiscovery />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6">
            <TaskUpload 
              onTaskCreated={() => {
                toast({
                  title: "Task Created Successfully",
                  description: "Your task has been published and is now visible to others",
                });
                setActiveTab("mytasks");
              }}
            />
          </TabsContent>
          
          <TabsContent value="mytasks" className="mt-6">
            <MyTasks />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Tasks;
