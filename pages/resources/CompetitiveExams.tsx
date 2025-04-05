
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, Download, FileText, PlayCircle, File, Award, BookOpen, BookMarked, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ExamMaterial {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

const CompetitiveExams = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const materialsRef = useRef<HTMLDivElement>(null);
  
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  
  const examsList = [
    { id: "jee", name: "JEE (Main & Advanced)", description: "Engineering entrance examination" },
    { id: "neet", name: "NEET", description: "Medical entrance examination" },
    { id: "gate", name: "GATE", description: "Graduate Aptitude Test in Engineering" },
    { id: "cat", name: "CAT", description: "Common Admission Test for MBA" },
    { id: "upsc", name: "UPSC", description: "Civil Services Examination" },
    { id: "gre", name: "GRE", description: "Graduate Record Examination" },
  ];
  
  const examMaterials: ExamMaterial[] = [
    { 
      id: "notes", 
      title: "Comprehensive Notes", 
      description: "Detailed subject-wise notes for quick revision",
      icon: <Book className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    { 
      id: "syllabus", 
      title: "Latest Syllabus", 
      description: "Up-to-date syllabus with topic weightage",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    { 
      id: "lectures", 
      title: "AI-curated Lecture Playlist", 
      description: "Personalized video lectures from top educators",
      icon: <PlayCircle className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    { 
      id: "pyqs", 
      title: "Previous Year Questions", 
      description: "Last 10 years' papers with detailed solutions",
      icon: <File className="h-6 w-6" />,
      color: "bg-green-50 text-green-600 border-green-100",
    },
    { 
      id: "mocks", 
      title: "Mock Tests", 
      description: "Full-length practice tests with analysis",
      icon: <Award className="h-6 w-6" />,
      color: "bg-red-50 text-red-600 border-red-100",
    },
    { 
      id: "resources", 
      title: "Free Resources", 
      description: "Formulas, flashcards, and quick reference guides",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    { 
      id: "crash", 
      title: "Crash Course", 
      description: "Accelerated learning for last-minute preparation",
      icon: <BookMarked className="h-6 w-6" />,
      color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    },
    { 
      id: "revision", 
      title: "Revision Videos", 
      description: "Quick topic revisions for the day before exam",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-pink-50 text-pink-600 border-pink-100",
    },
  ];
  
  const handleExamSelect = (examId: string) => {
    setSelectedExam(examId);
    
    setTimeout(() => {
      if (materialsRef.current) {
        materialsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    toast({
      title: "Exam Selected",
      description: `Showing materials for ${examsList.find(exam => exam.id === examId)?.name}`,
    });
  };
  
  const handleMaterialAction = (materialId: string, action: string) => {
    toast({
      title: action === "download" ? "Download Started" : "Viewing Content",
      description: `${action === "download" ? "Downloading" : "Opening"} ${examMaterials.find(material => material.id === materialId)?.title} for ${examsList.find(exam => exam.id === selectedExam)?.name}`,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitive Exam Materials</h1>
          <p className="text-lg text-gray-600">
            Preparation materials for JEE, NEET, UPSC, CAT and more
          </p>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Select an Exam</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {examsList.map((exam) => (
              <Card 
                key={exam.id} 
                className={`transition-all hover:shadow-lg cursor-pointer ${selectedExam === exam.id ? 'ring-2 ring-education-500 ring-offset-2' : ''}`}
                onClick={() => handleExamSelect(exam.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{exam.name}</CardTitle>
                  <CardDescription>{exam.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {exam.id === "jee" && "Physics, Chemistry, Mathematics"}
                    {exam.id === "neet" && "Physics, Chemistry, Biology"}
                    {exam.id === "gate" && "Subject-specific & General Aptitude"}
                    {exam.id === "cat" && "Verbal, Data Interpretation, Quantitative"}
                    {exam.id === "upsc" && "GS, CSAT, Optional Subjects"}
                    {exam.id === "gre" && "Verbal, Quantitative, Analytical Writing"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${selectedExam === exam.id ? 'bg-education-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {selectedExam === exam.id ? 'Selected' : 'View Materials'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {selectedExam && (
          <div ref={materialsRef} className="mt-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                {examsList.find(exam => exam.id === selectedExam)?.name} Materials
              </h2>
              <p className="text-gray-600">
                Comprehensive resources to help you excel in your {examsList.find(exam => exam.id === selectedExam)?.name} preparation
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {examMaterials.map((material) => (
                <HoverCard key={material.id}>
                  <HoverCardTrigger asChild>
                    <Card className={`transition-all hover:shadow-md hover:scale-105 cursor-pointer border ${material.color.split(' ')[2]}`}>
                      <CardHeader className={`pb-0 ${material.color.split(' ')[0]}`}>
                        <div className="flex justify-between items-start">
                          <div className={`p-2 rounded-full ${material.color}`}>
                            {material.icon}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleMaterialAction(material.id, "download")}>
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMaterialAction(material.id, "view")}>
                                View Online
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <h3 className={`font-semibold mb-1 ${material.color.split(' ')[1]}`}>{material.title}</h3>
                        <p className="text-sm text-gray-600">{material.description}</p>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-0 overflow-hidden">
                    <div className={`p-4 ${material.color.split(' ')[0]}`}>
                      <h3 className="font-semibold flex items-center gap-2 mb-2">
                        {material.icon}
                        {material.title}
                      </h3>
                      <p className="text-sm">{material.description}</p>
                    </div>
                    <div className="p-4">
                      <div className="text-sm space-y-2">
                        <p className="font-medium">This resource includes:</p>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                          <li>Complete coverage of the syllabus</li>
                          <li>Expert-created content</li>
                          <li>Regular updates with latest patterns</li>
                          <li>Available in downloadable format</li>
                        </ul>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleMaterialAction(material.id, "view")}>
                          View Online
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleMaterialAction(material.id, "download")}>
                          Download
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CompetitiveExams;
