
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, BookOpen, Calendar, Award, FileText, BookMarked, Bookmark, PenTool, Brain, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the resource categories with their details
const resourceCategories = [
  {
    id: 'board-notes',
    title: 'Board Notes',
    description: 'Access high-quality notes for different boards: CBSE, ICSE, State Boards',
    icon: <Book className="h-6 w-6 text-blue-500" />,
    color: 'from-blue-50 to-blue-100 border-blue-200',
    textColor: 'text-blue-700',
    hoverColor: 'hover:bg-blue-50',
  },
  {
    id: 'competitive-exams',
    title: 'Competitive Exam Materials',
    description: 'Preparation materials for JEE, NEET, UPSC, CAT and more',
    icon: <BookOpen className="h-6 w-6 text-purple-500" />,
    color: 'from-purple-50 to-purple-100 border-purple-200',
    textColor: 'text-purple-700',
    hoverColor: 'hover:bg-purple-50',
  },
  {
    id: 'soft-skills',
    title: 'Soft Skills Training',
    description: 'Enhance communication, leadership, time management, and more',
    icon: <PenTool className="h-6 w-6 text-green-500" />,
    color: 'from-green-50 to-green-100 border-green-200',
    textColor: 'text-green-700',
    hoverColor: 'hover:bg-green-50',
  },
  {
    id: 'study-planner',
    title: 'Study Planner',
    description: 'Create customized study schedules for effective learning',
    icon: <Calendar className="h-6 w-6 text-amber-500" />,
    color: 'from-amber-50 to-amber-100 border-amber-200',
    textColor: 'text-amber-700',
    hoverColor: 'hover:bg-amber-50',
  }
];

// Secondary resources for additional options
const secondaryResources = [
  {
    id: 'past-papers',
    title: 'Past Papers',
    description: "Practice with previous years' question papers",
    icon: <FileText className="h-5 w-5 text-indigo-500" />,
  },
  {
    id: 'subject-guides',
    title: 'Subject Guides',
    description: 'In-depth guides for different subjects',
    icon: <BookMarked className="h-5 w-5 text-pink-500" />,
  },
  {
    id: 'career-guidance',
    title: 'Career Guidance',
    description: 'Get insights on various career paths',
    icon: <GraduationCap className="h-5 w-5 text-cyan-500" />,
  },
  {
    id: 'test-series',
    title: 'Test Series',
    description: 'Regular assessments to track progress',
    icon: <Award className="h-5 w-5 text-orange-500" />,
  },
];

const ResourceCard = ({ resource }: { resource: typeof resourceCategories[0] }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group border bg-gradient-to-br ${resource.color}`}
    >
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] opacity-60 z-0"></div>
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
            {resource.icon}
          </div>
          <Button variant="ghost" size="sm" className={`${resource.textColor} ${resource.hoverColor}`}>
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className={`mt-4 ${resource.textColor}`}>{resource.title}</CardTitle>
        <CardDescription className="text-gray-600">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-2 mt-2">
          <div className="text-sm text-gray-600">
            {resource.id === 'board-notes' && (
              <p>Available for Class 6-12 across all subjects</p>
            )}
            {resource.id === 'competitive-exams' && (
              <p>Updated material with mock tests & practice sets</p>
            )}
            {resource.id === 'soft-skills' && (
              <p>Video lectures, worksheets, and interactive exercises</p>
            )}
            {resource.id === 'study-planner' && (
              <p>Customizable templates for daily/weekly planning</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10">
        <Button 
          className={`w-full group-hover:bg-white ${resource.textColor} border border-current hover:bg-opacity-90 transition-all`}
          variant="outline"
          onClick={() => navigate(`/resources/${resource.id}`)}
        >
          Explore {resource.title}
        </Button>
      </CardFooter>
    </Card>
  );
};

const SecondaryResourceCard = ({ resource }: { resource: typeof secondaryResources[0] }) => {
  return (
    <Card className="transition-all hover:shadow-md hover:scale-[1.01] flex items-center p-4 space-x-4 bg-white/70 backdrop-blur-sm">
      <div className="rounded-full bg-gray-50 p-2 shadow-sm">
        {resource.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{resource.title}</h3>
        <p className="text-sm text-gray-500">{resource.description}</p>
      </div>
    </Card>
  );
};

const Resources = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Resources</h1>
          <p className="text-lg text-gray-600">
            Access high-quality study materials, notes, and planners for your academic journey
          </p>
        </div>
        
        {/* Featured Resources Section with Glass Morphism Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Brain className="mr-2 h-5 w-5 text-education-600" />
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
        
        {/* Additional Resources Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Bookmark className="mr-2 h-5 w-5 text-education-600" />
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryResources.map(resource => (
              <SecondaryResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
        
        {/* Recently Viewed Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <BookMarked className="mr-2 h-5 w-5 text-education-600" />
            Recently Viewed
          </h2>
          <div className="grid place-content-center p-10 rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <div className="text-center max-w-md">
              <p className="text-gray-600 mb-4">
                Your recently viewed resources will appear here once you start exploring
              </p>
              <Button variant="outline" className="border-education-200 text-education-700 hover:bg-education-50">
                Start Exploring
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Resources;
