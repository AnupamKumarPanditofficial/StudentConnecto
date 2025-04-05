import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuthCheck } from '@/hooks/useAuthCheck';
import TutorApplicationForm from '@/components/tutors/TutorApplicationForm';
import { ChevronRight, BookOpen, Search, Filter } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { Input } from '@/components/ui/input';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface Tutor {
  id: string;
  name: string;
  image: string;
  subjects: string[];
  bio: string;
  rating: number;
  hourlyRate: number;
  availability: string[];
}

interface Application {
  id: string;
  tutor: Tutor;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
  message?: string;
}

const ApplicationPreview: React.FC<{
  application: Application;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({
  application,
  onSubmit,
  onCancel
}) => {
  return <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={application.tutor.image} alt={application.tutor.name} />
              <AvatarFallback>{application.tutor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{application.tutor.name}</h3>
              <div className="flex flex-wrap gap-1">
                {application.tutor.subjects.map(subject => <Badge key={subject} variant="secondary">{subject}</Badge>)}
              </div>
              <p className="text-sm text-gray-500">Applied on {application.date}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <h4 className="font-medium">Application Status</h4>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium
              ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : application.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </div>
            {application.message && <div className="mt-4">
                <h4 className="font-medium">Your Message</h4>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{application.message}</p>
              </div>}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onCancel}>Back</Button>
            {application.status === 'pending' && <Button variant="destructive" onClick={onSubmit}>Cancel Application</Button>}
          </div>
        </CardContent>
      </Card>
    </div>;
};

export function Tutors() {
  const [activeTab, setActiveTab] = useState("available");
  const [applications, setApplications] = useState<Application[]>([]);
  const [previewingApplication, setPreviewingApplication] = useState<Application | null>(null);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    subject: "",
    feeRange: "",
    pinCode: "",
    location: ""
  });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const { toast } = useToast();
  const { checkAuth } = useAuthCheck();
  const { user, isTutor } = useAuthState();

  const tutors: Tutor[] = [{
    id: "1",
    name: "Aisha Patel",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    subjects: ["Mathematics", "Physics"],
    bio: "PhD in Mathematics with 5 years of teaching experience",
    rating: 4.9,
    hourlyRate: 25,
    availability: ["Weekdays", "Evenings"]
  }, {
    id: "2",
    name: "David Chen",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    subjects: ["Chemistry", "Biology"],
    bio: "Medical student passionate about making science accessible",
    rating: 4.7,
    hourlyRate: 22,
    availability: ["Weekends", "Afternoons"]
  }, {
    id: "3",
    name: "Sophia Rodriguez",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    subjects: ["English Literature", "History"],
    bio: "Published author with a master's in Literature",
    rating: 4.8,
    hourlyRate: 23,
    availability: ["Mornings", "Weekends"]
  }];

  useEffect(() => {
    const savedApplications = localStorage.getItem('tutor_applications');
    if (savedApplications) {
      try {
        setApplications(JSON.parse(savedApplications));
      } catch (error) {
        console.error("Error loading saved applications:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem('tutor_applications', JSON.stringify(applications));
    }
  }, [applications]);

  const handleOpenApplicationForm = () => {
    checkAuth("apply as a tutor", () => {
      setIsApplicationFormOpen(true);
    });
  };

  const handleCloseApplicationForm = () => {
    setIsApplicationFormOpen(false);
  };

  const handleSubmitTutorApplication = (applicationData: Application) => {
    const alreadyAppliedAsTutor = applications.some(app => app.tutor.id === applicationData.tutor.id && app.tutor.name === applicationData.tutor.name);
    if (alreadyAppliedAsTutor) {
      toast({
        title: "Already Applied",
        description: "You have already applied to become a tutor",
        variant: "destructive"
      });
      return;
    }
    setApplications(prev => [...prev, applicationData]);
    toast({
      title: "Application Submitted",
      description: "Your tutor application has been sent for review"
    });
  };

  const handleApplyToTutor = (tutor: Tutor) => {
    const alreadyApplied = applications.some(app => app.tutor.id === tutor.id);
    if (alreadyApplied) {
      toast({
        title: "Already Applied",
        description: "You have already applied to this tutor",
        variant: "destructive"
      });
      return;
    }
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      tutor,
      status: 'pending',
      date: new Date().toLocaleDateString(),
      message: "I am interested in learning with you."
    };
    setApplications(prev => [...prev, newApplication]);
    toast({
      title: "Application Submitted",
      description: "Your application has been sent to the tutor"
    });
  };

  const handleViewApplication = (application: Application) => {
    setPreviewingApplication(application);
  };

  const handleSubmitApplication = () => {
    if (!previewingApplication) return;

    setApplications(prev => prev.filter(app => app.id !== previewingApplication.id));
    toast({
      title: "Application Cancelled",
      description: "Your application has been cancelled"
    });
    setPreviewingApplication(null);
  };

  const handleCancelApplication = () => {
    setPreviewingApplication(null);
  };

  useEffect(() => {
    let filtered = tutors;
    
    if (filterOptions.subject) {
      filtered = filtered.filter(tutor => 
        tutor.subjects.some(subject => 
          subject.toLowerCase().includes(filterOptions.subject.toLowerCase())
        )
      );
    }
    
    if (filterOptions.feeRange) {
      const [min, max] = filterOptions.feeRange.split('-').map(n => parseInt(n, 10));
      filtered = filtered.filter(tutor => 
        tutor.hourlyRate >= min && (max ? tutor.hourlyRate <= max : true)
      );
    }
    
    if (filterOptions.location) {
      filtered = filtered.filter(tutor => 
        tutor.availability.some(loc => 
          loc.toLowerCase().includes(filterOptions.location.toLowerCase())
        )
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(tutor => 
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.subjects.some(subject => 
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        tutor.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTutors(filtered);
    
    setIsFilterActive(
      Boolean(filterOptions.subject || filterOptions.feeRange || 
              filterOptions.pinCode || filterOptions.location || searchTerm)
    );
  }, [searchTerm, filterOptions, tutors]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilterOptions({
      subject: "",
      feeRange: "",
      pinCode: "",
      location: ""
    });
    setSearchTerm("");
  };

  return <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Find Tutors</h1>
          {!isTutor && <Button onClick={handleOpenApplicationForm} className="flex items-center gap-2 bg-education-600 hover:bg-education-700">
              <BookOpen className="h-5 w-5" />
              <span>Apply here for tutors.</span>
            </Button>}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Filter Tutors</h2>
              {isFilterActive && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Mathematics, Physics..."
                  value={filterOptions.subject}
                  onChange={(e) => handleFilterChange("subject", e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="feeRange" className="block text-sm font-medium mb-1">
                  Fee Range ($ per hour)
                </label>
                <select
                  id="feeRange"
                  className="w-full h-10 rounded-md border border-input px-3 py-2 bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={filterOptions.feeRange}
                  onChange={(e) => handleFilterChange("feeRange", e.target.value)}
                >
                  <option value="">Any Range</option>
                  <option value="0-20">$0-$20</option>
                  <option value="20-30">$20-$30</option>
                  <option value="30-40">$30-$40</option>
                  <option value="40-100">$40+</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="pinCode" className="block text-sm font-medium mb-1">
                  PIN Code
                </label>
                <Input
                  id="pinCode"
                  placeholder="Enter PIN code"
                  value={filterOptions.pinCode}
                  onChange={(e) => handleFilterChange("pinCode", e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Availability
                </label>
                <select
                  id="location"
                  className="w-full h-10 rounded-md border border-input px-3 py-2 bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={filterOptions.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                >
                  <option value="">Any Time</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Evenings">Evenings</option>
                  <option value="Mornings">Mornings</option>
                  <option value="Afternoons">Afternoons</option>
                </select>
              </div>
            </div>
            
            <div className="relative mt-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tutors by name, subject, or bio..."
                className="pr-10 transition-all duration-300 border-2 hover:border-purple-500 focus:border-purple-600 focus:ring-purple-300"
              />
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Search Help</h4>
                    <p className="text-sm text-muted-foreground">
                      Search for tutors based on your selected filters. Click the button or press Enter to search.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Tutors</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isFilterActive ? filteredTutors : tutors).map(tutor => <Card key={tutor.id} className="overflow-hidden">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9}>
                      <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover" />
                    </AspectRatio>
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium">
                      ⭐ {tutor.rating}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{tutor.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tutor.subjects.map(subject => <Badge key={subject} variant="outline">{subject}</Badge>)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{tutor.bio}</p>
                    <div className="flex justify-between items-center mt-4">
                      <p className="font-medium">${tutor.hourlyRate}/hr</p>
                      <Button size="sm" onClick={() => handleApplyToTutor(tutor)}>
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
              
              {isFilterActive && filteredTutors.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <Filter className="h-12 w-12 mx-auto mb-2" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No tutors found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={handleClearFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            {previewingApplication ? <ApplicationPreview application={previewingApplication} onSubmit={handleSubmitApplication} onCancel={handleCancelApplication} /> : applications.length > 0 ? <div className="space-y-4">
                {applications.map(application => <Card key={application.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img src={application.tutor.image} alt={application.tutor.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-medium">{application.tutor.name}</h3>
                            <p className="text-xs text-gray-600">{application.tutor.subjects.join(", ")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                            ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : application.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Applied on {application.date}</p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleViewApplication(application)}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>)}
              </div> : <div className="rounded-md border">
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-500">No applications yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    When you apply for tutors, they will appear here
                  </p>
                </div>
              </div>}
          </TabsContent>
        </Tabs>
      </div>

      <TutorApplicationForm isOpen={isApplicationFormOpen} onClose={handleCloseApplicationForm} onSubmit={handleSubmitTutorApplication} />
    </Layout>;
}

export default Tutors;
