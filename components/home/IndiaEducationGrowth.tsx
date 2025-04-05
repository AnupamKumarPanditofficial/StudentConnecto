
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, Trophy, Users, GraduationCap, TrendingUp } from 'lucide-react';

const educationData = [
  { year: '2018', literacy: 74, enrollment: 68, digitalAdoption: 30, skillDevelopment: 40 },
  { year: '2019', literacy: 76, enrollment: 72, digitalAdoption: 38, skillDevelopment: 45 },
  { year: '2020', literacy: 78, enrollment: 75, digitalAdoption: 52, skillDevelopment: 50 },
  { year: '2021', literacy: 80, enrollment: 79, digitalAdoption: 65, skillDevelopment: 58 },
  { year: '2022', literacy: 82, enrollment: 84, digitalAdoption: 76, skillDevelopment: 68 },
  { year: '2023', literacy: 85, enrollment: 89, digitalAdoption: 85, skillDevelopment: 78 }
];

const statCards = [
  {
    title: 'Literacy Rate',
    value: '85%',
    change: '+11%',
    description: 'Increased from 74% in 2018',
    icon: <BookOpen className="h-6 w-6 text-education-700" />
  },
  {
    title: 'Gross Enrollment',
    value: '89%',
    change: '+21%',
    description: 'In higher education since 2018',
    icon: <Users className="h-6 w-6 text-education-600" />
  },
  {
    title: 'Digital Adoption',
    value: '85%',
    change: '+55%',
    description: 'In educational institutions',
    icon: <TrendingUp className="h-6 w-6 text-education-500" />
  },
  {
    title: 'Skill Development',
    value: '78%',
    change: '+38%',
    description: 'Employable graduates increase',
    icon: <GraduationCap className="h-6 w-6 text-education-800" />
  }
];

const IndiaEducationGrowth = () => {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">India's Educational Growth</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how India is rapidly transforming its educational landscape and emerging as a global education powerhouse
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-education-50 rounded-lg">{card.icon}</div>
                <span className="text-green-500 font-semibold text-sm">{card.change}</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800">{card.title}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold text-education-600">{card.value}</span>
              </div>
              <p className="text-gray-500 mt-2 text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Education Metrics Growth (2018-2023)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={educationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="literacy" stroke="#0369a1" activeDot={{ r: 8 }} name="Literacy Rate %" />
                <Line type="monotone" dataKey="enrollment" stroke="#0284c7" name="Enrollment %" />
                <Line type="monotone" dataKey="digitalAdoption" stroke="#0ea5e9" name="Digital Adoption %" />
                <Line type="monotone" dataKey="skillDevelopment" stroke="#38bdf8" name="Skill Development %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Source: Ministry of Education, India (2023) | National Education Survey
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-education-700 mb-4 inline-flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
            India's Educational Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-lg text-gray-800 mb-2">3rd Largest</h4>
              <p className="text-gray-600">Higher education system in the world with 1000+ universities</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-lg text-gray-800 mb-2">10 Million+</h4>
              <p className="text-gray-600">Students graduate annually from Indian institutions</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-lg text-gray-800 mb-2">Global Recognition</h4>
              <p className="text-gray-600">Indian institutions rising in global rankings every year</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndiaEducationGrowth;
