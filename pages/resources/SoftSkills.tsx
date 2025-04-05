
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Clock, Users, Brain, Presentation, Star, Target, LightbulbIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  videos: {
    title: string;
    duration: string;
    thumbnail: string;
  }[];
}

const SoftSkills = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const skillCategories: SkillCategory[] = [
    {
      id: "communication",
      title: "Communication Skills",
      description: "Master verbal, written, and presentation skills",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
      videos: [
        {
          title: "Effective Public Speaking Techniques",
          duration: "32:15",
          thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Writing Clear and Concise Emails",
          duration: "18:45",
          thumbnail: "https://images.unsplash.com/photo-1526378787940-576a539ba69d?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Active Listening for Better Understanding",
          duration: "24:10",
          thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=500&h=300",
        },
      ],
    },
    {
      id: "time-management",
      title: "Time Management",
      description: "Optimize productivity and achieve goals efficiently",
      icon: <Clock className="h-6 w-6" />,
      color: "from-amber-50 to-amber-100 border-amber-200 text-amber-700",
      videos: [
        {
          title: "Prioritization Techniques for Students",
          duration: "28:30",
          thumbnail: "https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Creating Effective Study Schedules",
          duration: "22:15",
          thumbnail: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Overcoming Procrastination",
          duration: "19:45",
          thumbnail: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?auto=format&fit=crop&q=80&w=500&h=300",
        },
      ],
    },
    {
      id: "team-work",
      title: "Teamwork & Collaboration",
      description: "Work effectively in groups and lead teams",
      icon: <Users className="h-6 w-6" />,
      color: "from-green-50 to-green-100 border-green-200 text-green-700",
      videos: [
        {
          title: "Building Trust in Academic Teams",
          duration: "26:50",
          thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Resolving Conflicts in Group Projects",
          duration: "31:20",
          thumbnail: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Effective Team Roles and Responsibilities",
          duration: "23:40",
          thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=500&h=300",
        },
      ],
    },
    {
      id: "critical-thinking",
      title: "Critical Thinking",
      description: "Analyze information and solve problems effectively",
      icon: <Brain className="h-6 w-6" />,
      color: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
      videos: [
        {
          title: "Analytical Thinking for Academic Success",
          duration: "29:15",
          thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Problem-Solving Frameworks",
          duration: "35:50",
          thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Making Informed Decisions",
          duration: "21:30",
          thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=500&h=300",
        },
      ],
    },
    {
      id: "presentation",
      title: "Presentation Skills",
      description: "Create and deliver impactful presentations",
      icon: <Presentation className="h-6 w-6" />,
      color: "from-red-50 to-red-100 border-red-200 text-red-700",
      videos: [
        {
          title: "Designing Effective Visual Aids",
          duration: "24:45",
          thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Captivating Your Audience",
          duration: "27:20",
          thumbnail: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Handling Q&A Sessions Confidently",
          duration: "19:10",
          thumbnail: "https://images.unsplash.com/photo-1557425529-b1ae9c141e7d?auto=format&fit=crop&q=80&w=500&h=300",
        },
      ],
    },
    {
      id: "leadership",
      title: "Leadership",
      description: "Develop essential leadership qualities and skills",
      icon: <Star className="h-6 w-6" />,
      color: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700",
      videos: [
        {
          title: "Inspiring and Motivating Others",
          duration: "33:15",
          thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Delegating Tasks Effectively",
          duration: "25:40",
          thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Building Your Leadership Presence",
          duration: "28:55",
          thumbnail: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=500&h=300",
        },
      ],
    },
    {
      id: "goal-setting",
      title: "Goal Setting",
      description: "Set and achieve meaningful personal and academic goals",
      icon: <Target className="h-6 w-6" />,
      color: "from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-700",
      videos: [
        {
          title: "SMART Goal Setting Framework",
          duration: "20:30",
          thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Creating an Actionable Study Plan",
          duration: "26:15",
          thumbnail: "https://images.unsplash.com/photo-1494599948593-3dafe8338d71?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Tracking Progress and Staying Motivated",
          duration: "23:50",
          thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500&h=300",
        },
      ],
    },
    {
      id: "creativity",
      title: "Creativity & Innovation",
      description: "Enhance creative thinking and innovative problem-solving",
      icon: <LightbulbIcon className="h-6 w-6" />,
      color: "from-pink-50 to-pink-100 border-pink-200 text-pink-700",
      videos: [
        {
          title: "Breaking Through Mental Blocks",
          duration: "22:40",
          thumbnail: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Design Thinking for Students",
          duration: "29:15",
          thumbnail: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&q=80&w=500&h=300",
        },
        {
          title: "Creative Approaches to Academic Challenges",
          duration: "25:30",
          thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=500&h=300",
        },
      ],
    },
  ];
  
  const handleWatchVideo = (categoryId: string, videoTitle: string) => {
    toast({
      title: "Video Player",
      description: `Now playing: ${videoTitle}`,
    });
  };
  
  const handleViewCategory = (categoryId: string) => {
    toast({
      title: "Category Selected",
      description: `Browsing ${skillCategories.find(cat => cat.id === categoryId)?.title}`,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Soft Skills Training</h1>
          <p className="text-lg text-gray-600">
            Enhance communication, leadership, time management, and more
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              <Card 
                className={`transition-all cursor-pointer hover:shadow-md bg-gradient-to-br ${category.color.split(' ')[0]} ${category.color.split(' ')[1]} border ${category.color.split(' ')[2]}`}
                onClick={() => handleViewCategory(category.id)}
              >
                <CardHeader>
                  <div className={`rounded-full w-12 h-12 flex items-center justify-center bg-white ${category.color.split(' ')[3]}`}>
                    {category.icon}
                  </div>
                  <CardTitle className="mt-2">{category.title}</CardTitle>
                  <CardDescription className="text-gray-700">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{category.videos.length} training videos</p>
                </CardContent>
              </Card>
              
              <div className="space-y-3">
                {category.videos.map((video, idx) => (
                  <Card key={idx} className="transition-all hover:shadow-md overflow-hidden">
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          className="bg-white text-gray-900 hover:bg-gray-100"
                          onClick={() => handleWatchVideo(category.id, video.title)}
                        >
                          <PlayIcon className="h-5 w-5 mr-2" />
                          Watch
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm truncate">{video.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

// Simple play icon for video thumbnails
const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "h-6 w-6"}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

export default SoftSkills;
