
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { isTutor } from '@/services/authService';
import { Bell, Book, Briefcase, Clock, MapPin, GraduationCap, Calendar, CheckCircle, X, User } from 'lucide-react';

interface StudentApplication {
  id: string;
  studentName: string;
  studentImage: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface TutorJob {
  id: string;
  title: string;
  location: string;
  subjects: string[];
  payRange: string;
  postedDate: string;
  deadline: string;
  status: 'open' | 'closed';
}

const mockStudentApplications: StudentApplication[] = [
  {
    id: '1',
    studentName: 'Amit Sharma',
    studentImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    subject: 'Mathematics',
    message: 'I need help with advanced calculus for my upcoming exams.',
    date: '2023-10-15',
    status: 'pending'
  },
  {
    id: '2',
    studentName: 'Priya Singh',
    studentImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    subject: 'Physics',
    message: 'Looking for regular tutoring sessions for mechanics and waves.',
    date: '2023-10-12',
    status: 'accepted'
  },
  {
    id: '3',
    studentName: 'Rahul Mehta',
    studentImage: 'https://randomuser.me/api/portraits/men/62.jpg',
    subject: 'Chemistry',
    message: 'Need help with organic chemistry concepts.',
    date: '2023-10-10',
    status: 'rejected'
  }
];

const mockTutorJobs: TutorJob[] = [
  {
    id: '1',
    title: 'Mathematics Tutor for Class 10',
    location: 'Delhi',
    subjects: ['Mathematics'],
    payRange: '₹500-₹800 per hour',
    postedDate: '2023-10-01',
    deadline: '2023-10-30',
    status: 'open'
  },
  {
    id: '2',
    title: 'Science Tutor for Class 8',
    location: 'Mumbai',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    payRange: '₹400-₹600 per hour',
    postedDate: '2023-10-05',
    deadline: '2023-10-25',
    status: 'open'
  },
  {
    id: '3',
    title: 'English Literature Tutor',
    location: 'Bangalore',
    subjects: ['English'],
    payRange: '₹450-₹700 per hour',
    postedDate: '2023-09-28',
    deadline: '2023-10-20',
    status: 'closed'
  }
];

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'English', 'Hindi', 'Social Studies', 'Computer Science',
  'Economics', 'Business Studies', 'Accountancy', 'History',
  'Geography', 'Political Science', 'Psychology', 'Sociology'
];

