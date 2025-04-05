import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, Heart, MessageCircle, 
  Share2, ChevronDown, ChevronUp, Upload, Play, Pause, Bookmark
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock video data
const mockVideos = [
  {
    id: 'v1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b',
    title: 'Mastering Calculus: Quick Tips',
    creator: 'MathGenius',
    creatorAvatar: 'https://ui-avatars.com/api/?name=Math+Genius&background=random',
    likes: 1243,
    comments: 89,
    category: 'Education',
    saved: false,
    liked: false,
    description: 'Learn how to solve complex calculus problems with these simple techniques.'
  },
  {
    id: 'v2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    title: 'Coding in Python: Basics',
    creator: 'CodeCrafter',
    creatorAvatar: 'https://ui-avatars.com/api/?name=Code+Crafter&background=random',
    likes: 956,
    comments: 123,
    category: 'Coding',
    saved: false,
    liked: false,
    description: 'Start your coding journey with these Python fundamentals.'
  },
  {
    id: 'v3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    title: 'Stay Motivated During Exams',
    creator: 'StudyCoach',
    creatorAvatar: 'https://ui-avatars.com/api/?name=Study+Coach&background=random',
    likes: 2456,
    comments: 145,
    category: 'Motivation',
    saved: false,
    liked: false,
    description: 'Tips to stay motivated and focused during exam preparation.'
  },
  {
    id: 'v4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
    title: 'Current Affairs: May 2023',
    creator: 'NewsDigest',
    creatorAvatar: 'https://ui-avatars.com/api/?name=News+Digest&background=random',
    likes: 785,
    comments: 56,
    category: 'Current Affairs',
    saved: false,
    liked: false,
    description: 'Quick update on important global events from May 2023.'
  }
];

// Categories for shorts
const categories = [
  'All', 'Education', 'Coding', 'Motivation', 'Current Affairs', 'Games', 'Art'
];

// Video Player Component
const VideoPlayer = ({ 
  video, 
  isActive, 
  onLike, 
  onSave, 
  onComment 
}: { 
  video: typeof mockVideos[0], 
  isActive: boolean,
  onLike: () => void,
  onSave: () => void,
  onComment: () => void
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log("Video play failed:", e));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log("Video play failed:", e));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Video Element */}
      <div className="relative flex-1 bg-black" onClick={togglePlay}>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Play className="h-16 w-16 text-white opacity-70" />
          </div>
        )}
        <video 
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
        />
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div 
            className="h-full bg-red-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
        <h3 className="text-lg font-semibold">{video.title}</h3>
        <p className="text-sm opacity-90">{video.description}</p>
        
        <div className="flex items-center mt-2">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={video.creatorAvatar} />
            <AvatarFallback>{video.creator[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{video.creator}</span>
        </div>
      </div>
      
      {/* Engagement buttons */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white rounded-full bg-black/30 h-12 w-12"
            onClick={onLike}
          >
            {video.liked ? 
              <Heart className="h-6 w-6 text-red-500 fill-current" /> : 
              <Heart className="h-6 w-6" />
            }
          </Button>
          <span className="text-white text-xs mt-1">{video.liked ? video.likes + 1 : video.likes}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white rounded-full bg-black/30 h-12 w-12"
            onClick={onComment}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1">{video.comments}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white rounded-full bg-black/30 h-12 w-12"
            onClick={onSave}
          >
            {video.saved ? 
              <Bookmark className="h-6 w-6 text-yellow-500 fill-current" /> : 
              <Bookmark className="h-6 w-6" />
            }
          </Button>
          <span className="text-white text-xs mt-1">Save</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white rounded-full bg-black/30 h-12 w-12"
          >
            <Share2 className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs mt-1">Share</span>
        </div>
      </div>
    </div>
  );
};

// Main Shorts Component
const Shorts = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [timeLimit, setTimeLimit] = useState(15); // minutes
  const [remainingTime, setRemainingTime] = useState(timeLimit * 60); // seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState(mockVideos);
  const [showSettings, setShowSettings] = useState(true);
  const { toast } = useToast();
  
  // Filter videos by category
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredVideos(mockVideos);
    } else {
      setFilteredVideos(mockVideos.filter(video => video.category === activeCategory));
    }
    setCurrentVideoIndex(0);
  }, [activeCategory]);
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && isTimerActive) {
      toast({
        title: "Time's up!",
        description: "Your shorts watching session has ended.",
      });
      setIsTimerActive(false);
      // In a real app, this would redirect the user
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, remainingTime, toast]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const startWatching = () => {
    setIsTimerActive(true);
    setShowSettings(false);
  };
  
  const handleVideoAction = (action: 'like' | 'save' | 'comment', videoId: string) => {
    if (action === 'like') {
      setFilteredVideos(videos => 
        videos.map(v => v.id === videoId ? {...v, liked: !v.liked} : v)
      );
    } else if (action === 'save') {
      setFilteredVideos(videos => 
        videos.map(v => v.id === videoId ? {...v, saved: !v.saved} : v)
      );
    } else if (action === 'comment') {
      toast({
        title: "Comments",
        description: "Comment functionality would be implemented in the full version",
      });
    }
  };
  
  const scrollToNextVideo = () => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };
  
  const scrollToPrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };
  
  const uploadVideo = () => {
    toast({
      title: "Upload Video",
      description: "This would connect to Google Cloud Storage in the full version",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shorts</h1>
          <p className="text-lg text-gray-600">
            Watch short educational videos across various categories
          </p>
        </div>
        
        {showSettings ? (
          <Card className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Your Preferences</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Select Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className={activeCategory === category ? "bg-blue-500" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Set Time Limit: {timeLimit} minutes</h3>
              <Slider
                value={[timeLimit]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => setTimeLimit(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5m</span>
                <span>30m</span>
                <span>60m</span>
              </div>
            </div>
            
            <Button 
              onClick={startWatching} 
              className="w-full"
            >
              Start Watching
            </Button>
          </Card>
        ) : (
          <div className="relative h-[70vh] max-w-md mx-auto">
            {/* Timer Display */}
            <div className="absolute top-4 left-4 z-20 bg-black/50 text-white rounded-full px-3 py-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatTime(remainingTime)}</span>
            </div>
            
            {/* Upload Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 z-20 bg-black/50 text-white rounded-full"
              onClick={uploadVideo}
            >
              <Upload className="h-5 w-5" />
            </Button>
            
            {/* Video Container */}
            <div className="relative h-full w-full overflow-hidden rounded-xl shadow-xl">
              {filteredVideos.length > 0 ? (
                <VideoPlayer 
                  video={filteredVideos[currentVideoIndex]} 
                  isActive={true}
                  onLike={() => handleVideoAction('like', filteredVideos[currentVideoIndex].id)}
                  onSave={() => handleVideoAction('save', filteredVideos[currentVideoIndex].id)}
                  onComment={() => handleVideoAction('comment', filteredVideos[currentVideoIndex].id)}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">No videos found in this category</p>
                </div>
              )}
              
              {/* Navigation Arrows */}
              {currentVideoIndex > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 left-4 z-20 bg-black/30 text-white rounded-full transform -translate-y-1/2"
                  onClick={scrollToPrevVideo}
                >
                  <ChevronUp className="h-6 w-6" />
                </Button>
              )}
              
              {currentVideoIndex < filteredVideos.length - 1 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute bottom-24 left-1/2 z-20 bg-black/30 text-white rounded-full transform -translate-x-1/2"
                  onClick={scrollToNextVideo}
                >
                  <ChevronDown className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shorts;
