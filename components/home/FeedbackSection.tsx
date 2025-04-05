
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { isAuthenticated } from '@/config/firebase';

const testimonials = [
  {
    id: 1,
    name: "Aditi Sharma",
    role: "Computer Science Student",
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
    content: "StudentConnect has transformed my learning experience. I found the perfect tutor for my programming classes, and my grades have improved significantly!",
    rating: 5
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Mathematics Tutor",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "As a tutor, this platform has connected me with wonderful students who are eager to learn. The scheduling system and payment processing are seamless.",
    rating: 5
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "High School Student",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content: "The resources section has been invaluable for my exam preparation. The study materials are well-organized and easy to understand.",
    rating: 4
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Physics Student",
    avatar: "https://randomuser.me/api/portraits/men/82.jpg",
    content: "I appreciate the community aspect of StudentConnect. Being able to connect with peers facing similar challenges has made learning more enjoyable.",
    rating: 5
  },
  {
    id: 5,
    name: "Ananya Desai",
    role: "English Literature Student",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    content: "The tutors on this platform are not only knowledgeable but also excellent communicators. My understanding of complex literary concepts has improved tremendously.",
    rating: 4
  }
];

const FeedbackSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const { toast } = useToast();
  const isLoggedIn = isAuthenticated();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to submit your feedback",
        variant: "destructive"
      });
      return;
    }
    
    if (name && email && feedback && rating > 0) {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
        variant: "default"
      });
      
      // Reset form
      setName('');
      setEmail('');
      setFeedback('');
      setRating(0);
    } else {
      toast({
        title: "Incomplete Form",
        description: "Please fill all fields and provide a rating",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from students and tutors who have experienced the power of StudentConnect
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Testimonials Carousel */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
                    <Card className="bg-white border border-gray-100 shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-12 w-12 mr-4 border-2 border-education-100">
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                              className="rounded-full object-cover"
                            />
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        
                        <blockquote className="text-gray-600 italic">
                          "{testimonial.content}"
                        </blockquote>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <CarouselPrevious className="-left-4 md:-left-6" />
              <CarouselNext className="-right-4 md:-right-6" />
            </Carousel>
          </div>
          
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Share Your Feedback</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Feedback
                    </label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your experience with us"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Rating
                    </label>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-6 w-6 cursor-pointer ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          onClick={() => setRating(i + 1)}
                          onMouseEnter={() => setRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-education-600 hover:bg-education-700">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
