import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart as BarChartIcon, Calendar, Users, FileText, TrendingUp, 
  TrendingDown, Eye, Activity
} from 'lucide-react';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalResources: 0,
    totalBlogs: 0,
    totalShorts: 0,
    activeUsers: 0,
    taskApplications: 0,
    resourceDownloads: 0,
    blogViews: 0
  });
  
  const [activityData, setActivityData] = useState<any[]>([]);
  const [userActivityData, setUserActivityData] = useState<any[]>([]);
  
  useEffect(() => {
    const loadMockData = setTimeout(() => {
      setStats({
        totalTasks: 42,
        totalResources: 78,
        totalBlogs: 24,
        totalShorts: 16,
        activeUsers: 156,
        taskApplications: 87,
        resourceDownloads: 312,
        blogViews: 2348
      });
      
      const mockActivityData = [];
      const mockUserActivityData = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        mockActivityData.push({
          name: dayName,
          tasks: Math.floor(Math.random() * 10),
          resources: Math.floor(Math.random() * 15),
          blogs: Math.floor(Math.random() * 8),
          shorts: Math.floor(Math.random() * 5)
        });
        
        mockUserActivityData.push({
          name: dayName,
          activeUsers: 50 + Math.floor(Math.random() * 100),
          newUsers: Math.floor(Math.random() * 20)
        });
      }
      
      setActivityData(mockActivityData);
      setUserActivityData(mockUserActivityData);
    }, 800);
    
    return () => clearTimeout(loadMockData);
  }, []);
  
  const StatCard = ({ title, value, icon, trend, percent }: { 
    title: string, 
    value: number | string, 
    icon: React.ReactNode,
    trend?: 'up' | 'down',
    percent?: number
  }) => (
    <Card className="neomorphic-light border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-admin-muted">{title}</CardTitle>
        <div className="w-8 h-8 bg-admin-primary/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-admin-text">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {percent}% {trend === 'up' ? 'increase' : 'decrease'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Tasks" 
            value={stats.totalTasks} 
            icon={<Calendar className="h-4 w-4 text-admin-primary" />}
            trend="up"
            percent={12}
          />
          <StatCard 
            title="Total Resources" 
            value={stats.totalResources} 
            icon={<FileText className="h-4 w-4 text-admin-primary" />}
            trend="up"
            percent={8}
          />
          <StatCard 
            title="Total Blogs" 
            value={stats.totalBlogs} 
            icon={<FileText className="h-4 w-4 text-admin-primary" />}
            trend="up"
            percent={5}
          />
          <StatCard 
            title="Total Shorts" 
            value={stats.totalShorts} 
            icon={<FileText className="h-4 w-4 text-admin-primary" />}
            trend="down"
            percent={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Users" 
            value={stats.activeUsers} 
            icon={<Users className="h-4 w-4 text-admin-primary" />}
            trend="up"
            percent={15}
          />
          <StatCard 
            title="Task Applications" 
            value={stats.taskApplications} 
            icon={<Activity className="h-4 w-4 text-admin-primary" />}
            trend="up"
            percent={7}
          />
          <StatCard 
            title="Resource Downloads" 
            value={stats.resourceDownloads} 
            icon={<FileText className="h-4 w-4 text-admin-primary" />}
            trend="up"
            percent={22}
          />
          <StatCard 
            title="Blog Views" 
            value={stats.blogViews} 
            icon={<Eye className="h-4 w-4 text-admin-primary" />}
            trend="up"
            percent={18}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="neomorphic-light border-none">
            <CardHeader>
              <CardTitle>Content Activity (Last 7 Days)</CardTitle>
              <CardDescription>Overview of tasks, resources, blogs and shorts activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tasks" fill="#2563EB" name="Tasks" />
                    <Bar dataKey="resources" fill="#10B981" name="Resources" />
                    <Bar dataKey="blogs" fill="#6E59D9" name="Blogs" />
                    <Bar dataKey="shorts" fill="#F59E0B" name="Shorts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="neomorphic-light border-none">
            <CardHeader>
              <CardTitle>User Activity (Last 7 Days)</CardTitle>
              <CardDescription>Overview of active and new users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#2563EB" 
                      name="Active Users"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="newUsers" 
                      stroke="#10B981" 
                      name="New Users"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="neomorphic-light border-none">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-admin-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text">New user registered</p>
                  <p className="text-xs text-admin-muted">John Doe registered as a new student</p>
                  <p className="text-xs text-admin-muted mt-1">10 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text">New task created</p>
                  <p className="text-xs text-admin-muted">Math Problem Solutions task was created</p>
                  <p className="text-xs text-admin-muted mt-1">32 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text">New blog post published</p>
                  <p className="text-xs text-admin-muted">How to Ace Your Math Exams was published</p>
                  <p className="text-xs text-admin-muted mt-1">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <BarChart className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text">Resource downloaded</p>
                  <p className="text-xs text-admin-muted">Chemistry Cheat Sheet was downloaded 15 times</p>
                  <p className="text-xs text-admin-muted mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