const TutoringPage = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [studentApplications, setStudentApplications] = useState<StudentApplication[]>(mockStudentApplications);
  const [tutorJobs, setTutorJobs] = useState<TutorJob[]>(mockTutorJobs);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    pinCode: '',
    subjects: [] as string[],
    experience: '',
    highestEducation: '',
    state: '',
    country: '',
    district: '',
    additionalInfo: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { quickAuthCheck } = useAuthCheck();

  useEffect(() => {
    // Check if the user is a tutor, if not redirect to home
    if (!isTutor()) {
      toast({
        title: "Access Denied",
        description: "Only tutors can access this page",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [navigate, toast]);

  const handleApplicationAction = (id: string, action: 'accept' | 'reject') => {
    setStudentApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === id ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' } : app
      )
    );
    
    toast({
      title: action === 'accept' ? "Application Accepted" : "Application Rejected",
      description: action === 'accept' 
        ? "You've accepted this student's request. You can now chat with them."
        : "You've rejected this student's request.",
    });
  };

  const handleApplyForJob = (id: string) => {
    if (!quickAuthCheck('apply for this job')) return;
    
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully!",
    });
    
    // Add to my applications in a real app
    setMyApplications(prev => [...prev, {
      id: Date.now().toString(),
      jobId: id,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    }]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject: string) => {
    setFormData(prev => {
      const subjects = [...prev.subjects];
      if (subjects.includes(subject)) {
        return { ...prev, subjects: subjects.filter(s => s !== subject) };
      } else {
        return { ...prev, subjects: [...subjects, subject] };
      }
    });
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subjects.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one subject",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Profile Submitted",
      description: "Your tutor profile has been submitted successfully!",
    });
    
    // Reset form in a real app or redirect
    console.log("Submitted tutor profile:", formData);
  };

  const NotificationsCard = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <Bell className="h-5 w-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studentApplications.filter(app => app.status === 'pending').length > 0 ? (
            studentApplications
              .filter(app => app.status === 'pending')
              .map(app => (
                <div key={app.id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={app.studentImage} alt={app.studentName} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{app.studentName} requested tutoring for {app.subject}</p>
                    <p className="text-xs text-gray-600 mt-1">{app.date}</p>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No new notifications</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const StudentApplicationsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Student Applications</h2>
      
      {studentApplications.length > 0 ? (
        <div className="grid gap-4">
          {studentApplications.map(app => (
            <Card key={app.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <img src={app.studentImage} alt={app.studentName} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.studentName}</h3>
                      <p className="text-sm text-gray-600">Subject: {app.subject}</p>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2
                        ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{app.date}</p>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{app.message}</p>
                </div>
                
                {app.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={() => handleApplicationAction(app.id, 'accept')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleApplicationAction(app.id, 'reject')}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
                
                {app.status === 'accepted' && (
                  <div className="flex justify-end mt-4">
                    <Button className="bg-education-600 hover:bg-education-700">
                      Chat with Student
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Applications Yet</h3>
            <p className="text-gray-500 mt-2">
              You haven't received any student applications yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const TutorJobsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Available Tutoring Jobs</h2>
      
      <div className="grid gap-4">
        {tutorJobs
          .filter(job => job.status === 'open')
          .map(job => (
            <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-education-700">{job.payRange}</p>
                    <p className="text-xs text-gray-600">Posted on {job.postedDate}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {job.subjects.map(subject => (
                    <span key={subject} className="inline-block px-2 py-1 rounded-full bg-education-100 text-education-700 text-xs">
                      {subject}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar size={14} className="mr-1" />
                    <span>Application Deadline: {job.deadline}</span>
                  </div>
                  <Button 
                    onClick={() => handleApplyForJob(job.id)}
                    className="bg-education-600 hover:bg-education-700"
                    size="sm"
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  const MyApplicationsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">My Applications</h2>
      
      {myApplications.length > 0 ? (
        <div className="grid gap-4">
          {myApplications.map(app => {
            const job = tutorJobs.find(j => j.id === app.jobId);
            if (!job) return null;
            
            return (
              <Card key={app.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.location}</p>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2
                        ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{job.payRange}</p>
                      <p className="text-xs text-gray-600">Applied on {app.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Applications Yet</h3>
            <p className="text-gray-500 mt-2">
              You haven't applied to any tutoring jobs yet.
            </p>
            <Button 
              className="mt-6 bg-education-600 hover:bg-education-700"
              onClick={() => setActiveTab('jobs')}
            >
              Browse Available Jobs
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const CreateProfileTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Create Your Tutor Profile</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal & Professional Details</CardTitle>
          <CardDescription>
            Fill out your details to create your tutor profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Your full name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="highestEducation">Highest Education</Label>
                <Select
                  onValueChange={(value) => setFormData(prev => ({ ...prev, highestEducation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your highest qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleInputChange} 
                  placeholder="Country" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleInputChange} 
                  placeholder="State" 
                  required 
                />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input 
                  id="district" 
                  name="district" 
                  value={formData.district} 
                  onChange={handleInputChange} 
                  placeholder="District" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location/Area</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  placeholder="Your specific area" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pinCode">Pin Code</Label>
                <Input 
                  id="pinCode" 
                  name="pinCode" 
                  value={formData.pinCode} 
                  onChange={handleInputChange} 
                  placeholder="PIN Code" 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (in years)</Label>
              <Input 
                id="experience" 
                name="experience" 
                value={formData.experience} 
                onChange={handleInputChange} 
                placeholder="Years of teaching experience" 
                required 
                type="number"
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subjects You Can Teach</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {subjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox 
                      id={subject.toLowerCase().replace(/\s/g, '-')}
                      checked={formData.subjects.includes(subject)}
                      onCheckedChange={() => handleSubjectChange(subject)}
                    />
                    <Label
                      htmlFor={subject.toLowerCase().replace(/\s/g, '-')}
                      className="text-sm cursor-pointer"
                    >
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea 
                id="additionalInfo" 
                name="additionalInfo" 
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Tell us more about your teaching style, approach, achievements, etc."
                rows={4}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-education-600 hover:bg-education-700"
            >
              Create Tutor Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutoring Dashboard</h1>
          <p className="text-lg text-gray-600">
            Manage your tutoring activities, applications, and profile
          </p>
        </div>
        
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-6">
            <NotificationsCard />
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-education-50 rounded-lg">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-education-600 mr-2" />
                      <span className="font-medium">Students</span>
                    </div>
                    <span className="font-semibold">{studentApplications.filter(a => a.status === 'accepted').length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Applications</span>
                    </div>
                    <span className="font-semibold">{myApplications.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Subjects</span>
                    </div>
                    <span className="font-semibold">{formData.subjects.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium">Hours Taught</span>
                    </div>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="applications">Student Applications</TabsTrigger>
                <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
                <TabsTrigger value="myapplications">My Applications</TabsTrigger>
                <TabsTrigger value="profile">Create Profile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="applications">
                <StudentApplicationsTab />
              </TabsContent>
              
              <TabsContent value="jobs">
                <TutorJobsTab />
              </TabsContent>
              
              <TabsContent value="myapplications">
                <MyApplicationsTab />
              </TabsContent>
              
              <TabsContent value="profile">
                <CreateProfileTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TutoringPage;
