
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const StudyPlanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [examType, setExamType] = useState<string>("");
  const [planType, setPlanType] = useState<string>("weekly");
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);
  
  const handleGeneratePlan = () => {
    if (!examType) {
      toast({
        title: "Selection Required",
        description: "Please select an exam type to generate a study plan",
        variant: "destructive"
      });
      return;
    }
    
    setPlanGenerated(true);
    toast({
      title: "Plan Generated",
      description: `Your ${planType} study plan for ${examType} has been created!`,
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Plan Downloaded",
      description: "Your study plan has been downloaded successfully!",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2 text-education-700"
          onClick={() => navigate('/resources')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Planner</h1>
          <p className="text-lg text-gray-600">
            Create customized study schedules for effective learning
          </p>
        </div>
        
        <div className="grid md:grid-cols-[350px_1fr] gap-8">
          <Card className="h-fit transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Create Your Plan</CardTitle>
              <CardDescription>
                Customize a study plan based on your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="exam-type">Exam Type</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger id="exam-type">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jee">JEE Main & Advanced</SelectItem>
                    <SelectItem value="neet">NEET</SelectItem>
                    <SelectItem value="gate">GATE</SelectItem>
                    <SelectItem value="upsc">UPSC</SelectItem>
                    <SelectItem value="cat">CAT</SelectItem>
                    <SelectItem value="board">Board Exams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Plan Duration</Label>
                <RadioGroup value={planType} onValueChange={setPlanType} defaultValue="weekly">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly Plan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly Plan</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGeneratePlan} 
                className="w-full bg-education-600 hover:bg-education-700"
              >
                Generate Study Plan
              </Button>
            </CardFooter>
          </Card>
          
          {planGenerated ? (
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{examType === "board" ? "Board Exams" : 
                              examType === "jee" ? "JEE Main & Advanced" : 
                              examType === "neet" ? "NEET" : 
                              examType === "gate" ? "GATE" : 
                              examType === "upsc" ? "UPSC" : "CAT"} Study Plan</CardTitle>
                  <Calendar className="h-5 w-5 text-education-600" />
                </div>
                <CardDescription>
                  {planType.charAt(0).toUpperCase() + planType.slice(1)} personalized study schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 my-2">
                  <h3 className="font-medium text-gray-800 mb-2">Plan Highlights:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-education-100 text-education-800 rounded-full p-1 mr-2 text-xs">•</span>
                      <span>Optimized study sessions based on topic difficulty</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-education-100 text-education-800 rounded-full p-1 mr-2 text-xs">•</span>
                      <span>Built-in revision periods for better retention</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-education-100 text-education-800 rounded-full p-1 mr-2 text-xs">•</span>
                      <span>Balanced schedule with breaks to prevent burnout</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-education-100 text-education-800 rounded-full p-1 mr-2 text-xs">•</span>
                      <span>Practice test timings aligned with exam patterns</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 p-3 text-sm font-medium">
                    {planType === "weekly" ? "This Week's Schedule" : "This Month's Schedule"}
                  </div>
                  <div className="p-3 space-y-2">
                    {planType === "weekly" ? (
                      <>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Monday</div>
                          <div className="text-sm">Physics: Mechanics, Mathematics: Calculus</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Tuesday</div>
                          <div className="text-sm">Chemistry: Organic Chemistry, Practice Problems</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Wednesday</div>
                          <div className="text-sm">Mathematics: Algebra, Physics: Revision</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Thursday</div>
                          <div className="text-sm">Chemistry: Inorganic Chemistry, Mock Test</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Friday</div>
                          <div className="text-sm">Physics: Electricity, Mathematics: Geometry</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Saturday</div>
                          <div className="text-sm">Full Mock Test, Revision of Weak Areas</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2">
                          <div className="font-medium">Sunday</div>
                          <div className="text-sm">Rest and Light Revision</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Week 1</div>
                          <div className="text-sm">Foundation topics and basic concepts</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Week 2</div>
                          <div className="text-sm">Advanced concepts and problem solving</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b">
                          <div className="font-medium">Week 3</div>
                          <div className="text-sm">Practice tests and revision</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 py-2">
                          <div className="font-medium">Week 4</div>
                          <div className="text-sm">Full-length mock tests and targeted revision</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleDownload} 
                  className="w-full flex items-center gap-2 bg-education-600 hover:bg-education-700"
                >
                  <Download className="h-4 w-4" />
                  Download Study Plan
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Study Plan Generated Yet</h3>
                <p className="text-gray-500">
                  Select your exam type and plan duration, then click "Generate Study Plan" to create your personalized study schedule.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudyPlanner;
