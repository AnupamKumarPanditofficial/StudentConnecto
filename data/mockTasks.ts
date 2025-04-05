
import { Task, User } from "@/types/task";

export const currentUser: User = {
  id: "user1",
  name: "John Doe",
  email: "john@example.com",
  role: "user", // Changed from "student" to "user" to match type definition
  skills: ["Web Development", "UI Design", "JavaScript", "React"]
};

export const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Create a Landing Page",
    description: "Design and develop a responsive landing page for an educational platform. The page should have a modern design with animations and be responsive for all devices.",
    skills: ["Web Development", "UI Design", "HTML", "CSS", "JavaScript"],
    amount: 2500,
    lastDate: "2023-08-15",
    createdBy: "user2",
    createdAt: "2023-07-25",
    status: "open",
    applicants: [
      {
        id: "app1",
        userId: "user3",
        name: "Alice Johnson",
        appliedAt: "2023-07-26",
        status: "pending"
      },
      {
        id: "app2",
        userId: "user4",
        name: "Bob Smith",
        appliedAt: "2023-07-27",
        status: "accepted"
      }
    ]
  },
  {
    id: "task2",
    title: "Develop a Calculator App",
    description: "Create a fully functional calculator app with basic and scientific operations. The app should have a clean UI and be developed using React.",
    skills: ["React", "JavaScript", "UI Design"],
    amount: 1800,
    lastDate: "2023-08-10",
    createdBy: "user5",
    createdAt: "2023-07-22",
    status: "open",
    applicants: []
  },
  {
    id: "task3",
    title: "Content Writing for Science Blog",
    description: "Write 5 articles on various science topics for a high school science blog. Each article should be 800-1000 words with proper citations.",
    skills: ["Content Writing", "Science", "Research"],
    amount: 1200,
    lastDate: "2023-08-12",
    createdBy: "user6",
    createdAt: "2023-07-23",
    status: "open",
    applicants: [
      {
        id: "app3",
        userId: "user1",
        name: "John Doe",
        appliedAt: "2023-07-24",
        status: "pending"
      }
    ]
  },
  {
    id: "task4",
    title: "Math Problem Solutions",
    description: "Create step-by-step solutions for 20 advanced calculus problems for a study guide. Solutions should be clear and easy to understand.",
    skills: ["Mathematics", "Calculus", "Teaching"],
    amount: 1500,
    lastDate: "2023-08-05",
    createdBy: "user7",
    createdAt: "2023-07-20",
    status: "open",
    applicants: []
  },
  {
    id: "task5",
    title: "Create Educational Illustrations",
    description: "Design 10 illustrations for a biology textbook covering cell structure and function. Illustrations should be detailed and scientifically accurate.",
    skills: ["Illustration", "Biology", "Design"],
    amount: 3000,
    lastDate: "2023-08-20",
    createdBy: "user1",
    createdAt: "2023-07-28",
    status: "open",
    applicants: [
      {
        id: "app4",
        userId: "user8",
        name: "Emily Chen",
        appliedAt: "2023-07-29",
        status: "pending"
      },
      {
        id: "app5",
        userId: "user9",
        name: "David Kim",
        appliedAt: "2023-07-30",
        status: "pending"
      }
    ]
  }
];

export const getMyCreatedTasks = (): Task[] => {
  return mockTasks.filter(task => task.createdBy === currentUser.id);
};

export const getMyAppliedTasks = (): Task[] => {
  return mockTasks.filter(task => 
    task.applicants.some(applicant => applicant.userId === currentUser.id)
  );
};

export const getAllSkills = (): string[] => {
  const skillsSet = new Set<string>();
  
  mockTasks.forEach(task => {
    task.skills.forEach(skill => skillsSet.add(skill));
  });
  
  return Array.from(skillsSet);
};
