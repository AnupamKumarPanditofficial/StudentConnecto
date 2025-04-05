
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, Heart, MessageCircle, Share2, 
  Calendar, Tag, ChevronRight, Bookmark, Clock, User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock blog data
const mockBlogs = [
  {
    id: 'b1',
    title: 'How to Ace Your Math Exams: Effective Study Techniques',
    summary: 'Discover the most effective techniques to prepare for and excel in mathematics examinations at all levels.',
    content: `
      <p>Mathematics can be a challenging subject for many students, but with the right approach, anyone can improve their performance in math exams.</p>
      
      <h2>1. Understand Concepts, Don't Just Memorize</h2>
      <p>The key to success in mathematics is understanding the underlying concepts rather than memorizing formulas. When you understand why a formula works, you can apply it to a variety of problems.</p>
      
      <h2>2. Practice Regularly</h2>
      <p>Mathematics requires consistent practice. Set aside time each day to solve problems, even if it's just for 30 minutes.</p>
      
      <h2>3. Start with Basic Problems</h2>
      <p>Before attempting complex problems, make sure you're comfortable with the basics. Build a strong foundation before moving on to more advanced topics.</p>
      
      <h2>4. Review Mistakes</h2>
      <p>When you make mistakes, don't just move on. Take time to understand where you went wrong and how to correct it.</p>
      
      <h2>5. Use Multiple Resources</h2>
      <p>Don't rely on a single textbook. Use online resources, video tutorials, and practice papers to get different perspectives on the same topic.</p>
    `,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    author: 'Dr. Sarah Johnson',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
    date: 'May 15, 2023',
    readTime: '8 min read',
    tags: ['Mathematics', 'Study Tips', 'Exams'],
    likes: 342,
    comments: 28,
    liked: false
  },
  {
    id: 'b2',
    title: 'The Science of Effective Note-Taking: Boost Your Learning Retention',
    summary: 'Learn scientifically-proven techniques to take better notes and significantly improve your ability to retain information.',
    content: `
      <p>Note-taking is an essential skill for students, but many don't realize there's a science behind effective note-taking strategies.</p>
      
      <h2>The Cornell Method</h2>
      <p>Developed at Cornell University, this system divides your page into three sections: a narrow left column for cues, a wide right column for notes, and a bottom section for summaries.</p>
      
      <h2>Mind Mapping</h2>
      <p>This visual technique helps connect ideas and concepts. Start with a central idea and branch out with related points, creating a web of information.</p>
      
      <h2>The Outline Method</h2>
      <p>This traditional approach uses headings, subheadings, and bullet points to organize information hierarchically.</p>
      
      <h2>Digital vs. Handwritten Notes</h2>
      <p>Research suggests that handwriting notes leads to better conceptual understanding, while digital notes are better for capturing information quickly.</p>
      
      <h2>Review and Revise</h2>
      <p>No matter which method you choose, regular review of your notes is crucial for long-term retention.</p>
    `,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    author: 'Prof. Michael Chen',
    authorAvatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
    date: 'June 3, 2023',
    readTime: '6 min read',
    tags: ['Study Skills', 'Note-Taking', 'Learning'],
    likes: 215,
    comments: 41,
    liked: false
  },
  {
    id: 'b3',
    title: 'Preparing for Competitive Exams: A Comprehensive Guide',
    summary: 'A step-by-step approach to preparing for competitive examinations like JEE, NEET, UPSC, and more.',
    content: `
      <p>Competitive exams require a different approach compared to regular academic assessments. This guide provides a roadmap for effective preparation.</p>
      
      <h2>Understand the Exam Pattern</h2>
      <p>Before you begin preparation, thoroughly understand the exam pattern, syllabus, marking scheme, and time constraints.</p>
      
      <h2>Create a Study Schedule</h2>
      <p>Develop a realistic timetable that balances all subjects and topics based on your strengths and weaknesses.</p>
      
      <h2>Quality Study Material</h2>
      <p>Choose standard textbooks and reliable study materials. Avoid studying from too many sources as it can lead to confusion.</p>
      
      <h2>Regular Mock Tests</h2>
      <p>Take mock tests under exam-like conditions to build stamina and improve time management skills.</p>
      
      <h2>Revision Strategy</h2>
      <p>Allocate sufficient time for revision. Create concise notes for quick review during the final phase of preparation.</p>
      
      <h2>Physical and Mental Well-being</h2>
      <p>Don't neglect your health. Regular exercise, proper nutrition, and adequate sleep are essential for optimal cognitive function.</p>
    `,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    author: 'Rajesh Verma',
    authorAvatar: 'https://ui-avatars.com/api/?name=Rajesh+Verma&background=random',
    date: 'July 12, 2023',
    readTime: '10 min read',
    tags: ['Competitive Exams', 'JEE', 'NEET', 'UPSC'],
    likes: 478,
    comments: 52,
    liked: false
  }
];

