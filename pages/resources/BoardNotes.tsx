import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, Download, FileText, PlayCircle, FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/hooks/use-toast';

const BoardNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [materialsVisible, setMaterialsVisible] = useState<boolean>(false);
  
  const handleShowMaterials = () => {
    if (!selectedClass || !selectedBoard) {
      toast({
        title: "Selection Required",
        description: "Please select both class and board to view materials",
        variant: "destructive"
      });
      return;
    }
    
    setMaterialsVisible(true);
    toast({
      title: "Materials Loaded",
      description: `Showing ${selectedBoard} materials for Class ${selectedClass}`,
    });
  };
  
  const handleDownload = (materialType: string) => {
    toast({
      title: "Download Started",
      description: `${materialType} for ${selectedBoard} Class ${selectedClass} is downloading`,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Board Notes</h1>
          <p className="text-lg text-gray-600">
            Access high-quality notes for different boards: CBSE, ICSE, State Boards
          </p>
        </div>
        
        <div className="grid md:grid-cols-[350px_1fr] gap-8">
          <Card className="h-fit transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Select Your Criteria</CardTitle>
              <CardDescription>
                Choose your class and board to view relevant study materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">Class 6</SelectItem>
                    <SelectItem value="7">Class 7</SelectItem>
                    <SelectItem value="8">Class 8</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="board">Board</Label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger id="board">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                    <SelectItem value="State">State Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleShowMaterials} 
                className="w-full bg-education-600 hover:bg-education-700"
              >
                View Study Materials
              </Button>
            </CardFooter>
          </Card>
          
          {materialsVisible ? (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedBoard} Class {selectedClass} Study Materials
              </h2>
              
              <Tabs defaultValue="notes" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="pyqs">Previous Year Questions</TabsTrigger>
                  <TabsTrigger value="videos">Video Lectures</TabsTrigger>
                  <TabsTrigger value="practice">Practice Problems</TabsTrigger>
                </TabsList>
                
                <TabsContent value="notes" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Mathematics", "Science", "English", "Social Science"].map((subject) => (
                      <Card key={subject} className="hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{subject}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">
                            Comprehensive {subject} notes aligned with {selectedBoard} curriculum
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Book className="mr-1 h-4 w-4" />
                              <span>50 pages</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(`${subject} Notes`)}
                              className="text-education-700 border-education-200 hover:bg-education-50"
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pyqs" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Last 5 Years", "Last 10 Years", "Topic-wise"].map((category) => (
                      <Card key={category} className="hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{category} Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">
                            {category === "Topic-wise" 
                              ? "Questions organized by topics with solution approaches" 
                              : `${category.split(" ")[1]} years of previous questions with detailed solutions`}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <FileText className="mr-1 h-4 w-4" />
                              <span>{category === "Last 5 Years" ? "200" : category === "Last 10 Years" ? "400" : "350"} questions</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(`${category} PYQs`)}
                              className="text-education-700 border-education-200 hover:bg-education-50"
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="videos" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Mathematics", "Science", "English", "Social Science"].map((subject) => (
                      <Card key={subject} className="hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{subject} Video Lectures</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">
                            Expert video explanations of key concepts in {subject}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <PlayCircle className="mr-1 h-4 w-4" />
                              <span>{Math.floor(Math.random() * 10) + 20} videos</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(`${subject} Video Links`)}
                              className="text-education-700 border-education-200 hover:bg-education-50"
                            >
                              View Playlist
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="practice" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Basic", "Advanced", "Mixed", "Exam-style"].map((level) => (
                      <Card key={level} className="hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{level} Problems</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">
                            {level === "Basic" 
                              ? "Fundamental problems to build confidence" 
                              : level === "Advanced" 
                                ? "Challenging problems for deeper understanding"
                                : level === "Mixed"
                                  ? "Mixed difficulty problems across topics"
                                  : "Problems in the style of actual exams"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <FileQuestion className="mr-1 h-4 w-4" />
                              <span>{Math.floor(Math.random() * 100) + 100} problems</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(`${level} Practice Problems`)}
                              className="text-education-700 border-education-200 hover:bg-education-50"
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <Book className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Materials Selected</h3>
                <p className="text-gray-500">
                  Please select your class and board from the options on the left to view available study materials.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BoardNotes;
