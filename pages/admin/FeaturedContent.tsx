
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { 
  Check,
  X,
  Plus,
  Star, 
  Award,
  Calendar,
  Search,
  UserX,
  Edit,
  Trash2,
  Eye,
  Save,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data and types
interface Tutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  image: string;
  featured: boolean;
}

interface Student {
  id: string;
  name: string;
  skills: string;
  earned: number;
  image: string;
  featured: boolean;
}

interface Event {
  id: string;
  name: string;
  date: string;
  image: string;
  featured: boolean;
}

const mockTutors: Tutor[] = [
  { id: "t1", name: "Dr. Sarah Johnson", subject: "Physics", rating: 4.9, image: "https://randomuser.me/api/portraits/women/32.jpg", featured: true },
  { id: "t2", name: "Prof. Michael Chen", subject: "Mathematics", rating: 4.8, image: "https://randomuser.me/api/portraits/men/45.jpg", featured: true },
  { id: "t3", name: "Dr. Emily Rodriguez", subject: "Chemistry", rating: 4.7, image: "https://randomuser.me/api/portraits/women/68.jpg", featured: true },
  { id: "t4", name: "Prof. David Kim", subject: "Computer Science", rating: 4.9, image: "https://randomuser.me/api/portraits/men/22.jpg", featured: true },
  { id: "t5", name: "Dr. Nina Patel", subject: "Biology", rating: 4.5, image: "https://randomuser.me/api/portraits/women/65.jpg", featured: false },
  { id: "t6", name: "Prof. James Wilson", subject: "Literature", rating: 4.6, image: "https://randomuser.me/api/portraits/men/33.jpg", featured: false },
  { id: "t7", name: "Dr. Lisa Wong", subject: "Economics", rating: 4.8, image: "https://randomuser.me/api/portraits/women/29.jpg", featured: false }
];

const mockStudents: Student[] = [
  { id: "s1", name: "Aarav Patel", skills: "Python, Data Science", earned: 12500, image: "https://randomuser.me/api/portraits/men/75.jpg", featured: true },
  { id: "s2", name: "Zara Khan", skills: "Web Development, UI/UX", earned: 15000, image: "https://randomuser.me/api/portraits/women/90.jpg", featured: true },
  { id: "s3", name: "Rohan Singh", skills: "Mobile App Development", earned: 18000, image: "https://randomuser.me/api/portraits/men/32.jpg", featured: true },
  { id: "s4", name: "Ananya Sharma", skills: "Content Writing, SEO", earned: 14000, image: "https://randomuser.me/api/portraits/women/45.jpg", featured: true },
  { id: "s5", name: "Vikram Malhotra", skills: "Blockchain, Smart Contracts", earned: 16500, image: "https://randomuser.me/api/portraits/men/62.jpg", featured: false },
  { id: "s6", name: "Priya Desai", skills: "Graphic Design, Animation", earned: 13000, image: "https://randomuser.me/api/portraits/women/55.jpg", featured: false }
];

