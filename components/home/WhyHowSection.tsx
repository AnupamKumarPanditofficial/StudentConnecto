
import React from 'react';
import { motion } from 'framer-motion';

const WhyHowSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Revolutionizing Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're reimagining how students learn, connect, and grow with a platform designed for today's educational challenges.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-education-100 flex items-center justify-center text-education-700 font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Personalized Learning Paths</h3>
                <p className="text-gray-600">
                  Our AI-powered system creates customized learning journeys based on your unique needs, strengths, and goals.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-education-100 flex items-center justify-center text-education-700 font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Collaborative Community</h3>
                <p className="text-gray-600">
                  Connect with peers and mentors who share your passion for learning and growth.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-education-100 flex items-center justify-center text-education-700 font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Real-World Application</h3>
                <p className="text-gray-600">
                  Learn by solving actual problems and applying knowledge directly to practical challenges.
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-br from-education-600 to-education-700 rounded-lg p-1"
          >
            <div className="bg-white rounded-lg p-6 h-full">
              <h3 className="text-2xl font-bold mb-6 text-education-700">How It Works</h3>
              
              <ol className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-education-100 flex items-center justify-center text-education-700 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Sign Up</h4>
                    <p className="text-gray-600">Create your profile and tell us about your learning goals</p>
                  </div>
                </li>
                
                <li className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-education-100 flex items-center justify-center text-education-700 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Explore</h4>
                    <p className="text-gray-600">Discover tutors, resources, and learning opportunities</p>
                  </div>
                </li>
                
                <li className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-education-100 flex items-center justify-center text-education-700 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Connect</h4>
                    <p className="text-gray-600">Engage with tutors and peers who can support your learning journey</p>
                  </div>
                </li>
                
                <li className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-education-100 flex items-center justify-center text-education-700 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Learn & Grow</h4>
                    <p className="text-gray-600">Expand your knowledge and track your progress</p>
                  </div>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyHowSection;
