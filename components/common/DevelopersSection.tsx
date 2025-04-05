
import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const developers = [
  {
    name: "Anupam Kumar Pandit",
    role: "Full Stack Developer & Designer",
    bio: "Building innovative solutions with cutting-edge technologies and creative design principles.",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952", // Male developer image
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "anupam.pandit@example.com",
    website: "https://www.example.com",
    initials: "AKP"
  },
  {
    name: "Abhishek Tiwary",
    role: "Frontend Engineer",
    bio: "Crafting responsive and intuitive user interfaces with React and modern web technologies.",
    avatar: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b", // Male developer image
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "abhishek.tiwary@example.com",
    website: "https://www.example.com",
    initials: "AT"
  },
  {
    name: "Yuvraj Singh",
    role: "Backend Developer",
    bio: "Designing robust and scalable backend architectures with a focus on performance optimization.",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952", // Male developer image
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "yuvraj.singh@example.com",
    website: "https://www.example.com",
    initials: "YS"
  },
  {
    name: "Nishant Singh",
    role: "DevOps & Cloud Architect",
    bio: "Implementing innovative cloud solutions and streamlining development workflows.",
    avatar: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b", // Male developer image
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "nishant.singh@example.com",
    website: "https://www.example.com",
    initials: "NS"
  }
];

const DevelopersSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Meet Our Development Team</h2>
          <div className="w-20 h-1 bg-education-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            The talented individuals who brought StudentConnect to life, combining expertise in design, development, and education.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((developer, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <HoverCard>
                <HoverCardTrigger asChild>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col items-center text-center cursor-pointer"
                  >
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-education-100 shadow-lg">
                        <Avatar className="w-full h-full">
                          <AvatarImage src={developer.avatar} alt={developer.name} className="object-cover" />
                          <AvatarFallback className="text-xl">{developer.initials}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-education-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <code className="text-xs font-bold">{"</>"}</code>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{developer.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{developer.role}</p>
                    
                    <div className="flex space-x-3 mt-auto">
                      <a href={developer.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                        <Github size={18} />
                      </a>
                      <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                        <Linkedin size={18} />
                      </a>
                      <a href={`mailto:${developer.email}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                        <Mail size={18} />
                      </a>
                      <a href={developer.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                        <Globe size={18} />
                      </a>
                    </div>
                  </motion.div>
                </HoverCardTrigger>
                
                <HoverCardContent className="w-80 p-0 border-none shadow-xl">
                  <div className="bg-gradient-to-r from-education-600 to-education-700 p-4 rounded-t-md">
                    <h4 className="text-white font-bold">{developer.name}</h4>
                    <p className="text-education-100 text-sm">{developer.role}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 mb-3">{developer.bio}</p>
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <a href={developer.github} target="_blank" rel="noopener noreferrer" className="text-education-600 hover:text-education-800 transition-colors text-sm font-medium">
                        View GitHub Profile
                      </a>
                      <a href={`mailto:${developer.email}`} className="text-education-600 hover:text-education-800 transition-colors text-sm font-medium">
                        Contact
                      </a>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection;
