
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    // Create particles on component mount
    const particlesArray: Particle[] = [];
    const colors = [
      'rgba(43, 119, 252, 0.3)',
      'rgba(43, 180, 252, 0.2)',
      'rgba(17, 189, 68, 0.2)',
      'rgba(252, 196, 43, 0.15)'
    ];
    
    for (let i = 0; i < 20; i++) {
      particlesArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 50 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 40 + 20,
        delay: Math.random() * -40
      });
    }
    
    setParticles(particlesArray);
  }, []);

  return (
    <div className="particles-background">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle animate-particle-move"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
