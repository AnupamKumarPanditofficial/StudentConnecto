
import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DeveloperSection = () => {
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Meet the Developer</h2>
          <div className="w-20 h-1 bg-education-500 mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 items-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-education-100 shadow-lg">
                <Avatar className="w-full h-full">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Developer Avatar" className="object-cover" />
                  <AvatarFallback className="text-4xl">JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-education-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
                <code className="text-sm font-bold">{"</>"}</code>
              </div>
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">John Developer</h3>
              <p className="text-gray-500 font-medium mb-1">Full Stack Developer & Designer</p>
              <p className="text-gray-600 mb-4 italic">"Building the future of education, one line of code at a time."</p>
              
              <p className="text-gray-700 mb-6">
                John is a passionate developer with expertise in React, TypeScript, and UI/UX design. 
                With over 5 years of experience building educational platforms, he's committed to 
                creating tools that make learning more accessible and engaging for students worldwide.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <motion.a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </motion.a>
                
                <motion.a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-[#0077B5] text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </motion.a>
                
                <motion.a 
                  href="mailto:johndeveloper@example.com" 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-education-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Mail size={16} />
                  <span>Contact Me</span>
                </motion.a>
                
                <motion.a 
                  href="https://www.example.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-full text-sm font-medium"
                >
                  <Globe size={16} />
                  <span>Portfolio</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperSection;