// Blog Card Component
const BlogCard = ({ blog, onRead }: { blog: typeof mockBlogs[0], onRead: () => void }) => {
  const [isLiked, setIsLiked] = useState(blog.liked);
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onRead}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 m-3">
          <div className="bg-white rounded-full p-1 shadow-md">
            <Bookmark className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{blog.date}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{blog.readTime}</span>
          </div>
        </div>
        
        <CardTitle className="line-clamp-2 text-xl hover:text-blue-600 transition-colors">
          {blog.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 line-clamp-2 mb-3">{blog.summary}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs font-medium flex items-center"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={blog.authorAvatar} />
              <AvatarFallback>{blog.author[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{blog.author}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
              onClick={handleLike}
            >
              {isLiked ? (
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              <span className="ml-1 text-xs">{isLiked ? blog.likes + 1 : blog.likes}</span>
            </button>
            
            <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="ml-1 text-xs">{blog.comments}</span>
            </button>
            
            <button className="flex items-center text-gray-500 hover:text-green-500 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Blog Detail Component
const BlogDetail = ({ blog, onBack }: { blog: typeof mockBlogs[0], onBack: () => void }) => {
  const [isLiked, setIsLiked] = useState(blog.liked);
  const [comment, setComment] = useState('');
  const { toast } = useToast();
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const handleComment = () => {
    if (!comment.trim()) return;
    
    toast({
      title: "Comment Posted",
      description: "This would be saved to the database in the full version",
    });
    
    setComment('');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        &larr; Back to all blogs
      </Button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={blog.authorAvatar} />
              <AvatarFallback>{blog.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{blog.author}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{blog.date}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={handleLike}>
              {isLiked ? <Heart className="h-4 w-4 mr-1 text-red-500 fill-current" /> : <Heart className="h-4 w-4 mr-1" />}
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden mb-6 h-80">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div 
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm font-medium flex items-center"
            >
              <Tag className="h-4 w-4 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="border-t border-b py-6 my-6">
          <h3 className="text-xl font-semibold mb-4">Comments ({blog.comments})</h3>
          
          <div className="flex items-start mb-6">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="https://ui-avatars.com/api/?name=You&background=random" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input 
                placeholder="Add a comment..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-2"
              />
              <Button 
                size="sm"
                onClick={handleComment}
                disabled={!comment.trim()}
              >
                Post Comment
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="https://ui-avatars.com/api/?name=John+Doe&background=random" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-700">This article was incredibly helpful for my exam preparation. Thank you!</p>
                </div>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>2 days ago</span>
                  <span className="mx-2">•</span>
                  <button className="hover:text-gray-700">Reply</button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="https://ui-avatars.com/api/?name=Priya+S&background=random" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="font-medium">Priya S</p>
                  <p className="text-sm text-gray-700">I've been using these techniques for the past month and my grades have improved significantly!</p>
                </div>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>5 days ago</span>
                  <span className="mx-2">•</span>
                  <button className="hover:text-gray-700">Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Blog Component
const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<typeof mockBlogs[0] | null>(null);
  const { toast } = useToast();
  
  const filteredBlogs = mockBlogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {!selectedBlog ? (
          <>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
                <p className="text-lg text-gray-600">
                  Read articles on education, learning strategies, and more
                </p>
              </div>
              
              <div className="relative mt-4 md:mt-0 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search blogs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map(blog => (
                  <BlogCard 
                    key={blog.id} 
                    blog={blog} 
                    onRead={() => setSelectedBlog(blog)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No blogs found matching your search criteria.</p>
                <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
              </div>
            )}
          </>
        ) : (
          <BlogDetail 
            blog={selectedBlog} 
            onBack={() => setSelectedBlog(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Blog;
