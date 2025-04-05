
import React, { useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, Award, Calendar } from 'lucide-react';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const tutors = [
  { name: "Dr. Sarah Johnson", subject: "Physics", rating: 4.9, image: "https://randomuser.me/api/portraits/women/32.jpg" },
  { name: "Prof. Michael Chen", subject: "Mathematics", rating: 4.8, image: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Dr. Emily Rodriguez", subject: "Chemistry", rating: 4.7, image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Prof. David Kim", subject: "Computer Science", rating: 4.9, image: "https://randomuser.me/api/portraits/men/22.jpg" }
];

const students = [
  { name: "Aarav Patel", skills: "Python, Data Science", earned: 12500, image: "https://randomuser.me/api/portraits/men/75.jpg" },
  { name: "Zara Khan", skills: "Web Development, UI/UX", earned: 15000, image: "https://randomuser.me/api/portraits/women/90.jpg" },
  { name: "Rohan Singh", skills: "Mobile App Development", earned: 18000, image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Ananya Sharma", skills: "Content Writing, SEO", earned: 14000, image: "https://randomuser.me/api/portraits/women/45.jpg" }
];

const events = [
  { name: "National Science Olympiad", date: "November 15, 2023", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952" },
  { name: "Coding Hackathon 2023", date: "December 5, 2023", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b" },
  { name: "Career Expo 2023", date: "January 10, 2024", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87" },
  { name: "Education Technology Summit", date: "February 20, 2024", image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b" }
];

const TutorCard = ({ tutor }: { tutor: typeof tutors[0] }) => (
  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-education-300">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-education-100">
            <img src={tutor.image} alt={tutor.name} className="object-cover" />
          </Avatar>
          <div>
            <CardTitle className="text-lg">{tutor.name}</CardTitle>
            <p className="text-sm text-gray-500">{tutor.subject}</p>
          </div>
        </div>
        <div className="bg-education-50 text-education-700 text-xs px-2 py-1 rounded-full font-medium">
          Popular
        </div>
      </div>
    </CardHeader>
    <CardContent className="py-4">
      <div className="flex items-center mt-2">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
        <span className="text-sm font-medium">{tutor.rating}</span>
        <span className="text-xs text-gray-500 ml-1">(120+ reviews)</span>
      </div>
    </CardContent>
    <CardFooter className="pt-2 pb-4">
      <Button variant="outline" className="w-full text-education-700 border-education-200 hover:bg-education-50 hover:border-education-400">
        View Profile
      </Button>
    </CardFooter>
  </Card>
);

const StudentCard = ({ student }: { student: typeof students[0] }) => (
  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-education-300">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14 border-2 border-education-100">
          <img src={student.image} alt={student.name} className="object-cover" />
        </Avatar>
        <div>
          <CardTitle className="text-lg">{student.name}</CardTitle>
          <p className="text-sm text-gray-500">{student.skills}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="py-4">
      <div className="flex items-center mt-2">
        <Award className="h-4 w-4 text-green-500 mr-1" />
        <span className="text-sm font-medium">₹{student.earned}</span>
        <span className="text-xs text-gray-500 ml-1">earned so far</span>
      </div>
    </CardContent>
    <CardFooter className="pt-2 pb-4">
      <Button variant="outline" className="w-full text-education-700 border-education-200 hover:bg-education-50 hover:border-education-400">
        Connect
      </Button>
    </CardFooter>
  </Card>
);

const EventCard = ({ event }: { event: typeof events[0] }) => (
  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-education-300 bg-gradient-to-br from-education-50 to-white">
    <CardHeader className="pb-2">
      <div className="aspect-video rounded-md overflow-hidden mb-2">
        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
      </div>
      <CardTitle className="text-lg">{event.name}</CardTitle>
    </CardHeader>
    <CardContent className="py-3">
      <div className="flex items-center mt-2">
        <Calendar className="h-4 w-4 text-education-600 mr-1" />
        <span className="text-sm text-gray-600">{event.date}</span>
      </div>
    </CardContent>
    <CardFooter className="pt-2 pb-4">
      <Button className="w-full bg-education-600 hover:bg-education-700 transition-colors">
        Register Now
      </Button>
    </CardFooter>
  </Card>
);

const SlidingCardsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })

  useEffect(() => {
    if (emblaApi) {
      // Auto-slide every 5 seconds
      const intervalId = setInterval(() => {
        emblaApi.scrollNext()
      }, 5000)
      
      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId)
    }
  }, [emblaApi])

  return (
    <div className="py-24 md:py-32">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
        Discover, Connect, and Learn
      </h2>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {/* Tutors Slide */}
          <div className="flex-[0_0_100%] min-w-0 pl-4 pr-4">
            <h3 className="text-xl font-semibold mb-8 text-center text-education-700">Top Tutors This Week</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {tutors.map((tutor, index) => (
                <TutorCard key={index} tutor={tutor} />
              ))}
            </div>
          </div>
          
          {/* Students Slide */}
          <div className="flex-[0_0_100%] min-w-0 pl-4 pr-4">
            <h3 className="text-xl font-semibold mb-8 text-center text-education-700">Top Earning Students</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {students.map((student, index) => (
                <StudentCard key={index} student={student} />
              ))}
            </div>
          </div>
          
          {/* Events Slide */}
          <div className="flex-[0_0_100%] min-w-0 pl-4 pr-4">
            <h3 className="text-xl font-semibold mb-8 text-center text-education-700">Upcoming Events</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {events.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingCardsCarousel;
