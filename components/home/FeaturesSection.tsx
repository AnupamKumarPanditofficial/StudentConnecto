
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, DollarSign, PenTool, Book, Video, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: "Get Tutors",
    description: "Connect with expert tutors for personalized learning experiences",
    icon: <Users className="h-10 w-10 text-education-600" />,
    link: "/tutors",
    gradient: "from-blue-50 to-indigo-50",
    buttonColor: "bg-blue-600 hover:bg-blue-700"
  },
  {
    title: "Earn Money",
    description: "Share your knowledge and skills to earn while you learn",
    icon: <DollarSign className="h-10 w-10 text-green-600" />,
    link: "/tasks",
    gradient: "from-green-50 to-emerald-50",
    buttonColor: "bg-green-600 hover:bg-green-700"
  },
  {
    title: "Upload Blogs",
    description: "Share your insights and experiences with our community",
    icon: <PenTool className="h-10 w-10 text-purple-600" />,
    link: "/blog",
    gradient: "from-purple-50 to-violet-50",
    buttonColor: "bg-purple-600 hover:bg-purple-700"
  },
  {
    title: "Access Resources",
    description: "Discover a treasure trove of educational materials",
    icon: <Book className="h-10 w-10 text-amber-600" />,
    link: "/resources",
    gradient: "from-amber-50 to-yellow-50",
    buttonColor: "bg-amber-600 hover:bg-amber-700"
  },
  {
    title: "Watch Shorts",
    description: "Learn quickly with our bite-sized educational videos",
    icon: <Video className="h-10 w-10 text-rose-600" />,
    link: "/shorts",
    gradient: "from-rose-50 to-pink-50",
    buttonColor: "bg-rose-600 hover:bg-rose-700"
  },
  {
    title: "Join Community",
    description: "Connect with like-minded students and educators",
    icon: <MessageSquare className="h-10 w-10 text-cyan-600" />,
    link: "/community",
    gradient: "from-cyan-50 to-sky-50",
    buttonColor: "bg-cyan-600 hover:bg-cyan-700"
  }
];

const FeaturesSection = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Platform Features
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card className={`h-full overflow-hidden bg-gradient-to-br ${feature.gradient} border-none`}>
                <CardHeader className="pt-8 pb-4">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                  <Link to={feature.link}>
                    <Button className={`${feature.buttonColor} text-white`}>
                      Click Here
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
