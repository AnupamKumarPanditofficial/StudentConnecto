
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedHeader = () => {
  const letters = "StudentConnect".split("");
  
  return (
    <div className="flex justify-center items-center my-4">
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="text-3xl md:text-4xl font-bold text-education-700"
          initial={{ y: 0 }}
          animate={{ 
            y: [0, -10, 0],
            transition: { 
              repeat: Infinity, 
              duration: 2,
              delay: index * 0.1,
              ease: "easeInOut" 
            }
          }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedHeader;
