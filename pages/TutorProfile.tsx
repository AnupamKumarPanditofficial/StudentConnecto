import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUserSync } from '@/services/authService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, GraduationCap, BookOpen, Users, Star, DollarSign, Award, Edit2, Save, Upload, Trash2 } from 'lucide-react';
import ProfileImageUploader from '@/components/common/ProfileImageUploader';
import { User } from '@/types/user';

interface TutorProfileData {
  name: string;
  email: string;
  bio: string;
  education: string;
  experience: string;
  hourlyRate: string;
  subjects: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  timeSlots: string[];
  certificates: {
    name: string;
    issuer: string;
    year: string;
  }[];
}

const TutorProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [tutorData, setTutorData] = useState<TutorProfileData>({
    name: '',
    email: '',
    bio: '',
    education: '',
    experience: '2+ years',
    hourlyRate: '500',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    timeSlots: ['4:00 PM - 6:00 PM', '7:00 PM - 9:00 PM'],
    certificates: [
      {
        name: 'Teaching Excellence',
        issuer: 'National Education Board',
        year: '2022'
      }
    ]
  });
  
  const [stats, setStats] = useState({
    studentsHelped: 24,
    sessionsCompleted: 67,
    averageRating: 4.8,
    totalEarnings: 32500
  });
  
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    issuer: '',
    year: ''
  });
  
  useEffect(() => {
    // Use getCurrentUserSync() instead of getCurrentUser()
    const user = getCurrentUserSync();
    
    if (user) {
      setTutorData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        education: user.education || '',
        experience: '2+ years',
        hourlyRate: '500',
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        timeSlots: ['4:00 PM - 6:00 PM', '7:00 PM - 9:00 PM'],
        certificates: [
          {
            name: 'Teaching Excellence',
            issuer: 'National Education Board',
            year: '2022'
          }
        ]
      });
    } else {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your tutor profile",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [navigate, toast]);
  
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your tutor profile has been updated successfully",
      });
    }, 1500);
  };
  
  const handleAddTimeSlot = () => {
    if (!newTimeSlot) return;
    
    setTutorData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newTimeSlot]
    }));
    
    setNewTimeSlot('');
  };
  
  const handleRemoveTimeSlot = (index: number) => {
    setTutorData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddCertificate = () => {
    if (!newCertificate.name || !newCertificate.issuer || !newCertificate.year) {
      toast({
        title: "Missing Information",
        description: "Please fill in all certificate fields",
        variant: "destructive"
      });
      return;
    }
    
    setTutorData(prev => ({
      ...prev,
      certificates: [...prev.certificates, newCertificate]
    }));
    
    setNewCertificate({
      name: '',
      issuer: '',
      year: ''
    });
  };
  
  const handleRemoveCertificate = (index: number) => {
    setTutorData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };
  
  const handleAvailabilityChange = (day: keyof typeof tutorData.availability) => {
    setTutorData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };
  
  const handleInputChange = (field: keyof TutorProfileData, value: string) => {
    setTutorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tutor Profile</h1>
            <p className="text-gray-600">Manage your tutor profile and availability</p>
          </div>
          
          <Button 
            variant={isEditing ? "default" : "outline"} 
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            disabled={isLoading}
            className={isEditing ? "bg-education-600 hover:bg-education-700" : ""}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : isEditing ? (
              <><Save className="mr-2 h-4 w-4" /> Save Profile</>
            ) : (
              <><Edit2 className="mr-2 h-4 w-4" /> Edit Profile</>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <ProfileImageUploader 
                      currentImage={getCurrentUserSync()?.profileImage} 
                      name={tutorData.name} 
                      size="lg"
                    />
                  </div>
                  
                  <h2 className="text-xl font-bold">{tutorData.name}</h2>
                  <p className="text-gray-600 text-sm">{tutorData.email}</p>
                  
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-education-50 text-education-700 border-education-200">
                      Verified Tutor
                    </Badge>
                  </div>
                  
                  <div className="w-full mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="text-gray-600">Rating</span>
                      </div>
                      <span className="font-medium">{stats.averageRating}/5.0</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-education-600" />
                        <span className="text-gray-600">Students</span>
                      </div>
                      <span className="font-medium">{stats.studentsHelped}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-education-600" />
                        <span className="text-gray-600">Sessions</span>
                      </div>
                      <span className="font-medium">{stats.sessionsCompleted}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-gray-600">Earnings</span>
                      </div>
                      <span className="font-medium">₹{stats.totalEarnings}</span>
                    </div>
                  </div>
                  
                  <div className="w-full mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-3">Subjects</h3>
                    <div className="flex flex-wrap gap-2">
                      {tutorData.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="bg-education-100 text-education-700 hover:bg-education-200">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hourly Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-education-700">₹{tutorData.hourlyRate}</div>
                  {isEditing && (
                    <div className="w-24">
                      <Input 
                        type="number" 
                        value={tutorData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        className="text-right"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Platform fee: 15% (₹{Math.round(parseInt(tutorData.hourlyRate) * 0.15)})
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <Award className="h-8 w-8 text-amber-500" />
                  <div>
                    <div className="font-medium">Top Rated Tutor</div>
                    <div className="text-sm text-gray-600">August 2023</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Award className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">10+ Sessions</div>
                    <div className="text-sm text-gray-600">July 2023</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal information and bio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={tutorData.name} 
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={tutorData.email} 
                          disabled={true}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={tutorData.bio} 
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tell students about yourself, your teaching style, and your expertise"
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Input 
                          id="education" 
                          value={tutorData.education} 
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          disabled={!isEditing}
                          placeholder="e.g., M.Sc. in Mathematics, Delhi University"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="experience">Teaching Experience</Label>
                        <Select 
                          disabled={!isEditing} 
                          value={tutorData.experience}
                          onValueChange={(value) => handleInputChange('experience', value)}
                        >
                          <SelectTrigger id="experience">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                            <SelectItem value="1-2 years">1-2 years</SelectItem>
                            <SelectItem value="2+ years">2+ years</SelectItem>
                            <SelectItem value="5+ years">5+ years</SelectItem>
                            <SelectItem value="10+ years">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Subjects</Label>
                      <div className="flex flex-wrap gap-2">
                        {tutorData.subjects.map((subject, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-education-100 text-education-700 hover:bg-education-200"
                          >
                            {subject}
                            {isEditing && (
                              <button 
                                className="ml-1 text-education-700 hover:text-education-900"
                                onClick={() => {
                                  setTutorData(prev => ({
                                    ...prev,
                                    subjects: prev.subjects.filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                        
                        {isEditing && (
                          <div className="flex items-center space-x-2">
                            <Select 
                              onValueChange={(value) => {
                                if (!tutorData.subjects.includes(value)) {
                                  setTutorData(prev => ({
                                    ...prev,
                                    subjects: [...prev.subjects, value]
                                  }));
                                }
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Add subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="History">History</SelectItem>
                                <SelectItem value="Geography">Geography</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="availability" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Availability</CardTitle>
                    <CardDescription>
                      Set your weekly availability for tutoring sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(tutorData.availability).map(([day, isAvailable]) => (
                        <div key={day} className="flex items-center justify-between py-2">
                          <div className="font-medium capitalize">{day}</div>
                          <Switch 
                            checked={isAvailable} 
                            onCheckedChange={() => handleAvailabilityChange(day as keyof typeof tutorData.availability)}
                            disabled={!isEditing}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Time Slots</CardTitle>
                    <CardDescription>
                      Add specific time slots when you're available to teach
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tutorData.timeSlots.length > 0 ? (
                        <div className="space-y-2">
                          {tutorData.timeSlots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-education-600 mr-2" />
                                <span>{slot}</span>
                              </div>
                              {isEditing && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveTimeSlot(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No time slots added yet
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="flex items-end gap-2 pt-4 border-t border-gray-100">
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="new-time-slot">Add New Time Slot</Label>
                            <Input 
                              id="new-time-slot" 
                              placeholder="e.g., 4:00 PM - 6:00 PM" 
                              value={newTimeSlot}
                              onChange={(e) => setNewTimeSlot(e.target.value)}
                            />
                          </div>
                          <Button 
                            onClick={handleAddTimeSlot}
                            disabled={!newTimeSlot}
                            className="bg-education-600 hover:bg-education-700"
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certificates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Certificates & Qualifications</CardTitle>
                    <CardDescription>
                      Add your teaching certificates and qualifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {tutorData.certificates.length > 0 ? (
                        <div className="space-y-4">
                          {tutorData.certificates.map((cert, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">{cert.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {cert.issuer} • {cert.year}
                                  </p>
                                </div>
                                {isEditing && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleRemoveCertificate(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No certificates added yet
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="pt-6 border-t border-gray-100">
                          <h3 className="font-medium mb-4">Add New Certificate</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cert-name">Certificate Name</Label>
                              <Input 
                                id="cert-name" 
                                placeholder="e.g., Teaching Excellence" 
                                value={newCertificate.name}
                                onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="cert-issuer">Issuing Organization</Label>
                              <Input 
                                id="cert-issuer" 
                                placeholder="e.g., National Education Board" 
                                value={newCertificate.issuer}
                                onChange={(e) => setNewCertificate({...newCertificate, issuer: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="cert-year">Year</Label>
                              <Input 
                                id="cert-year" 
                                placeholder="e.g., 2022" 
                                value={newCertificate.year}
                                onChange={(e) => setNewCertificate({...newCertificate, year: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleAddCertificate}
                            className="mt-4 bg-education-600 hover:bg-education-700"
                          >
                            Add Certificate
                          </Button>
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="pt-6 border-t border-gray-100">
                          <h3 className="font-medium mb-4">Upload Certificate</h3>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Drag and drop your certificate file here, or click to browse
                            </p>
                            <Button variant="outline" size="sm">
                              Browse Files
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                              Supported formats: PDF, JPG, PNG (Max 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TutorProfile;