const mockEvents: Event[] = [
  { id: "e1", name: "National Science Olympiad", date: "November 15, 2023", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952", featured: true },
  { id: "e2", name: "Coding Hackathon 2023", date: "December 5, 2023", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b", featured: true },
  { id: "e3", name: "Career Expo 2023", date: "January 10, 2024", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87", featured: true },
  { id: "e4", name: "Education Technology Summit", date: "February 20, 2024", image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b", featured: true },
  { id: "e5", name: "College Admissions Workshop", date: "March 15, 2024", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1", featured: false },
  { id: "e6", name: "Summer Internship Fair", date: "April 8, 2024", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644", featured: false }
];

const FeaturedContent = () => {
  const [tutors, setTutors] = useState<Tutor[]>(mockTutors);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [loading, setLoading] = useState({
    tutors: false,
    students: false,
    events: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filterData = (data: any[]) => {
    if (!searchTerm.trim()) return data;
    
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subject && item.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.skills && item.skills.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleToggleFeature = (id: string, type: 'tutors' | 'students' | 'events') => {
    setLoading(prev => ({ ...prev, [type]: true }));
    
    setTimeout(() => {
      if (type === 'tutors') {
        setTutors(prev => prev.map(tutor => 
          tutor.id === id ? { ...tutor, featured: !tutor.featured } : tutor
        ));
      } else if (type === 'students') {
        setStudents(prev => prev.map(student => 
          student.id === id ? { ...student, featured: !student.featured } : student
        ));
      } else {
        setEvents(prev => prev.map(event => 
          event.id === id ? { ...event, featured: !event.featured } : event
        ));
      }
      
      setLoading(prev => ({ ...prev, [type]: false }));
      toast.success(`Featured status updated successfully`);
    }, 500);
  };

  const saveChanges = (type: 'tutors' | 'students' | 'events') => {
    setLoading(prev => ({ ...prev, [type]: true }));
    
    // In a real application, this would send data to a server
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [type]: false }));
      toast.success(`Featured ${type} saved successfully`);
    }, 800);
  };
  
  const refreshList = (type: 'tutors' | 'students' | 'events') => {
    setLoading(prev => ({ ...prev, [type]: true }));
    
    // In a real application, this would fetch fresh data from a server
    setTimeout(() => {
      if (type === 'tutors') {
        setTutors([...mockTutors]);
      } else if (type === 'students') {
        setStudents([...mockStudents]);
      } else {
        setEvents([...mockEvents]);
      }
      setLoading(prev => ({ ...prev, [type]: false }));
      toast.success(`${type} refreshed successfully`);
    }, 800);
  };

  return (
    <AdminLayout title="Featured Content Management">
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800">Featured Content Management</h2>
        <p className="text-gray-600">
          Manage what appears in the homepage carousel. Select up to 4 items to be featured in each category.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search by name, subject, or skills..." 
            className="pl-10" 
            value={searchTerm} 
            onChange={handleSearch}
          />
        </div>
      </div>

      <Tabs defaultValue="tutors" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="tutors">Top Tutors</TabsTrigger>
          <TabsTrigger value="students">Top Students</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>

        {/* Tutors Tab */}
        <TabsContent value="tutors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Top Tutors Management</CardTitle>
                <CardDescription>
                  Manage tutors that appear on the homepage carousel
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refreshList('tutors')}
                  disabled={loading.tutors}
                >
                  {loading.tutors ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => saveChanges('tutors')}
                  disabled={loading.tutors}
                >
                  {loading.tutors ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Featured</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterData(tutors).map((tutor) => (
                    <TableRow key={tutor.id}>
                      <TableCell>
                        <Button 
                          variant={tutor.featured ? "default" : "outline"} 
                          size="sm" 
                          className={`w-20 ${tutor.featured ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          onClick={() => handleToggleFeature(tutor.id, 'tutors')}
                        >
                          {tutor.featured ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Yes
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              No
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={tutor.image} />
                            <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{tutor.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{tutor.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{tutor.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-gray-500">
                Showing {filterData(tutors).length} of {tutors.length} tutors
              </p>
              <p className="text-sm text-gray-500">
                {tutors.filter(t => t.featured).length} tutors featured
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Top Students Management</CardTitle>
                <CardDescription>
                  Manage students that appear on the homepage carousel
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refreshList('students')}
                  disabled={loading.students}
                >
                  {loading.students ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => saveChanges('students')}
                  disabled={loading.students}
                >
                  {loading.students ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Featured</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterData(students).map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Button 
                          variant={student.featured ? "default" : "outline"} 
                          size="sm" 
                          className={`w-20 ${student.featured ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          onClick={() => handleToggleFeature(student.id, 'students')}
                        >
                          {student.featured ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Yes
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              No
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.image} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.skills}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-green-500 mr-1" />
                          <span>₹{student.earned}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-gray-500">
                Showing {filterData(students).length} of {students.length} students
              </p>
              <p className="text-sm text-gray-500">
                {students.filter(s => s.featured).length} students featured
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Upcoming Events Management</CardTitle>
                <CardDescription>
                  Manage events that appear on the homepage carousel
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refreshList('events')}
                  disabled={loading.events}
                >
                  {loading.events ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => saveChanges('events')}
                  disabled={loading.events}
                >
                  {loading.events ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Featured</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterData(events).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Button 
                          variant={event.featured ? "default" : "outline"} 
                          size="sm" 
                          className={`w-20 ${event.featured ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          onClick={() => handleToggleFeature(event.id, 'events')}
                        >
                          {event.featured ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Yes
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              No
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img 
                              src={event.image} 
                              alt={event.name}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-medium">{event.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-education-600 mr-1" />
                          <span>{event.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-gray-500">
                Showing {filterData(events).length} of {events.length} events
              </p>
              <p className="text-sm text-gray-500">
                {events.filter(e => e.featured).length} events featured
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default FeaturedContent;
